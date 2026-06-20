import type { ReactNode } from "react";
import { AppConfigContext } from "./AppConfigContext";
import type { AppConfig } from "./AppConfigContext";

interface Props {
  config: AppConfig;
  children: ReactNode;
}

export function AppConfigProvider({ config, children }: Props) {
  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}
