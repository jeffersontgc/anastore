"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/shared/Modal";
import UsersTable from "../components/usuarios/table";
import CreateUserFormModal from "../components/usuarios/form";
import { useDataStore } from "../store/data-store";
import { CreateUserForm } from "../types/users";
import { useAuthStore } from "@/app/store/auth-store";

const emptyForm: CreateUserForm = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  profilePicture: null,
};

export default function UsuariosPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserForm>(emptyForm);

  const usuarios = useDataStore((state) => state.users);
  const deudas = useDataStore((state) => state.debts);
  const createUser = useDataStore((state) => state.createUser);
  const hydrated = useDataStore((state) => state.hydrated);
  const loading = useDataStore((state) => state.loading);
  const error = useDataStore((state) => state.error);
  const user = useAuthStore((state) => state.currentUser);

  const deudasActivasPorUsuario = useMemo(() => {
    const mapa: Record<string, number> = {};
    deudas.forEach((deuda) => {
      if (deuda.status === "PAID" || deuda.status === "SETTLED") return;
      mapa[deuda.user.uuid] = (mapa[deuda.user.uuid] || 0) + 1;
    });
    return mapa;
  }, [deudas]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createUser(form);
    setOpen(false);
    setForm(emptyForm);
  }

  function handleFileChange(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profilePicture: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  if (!hydrated || loading) {
    return (
      <AppShell
        title="Usuarios"
        description="Gestiona los fiadores registrados y sus datos de contacto"
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
          {user?.isCeo && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Crear usuario
            </button>
          )}
        </div>

        <UsersTable
          usuarios={usuarios}
          deudasActivasPorUsuario={deudasActivasPorUsuario}
        />
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setForm(emptyForm);
        }}
        title="Crear usuario"
      >
        <CreateUserFormModal
          handleSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          handleFileChange={handleFileChange}
          onClose={() => {
            setOpen(false);
            setForm(emptyForm);
          }}
        />
      </Modal>
    </AppShell>
  );
}
