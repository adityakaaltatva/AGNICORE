import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly subtitle: string;
  readonly icon: LucideIcon;
  readonly tone: 'danger' | 'warning' | 'info' | 'success';
}

const toneClasses: Record<MetricCardProps['tone'], string> = {
  danger: 'from-rose-400/20 to-red-500/5 text-rose-100',
  warning: 'from-amber-300/20 to-orange-400/5 text-amber-100',
  info: 'from-sky-300/20 to-cyan-400/5 text-cyan-100',
  success: 'from-emerald-300/20 to-green-400/5 text-emerald-100',
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone,
}: MetricCardProps) {
  return (
    <div className="glass-panel-strong section-shell relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div className="ambient-orb -right-8 top-0 h-32 w-32 bg-white/5 opacity-50" />
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${toneClasses[tone]}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="eyebrow">{title}</p>
          <div className="space-y-1">
            <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
            <p className="text-sm text-slate-300">{subtitle}</p>
          </div>
        </div>
        <div
          className={`glass-inset flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[tone]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
