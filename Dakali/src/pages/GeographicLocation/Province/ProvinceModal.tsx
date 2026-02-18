import React, { useEffect, useMemo, useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Select, Grid } from "@radix-ui/themes";
import { CountryService, type CountryRequest, type CountryResponse, type ProvinceRequest, type ProvinceResponse } from "../../../api/generated";

type ProvinceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  province: ProvinceResponse | null;         // null = crear
  onSave: (values: ProvinceRequest) => Promise<void> | void;
};

export const ProvinceModal: React.FC<ProvinceModalProps> = ({
  open,
  onOpenChange,
  province,
  onSave,
}) => {
  const [code, setCode] = useState(province?.code ?? "");
  const [name, setName] = useState(province?.name ?? "");
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(province?.country?.code ?? "");

  useEffect(() => {
    CountryService.countryGetAll().then((data) => { setCountries(data);});
  }, []);

  const country = useMemo(() => {
    return countries.find(x => x.code === selectedCountry);
  }, [selectedCountry, countries]);

  const handleSubmit = () => {
    onSave({ id: province?.id ?? 0, guid: province?.guid ?? crypto.randomUUID(), code, name, country: country as CountryRequest, searchString: province?.searchString ?? "" });
  };

  const title = province ? "Editar Provincia" : "Crear Provicia";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="30%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>

        <Grid columns="2fr 1fr 2fr" gap="3" rows="auto 1fr" width="auto" height="100%">
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Pais</Text>
            <Select.Root value={selectedCountry} onValueChange={setSelectedCountry}>
                <Select.Trigger placeholder="Seleccione un Pais" style={{ width: "100%" }}/>
                <Select.Content>
                {
                    countries.map((item)=>{
                    return (<Select.Item key={item.code} value={item.code}>{item.name}</Select.Item>)
                    })
                }
                </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código</Text>
            {
                province ? 
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
          <Flex justify="end" gap="2" mt="3" gridColumn={"span 3"}>
            <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
            <Button onClick={handleSubmit}>Guardar</Button>
          </Flex>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};