import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { OriginSaleService, type OriginSaleRequest, type OriginSaleResponse } from "../../../api/generated";
import { OriginSaleModal } from "./OriginSaleModal";

export const OriginSalePage: React.FC = () => {

  const [refreshCategories, setRefreshCategories] = useState(false);
  const [originSales, setOriginSales] = useState<OriginSaleResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOriginSale, setSelectedOriginSale] = useState<OriginSaleResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    OriginSaleService.originSaleGetAll().then(data => {setOriginSales(data)});
  }, [refreshCategories]);

  const DeleteEvent = (originSale:OriginSaleRequest) =>{
    OriginSaleService.originSaleDelete(originSale).then(()=>{ setRefreshCategories(!refreshCategories); });
  };

  const CreateEvent =  () =>{
    setSelectedOriginSale(null);
    setIsModalOpen(true);
  };

  const EditEvent = (originSale:OriginSaleResponse) =>{
    setSelectedOriginSale(originSale);
    setIsModalOpen(true);
  };
  
  const SaveService = async (originSaleRequest: OriginSaleRequest) => {

      if(originSaleRequest.id == 0)
      {
        await OriginSaleService.originSaleCreate(originSaleRequest)
        .then(()=>{ 
          setRefreshCategories(!refreshCategories);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshCategories(!refreshCategories);
        });

      }
      else
        await OriginSaleService.originSaleUpdate(originSaleRequest)
        .then(()=>{ 
          setRefreshCategories(!refreshCategories);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshCategories(!refreshCategories);
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
                    <Table.ColumnHeaderCell width={"80%"}>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {originSales.map(originSale => {
                    return (
                      <Table.Row key={originSale.id}>
                        <Table.Cell>{originSale.code}</Table.Cell>
                        <Table.Cell>{originSale.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(originSale);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(originSale as OriginSaleRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
        <OriginSaleModal
          key={selectedOriginSale?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          originSale={selectedOriginSale}
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
