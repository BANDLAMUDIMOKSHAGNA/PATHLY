import React from 'react';
import { Compass, Building, Layers, Shield, User, LogIn } from 'lucide-react';
import { useApp, UserView } from '../../context/AppContext';
import { authStore } from '../../data/authStore';

export const MobileBottomNav: React.FC = () => {
  const {
    userView,
    setUserView,
    isAdminMode,
    setIsAdminMode,
    currentUser,
  } = useApp();

  const isAdminUser = Boolean(currentUser && authStore.isUserAdmin(currentUser as any));

  const navItems: Array<{
    id: UserView | 'admin' | 'auth';
    label: string;
    icon: React.ReactNode;
    action: () => void;
    isActive: boolean;
  }> = [
    {
      id: 'home',
      label: 'Home',
      icon: <Compass className="w-5 h-5" />,
      action: () => {
        setIsAdminMode(false);
        setUserView('home');
        window.history.pushState({}, '', '/');
      },
      isActive: !isAdminMode && userView === 'home',
    },
    {
      id: 'buildings',
      label: 'Buildings',
      icon: <Building className="w-5 h-5" />,
      action: () => {
        setIsAdminMode(false);
        setUserView('buildings');
        window.history.pushState({}, '', '/buildings');
      },
      isActive: !isAdminMode && (userView === 'buildings' || userView === 'campus' || userView === 'block'),
    },
    {
      id: 'map',
      label: 'Live Map',
      icon: <Layers className="w-5 h-5" />,
      action: () => {
        setIsAdminMode(false);
        setUserView('map');
      },
      isActive: !isAdminMode && userView === 'map',
    },
    {
      id: 'admin',
      label: isAdminUser ? (isAdminMode ? 'Exit Admin' : 'Admin') : 'Admin',
      icon: <Shield className="w-5 h-5" />,
      action: () => {
        if (!isAdminUser) {
          sessionStorage.setItem(
            'pathly_auth_redirect_msg',
            'Please sign in with administrator credentials to access facility controls.'
          );
          setUserView('auth');
          window.history.pushState({}, '', '/auth');
        } else {
          setIsAdminMode(!isAdminMode);
          if (!isAdminMode) {
            window.history.pushState({}, '', '/admin');
          } else {
            window.history.pushState({}, '', '/');
          }
        }
      },
      isActive: isAdminMode,
    },
    {
      id: 'auth',
      label: currentUser ? (currentUser.name.split(' ')[0] || 'Account') : 'Sign In',
      icon: currentUser ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />,
      action: () => {
        setIsAdminMode(false);
        setUserView('auth');
        window.history.pushState({}, '', '/auth');
      },
      isActive: !isAdminMode && userView === 'auth',
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-lg safe-area-inset-bottom"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.action}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            item.isActive
              ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <div className="p-1">{item.icon}</div>
          <span className="text-[10px] tracking-tight">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
