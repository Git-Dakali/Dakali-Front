import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle, faXmarkCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { LogisticsProviderService, type LogisticsProviderRequest, type LogisticsProviderResponse } from "../../../api/generated";
import { LogisticsProviderModal } from "./LogisticsProviderModal";

export const LogisticsProviderPage: React.FC = () => {

  const [refreshLogisticsProviders, setRefreshLogisticsProviders] = useState(false);
  const [logisticsProviders, setLogisticsProviders] = useState<LogisticsProviderResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogisticsProvider, setSelectedLogisticsProvider] = useState<LogisticsProviderResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    LogisticsProviderService.logisticsProviderGetAll().then(data => {setLogisticsProviders(data)});
  }, [refreshLogisticsProviders]);

  const DeleteEvent = (logisticsProvider:LogisticsProviderRequest) =>{
    LogisticsProviderService.logisticsProviderDelete(logisticsProvider).then(()=>{ setRefreshLogisticsProviders(!refreshLogisticsProviders); });
  };

  const CreateEvent =  () =>{
    setSelectedLogisticsProvider(null);
    setIsModalOpen(true);
  };

  const EditEvent = (logisticsProvider:LogisticsProviderResponse) =>{
    setSelectedLogisticsProvider(logisticsProvider);
    setIsModalOpen(true);
  };
  
  const SaveService = async (logisticsProviderRequest: LogisticsProviderRequest) => {

      if(logisticsProviderRequest.id == 0)
      {
        await LogisticsProviderService.logisticsProviderCreate(logisticsProviderRequest)
        .then(()=>{ 
          setRefreshLogisticsProviders(!refreshLogisticsProviders);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshLogisticsProviders(!refreshLogisticsProviders);
        });

      }
      else
        await LogisticsProviderService.logisticsProviderUpdate(logisticsProviderRequest)
        .then(()=>{ 
          setRefreshLogisticsProviders(!refreshLogisticsProviders);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshLogisticsProviders(!refreshLogisticsProviders);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Categoria</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"20%"}>Codigo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"50%"}>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Logistica Propia</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {logisticsProviders.map(logisticsProvider => {
                    return (
                      <Table.Row key={logisticsProvider.id}>
                        <Table.Cell>{logisticsProvider.code}</Table.Cell>
                        <Table.Cell>{logisticsProvider.name}</Table.Cell>
                        <Table.Cell>{logisticsProvider.isInHouse ? (<FontAwesomeIcon color="green" icon={faCheckCircle} />) : (<FontAwesomeIcon color="red" icon={faXmarkCircle} />)}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(logisticsProvider);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(logisticsProvider as LogisticsProviderRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
        <LogisticsProviderModal
          key={selectedLogisticsProvider?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          logisticsProvider={selectedLogisticsProvider}
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
