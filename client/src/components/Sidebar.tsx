import { LayoutDashboard, TestTube, FileText } from 'lucide-react';
import { formatPageTitle } from '../lib/ui';

interface SidebarProps {
  readonly currentPage: string;
  readonly onNavigate: (page: string) => void;
  readonly onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'simulation', label: 'Simulation Lab', icon: TestTube },
  { id: 'logs', label: 'Investigation Logs', icon: FileText },
];

export default function Sidebar({ currentPage, onNavigate, onClose }: SidebarProps) {
  return (
    <aside className="glass-panel-strong flex h-full w-full max-w-[280px] flex-col rounded-[30px] p-4">
      <div className="mb-6 rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
        <p className="eyebrow">Active workspace</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {formatPageTitle(currentPage)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Navigate between posture monitoring, request simulation, and forensic review.
        </p>
      </div>

      <nav className="space-y-2">
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
              className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-left transition ${
                isActive
                  ? 'bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              }`}
            >
              <div
                className={`rounded-2xl p-2 ${
                  isActive ? 'bg-rose-400/20 text-rose-100' : 'bg-white/5 text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-slate-500">
                  {item.id === 'dashboard'
                    ? 'Live trust posture'
                    : item.id === 'simulation'
                      ? 'Explainable evaluations'
                      : 'Decision audit trail'}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[24px] border border-emerald-300/10 bg-emerald-400/8 p-4">
        <div className="flex items-center gap-3">
          <span className="signal-dot bg-emerald-300 shadow-[0_0_16px_rgba(83,214,141,0.75)]" />
          <p className="text-sm font-medium text-emerald-100">Trust mesh operational</p>
        </div>
        <p className="mt-2 text-xs leading-6 text-emerald-100/80">
          Policy services, telemetry collection, and scoring pipeline are healthy.
        </p>
      </div>
    </aside>
  );
}
