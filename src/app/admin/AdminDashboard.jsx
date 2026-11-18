'use client';

import { useState } from 'react';
import {
  updateProfileAction,
  saveProjectAction,
  deleteProjectAction,
  saveMenuLinkAction,
  deleteMenuLinkAction,
  saveSkillAction,
  deleteSkillAction,
  saveExperienceAction,
  deleteExperienceAction,
  saveServiceAction,
  deleteServiceAction,
  changeAdminPasswordAction,
  deleteMessageAction,
  markMessageReadAction,
  logoutAction
} from '@/app/actions';
import {
  User,
  FolderGit2,
  Rocket,
  Wrench,
  Sparkles,
  Briefcase,
  GraduationCap,
  Layers,
  Inbox,
  KeyRound,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Upload,
  Globe,
  Save,
  Shield,
  Eye,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard({
  currentUser,
  initialProfile,
  initialProjects,
  initialMenuLinks,
  initialSkills,
  initialExperiences,
  initialServices,
  initialMessages
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState(null);

  // Modal / Form states
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  const [editingMenuLink, setEditingMenuLink] = useState(null);
  const [isMenuLinkFormOpen, setIsMenuLinkFormOpen] = useState(false);

  const [editingSkill, setEditingSkill] = useState(null);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);

  const [isExpFormOpen, setIsExpFormOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileUpload = async (file, targetInputName) => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        const input = document.getElementById(targetInputName);
        if (input) {
          input.value = data.url;
          // Trigger change event if needed
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        showNotification('success', 'File gambar berhasil diunggah!');
      } else {
        showNotification('error', data.error || 'Gagal mengunggah file.');
      }
    } catch (err) {
      showNotification('error', 'Error saat unggah: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Admin Portofolio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                {currentUser.username}
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 block -mt-0.5">
              Kelola Konten &amp; Projek Langsung
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Buka Website</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </form>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-16 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/90 border-red-500/40 text-red-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-b md:border-b-0 md:border-r border-white/10 p-3 sm:p-4 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil &amp; Identitas</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Kelola Projek (CRUD)</span>
            </button>

            <button
              onClick={() => setActiveTab('menu_links')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'menu_links'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>Tombol Menu Projek</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Keahlian (Skills)</span>
            </button>

            <button
              onClick={() => setActiveTab('experiences')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'experiences'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Pengalaman &amp; Edukasi</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Layanan</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>Pesan Masuk</span>
              </div>
              {initialMessages.filter((m) => !m.is_read).length > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black font-bold text-[10px] flex items-center justify-center">
                  {initialMessages.filter((m) => !m.is_read).length}
                </span>
              )}
            </button>

            <div className="my-2 border-t border-white/10 hidden md:block" />

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Ganti Password Admin</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
          {/* ==================== TAB 1: PROFIL ==================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Profil &amp; Identitas Portofolio</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Ubah data pribadi, teks pengantar, keahlian, dan tautan sosial media Anda.
                </p>
              </div>

              <form
                action={async (formData) => {
                  const res = await updateProfileAction(null, formData);
                  if (res?.success) showNotification('success', res.success);
                  if (res?.error) showNotification('error', res.error);
                }}
                className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={initialProfile.name || "Mu'amar Zulkifli"}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Judul Website (Title)</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={initialProfile.title || 'IPIPortofolio'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Sub-Headline / Profesi Utama
                    </label>
                    <input
                      type="text"
                      name="headline"
                      defaultValue={initialProfile.headline || 'Desainer & Teknisi Web Modern'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Animasi Tagline Teks Berputar (Koma Pisah)
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      defaultValue={initialProfile.tagline || 'Designer, Developer, Freelancer, Photographer'}
                      placeholder="Designer, Developer, Freelancer, Photographer"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tentang Saya (Bio)</label>
                  <textarea
                    name="about_text"
                    rows={4}
                    defaultValue={initialProfile.about_text || ''}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tanggal Lahir</label>
                    <input
                      type="text"
                      name="birthday"
                      defaultValue={initialProfile.birthday || '6 Agustus 2004'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Domisili / Kota</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={initialProfile.city || 'Banjarnegara, JATENG'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={initialProfile.phone || '+62 895638714471'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={initialProfile.email || 'ipibaee@gmail.com'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website Domain</label>
                    <input
                      type="text"
                      name="website"
                      defaultValue={initialProfile.website || 'www.ipibaee.com'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status Ketersediaan</label>
                    <input
                      type="text"
                      name="freelance_status"
                      defaultValue={initialProfile.freelance_status || 'Available for Projects'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Avatar Image & File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Foto Profil (URL Gambar atau Unggah Langsung)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      id="avatar_url_input"
                      type="text"
                      name="avatar_url"
                      defaultValue={initialProfile.avatar_url || '/portfolio-assets/img/profile-img.jpg'}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />

                    <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold cursor-pointer border border-white/10 whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Mengunggah...' : 'Pilih File Gambar'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], 'avatar_url_input')}
                      />
                    </label>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold text-white mb-3">Tautan Sosial Media &amp; Kontak</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">GitHub URL</label>
                      <input
                        type="text"
                        name="github_url"
                        defaultValue={initialProfile.github_url || 'https://github.com/ipibaee'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">WhatsApp Chat URL</label>
                      <input
                        type="text"
                        name="whatsapp_url"
                        defaultValue={initialProfile.whatsapp_url || 'https://wa.me/62895638714471'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        name="instagram_url"
                        defaultValue={initialProfile.instagram_url || 'https://instagram.com/ipibaee'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        name="linkedin_url"
                        defaultValue={initialProfile.linkedin_url || 'https://linkedin.com/in/ipibaee'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== TAB 2: KELOLA PROJEK (CRUD) ==================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Kelola Projek Portofolio</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Tambah, edit, dan hapus projek yang telah Anda kerjakan (seperti Motocare, web toko, dll).
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Projek Baru</span>
                </button>
              </div>

              {/* Projects Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                          {project.category}
                        </span>
                        {project.featured === 1 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4 mb-3">
                        <img
                          src={project.image_url || '/portfolio-assets/img/portfolio/portfolio-1.jpg'}
                          alt={project.title}
                          className="w-20 h-16 object-cover rounded-lg bg-slate-950 shrink-0"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white line-clamp-1">{project.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{project.description}</p>
                        </div>
                      </div>

                      {project.demo_url && (
                        <div className="text-[11px] text-cyan-300/80 truncate mb-1">
                          <strong>Demo:</strong> {project.demo_url}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5 mt-3">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setIsProjectFormOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors cursor-pointer"
                        title="Edit Projek"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Yakin ingin menghapus projek "${project.title}"?`)) {
                            const res = await deleteProjectAction(project.id);
                            if (res?.success) showNotification('success', 'Projek berhasil dihapus.');
                          }
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                        title="Hapus Projek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Form Modal */}
              {isProjectFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-white/20 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                    <button
                      onClick={() => setIsProjectFormOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h3 className="text-lg font-bold text-white mb-4">
                      {editingProject ? 'Edit Projek' : 'Tambah Projek Baru'}
                    </h3>

                    <form
                      action={async (formData) => {
                        const res = await saveProjectAction(null, formData);
                        if (res?.success) {
                          showNotification('success', res.success);
                          setIsProjectFormOpen(false);
                        } else if (res?.error) {
                          showNotification('error', res.error);
                        }
                      }}
                      className="space-y-4"
                    >
                      {editingProject && <input type="hidden" name="id" value={editingProject.id} />}

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Projek</label>
                        <input
                          type="text"
                          name="title"
                          defaultValue={editingProject?.title || ''}
                          required
                          placeholder="Contoh: Motocare - Sistem Bengkel Servis Motor"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                          <input
                            type="text"
                            name="category"
                            defaultValue={editingProject?.category || 'Web App'}
                            placeholder="Web App, Website, Design, dll"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Urutan Tampil (No)</label>
                          <input
                            type="number"
                            name="order_index"
                            defaultValue={editingProject?.order_index || 0}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Singkat</label>
                        <textarea
                          name="description"
                          rows={2}
                          defaultValue={editingProject?.description || ''}
                          required
                          placeholder="Penjelasan ringkas fungsi projek..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Detail Lengkap Projek</label>
                        <textarea
                          name="details"
                          rows={3}
                          defaultValue={editingProject?.details || ''}
                          placeholder="Penjelasan arsitektur, fitur-fitur, dan tantangan yang dipecahkan..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Link Live Demo / Web Projek (Motocare, dll)
                          </label>
                          <input
                            type="text"
                            name="demo_url"
                            defaultValue={editingProject?.demo_url || ''}
                            placeholder="https://motocare.ipibaee.com"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Link GitHub Repository
                          </label>
                          <input
                            type="text"
                            name="github_url"
                            defaultValue={editingProject?.github_url || ''}
                            placeholder="https://github.com/ipibaee/motocare"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Tag Teknologi (Pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          defaultValue={editingProject?.tags || ''}
                          placeholder="PHP, Laravel, Tailwind CSS, MySQL"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Gambar / Screenshot Projek
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="project_img_input"
                            type="text"
                            name="image_url"
                            defaultValue={editingProject?.image_url || '/portfolio-assets/img/portfolio/portfolio-1.jpg'}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-slate-200 text-xs font-medium cursor-pointer shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e.target.files?.[0], 'project_img_input')}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="featured_check"
                          name="featured"
                          defaultChecked={editingProject ? editingProject.featured === 1 : true}
                          className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-white/20"
                        />
                        <label htmlFor="featured_check" className="text-xs text-slate-300 cursor-pointer">
                          Jadikan Projek Unggulan (Tampil di Sorotan Utama)
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsProjectFormOpen(false)}
                          className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg"
                        >
                          Simpan Projek
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: TOMBOL MENU PROJEK (QUICK LINKS CRUD) ==================== */}
          {activeTab === 'menu_links' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Tombol Menu Pintas Projek (Motocare, dll)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Kelola tombol akses langsung ke projek buatan Anda yang muncul di navigasi dan banner beranda.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingMenuLink(null);
                    setIsMenuLinkFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tombol Projek</span>
                </button>
              </div>

              {/* Menu Links List */}
              <div className="space-y-3">
                {initialMenuLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{link.label}</h4>
                          {link.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                              {link.badge}
                            </span>
                          )}
                          {link.is_active === 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                              Nonaktif
                            </span>
                          )}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 hover:text-cyan-300 truncate max-w-sm block"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setEditingMenuLink(link);
                          setIsMenuLinkFormOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors cursor-pointer"
                        title="Edit Tombol"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Hapus tombol "${link.label}"?`)) {
                            const res = await deleteMenuLinkAction(link.id);
                            if (res?.success) showNotification('success', 'Tombol menu berhasil dihapus.');
                          }
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                        title="Hapus Tombol"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Menu Link Form Modal */}
              {isMenuLinkFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/20 p-6 sm:p-8">
                    <button
                      onClick={() => setIsMenuLinkFormOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h3 className="text-lg font-bold text-white mb-4">
                      {editingMenuLink ? 'Edit Tombol Projek' : 'Tambah Tombol Projek'}
                    </h3>

                    <form
                      action={async (formData) => {
                        const res = await saveMenuLinkAction(null, formData);
                        if (res?.success) {
                          showNotification('success', res.success);
                          setIsMenuLinkFormOpen(false);
                        } else if (res?.error) {
                          showNotification('error', res.error);
                        }
                      }}
                      className="space-y-4"
                    >
                      {editingMenuLink && <input type="hidden" name="id" value={editingMenuLink.id} />}

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Label Tombol (Nama Projek)
                        </label>
                        <input
                          type="text"
                          name="label"
                          defaultValue={editingMenuLink?.label || ''}
                          required
                          placeholder="Contoh: Motocare 🏍️"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          URL Tujuan (Tautan Projek)
                        </label>
                        <input
                          type="text"
                          name="url"
                          defaultValue={editingMenuLink?.url || ''}
                          required
                          placeholder="https://motocare.ipibaee.com atau #projects"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Badge / Tag</label>
                          <input
                            type="text"
                            name="badge"
                            defaultValue={editingMenuLink?.badge || ''}
                            placeholder="Featured, Live App, Hot"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Ikon</label>
                          <select
                            name="icon"
                            defaultValue={editingMenuLink?.icon || 'Rocket'}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                          >
                            <option value="Rocket">Rocket 🚀</option>
                            <option value="Wrench">Wrench 🔧 (Bengkel/Teknis)</option>
                            <option value="ShoppingBag">ShoppingBag 🛍️ (Toko)</option>
                            <option value="Palette">Palette 🎨 (Desain)</option>
                            <option value="Globe">Globe 🌐 (Web)</option>
                            <option value="Layers">Layers 📑 (Aplikasi)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="is_external_check"
                          name="is_external"
                          defaultChecked={editingMenuLink ? editingMenuLink.is_external === 1 : true}
                          className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-white/20"
                        />
                        <label htmlFor="is_external_check" className="text-xs text-slate-300 cursor-pointer">
                          Buka di Tab Baru (External Link)
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsMenuLinkFormOpen(false)}
                          className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg"
                        >
                          Simpan Tombol
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: KEAHLIAN / SKILLS ==================== */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Kelola Keahlian (Skills)</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Atur daftar kemampuan teknologi dan persentase penguasaan.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setIsSkillFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Skill Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex-1 mr-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-white text-sm">{s.name}</span>
                        <span className="text-xs font-mono font-bold text-cyan-300">{s.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600"
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setIsSkillFormOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus skill ${s.name}?`)) {
                            const res = await deleteSkillAction(s.id);
                            if (res?.success) showNotification('success', 'Skill berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skill Form Modal */}
              {isSkillFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-white/20 p-6">
                    <button
                      onClick={() => setIsSkillFormOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h3 className="text-base font-bold text-white mb-4">
                      {editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}
                    </h3>

                    <form
                      action={async (formData) => {
                        const res = await saveSkillAction(null, formData);
                        if (res?.success) {
                          showNotification('success', res.success);
                          setIsSkillFormOpen(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      {editingSkill && <input type="hidden" name="id" value={editingSkill.id} />}

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Nama Skill</label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={editingSkill?.name || ''}
                          required
                          placeholder="HTML, Next.js, PHP, dll"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Kategori</label>
                        <input
                          type="text"
                          name="category"
                          defaultValue={editingSkill?.category || 'Frontend'}
                          placeholder="Frontend, Backend, Design, dll"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Persentase Penguasaan (1 - 100%)</label>
                        <input
                          type="number"
                          name="percentage"
                          min="1"
                          max="100"
                          defaultValue={editingSkill?.percentage || 85}
                          required
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsSkillFormOpen(false)}
                          className="px-3 py-1.5 text-xs text-slate-400"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black"
                        >
                          Simpan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 5: PENGALAMAN & EDUKASI ==================== */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Riwayat Pengalaman &amp; Pendidikan</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Kelola linimasa karir dan latar belakang pendidikan Anda.
                  </p>
                </div>

                <button
                  onClick={() => setIsExpFormOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Riwayat Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {initialExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-white/10 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-white/10 text-cyan-300">
                          {exp.type}
                        </span>
                        <span className="text-xs text-slate-400">{exp.period}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                      <p className="text-xs text-slate-400">{exp.institution}</p>
                      <p className="text-xs text-slate-300 mt-2">{exp.description}</p>
                    </div>

                    <button
                      onClick={async () => {
                        if (confirm(`Hapus "${exp.title}"?`)) {
                          const res = await deleteExperienceAction(exp.id);
                          if (res?.success) showNotification('success', 'Riwayat berhasil dihapus.');
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Experience Form Modal */}
              {isExpFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/20 p-6">
                    <button
                      onClick={() => setIsExpFormOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h3 className="text-base font-bold text-white mb-4">Tambah Pengalaman / Pendidikan</h3>

                    <form
                      action={async (formData) => {
                        const res = await saveExperienceAction(null, formData);
                        if (res?.success) {
                          showNotification('success', res.success);
                          setIsExpFormOpen(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Tipe</label>
                        <select
                          name="type"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                        >
                          <option value="experience">Pengalaman Kerja</option>
                          <option value="education">Pendidikan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Judul / Posisi</label>
                        <input
                          type="text"
                          name="title"
                          required
                          placeholder="Fullstack Web Developer, SMK, dll"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Periode Waktu</label>
                          <input
                            type="text"
                            name="period"
                            placeholder="2022 - Sekarang"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Instansi / Perusahaan</label>
                          <input
                            type="text"
                            name="institution"
                            placeholder="PT / Freelance / Sekolah"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Deskripsi Singkat</label>
                        <textarea
                          name="description"
                          rows={3}
                          placeholder="Ringkasan tugas atau pencapaian..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsExpFormOpen(false)}
                          className="px-3 py-1.5 text-xs text-slate-400"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black"
                        >
                          Simpan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 6: LAYANAN ==================== */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Kelola Layanan yang Ditawarkan</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Atur kartu layanan seperti Web Dev, UI/UX, Setup Server aaPanel, dll.
                  </p>
                </div>

                <button
                  onClick={() => setIsServiceFormOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Layanan Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-xl bg-slate-900/70 border border-white/10 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">{srv.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{srv.description}</p>
                    </div>

                    <button
                      onClick={async () => {
                        if (confirm(`Hapus layanan "${srv.title}"?`)) {
                          const res = await deleteServiceAction(srv.id);
                          if (res?.success) showNotification('success', 'Layanan berhasil dihapus.');
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Service Form Modal */}
              {isServiceFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/20 p-6">
                    <button
                      onClick={() => setIsServiceFormOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <h3 className="text-base font-bold text-white mb-4">Tambah Layanan Baru</h3>

                    <form
                      action={async (formData) => {
                        const res = await saveServiceAction(null, formData);
                        if (res?.success) {
                          showNotification('success', res.success);
                          setIsServiceFormOpen(false);
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Nama Layanan</label>
                        <input
                          type="text"
                          name="title"
                          required
                          placeholder="Web Development, Setup Server aaPanel, dll"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Deskripsi Layanan</label>
                        <textarea
                          name="description"
                          rows={3}
                          required
                          placeholder="Jelaskan apa yang Anda kerjakan dalam layanan ini..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Pilihan Ikon</label>
                        <select
                          name="icon"
                          defaultValue="Code"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                        >
                          <option value="Code">Code (Koding &amp; Web)</option>
                          <option value="Palette">Palette (Desain &amp; UI)</option>
                          <option value="Server">Server (VPS &amp; aaPanel)</option>
                          <option value="Layers">Layers (Sistem Aplikasi)</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsServiceFormOpen(false)}
                          className="px-3 py-1.5 text-xs text-slate-400"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black"
                        >
                          Simpan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 7: PESAN MASUK (INBOX) ==================== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Pesan Pengunjung</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Pesan yang dikirimkan melalui formulir kontak di website portofolio.
                </p>
              </div>

              {initialMessages.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-white/10 text-slate-400">
                  <Inbox className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-50" />
                  <p className="text-sm">Belum ada pesan yang masuk.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {initialMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        msg.is_read
                          ? 'bg-slate-900/50 border-white/5 opacity-80'
                          : 'bg-slate-900 border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.1)]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{msg.name}</span>
                          <span className="text-xs text-cyan-300 font-mono">&lt;{msg.email}&gt;</span>
                          {!msg.is_read && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500 text-black font-bold">
                              Baru
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{msg.created_at}</span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-300 mb-1">
                        Subjek: <span className="text-white">{msg.subject || '-'}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 my-2">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <a
                          href={`mailto:${msg.email}?subject=Balasan: ${encodeURIComponent(msg.subject || 'Portofolio')}`}
                          className="text-xs text-cyan-400 hover:underline"
                        >
                          Balas via Email &rarr;
                        </a>

                        <div className="flex items-center gap-2">
                          {!msg.is_read && (
                            <button
                              onClick={async () => {
                                await markMessageReadAction(msg.id);
                                showNotification('success', 'Pesan ditandai terbaca.');
                              }}
                              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5"
                            >
                              Tandai Terbaca
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm('Hapus pesan ini?')) {
                                await deleteMessageAction(msg.id);
                                showNotification('success', 'Pesan berhasil dihapus.');
                              }
                            }}
                            className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-500/10"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 8: GANTI PASSWORD ADMIN ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Ganti Password &amp; Akun Admin</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Ubah password bawaan (<strong>admin123</strong>) atau username login admin Anda.
                </p>
              </div>

              <form
                action={async (formData) => {
                  const res = await changeAdminPasswordAction(null, formData);
                  if (res?.success) {
                    showNotification('success', res.success);
                  } else if (res?.error) {
                    showNotification('error', res.error);
                  }
                }}
                className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password Saat Ini (Wajib Konfirmasi)
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    placeholder="Masukkan password saat ini (bawaan: admin123)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-white/5">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username Admin Baru</label>
                  <input
                    type="text"
                    name="newUsername"
                    defaultValue={currentUser.username}
                    placeholder="Username login"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Admin Baru</label>
                  <input
                    type="email"
                    name="newEmail"
                    defaultValue={currentUser.email}
                    placeholder="admin@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password Baru (Kosongkan jika tidak ingin mengubah password)
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Ulangi Password Baru
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Ulangi password baru"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black shadow-lg transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Perbarui Akun &amp; Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
