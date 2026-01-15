import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ErrorModal } from "../../components/ErrorModal";
import { HallwayService, type ColumnResponse, type HallwayRequest, type HallwayResponse } from "../../api/generated";
import { HallwayModal } from "./HallwayModal";

export const HallwayPage: React.FC = () => {

  const [refreshHallways, setRefreshHallways] = useState(false);
  const [hallways, setHallways] = useState<HallwayResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHallway, setSelectedHallway] = useState<ColumnResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    HallwayService.hallwayGetAll().then(data => {setHallways(data)});
  }, [refreshHallways]);

  const DeleteEvent = (hallway:HallwayRequest) =>{
    HallwayService.hallwayDelete(hallway).then(()=>{ setRefreshHallways(!refreshHallways); });
  };

  const CreateEvent =  () =>{
    setSelectedHallway(null);
    setIsModalOpen(true);
  };

  const EditEvent = (hallway:HallwayResponse) =>{
    setSelectedHallway(hallway);
    setIsModalOpen(true);
  };
  
  const SaveService = async (hallwayRequest: HallwayRequest) => {

      if(hallwayRequest.id == 0)
      {
        await HallwayService.hallwayCreate(hallwayRequest)
        .then(()=>{ 
          setRefreshHallways(!refreshHallways);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshHallways(!refreshHallways);
        });

      }
      else
        await HallwayService.hallwayUpdate(hallwayRequest).then(()=>{ 
          setRefreshHallways(!refreshHallways); 
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshHallways(!refreshHallways);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Pasillo</Heading></Box>
        <Box></Box>
        <Box></Box>
        <Box>
          <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
            <Flex justify={"end"}>
              <Tooltip content="Crear"><Button onClick={CreateEvent}><PlusCircledIcon/></Button></Tooltip>
            </Flex>
            <Box>
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell width={"10%"}>Code</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"70%"}>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {hallways.map(hallway => {
                    return (
                      <Table.Row key={hallway.guid}>
                        <Table.Cell>{hallway.code}</Table.Cell>
                        <Table.Cell>{hallway.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(hallway);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(hallway as HallwayRequest);}} color="red"><TrashIcon/></Button></Tooltip>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          </Grid>
          
        </Box>
      </Grid>
      {isModalOpen && (
        <HallwayModal
          key={selectedHallway?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          hallway={selectedHallway}
          onSave={SaveService}
        />
      )}
      <ErrorModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
    </>
    
  );
};
