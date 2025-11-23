import React from "react";
import Image from "next/image";
import { Badge } from "@/app/components/shared/Badge";
import { User } from "@/app/types/users";

interface Props {
  usuarios: User[];
  deudasActivasPorUsuario: Record<string, number>;
}

const UsersTable: React.FC<Props> = ({
  usuarios,
  deudasActivasPorUsuario,
}) => {
  return (
    <React.Fragment>
      <div className="block sm:hidden">
        <div className="divide-y divide-slate-100">
          {usuarios.map((usuario) => (
            <div key={usuario.uuid} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {usuario.picture ? (
                    <Image
                      src={usuario.picture}
                      alt={`${usuario.firstname} ${usuario.lastname}`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {usuario.firstname.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {usuario.firstname} {usuario.lastname}
                    </p>
                    <p className="text-xs text-slate-500">{usuario.email}</p>
                  </div>
                </div>
                <Badge
                  label={`${deudasActivasPorUsuario[usuario.uuid] || 0} activas`}
                  tone={
                    (deudasActivasPorUsuario[usuario.uuid] || 0) > 0
                      ? "amber"
                      : "green"
                  }
                />
              </div>
              <div className="mt-2">
                <Badge
                  label={usuario.isDelinquent ? "Moroso" : "Al día"}
                  tone={usuario.isDelinquent ? "red" : "green"}
                />
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
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Deudas activas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios.map((usuario) => (
              <tr key={usuario.uuid} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    {usuario.picture ? (
                      <Image
                        src={usuario.picture}
                        alt={`${usuario.firstname} ${usuario.lastname}`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                        {usuario.firstname.charAt(0)}
                      </div>
                    )}
                    <span>
                      {usuario.firstname} {usuario.lastname}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{usuario.email}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={usuario.isDelinquent ? "Moroso" : "Al día"}
                    tone={usuario.isDelinquent ? "red" : "green"}
                  />
                </td>
                <td className="px-4 py-3">
                  <Badge
                    label={`${deudasActivasPorUsuario[usuario.uuid] || 0} activas`}
                    tone={
                      (deudasActivasPorUsuario[usuario.uuid] || 0) > 0
                        ? "amber"
                        : "green"
                    }
                  />
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
