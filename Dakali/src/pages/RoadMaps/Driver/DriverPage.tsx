import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { DriverService, type DriverRequest, type DriverResponse } from "../../../api/generated";
import { DriverModal } from "./DriverModal";

export const DriverPage: React.FC = () => {

  const [refreshDrivers, setRefreshDrivers] = useState(false);
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    DriverService.driverGetAll().then(data => {setDrivers(data)});
  }, [refreshDrivers]);

  const DeleteEvent = (driver:DriverRequest) =>{
    DriverService.driverDelete(driver).then(()=>{ setRefreshDrivers(!refreshDrivers); });
  };

  const CreateEvent =  () =>{
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const EditEvent = (driver:DriverResponse) =>{
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };
  
  const SaveService = async (driverRequest: DriverRequest) => {

      if(driverRequest.id == 0)
      {
        await DriverService.driverCreate(driverRequest)
        .then(()=>{ 
          setRefreshDrivers(!refreshDrivers);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshDrivers(!refreshDrivers);
        });

      }
      else
        await DriverService.driverUpdate(driverRequest)
        .then(()=>{ 
          setRefreshDrivers(!refreshDrivers);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshDrivers(!refreshDrivers);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Chofer</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"30%"}>Nombre</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"30%"}>Apellido</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Dni</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {drivers.map(item => {
                    return (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.firstName}</Table.Cell>
                        <Table.Cell>{item.lastName}</Table.Cell>
                        <Table.Cell>{item.dni}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(item);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(item as DriverRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
        <DriverModal
          key={selectedDriver?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          driver={selectedDriver}
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
