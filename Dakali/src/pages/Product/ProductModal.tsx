import React, { useState, useEffect, useMemo } from "react";
import Select, { } from "react-select"
import { Dialog, Button, Flex, Text, TextField, Box, Grid, TextArea, Tooltip, Table, Tabs, Checkbox } from "@radix-ui/themes";
import { type CategoryRequest, type CategoryResponse, type FieldRequest, type FieldResponse, type ImageRequest, type ProductColorRequest, type ProductColorResponse, type ProductRequest, type ProductResponse, type ProductSkuRequest, type ProductSkuResponse, type VariantRequest, type VariantResponse, CategoryService, ProductService } from "../../api/generated";
import { faCheck, faFile, faPencil, faPlusCircle, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ImageModal } from "./ImageModal";

type ProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductResponse | null; 
  onSave: (values: ProductRequest) => Promise<void> | void;
};

type Option = { value: string; label: string };

export const ProductModal : React.FC<ProductModalProps> = ({
  open,
  onOpenChange,
  product,
  onSave
}) => {
  const [active, setActive] = useState(true);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [weight, setWeight] = useState(0);
  const [fields, setFields] = useState<FieldResponse[]>([]);
  const [variants, setVariants] = useState<VariantResponse[]>([]);
  const [colors, setColors] = useState<ProductColorResponse[]>([]);
  const [productSkus, setProductSkus] = useState<ProductSkuResponse[]>([]);

  const [selectedVariant, setSelectedVariant] = useState<VariantResponse | null>(null);
  const [variantName, setVariantName] = useState("");
  const [variantSortOrder, setVariantSortOrder] = useState(1);

  const [selectedColor, setSelectedColor] = useState<ProductColorResponse | null>(null);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [colorSortOrder, setColorSortOrder] = useState(1);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedColorImage, setSelectedColorImage] = useState<ProductColorResponse | null>(null);
  
  const [listCategory, setListCategory] = useState<CategoryResponse[]>([]);
  const [selectedOptionCategory, setSelectedOptionCategory] = useState<Option|null>();
  const [optionCategory, setOptionCategory] = useState<Option[]>([]);

  const category = useMemo(() => { return listCategory.find(p => p.code === selectedOptionCategory?.value) ?? null; }, [selectedOptionCategory, listCategory]);

  const listSkus = useMemo(() => {
    const values = [] as ProductSkuResponse[];

    colors.forEach(color => {
      variants.forEach(variant => {
        const sku = productSkus.find(s => s.color?.guid === color.guid && s.variant?.guid === variant.guid) ?? null;
        
        if(sku !== null)
          values.push(sku);
        else
          values.push({id: 0, guid: crypto.randomUUID(), searchString: "", color, variant, sku: (code + variant.name + color.name).toUpperCase()});

      });
    });

    return values;
    
  }, [variants, colors, productSkus, code]);

  useEffect(()=> {
    CategoryService.categoryGetAll()
      .then(data => {
        setListCategory(data);
        const valueOptions = data.map(x => { return { value: x.code, label: x.code + "-" + x.name }; }); 
        setOptionCategory(valueOptions); 
      })
      .then(() => {

        if(product !== null && product !== undefined)
        {
          ProductService.productGet(product?.id).then((data) =>{
            setActive(data.active);
            setCode(data.code);
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
            setSalePrice(data.salePrice);
            setWeight(data.weight)
            setFields(data.fields);
            setVariants(data.variants);
            setColors(data.colors);
            setProductSkus(data.skus);

            if(data?.category)
              setSelectedOptionCategory({value: data.category.code, label: data.category.code + "-" + data.category.name});

          });
        }
      });
    
  }, []);

const handleSubmit = () => {
    const newProduct = {} as ProductRequest;
    newProduct.id = product?.id ?? 0; 
    newProduct.guid = crypto.randomUUID();
    newProduct.searchString = ""; 
    newProduct.active = active;
    newProduct.code = code;
    newProduct.name = name;
    newProduct.description = description;
    newProduct.price = price;
    newProduct.salePrice = salePrice;
    newProduct.weight = weight;
    newProduct.category = category as CategoryRequest;
    newProduct.variants = variants as VariantRequest[];
    newProduct.fields = fields as FieldRequest[];
    newProduct.colors = colors as ProductColorRequest[];
    newProduct.skus = listSkus as ProductSkuRequest[];

    onSave(newProduct);
};

  const SaveVariant = (variant: VariantResponse) => {
        variant.name = variantName;
        variant.sortOrder = variantSortOrder;
      
        setVariants(variants.concat([]));
        setSelectedVariant(null);
  };

  const AddVariant = () => {
    const newVariant = {} as VariantResponse;
    newVariant.id = 0;
    newVariant.guid = crypto.randomUUID();
    newVariant.searchString = "";
    newVariant.name = "Variante";
    newVariant.sortOrder = 1;

    setVariants([newVariant].concat(variants));
  };

  const EditVariant = (variant: VariantResponse) => {
    setSelectedVariant(variant);
    setVariantName(variant.name);
    setVariantSortOrder(variant.sortOrder);
  };

  const DeleteVariant = (variant: VariantResponse) => {
    setVariants(variants.filter(x=> x.guid !== variant.guid));
  };

  const SaveColor = (color: ProductColorResponse) => {
        color.name = colorName;
        color.sortOrder = colorSortOrder;
        color.hex = colorHex;
      
        setColors(colors.concat([]));
        setSelectedColor(null);
  };

  const AddColor = () => {
    const newColor = {} as ProductColorResponse;
    newColor.id = 0;
    newColor.guid = crypto.randomUUID();
    newColor.searchString = "";
    newColor.name = "Color";
    newColor.hex = "#ffffff";
    newColor.sortOrder = 1;
    newColor.images = [];

    setColors([newColor].concat(colors));
  };

  const EditColor = (color: ProductColorResponse) => {
    setSelectedColor(color);
    setColorName(color.name);
    setColorHex(color.hex);
    setColorSortOrder(color.sortOrder);
  };

  const SaveImages = (images: ImageRequest[]) => {
    const color = colors.find(x=> x.guid === selectedColorImage?.guid) as ProductColorRequest;
    color.images = images;

    setColors(colors.concat([]));
    setSelectedColorImage(null);

    setIsImageModalOpen(false);

  };

  const DeleteColor = (color: ProductColorResponse) => {
    setColors(colors.filter(x=> x.guid !== color.guid));
  };

  const title = product ? "Editar Producto" : "Crear Producto";
  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="80%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{title}</Dialog.Title>

          <Grid columns="1fr 1fr 1fr 1fr 1fr" gap="3" rows="auto auto 1fr auto" width="auto" height="100%">
            <Box>
              <Box gridColumn={"span 2"}>
                  <Text size="2" mb="1" style={{ display: "block" }}>Categoria</Text>
                  <Select options={optionCategory} value={selectedOptionCategory} onChange={option=> setSelectedOptionCategory(option as Option) }/>
              </Box>
            </Box>
            <Box>
              <Text size="2" mb="1">Codigo</Text>
              <TextField.Root value={code} onChange={(e) => setCode(e.target.value)}/>
            </Box>
            <Box gridColumn={"span 2"}>
              <Text size="2" mb="1">Nombre</Text>
              <TextField.Root value={name} onChange={(e) => setName(e.target.value)}/>
            </Box>
            <Box>
              <Text size="2" mb="1">Habilitado </Text>
              <Flex align="center" gap="2"><Checkbox defaultChecked checked={active} onCheckedChange={() => setActive(!active)} /></Flex>
            </Box>
            <Box>
              <Text size="2" mb="1">Precio</Text>
              <TextField.Root value={price} onChange={(e) => setPrice(Number.parseFloat(e.target.value))}/>
            </Box>
            <Box>
              <Text size="2" mb="1">Precio Venta</Text>
              <TextField.Root value={salePrice} onChange={(e) => setSalePrice(Number.parseFloat(e.target.value))}/>
            </Box>
            <Box>
              <Text size="2" mb="1">Peso en Gramos</Text>
              <TextField.Root value={weight} onChange={(e) => setWeight(Number.parseFloat(e.target.value))}/>
            </Box>
            <Box></Box>
            <Box></Box>
            <Box gridColumn={"span 5"}>
              <Text size="2" mb="1">Descripcion</Text>
              <TextArea value={description} rows={4} onChange={(e) => setDescription(e.target.value)}/>
            </Box>
            <Box gridColumn={"span 5"}>
              <Tabs.Root defaultValue="Variants">
                <Tabs.List>
                    <Tabs.Trigger value="Variants">Variantes</Tabs.Trigger>
                    <Tabs.Trigger value="Colors">Colores</Tabs.Trigger>
                    <Tabs.Trigger value="Skus">SKU</Tabs.Trigger>
                </Tabs.List>
                <Box pt="3">
                    <Tabs.Content value="Variants">
                        <Grid rows="auto 1fr" columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" width={"100%"} gap={"2"}>
                            {selectedVariant && (
                            <>
                              <Box>
                                <Text size="2" mb="1">Nombre</Text>
                                <TextField.Root value={variantName} onChange={(e) => setVariantName(e.target.value)}/>
                              </Box>
                              <Box>
                                <Text size="2" mb="1">Orden</Text>
                                <TextField.Root value={variantSortOrder} onChange={(e) => setVariantSortOrder(Number.parseInt(e.target.value))}/>
                              </Box>
                              <Box>
                                <Text size="2" mb="1">Acciones</Text>
                                <Flex gap={"1"} >
                                  <Tooltip content="Aceptar"><Button onClick={() => { SaveVariant(selectedVariant as VariantResponse);}} color="green"><FontAwesomeIcon icon={faCheck} /></Button></Tooltip>
                                  <Tooltip content="Cancelar"><Button onClick={() => { setSelectedVariant(null);}} color="red"><FontAwesomeIcon icon={faXmark} /></Button></Tooltip>
                                </Flex>
                              </Box>
                              <Box gridColumn={"span 6"}></Box>
                            </>
                          )}
                          {!selectedVariant && (<Box gridColumn={"span 9"}></Box>)}
                            <Flex justify={"end"}>
                                <Tooltip content="Crear"><Button onClick={AddVariant}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
                            </Flex>
                            <Box gridColumn={"span 10"}>
                              <Table.Root variant="surface">
                                  <Table.Header>
                                  <Table.Row>
                                      <Table.ColumnHeaderCell width={"80%"}>Nombre</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell width={"10%"}>Orden</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell width={"10%"}>Acciones</Table.ColumnHeaderCell>
                                  </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                  
                                  {
                                    variants.map(variant => {
                                      const myColor = ((selectedVariant?.guid === variant.guid) ? "#fefbe9" : "")
                                      return (
                                      <Table.Row key={variant.guid} style={{backgroundColor: myColor}}>
                                          <Table.Cell>{variant.name}</Table.Cell>
                                          <Table.Cell>{variant.sortOrder}</Table.Cell>
                                          <Table.Cell>
                                            <Flex gap={"1"}>
                                              <Tooltip content="Editar"><Button onClick={() => { EditVariant(variant);}} color="blue"><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                                              <Tooltip content="Eliminar"><Button onClick={() => { DeleteVariant(variant);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
                                            </Flex>
                                          </Table.Cell>
                                      </Table.Row>
                                      );
                                    })
                                  }
                                  </Table.Body>
                              </Table.Root>
                            </Box>
                        </Grid>
                    </Tabs.Content>
                    <Tabs.Content value="Colors">
                        <Grid rows="auto 1fr" columns="1fr 1fr 1fr 1fr 1fr" height={"100%"} gap={"5"}>
                          {selectedColor && (
                            <>
                              <Box>
                                <Text size="2" mb="1">Nombre</Text>
                                <TextField.Root value={colorName} onChange={(e) => setColorName(e.target.value)}/>
                              </Box>
                              <Box>
                                <Text size="2" mb="1">Color</Text>
                                <Flex gap={"1"} >
                                  <input type="color" style={{width: "50%"}} value={colorHex} onChange={(e) => setColorHex(e.target.value)}/>
                                </Flex>
                              </Box>
                              <Box>
                                <Text size="2" mb="1">Orden</Text>
                                <TextField.Root value={colorSortOrder} onChange={(e) => setColorSortOrder(Number.parseInt(e.target.value))}/>
                              </Box>
                              <Box>
                                <Text size="2" mb="1">Acciones</Text>
                                <Flex gap={"1"} >
                                  <Tooltip content="Aceptar"><Button onClick={() => { SaveColor(selectedColor as ProductColorResponse);}} color="green"><FontAwesomeIcon icon={faCheck} /></Button></Tooltip>
                                  <Tooltip content="Cancelar"><Button onClick={() => { setSelectedColor(null);}} color="red"><FontAwesomeIcon icon={faXmark} /></Button></Tooltip>
                                </Flex>
                              </Box>
                            </>
                          )}
                          {!selectedColor && (<Box gridColumn={"span 4"}></Box>)}
                            <Flex justify={"end"}>
                                <Tooltip content="Crear"><Button onClick={AddColor}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
                            </Flex>
                            <Box gridColumn={"span 5"}>
                                <Table.Root variant="surface" size={"1"}>
                                    <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell width={"40%"}>Nombre</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell width={"15%"}>Color</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell width={"15%"}>Orden</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell width={"15%"}>Acciones</Table.ColumnHeaderCell>
                                    </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                    {colors.map(color => {
                                        const myColor = ((selectedColor?.guid === color.guid) ? "#fefbe9" : "")
                                        return (
                                        <Table.Row key={color.guid} style={{backgroundColor: myColor}}>
                                            <Table.Cell>{color.name}</Table.Cell>
                                            <Table.Cell><input type="color" style={{width: "50%"}} value={color.hex} disabled/></Table.Cell>
                                            <Table.Cell>{color.sortOrder}</Table.Cell>
                                            <Table.Cell>
                                              <Flex gap={"1"}>
                                                <Tooltip content="Editar"><Button onClick={() => { EditColor(color);}} color="blue"><FontAwesomeIcon icon={faPencil} /></Button></Tooltip>
                                                <Tooltip content="Ver Imagenes"><Button onClick={() => { setSelectedColorImage(color); setIsImageModalOpen(true);}} color="blue"><FontAwesomeIcon icon={faFile} /></Button></Tooltip>
                                                <Tooltip content="Eliminar"><Button onClick={() => { DeleteColor(color);}} color="red"><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
                                              </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                        );
                                    })}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Grid>
                    </Tabs.Content>
                    <Tabs.Content value="Skus">
                        <Grid rows="1fr" columns="1" width={"100%"} gap={"2"}>
                            <Box>
                              <Table.Root variant="surface">
                                  <Table.Header>
                                  <Table.Row>
                                      <Table.ColumnHeaderCell width={"10%"}>Variante</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell width={"15%"}>Color</Table.ColumnHeaderCell>
                                      <Table.ColumnHeaderCell width={"75%"}>Sku</Table.ColumnHeaderCell>
                                  </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                  {
                                    listSkus.map(sku => {
                                      return (
                                      <Table.Row key={sku.guid}>
                                          <Table.Cell>{sku.variant?.name}</Table.Cell>
                                          <Table.Cell>{sku.color?.name}</Table.Cell>
                                          <Table.Cell>{sku.sku}</Table.Cell>
                                      </Table.Row>
                                      );
                                    })
                                  }
                                  </Table.Body>
                              </Table.Root>
                            </Box>
                        </Grid>
                    </Tabs.Content>
                </Box>
              </Tabs.Root>
            </Box>
            <Box></Box>
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 5"}>
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
      {isImageModalOpen && (
          <ImageModal
            key={selectedColorImage?.guid}  
            open={isImageModalOpen}
            onOpenChange={setIsImageModalOpen}
            imagesColor={selectedColorImage?.images ?? []}
            onSave={SaveImages}
          />
        )}
    </>
  );
};