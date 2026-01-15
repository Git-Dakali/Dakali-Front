import React, {useEffect, useState} from "react";
import { Grid, Box, Table, Button, Flex, Tooltip, Heading } from "@radix-ui/themes";
import { PlusCircledIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { ColumnModal } from "./ColumnModal"
import { ErrorModal } from "../../components/ErrorModal";
import { ColumnService, type ColumnRequest, type ColumnResponse } from "../../api/generated";

export const ColumnPage: React.FC = () => {

  const [refreshColumns, setRefreshColumns] = useState(false);
  const [columns, setColumns] = useState<ColumnResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ColumnResponse | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(()=> {
    ColumnService.columnGetAll().then(data => {setColumns(data)});
  }, [refreshColumns]);

  const DeleteEvent = (column:ColumnRequest) =>{
    ColumnService.columnDelete(column).then(()=>{ setRefreshColumns(!refreshColumns); });
  };

  const CreateEvent =  () =>{
    setSelectedColumn(null);
    setIsModalOpen(true);
  };

  const EditEvent = (column:ColumnResponse) =>{
    setSelectedColumn(column);
    setIsModalOpen(true);
  };
  
  const SaveService = async (columnRequest: ColumnRequest) => {

      if(columnRequest.id == 0)
      {
        await ColumnService.columnCreate(columnRequest)
        .then(()=>{ 
          setRefreshColumns(!refreshColumns); 
          setIsModalOpen(false); 
        })
        .catch((error) => 
          { 
            console.log({error});
            setErrorMessage(error.body.message);
            setErrorOpen(true);
            setRefreshColumns(!refreshColumns);
          });

      }
      else
        await ColumnService.columnUpdate(columnRequest)
        .then(()=>{ 
          setRefreshColumns(!refreshColumns);
          setIsModalOpen(false);  
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
          setRefreshColumns(!refreshColumns);
        });

    
  };
  return (
    <>
      <Grid columns="1fr 100fr 1fr" gap="1" rows="1fr 10fr 1fr" width="auto" height="100%">
        <Box gridColumn={"span 2"}><Heading size="8">Columna</Heading></Box>
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
                  {columns.map(column => {
                    return (
                      <Table.Row key={column.guid}>
                        <Table.Cell>{column.code}</Table.Cell>
                        <Table.Cell>{column.name}</Table.Cell>
                        <Table.Cell>
                          <Tooltip content="Editar"><Button onClick={() => { EditEvent(column);}}><Pencil1Icon/></Button></Tooltip>
                          <Tooltip content="Eliminar"><Button onClick={() => { DeleteEvent(column as ColumnRequest);}} color="red"><TrashIcon/></Button></Tooltip>
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
        <ColumnModal
          key={selectedColumn?.id ?? "new"}  
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          column={selectedColumn}
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
