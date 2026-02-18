import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { OriginSaleRequest, OriginSaleResponse } from "../../../api/generated";

type OriginSaleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originSale: OriginSaleResponse | null;         // null = crear
  onSave: (values: OriginSaleRequest) => Promise<void> | void;
};

export const OriginSaleModal: React.FC<OriginSaleModalProps> = ({
  open,
  onOpenChange,
  originSale,
  onSave,
}) => {
  const [name, setName] = useState(originSale?.name ?? "");
  const [code, setCode] = useState(originSale?.code ?? "");

  const handleSubmit = () => {
    onSave({ id: originSale?.id ?? 0, guid: originSale?.guid ?? crypto.randomUUID(), code, name, searchString: originSale?.searchString ?? "" });
  };

  const title = originSale ? "Editar categoría" : "Crear categoría";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                originSale ? 
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