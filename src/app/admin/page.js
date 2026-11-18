import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query, ensureTables } from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/admin/login');
  }

  // better-sqlite3 is synchronous
  ensureTables();
  const profiles    = query('SELECT * FROM profile LIMIT 1');
  const projects    = query('SELECT * FROM projects ORDER BY order_index ASC, id DESC');
  const menuLinks   = query('SELECT * FROM menu_links ORDER BY order_index ASC, id ASC');
  const skills      = query('SELECT * FROM skills ORDER BY order_index ASC, id ASC');
  const experiences = query('SELECT * FROM experiences ORDER BY order_index ASC, id ASC');
  const services    = query('SELECT * FROM services ORDER BY order_index ASC, id ASC');
  const messages    = query('SELECT * FROM messages ORDER BY id DESC');

  const profile = (profiles && profiles[0]) || {};

  return (
    <AdminDashboard
      currentUser={user}
      initialProfile={profile}
      initialProjects={projects || []}
      initialMenuLinks={menuLinks || []}
      initialSkills={skills || []}
      initialExperiences={experiences || []}
      initialServices={services || []}
      initialMessages={messages || []}
    />
  );
}
