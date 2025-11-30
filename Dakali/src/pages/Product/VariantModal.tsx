import React, { useMemo, useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Checkbox, Tabs, Tooltip, Table } from "@radix-ui/themes";
import type { ColorRequest, ColorResponse, ImageResponse, ModelResponse, PropertyGroupRequest, PropertyGroupResponse, PropertyResponse, VariantRequest, VariantResponse } from "../../api/generated";
import { TrashIcon, PlusCircledIcon, FileIcon } from "@radix-ui/react-icons";
import { PropertyGroupComponent } from "./PropertyGroupComponent";
import { ImageModal } from "./ImageModal";

type VariantModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: VariantResponse; 
  model: ModelResponse | null;
  onSave: (values: VariantRequest) => Promise<void> | void;
};

export const VariantModal: React.FC<VariantModalProps> = ({
  open,
  onOpenChange,
  variant,
  model,
  onSave,
}) => {
  const [name, setName] = useState(variant?.name ?? "");
  const [price, setPrice] = useState(variant?.price ?? 0);
  const [salePrice, setSalePrice] = useState(variant?.salePrice ?? 0);
  const [active, setActive] = useState(variant?.active ?? false);
  const [sortOrder, setSortOrder] = useState(variant?.sortOrder ?? 0);

  const [colors, setColors] = useState(variant?.colorsHex ?? []);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState({} as ColorResponse);

  const groups = useMemo<PropertyGroupResponse[]>(() => {
      const listGroupAdd:PropertyGroupResponse[] = [];

      model?.fieldGroups?.forEach((fieldGroup) => {
          const existPropertyGroup = variant.propertyGroups?.some(group => group.name.toUpperCase() === fieldGroup.name.toUpperCase())
  
          if(!existPropertyGroup)
          {
            const properties = fieldGroup.fields.map(f => {
              return {id: 0, guid: crypto.randomUUID(), field: f.name, value: "", searchString: ""} as PropertyResponse;
            });

            listGroupAdd.push({ id: 0, guid: crypto.randomUUID(), name: fieldGroup.name, sortOrder: 0, searchString: "", properties: properties });
          }
      });
  
      return listGroupAdd.concat(variant.propertyGroups);
  }, [model, variant.propertyGroups]);

  const handleSubmit = () => {
    onSave({ id: variant.id, guid: variant?.guid, name, price, salePrice, active, sortOrder, searchString: "", propertyGroups: groups as PropertyGroupRequest[], colorsHex: colors as ColorRequest[]});
    onOpenChange(false);
  };

  const changeColorName = (color: ColorResponse, newName: string) => {
    const newColors = colors.filter(() => true); 
    const findColor = newColors.find((c)=> c.guid === color.guid);

    if(findColor)
        findColor.name = newName;

    setColors(newColors);
  };

  const changeColorSortOrder = (color: ColorResponse, newSortOrder: number) => {
    const newColors = colors.filter(() => true); 
    const findColor = newColors.find((c)=> c.guid === color.guid);

    if(findColor)
        findColor.sortOrder = newSortOrder;

    setColors(newColors);
  };

  const changeColorHex = (color: ColorResponse, newHEX: string) => {
    const newColors = colors.filter(() => true); 
    const findColor = newColors.find((c)=> c.guid === color.guid);

    if(findColor)
        findColor.hex = newHEX;
    setColors(newColors);
  };

  const createColorEvent = () => {
    const newColors:ColorResponse[] = [];
    const newColor:ColorResponse = { id: 0, name: "Blanco", hex:"#ffffff", sortOrder: 0, guid: crypto.randomUUID(), searchString: "", images: []};
    newColors.push(newColor);
    
    setColors(newColors.concat(colors));
  };

  const deleteColorEvent = (color: ColorResponse)=> {
    setColors(colors.filter((c)=> c.guid !== color.guid));
  };

  const saveColors = (values: ImageResponse[]) => {
    const newsColors = colors.filter(() => true);
    const findColor = newsColors.find(c => c.guid === selectedColor.guid) ?? null;
    
    if(findColor !== null)
      findColor.images = values;

    setColors(newsColors);
  };

  const changePropertyGroup = (group: PropertyGroupResponse) =>{
    const findGroup = groups.find(g => g.name.toUpperCase() === group.name.toUpperCase())?? null;

    if(findGroup === null)
      return;

    findGroup.properties = group.properties;
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="70%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>Modificar Variante</Dialog.Title>

          <Grid columns="3fr 1fr 1fr 1fr 1fr" gap="3" rows="auto auto 1fr auto" width="100%">
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Nombre</Text>
              <TextField.Root value={name} onChange={(e) => setName(e.target.value)} disabled/>
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Precio Compra</Text>
              <TextField.Root
                value={price}
                onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
                required
              />
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Precio Venta</Text>
              <TextField.Root
                value={salePrice}
                onChange={(e) => setSalePrice(Number.parseFloat(e.target.value))}
                required
              />
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Orden</Text>
              <TextField.Root
                value={sortOrder}
                onChange={(e) => setSortOrder(Number.parseFloat(e.target.value))}
                required
              />
            </Box>
            <Box style={{alignContent: "center"}}>
              <Text size="2" mb="1" style={{ display: "block" }}>
                  <Flex gap="2">
                      <Checkbox defaultChecked checked={active} onCheckedChange={(value) => setActive(value as boolean)} />
                      Activo
                  </Flex>
              </Text>
            </Box>
            <Box gridColumn={"span 5"}>
              <Tabs.Root defaultValue="Properties">
              <Tabs.List>
                  <Tabs.Trigger value="Properties">Caracteristicas</Tabs.Trigger>
                  <Tabs.Trigger value="Colors">Colores</Tabs.Trigger>
              </Tabs.List>

              <Box pt="3">
                  <Tabs.Content value="Properties">
                      <Grid rows="1fr" columns="1" width={"100%"} gap={"2"}>
                          <Box>
                              {
                                groups.map(g=> {
                                  const findFieldGroup = model?.fieldGroups.find(fg => fg.name.toUpperCase() === g.name.toUpperCase());
                                  return(<PropertyGroupComponent key={g.guid} propertyGroup={g} fieldGroup={findFieldGroup ?? null} onChange={changePropertyGroup}></PropertyGroupComponent>);
                                })
                              }
                          </Box>
                      </Grid>
                  </Tabs.Content>
                  <Tabs.Content value="Colors">
                      <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
                          <Flex justify={"end"}>
                              <Tooltip content="Crear"><Button onClick={createColorEvent}><PlusCircledIcon/></Button></Tooltip>
                          </Flex>
                          <Box>
                              <Table.Root variant="surface" size={"1"}>
                                  <Table.Header>
                                  <Table.Row>
                                      <Table.ColumnHeaderCell width={"55%"}>Nombre</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell width={"15%"}>Color</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell width={"15%"}>Orden</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                                  </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                  {colors.map(color => {
                                      return (
                                      <Table.Row key={color.guid}>
                                          <Table.Cell><TextField.Root value={color.name} onChange={(e) => changeColorName(color, e.target.value)}/></Table.Cell>
                                          <Table.Cell><input type="color" value={color.hex} onChange={(e) => changeColorHex(color, e.target.value)} /></Table.Cell>
                                          <Table.Cell><TextField.Root value={color.sortOrder} onChange={(e) => changeColorSortOrder(color, Number.parseInt(e.target.value))}/></Table.Cell>
                                          <Table.Cell>
                                            <Tooltip content="Eliminar"><Button onClick={() => { deleteColorEvent(color);}} color="red"><TrashIcon/></Button></Tooltip>
                                            <Tooltip content="Ver Imagenes"><Button onClick={() => { setSelectedColor(color); setIsColorModalOpen(true)}} color="blue"><FileIcon/></Button></Tooltip>
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
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 5"}>
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
      {isColorModalOpen && (
        <ImageModal
          key={selectedColor?.guid}  
          open={isColorModalOpen}
          onOpenChange={setIsColorModalOpen}
          imagesColor={selectedColor.images}
          onSave={saveColors}
        />
      )}
    </>
  );
};