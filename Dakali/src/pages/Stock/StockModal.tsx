import React, { useState, useEffect, useMemo } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Select } from "@radix-ui/themes";
import { type LocationRequest,  type LocationResponse, type ProductResponse, type StockRequest, LocationService, ProductService, type ProductSkuRequest, StockService } from "../../api/generated";
import { ErrorModal } from "../../components/ErrorModal";

type StockModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
};

export const StockModal : React.FC<StockModalProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [physical, setPhysical] = useState<number>(0 );

  const [selectedProductID, setSelectedProductID] = useState<string>("");
  const [selectedVariantID, setSelectedVariantID] = useState<string>("");
  const [selectedColorID, setSelectedColorID] = useState<string>("");
  const [selectedLocationID, setSelectedLocationID] = useState<string>("");

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(()=> {
    LocationService.locationGetAll().then((data) => { setLocations(data); });
    ProductService.productGetAll().then((data)=>{ setProducts(data); });

  }, []);

  const product = useMemo(() => { return products.find(p => p.id.toString() === selectedProductID) ?? null; }, [selectedProductID, products]);
  const variants = useMemo(() => { return product?.variants ?? []; }, [product]);
  const variant = useMemo(() => { return variants.find(p => p.id.toString() === selectedVariantID) ?? null; }, [selectedVariantID, variants]);
  const colors = useMemo(() => { return product?.colors ?? []; }, [product]);
  const color = useMemo(() => { return colors.find(p => p.id.toString() === selectedColorID) ?? null; }, [selectedColorID, colors]);
  const location = useMemo(() => { return locations.find(p => p.id.toString() === selectedLocationID) ?? null; }, [selectedLocationID, locations]);

  const handleSubmit = () => {
    const stockRequest = {} as StockRequest;
    stockRequest.id = 0;
    stockRequest.guid = crypto.randomUUID();
    stockRequest.searchString = "";
    stockRequest.productSku = product?.skus.find(x => x.product?.id === product.id && x.color?.id === color?.id && x.variant?.id === variant?.id) as ProductSkuRequest;
    stockRequest.location = location as LocationRequest;
    stockRequest.physical = physical;
    stockRequest.free = 0;
    stockRequest.reserved = 0;
    stockRequest.transit = 0;
    stockRequest.minimum = 0;
    stockRequest.maximum = 0;

    StockService.stockCreate(stockRequest)
      .then(() => {
        onOpenChange(false);
        onSave();    
      })
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
            <Box>
              <Text size="2" mb="1" style={{ display: "block" }}>Producto</Text>
              <Select.Root value={selectedProductID} onValueChange={setSelectedProductID}>
                  <Select.Trigger placeholder="Seleccione un Producto" style={{ width: "100%" }}/>
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
                  <Select.Trigger placeholder="Seleccione una variante" style={{ width: "100%" }}/>
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
                  <Select.Trigger placeholder="Seleccione un color" style={{ width: "100%" }}/>
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
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Stock Fisico</Text>
                <TextField.Root type="number" value={physical} onChange={(e) => setPhysical(Number.parseInt(e.target.value))}/>
            </Box>
            <Box></Box>
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