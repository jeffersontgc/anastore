"use client";

import { AppShell } from "./components/AppShell";
import { DeudasProximas } from "./components/dashboard/deudas-proximas";
import { ProductosStock } from "./components/dashboard/productos-stock";
import { StatsGrid } from "./components/dashboard/stats-grid";
import { productTypeLabels } from "./data/mock";
import { useDataStore } from "./store/data-store";

const currency = new Intl.NumberFormat("es-NI", {
  style: "currency",
  currency: "NIO",
  maximumFractionDigits: 0,
});

const fecha = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function Home() {
  const fiadores = useDataStore((state) => state.fiadores);
  const deudas = useDataStore((state) => state.deudas);
  const productos = useDataStore((state) => state.productos);
  const hydrated = useDataStore((state) => state.hydrated);
  if (!hydrated) {
    return (
      <AppShell
        title="Dashboard"
        description="Resumen general del sistema de fiados"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Cargando datos locales...
        </div>
      </AppShell>
    );
  }

  const enrichedDeudas = deudas
    .map((deuda) => ({
      ...deuda,
      fiador: fiadores.find((f) => f.id === deuda.fiadorId),
    }))
    .filter((deuda) => deuda.fiador);

  const totalPendientes = deudas.filter((d) => d.status === "pendiente").length;
  const totalPagadas = deudas.filter((d) => d.status === "pagada").length;
  const totalActivas = deudas.filter((d) => d.status === "activa").length;
  const totalAdeudado = deudas.reduce((sum, d) => sum + d.monto, 0);

  const statItems = [
    {
      title: "Total de fiadores",
      value: fiadores.length,
      hint: "Clientes con historial de fiado",
      tone: "primary" as const,
    },
    {
      title: "Deudas pendientes",
      value: totalPendientes,
      hint: "Pendientes de revisar",
      tone: "warning" as const,
    },
    {
      title: "Deudas pagadas",
      value: totalPagadas,
      hint: "Pagadas y cerradas",
      tone: "success" as const,
    },
    {
      title: "Deudas activas",
      value: totalActivas,
      hint: "Fiados que siguen abiertos",
      tone: "primary" as const,
    },
    {
      title: "Total adeudado",
      value: currency.format(totalAdeudado),
      hint: "Monto total por cobrar",
      tone: "amber" as const,
    },
  ];

  const lowStockProducts = [...productos]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 4);

  return (
    <AppShell
      title="Dashboard"
      description="Resumen general del sistema de fiados"
    >
      <StatsGrid items={statItems} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DeudasProximas items={enrichedDeudas.slice(0, 5).map((d) => ({
          id: d.id,
          fiadorNombre: d.fiador?.nombre || "Desconocido",
          fechaPagar: d.fechaPagar,
          status: d.status,
          monto: d.monto,
        }))} currency={currency} fecha={fecha} />
        <ProductosStock productos={productos} currency={currency} />

        <section className="rounded-xl border border-rose-100 bg-rose-50/70 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Productos por agotar
              </h2>
              <p className="text-sm text-slate-600">
                Los que tienen menor stock primero
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lowStockProducts.map((producto) => (
              <div
                key={producto.id}
                className="rounded-xl border border-rose-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {producto.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {productTypeLabels[producto.type]}
                    </p>
                  </div>
                  <span className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                    {producto.stock} und
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {currency.format(producto.price)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
