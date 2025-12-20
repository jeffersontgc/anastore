"use client";

import { create } from "zustand";
import queries from "../graphql/querys";
import mutations from "../graphql/mutations";
import { graphqlRequest } from "../graphql/client";
import {
  Debt,
  DebtStatus,
  PaginatedDebts,
  PaginatedProducts,
  Product,
  ProductType,
  User,
} from "../types/backend";

type CreateUserPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  profilePicture?: string | null;
};

type CreateProductPayload = {
  name: string;
  price: number;
  stock: number;
  type: ProductType;
};

type UpdateProductPayload = Partial<CreateProductPayload> & {
  uuid: string;
};

type CreateDebtPayload = {
  user_uuid: string;
  dueDate: string;
  products: { product_uuid: string; quantity: number }[];
};

type DataState = {
  users: User[];
  products: Product[];
  debts: Debt[];
  hydrated: boolean;
  loading: boolean;
  error?: string;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshDebts: () => Promise<void>;
  createUser: (input: CreateUserPayload) => Promise<void>;
  createProduct: (input: CreateProductPayload) => Promise<void>;
  updateProduct: (input: UpdateProductPayload) => Promise<void>;
  removeProduct: (uuid: string) => Promise<void>;
  createDebt: (input: CreateDebtPayload) => Promise<void>;
  updateDebtStatus: (uuid: string, status: DebtStatus) => Promise<void>;
};

const runQuery = async <T>(
  operationName: string,
  variables?: Record<string, unknown>
): Promise<T> => {
  return graphqlRequest<T>({
    document: queries,
    operationName,
    variables,
  });
};

const runMutation = async <T>(
  operationName: string,
  variables?: Record<string, unknown>
): Promise<T> => {
  return graphqlRequest<T>({
    document: mutations,
    operationName,
    variables,
  });
};

const clearSessionCookies = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.warn("No se pudo limpiar la sesion en el servidor", error);
  }

  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";
  }
};

export const useDataStore = create<DataState>((set, get) => ({
  users: [],
  products: [],
  debts: [],
  hydrated: false,
  loading: false,
  error: undefined,
  logout: async () => {
    await clearSessionCookies();
    set({
      users: [],
      products: [],
      debts: [],
      hydrated: false,
      error: undefined,
    });
  },
  hydrate: async () => {
    if (get().loading) return;
    set({ loading: true, error: undefined });
    try {
      const [usersResponse, productsResponse, debtsResponse] =
        await Promise.all([
          runQuery<{ users: User[] }>("Users"),
          runQuery<{ products: PaginatedProducts }>("Products", {
            filters: { page: 1, limit: 100 },
          }),
          runQuery<{ debts: PaginatedDebts }>("Debts"),
        ]);

      set({
        users: usersResponse.users ?? [],
        products: productsResponse.products?.data ?? [],
        debts: debtsResponse.debts?.data ?? [],
        hydrated: true,
        loading: false,
        error: undefined,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo cargar datos";
      set({
        loading: false,
        error: message,
      });
    }
  },
  refreshProducts: async () => {
    try {
      const response = await runQuery<{ products: PaginatedProducts }>(
        "Products",
        { filters: { page: 1, limit: 10 } }
      );
      set({ products: response.products?.data ?? [] });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar productos",
      });
    }
  },
  refreshUsers: async () => {
    try {
      const response = await runQuery<{ users: User[] }>("Users");
      set({ users: response.users ?? [] });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar usuarios",
      });
    }
  },
  refreshDebts: async () => {
    try {
      const response = await runQuery<{ debts: PaginatedDebts }>("Debts");
      set({ debts: response.debts?.data ?? [] });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar deudas",
      });
    }
  },
  createUser: async (input) => {
    await runMutation("CreateUser", { input });
    await get().refreshUsers();
  },
  createProduct: async (input) => {
    await runMutation("CreateProduct", { input });
    await get().refreshProducts();
  },
  updateProduct: async (input) => {
    await runMutation("UpdateProduct", { input });
    await get().refreshProducts();
  },
  removeProduct: async (uuid) => {
    await runMutation("RemoveProduct", { uuid });
    await get().refreshProducts();
  },
  createDebt: async (input) => {
    const dueDate = new Date(input.dueDate).toISOString();
    await runMutation("CreateDebt", {
      input: { ...input, dueDate },
    });
    await Promise.all([get().refreshDebts(), get().refreshProducts()]);
  },
  updateDebtStatus: async (uuid, status) => {
    await runMutation("UpdateDebtStatus", { uuid, status });
    await get().refreshDebts();
  },
}));
