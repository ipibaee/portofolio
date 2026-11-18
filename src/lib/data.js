import { query, ensureTables } from './db';

const DEFAULT_PROFILE = {
  name: "Mu'amar Zulkifli",
  title: "IPIPortofolio",
  tagline: "Designer, Developer, Freelancer, Photographer",
  headline: "Desainer & Teknisi Web Modern",
  about_text: "Halo! Saya Mu'amar Zulkifli, seorang Desainer dan Web Developer dari Banjarnegara, Jawa Tengah. Saya berfokus pada pengembangan website interaktif, modern, dan fungsional dengan antarmuka yang memukau serta performa responsif di semua perangkat.",
  birthday: "6 Agustus 2004",
  website: "www.ipibaee.com",
  phone: "+62 895638714471",
  city: "Banjarnegara, JATENG",
  age: "20",
  degree: "Informatika / Teknologi Komputer",
  email: "ipibaee@gmail.com",
  freelance_status: "Available for Projects",
  avatar_url: "/portfolio-assets/img/profile-img.jpg",
  hero_bg_url: "/portfolio-assets/img/hero-bg.jpg",
  github_url: "https://github.com/ipibaee",
  instagram_url: "https://instagram.com/ipibaee",
  linkedin_url: "https://linkedin.com/in/ipibaee",
  whatsapp_url: "https://wa.me/62895638714471"
};

export async function getPortfolioData() {
  try {
    // better-sqlite3 is synchronous - no Promise.all needed
    ensureTables();
    const profiles  = query('SELECT * FROM profile LIMIT 1');
    const projects  = query('SELECT * FROM projects ORDER BY order_index ASC, id DESC');
    const menuLinks = query('SELECT * FROM menu_links WHERE is_active = 1 ORDER BY order_index ASC, id ASC');
    const skills    = query('SELECT * FROM skills ORDER BY order_index ASC, id ASC');
    const experiences = query('SELECT * FROM experiences ORDER BY order_index ASC, id ASC');
    const services  = query('SELECT * FROM services ORDER BY order_index ASC, id ASC');

    const profile = (profiles && profiles[0]) || DEFAULT_PROFILE;

    return {
      profile,
      projects:    projects    || [],
      menuLinks:   menuLinks   || [],
      skills:      skills      || [],
      experiences: experiences || [],
      services:    services    || []
    };
  } catch (error) {
    console.error('[data.js] Error fetching portfolio data:', error);
    return {
      profile: DEFAULT_PROFILE,
      projects:    [],
      menuLinks:   [],
      skills:      [],
      experiences: [],
      services:    []
    };
  }
}
