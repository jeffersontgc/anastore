import React from "react";
import { Badge } from "@/app/components/shared/Badge";
import { productTypeLabels } from "@/app/data/mock";
import { Product } from "@/app/types/backend";

const currency = new Intl.NumberFormat("es-NI", {
  style: "currency",
  currency: "NIO",
  maximumFractionDigits: 0,
});

type Props = {
  productos: Product[];
  startEdit: (uuid: string) => void;
  deleteProducto: (uuid: string) => void;
};

const ProductosTable: React.FC<Props> = ({
  productos,
  startEdit,
  deleteProducto,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-600">
            Inventario
          </h2>
          <p className="text-xs text-slate-500">
            {productos.length} productos listados
          </p>
        </div>
      </div>

      <div className="block sm:hidden">
        <div className="divide-y divide-slate-100">
          {productos.map((producto) => (
            <div key={producto.uuid} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {producto.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {productTypeLabels[producto.type]}
                  </p>
                </div>
                <Badge label={`${producto.stock} und`} tone="blue" />
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {currency.format(producto.price)}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(producto.uuid)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => deleteProducto(producto.uuid)}
                  className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map((producto) => (
              <tr key={producto.uuid} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {producto.name}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {currency.format(producto.price)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {producto.stock} und
                </td>
                <td className="px-4 py-3">
                  <Badge label={productTypeLabels[producto.type]} tone="blue" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(producto.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProducto(producto.uuid)}
                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
                  >
                    Eliminar
                  </button>
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductosTable;
