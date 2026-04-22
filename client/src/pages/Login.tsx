import { useState } from 'react';
import { LockKeyhole, Radar, ShieldCheck, Waypoints } from 'lucide-react';
import { api } from '../lib/api';

interface LoginProps {
  readonly onLogin: () => void;
}

const featureCards = [
  {
    icon: Waypoints,
    title: 'Context-aware trust',
    description: 'Combine device posture, location confidence, and activity pressure in one decision.',
  },
  {
    icon: Radar,
    title: 'Live telemetry intake',
    description: 'Track request drift and suspicious movement before policy execution.',
  },
  {
    icon: ShieldCheck,
    title: 'Explainable enforcement',
    description: 'Surface why the engine allowed, verified, or denied every access request.',
  },
];

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('agnicore_dev_admin_secret');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // For this demo/v1, we use the username as user_id (it will be converted to UUID if possible, but the backend expects a UUID)
      // I'll send a consistent UUID for 'admin'
      const ADMIN_UUID = '00000000-0000-0000-0000-000000000000';
      
      const response = await api.post<{ token: string }>('/access/token', {
        user_id: ADMIN_UUID,
        role: 'admin',
        admin_secret: password,
      });

      localStorage.setItem('agnicore_token', response.token);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative flex min-h-screen items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="ambient-orb -left-16 top-10 h-56 w-56 bg-sky-400/20" />
      <div className="ambient-orb right-0 top-24 h-72 w-72 bg-rose-500/20" />
      <div className="ambient-orb bottom-0 left-1/3 h-72 w-72 bg-emerald-400/10" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel-strong section-shell bg-mesh relative overflow-hidden">
          <div className="ambient-orb right-0 top-0 h-48 w-48 bg-white/10" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <p className="eyebrow">AGNICORE zero-trust platform</p>

              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Visualize how identity, context, risk, and policy combine into a premium command
                center experience built for trust orchestration.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="glass-inset rounded-[24px] p-4">
                    <div className="mb-4 w-fit rounded-2xl bg-white/8 p-3 text-slate-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-semibold text-white">{card.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="glass-inset rounded-[28px] p-5">
              <p className="eyebrow">Methodology</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {['Identity', 'Context', 'Risk', 'Policy'].map((step, index) => (
                  <div key={step} className="rounded-[22px] border border-white/8 bg-black/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      0{index + 1}
                    </p>
                    <p className="mt-3 text-sm font-medium text-white">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel section-shell mx-auto flex w-full max-w-xl flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-[24px] bg-gradient-to-br from-rose-400/20 to-orange-300/10 p-4 text-white">
              <LockKeyhole className="h-7 w-7" />
            </div>
            <div>
              <p className="eyebrow">Secure gateway</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Sign in to the command center
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-2 text-sm text-slate-300">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="field-shell w-full"
                placeholder="admin"
                required
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-300">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-shell w-full"
                placeholder="Enter your password"
                required
              />
            </label>

            <div className="glass-inset rounded-[24px] p-4">
              <div className="flex items-center gap-3">
                <span className="signal-dot bg-emerald-300 shadow-[0_0_18px_rgba(83,214,141,0.7)]" />
                <p className="text-sm font-medium text-emerald-100">
                  Risk services and policy engine online
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Session entry is protected by contextual evaluation and trust scoring.
              </p>
            </div>

            <button type="submit" className="button-primary w-full">
              Enter AGNICORE
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
