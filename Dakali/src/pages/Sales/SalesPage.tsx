import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ErrorModal } from "../../components/ErrorModal";
import { LevelService, type ColumnRequest, type LevelRequest, type LevelResponse } from "../../api/generated";
import { LevelModal } from "../Level/LevelModal";

export const SalesPage: React.FC = () => {

  const [refreshLevels, setRefreshLevels] = useState(false);
  const [levels, setLevels] = useState<LevelResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LevelResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    LevelService.levelGetAll().then(data => {setLevels(data)});
  }, [refreshLevels]);

  const DeleteEvent = (level:LevelRequest) =>{
    LevelService.levelDelete(level).then(()=>{ setRefreshLevels(!refreshLevels); });
  };

  const CreateEvent =  () =>{
    setSelectedLevel(null);
    setIsModalOpen(true);
  };

  const EditEvent = (level:LevelResponse) =>{
    setSelectedLevel(level);
    setIsModalOpen(true);
  };
  
  const SaveService = async (levelRequest: LevelRequest) => {

      if(levelRequest.id == 0)
      {
        await LevelService.levelCreate(levelRequest)
        .then(()=>{ 
          setRefreshLevels(!refreshLevels); 
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshLevels(!refreshLevels);
        });

      }
      else
        await LevelService.levelUpdate(levelRequest).then(()=>{ 
          setRefreshLevels(!refreshLevels);
          setIsModalOpen(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshLevels(!refreshLevels);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Nivel</Heading></Box>
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
                    <Table.ColumnHeaderCell width={"10%"}>Code</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"70%"}>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {levels.map(level => {
                    return (
                      <Table.Row key={level.guid}>
                        <Table.Cell>{level.code}</Table.Cell>
                        <Table.Cell>{level.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(level);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(level as ColumnRequest);}} color="red"><TrashIcon/></Button></Tooltip>
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
        <LevelModal
          key={selectedLevel?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          level={selectedLevel}
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
