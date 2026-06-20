import { createContext } from "react";

interface ConfigSale {
    originSaleCode: string;
    logisticsProviderCode: string;
    deliveryStartTime: string;
    deliveryEndTime: string;
    shippingPrice: number;
    orderCutoffTime: string;
}

export interface AppConfig {
  apiBaseUrl: string;
  apiKeyGoogleMap: string;
  configSale: ConfigSale;
}

export const AppConfigContext = createContext<AppConfig | null>(null);