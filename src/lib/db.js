import { createClient } from '@libsql/client';
import { neon } from '@neondatabase/serverless';
import path from 'path';

let dbClient = null;
let dbType = 'sqlite'; // 'sqlite' or 'postgres'
let initialized = false;
let initPromise = null;

function getClient() {
  if (process.env.DATABASE_URL) {
    dbType = 'postgres';
    if (!dbClient) {
      dbClient = neon(process.env.DATABASE_URL);
    }
  } else {
    dbType = 'sqlite';
    if (!dbClient) {
      const dbPath = path.resolve(process.cwd(), 'local.db');
      dbClient = createClient({ url: `file:${dbPath}` });
    }
  }
  return dbClient;
}

export async function ensureTables() {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const client = getClient();
    
    try {
      if (dbType === 'postgres') {
        await client(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS profile (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            title VARCHAR(255),
            tagline VARCHAR(255),
            headline VARCHAR(255),
            about_text TEXT,
            birthday VARCHAR(100),
            website VARCHAR(255),
            phone VARCHAR(100),
            city VARCHAR(255),
            age VARCHAR(50),
            degree VARCHAR(100),
            email VARCHAR(255),
            freelance_status VARCHAR(100),
            avatar_url TEXT,
            hero_bg_url TEXT,
            github_url TEXT,
            instagram_url TEXT,
            linkedin_url TEXT,
            whatsapp_url TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(100) DEFAULT 'Tech',
            percentage INTEGER DEFAULT 80,
            order_index INTEGER DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100) DEFAULT 'Web App',
            description TEXT,
            details TEXT,
            image_url TEXT,
            demo_url TEXT,
            github_url TEXT,
            tags VARCHAR(255),
            featured INTEGER DEFAULT 0,
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS menu_links (
            id SERIAL PRIMARY KEY,
            label VARCHAR(100) NOT NULL,
            url TEXT NOT NULL,
            badge VARCHAR(50) DEFAULT '',
            icon VARCHAR(50) DEFAULT 'Rocket',
            is_external INTEGER DEFAULT 1,
            is_active INTEGER DEFAULT 1,
            order_index INTEGER DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS experiences (
            id SERIAL PRIMARY KEY,
            type VARCHAR(50) DEFAULT 'experience',
            title VARCHAR(255) NOT NULL,
            period VARCHAR(100),
            institution VARCHAR(255),
            description TEXT,
            order_index INTEGER DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS services (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            icon VARCHAR(50) DEFAULT 'Code',
            order_index INTEGER DEFAULT 0
          );

          CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255),
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } else {
        await client.execute(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        await client.execute(`
          CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT,
            tagline TEXT,
            headline TEXT,
            about_text TEXT,
            birthday TEXT,
            website TEXT,
            phone TEXT,
            city TEXT,
            age TEXT,
            degree TEXT,
            email TEXT,
            freelance_status TEXT,
            avatar_url TEXT,
            hero_bg_url TEXT,
            github_url TEXT,
            instagram_url TEXT,
            linkedin_url TEXT,
            whatsapp_url TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        await client.execute(`
          CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT DEFAULT 'Tech',
            percentage INTEGER DEFAULT 80,
            order_index INTEGER DEFAULT 0
          );
        `);

        await client.execute(`
          CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT DEFAULT 'Web App',
            description TEXT,
            details TEXT,
            image_url TEXT,
            demo_url TEXT,
            github_url TEXT,
            tags TEXT,
            featured INTEGER DEFAULT 0,
            order_index INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        await client.execute(`
          CREATE TABLE IF NOT EXISTS menu_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            url TEXT NOT NULL,
            badge TEXT DEFAULT '',
            icon TEXT DEFAULT 'Rocket',
            is_external INTEGER DEFAULT 1,
            is_active INTEGER DEFAULT 1,
            order_index INTEGER DEFAULT 0
          );
        `);

        await client.execute(`
          CREATE TABLE IF NOT EXISTS experiences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT DEFAULT 'experience',
            title TEXT NOT NULL,
            period TEXT,
            institution TEXT,
            description TEXT,
            order_index INTEGER DEFAULT 0
          );
        `);

        await client.execute(`
          CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            icon TEXT DEFAULT 'Code',
            order_index INTEGER DEFAULT 0
          );
        `);

        await client.execute(`
          CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
      }

      // Seed default admin if no admin user exists
      const adminCheck = await (dbType === 'postgres' 
        ? client("SELECT id FROM users WHERE username = 'admin' LIMIT 1") 
        : client.execute("SELECT id FROM users WHERE username = 'admin' LIMIT 1"));
      
      const adminRows = dbType === 'postgres' ? adminCheck : adminCheck.rows;
      if (!adminRows || adminRows.length === 0) {
        // Default password is admin123 (hashed)
        const defaultHash = '$2b$10$z7WPVK4Hxj5ywujlq4JsE.FZmxY1hhN6ZiZIN47YmBmH1Z8nes8g.';
        if (dbType === 'postgres') {
          await client("INSERT INTO users (username, email, password) VALUES ('admin', 'admin@ipibaee.com', $1)", [defaultHash]);
        } else {
          await client.execute({
            sql: "INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)",
            args: ['admin', 'admin@ipibaee.com', defaultHash]
          });
        }
        console.log('Default admin user ready: admin / admin123');
      }

      // Seed profile data if empty
      const profileCheck = await (dbType === 'postgres'
        ? client("SELECT id FROM profile LIMIT 1")
        : client.execute("SELECT id FROM profile LIMIT 1"));
      
      const profileRows = dbType === 'postgres' ? profileCheck : profileCheck.rows;
      if (!profileRows || profileRows.length === 0) {
        const sqlProfile = `
          INSERT INTO profile (
            name, title, tagline, headline, about_text,
            birthday, website, phone, city, age, degree, email,
            freelance_status, avatar_url, hero_bg_url,
            github_url, instagram_url, linkedin_url, whatsapp_url
          ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?
          )
        `;
        const profileArgs = [
          "Mu'amar Zulkifli",
          "IPIPortofolio",
          "Designer, Developer, Freelancer, Photographer",
          "Desainer & Teknisi Web Modern",
          "Halo! Saya Mu'amar Zulkifli, seorang Desainer dan Web Developer dari Banjarnegara, Jawa Tengah. Saya berfokus pada pengembangan website interaktif, modern, dan fungsional dengan antarmuka yang memukau serta performa responsif di semua perangkat.",
          "6 Agustus 2004",
          "www.ipibaee.com",
          "+62 895638714471",
          "Banjarnegara, JATENG",
          "20",
          "Informatika / Teknologi Komputer",
          "ipibaee@gmail.com",
          "Available for Projects",
          "/portfolio-assets/img/profile-img.jpg",
          "/portfolio-assets/img/hero-bg.jpg",
          "https://github.com/ipibaee",
          "https://instagram.com/ipibaee",
          "https://linkedin.com/in/ipibaee",
          "https://wa.me/62895638714471"
        ];

        if (dbType === 'postgres') {
          let idx = 1;
          const pgProfile = sqlProfile.replace(/\?/g, () => `$${idx++}`);
          await client(pgProfile, profileArgs);
        } else {
          await client.execute({ sql: sqlProfile, args: profileArgs });
        }
      }

      // Seed initial projects if empty
      const projectsCheck = await (dbType === 'postgres'
        ? client("SELECT id FROM projects LIMIT 1")
        : client.execute("SELECT id FROM projects LIMIT 1"));
      const projectsRows = dbType === 'postgres' ? projectsCheck : projectsCheck.rows;
      if (!projectsRows || projectsRows.length === 0) {
        const initialProjects = [
          {
            title: "Motocare - Sistem Bengkel & Booking Servis",
            category: "Web App",
            description: "Sistem web manajemen bengkel modern terintegrasi dengan booking online servis motor, inventaris suku cadang, dan invoice digital.",
            details: "Aplikasi Motocare dibangun untuk mempermudah operasional bengkel servis motor. Fitur mencakup sistem antrian real-time, pencatatan histori servis kendaraan, pengingat jadwal servis berkala via WhatsApp, dan laporan keuangan komprehensif.",
            image_url: "/portfolio-assets/img/portfolio/portfolio-1.jpg",
            demo_url: "https://motocare.ipibaee.com",
            github_url: "https://github.com/ipibaee/motocare",
            tags: "PHP, Laravel, Tailwind CSS, MySQL",
            featured: 1,
            order_index: 1
          },
          {
            title: "Sistem Informasi & E-Commerce Toko",
            category: "Website",
            description: "Website toko online responsif dilengkapi dengan katalog produk interaktif, keranjang belanja dinamis, dan checkout via WhatsApp.",
            details: "Platform penjualan online modern yang dirancang untuk UMKM. Dilengkapi manajemen stok, pencarian produk cepat, dan tampilan mobile-first yang sangat nyaman diakses dari smartphone.",
            image_url: "/portfolio-assets/img/portfolio/portfolio-2.jpg",
            demo_url: "https://shop.ipibaee.com",
            github_url: "https://github.com/ipibaee",
            tags: "Next.js, React, Tailwind, SQLite",
            featured: 1,
            order_index: 2
          },
          {
            title: "Creative Visual Branding & UI Studio",
            category: "Design",
            description: "Koleksi desain identitas brand visual, prototipe aplikasi mobile modern, ikonografi kustom, dan materi promosi digital.",
            details: "Proyek perancangan visual komprehensif mencakup brand guidelines, logo vector, tipografi terstruktur, serta prototipe UI/UX interaktif dengan standar desain masa kini.",
            image_url: "/portfolio-assets/img/portfolio/portfolio-3.jpg",
            demo_url: "#",
            github_url: "https://github.com/ipibaee",
            tags: "Figma, Adobe Photoshop, UI/UX",
            featured: 1,
            order_index: 3
          },
          {
            title: "Company Profile Interaktif & Animasi",
            category: "Website",
            description: "Website profil perusahaan profesional dengan animasi transisi 3D, particle efek, dan optimasi SEO tingkat lanjut.",
            details: "Website showcase korporat yang responsif dengan loading cepat, integrasi Google Maps, formulir penawaran harga dinamis, dan animasi visual menarik.",
            image_url: "/portfolio-assets/img/portfolio/portfolio-4.jpg",
            demo_url: "#",
            github_url: "https://github.com/ipibaee",
            tags: "HTML5, CSS3, JavaScript, GSAP",
            featured: 0,
            order_index: 4
          }
        ];

        for (const p of initialProjects) {
          const sql = `
            INSERT INTO projects (title, category, description, details, image_url, demo_url, github_url, tags, featured, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const args = [p.title, p.category, p.description, p.details, p.image_url, p.demo_url, p.github_url, p.tags, p.featured, p.order_index];
          if (dbType === 'postgres') {
            let idx = 1;
            const pgSql = sql.replace(/\?/g, () => `$${idx++}`);
            await client(pgSql, args);
          } else {
            await client.execute({ sql, args });
          }
        }
      }

      // Seed menu_links (project menu shortcut buttons) if empty
      const menuCheck = await (dbType === 'postgres'
        ? client("SELECT id FROM menu_links LIMIT 1")
        : client.execute("SELECT id FROM menu_links LIMIT 1"));
      const menuRows = dbType === 'postgres' ? menuCheck : menuCheck.rows;
      if (!menuRows || menuRows.length === 0) {
        const initialLinks = [
          {
            label: "Motocare 🏍️",
            url: "https://motocare.ipibaee.com",
            badge: "Featured App",
            icon: "Wrench",
            is_external: 1,
            is_active: 1,
            order_index: 1
          },
          {
            label: "E-Commerce Toko 🛍️",
            url: "#projects",
            badge: "Live Demo",
            icon: "ShoppingBag",
            is_external: 0,
            is_active: 1,
            order_index: 2
          },
          {
            label: "Koleksi Desain 🎨",
            url: "#projects",
            badge: "Portofolio",
            icon: "Palette",
            is_external: 0,
            is_active: 1,
            order_index: 3
          }
        ];

        for (const m of initialLinks) {
          const sql = `
            INSERT INTO menu_links (label, url, badge, icon, is_external, is_active, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          const args = [m.label, m.url, m.badge, m.icon, m.is_external, m.is_active, m.order_index];
          if (dbType === 'postgres') {
            let idx = 1;
            const pgSql = sql.replace(/\?/g, () => `$${idx++}`);
            await client(pgSql, args);
          } else {
            await client.execute({ sql, args });
          }
        }
      }

      // Seed skills if empty
      const skillsCheck = await (dbType === 'postgres'
        ? client("SELECT id FROM skills LIMIT 1")
        : client.execute("SELECT id FROM skills LIMIT 1"));
      const skillsRows = dbType === 'postgres' ? skillsCheck : skillsCheck.rows;
      if (!skillsRows || skillsRows.length === 0) {
        const initialSkills = [
          { name: "HTML & Semantic Web", category: "Frontend", percentage: 100, order_index: 1 },
          { name: "CSS & Tailwind CSS", category: "Frontend", percentage: 90, order_index: 2 },
          { name: "JavaScript & TypeScript", category: "Frontend", percentage: 85, order_index: 3 },
          { name: "PHP & Laravel", category: "Backend", percentage: 80, order_index: 4 },
          { name: "WordPress & Headless CMS", category: "CMS", percentage: 90, order_index: 5 },
          { name: "Adobe Photoshop & Graphic", category: "Design", percentage: 75, order_index: 6 },
          { name: "React & Next.js", category: "Frontend", percentage: 85, order_index: 7 },
          { name: "Server & aaPanel / Linux", category: "DevOps", percentage: 80, order_index: 8 }
        ];

        for (const s of initialSkills) {
          const sql = `INSERT INTO skills (name, category, percentage, order_index) VALUES (?, ?, ?, ?)`;
          const args = [s.name, s.category, s.percentage, s.order_index];
          if (dbType === 'postgres') {
            let idx = 1;
            const pgSql = sql.replace(/\?/g, () => `$${idx++}`);
            await client(pgSql, args);
          } else {
            await client.execute({ sql, args });
          }
        }
      }

      // Seed experiences if empty
      const expCheck = await (dbType === 'postgres'
        ? client("SELECT id FROM experiences LIMIT 1")
        : client.execute("SELECT id FROM experiences LIMIT 1"));
      const expRows = dbType === 'postgres' ? expCheck : expCheck.rows;
      if (!expRows || expRows.length === 0) {
        const initialExp = [
          {
            type: "experience",
            title: "Fullstack Web Developer & Freelancer",
            period: "2023 - Sekarang",
            institution: "Freelance / Self-Employed",
            description: "Membangun sistem web interaktif, aplikasi bengkel Motocare, e-commerce, dan kustomisasi server aaPanel.",
            order_index: 1
          },
          {
            type: "experience",
            title: "Desainer Grafis & Teknisi Komputer",
            period: "2021 - 2023",
            institution: "Studio & IT Service",
            description: "Merancang visual branding, materi promosi, instalasi jaringan, dan perbaikan perangkat keras & sistem operasi.",
            order_index: 2
          },
          {
            type: "education",
            title: "Pendidikan Teknik Informatika & Komputer",
            period: "2020 - 2024",
            institution: "Pendidikan Kejuruan / Tinggi",
            description: "Mempelajari rekayasa perangkat lunak, arsitektur basis data, jaringan komputer, dan algoritma pemrograman.",
            order_index: 3
          }
        ];

        for (const e of initialExp) {
          const sql = `INSERT INTO experiences (type, title, period, institution, description, order_index) VALUES (?, ?, ?, ?, ?, ?)`;
          const args = [e.type, e.title, e.period, e.institution, e.description, e.order_index];
          if (dbType === 'postgres') {
            let idx = 1;
            const pgSql = sql.replace(/\?/g, () => `$${idx++}`);
            await client(pgSql, args);
          } else {
            await client.execute({ sql, args });
          }
        }
      }

      // Seed services if empty
      const srvCheck = await (dbType === 'postgres'
        ? client("SELECT id FROM services LIMIT 1")
        : client.execute("SELECT id FROM services LIMIT 1"));
      const srvRows = dbType === 'postgres' ? srvCheck : srvCheck.rows;
      if (!srvRows || srvRows.length === 0) {
        const initialServices = [
          {
            title: "Web Development",
            description: "Pengembangan website kustom dari landing page hingga web app kompleks dengan Next.js, PHP/Laravel, dan Tailwind CSS.",
            icon: "Code",
            order_index: 1
          },
          {
            title: "UI/UX & Desain Grafis",
            description: "Desain antarmuka modern yang berfokus pada pengalaman pengguna, identitas brand, ilustrasi, dan aset visual.",
            icon: "Palette",
            order_index: 2
          },
          {
            title: "Teknisi Sistem & Deployment",
            description: "Setup VPS, konfigurasi aaPanel, automasi deployment GitHub Webhook, integrasi SSL, dan optimasi performa web.",
            icon: "Server",
            order_index: 3
          },
          {
            title: "Aplikasi Khusus & Sistem Kasir",
            description: "Pembuatan aplikasi bisnis seperti sistem bengkel (Motocare), kasir POS, booking servis, dan manajemen database.",
            icon: "Layers",
            order_index: 4
          }
        ];

        for (const s of initialServices) {
          const sql = `INSERT INTO services (title, description, icon, order_index) VALUES (?, ?, ?, ?)`;
          const args = [s.title, s.description, s.icon, s.order_index];
          if (dbType === 'postgres') {
            let idx = 1;
            const pgSql = sql.replace(/\?/g, () => `$${idx++}`);
            await client(pgSql, args);
          } else {
            await client.execute({ sql, args });
          }
        }
      }

      initialized = true;
      console.log(`Database tables and seed data verified successfully using: ${dbType}`);
    } catch (error) {
      console.error('Failed to initialize database tables:', error);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Execute a query with compatible parameters.
 * Replace '?' with '$1', '$2', etc. if Postgres is used.
 */
export async function query(sqlQuery, params = []) {
  await ensureTables();
  const client = getClient();
  
  try {
    if (dbType === 'postgres') {
      let index = 1;
      const pgQuery = sqlQuery.replace(/\?/g, () => `$${index++}`);
      const rows = await client(pgQuery, params);
      return rows;
    } else {
      const result = await client.execute({ sql: sqlQuery, args: params });
      return result.rows;
    }
  } catch (error) {
    console.error(`Database query error on [${dbType}]:`, error);
    throw error;
  }
}
