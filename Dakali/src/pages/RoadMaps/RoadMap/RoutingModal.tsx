import React, { useEffect, useRef, useState } from "react";
import { Dialog, Button, Flex, Text, Box, Grid, Heading, Card, ScrollArea, TextField } from "@radix-ui/themes";
import { RoadMapSaleService, SaleService, type RoadMapRequest, type RoadMapResponse, type RoadMapSaleRequest, type RoadMapSaleResponse } from "../../../api/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faGripVertical } from "@fortawesome/free-solid-svg-icons";


import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { ErrorModal } from "../../../components/ErrorModal";

type RoutingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadMap: RoadMapResponse;
  onSave: (values: RoadMapRequest) => Promise<void> | void;
};

export const RoutingModal: React.FC<RoutingModalProps> = ({
  open,
  onOpenChange,
  roadMap,
  onSave,
}) => {

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [saleNumber, setSaleNumber] = useState("");
  const [refreshSales, setRefreshSales] = useState(false);
  const [sales, setSales] = useState<RoadMapSaleResponse[]>([]);
  
  useEffect(()=> {
      RoadMapSaleService.roadMapSaleGetByRoadMap(roadMap?.id ?? 0).then(data => setSales(data.sort((a, b) => a.sortOrder - b.sortOrder)));
      
    }, []);

  useEffect(() => {
    RoadMapSaleService.roadMapSaleGetByRoadMap(roadMap?.id ?? 0).then(data => setSales(data.sort((a, b) => a.sortOrder - b.sortOrder)));
  }, [refreshSales]);

  const handleKeySaleNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log({saleNumber});
      AddSale()
    }
  };

  const SaveRoadMap = () => {
      const entity = {} as RoadMapRequest 
      entity.id = roadMap?.id ?? 0;
      entity.guid = roadMap?.guid ?? crypto.randomUUID();
      entity.searchString = roadMap?.searchString ?? "";
      entity.number = roadMap.number;
      entity.date = roadMap.date;
      entity.travelDate = roadMap.travelDate;
      entity.completionDate = roadMap.completionDate;
      entity.driver = roadMap.driver;
      entity.state = roadMap.state;
      entity.sales = sales;
      
      onSave(entity);
  };

  const AddSale = () => {
    SaleService.saleGetByNumber(Number.parseInt(saleNumber)?? 0)
    .then(sale => {
        if(sale === undefined || sale === null)
        {
            setErrorMessage("No se encontro La venta " + saleNumber);
            setErrorOpen(true);
            setRefreshSales(!refreshSales);
            return;
        }
        
        const roadMapSale:RoadMapSaleRequest = {id: 0, sale: sale, sortOrder: 0  };
        RoadMapSaleService.roadMapSaleAssignRoadMap(roadMapSale, roadMap.id)
            .then(() => { setRefreshSales(!refreshSales); })
            .catch((error) => { 
                console.log({error});
                setErrorMessage(error.body.message);
                setErrorOpen(true);
                setRefreshSales(!refreshSales);
            });
    })
    .catch((error) => { 
        console.log({error});
        setErrorMessage(error.body.message);
        setErrorOpen(true);
    });
  };

  const Sortable = ({sale, index}: {sale: RoadMapSaleResponse; index: number}) => 
  {
    const [element, setElement] = useState<Element | null>(null);
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const {isDragging} = useSortable({id: sale.sale.id, index, element, handle: handleRef});

    return (
      <Box >
          <Card ref={setElement} data-show={isDragging || undefined}>
              <Flex gap="3" align="center">
                  <Grid columns={"1fr 5fr 1fr"}>
                      <Box>
                        <Text as="div" size="6" weight="bold">{sale.sortOrder}</Text>
                      </Box>
                      <Box>
                          <Text as="div" size="2" weight="bold">{sale.sale.businessName}</Text>
                          <Text as="div" size="2" color="gray">{sale.sale.city?.zipCode}-{sale.sale.city?.name}, {sale.sale.address} {sale.sale.floor} {sale.sale.apartment}</Text> 
                      </Box>
                      <Box>
                          <Button variant="surface" color='gray' ref={handleRef}><FontAwesomeIcon icon={faGripVertical} /></Button>
                      </Box>
                  </Grid>
                  
              </Flex>
          </Card>
      </Box>

    );
  }

  const title = "Ruteo";

  return (
    <>
      
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content minWidth="80%" minHeight={"80%"} onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title>{title}</Dialog.Title>
        <Grid columns="1fr 1fr 1fr 1fr 1fr">
            <Box></Box>
            <Box></Box>
            <Box>
                <Flex justify="center" gap="2" mt="3">
                    <Heading size={"9"}>Nro {roadMap.number}</Heading>
                </Flex>
            </Box>
            <Box></Box>
            <Box></Box>
        </Grid>
        <Grid columns="1fr 1fr 1fr 1fr 1fr" gap={"1"}>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha Emision<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <TextField.Root  value={roadMap.date} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha en Viaje<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <TextField.Root  value={roadMap.travelDate} disabled/>
            </Box>
            <Box>
                <Text size="2" mb="1" style={{ display: "block" }}>Fecha Finalizacion<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
                <TextField.Root  value={roadMap.completionDate} disabled/>
            </Box>
            <Box>
              <Text style={{ display: "block" }}>Chofer<FontAwesomeIcon color="red" icon={faAsterisk} /></Text>
              <TextField.Root  value={roadMap.driver.firstName +", "+ roadMap.driver.lastName} disabled/>
            </Box>
            <Box></Box>
            <Box gridColumn={"span 5"}></Box>
            <Box></Box>
            <Box gridColumn={"span 3"}>
              <TextField.Root placeholder="Ingresar Numero Venta" value={saleNumber} onChange={(e) => setSaleNumber(e.target.value)} onKeyDown={handleKeySaleNumber} />
            </Box>
            <Box></Box>
            <Box gridColumn={"span 4"}></Box>
            <Box>
              <ScrollArea type="always" scrollbars="vertical" style={{ overflow: "hidden", height: 72*10 }}>
                <DragDropProvider onDragEnd={(event) => { setSales((items) => move(items, event).map((x, index) => { x.sortOrder = index; return x; })); }}>
                  <ul className="list">
                    {sales.map((sale, index) => (
                      <Sortable key={sale.sale.guid} sale={sale} index={index} />
                    ))}
                  </ul>
                </DragDropProvider>
              </ScrollArea>
            </Box>
            <Box gridColumn={"span 5"} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Flex justify="end" gap="2" mt="3">
                    <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
                    <Button onClick={SaveRoadMap}>Guardar</Button>
                </Flex>
            </Box>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
    <ErrorModal open={errorOpen} onOpenChange={setErrorOpen} message={errorMessage} />
    </>
  );
};