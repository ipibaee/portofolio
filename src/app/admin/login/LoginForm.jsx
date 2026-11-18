'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-2">
          Username atau Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="usernameOrEmail"
            defaultValue="admin"
            required
            placeholder="admin / email"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type="password"
            name="password"
            defaultValue="admin123"
            required
            placeholder="Password admin"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white shadow-[0_0_20px_rgba(0,242,254,0.4)] disabled:opacity-50 transition-all cursor-pointer"
      >
        <span>{isPending ? 'Memproses...' : 'Masuk ke Dashboard Admin'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
