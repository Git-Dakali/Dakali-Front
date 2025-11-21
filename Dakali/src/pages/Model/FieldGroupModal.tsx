import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Tooltip, Table } from "@radix-ui/themes";
import type { FieldGroupRequest, FieldGroupResponse, FieldRequest, FieldResponse } from "../../api/generated";
import { Pencil1Icon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { FieldModal } from "./FieldModal";

type FieldGroupModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldGroup: FieldGroupResponse | null;         // null = crear
  onSave: (values: FieldGroupRequest) => Promise<void> | void;
};

export const FieldGroupModal: React.FC<FieldGroupModalProps> = ({
  open,
  onOpenChange,
  fieldGroup,
  onSave,
}) => {
  const [name, setName] = useState(fieldGroup?.name ?? "");
  const [sortOrder, setSortOrder] = useState(fieldGroup?.sortOrder ?? 0);
  const [fields, setFields] = useState(fieldGroup?.fields ?? []);
  const [isModalFieldOpen, setIsModalFieldOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldResponse | null>(null);

  const handleSubmit = () => {
    onSave({ id: fieldGroup?.id ?? 0, name, sortOrder, fields });
    onOpenChange(false);
    setFields([]);
  };

  const CreateFieldEvent =  () =>{
      setSelectedField(null);
      setIsModalFieldOpen(true);
    };
  
    const DeleteFieldEvent = (field:FieldResponse) =>{
      setFields(fields.filter(x => x.name.toUpperCase() !== field.name.toUpperCase()));
    };
  
    const EditFieldEvent = (field:FieldResponse) =>{
      setSelectedField(field);
      setIsModalFieldOpen(true);
    };
  
    const SaveFieldService = (fieldRequest: FieldRequest) => {
        const value = fields.find(x => x.name.toUpperCase() === fieldRequest.name.toUpperCase())??null;
  
        if(value === null)
        {
          fields.push(fieldRequest);
          setFields(fields);
        }
        else{
          value.id = fieldRequest.id;
          value.name = fieldRequest.name;
          value.sortOrder = fieldRequest.sortOrder;
  
          setFields(fields);
        }
    };

  const title = fieldGroup ? "Editar Grupo" : "Crear Grupo";

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{title}</Dialog.Title>
          
          <Grid columns="3fr 1fr" gap="3" rows="auto 1fr auto" width="100%" height="100%">
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Nombre</Text>
              <TextField.Root value={name} onChange={(e) => setName(e.target.value)}/>
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Orden</Text>
              <TextField.Root
                value={sortOrder}
                onChange={(e) => setSortOrder(Number.parseInt(e.target.value))}
                required
              />
            </Box>
            <Box gridColumn={"span 2"}>
              <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
                  <Flex justify={"end"}>
                      <Tooltip content="Crear"><Button onClick={CreateFieldEvent}><PlusCircledIcon/></Button></Tooltip>
                  </Flex>
                  <Box>
                      <Table.Root variant="surface">
                          <Table.Header>
                          <Table.Row>
                              <Table.ColumnHeaderCell width={"50%"}>Campo</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell width={"20%"}>Orden</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell width={"30%"}>Acciones</Table.ColumnHeaderCell>
                          </Table.Row>
                          </Table.Header>
                          <Table.Body>
                          {fields.map(field => {
                              return (
                              <Table.Row key={field.name}>
                                  <Table.Cell>{field.name}</Table.Cell>
                                  <Table.Cell>{field.sortOrder}</Table.Cell>
                                  <Table.Cell>
                                      <Tooltip content="Editar"><Button onClick={() => { EditFieldEvent(field);}}><Pencil1Icon/></Button></Tooltip>
                                      <Tooltip content="Eliminar"><Button onClick={() => { DeleteFieldEvent(field);}} color="red"><TrashIcon/></Button></Tooltip>
                                  </Table.Cell>
                              </Table.Row>
                              );
                          })}
                          </Table.Body>
                      </Table.Root>
                  </Box>
              </Grid>
            </Box>
            <Box></Box>
            <Flex justify="end" gap="2" mt="3">
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
      {isModalFieldOpen && (
        <FieldModal
          key={selectedField?.id ?? "new"}  
          open={isModalFieldOpen}
          onOpenChange={setIsModalFieldOpen}
          field={selectedField}
          onSave={SaveFieldService}
        />
      )}
    </>
  );
};