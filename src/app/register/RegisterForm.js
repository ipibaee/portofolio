'use client';

import { useActionState } from 'react';
import { registerAction } from '../actions';
import Link from 'next/link';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title" id="register-title">Daftar Akun</h1>
        <p className="auth-subtitle">Buat akun baru untuk mulai menggunakan layanan</p>
      </div>

      {state?.error && (
        <div className="alert alert-error" role="alert" id="error-alert">
          <span>⚠ {state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            placeholder="Masukkan username"
            required
            minLength={3}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="nama@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn" disabled={isPending} id="btn-register">
          {isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>
      </form>

      <div className="auth-footer">
        Sudah memiliki akun?{' '}
        <Link href="/login" className="auth-link">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
