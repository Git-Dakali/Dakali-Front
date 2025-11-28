import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { FieldRequest, FieldResponse } from "../../api/generated";

type FieldModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: FieldResponse | null;         // null = crear
  onSave: (values: FieldRequest) => Promise<void> | void;
};

export const FieldModal: React.FC<FieldModalProps> = ({
  open,
  onOpenChange,
  field,
  onSave,
}) => {
  const [name, setName] = useState(field?.name ?? "");
  const [sortOrder, setSortOrder] = useState(field?.sortOrder ?? 0);

  const handleSubmit = () => {
    onSave({ id: field?.id ?? 0, guid: field?.guid ?? crypto.randomUUID(), name, sortOrder, searchString: "" });
    onOpenChange(false);
  };

  const title = field ? "Editar Campo" : "Crear Campo";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Nombre</Text>
            <TextField.Root value={name} onChange={(e) => setName(e.target.value)}/>
          </Box>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Orden</Text>
            <TextField.Root
              value={sortOrder}
              onChange={(e) => setSortOrder(Number.parseInt(e.target.value))}
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