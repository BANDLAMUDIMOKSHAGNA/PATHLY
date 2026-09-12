import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { SearchModal } from './components/common/SearchModal';
import { RoomDetailModal } from './components/common/RoomDetailModal';
import { AuthModal } from './components/common/AuthModal';

// User Pages
import { HomePage } from './pages/user/HomePage';
import { BuildingsPage } from './pages/user/BuildingsPage';
import { CampusPage } from './pages/user/CampusPage';
import { BlockPage } from './pages/user/BlockPage';
import { InteractiveMapPage } from './pages/user/InteractiveMapPage';
import { SavedRoomsPage } from './pages/user/SavedRoomsPage';

// Routes
import { AuthPage } from './routes/auth';
import { AdminRoute } from './routes/admin';

const MainContent: React.FC = () => {
  const {
    userView,
    setUserView,
    isAdminMode,
    setIsAdminMode,
    setIsSearchOpen,
    currentUser,
  } = useApp();

  // URL Path synchronization
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const path = window.location.pathname;
      if (path === '/auth') {
        setIsAdminMode(false);
        setUserView('auth');
      } else if (path === '/admin') {
        setIsAdminMode(true);
      } else if (path === '/buildings') {
        setIsAdminMode(false);
        setUserView('buildings');
      } else if (path === '/saved') {
        setIsAdminMode(false);
        setUserView('saved');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, [setIsAdminMode, setUserView]);

  // Keyboard shortcut Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // Admin Portal Mode (guarded by AdminRoute)
  if (isAdminMode) {
    return <AdminRoute />;
  }

  // Public User Navigation Mode
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 md:pb-0 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {userView === 'auth' && <AuthPage />}
        {userView === 'home' && <HomePage />}
        {userView === 'buildings' && <BuildingsPage />}
        {userView === 'campus' && <CampusPage />}
        {userView === 'block' && <BlockPage />}
        {userView === 'map' && <InteractiveMapPage />}
        {userView === 'saved' && <SavedRoomsPage />}
      </main>

      <Footer />
      <MobileBottomNav />

      {/* Global Modals */}
      <SearchModal />
      <RoomDetailModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

