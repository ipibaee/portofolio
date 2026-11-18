'use server';

import { query } from '@/lib/db';
import { hashPassword, verifyPassword, signToken, getSessionUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// ======================== AUTH ACTIONS ========================

export async function loginAction(prevState, formData) {
  const usernameOrEmail = formData.get('usernameOrEmail')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!usernameOrEmail || !password) {
    return { error: 'Username/Email dan password harus diisi.' };
  }

  try {
    // better-sqlite3 is synchronous - no await needed for query
    const users = query(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [usernameOrEmail, usernameOrEmail]
    );

    if (!users || users.length === 0) {
      return { error: 'Username/Email atau password salah.' };
    }

    const user = users[0];
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Username/Email atau password salah.' };
    }

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
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    console.error('Login error:', error);
    return { error: `Terjadi kesalahan saat login: ${error.message}` };
  }

  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/admin/login');
}

export async function changeAdminPasswordAction(prevState, formData) {
  const user = await getSessionUser();
  if (!user) {
    return { error: 'Unauthorized: Silakan login terlebih dahulu.' };
  }

  const currentPassword = formData.get('currentPassword')?.toString();
  const newUsername = formData.get('newUsername')?.toString().trim();
  const newEmail = formData.get('newEmail')?.toString().trim();
  const newPassword = formData.get('newPassword')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!currentPassword) {
    return { error: 'Password saat ini harus diisi untuk konfirmasi keamanan.' };
  }

  try {
    const users = query('SELECT * FROM users WHERE id = ? LIMIT 1', [user.userId]);
    if (!users || users.length === 0) {
      return { error: 'User admin tidak ditemukan.' };
    }

    const adminUser = users[0];
    const isValid = await verifyPassword(currentPassword, adminUser.password);
    if (!isValid) {
      return { error: 'Password saat ini salah.' };
    }

    let finalPasswordHash = adminUser.password;
    if (newPassword) {
      if (newPassword.length < 6) {
        return { error: 'Password baru minimal 6 karakter.' };
      }
      if (newPassword !== confirmPassword) {
        return { error: 'Konfirmasi password baru tidak cocok.' };
      }
      finalPasswordHash = await hashPassword(newPassword);
    }

    const finalUsername = newUsername || adminUser.username;
    const finalEmail = newEmail || adminUser.email;

    const existing = query(
      'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ? LIMIT 1',
      [finalUsername, finalEmail, adminUser.id]
    );
    if (existing && existing.length > 0) {
      return { error: 'Username atau Email sudah dipakai user lain.' };
    }

    query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [finalUsername, finalEmail, finalPasswordHash, adminUser.id]
    );

    const token = await signToken({
      userId: adminUser.id,
      username: finalUsername,
      email: finalEmail
    });

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: 'Data admin & password berhasil diperbarui!' };
  } catch (error) {
    console.error('Password change error:', error);
    return { error: `Gagal memperbarui: ${error.message}` };
  }
}

// ======================== PROFILE ACTIONS ========================

export async function updateProfileAction(prevState, formData) {
  const user = await getSessionUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    const name = formData.get('name')?.toString() || '';
    const title = formData.get('title')?.toString() || '';
    const tagline = formData.get('tagline')?.toString() || '';
    const headline = formData.get('headline')?.toString() || '';
    const about_text = formData.get('about_text')?.toString() || '';
    const birthday = formData.get('birthday')?.toString() || '';
    const website = formData.get('website')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const city = formData.get('city')?.toString() || '';
    const age = formData.get('age')?.toString() || '';
    const degree = formData.get('degree')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const freelance_status = formData.get('freelance_status')?.toString() || '';
    const avatar_url = formData.get('avatar_url')?.toString() || '';
    const hero_bg_url = formData.get('hero_bg_url')?.toString() || '';
    const github_url = formData.get('github_url')?.toString() || '';
    const instagram_url = formData.get('instagram_url')?.toString() || '';
    const linkedin_url = formData.get('linkedin_url')?.toString() || '';
    const whatsapp_url = formData.get('whatsapp_url')?.toString() || '';

    const existing = query('SELECT id FROM profile LIMIT 1');
    if (existing && existing.length > 0) {
      query(
        `UPDATE profile SET
          name = ?, title = ?, tagline = ?, headline = ?, about_text = ?,
          birthday = ?, website = ?, phone = ?, city = ?, age = ?, degree = ?, email = ?,
          freelance_status = ?, avatar_url = ?, hero_bg_url = ?,
          github_url = ?, instagram_url = ?, linkedin_url = ?, whatsapp_url = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          name, title, tagline, headline, about_text,
          birthday, website, phone, city, age, degree, email,
          freelance_status, avatar_url, hero_bg_url,
          github_url, instagram_url, linkedin_url, whatsapp_url,
          existing[0].id
        ]
      );
    } else {
      query(
        `INSERT INTO profile (
          name, title, tagline, headline, about_text,
          birthday, website, phone, city, age, degree, email,
          freelance_status, avatar_url, hero_bg_url,
          github_url, instagram_url, linkedin_url, whatsapp_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, title, tagline, headline, about_text,
          birthday, website, phone, city, age, degree, email,
          freelance_status, avatar_url, hero_bg_url,
          github_url, instagram_url, linkedin_url, whatsapp_url
        ]
      );
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: 'Profil berhasil disimpan!' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { error: `Gagal memperbarui profil: ${error.message}` };
  }
}

// ======================== PROJECT ACTIONS ========================

export async function saveProjectAction(prevState, formData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString().trim();
    const category = formData.get('category')?.toString().trim() || 'Web App';
    const description = formData.get('description')?.toString() || '';
    const details = formData.get('details')?.toString() || '';
    const image_url = formData.get('image_url')?.toString() || '/portfolio-assets/img/portfolio/portfolio-1.jpg';
    const demo_url = formData.get('demo_url')?.toString() || '';
    const github_url = formData.get('github_url')?.toString() || '';
    const tags = formData.get('tags')?.toString() || '';
    const featured = formData.get('featured') === 'on' || formData.get('featured') === '1' ? 1 : 0;
    const order_index = parseInt(formData.get('order_index')?.toString() || '0', 10);

    if (!title) {
      return { error: 'Judul projek harus diisi.' };
    }

    if (id) {
      query(
        `UPDATE projects SET
          title = ?, category = ?, description = ?, details = ?,
          image_url = ?, demo_url = ?, github_url = ?, tags = ?,
          featured = ?, order_index = ?
        WHERE id = ?`,
        [title, category, description, details, image_url, demo_url, github_url, tags, featured, order_index, id]
      );
    } else {
      query(
        `INSERT INTO projects (title, category, description, details, image_url, demo_url, github_url, tags, featured, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, category, description, details, image_url, demo_url, github_url, tags, featured, order_index]
      );
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: id ? 'Projek berhasil diupdate!' : 'Projek baru berhasil ditambahkan!' };
  } catch (error) {
    console.error('Save project error:', error);
    return { error: `Gagal menyimpan projek: ${error.message}` };
  }
}

export async function deleteProjectAction(id) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    query('DELETE FROM projects WHERE id = ?', [id]);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// ======================== MENU LINKS ACTIONS ========================

export async function saveMenuLinkAction(prevState, formData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const id = formData.get('id')?.toString();
    const label = formData.get('label')?.toString().trim();
    const url = formData.get('url')?.toString().trim();
    const badge = formData.get('badge')?.toString() || '';
    const icon = formData.get('icon')?.toString() || 'Rocket';
    const is_external = formData.get('is_external') === 'on' || formData.get('is_external') === '1' ? 1 : 0;
    const is_active = formData.get('is_active') === 'off' || formData.get('is_active') === '0' ? 0 : 1;
    const order_index = parseInt(formData.get('order_index')?.toString() || '0', 10);

    if (!label || !url) {
      return { error: 'Label tombol dan URL tujuan harus diisi.' };
    }

    if (id) {
      query(
        `UPDATE menu_links SET
          label = ?, url = ?, badge = ?, icon = ?,
          is_external = ?, is_active = ?, order_index = ?
        WHERE id = ?`,
        [label, url, badge, icon, is_external, is_active, order_index, id]
      );
    } else {
      query(
        `INSERT INTO menu_links (label, url, badge, icon, is_external, is_active, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [label, url, badge, icon, is_external, is_active, order_index]
      );
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: id ? 'Tombol menu projek berhasil diupdate!' : 'Tombol menu projek berhasil dibuat!' };
  } catch (error) {
    return { error: `Gagal menyimpan tombol menu: ${error.message}` };
  }
}

export async function deleteMenuLinkAction(id) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    query('DELETE FROM menu_links WHERE id = ?', [id]);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// ======================== SKILLS ACTIONS ========================

export async function saveSkillAction(prevState, formData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString().trim();
    const category = formData.get('category')?.toString().trim() || 'Tech';
    const percentage = parseInt(formData.get('percentage')?.toString() || '80', 10);
    const order_index = parseInt(formData.get('order_index')?.toString() || '0', 10);

    if (!name) return { error: 'Nama skill harus diisi.' };

    if (id) {
      query(
        'UPDATE skills SET name = ?, category = ?, percentage = ?, order_index = ? WHERE id = ?',
        [name, category, percentage, order_index, id]
      );
    } else {
      query(
        'INSERT INTO skills (name, category, percentage, order_index) VALUES (?, ?, ?, ?)',
        [name, category, percentage, order_index]
      );
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: id ? 'Skill berhasil diupdate!' : 'Skill baru berhasil ditambahkan!' };
  } catch (error) {
    return { error: `Gagal menyimpan skill: ${error.message}` };
  }
}

export async function deleteSkillAction(id) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    query('DELETE FROM skills WHERE id = ?', [id]);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// ======================== EXPERIENCES ACTIONS ========================

export async function saveExperienceAction(prevState, formData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const id = formData.get('id')?.toString();
    const type = formData.get('type')?.toString() || 'experience';
    const title = formData.get('title')?.toString().trim();
    const period = formData.get('period')?.toString() || '';
    const institution = formData.get('institution')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const order_index = parseInt(formData.get('order_index')?.toString() || '0', 10);

    if (!title) return { error: 'Judul pengalaman/pendidikan harus diisi.' };

    if (id) {
      query(
        'UPDATE experiences SET type = ?, title = ?, period = ?, institution = ?, description = ?, order_index = ? WHERE id = ?',
        [type, title, period, institution, description, order_index, id]
      );
    } else {
      query(
        'INSERT INTO experiences (type, title, period, institution, description, order_index) VALUES (?, ?, ?, ?, ?, ?)',
        [type, title, period, institution, description, order_index]
      );
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: 'Data pengalaman/pendidikan berhasil disimpan!' };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteExperienceAction(id) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    query('DELETE FROM experiences WHERE id = ?', [id]);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// ======================== SERVICES ACTIONS ========================

export async function saveServiceAction(prevState, formData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description')?.toString() || '';
    const icon = formData.get('icon')?.toString() || 'Code';
    const order_index = parseInt(formData.get('order_index')?.toString() || '0', 10);

    if (!title) return { error: 'Nama layanan harus diisi.' };

    if (id) {
      query(
        'UPDATE services SET title = ?, description = ?, icon = ?, order_index = ? WHERE id = ?',
        [title, description, icon, order_index, id]
      );
    } else {
      query(
        'INSERT INTO services (title, description, icon, order_index) VALUES (?, ?, ?, ?)',
        [title, description, icon, order_index]
      );
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: 'Layanan berhasil disimpan!' };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteServiceAction(id) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    query('DELETE FROM services WHERE id = ?', [id]);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

// ======================== CONTACT MESSAGE ACTIONS ========================

export async function submitContactMessageAction(prevState, formData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const subject = formData.get('subject')?.toString().trim() || 'Pesan dari Portofolio';
  const message = formData.get('message')?.toString().trim();

  if (!name || !email || !message) {
    return { error: 'Nama, Email, dan Pesan wajib diisi.' };
  }

  try {
    query(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    return { success: 'Terima kasih! Pesan Anda telah terkirim dan akan segera saya balas.' };
  } catch (error) {
    return { error: `Gagal mengirim pesan: ${error.message}` };
  }
}

export async function markMessageReadAction(id) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    query('UPDATE messages SET is_read = 1 WHERE id = ?', [id]);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteMessageAction(id) {
  const user = await getSessionUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    query('DELETE FROM messages WHERE id = ?', [id]);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
