import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-[0_0_25px_rgba(0,242,254,0.35)] p-0.5 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Panel Admin Portofolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Masuk untuk mengelola isi website, projek (Motocare, dll), dan pengaturan porto.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <LoginForm />
        </div>

        {/* Default credentials reminder */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 text-center">
          <span className="text-xs text-slate-400 block mb-1">
            Akun Default Bawaan:
          </span>
          <div className="flex items-center justify-center gap-3 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10">
              Username: <strong>admin</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10">
              Password: <strong>admin123</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1.5">
            (Password dapat Anda ubah kapan saja di tab Pengaturan Admin)
          </span>
        </div>
      </div>
    </div>
  );
}
