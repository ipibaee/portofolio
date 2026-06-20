'use server';

import { query } from '@/lib/db';
import { hashPassword, verifyPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function registerAction(prevState, formData) {
  const username = formData.get('username')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!username || !email || !password) {
    return { error: 'Semua kolom harus diisi.' };
  }

  if (username.length < 3) {
    return { error: 'Username minimal 3 karakter.' };
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter.' };
  }

  let registrationSuccess = false;

  try {
    // Check if username already exists
    const existingUsername = await query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
    if (existingUsername && existingUsername.length > 0) {
      return { error: 'Username sudah digunakan.' };
    }

    // Check if email already exists
    const existingEmail = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existingEmail && existingEmail.length > 0) {
      return { error: 'Email sudah digunakan.' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    await query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      hashedPassword
    ]);

    registrationSuccess = true;
  } catch (error) {
    console.error('Registration error:', error);
    return { error: `Terjadi kesalahan saat pendaftaran: ${error.message}` };
  }

  if (registrationSuccess) {
    redirect('/login?registered=true');
  }
}

export async function loginAction(prevState, formData) {
  const usernameOrEmail = formData.get('usernameOrEmail')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!usernameOrEmail || !password) {
    return { error: 'Semua kolom harus diisi.' };
  }

  let loginSuccess = false;

  try {
    // Find user by username or email
    const users = await query('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [
      usernameOrEmail,
      usernameOrEmail
    ]);

    if (!users || users.length === 0) {
      return { error: 'Username/Email atau password salah.' };
    }

    const user = users[0];
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Username/Email atau password salah.' };
    }

    // Sign session token
    const token = await signToken({
      userId: user.id,
      username: user.username,
      email: user.email
    });

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
    });

    loginSuccess = true;
  } catch (error) {
    console.error('Login error:', error);
    return { error: `Terjadi kesalahan saat login: ${error.message}` };
  }

  if (loginSuccess) {
    redirect('/dashboard');
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
