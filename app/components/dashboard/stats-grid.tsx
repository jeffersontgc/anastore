import { StatCard } from "../shared/StatCard";

type StatItem = {
  title: string;
  value: string | number;
  hint?: string;
  tone?: "primary" | "warning" | "success" | "amber" | "muted";
  icon?: React.ReactNode;
};

type Props = {
  items: StatItem[];
};

export function StatsGrid({ items }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          hint={item.hint}
          tone={item.tone}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
