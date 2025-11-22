"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/shared/Modal";
import ProductosTable from "../components/productos/table";
import ProductosForm from "../components/productos/form";
import { useDataStore } from "../store/data-store";
import { Producto, ProductoType } from "../data/mock";

type FormState = {
  name: string;
  price: string;
  stock: string;
  type: ProductoType;
};

const emptyForm: FormState = {
  name: "",
  price: "",
  stock: "",
  type: "granos_basicos",
};

export default function ProductosPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const productos = useDataStore((state) => state.productos);
  const addProducto = useDataStore((state) => state.addProducto);
  const updateProducto = useDataStore((state) => state.updateProducto);
  const deleteProducto = useDataStore((state) => state.deleteProducto);
  const hydrated = useDataStore((state) => state.hydrated);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextId =
      productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const payload: Producto = {
      id: editingId ?? nextId,
      name: form.name,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      type: form.type,
    };

    if (editingId) {
      updateProducto(editingId, payload);
    } else {
      addProducto(payload);
    }

    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(id: number) {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;
    setEditingId(id);
    setForm({
      name: producto.name,
      price: String(producto.price),
      stock: String(producto.stock),
      type: producto.type,
    });
    setOpen(true);
  }

  if (!hydrated) {
    return (
      <AppShell
        title="Productos"
        description="Gestiona el inventario disponible para los fiados"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Cargando datos locales...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Productos"
      description="Gestiona el inventario disponible para los fiados"
    >
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Crear producto
        </button>
      </div>

      <ProductosTable
        productos={productos}
        startEdit={startEdit}
        deleteProducto={deleteProducto}
      />

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
          setForm(emptyForm);
        }}
        title={editingId ? "Editar producto" : "Crear producto"}
      >
        <ProductosForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setOpen(false);
            setEditingId(null);
            setForm(emptyForm);
          }}
          editingId={editingId}
        />
      </Modal>
    </AppShell>
  );
}
