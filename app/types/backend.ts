export type ProductType =
  | "GRANOS_BASICOS"
  | "SNACKS"
  | "BEBIDAS"
  | "LACTEOS";

export type DebtStatus = "ACTIVE" | "PENDING" | "PAID" | "SETTLED";

export type Product = {
  id: number;
  uuid: string;
  name: string;
  price: number;
  stock: number;
  type: ProductType;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: number;
  uuid: string;
  firstname: string;
  lastname: string;
  email: string;
  picture?: string | null;
  isDelinquent: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type DebtItem = {
  id: number;
  uuid: string;
  quantity: number;
  price: number;
  product: Product;
};

export type Debt = {
  id: number;
  uuid: string;
  amount: number;
  status: DebtStatus;
  date_pay: string;
  user: User;
  products: DebtItem[];
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedProducts = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedDebts = {
  data: Debt[];
  total: number;
  totalAmount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SignInResponse = {
  access_token: string;
  refresh_token: string;
  session_uuid: string;
};
