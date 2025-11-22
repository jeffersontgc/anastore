"use client";

import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { User } from "../types/users";
import { Deuda, Fiador, Producto } from "../data/mock";

const idbStorage: StateStorage = {
  getItem: async (name: string) => {
    const value = await get<string>(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await set(name, value);
  },
  removeItem: async (name: string) => {
    await del(name);
  },
};

type DataState = {
  fiadores: Fiador[];
  deudas: Deuda[];
  usuarios: User[];
  productos: Producto[];
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  addUsuario: (usuario: User) => void;
  updateUsuario: (id: number, data: Partial<User>) => void;
  deleteUsuario: (id: number) => void;
  addProducto: (producto: Producto) => void;
  updateProducto: (id: number, data: Partial<Producto>) => void;
  deleteProducto: (id: number) => void;
  addDeuda: (deuda: Deuda) => void;
  updateDeuda: (id: number, data: Partial<Deuda>) => void;
  deleteDeuda: (id: number) => void;
};

function recalcularFiadores(deudas: Deuda[], usuarios: User[]): Fiador[] {
  const usuarioMap = new Map(usuarios.map((u) => [u.id, u]));
  const fiadorTotals: Record<number, number> = {};
  deudas.forEach((d) => {
    fiadorTotals[d.fiadorId] = (fiadorTotals[d.fiadorId] || 0) + d.monto;
  });
  return Object.entries(fiadorTotals).map(([fiadorId, total]) => {
    const usuario = usuarioMap.get(Number(fiadorId));
    const nombre = usuario
      ? `${usuario.nombre} ${usuario.apellido || ""}`.trim()
      : `Fiador ${fiadorId}`;
    const ultimoStatus =
      deudas.filter((d) => d.fiadorId === Number(fiadorId)).slice(-1)[0]
        ?.status || "activa";
    return {
      id: Number(fiadorId),
      nombre,
      totalDeuda: total,
      status: ultimoStatus,
    };
  });
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      fiadores: [],
      deudas: [],
      usuarios: [],
      productos: [],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      addUsuario: (usuario) =>
        set((state) => ({ usuarios: [...state.usuarios, usuario] })),
      updateUsuario: (id, data) =>
        set((state) => ({
          usuarios: state.usuarios.map((u) =>
            u.id === id ? { ...u, ...data } : u
          ),
        })),
      deleteUsuario: (id) =>
        set((state) => ({
          usuarios: state.usuarios.filter((u) => u.id !== id),
        })),
      addProducto: (producto) =>
        set((state) => ({ productos: [...state.productos, producto] })),
      updateProducto: (id, data) =>
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      deleteProducto: (id) =>
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
        })),
      addDeuda: (deuda) =>
        set((state) => {
          const deudas = [...state.deudas, deuda];
          const fiadoresActualizados = recalcularFiadores(
            deudas,
            state.usuarios
          );
          const productosActualizados = state.productos.map((producto) => {
            const item = deuda.productos.find(
              (p) => p.nombre === producto.name
            );
            if (!item) return producto;
            return {
              ...producto,
              stock: Math.max(0, producto.stock - item.cantidad),
            };
          });
          return { deudas, fiadores: fiadoresActualizados, productos: productosActualizados };
        }),
      updateDeuda: (id, data) =>
        set((state) => {
          const deudas = state.deudas.map((d) =>
            d.id === id ? { ...d, ...data } : d
          );
          const fiadoresActualizados = recalcularFiadores(
            deudas,
            state.usuarios
          );
          return { deudas, fiadores: fiadoresActualizados };
        }),
      deleteDeuda: (id) =>
        set((state) => {
          const deudas = state.deudas.filter((d) => d.id !== id);
          const fiadoresActualizados = recalcularFiadores(
            deudas,
            state.usuarios
          );
          return { deudas, fiadores: fiadoresActualizados };
        }),
    }),
    {
      name: "credistore-data-v2",
      storage: createJSONStorage(() => idbStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      skipHydration: true,
    }
  )
);
