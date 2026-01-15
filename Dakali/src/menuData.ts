// src/menuData.ts
export type MenuItem = {
  id: string;
  label: string;
  pageKey?: string;      // identificador de "página" interna
  children?: MenuItem[];
};

export const menuData: MenuItem[] = [
  {
    id: "product",
    label: "Configuracion",
    children: [
      {
        id: "Category",
        label: "Categoria",
        pageKey: "Category",
      },
      {
        id: "Model",
        label: "Modelo",
        pageKey: "Model",
      },
      {
        id: "Product",
        label: "Producto",
        pageKey: "Product",
      }
    ],
  },
  {
    id: "location",
    label: "Ubication",
    children: [
      {
        id: "EstadoUbicacion",
        label: "Estado",
        pageKey: "LocationState",
      },
      {
        id: "Hallway",
        label: "Pasillo",
        pageKey: "Hallway",
      },
      {
        id: "Column",
        label: "Columna",
        pageKey: "Column",
      },
      {
        id: "Level",
        label: "Nivel",
        pageKey: "Level",
      },
      {
        id: "Ubicaciones",
        label: "Ubicaciones",
        pageKey: "Location",
      }
    ],
  },
  {
    id: "menuStock",
    label: "Stock",
    children: [
      {
        id: "Stock",
        label: "Stock",
        pageKey: "Stock",
      }
    ],
  },
  {
    id: "menuVentas",
    label: "Ventas",
    children: [
      {
        id: "Sales",
        label: "Ventas",
        pageKey: "Sales",
      }
    ],
  }
];
