import React, { useEffect, useMemo, useState } from "react";
import { Button, Text, TextField, Box, Grid, Flex, Checkbox, Badge } from "@radix-ui/themes";
import { LogisticsProviderService, OriginSaleService, SaleService, type LogisticsProviderResponse, type OriginSaleResponse, type ResultPageResponseOfSaleResponse, type SaleFilter, } from "../../../api/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import Select, { } from "react-select"
import { faAnglesDown, faAnglesUp, faSearch } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { SaleStates } from "./SaleState";
import { SaleStateColor } from "./SaleStateColor";

type Option = { value: string; label: string };

type SaleFilterProps = {
  onFilter: (value: ResultPageResponseOfSaleResponse) => void;
  setPage: (value: number) => void;
  setLoading: (open: boolean) => void;
  rows: number;
  page: number;
  refreshFilter: boolean;
};

export const Filter: React.FC<SaleFilterProps> = ({
  onFilter,
  setLoading,
  page, 
  setPage,
  rows,
  refreshFilter
}) => {
    const [showFilter, setShowFilter] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [number, setNumber] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [deliveryDateFrom, setDeliveryDateFrom] = useState<Date | null>(null);
    const [deliveryDateTo, setDeliveryDateTo] = useState<Date | null>(null);

    const [listLogisticsProvider, setListLogisticsProvider] = useState<LogisticsProviderResponse[]>([]);
    const [selectedOptionLogisticsProvider, setSelectedOptionLogisticsProvider] = useState<Option|null>();
    const [optionLogisticsProvider, setOptionLogisticsProvider] = useState<Option[]>([]);
    const logisticsProvider = useMemo(() => { return listLogisticsProvider.find(p => p.code === selectedOptionLogisticsProvider?.value) ?? null; }, [selectedOptionLogisticsProvider, listLogisticsProvider]);
  
    const [listOriginSale, setListOriginSale] = useState<OriginSaleResponse[]>([]);
    const [selectedOptionOriginSale, setSelectedOptionOriginSale] = useState<Option|null>();
    const [optionOriginSale, setOptionOriginSale] = useState<Option[]>([]);
    const originSale = useMemo(() => { return listOriginSale.find(p => p.code === selectedOptionOriginSale?.value) ?? null; }, [selectedOptionOriginSale, listOriginSale]);
      
    const [selectedStates, setSelectedStates] = useState<string[]>(["Creado", "Confirmado", "Preparado", "PendienteDespachar", "EnViaje"]);

    useEffect(() => {
        OriginSaleService.originSaleGetAll().then((data)=> { 
            setListOriginSale(data);
            const options = data.map(x => { return { value: x.code, label: x.code + "-" + x.name } as Option; });
            setOptionOriginSale(options); 
        });

        LogisticsProviderService.logisticsProviderGetAll().then(data => {
            setListLogisticsProvider(data);
            const options = data.map(x => { return { value: x.code, label: x.code + "-" + x.name }; });
            setOptionLogisticsProvider(options); 
        });
    }, []);


    const SearchEvent = () => {
        setLoading(true);
        const filter = {} as SaleFilter ;
        filter.page = page;
        filter.countRows = rows;
        filter.searchString = searchString; 
        filter.number = (number != "" ? Number.parseInt(number) : undefined);
        filter.identifier = identifier;
        filter.originSaleId = originSale?.id ?? 0; 
        filter.logisticsProviderId = logisticsProvider?.id ?? 0; 
        filter.deliveryDateFrom = deliveryDateFrom ? format(deliveryDateFrom, "dd-MM-yyyy") : "";
        filter.deliveryDateTo = deliveryDateTo ? format(deliveryDateTo, "dd-MM-yyyy") : "";
        filter.skus = [];
        filter.states = selectedStates;
        
        SaleService.saleGetPage(filter)
            .then((data) => {setLoading(false); onFilter(data);});
    };

    useEffect(() => SearchEvent(), [page, rows, refreshFilter]);

    const CheckStateEvent = (state : string) => {
        if(selectedStates.some(x => x === state))
            setSelectedStates(selectedStates.filter(x => x !== state));
        else
            setSelectedStates(selectedStates.concat([state]));
    };

    return (
        <Grid columns="10fr 1fr" gap={"2"}>
            <Box>
                <TextField.Root placeholder="Filtro libre" value={searchString} onChange={(e) => setSearchString(e.target.value)}/>
            </Box>
            {!showFilter && (
                <Flex justify={"start"}>
                    <Button onClick={() => setShowFilter(true)}><FontAwesomeIcon icon={faAnglesDown} /></Button>
                </Flex>
            )}
            {showFilter && (
                <Flex justify={"start"}>
                    <Button onClick={() => setShowFilter(false)}><FontAwesomeIcon icon={faAnglesUp} /></Button>
                </Flex>
            )}
            {showFilter && (
                <Box gridColumn={"span 2"}>
                    <Grid columns={"8"} gap={"2"}>
                        <Box>
                            <Text size="1" mb="1" style={{ display: "block" }}>Numero</Text>
                            <TextField.Root type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </Box>
                        <Box>
                            <Text size="1" mb="1" style={{ display: "block" }}>Identificador</Text>
                            <TextField.Root value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                        </Box>
                        <Box>
                            <Text size="1" mb="1" style={{ display: "block" }}>Fecha Entrega Desde</Text>
                            <DatePicker selected={deliveryDateFrom} dateFormat="dd-MM-yyyy" onChange={(value:Date | null) => setDeliveryDateFrom(value)} />
                        </Box>
                        <Box>
                            <Text size="1" mb="1" style={{ display: "block" }}>Hasta</Text>
                            <DatePicker selected={deliveryDateTo} dateFormat="dd-MM-yyyy" onChange={(value:Date | null) => setDeliveryDateTo(value)} />
                        </Box>
                        <Box gridColumn={"span 2"}>
                            <Text size="1" mb="1" style={{ display: "block" }}>Origen Venta</Text>
                            <Select options={optionOriginSale} value={selectedOptionOriginSale} onChange={option=> setSelectedOptionOriginSale(option as Option) } isClearable/>
                        </Box>
                        <Box gridColumn={"span 2"}>
                            <Text size="1" mb="1" style={{ display: "block" }}>Proveedor Logistico</Text>
                            <Select options={optionLogisticsProvider} value={selectedOptionLogisticsProvider} onChange={option=> { setSelectedOptionLogisticsProvider(option as Option); } } isClearable/>
                        </Box>
                        <Box gridColumn={"span 8"}>
                            <Text size="1" mb="1" style={{ display: "block" }}>Estados:</Text>
                            <Flex justify="start" direction={"row"} gap="2" mt="3" >
                                <Button size={"1"} onClick={() => {setSelectedStates([]);}}>Todos</Button>
                                <Button size={"1"} onClick={() => {setSelectedStates(["Creado", "Confirmado", "Preparado", "PendienteDespachar", "EnViaje"]);}}>Pendientes</Button>
                                <Button size={"1"} onClick={() => {setSelectedStates(["Rechazado", "Entregado", "Cancelado", "EntregadoParcial"]);}}>Finalizados</Button>
                                {SaleStates.map((state) => (
                                    <Text as="label" size="1" color={SaleStateColor[state]}>
                                        <Flex as="span" gap="1">
                                            <Checkbox checked={selectedStates.some(x => x === state)} color={SaleStateColor[state]} onCheckedChange={() => CheckStateEvent(state)} />
                                            <Badge style={{fontWeight: "bold", fontSize: "14px"}} color={SaleStateColor[state]}>{state}</Badge>
                                        </Flex>
                                    </Text>
                                ))}
                            </Flex>
                        </Box>
                        <Flex justify="end" gap="2" mt="3" gridColumn={"span 8"}>
                            <Button onClick={() => {if(page !== 1) setPage(1); else SearchEvent();}}><FontAwesomeIcon icon={faSearch} /></Button>
                        </Flex>
                    </Grid>                
                    
                    
                </Box>
            )}
        </Grid>
  );
};