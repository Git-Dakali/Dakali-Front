import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { TaxStatusRequest, TaxStatusResponse } from "../../../api/generated";

type TaxStatusModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxStatus: TaxStatusResponse | null;         // null = crear
  onSave: (values: TaxStatusRequest) => Promise<void> | void;
};

export const TaxStatusModal: React.FC<TaxStatusModalProps> = ({
  open,
  onOpenChange,
  taxStatus,
  onSave,
}) => {
  const [code, setCode] = useState(taxStatus?.code ?? "");
  const [name, setName] = useState(taxStatus?.name ?? "");

  const handleSubmit = () => {
    onSave({ id: taxStatus?.id ?? 0, guid: taxStatus?.guid ?? crypto.randomUUID(), code, name, searchString: taxStatus?.searchString ?? "" });
  };

  const title = taxStatus ? "Editar Estado Fiscal" : "Crear Estado Fiscal";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                taxStatus ? 
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