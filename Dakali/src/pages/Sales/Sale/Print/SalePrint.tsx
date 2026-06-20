import React from "react";
import type { SaleResponse } from "../../../../api/generated";
import { } from "@radix-ui/themes";

interface Props {
  sale: SaleResponse;
}


export const SalePrint = React.forwardRef<HTMLDivElement, Props>(
  ({sale}, ref) => {
    console.log({sale});
    return (
        <div ref={ref} style={{minWidth: "200mm", minHeight:"270mm", fontSize:"14px"}}>
            <div style={{display: "grid", gridTemplateColumns: "5fr 2fr 5fr"}}>
                <div></div>
                <div style={{ textAlign: "center"}}>
                    <div style={{display:"inline-block", fontSize: "40px", fontWeight: "bold"}} >Nro {sale?.number ?? 0}</div>
                </div>
            </div>
            
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr "}}>
                <div style={{textAlign: "start"}}>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray", fontWeight: "bold"}}>Chofer</div> <br></br>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray"}}>{sale?.businessName}</div> 
                </div>
                <div style={{textAlign: "start"}}>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray", fontWeight: "bold"}}>Fecha Emision</div> <br></br>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray"}}>{sale?.date}</div> 
                </div>
                <div></div>
                <div></div>
            </div>
            <br></br>
            <div >
                {(sale?.saleDetails ?? []).map((detail) => {

                    return (
                        <div style={{border: "2px solid", padding: "5px", borderRadius: "25px", marginTop: "2px"}} className="page-break">
                            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"}}>
                                <div>
                                    <div style={{display:"inline-block", fontSize: "40px", width:"100%", textAlign:"center", fontWeight: "bold"}}>{detail.product?.name}</div>
                                    <div style={{display:"inline-block", fontSize: "15px", width:"100%", textAlign:"center", fontWeight: "bold"}}>{detail.productSku?.variant?.name}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            
            </div>
        </div>
    );
  }
);
