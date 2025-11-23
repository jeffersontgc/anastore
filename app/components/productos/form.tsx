import React from "react";
import { ProductType } from "@/app/types/backend";

type FormState = {
  name: string;
  price: string;
  stock: string;
  type: ProductType;
};

type Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  editingUuid: string | null;
};

const ProductosForm: React.FC<Props> = ({
  form,
  setForm,
  onSubmit,
  onClose,
  editingUuid,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span>Nombre del producto</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span>Precio</span>
          <input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span>Stock disponible</span>
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          />
        </label>
        <label className="space-y-1 text-sm text-slate-700">
          <span>Tipo</span>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as ProductType })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
          >
            <option value="GRANOS_BASICOS">Granos básicos</option>
            <option value="SNACKS">Snacks</option>
            <option value="BEBIDAS">Bebidas</option>
            <option value="LACTEOS">Lácteos</option>
          </select>
        </label>
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
          {editingUuid ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
};

export default ProductosForm;
