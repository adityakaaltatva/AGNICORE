import { LayoutDashboard, TestTube, FileText } from 'lucide-react';
import { formatPageTitle } from '../lib/ui';

interface SidebarProps {
  readonly currentPage: string;
  readonly onNavigate: (page: string) => void;
  readonly onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, sub: 'Posture Overview' },
  { id: 'simulation', label: 'Simulation', icon: TestTube, sub: 'Trust Testing' },
  { id: 'logs', label: 'Audit Trail', icon: FileText, sub: 'Forensic Review' },
];

export default function Sidebar({ currentPage, onNavigate, onClose }: SidebarProps) {
  return (
    <aside className="glass-panel-strong flex h-full w-full max-w-[280px] flex-col rounded-[32px] p-6 shadow-2xl">
      <div className="mb-10 p-2">
        <p className="eyebrow text-sky-400">Terminal</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tighter text-white">
          AGNICORE
        </h2>
      </div>

      <nav className="space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose?.();
              }}
              className={`group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-300 ${
                isActive
                  ? 'bg-white/[0.06] text-white shadow-xl border border-white/10'
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
              }`}
            >
              <div
                className={`rounded-xl p-2.5 transition-all duration-300 ${
                  isActive ? 'bg-sky-500/20 text-sky-400' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide">{item.label}</p>
                <p className="text-[0.65rem] font-medium uppercase tracking-widest opacity-50 mt-0.5">{item.sub}</p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto glass-inset p-5 border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-emerald-400/90">System Secure</p>
        </div>
        <p className="mt-2 text-[0.65rem] font-medium leading-relaxed text-slate-400">
          All nodes reporting nominal trust telemetry.
        </p>
      </div>
    </aside>
  );
}
