import { DebtStatus } from "@/app/types/backend";
import { Badge } from "../shared/Badge";

type DeudaItem = {
  id: number | string;
  fiadorNombre: string;
  fechaPagar: string;
  status: DebtStatus;
  monto: number;
};

type Props = {
  items: DeudaItem[];
  currency: Intl.NumberFormat;
  fecha: Intl.DateTimeFormat;
};

export function DeudasProximas({ items, currency, fecha }: Props) {
  const toneByStatus: Record<DebtStatus, "gray" | "green" | "amber" | "blue"> =
    {
      ACTIVE: "blue",
      PENDING: "amber",
      PAID: "green",
      SETTLED: "green",
    };
  const labelByStatus: Record<DebtStatus, string> = {
    ACTIVE: "Activa",
    PENDING: "Pendiente",
    PAID: "Pagada",
    SETTLED: "Saldada",
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Deudas proximas
          </h2>
          <p className="text-sm text-slate-500">Fechas de pago mas cercanas</p>
        </div>
      </div>
      <div className="mt-4 divide-y divide-slate-100">
        {items.map((deuda) => (
          <div
            key={deuda.id}
            className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">
                {deuda.fiadorNombre}
              </p>
              <p className="text-xs text-slate-500">
                {fecha.format(new Date(deuda.fechaPagar))}
              </p>
            </div>
            <Badge
              label={labelByStatus[deuda.status] ?? deuda.status}
              tone={toneByStatus[deuda.status] ?? "gray"}
            />
            <p className="text-right font-semibold text-slate-900">
              {currency.format(deuda.monto)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
