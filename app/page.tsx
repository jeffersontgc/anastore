"use client";

import { AppShell } from "./components/AppShell";
import { DeudasProximas } from "./components/dashboard/deudas-proximas";
import { ProductosStock } from "./components/dashboard/productos-stock";
import { StatsGrid } from "./components/dashboard/stats-grid";
import { productTypeLabels } from "./data/mock";
import { DebtStatus } from "./types/backend";
import { useDataStore } from "./store/data-store";
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiAlertTriangle,
} from "react-icons/fi";

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
  const users = useDataStore((state) => state.users);
  const deudas = useDataStore((state) => state.debts);
  const productos = useDataStore((state) => state.products);
  const hydrated = useDataStore((state) => state.hydrated);
  const loading = useDataStore((state) => state.loading);
  const error = useDataStore((state) => state.error);

  if (!hydrated || loading) {
    return (
      <AppShell
        title="Dashboard"
        description="Resumen general del sistema de fiados"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Sincronizando datos con el backend...
        </div>
        {error ? (
          <p className="mt-3 text-sm text-rose-600">Error: {error}</p>
        ) : null}
      </AppShell>
    );
  }

  const enrichedDeudas = [...deudas]
    .map((deuda) => ({
      ...deuda,
      fiadorNombre: `${deuda.user.firstname} ${deuda.user.lastname}`,
    }))
    .sort(
      (a, b) =>
        new Date(a.date_pay).getTime() - new Date(b.date_pay).getTime()
    );

  const totalPendientes = deudas.filter(
    (d) => d.status === "PENDING"
  ).length;
  const totalPagadas = deudas.filter(
    (d) => d.status === "PAID" || d.status === "SETTLED"
  ).length;
  const totalActivas = deudas.filter((d) => d.status === "ACTIVE").length;
  const totalAdeudado = deudas.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  const statItems = [
    {
      title: "Total de fiadores",
      value: users.length,
      hint: "Clientes creados en el sistema",
      tone: "primary" as const,
      icon: <FiUsers />,
    },
    {
      title: "Deudas pendientes",
      value: totalPendientes,
      hint: "Pendientes de revisar",
      tone: "warning" as const,
      icon: <FiClock />,
    },
    {
      title: "Deudas pagadas",
      value: totalPagadas,
      hint: "Pagadas y cerradas",
      tone: "success" as const,
      icon: <FiCheckCircle />,
    },
    {
      title: "Deudas activas",
      value: totalActivas,
      hint: "Fiados que siguen abiertos",
      tone: "primary" as const,
      icon: <FiTrendingUp />,
    },
    {
      title: "Total adeudado",
      value: currency.format(totalAdeudado),
      hint: "Monto total por cobrar",
      tone: "amber" as const,
      icon: <FiAlertTriangle />,
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
        <DeudasProximas
          items={enrichedDeudas.slice(0, 5).map((d) => ({
            id: d.id,
            fiadorNombre: d.fiadorNombre || "Desconocido",
            fechaPagar: d.date_pay,
            status: d.status as DebtStatus,
            monto: Number(d.amount),
          }))}
          currency={currency}
          fecha={fecha}
        />
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
