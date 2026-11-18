'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, Rocket, ChevronRight, ExternalLink } from 'lucide-react';

export default function Navbar({ profile = {}, menuLinks = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Tentang', href: '#about' },
    { label: 'Skill', href: '#skills' },
    { label: 'Projek', href: '#projects' },
    { label: 'Pengalaman', href: '#experience' },
    { label: 'Layanan', href: '#services' },
    { label: 'Kontak', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 text-base">
                MZ
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {profile.name || "Mu'amar Zulkifli"}
            </span>
            <span className="text-[10px] text-slate-400 -mt-0.5">
              {profile.title || 'Portofolio'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons: Quick Project & Admin Login */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Featured Quick Project Link (e.g. Motocare) */}
          {menuLinks.length > 0 && (
            <a
              href={menuLinks[0].url}
              target={menuLinks[0].is_external ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500 hover:to-indigo-600 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-transparent transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:shadow-[0_0_20px_rgba(0,242,254,0.4)]"
            >
              <Rocket className="w-3.5 h-3.5 animate-pulse" />
              <span>{menuLinks[0].label}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}

          {/* Admin Link */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-white/10 transition-all hover:border-cyan-500/40"
            title="Panel Admin Portofolio"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-slate-900/70 border border-white/10 text-cyan-400"
            title="Admin"
          >
            <Shield className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/70 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 p-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-cyan-400 transition-colors"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </a>
            ))}

            {/* Mobile Project Shortcuts */}
            {menuLinks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold px-1">
                  Akses Projek Langsung:
                </span>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {menuLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target={link.is_external ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-white/5"
                    >
                      <span className="flex items-center gap-2">
                        <Rocket className="w-3.5 h-3.5" />
                        {link.label}
                      </span>
                      {link.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-white/10">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-cyan-500/30 text-cyan-300"
              >
                <Shield className="w-4 h-4" />
                <span>Panel Pengaturan Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
