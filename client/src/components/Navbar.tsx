import { Menu, LogOut, Shield, Sparkles } from 'lucide-react';
import { formatPageTitle } from '../lib/ui';

interface NavbarProps {
  readonly currentPage: string;
  readonly onLogout: () => void;
  readonly onOpenMenu: () => void;
  readonly user?: { username: string; role: string } | null;
}

export default function Navbar({ currentPage, onLogout, onOpenMenu, user }: NavbarProps) {
  return (
    <header className="page-grid pb-0">
      <div className="glass-panel-strong section-shell relative overflow-hidden">
        <div className="ambient-orb -left-12 top-0 h-32 w-32 bg-sky-400/5 opacity-50" />
        <div className="ambient-orb bottom-0 right-0 h-28 w-28 bg-rose-400/5 opacity-50" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={onOpenMenu}
              className="button-secondary lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="rounded-[22px] bg-gradient-to-br from-rose-400/20 to-sky-300/10 p-3 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="eyebrow">AGNICORE command center</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {formatPageTitle(currentPage)}
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Zero-trust access control across identity, context, risk, and policy.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="glass-inset rounded-[22px] px-4 py-3">
              <div className="flex items-center gap-2 text-emerald-100">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Posture stable</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Threat surface monitored in real time</p>
            </div>
            <div className="glass-inset rounded-[22px] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{user?.role === 'admin' ? 'Administrator' : 'Analyst'}</p>
              <p className="mt-1 text-sm font-medium text-white">{user?.username || 'Unknown'}</p>
            </div>
            <button onClick={onLogout} className="button-secondary">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
