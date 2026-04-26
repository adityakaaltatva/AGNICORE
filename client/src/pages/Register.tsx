import { useState } from 'react';
import { api } from '../lib/api';

interface RegisterProps {
  readonly onRegister: () => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        username,
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        onRegister();
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
    <div className="min-h-screen flex items-center justify-center text-[#dde4e5] px-4 py-6 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{
          backgroundColor: '#020617',
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(236, 106, 6, 0.15) 0%, transparent 50%)
          `
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <main className="w-full max-w-[520px] relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] tracking-widest uppercase mb-2">
              AGNICORE
            </h1>
          </div>

          <div className="relative rounded-[24px] p-6 sm:p-8 lg:p-10 w-full overflow-hidden text-center"
            style={{
              background: 'rgba(2, 12, 27, 0.6)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderTop: '1px solid rgba(34, 211, 238, 0.3)',
              borderLeft: '1px solid rgba(34, 211, 238, 0.2)',
              borderRight: '1px solid rgba(236, 106, 6, 0.2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-[#dde4e5] mb-3">Registration Successful</h2>
            <p className="text-[#bbc9cd] mb-2">
              Your account has been created and is pending admin approval.
            </p>
            <p className="text-sm text-[#859397]">
              Redirecting to login page...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-[#dde4e5] p-6 relative overflow-hidden"
      style={{
        backgroundColor: '#020617',
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 85% 30%, rgba(236, 106, 6, 0.15) 0%, transparent 50%)
        `
      }}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-1 h-1 top-[20%] left-[10%] opacity-50 rounded-full bg-[rgba(34,211,238,0.5)] shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute w-1.5 h-1.5 top-[60%] left-[80%] opacity-30 rounded-full bg-[#ec6a06] shadow-[0_0_8px_#ec6a06]" />
        <div className="absolute w-0.5 h-0.5 top-[80%] left-[25%] opacity-70 rounded-full bg-[rgba(34,211,238,0.5)] shadow-[0_0_5px_#22d3ee]" />
        <div className="absolute w-2 h-2 top-[15%] left-[70%] opacity-20 rounded-full bg-[#ec6a06] shadow-[0_0_10px_#ec6a06]" />
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[100px] opacity-20" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#ec6a06] rounded-full mix-blend-screen filter blur-[120px] opacity-10" />
      </div>

      <main className="w-full max-w-[520px] relative z-10">
        {/* Header outside card */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-[#22d3ee] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] tracking-widest uppercase mb-2">
            AGNICORE
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse"
              style={{
                animation: 'pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
              }}
            />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#859397]">
              Digital Sovereignty Protocol
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative rounded-[24px] p-6 sm:p-8 lg:p-10 w-full overflow-hidden"
          style={{
            background: 'rgba(2, 12, 27, 0.6)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderTop: '1px solid rgba(34, 211, 238, 0.3)',
            borderLeft: '1px solid rgba(34, 211, 238, 0.2)',
            borderRight: '1px solid rgba(236, 106, 6, 0.2)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Scanning Line Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px]">
            <div 
              className="w-full h-[2px] bg-white/10 absolute top-[-2px] left-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              style={{
                animation: 'scan 4s linear infinite'
              }}
            />
          </div>

          {/* Card Header */}
          <div className="mb-8 text-center border-b border-white/5 pb-4">
            <h2 className="text-3xl font-semibold text-[#dde4e5] mb-1">Create Account</h2>
            <p className="text-base text-[#bbc9cd]">Register for access to the command center</p>
          </div>

          {/* Zero Trust Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.3)] rounded-full px-4 py-2 flex items-center gap-2">
              <span className="text-[14px] text-[#22d3ee]">🛡</span>
              <span className="text-xs font-bold text-[#22d3ee] tracking-wider">Zero Trust Protocol Active</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-sm tracking-wider text-[#859397] block ml-2 font-mono">
                USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-[#859397]">👤</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg py-3 pl-10 pr-3 text-base bg-[#020c1b] border border-white/10 text-[#dde4e5] placeholder-white/30 focus:border-[#22d3ee] focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] focus:outline-none transition-all"
                  placeholder="Choose a username"
                  required
                  minLength={3}
                  maxLength={32}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm tracking-wider text-[#859397] block ml-2 font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-[#859397]">🔒</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg py-3 pl-10 pr-3 text-base bg-[#020c1b] border border-white/10 text-[#dde4e5] placeholder-white/30 focus:border-[#22d3ee] focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] focus:outline-none transition-all"
                  placeholder="••••••••••••••••"
                  required
                  minLength={12}
                />
              </div>
              <p className="text-xs text-[#859397] mt-1 ml-2">Min 12 chars, uppercase, lowercase, number, special char</p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-sm tracking-wider text-[#859397] block ml-2 font-mono">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-[#859397]">🔒</span>
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg py-3 pl-10 pr-3 text-base bg-[#020c1b] border border-white/10 text-[#dde4e5] placeholder-white/30 focus:border-[#22d3ee] focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] focus:outline-none transition-all"
                  placeholder="••••••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg py-3 flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #ec6a06 0%, #ff5277 100%)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <span className="text-xs font-bold text-white tracking-widest uppercase">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </span>
                <span className="text-white">✨</span>
              </button>
            </div>
          </form>

          {/* Card Footer */}
          <div className="mt-8 pt-4 border-t border-white/5 flex flex-col items-center gap-2">
            <p className="text-sm text-[#859397]">
              Already have an account?{' '}
              <button
                onClick={onRegister}
                className="text-[#22d3ee] hover:text-[#ec6a06] transition-colors font-medium"
              >
                Sign in
              </button>
            </p>
            <div className="flex items-center gap-2 mt-1 opacity-50">
              <span className="text-[12px] text-[#859397]">🔐</span>
              <span className="text-[10px] text-[#859397] tracking-[0.2em] uppercase">256-bit AES encrypted</span>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes scan {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 211, 238, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
        }
      `}</style>
    </div>
  );
}