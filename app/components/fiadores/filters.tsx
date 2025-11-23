import { useAuthStore } from "@/app/store/auth-store";
import React from "react";

interface Props {
  status: string;
  setStatus: (status: string) => void;
  fechaFiltro: string;
  setFechaFiltro: (fecha: string) => void;
  nombre: string;
  setNombre: (nombre: string) => void;
  setCreateOpen: (open: boolean) => void;
}
const DeudasFiltro: React.FC<Props> = ({
  status,
  setStatus,
  fechaFiltro,
  ...props
}) => {
  const { setFechaFiltro, nombre, setNombre, setCreateOpen } = props;

  const user = useAuthStore((state) => state.currentUser);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3 sm:flex-1">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Estado de deuda
          </label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-100 focus:ring"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ACTIVE">Activa</option>
            <option value="PENDING">Pendiente</option>
            <option value="PAID">Pagada</option>
            <option value="SETTLED">Saldada</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Fecha a pagar
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-100 focus:ring"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Buscar fiador
          </label>
          <input
            type="text"
            placeholder="Nombre del fiador"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-100 focus:ring"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
      </div>
      {user?.isCeo && (
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto"
        >
          Nueva deuda
        </button>
      )}
    </div>
  );
};

export default DeudasFiltro;
