import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from '../actions';
import { query } from '@/lib/db';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const payload = await verifyToken(token);
  
  // Database status
  const dbType = process.env.DATABASE_URL ? 'Neon Postgres' : 'SQLite';
  
  // Real count of users in database
  let totalUsers = 0;
  try {
    const userCountResult = await query('SELECT COUNT(*) as count FROM users');
    // For SQLite and PostgreSQL, let's extract the count value dynamically
    const firstRow = userCountResult[0];
    if (firstRow) {
      // Postgres might return count as a string, SQLite returns it under different casing
      const countKey = Object.keys(firstRow).find(key => key.toLowerCase() === 'count');
      totalUsers = countKey ? Number(firstRow[countKey]) : 0;
    }
  } catch (error) {
    console.error('Failed to fetch user count:', error);
  }

  // Dummy activity data
  const activities = [
    { id: 1, action: 'User berhasil login', time: '1 menit yang lalu', status: 'active' },
    { id: 2, action: 'Memuat data dashboard', time: '2 menit yang lalu', status: 'active' },
    { id: 3, action: 'Sinkronisasi Vercel', time: '2 jam yang lalu', status: 'active' },
    { id: 4, action: 'Database migrasi', time: '1 hari yang lalu', status: 'pending' },
  ];

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Selamat Datang, {payload?.username || 'Pengguna'}!</h1>
          <p>Email terdaftar: {payload?.email || 'tidak diketahui'}</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-logout" id="btn-logout">
            Keluar (Logout)
          </button>
        </form>
      </header>

      <section className="dashboard-grid">
        <div className="widget-card">
          <div className="widget-header">Status Database</div>
          <div className="widget-value" style={{ color: 'var(--accent)' }}>
            {dbType}
          </div>
          <div className="widget-desc">
            Menggunakan database lokal SQLite untuk dev, dan terhubung ke Neon Postgres secara dinamis di server produksi.
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">Total Terdaftar</div>
          <div className="widget-value">{totalUsers}</div>
          <div className="widget-desc">
            Jumlah total akun yang terdaftar dalam database saat ini.
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">Sesi Berjalan</div>
          <div className="widget-value" style={{ color: 'var(--success)' }}>
            Aktif
          </div>
          <div className="widget-desc">
            Token sesi Anda disimpan di HTTP-only cookie dengan masa berlaku selama 2 jam ke depan.
          </div>
        </div>
      </section>

      <section className="table-card">
        <h2 className="table-title">Log Aktivitas Sistem</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Aktivitas</th>
                <th>Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id}>
                  <td>{act.action}</td>
                  <td>{act.time}</td>
                  <td>
                    <span className={`badge ${act.status === 'active' ? 'badge-active' : 'badge-pending'}`}>
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
