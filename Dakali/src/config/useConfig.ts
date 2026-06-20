import { useContext } from "react";
import { AppConfigContext } from "./AppConfigContext";

export function useConfig() {
  const config = useContext(AppConfigContext);
  if (!config) {
    throw new Error("No se pudo cargar el archivo Config.json");
  }
  return config;
}
