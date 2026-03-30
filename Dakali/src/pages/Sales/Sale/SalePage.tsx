import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle, faMapMarkerAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ErrorModal } from "../../../components/ErrorModal";
import { SaleService, type SaleRequest, type SaleResponse } from "../../../api/generated";
import { SaleModal } from "./SaleModal";
import { LocationGoogleMapModal } from "./LocationGoogleMapModal";
import { Pagination } from "../../../components/Pagination";

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

  const RunFilter = ()=>{
    SaleService.saleGetPage({page, countRows: rows, searchString: filterSearchString, skus: []}).then((data) => {
      setTotalRows(data.count);
      setSales(data.values);
    });
  };

  useEffect(()=> {
    RunFilter()
  }, [page, rows, refreshSales]);

  const DeleteEvent = (sale:SaleRequest) =>{
    SaleService.saleDelete(sale).then(()=>{ setRefreshSales(!refreshSales); });
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
                    <Table.ColumnHeaderCell width={"5%"}>Nro Arca</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Fecha Emision</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Fecha Entrega</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Horario</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Domicilio</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"20%"}>Localidad</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sales.map(sale => {
                    return (
                      <Table.Row key={sale.guid}>
                        <Table.Cell>{sale.number}</Table.Cell>
                        <Table.Cell>{sale.identifier}</Table.Cell>
                        <Table.Cell>{sale.arcaNumber}</Table.Cell>
                        <Table.Cell>{sale.date}</Table.Cell>
                        <Table.Cell>{sale.deliveryDate}</Table.Cell>
                        <Table.Cell>{sale.deliveryStartTime}-{sale.deliveryEndTime}</Table.Cell>
                        <Table.Cell>{sale.address}</Table.Cell>
                        <Table.Cell>{sale.city?.zipCode??""}-{sale.city?.name??""}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(sale);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Localizar"><Button onClick={() => { LocationMapEvent(sale);}}><FontAwesomeIcon icon={faMapMarkerAlt} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(sale as SaleRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
      <ErrorModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
    </>
    
  );
};
