'use client';

import { ExternalLink, Rocket, Sparkles, Wrench, ShoppingBag, Palette, Globe, Layers } from 'lucide-react';

const iconMap = {
  Rocket: Rocket,
  Sparkles: Sparkles,
  Wrench: Wrench,
  ShoppingBag: ShoppingBag,
  Palette: Palette,
  Globe: Globe,
  Layers: Layers
};

export default function QuickProjectMenu({ links = [] }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="w-full my-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <Rocket className="h-5 w-5 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                Akses Cepat Projek Unggulan
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Menu Langsung
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Klik untuk langsung mencoba aplikasi &amp; web yang telah dibuat
            </p>
          </div>
        </div>

        {/* Buttons List */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
          {links.map((link) => {
            const IconComponent = iconMap[link.icon] || Rocket;
            const isExternal = Boolean(link.is_external);

            return (
              <a
                key={link.id}
                href={link.url}
                target={isExternal ? '_blank' : '_self'}
                rel={isExternal ? 'noopener noreferrer' : ''}
                className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-600 text-slate-200 hover:text-white border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <IconComponent className="h-4 w-4 text-cyan-400 group-hover:text-white transition-colors" />
                <span className="font-semibold">{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 group-hover:bg-black/30 text-cyan-300 group-hover:text-white transition-colors">
                    {link.badge}
                  </span>
                )}
                {isExternal && (
                  <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
