"use client";

import { useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Badge } from "../components/shared/Badge";
import { Modal } from "../components/shared/Modal";
import DeudasFiltro from "@/app/components/fiadores/filters";
import DeudasTable from "@/app/components/fiadores/table";
import CreateDeudaForm from "@/app/components/fiadores/create";
import useDebounce from "../hooks/useDebounce";
import { useDataStore } from "../store/data-store";
import { DebtStatus, Product, User } from "../types/backend";

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

const statusTone: Record<string, "blue" | "amber" | "green" | "gray" | "red"> =
  {
    ACTIVE: "blue",
    PENDING: "amber",
    PAID: "green",
    SETTLED: "green",
  };

const statusLabel: Record<DebtStatus, string> = {
  ACTIVE: "Activa",
  PENDING: "Pendiente",
  PAID: "Pagada",
  SETTLED: "Saldada",
};

type SelectedProducto = Product & { cantidad: number };
type FiadorOption = { value: string; label: string; image?: string | null };

export default function FiadoresPage() {
  const [status, setStatus] = useState<string>("todos");
  const [nombre, setNombre] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [selectedFiadorId, setSelectedFiadorId] = useState<string | null>(null);
  const [fechaPagar, setFechaPagar] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducto[]>(
    []
  );
  const debouncedNombre = useDebounce(nombre, 500);

  const deudas = useDataStore((state) => state.debts);
  const users = useDataStore((state) => state.users);
  const productos = useDataStore((state) => state.products);
  const createDebt = useDataStore((state) => state.createDebt);
  const updateDebtStatus = useDataStore((state) => state.updateDebtStatus);
  const hydrated = useDataStore((state) => state.hydrated);
  const loading = useDataStore((state) => state.loading);
  const error = useDataStore((state) => state.error);

  const fiadorOptions: FiadorOption[] = useMemo(
    () =>
      users.map((u: User) => ({
        value: u.uuid,
        label: `${u.firstname} ${u.lastname}`.trim(),
        image: u.picture ?? undefined,
      })),
    [users]
  );

  const deudasFiltradas = useMemo(() => {
    const enriched = deudas.map((deuda) => ({
      ...deuda,
      fiador: deuda.user,
      productosCount: deuda.products.reduce(
        (sum, p) => sum + p.quantity,
        0
      ),
    }));

    return enriched.filter((deuda) => {
      if (status !== "todos" && deuda.status !== status) return false;
      if (
        debouncedNombre &&
        !`${deuda.fiador.firstname} ${deuda.fiador.lastname}`
          .toLowerCase()
          .includes(debouncedNombre.toLowerCase())
      )
        return false;
      if (fechaFiltro && deuda.date_pay.slice(0, 10) !== fechaFiltro)
        return false;
      return true;
    });
  }, [deudas, status, debouncedNombre, fechaFiltro]);

  const detalle = deudasFiltradas.find(
    (d) => detalleId !== null && d.id === Number(detalleId)
  );

  const totalNuevo = selectedProducts.reduce(
    (sum, prod) => sum + prod.price * prod.cantidad,
    0
  );

  const toggleProducto = (producto: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.uuid === producto.uuid);
      if (exists) {
        return prev.filter((p) => p.uuid !== producto.uuid);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const updateQuantity = (uuid: string, cantidad: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.uuid === uuid
          ? { ...p, cantidad: Math.min(Math.max(1, cantidad), p.stock) }
          : p
      )
    );
  };

  const handleCreateDebt = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (selectedFiadorId === null || !fechaPagar || !selectedProducts.length)
      return;
    await createDebt({
      user_uuid: selectedFiadorId,
      dueDate: fechaPagar,
      products: selectedProducts.map((p) => ({
        product_uuid: p.uuid,
        quantity: p.cantidad,
      })),
    });
    setCreateOpen(false);
    setSelectedProducts([]);
    setSelectedFiadorId(null);
    setFechaPagar("");
  };

  if (!hydrated || loading) {
    return (
      <AppShell
        title="Fiadores"
        description="Listado de fiadores con sus deudas activas o pendientes"
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

  return (
    <AppShell
      title="Fiadores"
      description="Listado de fiadores con sus deudas activas o pendientes"
    >
      <DeudasFiltro
        fechaFiltro={fechaFiltro}
        setFechaFiltro={setFechaFiltro}
        nombre={nombre}
        setNombre={setNombre}
        setStatus={setStatus}
        status={status}
        setCreateOpen={setCreateOpen}
      />

      <DeudasTable
        rows={deudasFiltradas.map((d) => ({
          id: d.id,
          uuid: d.uuid,
          fiadorNombre: `${d.fiador.firstname} ${d.fiador.lastname}`,
          fechaPagar: d.date_pay,
          status: d.status as DebtStatus,
          monto: Number(d.amount),
          productosCount: d.products.reduce(
            (sum, p) => sum + p.quantity,
            0
          ),
          productos: d.products.map((prod) => ({
            nombre: prod.product.name,
            precio: prod.price,
            cantidad: prod.quantity,
          })),
        }))}
        currency={currency}
        fecha={fecha}
        statusTone={statusTone}
        setDetalleId={setDetalleId}
        onStatusChange={(uuid, status) =>
          updateDebtStatus(uuid, status as DebtStatus)
        }
      />

      <Modal
        open={createOpen}
        title="Nueva deuda"
        onClose={() => {
          setCreateOpen(false);
          setSelectedProducts([]);
        }}
      >
        <CreateDeudaForm
          currency={currency}
          fiadorOptions={fiadorOptions}
          fechaPagar={fechaPagar}
          selectedFiadorId={selectedFiadorId}
          selectedProducts={selectedProducts}
          totalNuevo={totalNuevo}
          setFechaPagar={setFechaPagar}
          setProductPickerOpen={setProductPickerOpen}
          setCreateOpen={setCreateOpen}
          setSelectedFiadorId={setSelectedFiadorId}
          setSelectedProducts={setSelectedProducts}
          updateQuantity={updateQuantity}
          handleCreateDebt={handleCreateDebt}
        />
      </Modal>

      <Modal
        open={productPickerOpen}
        title="Seleccionar productos"
        onClose={() => setProductPickerOpen(false)}
      >
        <div>
          <div className="grid gap-2">
            {productos.map((producto) => {
              const selected = selectedProducts.some(
                (p) => p.uuid === producto.uuid
              );
              return (
                <div
                  key={producto.uuid}
                  className="group relative flex items-center justify-between overflow-hidden rounded-lg border border-slate-200 px-3 py-2 transition duration-300 hover:border-slate-300"
                >
                  <div className="absolute inset-0 lava-anim opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="relative">
                    <p className="text-sm font-semibold text-slate-900">
                      {producto.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Stock: {producto.stock} · Precio:{" "}
                      {currency.format(producto.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={producto.stock === 0}
                    onClick={() => toggleProducto(producto)}
                    className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "border border-slate-200 text-slate-700 hover:bg-slate-100"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    } disabled:cursor-not-allowed disabled:bg-slate-300`}
                  >
                    {selected ? "Quitar" : "Agregar"}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              onClick={() => setProductPickerOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(detalle)}
        title="Detalle de deuda"
        onClose={() => setDetalleId(null)}
      >
        {detalle ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Fiador</p>
                <p className="text-lg font-semibold text-slate-900">
                  {detalle.fiador.firstname} {detalle.fiador.lastname}
                </p>
              </div>
              <Badge
                label={statusLabel[detalle.status as DebtStatus] ?? detalle.status}
                tone={statusTone[detalle.status] || "gray"}
              />
            </div>
            <div className="rounded-lg border border-slate-200">
              <div className="grid grid-cols-4 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-600">
                <span className="col-span-2">Producto</span>
                <span>Cantidad</span>
                <span className="text-right">Total</span>
              </div>
              <div className="divide-y divide-slate-100">
                {detalle.products.map((prod) => (
                  <div
                    key={`${prod.uuid}`}
                    className="grid grid-cols-4 px-4 py-2 text-sm text-slate-700"
                  >
                    <span className="col-span-2">{prod.product.name}</span>
                    <span>{prod.quantity}</span>
                    <span className="text-right font-semibold">
                      {currency.format(prod.price * prod.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                <span>Total general</span>
                <span>{currency.format(Number(detalle.amount))}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Fecha límite: {fecha.format(new Date(detalle.date_pay))}
            </p>
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
