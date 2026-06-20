import React, { useEffect, useMemo, useRef, useState } from "react";
import Select, { } from "react-select"
import { Button, Flex, Text, Box, Grid, Heading, TextField, TextArea, Skeleton } from "@radix-ui/themes";
import { CityService, ProvinceService, SaleService, type CityResponse, type ProvinceRequest, type ProvinceResponse, type SaleLocationRequest, type SaleResponse } from "../../../api/generated";
import { Autocomplete, GoogleMap, InfoWindow, Marker, StreetViewPanorama } from "@react-google-maps/api";
import { Modal } from "../../../components/Modal";

type LocationGoogleMapModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: SaleResponse;
  container?: HTMLElement | null;
  onSave: (location: SaleLocationRequest) => Promise<void> | void;
};

type Option = { value: string; label: string };

export const LocationGoogleMapModal: React.FC<LocationGoogleMapModalProps> = ({
  open,
  onOpenChange,
  sale,
  onSave,
}) => {
  
  

  const [zoom, setZoom] = useState(17);
  const [markerLocation, setMarkerLocation] = useState({ lat: sale.latitude, lng: sale.longitude });
  const [showMarkerInfo, setShowMarkerInfo] = useState(false);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  const [number, setNumber] = useState(sale.number);
  const [businessName, setBusinessName] = useState(sale.businessName);
  const [phone, setPhone] = useState(sale.phone);
  const [address, setAddress] = useState(sale.address);
  const [observation, setObservation] = useState(sale.observation);

  const [selectedOptionProvince, setSelectedOptionProvince] = useState<Option|null>();
  const [selectedOptionCity, setSelectedOptionCity] = useState<Option|null>();

  const [listProvince, setListProvince] = useState<ProvinceResponse[]>([]);
  const [listCity, setListCity] = useState<CityResponse[]>([]);

  const [optionProvince, setOptionProvince] = useState<Option[]>([]);
  const [optionCity, setOptionCity] = useState<Option[]>([]);

  const city = useMemo(() => { return listCity.find(p => p.id.toString() === selectedOptionCity?.value) ?? null; }, [selectedOptionCity, listCity]);
  const province = useMemo(() => { return listProvince.find(x => x.id.toString() === selectedOptionProvince?.value); }, [selectedOptionProvince, listProvince]);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [searchAddress, setSearchAddress] = useState("");

  const SaveRoadMap = () => {
      onSave({saleId: sale.id, latitude: markerLocation.lat, longitude: markerLocation.lng, address, observation, city: (city as CityResponse)});
  };

  useEffect(()=> {

      ProvinceService.provinceGetAll().then((data)=> { 
          setListProvince(data); 
          setOptionProvince(data.map(x => { return { value: x.id.toString(), label: x.code + "-" + x.name }; })); 
  
          if(sale?.city?.province)
              setSelectedOptionProvince({value: sale.city.province.id.toString(), label: sale.city.province.code + "-" + sale.city.province.name});
  
          if(sale?.city)
              setSelectedOptionCity({ value: sale.city.id.toString(), label: sale.city.zipCode + "-" + sale.city.name });
      }).then(async () => {
        await SaleService.saleGet(sale?.id).then(data => {
              setNumber(data?.number ?? 0 );
              setBusinessName(data?.businessName ?? "");
              setAddress(data?.address ?? "");
              setPhone(data?.phone ?? "");
              setObservation(data?.observation ?? "");
              setSearchAddress(data?.address + ", " + data.city?.name);
          });
      });
    }, []);

  

  useEffect(() => {
      CityService.cityGetByCity(province as ProvinceRequest).then((data) => { 
          setListCity(data); 
          setOptionCity(data.map(x => { return { value: x.id.toString(), label: x.zipCode + "-" + x.name }; }));

          const findCity = data.find(x => x.id.toString() === selectedOptionCity?.value);
          
          if(findCity === null || findCity === undefined)
              setSelectedOptionCity(null);
      }).finally(() => {setIsLoadingCity(false);});
    
  }, [province])

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;

    autocomplete.setFields([
      "place_id",
      "address_components",
      "formatted_address",
      "name",
      "geometry",
    ]);
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (!place.place_id || !place.geometry || !place.geometry.location) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    const address = place.formatted_address || place.name || "";

    setSearchAddress(address);
    setMarkerLocation(location);
    setZoom(17);
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
  };

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerLocation(newPos);
    }
  };

  const title = "Localizacion";
  
  return (
    <>
      
    <Modal open={open} onClose={() => onOpenChange(false)} title={title} width="50%" zIndex={1000}>
        <Grid columns="1fr 1fr 1fr">
            <Box></Box>
            <Box>
                <Flex justify="center" gap="2" mt="3">
                    <Heading size={"8"}>Nro Venta {number}</Heading>
                </Flex>
            </Box>
            <Box></Box>
        </Grid>
        <Grid columns="1fr 1fr" gap={"2"}>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Razon Social</Text>
                <TextField.Root  value={businessName} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Telefono</Text>
                <TextField.Root  value={phone} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Provincia</Text>
                <Select options={optionProvince} value={selectedOptionProvince} onChange={option=> {setIsLoadingCity(true); setSelectedOptionProvince(option as Option);}}/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Localidad</Text>
                {isLoadingCity && (<Skeleton height={"30px"}></Skeleton>)}
                {!isLoadingCity && (
                    <Select options={optionCity} value={selectedOptionCity} onChange={option=> setSelectedOptionCity(option?? null) }/>
                )}
                
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>domicilio</Text>
                <TextField.Root value={address} onChange={(e) => setAddress(e.target.value)}/>
            </Box>
            <Box gridColumn={"span 2"}>
                <Text size="2" mb="1" style={{ display: "block" }}>Observacion</Text>
                <TextArea rows={4} value={observation} onChange={(e) => setObservation(e.target.value)}/>
            </Box>
            <Box gridColumn={"span 2"}>
                <Text size="2" mb="1" style={{ display: "block" }}>Busqueda</Text>
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged} options={{componentRestrictions: {country: "ar"}}}>
                  <input
                    id="autocomplete-sale"
                    ref={addressInputRef}
                    type="text"
                    placeholder="Buscar domicilio..."
                    value={searchAddress}
                    style={{ width: "100%", padding: "8px" }}
                    onChange={handleAddressInputChange}
                  />
                </Autocomplete>
            </Box>
            <Box gridColumn={"span 1"}></Box>
            <Box gridColumn={"span 2"}>
                <GoogleMap mapContainerStyle={{width: "100%", height: "30vh"}} center={markerLocation} zoom={zoom}>
                  <Marker position={markerLocation} draggable={true} onDragEnd={handleDragEnd} onClick={() => setShowMarkerInfo(true)} />
                  
                  {showMarkerInfo && (
                      <InfoWindow position={{lat: markerLocation.lat, lng:markerLocation.lng}} onCloseClick={() => setShowMarkerInfo(false)} options={{pixelOffset: new window.google.maps.Size(0, -40)}}>
                        <div style={{ cursor: "pointer" }}>
                          <img
                            src={`https://maps.googleapis.com/maps/api/streetview?size=200x120&location=${markerLocation.lat},${markerLocation.lng}&key=AIzaSyBG3yASKls__-_N-D3qfKP1j6Ow0q3xKJQ`}
                            alt="Street View Preview"
                            style={{ borderRadius: "4px" }}
                          />
                          <div style={{ marginTop: "4px", fontSize: "12px" }}>
                            Ver Street View
                          </div>
                        </div>
                      </InfoWindow>
                  )}
                  


                  <StreetViewPanorama options={{position: markerLocation, visible: false, pov: { heading: 100, pitch: 0 }, zoom: 1 }} />

                </GoogleMap>
            </Box>
            <Box gridColumn={"span 2"} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Flex justify="end" gap="2" mt="3">
                    <Button onClick={() => onOpenChange(false)} color="gray">Cancelar</Button>
                    <Button onClick={SaveRoadMap}>Guardar</Button>
                </Flex>
            </Box>
        </Grid>
    </Modal>
    </>
  );
};