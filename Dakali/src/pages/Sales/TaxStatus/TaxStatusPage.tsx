import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ErrorModal } from "../../../components/ErrorModal";
import { TaxStatusService, type TaxStatusRequest, type TaxStatusResponse } from "../../../api/generated";
import { TaxStatusModal } from "./TaxStatusModal";

export const TaxStatusPage: React.FC = () => {

  const [refreshTaxStatus, setRefreshTaxStatus] = useState(false);
  const [taxStatus, setTaxStatus] = useState<TaxStatusResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaxStatus, setSelectedTaxStatus] = useState<TaxStatusResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    TaxStatusService.taxStatusGetAll().then(data => {setTaxStatus(data)});
  }, [refreshTaxStatus]);

  const DeleteEvent = (taxStatus:TaxStatusRequest) =>{
    TaxStatusService.taxStatusDelete(taxStatus).then(()=>{ setRefreshTaxStatus(!refreshTaxStatus); });
  };

  const CreateEvent =  () =>{
    setSelectedTaxStatus(null);
    setIsModalOpen(true);
  };

  const EditEvent = (taxStatus:TaxStatusResponse) =>{
    setSelectedTaxStatus(taxStatus);
    setIsModalOpen(true);
  };
  
  const SaveService = async (taxStatusRequest: TaxStatusRequest) => {

      if(taxStatusRequest.id == 0)
      {
        await TaxStatusService.taxStatusCreate(taxStatusRequest)
        .then(()=>{ 
          setRefreshTaxStatus(!refreshTaxStatus); 
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshTaxStatus(!refreshTaxStatus);
        });

      }
      else
        await TaxStatusService.taxStatusUpdate(taxStatusRequest).then(()=>{ 
          setRefreshTaxStatus(!refreshTaxStatus);
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshTaxStatus(!refreshTaxStatus);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Estado Fiscal</Heading></Box>
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
                  {taxStatus.map(item => {
                    return (
                      <Table.Row key={item.guid}>
                        <Table.Cell>{item.code}</Table.Cell>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(item);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(item as TaxStatusRequest);}} color="red"><TrashIcon/></Button></Tooltip>
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
        <TaxStatusModal
          key={selectedTaxStatus?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          taxStatus={selectedTaxStatus}
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
