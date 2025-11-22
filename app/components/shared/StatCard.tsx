type Props = {
  title: string;
  value: string | number;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "amber" | "muted";
  icon?: React.ReactNode;
};

const toneClasses: Record<
  NonNullable<Props["tone"]>,
  { badge: string; dot: string }
> = {
  primary: { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  success: { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  warning: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  amber: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  muted: { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

export function StatCard({ title, value, hint, tone = "primary", icon }: Props) {
  const styles = toneClasses[tone];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
        >
          {icon ? (
            <span className="text-base text-current">{icon}</span>
          ) : (
            <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
          )}
          Activo
        </span>
      </div>
    </div>
  );
}
