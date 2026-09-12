import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Building,
  Layers,
  MapPin,
  Coffee,
  GitFork,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Map,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp, AdminView } from '../../context/AppContext';
import { PathlyLogo } from '../common/PathlyLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminView,
    setAdminView,
    setIsAdminMode,
    currentUser,
    logout,
    colleges,
    selectedCollege,
    setSelectedCollege,
    theme,
    toggleTheme,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation items from reference images (path1.png & path2.png)
  const navItems: Array<{ id: AdminView; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'colleges', label: 'Colleges', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'buildings', label: 'Buildings', icon: <Building className="w-4 h-4" /> },
    { id: 'blocks', label: 'Blocks', icon: <Layers className="w-4 h-4" /> },
    { id: 'floors', label: 'Floors', icon: <Layers className="w-4 h-4" /> },
    { id: 'rooms', label: 'Rooms', icon: <MapPin className="w-4 h-4" /> },
    { id: 'facilities', label: 'Shops & Facilities', icon: <Coffee className="w-4 h-4" /> },
    { id: 'editor', label: 'Floor Map Editor', icon: <Map className="w-4 h-4" /> },
    { id: 'paths', label: 'Paths', icon: <GitFork className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelectNav = (view: AdminView) => {
    setAdminView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div id="pathly-admin-layout" className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <PathlyLogo
            size="sm"
            variant="white"
            showTagline={false}
            onClick={() => {
              handleSelectNav('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Institution Selector matching path1.png screen 2 */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200">
            <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={selectedCollege?.id}
              onChange={(e) => {
                const found = colleges.find((c) => c.id === e.target.value);
                if (found) setSelectedCollege(found);
              }}
              aria-label="Select Campus or Institution"
              className="bg-transparent border-none text-xs font-bold text-white focus:outline-hidden cursor-pointer"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* User profile button */}
          <button
            type="button"
            onClick={() => setAdminView('profile')}
            className="flex items-center gap-2 pl-3 border-l border-slate-800 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white">{currentUser?.name || 'Administrator'}</div>
              <div className="text-[10px] text-teal-400 font-medium">{currentUser?.role || 'Super Admin'}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={logout}
            title="Sign Out of Admin"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop matching path1.png screen 2 */}
        <aside className="hidden lg:flex w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col justify-between p-3.5 overflow-y-auto transition-colors">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1 mb-1">
              Campus Navigation
            </div>
            {navItems.map((item) => {
              const isActive = adminView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                        isActive ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar: Admin Profile Card matching path1.png */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setAdminView('profile')}
              className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left cursor-pointer ${
                adminView === 'profile'
                  ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                  {currentUser?.role || 'Super Admin'}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Console</span>
            </button>
          </div>
        </aside>

        {/* Mobile Menu Backdrop & Drawer */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-full p-4 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Admin Navigation</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-4 h-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" />
                  </button>
                </div>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                      adminView === item.id
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdminMode(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit Admin Portal</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
