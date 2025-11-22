export type DeudaStatus = "activa" | "pendiente" | "pagada" | "saldada";

export type ProductoType = "granos_basicos" | "snacks" | "bebidas" | "lacteos";

export type Fiador = {
  id: number;
  nombre: string;
  totalDeuda: number;
  status: DeudaStatus;
};

export type Deuda = {
  id: number;
  fiadorId: number;
  fechaPagar: string;
  status: DeudaStatus;
  monto: number;
  productos: Array<{
    nombre: string;
    precio: number;
    cantidad: number;
  }>;
};

export type Producto = {
  id: number;
  name: string;
  price: number;
  stock: number;
  type: ProductoType;
};

export const fiadoresMock: Fiador[] = [];
export const deudasMock: Deuda[] = [];
export const productosMock: Producto[] = [];

export const productTypeLabels: Record<ProductoType, string> = {
  granos_basicos: "Granos basicos",
  snacks: "Snacks",
  bebidas: "Bebidas",
  lacteos: "Lacteos",
};
