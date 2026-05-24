import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Artificial delay for premium login experience
    setTimeout(() => {
      if (email.trim().toLowerCase() === 'admin@bookmyvenue.com' && password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid administrative credentials. Please verify your email and password.');
        setIsLoading(false);
      }
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md p-8 glass-panel border border-slate-900 rounded-2xl shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 flex justify-center items-center font-black text-slate-950 text-xl shadow-lg mb-4">
            BMV
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">BookMyVenue</h1>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Administrative Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bookmyvenue.com"
                className="w-full bg-slate-950/60 border border-slate-900 focus:border-cyan-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-900 focus:border-cyan-500 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-cyan-400 to-indigo-500 hover:opacity-95 text-slate-950 flex justify-center items-center gap-2 cursor-pointer transition active:scale-[0.98] shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Static Login Credentials</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-semibold">Admin Email</span>
              <code className="text-cyan-400 font-bold font-mono">admin@bookmyvenue.com</code>
            </div>
            <div>
              <span className="text-slate-500 block text-[8px] uppercase font-semibold">Password</span>
              <code className="text-indigo-400 font-bold font-mono">admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
