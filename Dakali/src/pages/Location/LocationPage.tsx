import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ErrorModal } from "../../components/ErrorModal";
import { LocationService, type LocationRequest, type LocationResponse } from "../../api/generated";
import { LocationModal } from "./LocationModal";

export const LocationPage: React.FC = () => {

  const [refreshLocations, setRefreshLocations] = useState(false);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    LocationService.locationGetAll().then(data => {setLocations(data)});
  }, [refreshLocations]);

  const DeleteEvent = (location:LocationRequest) =>{
    LocationService.locationDelete(location).then(()=>{ setRefreshLocations(!refreshLocations); });
  };

  const CreateEvent =  () =>{
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  const EditEvent = (location: LocationResponse) =>{
    setSelectedLocation(location);
    setIsModalOpen(true);
  };
  
  const SaveService = async (locationRequest: LocationRequest) => {

      if(locationRequest.id == 0)
      {
        await LocationService.locationCreate(locationRequest)
        .then(()=>{ 
          setRefreshLocations(!refreshLocations);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
            console.log({error});
            setErrorMessage(error.body.message);
            setErrorOpen(true);
            setRefreshLocations(!refreshLocations);
          });

      }
      else
        await LocationService.locationUpdate(locationRequest)
        .then(()=>{ 
          setRefreshLocations(!refreshLocations);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshLocations(!refreshLocations);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Ubicaciones</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"20%"}>Pasillo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Columna</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Nivel</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Estado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {locations.map(location => {
                    return (
                      <Table.Row key={location.guid}>
                        <Table.Cell>{location.hallway.name}</Table.Cell>
                        <Table.Cell>{location.column.name}</Table.Cell>
                        <Table.Cell>{location.level.name}</Table.Cell>
                        <Table.Cell>{location.state.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(location);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(location);}} color="red"><TrashIcon/></Button></Tooltip>
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
            <LocationModal
            key={selectedLocation?.id ?? "new"}  
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            location={selectedLocation}
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
