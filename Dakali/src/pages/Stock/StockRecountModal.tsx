import React, { useState, useEffect, useMemo } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Select, Table } from "@radix-ui/themes";
import { type LocationRequest,  type LocationResponse,  type ProductSkuRequest, type ProductSkuResponse, type StockRequest, LocationService, ProductSkuService, StockService } from "../../api/generated";
import { ErrorModal } from "../../components/ErrorModal";

type StockRecountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
};

type Sku = {
  ProductSku: ProductSkuResponse;
  Count: number;
};

export const StockRecountModal : React.FC<StockRecountModalProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [searchSKU, setSearchSKU] = useState("");

  const [selectedLocationID, setSelectedLocationID] = useState<string>("");

  const [skus, setSkus] = useState(new Map<string, Sku>());
  const [locations, setLocations] = useState<LocationResponse[]>([]);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(()=> {
    LocationService.locationGetAll().then((data) => { setLocations(data); });

  }, []);

  const location = useMemo(() => { return locations.find(p => p.id.toString() === selectedLocationID) ?? null; }, [selectedLocationID, locations]);

  const handleSubmit = () => {

    const stocksRequest = Array.from(skus.values()).map(sku => {
      const stockRequest = {} as StockRequest;
      stockRequest.id = 0;
      stockRequest.guid = crypto.randomUUID();
      stockRequest.searchString = "";
      stockRequest.productSku =  sku.ProductSku as ProductSkuRequest;
      stockRequest.location = location as LocationRequest;
      stockRequest.physical = sku.Count;
      stockRequest.free = 0;
      stockRequest.reserved = 0;
      stockRequest.transit = 0;
      stockRequest.minimum = 0;
      stockRequest.maximum = 0;

      return stockRequest;
    });

    StockService.stockRecount(stocksRequest).then(() => {
      onOpenChange(false);
      onSave();
    })
    .catch((error) =>{ 
        console.log({error});
        setErrorMessage(error.body.message);
        setErrorOpen(true);
    });
  };

  const AddProduct = (sku: string) => {
    console.log({pepe: "AddProduct"});
    ProductSkuService.productSkuGetBySku(sku)
      .then((productSku => {
        console.log({pepe: "productSkuGetBySku"});
        if(productSku === null || productSku === undefined)
        {
          setErrorMessage("No existe el SKU " + sku);
          setErrorOpen(true);
          return;
        }

        const clone = new Map(skus);
        
        if(clone.has(productSku.sku))
        {
          const value = clone.get(productSku.sku);
          if(value)
            value.Count = value.Count + 1;
        }
        else
          clone.set(productSku.sku, {ProductSku: productSku, Count: 1});
        
        setSearchSKU("");
        setSkus(clone);
      }))
      .catch((error) =>{ 
        console.log({error});
        setErrorMessage(error.body.message);
        setErrorOpen(true);
    });
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="50%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{"Crear Stock"}</Dialog.Title>

          <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            
            <Box gridColumn={"span 2"}>
              <Text size="2" mb="1" style={{ display: "block" }}>Ubicacion</Text>
              <Select.Root value={selectedLocationID} onValueChange={setSelectedLocationID}>
                  <Select.Trigger placeholder="Seleccione una ubicacion" style={{ width: "100%" }}/>
                  <Select.Content>
                    {
                      locations.map((item)=>{
                        return (<Select.Item key={item.id} value={item.id.toString()}>{item.hallway?.name}-{item.column?.name}-{item.level?.name}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Estado</Text>
                <TextField.Root value={location?.state?.name} disabled/>
            </Box>
            <Box gridColumn={"span 3"}></Box>
            <Box gridColumn={"span 3"}>
                <Text size="2" mb="1" style={{ display: "block" }}>SKU</Text>
                <TextField.Root value={searchSKU} onChange={(e) => setSearchSKU(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") {console.log({ pepe: "ENTER"}); AddProduct(e.currentTarget.value);} }} />
            </Box>
            <Box gridColumn={"span 6"}>
                <Table.Root variant="surface">
                    <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Variante</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Color</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Stock Fisico</Table.ColumnHeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {Array.from(skus.values()).map(sku => {
                        return (
                        <Table.Row key={sku.ProductSku.guid}>
                            <Table.Cell>{sku.ProductSku.product?.name}</Table.Cell>
                            <Table.Cell>{sku.ProductSku.variant?.name}</Table.Cell>
                            <Table.Cell>{sku.ProductSku.color?.name}</Table.Cell>
                            <Table.Cell>{sku.Count}</Table.Cell>
                        </Table.Row>
                        );
                    })}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 5"}>
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
      <ErrorModal
              open={errorOpen}
              onOpenChange={setErrorOpen}
              message={errorMessage}
            />
    </>
  );
};