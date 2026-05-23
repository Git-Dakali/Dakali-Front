export type SaleState =
  | "Creado"
  | "Confirmado"
  | "Preparado"
  | "Anulado"
  | "PendienteDespachar"
  | "EnViaje"
  | "Rechazado"
  | "Entregado"
  | "PendienteFacturar"
  | "Facturado"
  | "Devuelto"
  | "Almacenado"
  | "Cancelado"
  | "EntregadoParcial"

export type ThemeColor =
  | "ruby"
  | "cyan"
  | "green"
  | "blue"
  | "gray"
  | "gold"
  | "bronze"
  | "brown"
  | "yellow"
  | "amber"
  | "orange"
  | "tomato"
  | "red"
  | "crimson"
  | "pink"
  | "plum"
  | "purple"
  | "violet"
  | "iris"
  | "indigo"
  | "sky"
  | "mint"
  | "lime"
  | "grass"
  | "teal";

export const SaleStateColor: Record<SaleState, ThemeColor> = {
  Creado: "yellow",
  Confirmado: "blue",
  Preparado: "plum",
  Anulado: "red",
  PendienteDespachar: "amber",
  EnViaje: "cyan",
  Rechazado: "red",
  Entregado: "green",
  PendienteFacturar: "iris",
  Facturado: "indigo",
  Devuelto: "amber",
  Almacenado: "orange",
  EntregadoParcial: "green",
  Cancelado: "red",
};
