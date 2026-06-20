import React, { useState, useEffect} from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid } from "@radix-ui/themes";
import { type ProductSkuRequest, type StockRequest, type StockResponse, StockService } from "../../api/generated";
import { ErrorModal } from "../../components/ErrorModal";

type StockUpdateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: StockResponse; 
  onSave: () => void;
};

export const StockUpdateModal : React.FC<StockUpdateModalProps> = ({
  open,
  onOpenChange,
  stock,
  onSave
}) => {
  const [stockPersisted, setStockPersisted] = useState<StockResponse|null>(stock);
  const [cantidad, setCantidad] = useState<number>(0);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  
  useEffect(()=> {
    StockService.stockGet(stock?.id)
    .then((data) =>{ 
      console.log({data, stock});
      setStockPersisted(data); });
    
  }, []);

  
  const handleSubmit = () => {
    if(stockPersisted === undefined || stockPersisted === null)
      return;

    const stockRequest = {} as StockRequest;
    stockRequest.id = stockPersisted?.id;
    stockRequest.guid = stockPersisted?.guid ;
    stockRequest.searchString = stockPersisted?.searchString;
    stockRequest.location = stockPersisted?.location;
    stockRequest.productSku = stockPersisted?.productSku as ProductSkuRequest;
    stockRequest.location = stockPersisted?.location;
    stockRequest.physical = cantidad;
    stockRequest.reserved = stockPersisted?.reserved;
    stockRequest.transit = stockPersisted?.transit;
    stockRequest.free = stockPersisted?.free;

    StockService.stockUpdatePhysical(stockRequest)
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
          <Dialog.Title>{"Agregar Stock"}</Dialog.Title>

          <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Producto</Text>
                <TextField.Root value={stockPersisted?.productSku?.product?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Variante</Text>
                <TextField.Root value={stockPersisted?.productSku?.variant?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Color</Text>
                <TextField.Root value={stockPersisted?.productSku?.color?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Pasillo</Text>
                <TextField.Root value={stockPersisted?.location?.hallway?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Columna</Text>
                <TextField.Root value={stockPersisted?.location?.column?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Nivel</Text>
                <TextField.Root value={stockPersisted?.location?.level?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Estado</Text>
                <TextField.Root value={stockPersisted?.location?.state?.name} disabled/>
            </Box>
            <Box gridColumn={"span 2"} >
                <Text size="2" mb="1" style={{ display: "block" }}>Cantidad Fisica</Text>
                <TextField.Root value={cantidad} onChange={(e) => setCantidad(Number.parseInt(e.target.value))}/>
            </Box>
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 7"}>
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