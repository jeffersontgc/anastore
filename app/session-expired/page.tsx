export default function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Sesión expirada
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Tu sesión ha expirado. Inicia sesión nuevamente para continuar.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Ir al login
        </a>
      </div>
    </div>
  );
}
