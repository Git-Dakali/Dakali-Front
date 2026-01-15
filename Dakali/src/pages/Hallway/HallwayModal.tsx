import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { HallwayRequest, HallwayResponse } from "../../api/generated";

type HallwayModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hallway: HallwayResponse | null;         // null = crear
  onSave: (values: HallwayRequest) => Promise<void> | void;
};

export const HallwayModal: React.FC<HallwayModalProps> = ({
  open,
  onOpenChange,
  hallway,
  onSave,
}) => {
  const [code, setCode] = useState(hallway?.code ?? "");
  const [name, setName] = useState(hallway?.name ?? "");

  const handleSubmit = () => {
    onSave({ id: hallway?.id ?? 0, guid: hallway?.guid?? crypto.randomUUID(), code, name, searchString: hallway?.searchString ?? "" });
  };

  const title = hallway ? "Editar Pasillo" : "Crear Pasillo";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                hallway ? 
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