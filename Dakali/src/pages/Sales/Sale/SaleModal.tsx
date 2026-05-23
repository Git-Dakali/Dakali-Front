import React, { useState, useEffect, useMemo } from "react";
import Select, { } from "react-select"
import { format } from "date-fns";
import { Dialog, Button, Flex, Text, TextField, Box, Grid, Tabs, TextArea, Heading, Badge, Table, Tooltip, Checkbox, Skeleton } from "@radix-ui/themes";
import { CityService, OriginSaleService, ProductService, ProvinceService, SaleDetailService, SaleService, TaxStatusService, type CityRequest, type CityResponse, type OriginSaleRequest, 
        type OriginSaleResponse, type ProductResponse, type ProvinceRequest, type ProvinceResponse, type SaleDetailRequest, type SaleDetailResponse, type SaleRequest, type SaleResponse, 
        type TaxStatusRequest, type TaxStatusResponse } from "../../../api/generated";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faCheckCircle, faXmarkCircle, faXmarkSquare, faCheckSquare, faTrash, faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { ErrorModal } from "../../../components/ErrorModal";
import { parse } from "date-fns";


type Option = { value: string; label: string };

type SaleModalProps = {
  open: boolean;
  sale: SaleResponse | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: SaleRequest) => Promise<void> | void;
};

export const SaleModal : React.FC<SaleModalProps> = ({
  open,
  sale,
  onOpenChange,
  onSave
}) => {
  const [numberFormatArg] = useState(new Intl.NumberFormat("es-AR"));
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [number, setNumber] = useState(0 );
  const [arcaNumber, setArcaNumber] = useState("" );
  const [identifier, setIdentifier] = useState("" );
  const [dni, setDni] = useState("");
  const [cuit, setCuit] = useState("");
  const [date, setDate] = useState<Date|null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date|null>(null);
  const [deliveryStartTime, setDeliveryStartTime] = useState<string|null>("09:00");
  const [deliveryEndTime, setDeliveryEndTime] = useState<string|null>("21:00");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [phone, setPhone] = useState("");
  const [observation, setObservation] = useState("");
  const [grossPrice, setGrossPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discounts, setDiscounts] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(6000);
  const [state, setState] = useState("");
  //const [pdfInvoice, setPdfInvoice] = useState(sale.pdfInvoice);
    const [saleDetails, setSaleDetails] = useState<SaleDetailResponse[]>([]);

   const [refreshDetails, setRefreshDetails] = useState(false);

  const [priceManual, setPriceManual] = useState<number>(0);
  const [count, setCount] = useState<number>(1);
  const [isExtra, setIsExtra] = useState(false);

  const [selectedOptionTaxStatus, setSelectedOptionTaxStatus] = useState<Option|null>();
  const [selectedOptionOriginSale, setSelectedOptionOriginSale] = useState<Option|null>();
  const [selectedOptionProvince, setSelectedOptionProvince] = useState<Option|null>();
  const [selectedOptionCity, setSelectedOptionCity] = useState<Option|null>();
  const [selectedOptionProduct, setSelectedOptionProduct] = useState<Option|null>();
  const [selectedOptionVariant, setSelectedOptionVariant] = useState<Option|null>();
  const [selectedOptionColor, setSelectedOptionColor] = useState<Option|null>();
  
  const [listTaxStatus, setListTaxStatus] = useState<TaxStatusResponse[]>([]);
  const [listOriginSale, setListOriginSale] = useState<OriginSaleResponse[]>([]);
  const [listProvince, setListProvince] = useState<ProvinceResponse[]>([]);
  const [listCity, setListCity] = useState<CityResponse[]>([]);
  const [listProducts, setListProducts] = useState<ProductResponse[]>([]);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  const [optionTaxStatus, setOptionTaxStatus] = useState<Option[]>([]);
  const [optionOriginSale, setOptionOriginSale] = useState<Option[]>([]);
  const [optionProvince, setOptionProvince] = useState<Option[]>([]);
  const [optionCity, setOptionCity] = useState<Option[]>([]);
  

  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(()=> {
    const taxStatusPromise = TaxStatusService.taxStatusGetAll().then((data) => { 
        setListTaxStatus(data);
        setOptionTaxStatus(data.map(x => { return { value: x.id.toString(), label: x.code + "-" + x.name }; }));

        if(sale?.taxStatus)
            setSelectedOptionTaxStatus({value: sale.taxStatus.id.toString(), label: sale.taxStatus.code +"-"+sale.taxStatus.name});
     });

    const originSalePromise = OriginSaleService.originSaleGetAll().then((data)=> { 
        setListOriginSale(data);
        const valueOptions = data.map(x => { return { value: x.code, label: x.code + "-" + x.name }; }); 
        setOptionOriginSale(valueOptions); 

        if(sale?.originSale)
            setSelectedOptionOriginSale({value: sale.originSale.code, label: sale.originSale.code + "-" + sale.originSale.name});
        else
            setSelectedOptionOriginSale(valueOptions.find(x => x.value === "DKL"));
    });
    const provincePromise = ProvinceService.provinceGetAll().then((data)=> { 
        setListProvince(data); 
        setOptionProvince(data.map(x => { return { value: x.id.toString(), label: x.code + "-" + x.name }; })); 

        if(sale?.city?.province)
            setSelectedOptionProvince({value: sale.city.province.id.toString(), label: sale.city.province.code + "-" + sale.city.province.name});

        if(sale?.city)
            setSelectedOptionCity({ value: sale.city.id.toString(), label: sale.city.zipCode + "-" + sale.city.name });
    });

    const productPromise = ProductService.productGetAll().then((data)=>{ setListProducts(data); });

    Promise.all([taxStatusPromise, originSalePromise, provincePromise, productPromise]).then(() => {

        SaleService.saleGet(sale?.id).then(data => {
            setNumber(sale?.number ?? 0 );
            setArcaNumber(sale?.arcaNumber ?? "" );
            setIdentifier(sale?.identifier ?? "" );
            setDni(data?.dni ?? "");
            setCuit(sale?.cuit ?? "");
            setDate(parse(data.date ?? "", "dd-MM-yyyy HH:mm", new Date()));
            setDeliveryDate(parse(data.deliveryDate??"", "dd-MM-yyyy HH:mm", new Date()));
            setDeliveryStartTime(sale?.deliveryStartTime??"09:00");
            setDeliveryEndTime(sale?.deliveryEndTime ?? "21:00");
            setBusinessName(sale?.businessName ?? "");
            setAddress(sale?.address ?? "");
            setFloor(sale?.floor ?? "");
            setApartment(sale?.apartment ?? "");
            setPhone(sale?.phone ?? "");
            setObservation(sale?.observation ?? "");
            setGrossPrice(sale?.grossPrice ?? 0);
            setTotalPrice(sale?.totalPrice ?? 0);
            setDiscounts(sale?.discounts ?? 0);
            setShippingPrice(sale?.shippingPrice ?? 6000);
            setState(sale?.state ?? "Creado");
            //const [pdfInvoice, setPdfInvoice] = useState(sale.pdfInvoice);
            setSaleDetails(sale?.saleDetails ?? []);
        })
    })
  }, []);

  useEffect(() => {
    const detailsNotExtra = saleDetails.filter(x => !x.isExtra);
    const totalCount = detailsNotExtra.reduce((total, detail) => total + detail.count, 0);
    const price = detailsNotExtra.reduce((total, detail) => total + detail.price, 0);
    const discountsPrice = totalCount * shippingPrice;
    setGrossPrice(price)
    setDiscounts(discountsPrice);
    setTotalPrice((price - discountsPrice) + shippingPrice);
  }, [saleDetails]);

  useEffect(() => {
    if( (sale?.id ?? 0) > 0)
        SaleDetailService.saleDetailGetBySale(sale?.id).then((data) => { setSaleDetails(data); });
  }, [refreshDetails]);

  const taxStatus = useMemo(() => { return listTaxStatus.find(p => p.id.toString() === selectedOptionTaxStatus?.value) ?? null; }, [selectedOptionTaxStatus, listTaxStatus]);
  const originSale = useMemo(() => { return listOriginSale.find(p => p.code === selectedOptionOriginSale?.value) ?? null; }, [selectedOptionOriginSale, listOriginSale]);
  const province = useMemo(() => { return listProvince.find(x => x.id.toString() === selectedOptionProvince?.value); }, [selectedOptionProvince, listProvince]);
  const city = useMemo(() => { return listCity.find(p => p.id.toString() === selectedOptionCity?.value) ?? null; }, [selectedOptionCity, listCity]);
  const product = useMemo(() => { return listProducts.find(p => p.id.toString() === selectedOptionProduct?.value) ?? null; }, [selectedOptionProduct, listProducts]);
  const listVariants = useMemo(() => { return product?.variants ?? []; }, [product]);
  const variant = useMemo(() => { return listVariants.find(p => p.id.toString() === selectedOptionVariant?.value) ?? null; }, [selectedOptionVariant, listVariants]);
  const listColors = useMemo(() => { return variant?.colorsHex ?? []; }, [variant]);
  const color = useMemo(() => { return listColors.find(p => p.id.toString() === selectedOptionColor?.value) ?? null; }, [selectedOptionColor, listColors]);
  
  const optionProducts = useMemo(() => { return listProducts.map(item => { return { value: item.id.toString(), label: item.name }; })}, [listProducts]);
  const optionVariants = useMemo(() => { return listVariants.map(item => { return { value: item.id.toString(), label: item.name }; })}, [listVariants]);
  const optionColors = useMemo(() => { return listColors.map(item => { return { value: item.id.toString(), label: item.name }; })}, [listColors]);

    useEffect(() => {
        setIsLoadingCity(true);
        CityService.cityGetByCity(province as ProvinceRequest).then((data) => { 
            setListCity(data); 
            setOptionCity(data.map(x => { return { value: x.id.toString(), label: x.zipCode + "-" + x.name }; }));

            const findCity = data.find(x => x.id.toString() === selectedOptionCity?.value);
            
            if(findCity === null || findCity === undefined)
                setSelectedOptionCity(null);
        }).finally(() => {setIsLoadingCity(false);});
      
    }, [province])

  const price = useMemo(() => {
        console.log({variant, count});
        return (variant?.salePrice ?? 0) * count;
  }, [variant, count]);

  useEffect(() => {
    setPriceManual(price);
  }, [price]);

  const handleSubmit = () => {
    const saleRequest = {} as SaleRequest;
    saleRequest.id = sale?.id ?? 0;
    saleRequest.guid = sale?.guid ?? crypto.randomUUID();
    saleRequest.searchString = sale?.searchString ?? "";
    saleRequest.identifier = identifier;
    saleRequest.dni = dni;
    saleRequest.cuit = cuit;
    saleRequest.number = number;
    saleRequest.arcaNumber = arcaNumber;
    saleRequest.date = date ? format(date, "dd-MM-yyyy") : "";
    saleRequest.deliveryDate = deliveryDate ? format(deliveryDate, "dd-MM-yyyy") : "";
    saleRequest.deliveryStartTime = deliveryStartTime ?? "00:00";
    saleRequest.deliveryEndTime = deliveryEndTime ?? "00:00";
    saleRequest.businessName = businessName;
    saleRequest.address = address;
    saleRequest.floor = floor;
    saleRequest.apartment = apartment;
    saleRequest.phone = phone;
    saleRequest.observation = observation;
    saleRequest.totalPrice = totalPrice;
    saleRequest.grossPrice = grossPrice;
    saleRequest.discounts = discounts;
    saleRequest.shippingPrice = shippingPrice;
    saleRequest.state = state;
    saleRequest.pdfInvoice = sale?.pdfInvoice;
    saleRequest.taxStatus = taxStatus as TaxStatusRequest;
    saleRequest.originSale = originSale as OriginSaleRequest;
    saleRequest.city = city as CityRequest;
    saleRequest.saleDetails = saleDetails ?? [];

    onSave(saleRequest);
  };

  const AddDetail = () => {

    if(product === null)
    {
        setErrorOpen(true);
        setErrorMessage("Debe seleccionar un producto");
        return;
    }

    if(variant === null)
    {
        setErrorOpen(true);
        setErrorMessage("Debe seleccionar una variante");
        return;
    }

    if(color === null)
    {
        setErrorOpen(true);
        setErrorMessage("Debe seleccionar un color");
        return;
    }

    if(isNaN(count))
    {
        setErrorOpen(true);
        setErrorMessage("Debe ingresar una cantidad");
        return;
    }

    if(count <= 0)
    {
        setErrorOpen(true);
        setErrorMessage("Debe ingresar una cantidad mayor a 0");
        return;
    }
    
    const detail = {} as SaleDetailResponse;
    detail.id = 0;
    detail.guid = crypto.randomUUID();
    detail.searchString = "";
    detail.product = product ?? undefined;
    detail.variant = variant ?? undefined;
    detail.color = color ?? undefined;
    detail.count = count;
    detail.price = priceManual;
    detail.isExtra = isExtra;
    detail.stock = undefined;

    if((sale?.id ?? 0) > 0)
    {
        SaleDetailService.saleDetailCreate(detail as SaleDetailRequest, sale?.id ?? 0)
        .then(() => {
            setRefreshDetails(!refreshDetails);
            setIsAdding(false);
            
            setSelectedOptionProduct(null);
            setSelectedOptionVariant(null);
            setSelectedOptionColor(null);
            setCount(1);
            setPriceManual(0);
            setIsExtra(false);
        })
        .catch((error) => { 
          console.log({error});
          setErrorMessage(error.body.message);
          setErrorOpen(true);
        });
    }
    else
    {
        setSaleDetails(saleDetails?.concat([detail]));
        setIsAdding(false);

        setSelectedOptionProduct(null);
        setSelectedOptionVariant(null);
        setSelectedOptionColor(null);
        setCount(1);
        setPriceManual(0);
        setIsExtra(false);
    }
  };

  const DeleteDetail = (detail: SaleDetailResponse) => {

    if((sale?.id ?? 0) > 0)
    {
        SaleDetailService.saleDetailDelete(detail, sale?.id).then(() => {
            setRefreshDetails(!refreshDetails);
        });

    }
    else{
        setSaleDetails(saleDetails.filter(x => x.guid !== detail.guid));
    }
    
  };

  const CancelDetail = () => {
    setIsAdding(false);

    setSelectedOptionProduct(null);
    setSelectedOptionVariant(null);
    setSelectedOptionColor(null);
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="80%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{"Venta"}</Dialog.Title>
          <Grid columns="1fr 1fr 1fr 1fr 1fr">
            <Box></Box>
            <Box></Box>
            <Box>
                <Flex justify="center" gap="2" mt="3">
                    <Heading size={"9"}>Nro {number}</Heading>
                </Flex>
                {
                    arcaNumber !== "" && (
                        <Flex justify="center" gap="2" mt="0">
                            <Heading size={"3"}>Arca {arcaNumber}</Heading>
                        </Flex>
                    )
                }
                {
                    identifier !== "" && (
                        <Flex justify="center" gap="2" mt="0">
                            <Heading size={"3"}>Identificador {sale?.identifier}</Heading>
                        </Flex>
                    )    
                }
            </Box>
            <Box></Box>
            <Box style={{alignContent:"center"}}>
                <Flex justify="end">
                    <Badge color="blue"><Heading size={"7"}>{state}</Heading></Badge>
                </Flex>
                <Flex justify="start">
                    <Heading size={"3"}>Total Bruto: {numberFormatArg.format(grossPrice)}$</Heading>
                </Flex>
                <Flex justify="start">
                    <Heading size={"3"}>Descuento: -{numberFormatArg.format(discounts)}$</Heading>
                </Flex>
                <Flex justify="start">
                    <Heading size={"3"}>Costo Envio: {numberFormatArg.format(shippingPrice)}$</Heading>
                </Flex>
                <Flex justify="start">
                    <Heading size={"5"}>Precio Neto: {numberFormatArg.format(totalPrice)}$</Heading>
                </Flex>
                
            </Box>
          </Grid>
          <br></br>
          <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            <Box></Box>
            <Box gridColumn={"span 2"}>
              <Text size="2" mb="1" style={{ display: "block" }}>Origen Venta<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
              <Select options={optionOriginSale} value={selectedOptionOriginSale} onChange={option=> setSelectedOptionOriginSale(option as Option) }/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha Emision<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <DatePicker selected={date} dateFormat="dd-MM-yyyy" onChange={(value:Date | null) => setDate(value)} />
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha Entrega<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <DatePicker selected={deliveryDate} dateFormat="dd-MM-yyyy" onChange={(value:Date | null) => setDeliveryDate(value)} />
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Hora Inicio<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <TimePicker value={deliveryStartTime} format="HH:mm" onChange={(time:string|null) => setDeliveryStartTime(time)} disableClock/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Hora Fin<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <TimePicker value={deliveryEndTime} format="HH:mm" onChange={(time:string|null) => setDeliveryEndTime(time)} disableClock/>
            </Box>
            <Box>
            </Box>
            <Box></Box>
            <Box></Box>
            <Box></Box>
            <Box gridColumn={"span 7"}>
                <Text size="2" mb="1" style={{ display: "block" }}>Observacion</Text>
                <TextArea rows={4} value={observation} onChange={(e) => setObservation(e.target.value)}/>
            </Box>
            <Box gridColumn={"span 10"}>
              <Tabs.Root defaultValue="Destinatario">
              <Tabs.List>
                  <Tabs.Trigger value="Destinatario">Destinatario</Tabs.Trigger>
                  <Tabs.Trigger value="Arca">Arca</Tabs.Trigger>
              </Tabs.List>
              <Box pt="3">
                  <Tabs.Content value="Destinatario">
                        <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" width={"100%"} gap={"2"}>
                            <Box></Box>
                            <Box gridColumn={"span 3"}>
                                <Text size="2" mb="1" style={{ display: "block" }}>Razon Social<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                                <TextField.Root value={businessName} onChange={(e) => setBusinessName(e.target.value)}/>
                            </Box>
                            <Box gridColumn={"span 2"}>
                                <Text size="2" mb="1" style={{ display: "block" }}>Provincia</Text>
                                <Select options={optionProvince} value={selectedOptionProvince} onChange={option=> setSelectedOptionProvince(option as Option) }/>
                            </Box>
                            <Box gridColumn={"span 2"}>
                                <Text size="2" mb="1" style={{ display: "block" }}>Localidad<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                                {isLoadingCity && (<Skeleton height={"30px"}></Skeleton>)}
                                {!isLoadingCity && (
                                    <Select options={optionCity} value={selectedOptionCity} onChange={option=> setSelectedOptionCity(option?? null) }/>
                                )}
                                
                            </Box>
                            
                            <Box></Box>
                            <Box></Box>
                            <Box></Box>
                            <Box gridColumn={"span 3"}>
                                <Text size="2" mb="1" style={{ display: "block" }}>Domicilio<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                                <TextField.Root value={address} onChange={(e) => setAddress(e.target.value)}/>
                            </Box>
                            <Box>
                                <Text size="2" mb="1" style={{ display: "block" }}>Piso</Text>
                                <TextField.Root value={floor} onChange={(e) => setFloor(e.target.value)}/>
                            </Box>
                            <Box>
                                <Text size="2" mb="1" style={{ display: "block" }}>Departamento</Text>
                                <TextField.Root value={apartment} onChange={(e) => setApartment(e.target.value)}/>
                            </Box>
                            <Box gridColumn={"span 2"}>
                                <Text size="2" mb="1" style={{ display: "block" }}>Telefono<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                                <TextField.Root value={phone} onChange={(e) => setPhone(e.target.value)}/>
                            </Box>
                            <Box></Box>
                            <Box></Box>
                      </Grid>
                  </Tabs.Content>
                  <Tabs.Content value="Arca">
                    <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" width={"100%"} gap={"2"}>
                        <Box></Box>
                        <Box gridColumn={"span 2"}>
                            <Text size="2" mb="1" style={{ display: "block" }}>Estado Fiscal</Text>
                            <Select options={optionTaxStatus} value={selectedOptionTaxStatus}  onChange={option => setSelectedOptionTaxStatus(option as Option) } />
                        </Box>
                        <Box>
                            <Text size="2" mb="1" style={{ display: "block" }}>DNI</Text>
                            <TextField.Root type="number" value={dni} onChange={(e) => setDni(e.target.value)}/>
                        </Box>
                        <Box>
                            <Text size="2" mb="1" style={{ display: "block" }}>CUIT</Text>
                            <TextField.Root type="number" value={cuit} onChange={(e) => setCuit(e.target.value)}/>
                        </Box>
                      </Grid>
                  </Tabs.Content>
              </Box>
              </Tabs.Root>
            </Box>
            <Box gridColumn={"span 10"} style={{ background: "var(--gray-2)", borderRadius: "var(--radius-3)", padding: "1%" }}>
                <Grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
                    {!isAdding && (
                        <Box gridColumn={"span 10"}>
                            <Flex justify={"end"}>
                                <Tooltip content="Crear"><Button onClick={() => { setIsAdding(true);}}><FontAwesomeIcon icon={faPlusCircle} /></Button></Tooltip>
                            </Flex>
                        </Box>
                    )}
                    {
                        isAdding && (
                            <>
                                <Box gridColumn={"span 2"}>
                                    <Text size="2" mb="1" style={{ display: "block" }}>Producto</Text>
                                    <Select options={optionProducts} value={selectedOptionProduct} onChange={option=> setSelectedOptionProduct(option as Option) }/>
                                </Box>
                                <Box gridColumn={"span 2"}>
                                    <Text size="2" mb="1" style={{ display: "block" }}>Variante</Text>
                                    <Select options={optionVariants} value={selectedOptionVariant} onChange={option=> setSelectedOptionVariant(option as Option) }/>
                                </Box>
                                <Box gridColumn={"span 2"}>
                                    <Text size="2" mb="1" style={{ display: "block" }}>Color</Text>
                                    <Select options={optionColors} value={selectedOptionColor} onChange={option=> setSelectedOptionColor(option as Option) }/>
                                </Box>
                                <Box>
                                    <Text size="2" mb="1" style={{ display: "block" }}>Cantidad</Text>
                                    <TextField.Root type="number" value={count.toString()} onChange={(e) => setCount(Number.parseInt(e.target.value))}/>
                                </Box>
                                <Box>
                                    <Text size="2" mb="1" style={{ display: "block" }}>Precio</Text>
                                    <TextField.Root type="number" value={priceManual.toString()} disabled/>
                                </Box>
                                <Box>
                                    <Text size="2" mb="1" style={{ display: "block" }}>Es Extrta?</Text>
                                    <Flex align="center" gap="2"><Checkbox size="3" checked={isExtra} onCheckedChange={(value) => setIsExtra(value === true)} /></Flex>
                                </Box>
                                <Box>
                                    <Tooltip content="Aceptar"><Button color="green" onClick={() => { AddDetail();}}><FontAwesomeIcon icon={faCheckCircle} /></Button></Tooltip>
                                    <Tooltip content="Cancelar"><Button color="red" onClick={() => { CancelDetail();}}><FontAwesomeIcon icon={faXmarkCircle} /></Button></Tooltip>
                                </Box>
                            </>
                        )
                    }
                    
                    <Box gridColumn={"span 10"}>
                        <Table.Root variant="surface">
                            <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell width={"20%"}>Producto</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"15%"}>Variante</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"15%"}>Color</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"5%"}>Cantidad</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"5%"}>Precio</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"5%"}>Es Extra?</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"25%"}>Ubicacion</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell width={"10%"}>Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            {(saleDetails ?? []).map(saleDetail => {
                                return (
                                <Table.Row key={saleDetail.guid}>
                                    <Table.Cell>{saleDetail.product?.model?.code}-{saleDetail.product?.name}</Table.Cell>
                                    <Table.Cell>{saleDetail.variant?.name}</Table.Cell>
                                    <Table.Cell>{saleDetail.color?.name}</Table.Cell>
                                    <Table.Cell>{saleDetail.count}</Table.Cell>
                                    <Table.Cell>{saleDetail.price}</Table.Cell>
                                    <Table.Cell>
                                        {
                                            saleDetail.isExtra 
                                                ?(<FontAwesomeIcon icon={faCheckSquare} color="green"/>) 
                                                :(<FontAwesomeIcon icon={faXmarkSquare} color="red" />)
                                        }
                                    </Table.Cell>
                                    <Table.Cell>{saleDetail.stock?.location?.hallway?.code}-{saleDetail.stock?.location?.column?.code}-{saleDetail.stock?.location?.level?.code}</Table.Cell>
                                    <Table.Cell>
                                        <Tooltip content="Eliminar"><Button color="red" onClick={() => { DeleteDetail(saleDetail);}}><FontAwesomeIcon icon={faTrash} /></Button></Tooltip>
                                    </Table.Cell>
                                </Table.Row>
                                );
                            })}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Grid>
            </Box>
            
            <Flex justify="end" gap="2" mt="3" gridColumn={"span 10"}>
              <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
              <Button onClick={handleSubmit}>Guardar</Button>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
      <ErrorModal
              open={errorOpen}
              onOpenChange={setErrorOpen}
              message={errorMessage}
            />
    </>
  );
};