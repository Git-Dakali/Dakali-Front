import React, { useState, useEffect, useMemo, useRef } from "react";
import Select, { } from "react-select"
import { Dialog, Button, Flex, Text, TextField, Box, Grid } from "@radix-ui/themes";
import { type ProductColorResponse, type ProductResponse, type VariantResponse, ProductService } from "../../api/generated";
import { ProductPrint } from "./Print/ProductPrint";
import { useReactToPrint } from "react-to-print";
import { GetPrintStyle } from "../../PageStyle";

type ProductPrintModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductResponse; 
};

type Option = { value: string; label: string };

export const ProductPrintModal : React.FC<ProductPrintModalProps> = ({
  open,
  onOpenChange,
  product
}) => {
    const [productPersisted, setProductPersisted] = useState<ProductResponse|null>(null);
    const [selectedOptionVariant, setSelectedOptionVariant] = useState<Option|null>();
    const [selectedOptionColor, setSelectedOptionColor] = useState<Option|null>();

    const listVariants = useMemo(() => { return productPersisted?.variants ?? []; }, [productPersisted]);
    const variant = useMemo(() => { return listVariants.find(p => p.id.toString() === selectedOptionVariant?.value) ?? null; }, [selectedOptionVariant, listVariants]);
    const listColors = useMemo(() => { return variant?.colorsHex ?? []; }, [variant]);
    const color = useMemo(() => { return listColors.find(p => p.id.toString() === selectedOptionColor?.value) ?? null; }, [selectedOptionColor, listColors]);

    const optionVariants = useMemo(() => { return listVariants.map(item => { return { value: item.id.toString(), label: item.name }; })}, [listVariants]);
    const optionColors = useMemo(() => { return listColors.map(item => { return { value: item.id.toString(), label: item.name }; })}, [listColors]);

    const productPrintRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: productPrintRef,
        documentTitle: "Dakali",
        pageStyle: GetPrintStyle("Etiqueta 60x30")
      });

    useEffect(() => {
        ProductService.productGet((product?.id ?? 0)).then((data) => { setProductPersisted(data)});
    }, []);

    const title = "Impresion Etiqueta";
    return (
        <>
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content minWidth="40%" style={{paddingBottom: "3%"}} onInteractOutside={(e) => e.preventDefault()}>
                <Dialog.Title>{title}</Dialog.Title>

                <Grid columns="1fr 1fr 1fr" gap="3" rows="1fr auto" width="auto" height="100%">
                    <Box>
                        <Text size="2" mb="1" style={{ display: "block" }}>Producto</Text>
                        <TextField.Root value={(productPersisted?.model?.code ?? "") + " - " + (productPersisted?.name ?? "")} disabled/>
                    </Box>
                    <Box>
                        <Text size="2" mb="1" style={{ display: "block" }}>Variante</Text>
                        <Select options={optionVariants} value={selectedOptionVariant} onChange={option=> setSelectedOptionVariant(option as Option) }/>
                    </Box>
                    <Box>
                        <Text size="2" mb="1" style={{ display: "block" }}>Color</Text>
                        <Select options={optionColors} value={selectedOptionColor} onChange={option=> setSelectedOptionColor(option as Option) }/>
                    </Box>
                    <br></br>
                    <Flex gridColumn={"span 3"} justify="end" gap="2" mt="3">
                        <Dialog.Close><Button color="gray">Cancelar</Button></Dialog.Close>
                        {(variant !== null && color !== null) 
                        ? (<Button onClick={() => {onOpenChange(false); handlePrint();}}>Imprimir</Button>) 
                        : ( <Button disabled>Imprimir</Button>)}
        
                    </Flex>
                </Grid>
            </Dialog.Content>
        </Dialog.Root>
        <div style={{ display: "" }}>
                <ProductPrint ref={productPrintRef} product={productPersisted as ProductResponse} variant={variant as VariantResponse} color={color as ProductColorResponse} />
              </div>
        </>
  );
};