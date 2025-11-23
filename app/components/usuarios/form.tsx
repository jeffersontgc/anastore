import React from "react";
import Image from "next/image";
import { CreateUserForm } from "@/app/types/users";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: CreateUserForm;
  setForm: React.Dispatch<React.SetStateAction<CreateUserForm>>;
  handleFileChange: (files: FileList | null) => void;
  onClose: () => void;
}

const CreateUserFormModal = ({
  handleSubmit,
  form,
  setForm,
  handleFileChange,
  onClose,
}: Props) => {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span>Nombre</span>
          <input
            required
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span>Apellido</span>
          <input
            required
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span>Contraseña</span>
          <input
            required
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
      </div>
      <div className="space-y-2">
        <span className="text-sm text-slate-700">Foto (opcional)</span>
        <div className="flex items-center gap-3">
          {form.profilePicture ? (
            <Image
              src={form.profilePicture}
              alt="Preview"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
              ?
            </div>
          )}
          <div className="flex flex-1 items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files)}
              className="w-full text-sm"
            />
            {form.profilePicture ? (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, profilePicture: null }))}
                className="text-xs font-semibold text-slate-600 hover:underline"
              >
                Quitar
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Crear usuario
        </button>
      </div>
    </form>
  );
};

export default CreateUserFormModal;
