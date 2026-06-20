import React from "react";
import { } from "@radix-ui/themes";
import type { ProductResponse, ProductSkuResponse } from "../../../api/generated";
import Barcode from "react-barcode";

interface Props {
  product: ProductResponse;
  productSku: ProductSkuResponse;
}


export const ProductPrint = React.forwardRef<HTMLDivElement, Props>(
  ({product, productSku}, ref) => {
    console.log({product, productSku});
    return (
        <div ref={ref} style={{width:"60mm", height:"30mm", padding:"4px", border: "1px solid black"}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 3fr "}}>
                <div style={{ textAlign: "center"}}>
                    <div style={{display:"inline-block", fontSize: "40px", fontWeight: "bold"}} >{productSku.variant?.name}</div>
                </div>
                <div style={{textAlign: "center"}}>
                    <div style={{ margin: "0px", padding:"0px", fontSize: "15px", fontWeight: "bold"}}>{product?.code}</div>
                    <div style={{ margin: "0px", padding:"0px", fontSize: "10px", color: "gray", fontWeight: "bold"}}>{product?.name}</div>
                    <div style={{ margin: "0px", padding:"0px", fontSize: "10px", color: "gray", fontWeight: "bold"}}>{productSku.color?.name}</div>
                </div>
                <div style={{gridColumn:"span 2", textAlign: "center"}}>
                    <Barcode
                        value={productSku?.sku??""}
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
