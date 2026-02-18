import React, { useEffect, useMemo, useState } from "react";
import { Dialog, Button, Flex, Text, TextField, Box, Select, Grid } from "@radix-ui/themes";
import { CountryService, ProvinceService, type CityRequest, type CityResponse, type CountryRequest, type CountryResponse, type ProvinceRequest, type ProvinceResponse } from "../../../api/generated";

type CityModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: CityResponse | null;         // null = crear
  onSave: (values: CityRequest) => Promise<void> | void;
};

export const CityModal: React.FC<CityModalProps> = ({
  open,
  onOpenChange,
  city,
  onSave,
}) => {
  const [zipCode, setZipCode] = useState(city?.zipCode ?? "");
  const [name, setName] = useState(city?.name ?? "");

  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(city?.province?.country?.code ?? "");

  const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
  const [selectedProvince, setSelectedProvince] = useState(city?.province?.code ?? "");

  const country = useMemo(() => {
    return countries.find(x => x.code === selectedCountry);
  }, [selectedCountry, countries]);

  const province = useMemo(() => {
    return provinces.find(x => x.code === selectedProvince);
  }, [selectedProvince, provinces]);

  useEffect(() => {
    CountryService.countryGetAll().then((data) => { setCountries(data); });
  }, []);

  useEffect(() => {
    ProvinceService.provinceGetByCountry(country as CountryRequest).then((data) => { setProvinces(data); });
  }, [country])

  const handleSubmit = () => {
    onSave({ id: city?.id ?? 0, guid: city?.guid ?? crypto.randomUUID(), zipCode, name, province: province as ProvinceRequest, searchString: city?.searchString ?? "" });
  };

  const title = city ? "Editar Localidad" : "Crear Localidad";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="40%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>
        <Grid columns="2fr 2fr 1fr 2fr" gap="3" rows="auto 1fr" width="auto" height="100%">
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
            <Text size="2" mb="1" style={{ display: "block" }}>Provincia</Text>
            <Select.Root value={selectedProvince} onValueChange={setSelectedProvince}>
                <Select.Trigger placeholder="Seleccione un Provincia" style={{ width: "100%" }}/>
                <Select.Content>
                {
                    provinces.map((item)=>{
                    return (<Select.Item key={item.code} value={item.code}>{item.name}</Select.Item>)
                    })
                }
                </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text size="2" mb="1" style={{ display: "block" }}>Código Postal</Text>
            {
                city ? 
                (<TextField.Root value={zipCode} onChange={(e) => setZipCode(e.target.value)} disabled />) : 
                (<TextField.Root value={zipCode} onChange={(e) => setZipCode(e.target.value)}/>)
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
          <Flex justify="end" gap="2" mt="3" gridColumn={"span 4"}>
            <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
            <Button onClick={handleSubmit}>Guardar</Button>
          </Flex>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};