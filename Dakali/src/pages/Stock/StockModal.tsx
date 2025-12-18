import React, { useState, useEffect, useMemo } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Select } from "@radix-ui/themes";
import { type ColorRequest,  type ProductRequest, type ProductResponse, type StockRequest, type StockResponse, type StockStateRequest, type StockStateResponse, type VariantRequest, ProductService, StockService, StockStateService } from "../../api/generated";

type StockModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: StockResponse | null; 
  onSave: (values: StockRequest) => Promise<void> | void;
};

export const StockModal : React.FC<StockModalProps> = ({
  open,
  onOpenChange,
  stock,
  onSave
}) => {
  const [stockPersisted, setStockPersisted] = useState<StockResponse|null>(stock);
  const [physical, setPhysical] = useState<number>(stockPersisted?.physical ?? 0 );
  const [reserved, setReserved] = useState<number>(stockPersisted?.reserved ?? 0);
  const [transit, setTransit] = useState<number>(stockPersisted?.transit ?? 0);
  const [free, setFree] = useState<number>(stockPersisted?.free ?? 0);
  const [minimum, setMinimum] = useState<number>(stockPersisted?.minimum ?? 0);
  const [maximum, setMaximum] = useState<number>(stockPersisted?.maximum ?? 0);

  const [selectedProductID, setSelectedProductID] = useState<string>("");
  const [selectedVariantID, setSelectedVariantID] = useState<string>("");
  const [selectedColorID, setSelectedColorID] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  const [states, setStates] = useState<StockStateResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  
  useEffect(()=> {
    const promiseProducts = ProductService.productGetAll()
        .then((data)=>{
            setProducts(data);  
        })
        .then(()=>{
            if(stock !== null && stock !== undefined)
            {
                StockService.stockGet(stock?.id).then((data) =>{
                setStockPersisted(data);
                setSelectedProductID(data.product.id.toString());
                });
            }
        });

    const promiseStates = StockStateService.stockStateGetAll()
        .then((data) => {
            setStates(data);  
        });

    Promise.all([promiseProducts, promiseStates])
        .then(()=>{
            if(stock !== null && stock !== undefined)
            {
                StockService.stockGet(stock?.id).then((data) =>{
                setStockPersisted(data);
                setSelectedProductID(data.product.id.toString());
                setSelectedVariantID(data.variant.id.toString());
                setSelectedColorID(data.color.id.toString());
                setSelectedStateCode(data.state.code);
                });
            }
        });
  }, []);

  const product = useMemo(() => { return products.find(p => p.id.toString() === selectedProductID) ?? null; }, [selectedProductID, products]);
  const variants = useMemo(() => { return product?.variants ?? []; }, [product]);
  const variant = useMemo(() => { return variants.find(p => p.id.toString() === selectedVariantID) ?? null; }, [selectedVariantID, variants]);
  const colors = useMemo(() => { return variant?.colorsHex ?? []; }, [variant]);
  const color = useMemo(() => { return colors.find(p => p.id.toString() === selectedColorID) ?? null; }, [selectedColorID, colors]);
  const state = useMemo(() => { return states.find(p => p.code === selectedStateCode) ?? null; }, [selectedStateCode, states]);

  const handleSubmit = () => {
    const stockRequest = {} as StockRequest;
    stockRequest.id = stockPersisted?.id ?? 0;
    stockRequest.guid = stockPersisted?.guid ?? crypto.randomUUID();
    stockRequest.searchString = stockPersisted?.searchString ?? "";
    stockRequest.product = product as ProductRequest;
    stockRequest.variant = variant as VariantRequest;
    stockRequest.color = color as ColorRequest;
    stockRequest.physical = physical;
    stockRequest.free = free;
    stockRequest.reserved = reserved;
    stockRequest.transit = transit;
    stockRequest.minimum = minimum;
    stockRequest.maximum = maximum;
    stockRequest.state = state as StockStateRequest; 
console.log({stockRequest, state, selectedStateCode, states});
    onSave(stockRequest);
  };

  const title = stockPersisted ? "Editar Stock" : "Crear Stock";

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="50%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{title}</Dialog.Title>

          <Grid columns="1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
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
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Estado</Text>
              <Select.Root value={selectedStateCode} onValueChange={setSelectedStateCode}>
                  <Select.Trigger placeholder="Seleccione un estado"/>
                  <Select.Content>
                    {
                      states.map((item)=>{
                        return (<Select.Item key={item.code} value={item.code}>{item.code}-{item.name}</Select.Item>)
                      })
                    }
                  </Select.Content>
              </Select.Root>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Fisico</Text>
                <TextField.Root type="number" value={physical} onChange={(e) => setPhysical(Number.parseInt(e.target.value))}/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Reservado</Text>
                <TextField.Root type="number" value={reserved} onChange={(e) => setReserved(Number.parseInt(e.target.value))}/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Transito</Text>
                <TextField.Root type="number" value={transit} onChange={(e) => setTransit(Number.parseInt(e.target.value))}/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Libre</Text>
                <TextField.Root type="number" value={free} onChange={(e) => setFree(Number.parseInt(e.target.value))}/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Minimo</Text>
                <TextField.Root type="number" value={minimum} onChange={(e) => setMinimum(Number.parseInt(e.target.value))}/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Maximo</Text>
                <TextField.Root type="number" value={maximum} onChange={(e) => setMaximum(Number.parseInt(e.target.value))}/>
            </Box>
            <Box></Box>
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 4"}>
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};