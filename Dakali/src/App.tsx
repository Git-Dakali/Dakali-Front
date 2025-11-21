import React, { useState } from "react";
import { Box, Flex, Text, ScrollArea } from "@radix-ui/themes";
import { MenuTreeRadix } from "./components/MenuTree";
import { menuData } from "./menuData";
import { CategoryPage } from "./pages/Category/CategoryPage";
import { ModelPage } from "./pages/Model/ModelPage";

type PageKey =
  | "Category"
  | "Model";

function App() {
  const [selectedPage, setSelectedPage] = useState<PageKey>("Category");

  const renderPage = () => {
    switch (selectedPage) {
      case "Category":
        return <CategoryPage></CategoryPage>;
      case "Model":
        return <ModelPage></ModelPage>;
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
