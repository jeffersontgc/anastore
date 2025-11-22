import React from "react";
import Image from "next/image";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";
import { Producto } from "@/app/data/mock";

interface Props {
  handleCreateDebt: (e: React.FormEvent<HTMLFormElement>) => void;
  fiadorOptions: { label: string; value: number; image?: string | null }[];
  selectedFiadorId: number | null;
  setSelectedFiadorId: (id: number | null) => void;
  fechaPagar: string;
  setFechaPagar: (date: string) => void;
  selectedProducts: SelectedProducto[];
  currency: Intl.NumberFormat;
  totalNuevo: number;
  setProductPickerOpen: (open: boolean) => void;
  setCreateOpen: (open: boolean) => void;
  setSelectedProducts: React.Dispatch<React.SetStateAction<SelectedProducto[]>>;
  updateQuantity: (id: number, quantity: number) => void;
}

type SelectedProducto = Producto & { cantidad: number };
type FiadorOption = { value: number; label: string; image?: string | null };
const CreateDeudaForm: React.FC<Props> = ({
  handleCreateDebt,
  fiadorOptions,
  selectedFiadorId,
  setSelectedFiadorId,
  fechaPagar,
  setFechaPagar,
  selectedProducts,
  currency,
  totalNuevo,
  setProductPickerOpen,
  setCreateOpen,
  setSelectedProducts,
  updateQuantity,
}) => {
  const Option = (props: OptionProps<FiadorOption>) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {props.data.image ? (
          <Image
            src={props.data.image}
            alt={props.data.label}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            {props.data.label.charAt(0)}
          </div>
        )}
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  const SingleValue = (props: SingleValueProps<FiadorOption>) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        {props.data.image ? (
          <Image
            src={props.data.image}
            alt={props.data.label}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
            {props.data.label.charAt(0)}
          </div>
        )}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  return (
    <div>
      {" "}
      <form className="space-y-4" onSubmit={handleCreateDebt}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Seleccionar fiador
          </label>
          <Select<FiadorOption, false>
            options={fiadorOptions}
            value={
              fiadorOptions.find((o) => o.value === selectedFiadorId) ?? null
            }
            onChange={(option) =>
              setSelectedFiadorId(
                (option as FiadorOption | null)?.value ?? null
              )
            }
            placeholder="Elige un usuario"
            className="text-sm"
            classNames={{
              control: () =>
                "rounded-lg border border-slate-200 px-1 py-1 shadow-none",
              menu: () => "text-sm",
            }}
            components={{ Option, SingleValue }}
            styles={{ control: (base) => ({ ...base, boxShadow: "none" }) }}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-700">
            <span>Fecha a pagar</span>
            <input
              required
              type="date"
              value={fechaPagar}
              onChange={(e) => setFechaPagar(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
            />
          </label>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Productos</p>
              <p className="text-xs text-slate-500">
                Selecciona los productos fiados
              </p>
            </div>
            <button
              type="button"
              onClick={() => setProductPickerOpen(true)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Seleccionar productos
            </button>
          </div>
          {selectedProducts.length ? (
            <div className="space-y-2">
              {selectedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 sm:flex sm:items-center sm:justify-between"
                >
                  <div className="absolute inset-0 lava-anim opacity-40" />
                  <div className="relative">
                    <p className="text-sm font-semibold text-slate-900">
                      {prod.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Stock disponible: {prod.stock}
                    </p>
                  </div>
                  <div className="relative flex items-center gap-2">
                    <label className="text-xs text-slate-600">Cantidad</label>
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1">
                      <button
                        type="button"
                        aria-label="Disminuir"
                        onClick={() =>
                          updateQuantity(
                            prod.id,
                            Math.max(1, prod.cantidad - 1)
                          )
                        }
                        className="h-7 w-7 rounded-md bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-900">
                        {prod.cantidad}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        onClick={() =>
                          updateQuantity(
                            prod.id,
                            Math.min(prod.stock, prod.cantidad + 1)
                          )
                        }
                        className="h-7 w-7 rounded-md bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {currency.format(prod.price * prod.cantidad)}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProducts((prev) =>
                          prev.filter((p) => p.id !== prod.id)
                        )
                      }
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                <span className="text-sm font-semibold text-slate-700">
                  Total
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {currency.format(totalNuevo)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Aun no has seleccionado productos.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setCreateOpen(false);
              setSelectedProducts([]);
            }}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              selectedFiadorId === null ||
              !fechaPagar ||
              selectedProducts.length === 0
            }
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Guardar deuda
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDeudaForm;
