import React from "react";
import Image from "next/image";
import { UsersFormInput } from "@/app/types/users";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: UsersFormInput;
  setForm: React.Dispatch<React.SetStateAction<UsersFormInput>>;
  handleFileChange: (files: FileList | null) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  emptyForm: UsersFormInput;
  editingId: number | null;
}
const CreateAndUpdateUser = ({
  handleSubmit,
  form,
  setForm,
  ...props
}: Props) => {
  const { handleFileChange, setOpen, setEditingId, emptyForm, editingId } =
    props;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span>Nombre</span>
          <input
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span>Apellido</span>
          <input
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span>Edad</span>
          <input
            required
            type="number"
            min={18}
            value={form.edad}
            onChange={(e) => setForm({ ...form, edad: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span>Telefono</span>
          <input
            required
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
      </div>
      <div className="space-y-2">
        <span className="text-sm text-slate-700">Imagen</span>
        <div className="flex items-center gap-3">
          {form.imagen ? (
            <Image
              src={form.imagen}
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
            {form.imagen ? (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, imagen: null }))}
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
          onClick={() => {
            setOpen(false);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {editingId ? "Guardar cambios" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
};

export default CreateAndUpdateUser;
