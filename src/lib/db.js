import Database from 'better-sqlite3';
import path from 'path';
import { hashSync } from 'bcryptjs';

let db = null;
let initialized = false;

function getDb() {
  if (!db) {
    const dbPath = path.resolve(process.cwd(), 'local.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function ensureTables() {
  if (initialized) return;
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT 'Mu''amar Zulkifli',
      title TEXT DEFAULT 'IPIPortofolio',
      tagline TEXT DEFAULT 'Designer, Developer, Freelancer, Photographer',
      headline TEXT DEFAULT 'Desainer & Teknisi Web Modern',
      about_text TEXT,
      birthday TEXT DEFAULT '6 Agustus 2004',
      website TEXT DEFAULT 'www.ipibaee.com',
      phone TEXT DEFAULT '+62 895638714471',
      city TEXT DEFAULT 'Banjarnegara, JATENG',
      age TEXT DEFAULT '20',
      degree TEXT DEFAULT 'Informatika / Teknologi Komputer',
      email TEXT DEFAULT 'ipibaee@gmail.com',
      freelance_status TEXT DEFAULT 'Available for Projects',
      avatar_url TEXT DEFAULT '/portfolio-assets/img/profile-img.jpg',
      hero_bg_url TEXT DEFAULT '/portfolio-assets/img/hero-bg.jpg',
      github_url TEXT DEFAULT 'https://github.com/ipibaee',
      instagram_url TEXT DEFAULT 'https://instagram.com/ipibaee',
      linkedin_url TEXT DEFAULT 'https://linkedin.com/in/ipibaee',
      whatsapp_url TEXT DEFAULT 'https://wa.me/62895638714471',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'Tech',
      percentage INTEGER DEFAULT 80,
      order_index INTEGER DEFAULT 0
    );

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

    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT DEFAULT 'experience',
      title TEXT NOT NULL,
      period TEXT,
      institution TEXT,
      description TEXT,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT 'Code',
      order_index INTEGER DEFAULT 0
    );

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

  // Seed admin user
  const adminExists = db.prepare("SELECT id FROM users WHERE username = 'admin' LIMIT 1").get();
  if (!adminExists) {
    const hash = hashSync('admin123', 10);
    db.prepare("INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)").run(
      'admin', 'admin@ipibaee.com', hash
    );
    console.log('[DB] Default admin created: admin / admin123');
  }

  // Seed profile
  const profileExists = db.prepare("SELECT id FROM profile LIMIT 1").get();
  if (!profileExists) {
    db.prepare(`
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
    `).run(
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
    );
    console.log('[DB] Profile data seeded');
  }

  // Seed projects
  const projectsExist = db.prepare("SELECT id FROM projects LIMIT 1").get();
  if (!projectsExist) {
    const insertProject = db.prepare(`
      INSERT INTO projects (title, category, description, details, image_url, demo_url, github_url, tags, featured, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const seedProjects = db.transaction(() => {
      insertProject.run(
        "Motocare - Sistem Bengkel & Booking Servis", "Web App",
        "Sistem web manajemen bengkel modern terintegrasi dengan booking online servis motor, inventaris suku cadang, dan invoice digital.",
        "Aplikasi Motocare dibangun untuk mempermudah operasional bengkel servis motor. Fitur mencakup sistem antrian real-time, pencatatan histori servis kendaraan, pengingat jadwal servis berkala via WhatsApp, dan laporan keuangan komprehensif.",
        "/portfolio-assets/img/portfolio/portfolio-1.jpg",
        "https://motocare.ipibaee.com", "https://github.com/ipibaee/motocare",
        "PHP, Laravel, Tailwind CSS, MySQL", 1, 1
      );
      insertProject.run(
        "Sistem Informasi & E-Commerce Toko", "Website",
        "Website toko online responsif dilengkapi dengan katalog produk interaktif, keranjang belanja dinamis, dan checkout via WhatsApp.",
        "Platform penjualan online modern yang dirancang untuk UMKM. Dilengkapi manajemen stok, pencarian produk cepat, dan tampilan mobile-first.",
        "/portfolio-assets/img/portfolio/portfolio-2.jpg",
        "https://shop.ipibaee.com", "https://github.com/ipibaee",
        "Next.js, React, Tailwind, SQLite", 1, 2
      );
      insertProject.run(
        "Creative Visual Branding & UI Studio", "Design",
        "Koleksi desain identitas brand visual, prototipe aplikasi mobile modern, ikonografi kustom, dan materi promosi digital.",
        "Proyek perancangan visual komprehensif mencakup brand guidelines, logo vector, tipografi terstruktur, serta prototipe UI/UX interaktif.",
        "/portfolio-assets/img/portfolio/portfolio-3.jpg",
        "#", "https://github.com/ipibaee",
        "Figma, Adobe Photoshop, UI/UX", 1, 3
      );
      insertProject.run(
        "Company Profile Interaktif & Animasi", "Website",
        "Website profil perusahaan profesional dengan animasi transisi 3D, particle efek, dan optimasi SEO tingkat lanjut.",
        "Website showcase korporat yang responsif dengan loading cepat, integrasi Google Maps, formulir penawaran harga dinamis, dan animasi visual menarik.",
        "/portfolio-assets/img/portfolio/portfolio-4.jpg",
        "#", "https://github.com/ipibaee",
        "HTML5, CSS3, JavaScript, GSAP", 0, 4
      );
    });
    seedProjects();
    console.log('[DB] Projects seeded');
  }

  // Seed menu_links
  const menuExist = db.prepare("SELECT id FROM menu_links LIMIT 1").get();
  if (!menuExist) {
    const insertMenu = db.prepare(`
      INSERT INTO menu_links (label, url, badge, icon, is_external, is_active, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const seedMenu = db.transaction(() => {
      insertMenu.run("Motocare 🏍️", "https://motocare.ipibaee.com", "Featured App", "Wrench", 1, 1, 1);
      insertMenu.run("GitHub Profile", "https://github.com/ipibaee", "Open Source", "Github", 1, 1, 2);
      insertMenu.run("WhatsApp Saya", "https://wa.me/62895638714471", "Chat", "MessageCircle", 1, 1, 3);
    });
    seedMenu();
    console.log('[DB] Menu links seeded');
  }

  // Seed skills
  const skillsExist = db.prepare("SELECT id FROM skills LIMIT 1").get();
  if (!skillsExist) {
    const insertSkill = db.prepare(`
      INSERT INTO skills (name, category, percentage, order_index) VALUES (?, ?, ?, ?)
    `);
    const seedSkills = db.transaction(() => {
      insertSkill.run("HTML & CSS", "Frontend", 95, 1);
      insertSkill.run("JavaScript / TypeScript", "Frontend", 88, 2);
      insertSkill.run("React / Next.js", "Frontend", 85, 3);
      insertSkill.run("Tailwind CSS", "Frontend", 92, 4);
      insertSkill.run("PHP / Laravel", "Backend", 80, 5);
      insertSkill.run("Node.js / Express", "Backend", 78, 6);
      insertSkill.run("MySQL / SQLite", "Database", 82, 7);
      insertSkill.run("Figma / UI Design", "Design", 88, 8);
    });
    seedSkills();
    console.log('[DB] Skills seeded');
  }

  // Seed experiences
  const expExist = db.prepare("SELECT id FROM experiences LIMIT 1").get();
  if (!expExist) {
    const insertExp = db.prepare(`
      INSERT INTO experiences (type, title, period, institution, description, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const seedExp = db.transaction(() => {
      insertExp.run("experience", "Web Developer & UI Designer Freelance", "2022 - Sekarang", "Freelance / Remote", "Mengerjakan berbagai proyek website dan aplikasi web untuk klien UMKM, startup, dan individu di seluruh Indonesia.", 1);
      insertExp.run("experience", "Front-End Developer", "2023 - 2024", "Proyek Kolaborasi Tim", "Membangun antarmuka web interaktif dengan React, Tailwind CSS, dan animasi modern untuk beberapa proyek tim.", 2);
      insertExp.run("education", "SMK Teknologi Informasi", "2020 - 2023", "SMK N 1 Bawang, Banjarnegara", "Jurusan Rekayasa Perangkat Lunak (RPL). Mempelajari dasar-dasar pemrograman, web development, dan basis data.", 3);
    });
    seedExp();
    console.log('[DB] Experiences seeded');
  }

  // Seed services
  const servicesExist = db.prepare("SELECT id FROM services LIMIT 1").get();
  if (!servicesExist) {
    const insertService = db.prepare(`
      INSERT INTO services (title, description, icon, order_index) VALUES (?, ?, ?, ?)
    `);
    const seedServices = db.transaction(() => {
      insertService.run("Web Design & Development", "Membangun website modern, responsif, dan berperforma tinggi menggunakan teknologi terkini seperti Next.js, React, dan Tailwind CSS.", "Code", 1);
      insertService.run("UI/UX Design", "Merancang antarmuka pengguna yang intuitif, estetis, dan berorientasi pengalaman pengguna menggunakan Figma.", "Palette", 2);
      insertService.run("Backend & API Development", "Membangun sistem backend yang handal, RESTful API, dan manajemen database menggunakan Node.js, PHP/Laravel, dan MySQL.", "Server", 3);
      insertService.run("Branding & Visual Identity", "Menciptakan identitas brand visual yang kuat dan konsisten, termasuk logo, palet warna, tipografi, dan panduan brand.", "Layers", 4);
    });
    seedServices();
    console.log('[DB] Services seeded');
  }

  initialized = true;
  console.log('[DB] Database initialized successfully');
}

// Universal query function - synchronous untuk better-sqlite3
export function query(sql, params = []) {
  const db = getDb();
  ensureTables();

  const stmt = db.prepare(sql);
  const upper = sql.trim().toUpperCase();

  if (upper.startsWith('SELECT') || upper.startsWith('WITH')) {
    return stmt.all(...params);
  } else {
    const result = stmt.run(...params);
    return result;
  }
}

export default getDb;
