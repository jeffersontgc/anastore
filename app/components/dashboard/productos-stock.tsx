import { productTypeLabels, Producto } from "@/app/data/mock";

type Props = {
  productos: Producto[];
  currency: Intl.NumberFormat;
};

export function ProductosStock({ productos, currency }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Productos con stock
          </h2>
          <p className="text-sm text-slate-500">
            Inventario disponible por categoria
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-900">{producto.name}</p>
              <p className="text-xs text-slate-500">
                {productTypeLabels[producto.type]}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {currency.format(producto.price)}
              </p>
              <p className="text-xs text-slate-500">Stock: {producto.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
