import React, { useState, useEffect } from "react";
import { Dialog, Button, Flex, Box, Grid, Table, Badge } from "@radix-ui/themes";
import { HistoricSaleService, type HistoricSaleResponse, type SaleResponse  } from "../../../api/generated";
import { SaleStateColor, type SaleState } from "./SaleStateColor";

type HistoricSaleModalProps = {
  open: boolean;
  sale: SaleResponse;
  onOpenChange: (open: boolean) => void;
};

export const HistoricSaleModal : React.FC<HistoricSaleModalProps> = ({
  open,
  sale,
  onOpenChange
}) => {
  const [histicSaleList, setHisticSaleList] = useState<HistoricSaleResponse[]>([]);
  
  useEffect(()=> {
    HistoricSaleService.historicSaleGet(sale.id).then((data)=> setHisticSaleList(data));
  }, []);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content minWidth="80%" onInteractOutside={(e) => e.preventDefault()}>
          <Dialog.Title>{"Historico Venta"}</Dialog.Title>
          <Grid columns="1fr" gap="3" rows="auto 1fr auto" width="auto" height="100%">
            <Box>
                <Table.Root variant="surface">
                    <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell width={"20%"}>Fecha</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell width={"20%"}>Estado</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell width={"60%"}>Descripcion</Table.ColumnHeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {(histicSaleList ?? []).map(histic => {

                      const state = histic.state as SaleState;
                        return (
                        <Table.Row key={histic.id}>
                            <Table.Cell>{histic.creationDate}</Table.Cell>
                            <Table.Cell><Badge style={{fontWeight: "bold", fontSize: "14px"}} color={SaleStateColor[state]}>{histic.state}</Badge></Table.Cell>
                            <Table.Cell>{histic.description}</Table.Cell>
                        </Table.Row>
                        );
                    })}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Flex justify="end" gap="2" mt="3">
              <Dialog.Close><Button color="gray">Cerrar</Button></Dialog.Close>
            </Flex>
          </Grid>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};