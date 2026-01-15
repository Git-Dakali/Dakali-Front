import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ErrorModal } from "../../components/ErrorModal";
import { LocationStateService, type LocationStateRequest, type LocationStateResponse } from "../../api/generated";
import { LocationStateModal } from "./LocationStateModal";

export const LocationStatePage: React.FC = () => {

  const [refreshStates, setRefreshStates] = useState(false);
  const [states, setStates] = useState<LocationStateResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<LocationStateResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    LocationStateService.locationStateGetAll().then(data => {setStates(data)});
  }, [refreshStates]);

  const DeleteEvent = (state:LocationStateRequest) =>{
    LocationStateService.locationStateDelete(state).then(()=>{ setRefreshStates(!refreshStates); });
  };

  const CreateEvent =  () =>{
    setSelectedState(null);
    setIsModalOpen(true);
  };

  const EditEvent = (state:LocationStateResponse) =>{
    setSelectedState(state);
    setIsModalOpen(true);
  };
  
  const SaveService = async (stateRequest: LocationStateRequest) => {

      if(stateRequest.id == 0)
      {
        await LocationStateService.locationStateCreate(stateRequest)
        .then(()=>{ 
          setRefreshStates(!refreshStates); 
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshStates(!refreshStates);
        });

      }
      else
        await LocationStateService.locationStateUpdate(stateRequest)
        .then(()=>{ 
          setRefreshStates(!refreshStates);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshStates(!refreshStates);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Estado</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"15%"}>Code</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"70%"}>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {states.map(state => {
                    return (
                      <Table.Row key={state.id}>
                        <Table.Cell>{state.code}</Table.Cell>
                        <Table.Cell>{state.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(state);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(state as LocationStateRequest);}} color="red"><TrashIcon/></Button></Tooltip>
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
        <LocationStateModal
          key={selectedState?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          state={selectedState}
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
