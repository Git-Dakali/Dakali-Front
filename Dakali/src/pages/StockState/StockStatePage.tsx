import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { StockStateService } from "../../api/generated/services/StockStateService"
import { ErrorModal } from "../../components/ErrorModal";
import type { StockStateRequest, StockStateResponse } from "../../api/generated";
import { StockStateModal } from "./StockStateModal";

export const StockStatePage: React.FC = () => {

  const [refreshStockStates, setRefreshStockStates] = useState(false);
  const [stockStates, setStockStates] = useState<StockStateResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStockState, setSelectedStockState] = useState<StockStateResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    StockStateService.stockStateGetAll().then(data => {setStockStates(data)});
  }, [refreshStockStates]);

  const DeleteEvent = (stockState:StockStateRequest) =>{
    StockStateService.stockStateDelete(stockState).then(()=>{ setRefreshStockStates(!refreshStockStates); });
  };

  const CreateEvent =  () =>{
    setSelectedStockState(null);
    setIsModalOpen(true);
  };

  const EditEvent = (stockState: StockStateResponse) =>{
    setSelectedStockState(stockState);
    setIsModalOpen(true);
  };
  
  const SaveService = async (stockStateRequest: StockStateRequest) => {

      if(stockStateRequest.id == 0)
      {
        await StockStateService.stockStateCreate(stockStateRequest)
        .then(()=>{ setRefreshStockStates(!refreshStockStates); })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.message);
            setErrorOpen(true);
            setRefreshStockStates(!refreshStockStates);
          });

      }
      else
        await StockStateService.stockStateUpdate(stockStateRequest).then(()=>{ setRefreshStockStates(!refreshStockStates); });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Estado Stock</Heading></Box>
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
                  {stockStates.map(state => {
                    return (
                      <Table.Row key={state.guid}>
                        <Table.Cell>{state.code}</Table.Cell>
                        <Table.Cell>{state.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(state);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(state as StockStateRequest);}} color="red"><TrashIcon/></Button></Tooltip>
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
            <StockStateModal
            key={selectedStockState?.id ?? "new"}  
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            state={selectedStockState}
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
