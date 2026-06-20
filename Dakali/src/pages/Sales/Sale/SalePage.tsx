import React, {useEffect, useMemo, useRef, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, Badge, Skeleton, Checkbox, Text, TextArea } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle, faMapMarkerAlt, faPrint, faCubes, faUserXmark, faUserCheck, faCircleCheck, faTruckArrowRight, faList, faRoad, faCircleXmark, faBoxOpen, faFileExcel, faRepeat, faCheckSquare, faXmarkSquare } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { CancelablePromise, SaleService, type ResultPageResponseOfSaleResponse, type SaleLocationRequest, type SaleRequest, type SaleResponse } from "../../../api/generated";
import { SaleModal } from "./SaleModal";
import { LocationGoogleMapModal } from "./LocationGoogleMapModal";
import { Pagination } from "../../../components/Pagination";
import { useReactToPrint } from "react-to-print";
import { GetPrintStyle } from "../../../PageStyle";
import { SalePrint } from "./Print/SalePrint";
import { SaleStateColor, type SaleState } from "./SaleStateColor";
import { HistoricSaleModal } from "./HistoricSaleModal";
import { format } from "date-fns";
import { DownloadFile } from "../../../Help";
import { Filter } from "./Filter";

export const SalePage: React.FC = () => {

  const [refreshSales, setRefreshSales] = useState(false);
  const [selectedSalesCheck, setSelectedSalesCheck] = useState(new Map<number, SaleResponse>());
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationMapModalOpen, setIsLocationMapModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const salePrintRef = useRef<HTMLDivElement>(null);
  const [isHistoricSaleModalOpen, setIsHistoricSaleModalOpen] = useState(false);
  const [selectedSalePrint, setSelectedSalePrint] = useState<SaleResponse | null>(null);
  const [salesLoading, setSalesLoading] = useState<SaleResponse[]>([]);
  const [selectedRow, setSelectedRow] = useState<SaleResponse | null>(null);

  const RunFilter = (value: ResultPageResponseOfSaleResponse)=>{
      setTotalRows(value.count);
      setSales(value.values);
  };

  const handlePrint = useReactToPrint({
    contentRef: salePrintRef,
    documentTitle: "Dakali",
    pageStyle: GetPrintStyle("A4")
  });

  const ChangeAllCheck = (isAllCheck: boolean) => {
    if(isAllCheck)
    {
      setSelectedSalesCheck(prev => {
        sales.forEach(sale => {
          if(!prev.has(sale.id))
            prev.set(sale.id, sale);

        });

        const copy = new Map(prev);
        return copy;
      });
    }
      
    else
      setSelectedSalesCheck(prev => {
        sales.forEach(sale => {
          if(prev.has(sale.id))
            prev.delete(sale.id);
        });

        const copy = new Map(prev);
        return copy;
      });
  };

  useEffect(()=> {
  
      if(selectedSalePrint === null)
        return;
  
      handlePrint();
  
    }, [selectedSalePrint]);

  const ShowError = (message: string) => {
      setErrorMessage(message);
      setErrorOpen(true);
  };

  const SaleEvent = (promiseEvent:CancelablePromise<SaleResponse> , sale:SaleResponse) =>{
    setSalesLoading(salesLoading.concat([sale]));

    promiseEvent
      .then(() => setRefreshSales(!refreshSales))
      .catch((error) => ShowError(error.body.message))
      .finally(() => setSalesLoading(salesLoading.filter(x => x.id !== sale.id)));
  };
  
  const CreateEvent =  () =>{
    setSelectedSale(null);
    setIsModalOpen(true);
  };

  const EditEvent = (sale:SaleResponse) =>{
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const LocationMapEvent = (sale:SaleResponse) =>{
    setSelectedSale(sale);
    setIsLocationMapModalOpen(true);
  };
  
  const SaveLocationService = (request : SaleLocationRequest) => {
    SaleService.saleAddLocation(request)
    .then(()=>{ 
      setRefreshSales(!refreshSales); 
      setIsLocationMapModalOpen(false);
    })
    .catch((error) => { 
      console.log({error});
      setErrorMessage(error.body.message);
      setErrorOpen(true);
      setRefreshSales(!refreshSales);
    });
  };

  const SaveService = async () => {
    setRefreshSales(!refreshSales);
  };

  const CancelSale = async () => {
    setRefreshSales(!refreshSales);
  };

  const isAllCheck = useMemo(() => {
    let valueCheck = true;
    
    if(selectedSalesCheck.size === 0)
      return false;

    sales.forEach(sale => {
      if(!selectedSalesCheck.has(sale.id))
      {
        valueCheck =false;
        return;
      }
        
    });

    return valueCheck;
  }, [sales, selectedSalesCheck]);
  const Checksale = (sale: SaleResponse, isChecked: boolean) => {
    if(isChecked)
    {
      setSelectedSalesCheck(prev => {
        const copy = new Map(prev);
        copy.set(sale.id, sale);

        return copy;
      });
    }
    else
    {
      setSelectedSalesCheck(prev => {
        const copy = new Map(prev);
        copy.delete(sale.id);
        return copy;
      });
    }
      
  };

  const PrintEvent = (sale: SaleResponse) => {
    setSalesLoading(salesLoading.concat([sale]));
    SaleService.saleGet(sale?.id)
      .then(data => {
        if(data.logisticsProvider?.isInHouse)
        {
          setSelectedSalePrint(data);
          setSalesLoading(salesLoading.filter(x => x.id !== sale.id));
        }
        else
        {
          return SaleService.saleUpdateIsPrinted(data.id, true)
            .then(() => {setRefreshSales(!refreshSales)})
            .catch((error) => ShowError(error.body.message))
            .finally(() => setSalesLoading(salesLoading.filter(x => x.id !== sale.id)));
        }
      });
  };

  const ClickRow = (sale: SaleResponse) => {
    if(selectedRow === undefined || selectedRow === null)
    {
      setSelectedRow(sale);
    }
    else if(selectedRow.id === sale.id)
      setSelectedRow(null);
    else
      setSelectedRow(sale);
  };

  const DownloadReportExcelDarLogitics = () => {
    const keys = Array.from(selectedSalesCheck.keys());
    const salesIds = keys.map(x => x.toString()).join(",");

    SaleService.saleReportExcelDarLogitics(salesIds).then(data => {
      DownloadFile(data, "application/vnd.ms-excel", `DarLogistica_${format(new Date(), "ddMMyyyy_HHmmss")}.xls`);
    });
  };

  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Ventas</Heading></Box>
        <Box></Box>
        <Box></Box>
        <Box>
          <Grid rows="auto 1fr" columns="10fr 2fr" height={"100%"} gap={"2"}>
            <Box>
              <Filter onFilter={RunFilter} page={page} rows={rows} refreshFilter={refreshSales} setPage={setPage} setLoading={(open: boolean) => { console.log(open)}}></Filter>
            </Box>
            <Flex justify={"end"} gap={"1"}>
              <Tooltip content="Crear"><Button onClick={CreateEvent}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
              <Tooltip content="Reporte Excel"><Button color="green" onClick={DownloadReportExcelDarLogitics}><FontAwesomeIcon icon={faFileExcel} /></Button></Tooltip>
            </Flex>
            <Box gridColumn={"span 3"}>
              <Table.Root variant="surface" size={"1"}>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell><Checkbox size="3" checked={isAllCheck} onCheckedChange={(value) => ChangeAllCheck(value === true)}/></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Num.</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Ident.</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Logistica</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Razon Social</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>F. Entrega</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Horario</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Domicilio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell><Tooltip content="Es Logistica Inversa?"><FontAwesomeIcon icon={faRepeat}/></Tooltip></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell><Tooltip content="Esta Impreso?"><FontAwesomeIcon icon={faPrint} /></Tooltip></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell><Tooltip content="Esta Geolocalizado?"><FontAwesomeIcon icon={faMapMarkerAlt} /></Tooltip></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sales.map(sale => {
                    
                    const state = sale.state as SaleState;
                    if(salesLoading.some(x => x.id === sale.id))
                      return (<Table.Row><Table.Cell colSpan={9}><Skeleton height={"30px"}></Skeleton></Table.Cell></Table.Row>);
                    else 
                      return (
                    <>
                      <Table.Row key={sale.guid} onDoubleClick={() => {ClickRow(sale)}}>
                        <Table.Cell style={{padding: "2px 4px !important"}}>
                          <Checkbox size="3" checked={selectedSalesCheck.has(sale.id)} onCheckedChange={(value) => Checksale(sale, value === true)}/>
                        </Table.Cell>
                        <Table.Cell>{sale.number}</Table.Cell>
                        <Table.Cell>{sale.identifier}</Table.Cell>
                        <Table.Cell>{sale.logisticsProvider?.name}</Table.Cell>
                        <Table.Cell>{sale.businessName}</Table.Cell>
                        <Table.Cell>{sale.deliveryDate?.substring(0, 10)}</Table.Cell>
                        <Table.Cell>{sale.deliveryStartTime.substring(0, 5)}-{sale.deliveryEndTime.substring(0, 5)}</Table.Cell>
                        <Table.Cell>{sale.address}, {sale.city?.name??""} ({sale.city?.zipCode??""})</Table.Cell>
                        <Table.Cell>{new Intl.NumberFormat("es-AR").format(sale.totalPrice)}$</Table.Cell>
                        <Table.Cell>
                          {((sale.isReverseLogistics) ? (<FontAwesomeIcon color="green" icon={faCircleCheck} />) : (<FontAwesomeIcon color="red" icon={faCircleXmark} />))}
                        </Table.Cell>
                        <Table.Cell>
                          {((sale.isPrinted) ? (<FontAwesomeIcon color="green" icon={faCircleCheck} />) : (<FontAwesomeIcon color="red" icon={faCircleXmark} />))}
                        </Table.Cell>
                        <Table.Cell>
                          {((sale.longitude !== 0 && sale.longitude !== 0) ? (<FontAwesomeIcon color="green" icon={faCircleCheck} />) : (<FontAwesomeIcon color="red" icon={faCircleXmark} />))}
                        </Table.Cell>
                        <Table.Cell><Badge style={{fontWeight: "bold", fontSize: "14px"}} color={SaleStateColor[state]}>{sale.state}</Badge></Table.Cell>
                        <Table.Cell>
                          <Flex gap={"1"}>
                            {(sale.state === "Creado" || sale.state === "Confirmado") && (<Tooltip content="Editar"><Button size={"1"} onClick={() => { EditEvent(sale);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>)}
                            {(sale.state === "Creado") && (<Tooltip content="Confirmado"><Button size={"1"} onClick={() => { SaleEvent(SaleService.saleConfirm(sale.id), sale); }} color={SaleStateColor.Confirmado}><FontAwesomeIcon icon={faCircleCheck} /></Button></Tooltip>)}
                            {(sale.state === "Confirmado") && (<Tooltip content="Preparado"><Button size={"1"} onClick={() => { SaleEvent(SaleService.salePrepared(sale.id), sale); }} color={SaleStateColor.Preparado}><FontAwesomeIcon icon={faCubes} /></Button></Tooltip>)}
                            {(sale.state === "Preparado") && (<Tooltip content="Pendiente Despachar"><Button size={"1"} onClick={() => { SaleEvent(SaleService.salePendingDispatch(sale.id), sale); }} color={SaleStateColor.PendienteDespachar}><FontAwesomeIcon icon={faTruckArrowRight} /></Button></Tooltip>)}
                            {(sale.state === "PendienteDespachar") && (<Tooltip content="En Viaje"><Button size={"1"} onClick={() => { SaleEvent(SaleService.saleOnTrip(sale.id), sale); }} color={SaleStateColor.EnViaje}><FontAwesomeIcon icon={faRoad} /></Button></Tooltip>)}
                            {(sale.state === "Preparado" || sale.state === "PendienteDespachar") && (<Tooltip content="Cancelar"><Button size={"1"} onClick={() => { SaleEvent(SaleService.saleCancel(sale.id), sale); }} color={SaleStateColor.Cancelado}><FontAwesomeIcon icon={faCircleXmark} /></Button></Tooltip>)}
                            {(sale.state === "EnViaje") && (<Tooltip content="Rechazado"><Button size={"1"} onClick={() => { SaleEvent(SaleService.saleReject(sale.id), sale); }} color={SaleStateColor.Rechazado}><FontAwesomeIcon icon={faUserXmark} /></Button></Tooltip>)}
                            {(sale.state === "EnViaje") && (<Tooltip content="Entregado"><Button size={"1"} onClick={() => { SaleEvent(SaleService.saleDeliver(sale.id), sale); }} color={SaleStateColor.Entregado}><FontAwesomeIcon icon={faUserCheck} /></Button></Tooltip>)}
                            {(sale.state === "EnViaje") && (<Tooltip content="Entregado Parcial"><Button size={"1"} onClick={() => { SaleEvent(SaleService.salePartialDeliver(sale.id), sale); }} color={SaleStateColor.EntregadoParcial}><FontAwesomeIcon icon={faBoxOpen} /></Button></Tooltip>)}
                            {(sale.state === "Creado" || sale.state === "Confirmado" || sale.state === "Preparado" || sale.state === "PendienteDespachar") && (<Tooltip content="Localizar"><Button size={"1"} color="orange" onClick={() => { LocationMapEvent(sale);}}><FontAwesomeIcon icon={faMapMarkerAlt} /></Button></Tooltip>)}
                            {(sale.state === "Creado" || sale.state === "Confirmado") && (<Tooltip content="Eliminar"><Button size={"1"} onClick={() => { SaleEvent(SaleService.saleDelete(sale as SaleRequest), sale); }} color={SaleStateColor.Anulado}><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>)}
                            {(sale.state !== "Anulado" && sale.state !== "Cancelado") && (<Tooltip content="Imprimir"><Button size={"1"}color="blue" onClick={() => PrintEvent(sale)}><FontAwesomeIcon icon={faPrint} /></Button></Tooltip>)}
                            <Tooltip content="Historico"><Button size={"1"} onClick={() => { setIsHistoricSaleModalOpen(true); setSelectedSale(sale);}}><FontAwesomeIcon icon={faList} /></Button></Tooltip>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                      {selectedRow?.id !== sale.id ? (<></>): (
                        <Table.Row key={sale.guid + sale.id}>
                          <Table.Cell colSpan={14} style={{padding: "30px", backgroundColor: "#06065d06"}}>
                            <Box gridColumn={"span 7"}>
                              <Text size="2" mb="1" style={{ display: "block" }}>Observacion</Text>
                              <TextArea rows={4} value={sale.observation} onChange={() => {}}/>
                            </Box>
                            <br></br>
                            <Table.Root variant="surface" size={"1"}>
                              <Table.Header>
                                <Table.Row>
                                  <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>variante</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Color</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>SKU</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Es Cambio?</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Cantidad</Table.ColumnHeaderCell>
                                  <Table.ColumnHeaderCell>Precio</Table.ColumnHeaderCell>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {
                                  (selectedRow?.saleDetails || []).map(detail => {

                                      return (
                                        <Table.Row key={detail.guid}>
                                          <Table.Cell>{detail.product?.code}-{detail.product?.name}</Table.Cell>
                                          <Table.Cell>{detail.productSku?.variant?.name}</Table.Cell>
                                          <Table.Cell>{detail.productSku?.color?.name}</Table.Cell>
                                          <Table.Cell>{detail.productSku?.sku}</Table.Cell>
                                          <Table.Cell>
                                              {
                                                  detail.isExchangeItem
                                                      ?(<FontAwesomeIcon icon={faCheckSquare} color="green"/>) 
                                                      :(<FontAwesomeIcon icon={faXmarkSquare} color="red" />)
                                              }
                                          </Table.Cell>
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
      {isModalOpen && (
        <SaleModal
          key={selectedSale?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          sale={selectedSale}
          onSave={SaveService}
          onCancel={CancelSale}
        />
      )}
      {isLocationMapModalOpen && (
        <LocationGoogleMapModal
          key={selectedSale?.id ?? "new"}  
          open={isLocationMapModalOpen}
          onOpenChange={setIsLocationMapModalOpen}
          sale={selectedSale as SaleRequest}
          onSave={SaveLocationService}
        />
      )}
      {isHistoricSaleModalOpen && (
        <HistoricSaleModal
          key={selectedSale?.id ?? "new"}  
          open={isHistoricSaleModalOpen}
          onOpenChange={setIsHistoricSaleModalOpen}
          sale={selectedSale as SaleRequest}
        />
      )}
      <ErrorModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
      <div style={{ display: "none" }}>
        <SalePrint ref={salePrintRef} sale={selectedSalePrint as SaleResponse} />
      </div>
    </>
    
  );
};
