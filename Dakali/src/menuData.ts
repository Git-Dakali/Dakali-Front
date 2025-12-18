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
      },
      {
        id: "Stock",
        label: "Stock",
        pageKey: "Stock",
      },
      {
        id: "StockState",
        label: "Estado Stock",
        pageKey: "StockState",
      }
    ],
  }
];
