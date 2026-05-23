import React from "react";
import { } from "@radix-ui/themes";
import type { ProductColorResponse, ProductResponse, VariantResponse } from "../../../api/generated";
import Barcode from "react-barcode";

interface Props {
  product: ProductResponse;
  variant: VariantResponse;
  color: ProductColorResponse;
}


export const ProductPrint = React.forwardRef<HTMLDivElement, Props>(
  ({product, variant, color}, ref) => {
    console.log({product, variant, color});
    return (
        <div ref={ref} style={{width:"60mm", height:"30mm", padding:"4px", border: "1px solid black"}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 3fr "}}>
                <div style={{ textAlign: "center"}}>
                    <div style={{display:"inline-block", fontSize: "40px", fontWeight: "bold"}} >{variant?.name}</div>
                </div>
                <div style={{textAlign: "center"}}>
                    <div style={{ margin: "0px", padding:"0px", fontSize: "15px", fontWeight: "bold"}}>{product?.model?.code}</div>
                    <div style={{ margin: "0px", padding:"0px", fontSize: "10px", color: "gray", fontWeight: "bold"}}>{product?.name}</div>
                    <div style={{ margin: "0px", padding:"0px", fontSize: "10px", color: "gray", fontWeight: "bold"}}>{color?.name}</div>
                </div>
                <div style={{gridColumn:"span 2", textAlign: "center"}}>
                    <Barcode
                        value={color?.sku??""}
                        format="CODE128"
                        width={1}      // grosor de línea
                        height={20}      // altura del código
                        fontSize={10}    // texto debajo
                        displayValue={true}
                        margin={0}
                    />
                </div>
            </div>
            <br></br>
            
        </div>
    );
  }
);
