import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Flex, Text, Box, Grid, Heading, Card, ScrollArea, TextField, Tooltip } from "@radix-ui/themes";
import { RoadMapSaleService, RoadMapService, SaleService, type RoadMapRequest, type RoadMapResponse, type RoadMapSaleRequest, type RoadMapSaleResponse, type SaleResponse } from "../../../api/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faMapMarkerAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DirectionsRenderer, GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";


import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { ErrorModalV2 } from "../../../components/ErrorModalV2";
import { LocationGoogleMapModal } from "../../Sales/Sale/LocationGoogleMapModal";
import { Modal } from "../../../components/Modal";
import TimePicker from "react-time-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type RoutingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadMap: RoadMapResponse;
};

export const RoutingModal: React.FC<RoutingModalProps> = ({
  open,
  onOpenChange,
  roadMap
}) => {

  const nestedModalContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeSale, setActiveSale] = useState<RoadMapSaleResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocationMapModalOpen, setIsLocationMapModalOpen] = useState(false);
  const [saleNumber, setSaleNumber] = useState("");
  const [travelTime, setTravelTime] = useState<string>("11:00");
  const [refreshSales, setRefreshSales] = useState(false);
  const [sales, setSales] = useState<RoadMapSaleResponse[]>([]);
  const [selectedSale, setSelectedSale] = useState<RoadMapSaleResponse|null>(null);
  const [salesDirection, setSalesDirection] = useState<{distance: string, duration: string, arrivalTime: string}[]>([]);
  const [mapCenter] = useState({ lat: -34.823121, lng: -58.502967 });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(()=> {
      RoadMapSaleService.roadMapSaleGetByRoadMap(roadMap?.id ?? 0).then(data => setSales(data.sort((a,b) => a.sortOrder - b.sortOrder)));
  }, []);

  useEffect(() => {
    RoadMapSaleService.roadMapSaleGetByRoadMap(roadMap?.id ?? 0).then(data => setSales(data.sort((a,b) => a.sortOrder - b.sortOrder)));
  }, [refreshSales]);

  const UpdateSalesDirection = (directionsGoogle: google.maps.DirectionsResult | null) => {
    if(directionsGoogle === null)
      return [];

    const legs = directionsGoogle.routes[0].legs;

    if(legs.length !== sales.length)
      return [];

    let start = dayjs(travelTime, "HH:mm");

    const results = sales.map((sale, index) => {
      const leg = legs[index];

      if(sale.sortOrder !== 1)
        start = start.add(10, "minute");

      start = start.add((leg?.duration_in_traffic?.value ?? leg?.duration?.value) ?? 0, "second");
      
      const value = {distance: leg.distance?.text ?? "", duration: leg?.duration_in_traffic?.text ?? leg?.duration?.text ?? "", arrivalTime: start.format("HH:mm")};

      return value;
    });

    setSalesDirection(results);
  };

  const SaveService = async (details : RoadMapSaleResponse[]) => {
    const entity = {} as RoadMapRequest 
    entity.id = roadMap?.id ?? 0;
    entity.guid = roadMap?.guid ?? crypto.randomUUID();
    entity.searchString = roadMap?.searchString ?? "";
    entity.number = roadMap.number;
    entity.date = roadMap.date;
    entity.travelDate = roadMap.travelDate;
    entity.completionDate = roadMap.completionDate;
    entity.driver = roadMap.driver;
    entity.state = roadMap.state;
    entity.sales = details.map((sale, index) => {sale.sortOrder = (index + 1); return sale});

      await RoadMapService.roadMapUpdate(entity)
      .then((data)=>{
        setSales(data.sales.sort((a,b) => a.sortOrder - b.sortOrder))
       })
      .catch((error) => { 
        console.log({error});
        setErrorMessage(error.body.message);
        setErrorOpen(true);
      });
    };
  
  const locationsSales = useMemo(() => {
    return sales.filter(x=> x.sale.latitude !== 0 && x.sale.longitude !== 0).map(x => { return { lat: x.sale.latitude, lng: x.sale.longitude };});
  }, [sales]);
  const handleKeySaleNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log({saleNumber});
      AddSale()
    }
  };

  const LoadRoute = () => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: mapCenter,
        destination: locationsSales[locationsSales.length - 1],
        waypoints: locationsSales.slice(0, -1).map(location => {return {location: location};}),
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING,

        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      }, 
      (result, status) => {
        if (status === "OK" && result) 
        {
          setDirections(result);
          UpdateSalesDirection(result);
        }
          

        console.log({result});
      }
    );
  };

  const SaveLocationService = (saleId:number, latitude:number, longitude:number) => {
    SaleService.saleAddLocation(saleId, longitude, latitude)
    .then(()=>{ 
      setRefreshSales(!refreshSales); 
      setIsLocationMapModalOpen(false);
    })
    .catch((error) => { 
      console.log({error});
      setErrorMessage(error.body.message);
      setErrorOpen(true);
      setRefreshSales(!refreshSales);
    });
  };
  
  const RemoveSale = (sale : RoadMapSaleResponse) => {
    SaveService(sales.filter(s => s.id !== sale?.id));
  };

  const AddSale = () => {
    SaleService.saleGetByNumber(Number.parseInt(saleNumber)?? 0)
    .then(sale => {
        if(sale === undefined || sale === null)
        {
            setErrorMessage("No se encontro La venta " + saleNumber);
            setErrorOpen(true);
            setRefreshSales(!refreshSales);
            return;
        }
        
        const roadMapSale:RoadMapSaleRequest = {id: 0, sale: sale, sortOrder: 0  };
        SaveService([roadMapSale].concat(sales));
    })
    .catch((error) => { 
        console.log({error});
        setErrorMessage(error.body.message);
        setErrorOpen(true);
    });
  };

  const Sortable = ({sale, index}: {sale: RoadMapSaleResponse; index: number}) => 
  {
    const [element, setElement] = useState<Element | null>(null);
    const handleRef = useRef<HTMLDivElement | null>(null);
    const {isDragging} = useSortable({id: sale.id, index, element, handle: handleRef});
    let colorSale = "";

    if(selectedSale?.sale.id === sale.sale.id)
      colorSale = "#D5DCFF";

    if((sale.sale.longitude ?? 0) === 0 || (sale.sale.latitude ?? 0) === 0)
      colorSale = "#FFDCD7";
    return (
      <Box >
          <Card ref={setElement} data-show={isDragging || undefined} style={{backgroundColor: colorSale}}>
              <Grid columns={"1fr 5fr 1fr"} onClick={() => {setSelectedSale(sale);}}>
                  <Box ref={handleRef}>
                    <Text as="div" size="6" weight="bold">{(index + 1)}</Text>
                  </Box>
                  <Box>
                      <Text as="div" size="2" weight="bold">{sale.sale.number} - {sale.sale.businessName}</Text>
                      <Text as="div" size="2" color="gray">{sale.sale.city?.zipCode}-{sale.sale.city?.name}</Text> 
                      <Text as="div" size="2" color="gray">{sale.sale.address} {sale.sale.floor} {sale.sale.apartment}</Text> 
                  </Box>
                  <Box>
                      <Tooltip content="Eliminar"><Button onClick={() => RemoveSale(sale)} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
                      <Tooltip content="Localizar"><Button color="green" onClick={() => {setSelectedSale(sale); setIsLocationMapModalOpen(true);}}><FontAwesomeIcon icon={faMapMarkerAlt} /></Button></Tooltip>
                  </Box>
              </Grid>
          </Card>
      </Box>

    );
  }

  const mapOptions = {
  styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.attraction",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.government",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.medical",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.place_of_worship",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.school",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.sports_complex",
        stylers: [{ visibility: "off" }]
      }
    ]
  };
  console.log({salesDirection, selectedSale});
  const title = "Ruteo";

  return (
    <>
      
    <Modal open={open} onClose={() => onOpenChange(false)} title={title} width="80%" zIndex={900}>
      <Grid columns="1fr 1fr 1fr 1fr 1fr">
          <Box></Box>
          <Box></Box>
          <Box>
              <Flex justify="center" gap="2" mt="3">
                  <Heading size={"9"}>Nro {roadMap.number}</Heading>
              </Flex>
          </Box>
          <Box></Box>
          <Box></Box>
      </Grid>
      <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" gap={"1"}>
          <Box gridColumn={"span 2"}>
              <Text size="2" mb="1" style={{ display: "block" }}>Fecha Emision<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
              <TextField.Root  value={roadMap.date} disabled/>
          </Box>
          <Box gridColumn={"span 2"}>
              <Text size="2" mb="1" style={{ display: "block" }}>Fecha en Viaje<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
              <TextField.Root  value={roadMap.travelDate} disabled/>
          </Box>
          <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Hora Inicio<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
              <TimePicker value={travelTime} format="HH:mm" onChange={(time:string|null) => setTravelTime(time ?? "11:00")} disableClock/>
          </Box>
          <Box gridColumn={"span 2"}>
              <Text size="2" mb="1" style={{ display: "block" }}>Fecha Finalizacion<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
              <TextField.Root  value={roadMap.completionDate} disabled/>
          </Box>
          <Box gridColumn={"span 2"}>
            <Text style={{ display: "block" }}>Chofer<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
            <TextField.Root  value={roadMap.driver.firstName +", "+ roadMap.driver.lastName} disabled/>
          </Box>
          <Box gridColumn={"span 2"}></Box>
          <Box gridColumn={"span 10"}></Box>
          <Box gridColumn={"span 3"}></Box>
          <Box gridColumn={"span 4"}>
            <TextField.Root placeholder="Ingresar Numero Venta" value={saleNumber} onChange={(e) => setSaleNumber(e.target.value)} onKeyDown={handleKeySaleNumber} />
          </Box>
          <Box gridColumn={"span 3"} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Flex justify="end" gap="2" mt="3">
              {
                (locationsSales.length !== sales.length || sales.length > 24) 
                ? (<Button disabled>Rutear</Button>) 
                : (<Button onClick={LoadRoute}>Rutear</Button>)
              }
            </Flex>
          </Box>
          <Box gridColumn={"span 7"}>
                <GoogleMap
                  mapContainerStyle={{width: "100%", height: "100%"}}
                  center={mapCenter}
                  zoom={10}
                  options={mapOptions}
                >
                  <Marker 
                    position={mapCenter}
                    icon={{
                      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="#322DCB" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M96 96C78.3 96 64 110.3 64 128L64 496C64 522.5 85.5 544 112 544L528 544C554.5 544 576 522.5 576 496L576 216.2C576 198 556.6 186.5 540.6 195.1L384 279.4L384 216.2C384 198 364.6 186.5 348.6 195.1L192 279.4L192 128C192 110.3 177.7 96 160 96L96 96z"/></svg>'),
                      scaledSize: new google.maps.Size(40, 40),
                      anchor: new google.maps.Point(20, 20),
  
                    }}>

                  </Marker>
                  {sales.map((sale, index) => {
                    
                    if((sale.sale.longitude ?? 0) === 0 || (sale.sale.latitude ?? 0) === 0)
                      return "";

                    return (<Marker key={sale.id} label={(index +1).toString()} position={{lat: sale.sale.latitude, lng: sale.sale.longitude}} />);
                  })}
                  
                  {selectedSale && (
                      <InfoWindow position={{lat: selectedSale.sale.latitude, lng: selectedSale.sale.longitude}} onCloseClick={() => setSelectedSale(null)} options={{pixelOffset: new window.google.maps.Size(0, -40)}}>
                        <Grid columns="1fr 1fr" gap={"1"}>
                          <Box maxWidth={"100px"}>
                            <Text size="1" style={{ display: "block" }}>Kilometros</Text>
                            <TextField.Root size="1" value={salesDirection[selectedSale.sortOrder -1]?.distance} disabled/>
                          </Box>
                          <Box maxWidth={"100px"}>
                            <Text size="1" style={{ display: "block" }}>Tiempos</Text>
                            <TextField.Root size="1" value={salesDirection[selectedSale.sortOrder -1]?.duration} disabled/>
                          </Box>
                          <Box maxWidth={"100px"}>
                            <Text size="1" style={{ display: "block" }}>Hora</Text>
                            <TextField.Root size="1" value={salesDirection[selectedSale.sortOrder -1]?.arrivalTime} disabled/>
                          </Box>
                        </Grid>
                      </InfoWindow>
                  )}

                  {directions && 
                    <DirectionsRenderer 
                      directions={directions} 
                      options={{ 
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: "#4285F4",   // 🔥 color de la ruta
                          strokeWeight: 6,          // grosor
                          strokeOpacity: 1,       // opacidad
                        }
 
                      }} 
                    />}
                </GoogleMap>
          </Box>
          <Box gridColumn={"span 3"}>
            <ScrollArea type="always" scrollbars="vertical" style={{ overflow: "hidden", height: 72*10 }}>
              <DragDropProvider 
                onDragStart={(event) => {
                  const activeId = event.operation.source?.id;
                  const found = sales.find((s) => s.id === activeId);
                  setActiveSale(found ?? null);
                }}
                onDragEnd={(event) => {
                  const items = move(sales, event)
                  setSales(items);
                  SaveService(items);
                  setActiveSale(null);
                }}
              >
                <ul className="list">
                  {sales.map((sale, index) => (
                    <Sortable key={sale.id} sale={sale} index={index} />
                  ))}
                </ul>
                <DragOverlay>
                {activeSale ? (
                  <Sortable key={activeSale.id} sale={activeSale} index={activeSale.sortOrder} />
                ) : null}
              </DragOverlay>
              </DragDropProvider>
            </ScrollArea>
          </Box>
          <Box gridColumn={"span 10"} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Flex justify="end" gap="2" mt="3">
                  <Button color="gray" onClick={() => onOpenChange(false)}>Cerrar</Button>
              </Flex>
          </Box>
      </Grid>
    </Modal>
    {isLocationMapModalOpen && (
      <LocationGoogleMapModal
        key={selectedSale?.id ?? "new"}  
        open={isLocationMapModalOpen}
        onOpenChange={setIsLocationMapModalOpen}
        sale={selectedSale?.sale as SaleResponse}
        onSave={SaveLocationService}
        container={nestedModalContainerRef.current}
      />
    )}
    <ErrorModalV2 open={errorOpen} onOpenChange={setErrorOpen} message={errorMessage} />
    </>
  );
};