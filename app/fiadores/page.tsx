"use client";

import { useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { Badge } from "../components/shared/Badge";
import { Modal } from "../components/shared/Modal";
import useDebounce from "../hooks/useDebounce";
import { useDataStore } from "../store/data-store";
import DeudasFiltro from "@/app/components/fiadores/filters";
import DeudasTable from "@/app/components/fiadores/table";
import CreateDeudaForm from "@/app/components/fiadores/create";
import { DeudaStatus, Producto } from "../data/mock";

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

const statusTone: Record<string, "blue" | "amber" | "green" | "gray" | "red"> = {
  activa: "green",
  pendiente: "amber",
  pagada: "green",
  saldada: "gray",
  vencida: "red",
};

type SelectedProducto = Producto & { cantidad: number };
type FiadorOption = { value: number; label: string; image?: string | null };

export default function FiadoresPage() {
  const [status, setStatus] = useState<string>("todos");
  const [nombre, setNombre] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [selectedFiadorId, setSelectedFiadorId] = useState<number | null>(null);
  const [fechaPagar, setFechaPagar] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducto[]>(
    []
  );
  const debouncedNombre = useDebounce(nombre, 5000);

  const deudas = useDataStore((state) => state.deudas);
  const fiadores = useDataStore((state) => state.fiadores);
  const usuarios = useDataStore((state) => state.usuarios);
  const productos = useDataStore((state) => state.productos);
  const deleteDeuda = useDataStore((state) => state.deleteDeuda);
  const addDeuda = useDataStore((state) => state.addDeuda);
  const updateDeuda = useDataStore((state) => state.updateDeuda);
  const hydrated = useDataStore((state) => state.hydrated);

  const fiadorOptions: FiadorOption[] = useMemo(
    () =>
      usuarios.map((u) => ({
        value: u.id,
        label: `${u.nombre} ${u.apellido || ""}`.trim(),
        image: u.imagen,
      })),
    [usuarios]
  );

  const deudasFiltradas = useMemo(() => {
    const enriched = deudas
      .map((deuda) => ({
        ...deuda,
        fiador: fiadores.find((f) => f.id === deuda.fiadorId),
        productosCount: deuda.productos.reduce((sum, p) => sum + p.cantidad, 0),
      }))
      .filter((d) => d.fiador);

    return enriched.filter((deuda) => {
      if (status !== "todos" && deuda.status !== status) return false;
      if (
        debouncedNombre &&
        !deuda.fiador?.nombre
          .toLowerCase()
          .includes(debouncedNombre.toLowerCase())
      )
        return false;
      if (fechaFiltro && deuda.fechaPagar !== fechaFiltro) return false;
      return true;
    });
  }, [deudas, fiadores, status, debouncedNombre, fechaFiltro]);

  const detalle = deudasFiltradas.find(
    (d) => detalleId !== null && d.id === Number(detalleId)
  );

  const totalNuevo = selectedProducts.reduce(
    (sum, prod) => sum + prod.price * prod.cantidad,
    0
  );

  const toggleProducto = (producto: Producto) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === producto.id);
      if (exists) {
        return prev.filter((p) => p.id !== producto.id);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const updateQuantity = (id: number, cantidad: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, cantidad: Math.min(Math.max(1, cantidad), p.stock) }
          : p
      )
    );
  };

  const handleCreateDebt = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFiadorId === null || !fechaPagar || !selectedProducts.length)
      return;
    const nextId = deudas.reduce((max, d) => Math.max(max, d.id), 0) + 1;
    addDeuda({
      id: nextId,
      fiadorId: selectedFiadorId,
      fechaPagar,
      status: "activa",
      monto: totalNuevo,
      productos: selectedProducts.map((p) => ({
        nombre: p.name,
        precio: p.price,
        cantidad: p.cantidad,
      })),
    });
    setCreateOpen(false);
    setSelectedProducts([]);
    setSelectedFiadorId(null);
    setFechaPagar("");
  };

  if (!hydrated) {
    return (
      <AppShell
        title="Fiadores"
        description="Listado de fiadores con sus deudas activas o pendientes"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Cargando datos locales...
        </div>
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
          fiadorNombre: d.fiador?.nombre || "Desconocido",
          fechaPagar: d.fechaPagar,
          status: d.status,
          monto: d.monto,
          productosCount: d.productosCount,
          productos: d.productos,
        }))}
        currency={currency}
        fecha={fecha}
        statusTone={statusTone}
        deleteDeuda={deleteDeuda}
        setDetalleId={setDetalleId}
        onStatusChange={(id, status) =>
          updateDeuda(id, { status: status as DeudaStatus })
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
                (p) => p.id === producto.id
              );
              return (
                <div
                  key={producto.id}
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
                  {detalle.fiador?.nombre}
                </p>
              </div>
              <Badge
                label={detalle.status.toUpperCase()}
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
                {detalle.productos.map((prod, idx) => (
                  <div
                    key={`${prod.nombre}-${idx}`}
                    className="grid grid-cols-4 px-4 py-2 text-sm text-slate-700"
                  >
                    <span className="col-span-2">{prod.nombre}</span>
                    <span>{prod.cantidad}</span>
                    <span className="text-right font-semibold">
                      {currency.format(prod.precio * prod.cantidad)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                <span>Total general</span>
                <span>{currency.format(detalle.monto)}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Fecha limite: {fecha.format(new Date(detalle.fechaPagar))}
            </p>
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
