import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Checkbox, Grid } from "@radix-ui/themes";
import type { LogisticsProviderRequest, LogisticsProviderResponse } from "../../../api/generated";

type LogisticsProviderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logisticsProvider: LogisticsProviderResponse | null;         // null = crear
  onSave: (values: LogisticsProviderRequest) => Promise<void> | void;
};

export const LogisticsProviderModal: React.FC<LogisticsProviderModalProps> = ({
  open,
  onOpenChange,
  logisticsProvider,
  onSave,
}) => {
  const [name, setName] = useState(logisticsProvider?.name ?? "");
  const [code, setCode] = useState(logisticsProvider?.code ?? "");
  const [isInHouse, setIsInHouse] = useState(logisticsProvider?.isInHouse ?? false);

  const handleSubmit = () => {
    onSave({ id: logisticsProvider?.id ?? 0, guid: logisticsProvider?.guid ?? crypto.randomUUID(), code, name, isInHouse, searchString: logisticsProvider?.searchString ?? "" });
  };

  const title = logisticsProvider ? "Editar Proveedor Logistico" : "Crear Proveedor Logistico";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Grid columns="1fr 2fr 1fr" gap={"4"}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                logisticsProvider ? 
                (<TextField.Root value={code} onChange={(e) => setCode(e.target.value)} disabled />) : 
                (<TextField.Root value={code} onChange={(e) => setCode(e.target.value)}/>)
            }
          </Box>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Nombre</Text>
            <TextField.Root value={name} onChange={(e) => setName(e.target.value)} required />
          </Box>
          <Box>
            <Text size="2" mb="1">Logistica Propia </Text>
            <Flex align="center" gap="2"><Checkbox defaultChecked checked={isInHouse} onCheckedChange={() => setIsInHouse(!isInHouse)} /></Flex>
          </Box>
          <Flex gridColumn={"span 3"} justify="end" gap="2" mt="3">
            <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
            <Button onClick={handleSubmit}>Guardar</Button>
          </Flex>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};