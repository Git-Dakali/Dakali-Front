import React, { useState, useEffect} from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Grid } from "@radix-ui/themes";
import { type StockEntryRequest, type StockRequest, type StockResponse, StockService } from "../../api/generated";

type StockModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: StockResponse; 
  onSave: (values: StockEntryRequest) => Promise<void> | void;
};

export const AddStockModal : React.FC<StockModalProps> = ({
  open,
  onOpenChange,
  stock,
  onSave
}) => {
  const [stockPersisted, setStockPersisted] = useState<StockResponse|null>(stock);
  const [cantidad, setCantidad] = useState<number>(0);
  
  
  useEffect(()=> {
    StockService.stockGet(stock?.id)
    .then((data) =>{ 
      console.log({data, stock});
      setStockPersisted(data); });
    
  }, []);

  
  const handleSubmit = () => {
    const stockRequest = {} as StockEntryRequest;
    stockRequest.stock = stockPersisted as StockRequest;
    stockRequest.amount = cantidad;
    onSave(stockRequest);
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="50%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{"Agregar Stock"}</Dialog.Title>

          <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Producto</Text>
                <TextField.Root value={stockPersisted?.product?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Variante</Text>
                <TextField.Root value={stockPersisted?.variant?.name} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Color</Text>
                <TextField.Root value={stockPersisted?.color?.name} disabled/>
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
                <Text size="2" mb="1" style={{ display: "block" }}>Cantidad</Text>
                <TextField.Root value={cantidad} onChange={(e) => setCantidad(Number.parseInt(e.target.value))}/>
            </Box>
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 7"}>
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};