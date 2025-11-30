import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { CategoryRequest, CategoryResponse } from "../../api/generated";

type CategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryResponse | null;         // null = crear
  onSave: (values: CategoryRequest) => Promise<void> | void;
};

export const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onOpenChange,
  category,
  onSave,
}) => {
  const [code, setCode] = useState(category?.code ?? "");
  const [name, setName] = useState(category?.name ?? "");

  const handleSubmit = () => {
    onSave({ id: category?.id ?? 0, guid: crypto.randomUUID(), code, name, searchString: "" });
    onOpenChange(false);
  };

  const title = category ? "Editar categoría" : "Crear categoría";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                category ? 
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