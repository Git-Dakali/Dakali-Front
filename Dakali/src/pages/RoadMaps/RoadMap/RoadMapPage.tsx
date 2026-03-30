import React, {useEffect, useRef, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle, faMapLocationDot, faPrint } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { RoadMapService, type RoadMapResponse, type RoadMapRequest } from "../../../api/generated";
import { RoadMapModal } from "./RoadMapModal";
import { RoutingModal } from "./RoutingModal";
import { RoadMapPrint } from "./Print/RoadMapPrint";
import { useReactToPrint } from "react-to-print";
import { Pagination } from "../../../components/Pagination";


export const RoadMapPage: React.FC = () => {

  const [refreshRoadMaps, setRefreshRoadMaps] = useState(false);
  const [roadMaps, setRoadMaps] = useState<RoadMapResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoutingModalOpen, setIsRoutingModalOpen] = useState(false);
  const [selectedRoadMap, setSelectedRoadMap] = useState<RoadMapResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const roadMapPrintRef = useRef<HTMLDivElement>(null);
  const [selectedRoadMapPrint, setSelectedRoadMapPrint] = useState<RoadMapResponse | null>(null);

  const [page, setPage] = useState(1);

  const handlePrint = useReactToPrint({
    contentRef: roadMapPrintRef,
    documentTitle: "Dakali"
  });

  useEffect(()=> {
    RoadMapService.roadMapGetAll().then(data => {setRoadMaps(data)});
  }, [refreshRoadMaps]);

  useEffect(()=> {
    console.log({useEffect: selectedRoadMapPrint});

    if(selectedRoadMapPrint === null)
      return;

    handlePrint();

  }, [selectedRoadMapPrint]);

  const DeleteEvent = (roadMap:RoadMapRequest) =>{
    RoadMapService.roadMapDelete(roadMap).then(()=>{ setRefreshRoadMaps(!refreshRoadMaps); });
  };

  const CreateEvent =  () =>{
    setSelectedRoadMap(null);
    setIsModalOpen(true);
  };

  const EditEvent = (roadMap:RoadMapResponse) =>{
    setSelectedRoadMap(roadMap);
    setIsModalOpen(true);
  };

  const RoutingEvent = (roadMap:RoadMapResponse) =>{
    setSelectedRoadMap(roadMap);
    setIsRoutingModalOpen(true);
  };
  
  const SaveService = async (roadMapRequest: RoadMapRequest) => {

      if(roadMapRequest.id == 0)
      {
        await RoadMapService.roadMapCreate(roadMapRequest)
        .then(()=>{ 
          setRefreshRoadMaps(!refreshRoadMaps); 
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshRoadMaps(!refreshRoadMaps);
        });

      }
      else
        await RoadMapService.roadMapUpdate(roadMapRequest).then(()=>{ 
          setRefreshRoadMaps(!refreshRoadMaps);
          setIsModalOpen(false);
          setIsRoutingModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshRoadMaps(!refreshRoadMaps);
        });

    
  };
console.log({selectedRoadMapPrint})
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Ventas</Heading></Box>
        <Box></Box>
        <Box></Box>
        <Box>
          <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
            <Flex justify={"end"}>
              <Tooltip content="Crear"><Button onClick={CreateEvent}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
            </Flex>
            <Box>
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell width={"5%"}>Numero</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Fecha Emision</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>En Viaje</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Finalizado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"30%"}>Chofer</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Estado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {roadMaps.map(roadMap => {
                    return (
                      <Table.Row key={roadMap.guid}>
                        <Table.Cell>{roadMap.number}</Table.Cell>
                        <Table.Cell>{roadMap.date}</Table.Cell>
                        <Table.Cell>{roadMap.travelDate}</Table.Cell>
                        <Table.Cell>{roadMap.completionDate}</Table.Cell>
                        <Table.Cell>{roadMap.driver.firstName} {roadMap.driver.lastName}</Table.Cell>
                        <Table.Cell>{roadMap.state}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(roadMap);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Ruteo"><Button color="green" onClick={() => { RoutingEvent(roadMap);}}><FontAwesomeIcon icon={faMapLocationDot} /></Button></Tooltip>
                          <Tooltip content="Imprimir"><Button color="blue" onClick={() => { RoadMapService.roadMapGet(roadMap?.id).then(data => setSelectedRoadMapPrint(data)); }}><FontAwesomeIcon icon={faPrint} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(roadMap as RoadMapRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
              <Pagination currentPage={page} rows={10} totalRows={101} onChangePage={setPage} onChangeRows={() => {}}/>

            </Box>
          </Grid>
          
        </Box>
      </Grid>
      {isModalOpen && (
        <RoadMapModal
          key={selectedRoadMap?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          roadMap={selectedRoadMap}
          onSave={SaveService}
        />
      )}
      {isRoutingModalOpen && (
        <RoutingModal 
          key={selectedRoadMap?.id ?? "new"}  
          open={isRoutingModalOpen}
          onOpenChange={setIsRoutingModalOpen}
          roadMap={selectedRoadMap as RoadMapResponse}
        />
      )}
      <ErrorModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
      <div style={{  }}>
        <RoadMapPrint ref={roadMapPrintRef} roadMap={selectedRoadMapPrint as RoadMapResponse} />
      </div>

    </>
    
  );
};
