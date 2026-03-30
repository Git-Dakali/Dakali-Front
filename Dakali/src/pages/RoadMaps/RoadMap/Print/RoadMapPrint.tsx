import React from "react";
import type { RoadMapResponse } from "../../../../api/generated";
import { } from "@radix-ui/themes";

interface Props {
  roadMap: RoadMapResponse;
}


export const RoadMapPrint = React.forwardRef<HTMLDivElement, Props>(
  ({roadMap}, ref) => {
    console.log({roadMap});
    return (
        <div ref={ref} className="Print-A4">
            <div style={{ textAlign: "center"}}>
                <div style={{display:"inline-block", fontSize: "40px", fontWeight: "bold"}} >Nro {roadMap?.number ?? 0}</div>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr "}}>
                <div style={{textAlign: "start"}}>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray", fontWeight: "bold"}}>Chofer</div> <br></br>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray"}}>{roadMap?.driver?.firstName}, {roadMap?.driver?.lastName}</div> 
                </div>
                <div style={{textAlign: "start"}}>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray", fontWeight: "bold"}}>Fecha Emision</div> <br></br>
                    <div style={{display: "inline-block", fontSize: "15px", color: "gray"}}>{roadMap?.date}</div> 
                </div>
                <div></div>
                <div></div>
            </div>
            <br></br>
            <div >
                {(roadMap?.sales ?? []).map((sale) => {

                    return (
                        <div style={{border: "2px solid", padding: "5px", borderRadius: "25px", marginTop: "2px"}} className="page-break">
                            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"}}>
                                <div>
                                    <div style={{display:"inline-block", fontSize: "40px", width:"100%", textAlign:"center", fontWeight: "bold"}}>{sale.sortOrder}</div>
                                </div>
                                <div style={{gridColumn: "span 3"}}>
                                    <div style={{fontSize: "14px", fontWeight: "bold"}}>{sale.sale.number} - {sale.sale.businessName}</div>
                                    <div style={{fontSize: "13px", color: "gray"}}>{sale.sale.city?.zipCode}-{sale.sale.city?.name}</div> 
                                    <div style={{fontSize: "13px", color: "gray"}}>{sale.sale.address} {sale.sale.floor} {sale.sale.apartment}</div>
                                    <div style={{fontSize: "13px", fontWeight: "bold"}}>{sale.sale.phone}</div>
                                </div>
                                <div style={{gridColumn: "span 3"}}>
                                    <div style={{fontSize: "14px", fontWeight: "bold"}}>{sale.sale.number} - {sale.sale.businessName}</div>
                                    <div style={{fontSize: "13px", color: "gray"}}>{sale.sale.city?.zipCode}-{sale.sale.city?.name}</div> 
                                    <div style={{fontSize: "13px", color: "gray"}}>{sale.sale.address} {sale.sale.floor} {sale.sale.apartment}</div>
                                    <div style={{fontSize: "13px", fontWeight: "bold"}}>{sale.sale.phone}</div>
                                </div>
                                <div style={{gridColumn: "span 3"}}>
                                    <div style={{fontSize: "14px", fontWeight: "bold"}}>{sale.sale.number} - {sale.sale.businessName}</div>
                                    <div style={{fontSize: "13px", color: "gray"}}>{sale.sale.city?.zipCode}-{sale.sale.city?.name}</div> 
                                    <div style={{fontSize: "13px", color: "gray"}}>{sale.sale.address} {sale.sale.floor} {sale.sale.apartment}</div>
                                    <div style={{fontSize: "13px", fontWeight: "bold"}}>{sale.sale.phone}</div>
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
