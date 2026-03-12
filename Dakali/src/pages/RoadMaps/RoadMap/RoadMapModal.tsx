import React, { useEffect, useMemo, useState } from "react";
import Select, { } from "react-select"
import { Dialog, Button, Flex, Text, Box, Grid, Heading, Table } from "@radix-ui/themes";
import { DriverService, RoadMapSaleService, type DriverResponse, type RoadMapRequest, type RoadMapResponse, type RoadMapSaleResponse } from "../../../api/generated";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { format, parse } from "date-fns";

type Option = { value: string; label: string };

type RoadMapModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadMap: RoadMapResponse | null;         // null = crear
  onSave: (values: RoadMapRequest) => Promise<void> | void;
};

export const RoadMapModal: React.FC<RoadMapModalProps> = ({
  open,
  onOpenChange,
  roadMap,
  onSave,
}) => {

  const parseDate = (stringDate: string|undefined) => {
    if(stringDate === "" || stringDate === undefined)
      return null;

    return parse(stringDate ?? "", "dd-MM-yyyy", new Date())
  };

  const [number] = useState(roadMap?.number ?? 0);
  const [date, setDate] = useState<Date|null>(parseDate(roadMap?.date)?? new Date());
  const [travelDate, setTravelDate] = useState<Date|null>(parseDate(roadMap?.travelDate));
  const [completionDate, setCompletionDate] = useState<Date|null>(parseDate(roadMap?.completionDate));
  const [state] = useState(roadMap?.state ?? "Creado");

  const [sales, setSales] = useState<RoadMapSaleResponse[]>([]);
  const [selectedOptionDriver, setSelectedOptionDriver] = useState<Option|null>();
  const [listDriver, setListDriver] = useState<DriverResponse[]>([]);
  const [optionDrivers, setOptionDrivers] = useState<Option[]>([]);
  const driver = useMemo(() => { return listDriver.find(p => p.id.toString() === selectedOptionDriver?.value) ?? null; }, [selectedOptionDriver, listDriver]);
    
  useEffect(()=> {
      DriverService.driverGetAll().then((data)=> { 
          setListDriver(data);
          const valueOptions = data.map(x => { return { value: x.id.toString(), label: x.firstName + ", " + x.lastName }; }); 
          setOptionDrivers(valueOptions); 
  
          if(roadMap?.driver)
              setSelectedOptionDriver({value: roadMap.driver.id.toString(), label: roadMap.driver?.firstName + ", " + roadMap.driver?.lastName});

      });

      RoadMapSaleService.roadMapSaleGetByRoadMap(roadMap?.id ?? 0).then(data => setSales(data.sort((a, b) => a.sortOrder - b.sortOrder)));
      
    }, []);


  const handleSubmit = () => {
    const entity = {} as RoadMapRequest 
    entity.id = roadMap?.id ?? 0;
    entity.guid = roadMap?.guid ?? crypto.randomUUID();
    entity.searchString = roadMap?.searchString ?? "";
    entity.number = number;
    entity.date = date ? format(date, "dd-MM-yyyy") : "";
    entity.travelDate = travelDate ? format(travelDate, "dd-MM-yyyy") : "";
    entity.completionDate = completionDate ? format(completionDate, "dd-MM-yyyy") : "";
    entity.driver = driver as DriverResponse;
    entity.state = state;
    entity.sales = sales;
    onSave(entity);
  };

  
  const title = roadMap ? "Editar Hoja Ruta" : "Crear Hoja Ruta";

  return (
    <>
      
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="50%" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>
        <Grid columns="1fr 1fr 1fr 1fr 1fr">
            <Box></Box>
            <Box></Box>
            <Box>
                <Flex justify="center" gap="2" mt="3">
                    <Heading size={"9"}>Nro {number}</Heading>
                </Flex>
            </Box>
            <Box></Box>
            <Box></Box>
        </Grid>
        <Grid columns="1fr 1fr 1fr 1fr" gap={"7"}>
            <Box>
              <Text style={{ display: "block" }}>Chofer<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
              <Select options={optionDrivers} value={selectedOptionDriver} onChange={option=> setSelectedOptionDriver(option as Option) }/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha Emision<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <DatePicker selected={date} dateFormat="dd-MM-yyyy" onChange={(value:Date | null) => setDate(value)} />
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha en Viaje<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <DatePicker selected={travelDate} dateFormat="dd-MM-yyyy" onChange={(value:Date | null) => setTravelDate(value)} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha Finalizacion<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <DatePicker selected={completionDate} dateFormat="dd-MM-yyyy" onChange={(value:Date | null) => setCompletionDate(value)} disabled/>
            </Box>
            <Box gridColumn={"span 5"}>
              <Table.Root variant="surface">
                  <Table.Header>
                  <Table.Row>
                      <Table.ColumnHeaderCell width={"33%"}>Numero Venta</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell width={"33%"}>Precio</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell width={"33%"}>Orden</Table.ColumnHeaderCell>
                  </Table.Row>
                  </Table.Header>
                  <Table.Body>
                  {roadMap?.sales.map(sale => {
                      return (
                      <Table.Row key={sale.id}>
                          <Table.Cell>{sale.sale.number}</Table.Cell>
                          <Table.Cell>{sale.sale.totalPrice}</Table.Cell>
                          <Table.Cell>{sale.sortOrder}</Table.Cell>
                      </Table.Row>
                      );
                  })}
                  </Table.Body>
              </Table.Root>
            </Box>
            <Box gridColumn={"span 5"} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Flex justify="end" gap="2" mt="3">
                    <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </Flex>
            </Box>
        </Grid>
        
      </Dialog.Content>
    </Dialog.Root>
    </>
  );
};