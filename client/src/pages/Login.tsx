import { useState } from 'react';
import { LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

interface LoginProps {
  readonly onLogin: () => void;
}

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
      const ADMIN_UUID = '00000000-0000-0000-0000-000000000000';
      const response = await api.post<{ token: string }>('/access/token', {
        user_id: ADMIN_UUID,
        role: 'admin',
        admin_secret: password,
      });

      localStorage.setItem('agnicore_token', response.token);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Authentication sequence failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[#040913]" />
      <div className="ambient-orb -top-20 -left-20 h-[500px] w-[500px] bg-sky-500/10 opacity-50" />
      <div className="ambient-orb -bottom-40 -right-20 h-[600px] w-[600px] bg-rose-500/10 opacity-30" />
      
      <div className="relative z-10 w-full max-w-xl">
        {/* Branding Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-inset mb-6">
            <ShieldCheck className="h-4 w-4 text-sky-400" />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-sky-400/80">
              Zero-Trust Protocol Active
            </span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter text-white mb-4">
            AGNICORE
          </h1>
          <p className="text-slate-400 font-medium tracking-tight text-lg">
            High-fidelity trust orchestration & security command.
          </p>
        </div>

        {/* Modern Login Panel */}
        <section className="glass-panel-strong p-10 shadow-[0_0_80px_rgba(0,0,0,0.4)]">
          <div className="mb-10 flex items-center gap-4">
            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <LockKeyhole className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Access Gateway</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Enter credentials to establish trust.</p>
            </div>
          </div>

          {error && (
            <div className="mb-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-5 text-sm text-rose-300 font-medium animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Operator Identity
              </label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="field-shell w-full !bg-black/20"
                placeholder="Username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Security Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-shell w-full !bg-black/20"
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="button-primary w-full disabled:opacity-50 h-16 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Verifying Identity...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Initialize Session</span>
                    <Sparkles className="h-5 w-5 opacity-50" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex justify-between items-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">Contextual Audit</span>
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">Threat Monitoring</span>
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400">Policy Guard</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
