import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField } from "@radix-ui/themes";
import { ErrorModal } from "../../components/ErrorModal";
import { StockService, type StockEntryRequest, type StockRequest, type StockResponse } from "../../api/generated";
import { StockModal } from "./StockModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faBoxesStacked, faDollyBox, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AddStockModal } from "./AddStockModal";


export const StockPage: React.FC = () => {

  const [refreshStocks, setRefreshStocks] = useState(false);
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [filterSearchString, setFilterSearchString] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenStockEntry, setIsModalOpenStockEntry] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const StockEntryService = async (stockEntry:StockEntryRequest)=>{
    await StockService.stockStockEntry(stockEntry)
    .then(()=>{ 
        setRefreshStocks(!refreshStocks); 
        setIsModalOpenStockEntry(false);
    })
    .catch((error) =>{ 
        console.log({error});
        setErrorMessage(error.body.message);
        setErrorOpen(true);
        setRefreshStocks(!refreshStocks);
    });
  };
  
  const CreateStockService = async (stockRequest: StockRequest) => {

      await StockService.stockCreate(stockRequest)
        .then(()=>{ 
            setRefreshStocks(!refreshStocks); 
            setIsModalOpen(false);
        })
        .catch((error) => 
        { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshStocks(!refreshStocks);
        });
  };

  const AddStockEntryEvent = (stock:StockResponse) => {
    setSelectedStock(stock);
    setIsModalOpenStockEntry(true);
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
                <Flex justify={"end"}>
                    <Tooltip content="Crear"><Button onClick={CreateEvent}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
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
                                <Table.Cell>{stock.product.model.code}-{stock.product.name}</Table.Cell>
                                <Table.Cell>{stock.variant.name}</Table.Cell>
                                <Table.Cell>{stock.color.name}</Table.Cell>
                                <Table.Cell>{stock.location.hallway.code}-{stock.location.column.code}-{stock.location.level.code}</Table.Cell>
                                <Table.Cell>{stock.physical}</Table.Cell>
                                <Table.Cell>{stock.reserved}</Table.Cell>
                                <Table.Cell>{stock.transit}</Table.Cell>
                                <Table.Cell>{stock.free}</Table.Cell>
                                <Table.Cell>{stock.location.state.name}</Table.Cell>
                                <Table.Cell>
                                    <Tooltip content="Agregar Stock"><Button onClick={() => { AddStockEntryEvent(stock);}} color="green"><FontAwesomeIcon icon={faBoxesStacked} /></Button></Tooltip>
                                    <Tooltip content="Mover Stock"><Button onClick={() => { AddStockEntryEvent(stock);}}><FontAwesomeIcon icon={faDollyBox} /></Button></Tooltip>
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
          onSave={CreateStockService}
        />
      )}
      {isModalOpenStockEntry && (
        <AddStockModal
          key={selectedStock?.id??0}  
          open={isModalOpenStockEntry}
          onOpenChange={setIsModalOpenStockEntry}
          stock={selectedStock as StockResponse}
          onSave={StockEntryService}
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
