import React, { useState } from "react";
import { Box, Flex, Text, ScrollArea } from "@radix-ui/themes";
import { MenuTreeRadix } from "./components/MenuTree";
import { menuData } from "./menuData";
import { CategoryPage } from "./pages/Category/CategoryPage";
import { ModelPage } from "./pages/Model/ModelPage";
import { ProductPage } from "./pages/Product/ProductPage";
import { StockPage } from "./pages/Stock/StockPage";
import { LocationPage } from "./pages/Location/LocationPage";
import { LocationStatePage } from "./pages/LocationState/LocationStatePage";
import { HallwayPage } from "./pages/Hallway/HallwayPage";
import { ColumnPage } from "./pages/Column/ColumnPage";
import { LevelPage } from "./pages/Level/LevelPage";
import { SalesPage } from "./pages/Sales/SalesPage";

type PageKey =
  | "Default"
  | "Category"
  | "Product"
  | "Stock"
  | "Location"
  | "LocationState"
  | "Model"
  | "Hallway"
  | "Column"
  | "Level"
  | "Sales";

function App() {
  const [selectedPage, setSelectedPage] = useState<PageKey>("Default");

  const renderPage = () => {
    switch (selectedPage) {
      case "Category":
        return <CategoryPage></CategoryPage>;
      case "Model":
        return <ModelPage></ModelPage>;
      case "Product":
        return <ProductPage></ProductPage>;
      case "Stock":
        return <StockPage></StockPage>;
      case "LocationState":
        return <LocationStatePage></LocationStatePage>;
      case "Location":
        return <LocationPage></LocationPage>;
      case "Hallway":
        return <HallwayPage></HallwayPage>;
      case "Column":
        return <ColumnPage></ColumnPage>;
      case "Level":
        return <LevelPage></LevelPage>;
      case "Sales":
        return <SalesPage></SalesPage>;
      default:
        return <Text>Selecciona una opción del menú.</Text>;
    }
  };

  return (
    <Flex height="100vh">
      <Box
        width="260px"
        p="3"
        style={{ borderRight: "1px solid var(--gray-a5)" }}
      >
        <Text size="3" weight="bold" mb="3">
          Dakali
        </Text>

        <ScrollArea
          type="auto"
          scrollbars="vertical"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <MenuTreeRadix
            items={menuData}
            selectedPage={selectedPage}
            onSelectPage={(key) => setSelectedPage(key as PageKey)}
          />
        </ScrollArea>
      </Box>

      <Box flexGrow="1" p="4">
        {renderPage()}
      </Box>
    </Flex>
  );
}

export default App
