import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly icon: LucideIcon;
  readonly color: string;
}

export default function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );
}
