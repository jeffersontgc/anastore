"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/shared/Modal";
import ProductosTable from "../components/productos/table";
import ProductosForm from "../components/productos/form";
import { useDataStore } from "../store/data-store";
import { ProductType } from "../types/backend";

type FormState = {
  name: string;
  price: string;
  stock: string;
  type: ProductType;
};

const emptyForm: FormState = {
  name: "",
  price: "",
  stock: "",
  type: "GRANOS_BASICOS",
};

export default function ProductosPage() {
  const [open, setOpen] = useState(false);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const productos = useDataStore((state) => state.products);
  const createProducto = useDataStore((state) => state.createProduct);
  const updateProducto = useDataStore((state) => state.updateProduct);
  const deleteProducto = useDataStore((state) => state.removeProduct);
  const hydrated = useDataStore((state) => state.hydrated);
  const loading = useDataStore((state) => state.loading);
  const error = useDataStore((state) => state.error);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      name: form.name,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      type: form.type,
    };

    if (editingUuid) {
      await updateProducto({ uuid: editingUuid, ...payload });
    } else {
      await createProducto(payload);
    }

    setOpen(false);
    setEditingUuid(null);
    setForm(emptyForm);
  }

  function startEdit(uuid: string) {
    const producto = productos.find((p) => p.uuid === uuid);
    if (!producto) return;
    setEditingUuid(uuid);
    setForm({
      name: producto.name,
      price: String(producto.price),
      stock: String(producto.stock),
      type: producto.type,
    });
    setOpen(true);
  }

  if (!hydrated || loading) {
    return (
      <AppShell
        title="Productos"
        description="Gestiona el inventario disponible para los fiados"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Sincronizando datos con el backend...
        </div>
        {error ? (
          <p className="mt-3 text-sm text-rose-600">Error: {error}</p>
        ) : null}
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
          setEditingUuid(null);
          setForm(emptyForm);
        }}
        title={editingUuid ? "Editar producto" : "Crear producto"}
      >
        <ProductosForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => {
            setOpen(false);
            setEditingUuid(null);
            setForm(emptyForm);
          }}
          editingUuid={editingUuid}
        />
      </Modal>
    </AppShell>
  );
}
