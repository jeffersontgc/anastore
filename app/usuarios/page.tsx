"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/shared/Modal";
import UsersTable from "../components/usuarios/table";
import CreateAndUpdateUser from "../components/usuarios/form";
import { useDataStore } from "../store/data-store";
import { User, UsersFormInput } from "../types/users";

const emptyForm: UsersFormInput = {
  nombre: "",
  apellido: "",
  edad: "",
  telefono: "",
  imagen: null,
};

export default function UsuariosPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UsersFormInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const usuarios = useDataStore((state) => state.usuarios);
  const deudas = useDataStore((state) => state.deudas);
  const addUsuario = useDataStore((state) => state.addUsuario);
  const updateUsuario = useDataStore((state) => state.updateUsuario);
  const deleteUsuario = useDataStore((state) => state.deleteUsuario);
  const hydrated = useDataStore((state) => state.hydrated);

  const deudasActivasPorUsuario = useMemo(() => {
    const mapa: Record<number, number> = {};
    deudas.forEach((deuda) => {
      if (["pagada", "saldada"].includes(deuda.status)) return;
      mapa[deuda.fiadorId] = (mapa[deuda.fiadorId] || 0) + 1;
    });
    return mapa;
  }, [deudas]);

  console.log("usuarios", usuarios);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextId =
      usuarios.reduce((max: number, user: User) => Math.max(max, user.id), 0) +
      1;
    const payload: User = {
      ...form,
      id: editingId ?? nextId,
      edad: Number(form.edad || 0),
    };

    if (editingId) {
      updateUsuario(editingId, payload);
    } else {
      addUsuario(payload);
    }

    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(id: number) {
    const user = usuarios.find((u) => u.id === id);
    if (!user) return;
    setEditingId(id);
    setForm({
      nombre: user.nombre,
      apellido: user.apellido,
      edad: String(user.edad),
      telefono: user.telefono,
      imagen: user.imagen || null,
    });
    setOpen(true);
  }

  function handleFileChange(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imagen: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  if (!hydrated) {
    return (
      <AppShell
        title="Usuarios"
        description="Gestiona los fiadores registrados y sus datos de contacto"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Cargando datos locales...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Usuarios"
      description="Gestiona los fiadores registrados y sus datos de contacto"
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold uppercase text-slate-600">
              Usuarios
            </h2>
            <p className="text-xs text-slate-500">
              {usuarios.length} fiadores registrados
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Crear usuario
          </button>
        </div>

        <UsersTable
          usuarios={usuarios}
          deudasActivasPorUsuario={deudasActivasPorUsuario}
          startEdit={startEdit}
          deleteUsuario={deleteUsuario}
        />
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
          setForm(emptyForm);
        }}
        title={editingId ? "Editar usuario" : "Crear usuario"}
      >
        <CreateAndUpdateUser
          handleSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          handleFileChange={handleFileChange}
          setOpen={setOpen}
          setEditingId={setEditingId}
          emptyForm={emptyForm}
          editingId={editingId}
        />
      </Modal>
    </AppShell>
  );
}
