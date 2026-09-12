import React from 'react';
import { Twitter, Linkedin, Instagram, Youtube, Shield } from 'lucide-react';
import { PathlyLogo } from '../common/PathlyLogo';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setUserView, setIsAdminMode } = useApp();

  const handleNavClick = (target: string) => {
    setIsAdminMode(false);
    if (target === 'home') {
      setUserView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'buildings') {
      setUserView('buildings');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'features') {
      setUserView('home');
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (target === 'about') {
      setUserView('home');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer id="pathly-footer" className="bg-[#0b0f19] text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        {/* Top Row: Logo & Mission, Center Links, Social Icons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          {/* Left: Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <PathlyLogo size="md" variant="white" showTagline={true} onClick={() => handleNavClick('home')} />
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-slate-400">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('buildings')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Buildings
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setIsAdminMode(true)}
              className="inline-flex items-center gap-1 hover:text-teal-400 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right: Social Media Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#twitter"
              title="Twitter"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500 hover:text-teal-400 flex items-center justify-center text-slate-400 transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#linkedin"
              title="LinkedIn"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500 hover:text-teal-400 flex items-center justify-center text-slate-400 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#instagram"
              title="Instagram"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500 hover:text-teal-400 flex items-center justify-center text-slate-400 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#youtube"
              title="YouTube"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500 hover:text-teal-400 flex items-center justify-center text-slate-400 transition-all"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Row: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Pathly. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className="hover:text-slate-400 transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className="hover:text-slate-400 transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className="hover:text-slate-400 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

