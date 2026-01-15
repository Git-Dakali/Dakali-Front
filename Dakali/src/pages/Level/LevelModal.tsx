import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { LevelRequest, LevelResponse } from "../../api/generated";

type LevelModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: LevelResponse | null;         // null = crear
  onSave: (values: LevelRequest) => Promise<void> | void;
};

export const LevelModal: React.FC<LevelModalProps> = ({
  open,
  onOpenChange,
  level,
  onSave,
}) => {
  const [code, setCode] = useState(level?.code ?? "");
  const [name, setName] = useState(level?.name ?? "");

  const handleSubmit = () => {
    onSave({ id: level?.id ?? 0, guid: level?.guid ?? crypto.randomUUID(), code, name, searchString: level?.searchString ?? "" });
  };

  const title = level ? "Editar Nivel" : "Crear Nivel";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                level ? 
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