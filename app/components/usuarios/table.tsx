import React from "react";
import Image from "next/image";
import { Badge } from "@/app/components/shared/Badge";
import { User } from "@/app/types/users";

interface Props {
  usuarios: User[];
  deudasActivasPorUsuario: Record<number, number>;
  startEdit: (id: number) => void;
  deleteUsuario: (id: number) => void;
}
const UsersTable: React.FC<Props> = ({
  usuarios,
  deudasActivasPorUsuario,
  startEdit,
  ...props
}) => {
  const { deleteUsuario } = props;

  return (
    <React.Fragment>
      <div className="block sm:hidden">
        <div className="divide-y divide-slate-100">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {usuario.imagen ? (
                    <Image
                      src={usuario.imagen}
                      alt={usuario.nombre}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {usuario.nombre.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                    <p className="text-xs text-slate-500">
                      {usuario.telefono} · {usuario.edad} años
                    </p>
                  </div>
                </div>
                <Badge
                  label={`${deudasActivasPorUsuario[usuario.id] || 0} activas`}
                  tone={
                    (deudasActivasPorUsuario[usuario.id] || 0) > 0
                      ? "amber"
                      : "green"
                  }
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(usuario.id)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => deleteUsuario(usuario.id)}
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
              <th className="px-4 py-3 font-semibold">Nombre completo</th>
              <th className="px-4 py-3 font-semibold">Edad</th>
              <th className="px-4 py-3 font-semibold">Telefono</th>
              <th className="px-4 py-3 font-semibold">Deudas activas</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    {usuario.imagen ? (
                      <Image
                        src={usuario.imagen}
                        alt={usuario.nombre}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                        {usuario.nombre.charAt(0)}
                      </div>
                    )}
                    <span>
                      {usuario.nombre} {usuario.apellido}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{usuario.edad}</td>
                <td className="px-4 py-3 text-slate-600">{usuario.telefono}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={`${
                      deudasActivasPorUsuario[usuario.id] || 0
                    } activas`}
                    tone={
                      (deudasActivasPorUsuario[usuario.id] || 0) > 0
                        ? "amber"
                        : "green"
                    }
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(usuario.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUsuario(usuario.id)}
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
    </React.Fragment>
  );
};

export default UsersTable;
