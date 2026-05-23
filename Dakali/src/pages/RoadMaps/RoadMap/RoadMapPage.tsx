import React, {useEffect, useRef, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField, Badge } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle, faMapLocationDot, faPrint, faFilter, faRoadCircleCheck, faFileCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { RoadMapService, type RoadMapResponse, type RoadMapRequest } from "../../../api/generated";
import { RoadMapModal } from "./RoadMapModal";
import { RoutingModal } from "./RoutingModal";
import { RoadMapPrint } from "./Print/RoadMapPrint";
import { useReactToPrint } from "react-to-print";
import { Pagination } from "../../../components/Pagination";
import { GetPrintStyle } from "../../../PageStyle";


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

  const [filterSearchString, setFilterSearchString] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const RunFilter = ()=>{
    RoadMapService.roadMapGetPage({page, countRows: rows, searchString: filterSearchString}).then((data) => {
      setTotalRows(data.count);
      setRoadMaps(data.values);
    });
  };
  
  const handlePrint = useReactToPrint({
    contentRef: roadMapPrintRef,
    documentTitle: "Dakali",
    pageStyle: GetPrintStyle("A4")
  });

  useEffect(()=> {
    RunFilter()
  }, [page, rows, refreshRoadMaps]);


  useEffect(()=> {

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

  const OnTrip = (roadMap: RoadMapResponse) => {
    RoadMapService.roadMapOnTrip(roadMap.id).then(() => {
      setRefreshRoadMaps(!refreshRoadMaps);
    })
    .catch((error) => { 
      console.log({error});
      setErrorMessage(error.body.message);
      setErrorOpen(true);
      setRefreshRoadMaps(!refreshRoadMaps);
    });
  };
  
  const FinishTrip = (roadMap: RoadMapResponse) => {
    RoadMapService.roadMapFinishTrip(roadMap.id).then(() => {
      setRefreshRoadMaps(!refreshRoadMaps);
    })
    .catch((error) => { 
      console.log({error});
      setErrorMessage(error.body.message);
      setErrorOpen(true);
      setRefreshRoadMaps(!refreshRoadMaps);
    });
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
          <Grid rows="auto 1fr" columns="10fr 1fr 2fr" height={"100%"} gap={"2"}>
            <Box>
              <TextField.Root placeholder="Filtro libre" value={filterSearchString} onChange={(e) => setFilterSearchString(e.target.value)}/>
            </Box>
            <Flex justify={"start"}>
              <Button onClick={() => { if(page !== 1) setPage(1); else RunFilter(); }}><FontAwesomeIcon icon={faFilter} /></Button>
            </Flex>
            <Flex justify={"end"}>
              <Tooltip content="Crear"><Button onClick={CreateEvent}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
            </Flex>
            <Box gridColumn={"span 3"}>
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
                    const color = (roadMap.state === "EnViaje") ? "cyan" : ((roadMap.state === "Finalizado" ? "green" : "blue"));
                    return (
                      <Table.Row key={roadMap.guid}>
                        <Table.Cell>{roadMap.number}</Table.Cell>
                        <Table.Cell>{roadMap.date}</Table.Cell>
                        <Table.Cell>{roadMap.travelDate}</Table.Cell>
                        <Table.Cell>{roadMap.completionDate}</Table.Cell>
                        <Table.Cell>{roadMap.driver.firstName} {roadMap.driver.lastName}</Table.Cell>
                        <Table.Cell><Badge color={color}>{roadMap.state}</Badge></Table.Cell>
                        <Table.Cell>
                          <Flex gap={"1"}>
                            {roadMap.state === "Creado" && (<Tooltip content="Editar"><Button onClick={() => { EditEvent(roadMap);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>)}
                            {roadMap.state === "Creado" && (<Tooltip content="En Viaje"><Button color="cyan" onClick={() => { OnTrip(roadMap) }}><FontAwesomeIcon icon={faRoadCircleCheck} /></Button></Tooltip>)}
                            {roadMap.state === "EnViaje" && (<Tooltip content="Finalizar"><Button color="green" onClick={() => { FinishTrip(roadMap) }}><FontAwesomeIcon icon={faFileCircleCheck} /></Button></Tooltip>)}
                            <Tooltip content="Ruteo"><Button color="orange" onClick={() => { RoutingEvent(roadMap);}}><FontAwesomeIcon icon={faMapLocationDot} /></Button></Tooltip>
                            <Tooltip content="Imprimir"><Button color="blue" onClick={() => { RoadMapService.roadMapGet(roadMap?.id).then(data => setSelectedRoadMapPrint(data)); }}><FontAwesomeIcon icon={faPrint} /></Button></Tooltip>
                            {roadMap.state === "Creado" && (<Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(roadMap as RoadMapRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>)}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
              <Pagination currentPage={page} rows={rows} totalRows={totalRows} onChangePage={setPage} onChangeRows={setRows}/>
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
      <div style={{ display: "none" }}>
        <RoadMapPrint ref={roadMapPrintRef} roadMap={selectedRoadMapPrint as RoadMapResponse} />
      </div>

    </>
    
  );
};
