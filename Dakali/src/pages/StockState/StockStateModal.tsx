import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { StockStateRequest, StockStateResponse } from "../../api/generated";

type StockStateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: StockStateResponse | null;         
  onSave: (values: StockStateRequest) => Promise<void> | void;
};

export const StockStateModal: React.FC<StockStateModalProps> = ({
  open,
  onOpenChange,
  state,
  onSave,
}) => {
  const [code, setCode] = useState(state?.code ?? "");
  const [name, setName] = useState(state?.name ?? "");

  const handleSubmit = () => {
    onSave({ id: state?.id ?? 0, guid: state?.guid ?? crypto.randomUUID(), code, name, searchString: state?.searchString ?? "" });
    onOpenChange(false);
  };

  const title = state ? "Editar Estado Stock" : "Crear Estado Stock";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                state ? 
                (<TextField.Root value={code} onChange={(e) => setCode(e.target.value)} disabled />) : 
                (<TextField.Root value={code} onChange={(e) => setCode(e.target.value)}/>)
            }
          </Box>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Nombre</Text>
            <TextField.Root
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Box>
          <Flex justify="end" gap="2" mt="3">
            <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
            <Button onClick={handleSubmit}>Guardar</Button>
          </Flex>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};