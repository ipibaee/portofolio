import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Fetch all portfolio and system data
  const [
    profiles,
    projects,
    menuLinks,
    skills,
    experiences,
    services,
    messages
  ] = await Promise.all([
    query('SELECT * FROM profile LIMIT 1'),
    query('SELECT * FROM projects ORDER BY order_index ASC, id DESC'),
    query('SELECT * FROM menu_links ORDER BY order_index ASC, id ASC'),
    query('SELECT * FROM skills ORDER BY order_index ASC, id ASC'),
    query('SELECT * FROM experiences ORDER BY order_index ASC, id ASC'),
    query('SELECT * FROM services ORDER BY order_index ASC, id ASC'),
    query('SELECT * FROM messages ORDER BY id DESC')
  ]);

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
