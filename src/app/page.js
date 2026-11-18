import { getPortfolioData } from '@/lib/data';
import Navbar from '@/components/Navbar';
import InteractiveCursor from '@/components/InteractiveCursor';
import InteractiveBackground from '@/components/InteractiveBackground';
import TypedText from '@/components/TypedText';
import TiltCard from '@/components/TiltCard';
import QuickProjectMenu from '@/components/QuickProjectMenu';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import ContactForm from '@/components/ContactForm';
import {
  Code,
  Palette,
  Server,
  Layers,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  ExternalLink,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  Shield,
  CheckCircle,
  ChevronUp
} from 'lucide-react';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '@/components/BrandIcons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { profile, projects, menuLinks, skills, experiences, services } = await getPortfolioData();

  const typedItems = profile.tagline
    ? profile.tagline.split(',').map((t) => t.trim()).filter(Boolean)
    : ['Designer', 'Developer', 'Freelancer', 'Photographer'];

  const educationList = experiences.filter((e) => e.type === 'education');
  const experienceList = experiences.filter((e) => e.type !== 'education');

  const serviceIconMap = {
    Code: Code,
    Palette: Palette,
    Server: Server,
    Layers: Layers
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Interactive Cursor follower for desktop mouse */}
      <InteractiveCursor />

      {/* Interactive Particle Starfield Canvas */}
      <InteractiveBackground />

      {/* Top Floating Navbar */}
      <Navbar profile={profile} menuLinks={menuLinks} />

      <main className="relative z-10">
        {/* ==================== HERO SECTION ==================== */}
        <section
          id="hero"
          className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Subtle glow orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto w-full text-center flex flex-col items-center">
            {/* Profile Avatar with 3D Tilt */}
            <TiltCard className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 shadow-[0_0_40px_rgba(0,242,254,0.35)] mb-8">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-slate-950">
                <img
                  src={profile.avatar_url || '/portfolio-assets/img/profile-img.jpg'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </TiltCard>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,254,0.15)] mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>{profile.freelance_status || 'Tersedia untuk Projek & Kerjasama'}</span>
            </div>

            {/* Main Greeting & Name */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
              Halo, Saya{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                {profile.name || "Mu'amar Zulkifli"}
              </span>
            </h1>

            {/* Animated Typing Title */}
            <div className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-300 mb-6 flex flex-wrap items-center justify-center gap-2">
              <span>I am a</span>
              <TypedText items={typedItems} />
            </div>

            {/* Headline Subtitle */}
            <p className="max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
              {profile.headline || 'Desainer & Teknisi Web Modern'}.{' '}
              {profile.about_text?.slice(0, 140)}...
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] hover:-translate-y-0.5 transition-all"
              >
                <span>Jelajahi Projek Saya</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {menuLinks.length > 0 && (
                <a
                  href={menuLinks[0].url}
                  target={menuLinks[0].is_external ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.15)] hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Buka {menuLinks[0].label}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:-translate-y-0.5 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Hubungi Saya</span>
              </a>
            </div>

            {/* Social Icons Bar */}
            <div className="flex items-center gap-3">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all hover:scale-110"
                  title="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profile.whatsapp_url && (
                <a
                  href={profile.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all hover:scale-110"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {profile.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-pink-400 hover:border-pink-500/40 transition-all hover:scale-110"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-sky-400 hover:border-sky-500/40 transition-all hover:scale-110"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Quick Project Access Menu Component */}
            <QuickProjectMenu links={menuLinks} />
          </div>
        </section>

        {/* ==================== ABOUT SECTION ==================== */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Tentang Saya
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Profil &amp; Dedikasi Digital
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Photo & Badges */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <TiltCard className="w-full max-w-sm rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-3">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 relative">
                  <img
                    src={profile.avatar_url || '/portfolio-assets/img/profile-img.jpg'}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                      {profile.headline || 'Desainer & Teknisi'}
                    </span>
                    <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Right Information & Bio */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span>{profile.headline || 'Desainer & Teknisi Komputer'}</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {profile.about_text}
              </p>

              {/* User Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-400 block">Tanggal Lahir:</span>
                    <span className="font-semibold text-white">{profile.birthday || '6 Agustus 2004'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-400 block">Kota Domisili:</span>
                    <span className="font-semibold text-white">{profile.city || 'Banjarnegara, JATENG'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-400 block">Telepon / WhatsApp:</span>
                    <span className="font-semibold text-white">{profile.phone || '+62 895638714471'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-400 block">Email:</span>
                    <span className="font-semibold text-white">{profile.email || 'ipibaee@gmail.com'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-400 block">Website:</span>
                    <span className="font-semibold text-white">{profile.website || 'www.ipibaee.com'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="text-xs">
                    <span className="text-slate-400 block">Bidang Keahlian:</span>
                    <span className="font-semibold text-white">{profile.degree || 'Teknologi & Informatika'}</span>
                  </div>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    230+
                  </span>
                  <span className="text-xs text-slate-400">Klien Puas</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    50+
                  </span>
                  <span className="text-xs text-slate-400">Projek Selesai</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    1450+
                  </span>
                  <span className="text-xs text-slate-400">Jam Dukungan</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                    100%
                  </span>
                  <span className="text-xs text-slate-400">Dedikasi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SKILLS SECTION ==================== */}
        <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Keahlian &amp; Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Kemampuan Teknis
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">{skill.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                      {skill.category || 'Tech'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {skill.percentage}%
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-600 transition-all duration-1000 shadow-[0_0_12px_rgba(0,242,254,0.5)]"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== PROJECTS SHOWCASE SECTION ==================== */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Karya &amp; Portofolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Projek yang Telah Dibuat
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Termasuk aplikasi web sistem manajemen servis Motocare, e-commerce, dan desain antarmuka interaktif.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 mx-auto mt-4 rounded-full" />
          </div>

          <ProjectsShowcase projects={projects} />
        </section>

        {/* ==================== EXPERIENCE & EDUCATION SECTION ==================== */}
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Perjalanan Karir
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Pengalaman &amp; Pendidikan
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Experience Column */}
            <div>
              <div className="flex items-center gap-2.5 mb-6 text-cyan-400">
                <Briefcase className="w-5 h-5" />
                <h3 className="text-xl font-bold text-white">Pengalaman Kerja</h3>
              </div>

              <div className="space-y-6 border-l-2 border-cyan-500/30 pl-5 ml-2">
                {experienceList.map((exp) => (
                  <div key={exp.id} className="relative group">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f2fe]" />
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {exp.period}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-400 mb-2">{exp.institution}</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Column */}
            <div>
              <div className="flex items-center gap-2.5 mb-6 text-indigo-400">
                <GraduationCap className="w-5 h-5" />
                <h3 className="text-xl font-bold text-white">Pendidikan</h3>
              </div>

              <div className="space-y-6 border-l-2 border-indigo-500/30 pl-5 ml-2">
                {educationList.map((edu) => (
                  <div key={edu.id} className="relative group">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {edu.period}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                      {edu.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-400 mb-2">{edu.institution}</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SERVICES SECTION ==================== */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Spesialisasi
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Layanan yang Disediakan
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => {
              const IconComp = serviceIconMap[srv.icon] || Code;
              return (
                <TiltCard
                  key={srv.id}
                  className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                      <IconComp className="w-6 h-6 text-cyan-400 group-hover:text-black transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* ==================== CONTACT SECTION ==================== */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Koneksi &amp; Diskusi
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Hubungi Saya
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <h3 className="text-xl font-bold text-white mb-4">Mari Berdiskusi</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Tertarik membuat website, sistem aplikasi bengkel, toko online, atau konsultasi seputar server aaPanel &amp; hosting? Kirimkan pesan Anda!
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Lokasi:</span>
                    <span className="text-sm font-semibold text-white">{profile.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Email:</span>
                    <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-cyan-300 hover:underline">
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">WhatsApp:</span>
                    <a
                      href={profile.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-400 hover:underline"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              {profile.whatsapp_url && (
                <a
                  href={profile.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Langsung via WhatsApp</span>
                </a>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <h3 className="text-xl font-bold text-white mb-2">Kirim Pesan Cepat</h3>
              <p className="text-xs text-slate-400 mb-6">
                Pesan akan langsung tersimpan ke database portofolio dan dapat saya baca di panel admin.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/90 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-white">
              {profile.name} <span className="text-cyan-400">({profile.title})</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              &copy; {new Date().getFullYear()} Hak Cipta Dilindungi. Desain modern &amp; performa tinggi.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </Link>

            <a
              href="#hero"
              className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              title="Kembali ke Atas"
            >
              <ChevronUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
