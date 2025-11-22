import React from "react";
import { Badge } from "@/app/components/shared/Badge";
import { DeudaStatus } from "@/app/data/mock";

type Row = {
  id: number;
  fiadorNombre: string;
  fechaPagar: string;
  status: DeudaStatus;
  monto: number;
  productosCount: number;
  productos: { nombre: string; precio: number; cantidad: number }[];
};

type Props = {
  rows: Row[];
  fecha: Intl.DateTimeFormat;
  currency: Intl.NumberFormat;
  statusTone: { [key: string]: "gray" | "green" | "red" | "amber" | "blue" };
  setDetalleId: (id: number) => void;
  deleteDeuda: (id: number) => void;
  onStatusChange: (id: number, status: DeudaStatus) => void;
};

const DeudasTable: React.FC<Props> = ({
  rows,
  fecha,
  currency,
  statusTone,
  setDetalleId,
  deleteDeuda,
  onStatusChange,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-600">
            Deudas
          </h2>
          <p className="text-xs text-slate-500">
            {rows.length} registros encontrados
          </p>
        </div>
      </div>
      <div className="block sm:hidden">
        <div className="divide-y divide-slate-100">
          {rows.map((deuda) => (
            <div key={deuda.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {deuda.fiadorNombre}
                  </p>
                  <p className="text-xs text-slate-500">
                    {fecha.format(new Date(deuda.fechaPagar))}
                  </p>
                </div>
                <Badge
                  label={deuda.status.toUpperCase()}
                  tone={statusTone[deuda.status] || "gray"}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Productos</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {deuda.productosCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {currency.format(deuda.monto)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <select
                  value={deuda.status}
                  onChange={(e) =>
                    onStatusChange(deuda.id, e.target.value as DeudaStatus)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none ring-blue-100 focus:ring"
                >
                  <option value="activa">Activa</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="pagada">Pagada</option>
                </select>
                <button
                  type="button"
                  onClick={() => setDetalleId(Number(deuda.id))}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Ver detalle
                </button>
                <button
                  type="button"
                  onClick={() => deleteDeuda(Number(deuda.id))}
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
              <th className="px-4 py-3 font-semibold">Fiador</th>
              <th className="px-4 py-3 font-semibold">Productos</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Fecha a pagar</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((deuda) => (
              <tr key={deuda.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {deuda.fiadorNombre}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {deuda.productosCount}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    label={deuda.status.toUpperCase()}
                    tone={statusTone[deuda.status] || "gray"}
                  />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {fecha.format(new Date(deuda.fechaPagar))}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {currency.format(deuda.monto)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <select
                      value={deuda.status}
                      onChange={(e) =>
                        onStatusChange(deuda.id, e.target.value as DeudaStatus)
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none ring-blue-100 focus:ring"
                    >
                      <option value="activa">Activa</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="pagada">Pagada</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setDetalleId(Number(deuda.id))}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Ver detalle
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDeuda(Number(deuda.id))}
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

export default DeudasTable;
