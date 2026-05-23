import React, { useRef, useState } from "react";
import { Button, Flex, Text, Box, Grid, Heading, TextField, TextArea } from "@radix-ui/themes";
import { type SaleResponse } from "../../../api/generated";
import { Autocomplete, GoogleMap, InfoWindow, Marker, StreetViewPanorama } from "@react-google-maps/api";
import { Modal } from "../../../components/Modal";

type LocationGoogleMapModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: SaleResponse;
  container?: HTMLElement | null;
  onSave: (saleId:number, latitude:number, longitude:number) => Promise<void> | void;
};

export const LocationGoogleMapModal: React.FC<LocationGoogleMapModalProps> = ({
  open,
  onOpenChange,
  sale,
  onSave,
}) => {
  const [zoom, setZoom] = useState(17);
  const [markerLocation, setMarkerLocation] = useState({ lat: sale.latitude, lng: sale.longitude });
  const [showMarkerInfo, setShowMarkerInfo] = useState(false);

  const SaveRoadMap = () => {
      onSave(sale.id, markerLocation.lat, markerLocation.lng);
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [searchAddress, setSearchAddress] = useState(sale.address + ", " + sale.city?.name);
 
  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;

    autocomplete.setFields([
      "place_id",
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
                    <Heading size={"8"}>Nro Venta {sale.number}</Heading>
                </Flex>
            </Box>
            <Box></Box>
        </Grid>
        <Grid columns="1fr 1fr" gap={"2"}>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Razon Social</Text>
                <TextField.Root  value={sale.businessName} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Telefono</Text>
                <TextField.Root  value={sale.phone} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Ciudad</Text>
                <TextField.Root  value={sale.city?.province?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Localidad</Text>
                <TextField.Root  value={sale.city?.zipCode + "-" +sale.city?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>domicilio</Text>
                <TextField.Root  value={sale.address} disabled/>
            </Box>
            <Box gridColumn={"span 2"}>
                <Text size="2" mb="1" style={{ display: "block" }}>Observacion</Text>
                <TextArea rows={4} value={sale.observation} disabled/>
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