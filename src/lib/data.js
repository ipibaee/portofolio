import { query } from './db';

export async function getPortfolioData() {
  try {
    const [
      profiles,
      projects,
      menuLinks,
      skills,
      experiences,
      services
    ] = await Promise.all([
      query('SELECT * FROM profile LIMIT 1'),
      query('SELECT * FROM projects ORDER BY order_index ASC, id DESC'),
      query('SELECT * FROM menu_links WHERE is_active = 1 ORDER BY order_index ASC, id ASC'),
      query('SELECT * FROM skills ORDER BY order_index ASC, id ASC'),
      query('SELECT * FROM experiences ORDER BY order_index ASC, id ASC'),
      query('SELECT * FROM services ORDER BY order_index ASC, id ASC')
    ]);

    const profile = (profiles && profiles[0]) || {
      name: "Mu'amar Zulkifli",
      title: "IPIPortofolio",
      tagline: "Designer, Developer, Freelancer, Photographer",
      headline: "Desainer & Teknisi Web Modern",
      about_text: "Halo! Saya Mu'amar Zulkifli, seorang Desainer dan Web Developer dari Banjarnegara. Berpengalaman dalam menciptakan website interaktif, modern, dan fungsional dengan antarmuka yang memukau dan performa tinggi.",
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

    return {
      profile,
      projects: projects || [],
      menuLinks: menuLinks || [],
      skills: skills || [],
      experiences: experiences || [],
      services: services || []
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return {
      profile: {
        name: "Mu'amar Zulkifli",
        title: "IPIPortofolio",
        tagline: "Designer, Developer, Freelancer, Photographer",
        headline: "Desainer & Teknisi Web Modern",
        about_text: "Web Developer & Designer",
        birthday: "6 Agustus 2004",
        website: "www.ipibaee.com",
        phone: "+62 895638714471",
        city: "Banjarnegara, JATENG",
        age: "20",
        degree: "Informatika",
        email: "ipibaee@gmail.com",
        freelance_status: "Available",
        avatar_url: "/portfolio-assets/img/profile-img.jpg",
        hero_bg_url: "/portfolio-assets/img/hero-bg.jpg",
        github_url: "https://github.com/ipibaee",
        instagram_url: "https://instagram.com/ipibaee",
        linkedin_url: "https://linkedin.com/in/ipibaee",
        whatsapp_url: "https://wa.me/62895638714471"
      },
      projects: [],
      menuLinks: [],
      skills: [],
      experiences: [],
      services: []
    };
  }
}
