import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField, Badge, Skeleton, Text, TextArea } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faCircleCheck, faCircleXmark, faWarehouse, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../components/ErrorModal";
import { Pagination } from "../../components/Pagination";
import { CancelablePromise, ReturnOrderService, type ReturnOrderResponse } from "../../api/generated";
import { SaleStateColor, type SaleState } from "../Sales/Sale/SaleStateColor";

export const ReturnOrderPage: React.FC = () => {

  const [refreshReturnOrders, setRefreshReturnOrders] = useState(false);
  const [returnOrders, setReturnOrders] = useState<ReturnOrderResponse[]>([]);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterSearchString, setFilterSearchString] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [returnOrdersLoading, setReturnOrdersLoading] = useState<ReturnOrderResponse[]>([]);
  const [selectedRow, setSelectedRow] = useState<ReturnOrderResponse | null>(null);
  
  const RunFilter = ()=>{
    ReturnOrderService.returnOrderGetPage({page, countRows: rows, searchString: filterSearchString}).then((data) => {
      setTotalRows(data.count);
      setReturnOrders(data.values);
    });
  };

  useEffect(()=> {
    RunFilter()
  }, [page, rows, refreshReturnOrders]);

  const ShowError = (message: string) => {
      setErrorMessage(message);
      setErrorOpen(true);
  };

  const ReturnOrderEvent = (promiseEvent:CancelablePromise<ReturnOrderResponse> , returnOrder:ReturnOrderResponse) =>{
    setReturnOrdersLoading(returnOrdersLoading.concat([returnOrder]));

    promiseEvent
      .then(() => setRefreshReturnOrders(!refreshReturnOrders))
      .catch((error) => ShowError(error.body.message))
      .finally(() => setReturnOrdersLoading(returnOrdersLoading.filter(x => x.id !== returnOrder.id)));
  };
 
  const ClickRow = (returnOrder: ReturnOrderResponse) => {
    if(selectedRow === undefined || selectedRow === null)
    {
      setSelectedRow(returnOrder);
    }
    else if(selectedRow.id === returnOrder.id)
      setSelectedRow(null);
    else
      setSelectedRow(returnOrder);
  };

  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Ventas</Heading></Box>
        <Box></Box>
        <Box></Box>
        <Box>
          <Grid rows="auto 1fr" columns="10fr 1fr 2fr" height={"100%"} gap={"2"}>
            <Box>
              <TextField.Root placeholder="Filtro libre" value={filterSearchString} onChange={(e) => setFilterSearchString(e.target.value)}/>
            </Box>
            <Flex justify={"start"}>
              <Button onClick={() => { if(page !== 1) setPage(1); else RunFilter(); }}><FontAwesomeIcon icon={faFilter} /></Button>
            </Flex>
            <Flex justify={"end"} gap={"1"}>
              
            </Flex>
            <Box gridColumn={"span 3"}>
              <Table.Root variant="surface" size={"1"}>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell width={"5%"}>Num.</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"5%"}>Iden.</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"5%"}>Venta</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"7%"}>F. Entrega</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"13%"}>Razon Social</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Domicilio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"8%"}>Total</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"7%"}>Es Logistica Inversa</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Estado Venta</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Estado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {returnOrders.map(returnOrder => {

                    if(returnOrdersLoading.some(x => x.id === returnOrder.id))
                      return (<Table.Row><Table.Cell colSpan={9}><Skeleton height={"30px"}></Skeleton></Table.Cell></Table.Row>);
                    else 
                      return (
                    <>
                      <Table.Row key={returnOrder.guid}>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{returnOrder.number}</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{returnOrder.sale.identifier}</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{returnOrder.sale.number}</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{returnOrder.sale.deliveryDate?.substring(0, 10)}</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{returnOrder.sale.businessName}</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{returnOrder.sale.address}, {returnOrder.sale.city?.name??""} ({returnOrder.sale.city?.zipCode??""})</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{new Intl.NumberFormat("es-AR").format(returnOrder.sale.totalPrice)}$</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}>{(returnOrder.sale.isReverseLogistics? (<FontAwesomeIcon color="green" icon={faCircleCheck} />) : (<FontAwesomeIcon color="red" icon={faXmarkCircle} />) )}</Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}><Badge style={{fontWeight: "bold", fontSize: "14px"}} color={SaleStateColor[(returnOrder?.sale?.state as SaleState)]}>{returnOrder.sale.state}</Badge></Table.Cell>
                        <Table.Cell onClick={() => {ClickRow(returnOrder)}}><Badge style={{fontWeight: "bold", fontSize: "14px"}} color={(returnOrder.state === "Devuelto" ? "green" : (returnOrder.state === "NoDevuelto" ? "red" : (returnOrder.state === "Almacenado" ? "orange" : "blue")))}>{returnOrder.state}</Badge></Table.Cell>
                        <Table.Cell>
                          <Flex gap={"1"}>
                            {(returnOrder.state === "PendienteDevolver") && (<Tooltip content="Devuelto"><Button size={"1"} onClick={() => { ReturnOrderEvent(ReturnOrderService.returnOrderReturned(returnOrder.id), returnOrder); }} color={"green"}><FontAwesomeIcon icon={faCircleCheck} /></Button></Tooltip>)}
                            {(returnOrder.state === "Devuelto") && (<Tooltip content="Almacenado"><Button size={"1"} onClick={() => { ReturnOrderEvent(ReturnOrderService.returnOrderStored(returnOrder.id), returnOrder); }} color={"orange"}><FontAwesomeIcon icon={faWarehouse} /></Button></Tooltip>)}
                            {(returnOrder.state === "PendienteDevolver") && (<Tooltip content="No Devuelto"><Button size={"1"} onClick={() => { ReturnOrderEvent(ReturnOrderService.returnOrderNotReturned(returnOrder.id), returnOrder); }} color={"red"}><FontAwesomeIcon icon={faCircleXmark} /></Button></Tooltip>)}
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                      {selectedRow?.id !== returnOrder.id ? (<></>): (
                        <Table.Row key={returnOrder.guid + returnOrder.id}>
                          <Table.Cell colSpan={12} style={{padding: "15px", backgroundColor: "#06065d06"}}>
                            <Box gridColumn={"span 7"}>
                              <Text size="2" mb="1" style={{ display: "block" }}>Observacion</Text>
                              <TextArea rows={4} value={returnOrder.sale.observation}/>
                            </Box>
                            <br></br>
                            <Table.Root variant="surface" size={"1"}>
                              <Table.Header>
                                <Table.Row>
                                  <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>variante</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Color</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>SKU</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Cantidad</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Precio</Table.ColumnHeaderCell>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {
                                  (selectedRow?.sale?.saleDetails || []).map(detail => {

                                      return (
                                        <Table.Row key={returnOrder.guid}>
                                          <Table.Cell>{detail.product?.code}-{detail.product?.name}</Table.Cell>
                                          <Table.Cell>{detail.productSku?.variant?.name}</Table.Cell>
                                          <Table.Cell>{detail.productSku?.color?.name}</Table.Cell>
                                          <Table.Cell>{detail.productSku?.sku}</Table.Cell>
                                          <Table.Cell>{detail.count}</Table.Cell>
                                          <Table.Cell>{detail.price}</Table.Cell>
                                        </Table.Row>
                                      );
                                    })
                                }
                              </Table.Body>
                            </Table.Root>
                          </Table.Cell>
                        </Table.Row>
                      )}
                      
                      </>
                    );
                  })}
                </Table.Body>
              </Table.Root>
              <Pagination currentPage={page} rows={rows} totalRows={totalRows} onChangePage={setPage} onChangeRows={setRows}/>
            </Box>
          </Grid>
        </Box>
      </Grid>
      <ErrorModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
    </>
    
  );
};
