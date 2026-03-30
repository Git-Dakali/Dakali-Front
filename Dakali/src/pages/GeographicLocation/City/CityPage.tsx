import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading, TextField } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle, faFilter } from '@fortawesome/free-solid-svg-icons';
import { CityService } from "../../../api/generated/services/CityService"
import { CityModal } from "./CityModal"
import { ErrorModal } from "../../../components/ErrorModal";
import type { CityRequest, CityResponse } from "../../../api/generated";
import { Pagination } from "../../../components/Pagination";

export const CityPage: React.FC = () => {

  const [refreshCities, setRefreshCities] = useState(false);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterSearchString, setFilterSearchString] = useState<string>("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const RunFilter = ()=>{
    CityService.cityGetPage({page, countRows: rows, searchString: filterSearchString}).then((data) => {
      setTotalRows(data.count);
      setCities(data.values);
    });
  };

  useEffect(()=> {
    RunFilter()
  }, [page, rows, refreshCities]);

  const DeleteEvent = (city:CityRequest) =>{
    CityService.cityDelete(city).then(()=>{ setRefreshCities(!refreshCities); });
  };

  const CreateEvent =  () =>{
    setSelectedCity(null);
    setIsModalOpen(true);
  };

  const EditEvent = (entity:CityResponse) =>{
    setSelectedCity(entity);
    setIsModalOpen(true);
  };
  
  const SaveService = async (cityRequest: CityRequest) => {

      if(cityRequest.id == 0)
      {
        await CityService.cityCreate(cityRequest)
        .then(()=>{ 
          setRefreshCities(!refreshCities);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshCities(!refreshCities);
        });

      }
      else
        await CityService.cityUpdate(cityRequest)
        .then(()=>{ 
          setRefreshCities(!refreshCities);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshCities(!refreshCities);
        });
  };

  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Localidad</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"25%"}>Pais</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"25%"}>Provincia</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Codigo Postal</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"25%"}>Nombre</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {cities.map(city => {
                    return (
                      <Table.Row key={city.id}>
                        <Table.Cell>{city.province?.country?.name}</Table.Cell>
                        <Table.Cell>{city.province?.name}</Table.Cell>
                        <Table.Cell>{city.zipCode}</Table.Cell>
                        <Table.Cell>{city.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(city);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(city as CityRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
        <CityModal
          key={selectedCity?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          city={selectedCity}
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
