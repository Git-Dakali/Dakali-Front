import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ProvinceService } from "../../../api/generated/services/ProvinceService"
import { ProvinceModal } from "./ProvinceModal"
import { ErrorModal } from "../../../components/ErrorModal";
import type { ProvinceRequest, ProvinceResponse } from "../../../api/generated";

export const ProvincePage: React.FC = () => {

  const [refreshProvinces, setRefreshProvinces] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    ProvinceService.provinceGetAll().then(data => {setProvinces(data)});
  }, [refreshProvinces]);

  const DeleteEvent = (province:ProvinceRequest) =>{
    ProvinceService.provinceDelete(province).then(()=>{ setRefreshProvinces(!refreshProvinces); });
  };

  const CreateEvent =  () =>{
    setSelectedProvince(null);
    setIsModalOpen(true);
  };

  const EditEvent = (entity:ProvinceResponse) =>{
    setSelectedProvince(entity);
    setIsModalOpen(true);
  };
  
  const SaveService = async (provinceRequest: ProvinceRequest) => {

      if(provinceRequest.id == 0)
      {
        await ProvinceService.provinceCreate(provinceRequest)
        .then(()=>{ 
          setRefreshProvinces(!refreshProvinces);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshProvinces(!refreshProvinces);
        });

      }
      else
        await ProvinceService.provinceUpdate(provinceRequest)
        .then(()=>{ 
          setRefreshProvinces(!refreshProvinces);
          setIsModalOpen(false); 
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshProvinces(!refreshProvinces);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Provincia</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"35%"}>Pais</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Codigo</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"35%"}>Nombre</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {provinces.map(province => {
                    return (
                      <Table.Row key={province.id}>
                        <Table.Cell>{province.country?.name}</Table.Cell>
                        <Table.Cell>{province.code}</Table.Cell>
                        <Table.Cell>{province.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(province);}}><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(province as ProvinceRequest);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
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
        <ProvinceModal
          key={selectedProvince?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          province={selectedProvince}
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
