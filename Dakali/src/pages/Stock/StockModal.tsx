import React, { useState, useEffect, useMemo } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Select } from "@radix-ui/themes";
import { type ColorRequest,  type LocationRequest,  type LocationResponse,  type ProductRequest, type ProductResponse, type StockRequest, type VariantRequest, LocationService, ProductService } from "../../api/generated";

type StockModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: StockRequest) => Promise<void> | void;
};

export const StockModal : React.FC<StockModalProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [physical, setPhysical] = useState<number>(0 );
  const [reserved, setReserved] = useState<number>(0);
  const [transit, setTransit] = useState<number>(0);
  const [free, setFree] = useState<number>(0);
  const [minimum, setMinimum] = useState<number>(0);
  const [maximum, setMaximum] = useState<number>(0);

  const [selectedProductID, setSelectedProductID] = useState<string>("");
  const [selectedVariantID, setSelectedVariantID] = useState<string>("");
  const [selectedColorID, setSelectedColorID] = useState<string>("");
  const [selectedLocationID, setSelectedLocationID] = useState<string>("");

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  
  useEffect(()=> {
    LocationService.locationGetAll().then((data) => { setLocations(data); });
    ProductService.productGetAll().then((data)=>{ setProducts(data); });

  }, []);

  const product = useMemo(() => { return products.find(p => p.id.toString() === selectedProductID) ?? null; }, [selectedProductID, products]);
  const variants = useMemo(() => { return product?.variants ?? []; }, [product]);
  const variant = useMemo(() => { return variants.find(p => p.id.toString() === selectedVariantID) ?? null; }, [selectedVariantID, variants]);
  const colors = useMemo(() => { return variant?.colorsHex ?? []; }, [variant]);
  const color = useMemo(() => { return colors.find(p => p.id.toString() === selectedColorID) ?? null; }, [selectedColorID, colors]);
  const location = useMemo(() => { return locations.find(p => p.id.toString() === selectedLocationID) ?? null; }, [selectedLocationID, locations]);

  const handleSubmit = () => {
    const stockRequest = {} as StockRequest;
    stockRequest.id = 0;
    stockRequest.guid = crypto.randomUUID();
    stockRequest.searchString = "";
    stockRequest.product = product as ProductRequest;
    stockRequest.variant = variant as VariantRequest;
    stockRequest.color = color as ColorRequest;
    stockRequest.location = location as LocationRequest;
    stockRequest.physical = physical;
    stockRequest.free = free;
    stockRequest.reserved = reserved;
    stockRequest.transit = transit;
    stockRequest.minimum = minimum;
    stockRequest.maximum = maximum;

    onSave(stockRequest);
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="50%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{"Crear Stock"}</Dialog.Title>

          <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Producto</Text>
              <Select.Root value={selectedProductID} onValueChange={setSelectedProductID}>
                  <Select.Trigger placeholder="Seleccione un Producto"/>
                  <Select.Content>
                    {
                      products.map((item)=>{
                        return (<Select.Item key={item.id} value={item.id.toString()}>{item.name}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Variante</Text>
              <Select.Root value={selectedVariantID} onValueChange={setSelectedVariantID}>
                  <Select.Trigger placeholder="Seleccione una variante"/>
                  <Select.Content>
                    {
                      variants.map((item)=>{
                        return (<Select.Item key={item.id} value={item.id.toString()}>{item.name}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Color</Text>
              <Select.Root value={selectedColorID} onValueChange={setSelectedColorID}>
                  <Select.Trigger placeholder="Seleccione un color"/>
                  <Select.Content>
                    {
                      colors.map((item)=>{
                        return (<Select.Item key={item.id} value={item.id.toString()}>{item.name}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box gridColumn={"span 2"}>
              <Text size="2" mb="1" style={{ display: "block" }}>Ubicacion</Text>
              <Select.Root value={selectedLocationID} onValueChange={setSelectedLocationID}>
                  <Select.Trigger placeholder="Seleccione una ubicacion"/>
                  <Select.Content>
                    {
                      locations.map((item)=>{
                        return (<Select.Item key={item.id} value={item.id.toString()}>{item.hallway.name}-{item.column.name}-{item.level.name}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Estado</Text>
                <TextField.Root value={location?.state?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Fisico</Text>
                <TextField.Root type="number" value={physical} onChange={(e) => setPhysical(Number.parseInt(e.target.value))} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Reservado</Text>
                <TextField.Root type="number" value={reserved} onChange={(e) => setReserved(Number.parseInt(e.target.value))} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Transito</Text>
                <TextField.Root type="number" value={transit} onChange={(e) => setTransit(Number.parseInt(e.target.value))} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Libre</Text>
                <TextField.Root type="number" value={free} onChange={(e) => setFree(Number.parseInt(e.target.value))} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Minimo</Text>
                <TextField.Root type="number" value={minimum} onChange={(e) => setMinimum(Number.parseInt(e.target.value))} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Maximo</Text>
                <TextField.Root type="number" value={maximum} onChange={(e) => setMaximum(Number.parseInt(e.target.value))} disabled/>
            </Box>
            <Box></Box>
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 5"}>
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};