import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { SizeRequest, SizeResponse } from "../../api/generated";

type SizeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size: SizeResponse | null;         // null = crear
  onSave: (values: SizeRequest) => Promise<void> | void;
};

export const SizeModal: React.FC<SizeModalProps> = ({
  open,
  onOpenChange,
  size,
  onSave,
}) => {
  const [name, setName] = useState(size?.name ?? "");
  const [sortOrder, setSortOrder] = useState(size?.sortOrder ?? 0);

  const handleSubmit = () => {
    onSave({ id: size?.id ?? 0, guid: size?.guid ?? crypto.randomUUID(), name, sortOrder, searchString: ""});
    onOpenChange(false);
  };

  const title = size ? "Editar Tamaño" : "Crear Tamaño";

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