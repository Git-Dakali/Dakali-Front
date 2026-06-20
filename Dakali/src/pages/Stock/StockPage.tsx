import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField } from "@radix-ui/themes";
import { StockService, type StockRequest, type StockResponse } from "../../api/generated";
import { StockRecountModal } from "./StockRecountModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faBoxesStacked, faTrash, faPlusCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { StockUpdateModal } from "./StockUpdateModal";
import { StockModal } from "./StockModal";


export const StockPage: React.FC = () => {

  const [refreshStocks, setRefreshStocks] = useState(false);
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [filterSearchString, setFilterSearchString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRecountOpen, setIsModalRecountOpen] = useState(false);
  const [isModalOpenStockUpadate, setIsModalOpenStockUpadate] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockResponse | null>(null);

  useEffect(()=> {
    StockService.stockGetAll({searchString}).then(data => {setStocks(data)});
  }, [refreshStocks, searchString]);

  const Filtrar = ()=>{
    setSearchString(filterSearchString);
  };

  const DeleteEvent = (stock:StockResponse) =>{
    StockService.stockDelete(stock as StockRequest).then(()=>{ setRefreshStocks(!refreshStocks); });
  };

  const CreateEvent =  () =>{
    setSelectedStock(null);
    setIsModalOpen(true);
  };

  const RecountEvent =  () =>{
    setSelectedStock(null);
    setIsModalRecountOpen(true);
  };
  
  const OnSaved = () => {
      setRefreshStocks(!refreshStocks);
  };

  const StockUpadateEvent = (stock:StockResponse) => {
    setSelectedStock(stock);
    setIsModalOpenStockUpadate(true);
  };

  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Stock</Heading></Box>
        <Box></Box>
        <Box></Box>
        <Box>
            <Grid rows="auto 1fr" columns="10fr 1fr 2fr" height={"100%"} gap={"2"}>
                <Box>
                  <TextField.Root placeholder="Filtro" value={filterSearchString} onChange={(e) => setFilterSearchString(e.target.value)}/>
                </Box>
                <Flex justify={"start"}>
                  <Button onClick={Filtrar}><FontAwesomeIcon icon={faFilter} /></Button>
                </Flex>
                <Flex justify={"end"} gap={"2"}>
                    <Tooltip content="Crear"><Button onClick={CreateEvent}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
                    <Tooltip content="Recuento"><Button onClick={RecountEvent} color="orange"><FontAwesomeIcon icon={faBoxesStacked} /></Button></Tooltip>
                </Flex>
                <Box gridColumn={"span 3"}>
                    <Table.Root variant="surface">
                        <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell width={"28%"}>Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"10%"}>Variante</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"7%"}>Color</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"15%"}>Ubicacion</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Fisico</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Reservado</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Transito</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Stock Libre</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"5%"}>Estado</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {stocks.map(stock => {
                            return (
                            <Table.Row key={stock.guid}>
                                <Table.Cell>{stock.productSku?.product?.code}-{stock.productSku?.product?.name}</Table.Cell>
                                <Table.Cell>{stock.productSku?.variant?.name}</Table.Cell>
                                <Table.Cell>{stock.productSku?.color?.name}</Table.Cell>
                                <Table.Cell>{stock.location?.hallway?.code}-{stock.location?.column?.code}-{stock.location?.level?.code}</Table.Cell>
                                <Table.Cell>{stock.physical}</Table.Cell>
                                <Table.Cell>{stock.reserved}</Table.Cell>
                                <Table.Cell>{stock.transit}</Table.Cell>
                                <Table.Cell>{stock.free}</Table.Cell>
                                <Table.Cell>{stock.location?.state?.name}</Table.Cell>
                                <Table.Cell>
                                    <Tooltip content="Modificar"><Button onClick={() => { StockUpadateEvent(stock);}} ><FontAwesomeIcon icon={faPencilAlt} /></Button></Tooltip>
                                    <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(stock);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
          onSave={OnSaved}
        />
      )}
      {isModalRecountOpen && (
        <StockRecountModal
          key={selectedStock?.id ?? "new"}  
          open={isModalRecountOpen}
          onOpenChange={setIsModalRecountOpen}
          onSave={OnSaved}
        />
      )}
      {isModalOpenStockUpadate && (
        <StockUpdateModal
          key={selectedStock?.id??0}  
          open={isModalOpenStockUpadate}
          onOpenChange={setIsModalOpenStockUpadate}
          stock={selectedStock as StockResponse}
          onSave={OnSaved}
        />
      )}
    </>
    
  );
};
