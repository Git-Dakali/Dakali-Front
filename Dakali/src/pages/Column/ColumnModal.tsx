import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { ColumnRequest, ColumnResponse } from "../../api/generated";

type ColumnModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: ColumnResponse | null;         // null = crear
  onSave: (values: ColumnRequest) => Promise<void> | void;
};

export const ColumnModal: React.FC<ColumnModalProps> = ({
  open,
  onOpenChange,
  column,
  onSave,
}) => {
  const [code, setCode] = useState(column?.code ?? "");
  const [name, setName] = useState(column?.name ?? "");

  const handleSubmit = () => {
    onSave({ id: column?.id ?? 0, guid: column?.guid ?? crypto.randomUUID(), code, name, searchString: column?.searchString ?? "" });
  };

  const title = column ? "Editar Columna" : "Crear Columna";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                column ? 
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