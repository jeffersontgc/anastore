type Props = {
  label: string;
  tone?: "gray" | "green" | "red" | "amber" | "blue";
};

const styles: Record<
  NonNullable<Props["tone"]>,
  { bg: string; text: string }
> = {
  gray: { bg: "bg-slate-100", text: "text-slate-700" },
  green: { bg: "bg-emerald-50", text: "text-emerald-700" },
  red: { bg: "bg-rose-50", text: "text-rose-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
};

export function Badge({ label, tone = "gray" }: Props) {
  const style = styles[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
