'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';
import Link from 'next/link';

export default function LoginForm({ registered }) {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title" id="login-title">Masuk Akun</h1>
        <p className="auth-subtitle">Silakan login untuk mengakses dashboard</p>
      </div>

      {registered && !state?.error && (
        <div className="alert alert-success" role="alert" id="success-alert">
          <span>✓ Akun berhasil dibuat! Silakan masuk.</span>
        </div>
      )}

      {state?.error && (
        <div className="alert alert-error" role="alert" id="error-alert">
          <span>⚠ {state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <div className="form-group">
          <label className="form-label" htmlFor="usernameOrEmail">Username atau Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            className="form-control"
            placeholder="Masukkan username atau email"
            required
            autoComplete="username"
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
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn" disabled={isPending} id="btn-login">
          {isPending ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div className="auth-footer">
        Belum punya akun?{' '}
        <Link href="/register" className="auth-link">
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
