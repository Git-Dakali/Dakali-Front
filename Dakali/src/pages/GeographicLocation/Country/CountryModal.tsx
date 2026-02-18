import React, { useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box } from "@radix-ui/themes";
import type { CountryRequest, CountryResponse } from "../../../api/generated";

type CountryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: CountryResponse | null;         // null = crear
  onSave: (values: CountryRequest) => Promise<void> | void;
};

export const CountryModal: React.FC<CountryModalProps> = ({
  open,
  onOpenChange,
  country,
  onSave,
}) => {
  const [code, setCode] = useState(country?.code ?? "");
  const [name, setName] = useState(country?.name ?? "");

  const handleSubmit = () => {
    onSave({ id: country?.id ?? 0, guid: country?.guid ?? crypto.randomUUID(), code, name, searchString: country?.searchString ?? "" });
  };

  const title = country ? "Editar categoría" : "Crear categoría";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                country ? 
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