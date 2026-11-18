'use client';

import { useState } from 'react';
import TiltCard from './TiltCard';
import { ExternalLink, Sparkles, Eye, X } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

export default function ProjectsShowcase({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedProject, setSelectedProject] = useState(null);

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(projects.map((p) => p.category || 'Lainnya')))];

  const filteredProjects =
    activeCategory === 'Semua'
      ? projects
      : projects.filter((p) => (p.category || 'Lainnya') === activeCategory);

  return (
    <div id="projects" className="w-full scroll-mt-24">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(0,242,254,0.35)] scale-105'
                : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProjects.map((project) => {
          const tags = project.tags
            ? project.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : [];

          return (
            <TiltCard
              key={project.id}
              className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,242,254,0.2)] transition-all duration-300 group"
            >
              <div>
                {/* Project Image Preview */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 bg-slate-950">
                  <img
                    src={project.image_url || '/portfolio-assets/img/portfolio/portfolio-1.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                      {project.category || 'Project'}
                    </span>
                    {project.featured === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Quick preview button */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Lihat Detail Projek"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Project Title & Description */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300/80 line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {project.demo_url && project.demo_url !== '#' && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40 transition-all shadow-[0_0_12px_rgba(0,242,254,0.15)] hover:shadow-[0_0_18px_rgba(0,242,254,0.4)]"
                    >
                      <span>Buka Projek</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.github_url && project.github_url !== '#' && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      title="Lihat Source Code GitHub"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs text-slate-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                >
                  Detail
                </button>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-white/20 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-6">
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {selectedProject.category}
              </span>
              {selectedProject.featured === 1 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Featured
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">{selectedProject.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {selectedProject.details || selectedProject.description}
            </p>

            {selectedProject.tags && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Teknologi yang Digunakan
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.split(',').map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs bg-slate-800 text-cyan-300 border border-cyan-500/20"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              {selectedProject.demo_url && selectedProject.demo_url !== '#' && (
                <a
                  href={selectedProject.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:opacity-95 transition-opacity"
                >
                  <span>Kunjungi Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {selectedProject.github_url && selectedProject.github_url !== '#' && (
                <a
                  href={selectedProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}

              <button
                onClick={() => setSelectedProject(null)}
                className="ml-auto px-4 py-2.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
