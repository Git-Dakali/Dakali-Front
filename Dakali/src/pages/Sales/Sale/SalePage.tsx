import React, {useEffect, useRef, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField, Badge, Skeleton } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle, faMapMarkerAlt, faFilter, faPrint, faCubes, faUserXmark, faHouseCircleCheck, faUserCheck, faCircleCheck, faCircleExclamation, faFileInvoiceDollar, faTruckArrowRight, faWarehouse, faList, faRoad, faCircleXmark, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { CancelablePromise, SaleService, type SaleRequest, type SaleResponse } from "../../../api/generated";
import { SaleModal } from "./SaleModal";
import { LocationGoogleMapModal } from "./LocationGoogleMapModal";
import { Pagination } from "../../../components/Pagination";
import { useReactToPrint } from "react-to-print";
import { GetPrintStyle } from "../../../PageStyle";
import { SalePrint } from "./Print/SalePrint";
import { SaleStateColor, type SaleState } from "./SaleStateColor";
import { HistoricSaleModal } from "./HistoricSaleModal";

export const SalePage: React.FC = () => {

  const [refreshSales, setRefreshSales] = useState(false);
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationMapModalOpen, setIsLocationMapModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterSearchString, setFilterSearchString] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const salePrintRef = useRef<HTMLDivElement>(null);
  const [isHistoricSaleModalOpen, setIsHistoricSaleModalOpen] = useState(false);
  const [selectedSalePrint, setSelectedSalePrint] = useState<SaleResponse | null>(null);
  const [salesLoading, setSalesLoading] = useState<SaleResponse[]>([]);

  const RunFilter = ()=>{
    SaleService.saleGetPage({page, countRows: rows, searchString: filterSearchString, skus: []}).then((data) => {
      setTotalRows(data.count);
      setSales(data.values);
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: salePrintRef,
    documentTitle: "Dakali",
    pageStyle: GetPrintStyle("A4")
  });

  useEffect(()=> {
    RunFilter()
  }, [page, rows, refreshSales]);

  useEffect(()=> {
  
      if(selectedSalePrint === null)
        return;
  
      handlePrint();
  
    }, [selectedSalePrint]);

  const ShowError = (message: string) => {
      setErrorMessage(message);
      setErrorOpen(true);
  };

  const SaleEvent = (promiseEvent:CancelablePromise<SaleResponse> , sale:SaleRequest) =>{
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
  
  const SaveLocationService = (saleId:number, latitude:number, longitude:number) => {
    SaleService.saleAddLocation(saleId, longitude, latitude)
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


  const SaveService = async (saleRequest: SaleRequest) => {

      if(saleRequest.id == 0)
      {
        await SaleService.saleCreate(saleRequest)
        .then(()=>{ 
          setRefreshSales(!refreshSales); 
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshSales(!refreshSales);
        });

      }
      else
        await SaleService.saleUpdate(saleRequest).then(()=>{ 
          setRefreshSales(!refreshSales);
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshSales(!refreshSales);
        });

    
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
            <Flex justify={"end"}>
              <Tooltip content="Crear"><Button onClick={CreateEvent}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
            </Flex>
            <Box gridColumn={"span 3"}>
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell width={"5%"}>Numero</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"5%"}>Identificador</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Fecha Emision</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Fecha Entrega</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Horario</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Domicilio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Localidad</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"5%"}>Estado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sales.map(sale => {
                    
                    const state = sale.state as SaleState;
                    if(salesLoading.some(x => x.id === sale.id))
                      return (<Table.Row><Table.Cell colSpan={9}><Skeleton height={"30px"}></Skeleton></Table.Cell></Table.Row>);
                    else 
                      return (
                      <Table.Row key={sale.guid}>
                        <Table.Cell>{sale.number}</Table.Cell>
                        <Table.Cell>{sale.identifier}</Table.Cell>
                        <Table.Cell>{sale.date}</Table.Cell>
                        <Table.Cell>{sale.deliveryDate}</Table.Cell>
                        <Table.Cell>{sale.deliveryStartTime}-{sale.deliveryEndTime}</Table.Cell>
                        <Table.Cell>{sale.address}</Table.Cell>
                        <Table.Cell>{sale.city?.zipCode??""}-{sale.city?.name??""}</Table.Cell>
                        <Table.Cell><Badge style={{fontWeight: "bold", fontSize: "14px"}} color={SaleStateColor[state]}>{sale.state}</Badge></Table.Cell>
                        <Table.Cell>
                          <Flex gap={"1"}>
                            {(sale.state === "Creado" || sale.state === "Confirmado") && (<Tooltip content="Editar"><Button onClick={() => { EditEvent(sale);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>)}
                            {(sale.state === "Creado") && (<Tooltip content="Confirmado"><Button onClick={() => { SaleEvent(SaleService.saleConfirm(sale.id), sale); }} color={SaleStateColor.Confirmado}><FontAwesomeIcon icon={faCircleCheck} /></Button></Tooltip>)}
                            {(sale.state === "Creado" || sale.state === "Confirmado") && (<Tooltip content="Eliminar"><Button onClick={() => { SaleEvent(SaleService.saleDelete(sale), sale); }} color={SaleStateColor.Anulado}><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>)}
                            {(sale.state === "Confirmado") && (<Tooltip content="Preparado"><Button onClick={() => { SaleEvent(SaleService.salePrepared(sale.id), sale); }} color={SaleStateColor.Preparado}><FontAwesomeIcon icon={faCubes} /></Button></Tooltip>)}
                            {(sale.state === "Preparado") && (<Tooltip content="Pendiente Despachar"><Button onClick={() => { SaleEvent(SaleService.salePendingDispatch(sale.id), sale); }} color={SaleStateColor.PendienteDespachar}><FontAwesomeIcon icon={faTruckArrowRight} /></Button></Tooltip>)}
                            {(sale.state === "PendienteDespachar") && (<Tooltip content="En Viaje"><Button onClick={() => { SaleEvent(SaleService.saleOnTrip(sale.id), sale); }} color={SaleStateColor.EnViaje}><FontAwesomeIcon icon={faRoad} /></Button></Tooltip>)}
                            {(sale.state === "Preparado" || sale.state === "PendienteDespachar") && (<Tooltip content="Cancelar"><Button onClick={() => { SaleEvent(SaleService.saleCancel(sale.id), sale); }} color={SaleStateColor.Cancelado}><FontAwesomeIcon icon={faCircleXmark} /></Button></Tooltip>)}
                            {(sale.state === "EnViaje") && (<Tooltip content="Rechazado"><Button onClick={() => { SaleEvent(SaleService.saleReject(sale.id), sale); }} color={SaleStateColor.Rechazado}><FontAwesomeIcon icon={faUserXmark} /></Button></Tooltip>)}
                            {(sale.state === "Rechazado" || sale.state === "Cancelado") && (<Tooltip content="Devuelto"><Button onClick={() => { SaleEvent(SaleService.saleReturn(sale.id), sale); }} color={SaleStateColor.Devuelto}><FontAwesomeIcon icon={faHouseCircleCheck} /></Button></Tooltip>)}
                            {(sale.state === "Devuelto") && (<Tooltip content="Almacenar"><Button onClick={() => { SaleEvent(SaleService.saleStored(sale.id), sale); }} color={SaleStateColor.Almacenado}><FontAwesomeIcon icon={faWarehouse} /></Button></Tooltip>)}
                            {(sale.state === "EnViaje") && (<Tooltip content="Entregado"><Button onClick={() => { SaleEvent(SaleService.saleDeliver(sale.id), sale); }} color={SaleStateColor.Entregado}><FontAwesomeIcon icon={faUserCheck} /></Button></Tooltip>)}
                            {(sale.state === "EnViaje") && (<Tooltip content="Entregado Parcial"><Button onClick={() => { SaleEvent(SaleService.salePartialDeliver(sale.id), sale); }} color={SaleStateColor.EntregadoParcial}><FontAwesomeIcon icon={faBoxOpen} /></Button></Tooltip>)}
                            {(sale.state === "Entregado" || sale.state === "EntregadoParcial") && (<Tooltip content="Pendiente de Facturar"><Button onClick={() => { SaleEvent(SaleService.salePendingBilling(sale.id), sale); }} color={SaleStateColor.PendienteFacturar}><FontAwesomeIcon icon={faCircleExclamation} /></Button></Tooltip>)}
                            {(sale.state === "PendienteFacturar") && (<Tooltip content="Facturado"><Button onClick={() => { SaleEvent(SaleService.saleInvoiced(sale.id), sale); }} color={SaleStateColor.Facturado}><FontAwesomeIcon icon={faFileInvoiceDollar} /></Button></Tooltip>)}
                            {(sale.state === "Creado" || sale.state === "Confirmado" || sale.state === "Preparado" || sale.state === "PendienteDespachar") && (<Tooltip content="Localizar"><Button color="orange" onClick={() => { LocationMapEvent(sale);}}><FontAwesomeIcon icon={faMapMarkerAlt} /></Button></Tooltip>)}
                            <Tooltip content="Imprimir"><Button color="blue" onClick={() => { SaleService.saleGet(sale?.id).then(data => setSelectedSalePrint(data)); }}><FontAwesomeIcon icon={faPrint} /></Button></Tooltip>
                            <Tooltip content="Historico"><Button onClick={() => { setIsHistoricSaleModalOpen(true); setSelectedSale(sale);}}><FontAwesomeIcon icon={faList} /></Button></Tooltip>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
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
