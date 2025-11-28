import React, { useState, useEffect } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Select, Tabs, Tooltip, Table } from "@radix-ui/themes";
import { type CategoryRequest, type CategoryResponse, type FieldGroupRequest, type FieldGroupResponse, type ModelRequest, type ModelResponse, type SizeRequest, type SizeResponse, CategoryService, ModelService } from "../../api/generated";
import { Pencil1Icon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { SizeModal } from "./SizeModal";
import { FieldGroupModal } from "./FieldGroupModal";

type ModelModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: ModelResponse | null; 
  onSave: (values: ModelRequest) => Promise<void> | void;
};

export const ModelModal : React.FC<ModelModalProps> = ({
  open,
  onOpenChange,
  model,
  onSave
}) => {
  const [modelPersisted, setModelPersisted] = useState<ModelResponse|null>(model);
  const [code, setCode] = useState(modelPersisted?.code ?? "");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  
  const [sizes, setSizes] = useState<SizeResponse[]>(modelPersisted?.sizes ?? []);
  const [isModalSizeOpen, setIsModalSizeOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeResponse | null>(null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>(modelPersisted?.category.code??"");

  const [fieldGroups, setFieldGroups] = useState<FieldGroupResponse[]>(modelPersisted?.fieldGroups ?? []);
  const [isModalFieldGroupsOpen, setIsModalFieldGroupsOpen] = useState(false);
  const [selectedFieldGroup, setSelectedFieldGroup] = useState<FieldGroupResponse | null>(null);

  useEffect(()=> {
    CategoryService.categoryGetAll().then((data)=>{
      setCategories(data);

      if(model !== null && model !== undefined)
      {
        ModelService.modelGet(model?.id).then((data) =>{
          setModelPersisted(data);
          setSizes(data.sizes);
          setFieldGroups(data.fieldGroups);
          setSelectedCategoryCode(data.category.code);
        });
      }
    });
  }, []);

  const handleSubmit = () => {
    const category = categories.find(c => c.code === selectedCategoryCode)?? null;
    const modelRequest = {} as ModelRequest;
    modelRequest.id = modelPersisted?.id ?? 0;
    modelRequest.guid = crypto.randomUUID();
    modelRequest.code = code;
    modelRequest.searchString = "";
    modelRequest.category = category as CategoryRequest;
    modelRequest.fieldGroups = fieldGroups as FieldGroupRequest[];
    modelRequest.sizes = sizes as SizeRequest[];

    onSave(modelRequest);
  };

  const CreateSizeEvent =  () =>{
    setSelectedSize(null);
    setIsModalSizeOpen(true);
  };

  const DeleteSizeEvent = (size:SizeResponse) =>{
    setSizes(sizes.filter(x => x.guid !== size.guid));
  };

  const EditSizeEvent = (size:SizeResponse) =>{
    setSelectedSize(size);
    setIsModalSizeOpen(true);
  };

  const SaveSizeService = (sizeRequest: SizeRequest) => {
      const value = sizes.find(x => x.guid === sizeRequest.guid) ?? null;

      if(value === null)
      {
        sizes.push(sizeRequest);
        setSizes(sizes);
      }
      else{
        value.id = sizeRequest.id;
        value.name = sizeRequest.name;
        value.sortOrder = sizeRequest.sortOrder;

        setSizes(sizes);
      }
  };

  const CreateGroupFieldsEvent =  () =>{
    setSelectedFieldGroup(null);
    setIsModalFieldGroupsOpen(true);
  };

  const DeleteFieldGroupEvent = (group:FieldGroupResponse) =>{
    setFieldGroups(fieldGroups.filter(x => x.guid !== group.guid));
  };
  
  const EditFieldGroupEvent = (group:FieldGroupResponse) =>{
    setSelectedFieldGroup(group);
    setIsModalFieldGroupsOpen(true);
  };

  const SaveFieldGroupService = (groupRequest: FieldGroupRequest) => {
      const value = fieldGroups.find(x => x.guid === groupRequest.guid) ?? null;

      if(value === null)
      {
        fieldGroups.push(groupRequest);
        setFieldGroups(fieldGroups);
      }
      else{
        value.id = groupRequest.id;
        value.name = groupRequest.name;
        value.sortOrder = groupRequest.sortOrder;

        setFieldGroups(fieldGroups);
      }
  };

  const title = modelPersisted ? "Editar Modelo" : "Crear Modelo";

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="50%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{title}</Dialog.Title>

          <Grid columns="1fr 3fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
              {
                  modelPersisted ? 
                  (<TextField.Root value={code} onChange={(e) => setCode(e.target.value)} disabled />) : 
                  (<TextField.Root value={code} onChange={(e) => setCode(e.target.value)}/>)
              }
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Categoria</Text>
              <Select.Root value={selectedCategoryCode} onValueChange={setSelectedCategoryCode}>
                  <Select.Trigger placeholder="Seleccione una Categoria"/>
                  <Select.Content>
                    {
                      categories.map((item)=>{
                        return (<Select.Item key={item.id} value={item.code}>{item.code}-{item.name}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box gridColumn={"span 2"}>
              <Tabs.Root defaultValue="Size">
                <Tabs.List>
                  <Tabs.Trigger value="Size">Variantes</Tabs.Trigger>
                  <Tabs.Trigger value="Information">Caracteristicas</Tabs.Trigger>
                </Tabs.List>

                <Box pt="3">
                  <Tabs.Content value="Size">
                    <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
                        <Flex justify={"end"}>
                            <Tooltip content="Crear"><Button onClick={CreateSizeEvent}><PlusCircledIcon/></Button></Tooltip>
                        </Flex>
                        <Box>
                            <Table.Root variant="surface">
                                <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell width={"75%"}>Name</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell width={"10%"}>Orden</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                {sizes.map(size => {
                                    return (
                                    <Table.Row key={size.name}>
                                        <Table.Cell>{size.name}</Table.Cell>
                                        <Table.Cell>{size.sortOrder}</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content="Editar"><Button onClick={() => { EditSizeEvent(size);}}><Pencil1Icon/></Button></Tooltip>
                                            <Tooltip content="Eliminar"><Button onClick={() => { DeleteSizeEvent(size);}} color="red"><TrashIcon/></Button></Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                    );
                                })}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Grid>
                  </Tabs.Content>
                  <Tabs.Content value="Information">
                    <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
                        <Flex justify={"end"}>
                            <Tooltip content="Crear"><Button onClick={CreateGroupFieldsEvent}><PlusCircledIcon/></Button></Tooltip>
                        </Flex>
                        <Box>
                            <Table.Root variant="surface">
                                <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell width={"75%"}>Name</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell width={"10%"}>Orden</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                                </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                {fieldGroups.map(group => {
                                    return (
                                    <Table.Row key={group.name}>
                                        <Table.Cell>{group.name}</Table.Cell>
                                        <Table.Cell>{group.sortOrder}</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content="Editar"><Button onClick={() => { EditFieldGroupEvent(group);}}><Pencil1Icon/></Button></Tooltip>
                                            <Tooltip content="Eliminar"><Button onClick={() => { DeleteFieldGroupEvent(group);}} color="red"><TrashIcon/></Button></Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                    );
                                })}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    </Grid>
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            </Box>
            <Box></Box>
            <Flex justify="end" gap="2" mt="3">
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
      {isModalSizeOpen && (
        <SizeModal
          key={selectedSize?.id ?? "new"}  
          open={isModalSizeOpen}
          onOpenChange={setIsModalSizeOpen}
          size={selectedSize}
          onSave={SaveSizeService}
        />
      )}

      {isModalFieldGroupsOpen && (
        <FieldGroupModal
          key={selectedFieldGroup?.id ?? "new"}  
          open={isModalFieldGroupsOpen}
          onOpenChange={setIsModalFieldGroupsOpen}
          fieldGroup={selectedFieldGroup}
          onSave={SaveFieldGroupService}
        />
      )}
    </>
  );
};