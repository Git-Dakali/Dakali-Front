import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { CountryService } from "../../../api/generated/services/CountryService"
import { CountryModal } from "./CountryModal"
import { ErrorModal } from "../../../components/ErrorModal";
import type { CountryRequest, CountryResponse } from "../../../api/generated";

export const CountryPage: React.FC = () => {

  const [refreshCountries, setRefreshCountries] = useState(false);
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    CountryService.countryGetAll().then(data => {setCountries(data)});
  }, [refreshCountries]);

  const DeleteEvent = (category:CountryRequest) =>{
    CountryService.countryDelete(category).then(()=>{ setRefreshCountries(!refreshCountries); });
  };

  const CreateEvent =  () =>{
    setSelectedCountry(null);
    setIsModalOpen(true);
  };

  const EditEvent = (entity:CountryResponse) =>{
    setSelectedCountry(entity);
    setIsModalOpen(true);
  };
  
  const SaveService = async (countryRequest: CountryRequest) => {

      if(countryRequest.id == 0)
      {
        await CountryService.countryCreate(countryRequest)
        .then(()=>{ 
          setRefreshCountries(!refreshCountries);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshCountries(!refreshCountries);
        });

      }
      else
        await CountryService.countryUpdate(countryRequest)
        .then(()=>{ 
          setRefreshCountries(!refreshCountries);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshCountries(!refreshCountries);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Pais</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"5%"}>Id</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"10%"}>Codigo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"70%"}>Nombre</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {countries.map(country => {
                    return (
                      <Table.Row key={country.id}>
                        <Table.Cell>{country.id}</Table.Cell>
                        <Table.Cell>{country.code}</Table.Cell>
                        <Table.Cell>{country.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(country);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(country as CountryRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
        <CountryModal
          key={selectedCountry?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          country={selectedCountry}
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
