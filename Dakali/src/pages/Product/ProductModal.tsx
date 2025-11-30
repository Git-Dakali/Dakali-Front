import React, { useState, useEffect, useMemo } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Select, TextArea, Tooltip, Table } from "@radix-ui/themes";
import { type ModelRequest, type ModelResponse, type ProductRequest, type ProductResponse, type VariantRequest, type VariantResponse,  ModelService, ProductService } from "../../api/generated";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { VariantModal } from "./VariantModal";

type ProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductResponse | null; 
  onSave: (values: ProductRequest) => Promise<void> | void;
};

export const ProductModal : React.FC<ProductModalProps> = ({
  open,
  onOpenChange,
  product,
  onSave
}) => {
  const [productPersisted, setProductPersisted] = useState<ProductResponse|null>(product);
  const [name, setName] = useState(productPersisted?.name ?? "");
  const [description, setDescription] = useState(productPersisted?.description ?? "");

  const [models, setModels] = useState<ModelResponse[]>([]);
  const [selectedModelCode, setSelectedModelCode] = useState<string>(productPersisted?.model.code??"");

  const [isModalVariantOpen, setIsModalVariantOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantResponse | null>(null);
  

  const getModelSelected = () => models.find(c => c.code === selectedModelCode) ?? null;

  useEffect(()=> {
    ModelService.modelGetAll().then((data)=>{
      setModels(data);

      if(product !== null && product !== undefined)
      {
        ProductService.productGet(product?.id).then((data) =>{
          setProductPersisted(data);
          setSelectedModelCode(data.model.code);
        });
      }
    });
  }, []);

 const variantsDelete = useMemo<VariantResponse[]>(() => {
    const listVariantDelete:VariantResponse[] = [];
    const model = models.find(c => c.code === selectedModelCode) ?? null; 
    
    productPersisted?.variants.forEach((variant) => {
        const existVariant = model?.variantNames.some(name => name.toUpperCase() === variant.name.toUpperCase())

        if(!existVariant)
            listVariantDelete.push(variant);
    });

    return listVariantDelete;
  }, [productPersisted?.variants, models, selectedModelCode]);

const variants = useMemo<VariantResponse[]>(() => {
    const listVariantAdd:VariantResponse[] = [];

    const model = models.find(c => c.code === selectedModelCode) ?? null; 
    
    model?.variantNames?.forEach((name) => {
        const existVariant = productPersisted?.variants.some( variant => variant.name.toUpperCase() === name.toUpperCase())

        if(!existVariant)
            listVariantAdd.push({id:0, guid: crypto.randomUUID(), searchString: "", name, price: 0, salePrice: 0, active: true, sortOrder: 0, propertyGroups: [], colorsHex: []});
    });

    return listVariantAdd.concat(productPersisted?.variants?? []);
}, [productPersisted?.variants, models, selectedModelCode]);

const handleSubmit = () => {
    const model = getModelSelected();
    const newProduct = {} as ProductRequest;
    newProduct.id = productPersisted?.id ?? 0; 
    newProduct.guid = crypto.randomUUID();
    newProduct.searchString = ""; 
    newProduct.name = name;
    newProduct.description = description;
    newProduct.variants = variants as VariantRequest[];
    newProduct.model = model as ModelRequest;

    onSave(newProduct);
};

  const EditVariantEvent = (variant:VariantResponse) =>{
    setSelectedVariant(variant);
    setIsModalVariantOpen(true);
  };

  const SaveVariantService = (variantRequest: VariantRequest) => {
      const value = variants.find(x => x.guid === variantRequest.guid) ?? null;

      if(value !== null)
      {
        value.id = variantRequest.id;
        value.name = variantRequest.name;
        value.price = variantRequest.price;
        value.salePrice = variantRequest.salePrice;
        value.colorsHex = variantRequest.colorsHex;
        value.propertyGroups = variantRequest.propertyGroups;
        value.sortOrder = variantRequest.sortOrder;
      }
  };

  const title = productPersisted ? "Editar Producto" : "Crear Producto";
  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="80%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{title}</Dialog.Title>

          <Grid columns="1fr 2fr" gap="3" rows="auto auto 1fr auto" width="auto" height="100%">
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Nombre</Text>
              <TextField.Root value={name} onChange={(e) => setName(e.target.value)}/>
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Modelo</Text>
              <Select.Root value={selectedModelCode} onValueChange={setSelectedModelCode}>
                  <Select.Trigger placeholder="Seleccione un Modelo"/>
                  <Select.Content>
                    {
                      models.map((item)=>{
                        return (<Select.Item key={item.id} value={item.code}>{item.code}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box gridColumn={"span 2"}>
                <Text size="2" mb="1" style={{ display: "block" }}>Descripcion</Text>
                <TextArea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}/>
            </Box>
            <Box gridColumn={"span 2"}>
                <Grid rows="auto 1fr" columns="1" height={"100%"} gap={"2"}>
                    <Box>
                        <Table.Root variant="surface">
                            <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell width={"30%"}>Variante</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"15%"}>Precio</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"15%"}>Precio Venta</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"10%"}>Orden</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"10%"}>Estado</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"20%"}>Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            
                            {
                              variants.map(variant => {

                                const isDeleted = variantsDelete.some(v => v.guid === variant.guid);

                                return (
                                <Table.Row key={variant.guid}>
                                    <Table.Cell>{variant.name}</Table.Cell>
                                    <Table.Cell>{variant.price}</Table.Cell>
                                    <Table.Cell>{variant.salePrice}</Table.Cell>
                                    <Table.Cell>{variant.sortOrder}</Table.Cell>
                                    <Table.Cell>{isDeleted ? "Se eliminara" : (variant.id === 0 ? "Se agregara" : "")}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Tooltip content="Editar"><Button onClick={() => { EditVariantEvent(variant);}}><Pencil1Icon/></Button></Tooltip>
                                    </Table.Cell>
                                </Table.Row>
                                );
                              })
                            }
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
      {isModalVariantOpen && (
        <VariantModal
          key={selectedVariant?.id ?? "new"}  
          open={isModalVariantOpen}
          onOpenChange={setIsModalVariantOpen}
          variant={selectedVariant as VariantResponse}
          model={getModelSelected()}
          onSave={SaveVariantService}
        />
      )}
    </>
  );
};