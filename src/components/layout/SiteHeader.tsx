import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Shield,
  LogOut,
  Sun,
  Moon,
  LogIn,
  User,
  Bookmark,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PathlyLogo } from '../common/PathlyLogo';
import { authStore } from '../../data/authStore';
import { Badge } from '../ui/badge';

export const SiteHeader: React.FC = () => {
  const {
    userView,
    setUserView,
    isAdminMode,
    setIsAdminMode,
    setAdminView,
    setIsSearchOpen,
    theme,
    toggleTheme,
    currentUser,
    logout,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (target: string) => {
    setIsAdminMode(false);
    if (target === 'home') {
      setUserView('home');
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'buildings') {
      setUserView('buildings');
      window.history.pushState({}, '', '/buildings');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'features') {
      if (userView !== 'home') {
        setUserView('home');
        window.history.pushState({}, '', '/');
        setTimeout(() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (target === 'about') {
      if (userView !== 'home') {
        setUserView('home');
        window.history.pushState({}, '', '/');
        setTimeout(() => {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (target === 'auth') {
      setUserView('auth' as any);
      window.history.pushState({}, '', '/auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenAuth = () => {
    setUserView('auth' as any);
    window.history.pushState({}, '', '/auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsDropdownOpen(false);
    if (currentUser && authStore.isUserAdmin(currentUser as any)) {
      setIsAdminMode(true);
      window.history.pushState({}, '', '/admin');
    } else {
      sessionStorage.setItem(
        'pathly_auth_redirect_msg',
        'Please sign in with administrator credentials to access facility controls.'
      );
      setUserView('auth' as any);
      window.history.pushState({}, '', '/auth');
    }
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    authStore.logout();
    logout();
    setUserView('home');
    setIsAdminMode(false);
    window.history.pushState({}, '', '/');
  };

  const isAdmin = Boolean(currentUser && authStore.isUserAdmin(currentUser as any));

  // Determine badge variant
  const getBadgeVariant = (roleName?: string) => {
    const r = (roleName || '').toLowerCase();
    if (r.includes('admin')) return 'admin';
    if (r.includes('student')) return 'student';
    if (r.includes('faculty')) return 'faculty';
    if (r.includes('staff')) return 'staff';
    return 'secondary';
  };

  return (
    <header
      id="pathly-public-navbar"
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <PathlyLogo
            size="md"
            showTagline={false}
            onClick={() => handleNavClick('home')}
          />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`relative py-5 transition-colors cursor-pointer ${
              !isAdminMode && userView === 'home'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
            {!isAdminMode && userView === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('buildings')}
            className={`relative py-5 transition-colors cursor-pointer ${
              !isAdminMode && userView === 'buildings'
                ? 'text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Buildings
            {!isAdminMode && userView === 'buildings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('features')}
            className="py-5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className="py-5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Search Icon */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Search indoor destinations"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Facility Controls / Admin Button (Quick link for facility operators) */}
          <button
            type="button"
            onClick={handleOpenAdmin}
            title={isAdmin ? 'Facility Management Controls' : 'Admin Login Required'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Admin</span>
          </button>

          {/* ================= USER AUTH SECTION ================= */}
          {currentUser && (
            /* Logged In: User avatar dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="user-avatar-dropdown-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 sm:pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
                aria-expanded={isDropdownOpen}
              >
                {/* Avatar with image or initials fallback */}
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-teal-500/30 shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{currentUser.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                    {currentUser.role}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  id="user-avatar-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {/* User details header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {currentUser.email}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge variant={getBadgeVariant(currentUser.role)}>
                        {currentUser.role}
                      </Badge>
                      <span className="text-[10px] text-slate-400">· KITS Campus</span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={handleOpenAdmin}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>Facility Admin Console</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setUserView('saved');
                        window.history.pushState({}, '', '/saved');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-amber-500" />
                      <span>Saved Rooms & Venues</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (isAdmin) {
                          setIsAdminMode(true);
                          setAdminView('profile');
                          window.history.pushState({}, '', '/admin');
                        } else {
                          setUserView('saved');
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-sky-500" />
                      <span>User Profile</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  {/* Sign out */}
                  <div className="px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
