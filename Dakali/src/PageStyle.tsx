export const GetPrintStyle = (type: "A4" | "Etiqueta 60x30") => {
    if (type === "Etiqueta 60x30") {
        return `
        @page {
            size: 60mm 30mm;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
        }
        `;
    }

    else if (type === "A4") 
    {
        return `
            @page {
                size: A4;
                margin: 0;
                padding: 30px;
            }
            body {
                margin: 0;
                padding: 0;
            }
        `;
    }
  
    return ``;
};