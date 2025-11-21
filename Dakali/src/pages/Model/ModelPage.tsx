import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ModelService } from "../../api/generated/services/ModelService"
import { ModelModal } from "./ModelModal"
import { ErrorModal } from "../../components/ErrorModal";
import type { ModelRequest, ModelResponse } from "../../api/generated";

export const ModelPage: React.FC = () => {

  const [refreshModels, setRefreshModels] = useState(false);
  const [models, setModels] = useState<ModelResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    ModelService.modelGetAll().then(data => {setModels(data)});
  }, [refreshModels]);

  const DeleteEvent = (model:ModelResponse) =>{
    ModelService.modelDelete(model).then(()=>{ setRefreshModels(!refreshModels); });
  };

  const CreateEvent =  () =>{
    setSelectedModel(null);
    setIsModalOpen(true);
  };

  const EditEvent = (category:ModelResponse) =>{
    setSelectedModel(category);
    setIsModalOpen(true);
  };
  
  const SaveService = async (modelRequest: ModelRequest) => {

      if(modelRequest.id == 0)
      {
        await ModelService.modelCreate(modelRequest)
        .then(()=>{ 
            setRefreshModels(!refreshModels); 
            setIsModalOpen(false);
        })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body);
            setErrorOpen(true);
            setRefreshModels(!refreshModels);
          });

      }
      else
        await ModelService.modelUpdate(modelRequest).then(()=>{ 
            setRefreshModels(!refreshModels); 
            setIsModalOpen(false);
        })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body);
            setErrorOpen(true);
            setRefreshModels(!refreshModels);
          });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Modelo</Heading></Box>
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
                            <Table.ColumnHeaderCell width={"5%"}>Id</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"10%"}>Code</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"70%"}>Categoria</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {models.map(model => {
                            return (
                            <Table.Row key={model.id}>
                                <Table.Cell>{model.id}</Table.Cell>
                                <Table.Cell>{model.code}</Table.Cell>
                                <Table.Cell>{model.category.code} - {model.category.name}</Table.Cell>
                                <Table.Cell>
                                    <Tooltip content="Editar"><Button onClick={() => { EditEvent(model);}}><Pencil1Icon/></Button></Tooltip>
                                    <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(model);}} color="red"><TrashIcon/></Button></Tooltip>
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
        <ModelModal
          key={selectedModel?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          model={selectedModel}
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
