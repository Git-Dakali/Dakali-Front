import React, { useMemo, useState } from "react";
import { Flex,  Card, Grid, Box, Text } from "@radix-ui/themes";


export const HomePage: React.FC = () => {

  const [isMobile] = useState(window.innerWidth < 750);

  const cardWidth = useMemo(() => { 
    if(isMobile)
      return (window.innerWidth / 2) * 0.9;
    else 
      return (window.innerWidth / 8) * 0.9;
    }, [isMobile]);
  
  const cardHeight = useMemo(() => { 
    return (window.innerHeight * 0.4) * 0.9; 
  }, []);

  const imgHeight = useMemo(() => { 
    return cardHeight * 0.4;
  }, [cardHeight]);

  const products = ["Producto 1", "Producto 2", "Producto 3", "Producto 4", "Producto 5", "Producto 6", "Producto 7", "Producto 8", "Producto 9", "Producto 10", "Producto 11"]
  return (
    <Flex wrap={"wrap"} gap={"3"}>
      {products.map(product => (
        <Box width={cardWidth+"px"} height={cardHeight+"px"}>
          <Card style={{width: "100%", height: "100%", backgroundColor: "#fffc"}}>
            <Grid>
              <Box width={"100%"} height={imgHeight + "px"}>
                <img src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80" width={"100%"} height={"100%"} style={{objectFit: "contain"}}></img>
              </Box>
              <Box>
                <Grid columns={"4fr 1fr"} rows={"1fr 2fr 1fr"}>
                  <Box style={{alignContent: "center"}} ><Text as="span" weight={"bold"} size={"3"}>{product}</Text></Box>
                  <Box><Text as="p" weight={"bold"} size={"5"}>37.000$</Text></Box>
                  <Box gridColumn={"span 2"}>
                    <Text size={"1"} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"}} >
                      Zapto de Vestig de tipo EcoCuero/Cuerina Son de hermosa calidad y comodo para caminar y antes deslisante. agregando mas texto para ver como funciona el corte y ver como funciona en mobile.
                    </Text>
                  </Box>
                  <Box></Box>
                </Grid>
              </Box>
            </Grid>
          </Card>
        </Box>
      ))}

    </Flex>
    
  );
};
