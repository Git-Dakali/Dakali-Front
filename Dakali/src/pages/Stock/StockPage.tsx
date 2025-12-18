import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ErrorModal } from "../../components/ErrorModal";
import { StockService, type StockRequest, type StockResponse } from "../../api/generated";
import { StockModal } from "./StockModal";

export const StockPage: React.FC = () => {

  const [refreshStocks, setRefreshStocks] = useState(false);
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    StockService.stockGetAll().then(data => {setStocks(data)});
  }, [refreshStocks]);

  const DeleteEvent = (stock:StockResponse) =>{
    StockService.stockDelete(stock as StockRequest).then(()=>{ setRefreshStocks(!refreshStocks); });
  };

  const CreateEvent =  () =>{
    setSelectedStock(null);
    setIsModalOpen(true);
  };

  const EditEvent = (stock:StockResponse) =>{
    setSelectedStock(stock);
    setIsModalOpen(true);
  };
  
  const SaveService = async (stockRequest: StockRequest) => {

      if(stockRequest.id == 0)
      {
        await StockService.stockCreate(stockRequest)
        .then(()=>{ 
            setRefreshStocks(!refreshStocks); 
            setIsModalOpen(false);
        })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body);
            setErrorOpen(true);
            setRefreshStocks(!refreshStocks);
          });

      }
      else
        await StockService.stockUpdate(stockRequest).then(()=>{ 
            setRefreshStocks(!refreshStocks); 
            setIsModalOpen(false);
        })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body);
            setErrorOpen(true);
            setRefreshStocks(!refreshStocks);
          });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Stock</Heading></Box>
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
                            <Table.ColumnHeaderCell width={"30%"}>Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"10%"}>Variante</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"10%"}>Color</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Fisico</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Reservado</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Transito</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Libre</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Minimo</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Maximo</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"10%"}>Estado</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"10%"}>Acciones</Table.ColumnHeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {stocks.map(stock => {
                            return (
                            <Table.Row key={stock.guid}>
                                <Table.Cell>{stock.product.name}</Table.Cell>
                                <Table.Cell>{stock.variant.name}</Table.Cell>
                                <Table.Cell>{stock.color.name}</Table.Cell>
                                <Table.Cell>{stock.physical}</Table.Cell>
                                <Table.Cell>{stock.reserved}</Table.Cell>
                                <Table.Cell>{stock.transit}</Table.Cell>
                                <Table.Cell>{stock.free}</Table.Cell>
                                <Table.Cell>{stock.minimum}</Table.Cell>
                                <Table.Cell>{stock.maximum}</Table.Cell>
                                <Table.Cell>{stock.state.name}</Table.Cell>
                                <Table.Cell>
                                    <Tooltip content="Editar"><Button onClick={() => { EditEvent(stock);}}><Pencil1Icon/></Button></Tooltip>
                                    <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(stock);}} color="red"><TrashIcon/></Button></Tooltip>
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
        <StockModal
          key={selectedStock?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          stock={selectedStock}
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
