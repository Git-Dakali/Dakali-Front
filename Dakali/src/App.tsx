import { useState } from "react";
import { Box, Flex, Text, ScrollArea } from "@radix-ui/themes";
import { MenuTreeRadix } from "./components/MenuTree";
import { menuData } from "./menuData";
import { CategoryPage } from "./pages/Category/CategoryPage";
import { ProductPage } from "./pages/Product/ProductPage";
import { StockPage } from "./pages/Stock/StockPage";
import { LocationPage } from "./pages/Location/LocationPage";
import { LocationStatePage } from "./pages/LocationState/LocationStatePage";
import { HallwayPage } from "./pages/Hallway/HallwayPage";
import { ColumnPage } from "./pages/Column/ColumnPage";
import { LevelPage } from "./pages/Level/LevelPage";
import { ProvincePage } from "./pages/GeographicLocation/Province/ProvincePage";
import { CityPage } from "./pages/GeographicLocation/City/CityPage";
import { CountryPage } from "./pages/GeographicLocation/Country/CountryPage";
import { OriginSalePage } from "./pages/Sales/OriginSale/OriginSalePage";
import { LogisticsProviderPage } from "./pages/Sales/LogisticsProviders/LogisticsProviderPage";
import { SalePage } from "./pages/Sales/Sale/SalePage";
import { TaxStatusPage } from "./pages/Sales/TaxStatus/TaxStatusPage";

import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import './print.css';
import { DriverPage } from "./pages/RoadMaps/Driver/DriverPage";
import { RoadMapPage } from "./pages/RoadMaps/RoadMap/RoadMapPage";
import { LoadScript } from "@react-google-maps/api";
import { useConfig } from "./config/useConfig";
import { ReturnOrderPage } from "./pages/ReturnOrders/ReturnOrderPage";

type PageKey =
  | "Default"
  | "Category"
  | "Product"
  | "Stock"
  | "Location"
  | "LocationState"
  | "Hallway"
  | "Column"
  | "Level"
  | "Sales"
  | "TaxStatus"
  | "Country"
  | "Province"
  | "City"
  | "OriginSale"
  | "LogisticsProvider"
  | "Driver"
  | "RoadMap"
  | "ReturnOrder";

function App() {
  const [selectedPage, setSelectedPage] = useState<PageKey>("Default");
  const config = useConfig();

  const renderPage = () => {
    switch (selectedPage) {
      case "Category":
        return <CategoryPage></CategoryPage>;
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
        return <SalePage></SalePage>;
      case "Country":
        return <CountryPage></CountryPage>;
      case "Province":
        return <ProvincePage></ProvincePage>;
      case "City":
        return <CityPage></CityPage>;
      case "OriginSale":
        return <OriginSalePage></OriginSalePage>;
      case "LogisticsProvider":
        return <LogisticsProviderPage></LogisticsProviderPage>
      case "TaxStatus":
        return <TaxStatusPage></TaxStatusPage>
      case "Driver":
        return <DriverPage></DriverPage>
      case "RoadMap":
        return <RoadMapPage></RoadMapPage>
      case "ReturnOrder":
        return <ReturnOrderPage></ReturnOrderPage>
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
        <LoadScript googleMapsApiKey={config.apiKeyGoogleMap} libraries={["places"]}>
                {renderPage()}
        </LoadScript>
      </Box>
    </Flex>
  );
}

export default App
