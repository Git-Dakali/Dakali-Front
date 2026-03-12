import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { DriverRequest, DriverResponse } from "../../../api/generated";

type DriverModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: DriverResponse | null;         // null = crear
  onSave: (values: DriverRequest) => Promise<void> | void;
};

export const DriverModal: React.FC<DriverModalProps> = ({
  open,
  onOpenChange,
  driver,
  onSave,
}) => {
  const [firstName, setFirstName] = useState(driver?.firstName ?? "");
  const [lastName, setLastName] = useState(driver?.lastName ?? "");
  const [dni, setDni] = useState(driver?.dni ?? "");

  const handleSubmit = () => {
    onSave({ id: driver?.id ?? 0, guid: driver?.guid ?? crypto.randomUUID(), firstName, lastName, dni, searchString: driver?.searchString ?? "" });
  };

  const title = driver ? "Editar Chofer" : "Crear Chofer";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Nombre</Text>
            <TextField.Root value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
          </Box>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Apellido</Text>
            <TextField.Root value={lastName} onChange={(e) => setLastName(e.target.value)}/>
          </Box>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>DNI</Text>
            <TextField.Root value={dni} onChange={(e) => setDni(e.target.value)}/>
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