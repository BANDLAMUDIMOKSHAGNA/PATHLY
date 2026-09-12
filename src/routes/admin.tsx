import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { authStore } from '../data/authStore';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminColleges } from '../pages/admin/AdminColleges';
import { AdminBuildings } from '../pages/admin/AdminBuildings';
import { AdminBlocks } from '../pages/admin/AdminBlocks';
import { AdminFloors } from '../pages/admin/AdminFloors';
import { AdminRooms } from '../pages/admin/AdminRooms';
import { AdminFacilities } from '../pages/admin/AdminFacilities';
import { AdminMapEditor } from '../pages/admin/AdminMapEditor';
import { AdminGraph } from '../pages/admin/AdminGraph';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminAnalytics } from '../pages/admin/AdminAnalytics';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminSettings } from '../pages/admin/AdminSettings';
import { AdminProfile } from '../pages/admin/AdminProfile';
import { AuthPage } from './auth';

export const AdminRoute: React.FC = () => {
  const {
    currentUser,
    adminView,
    setIsAdminMode,
    setUserView,
  } = useApp();

  const isAdmin = authStore.isUserAdmin(currentUser as any);
  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      sessionStorage.setItem(
        'pathly_auth_redirect_msg',
        'Please sign in with administrator credentials to access facility controls.'
      );
    }
  }, [isAuthenticated, isAdmin]);

  // Route Guard: If not authenticated or not an admin, render AuthPage with notification
  if (!isAuthenticated || !isAdmin) {
    return (
      <AuthPage
        initialTab="signin"
        redirectMessage="Please sign in with administrator credentials to access facility controls."
        onSuccess={(user) => {
          if (authStore.isUserAdmin(user)) {
            setIsAdminMode(true);
            window.history.pushState({}, '', '/admin');
          } else {
            setIsAdminMode(false);
            setUserView('home');
            window.history.pushState({}, '', '/');
          }
        }}
      />
    );
  }

  return (
    <AdminLayout>
      {adminView === 'dashboard' && <AdminDashboard />}
      {adminView === 'colleges' && <AdminColleges />}
      {adminView === 'buildings' && <AdminBuildings />}
      {adminView === 'blocks' && <AdminBlocks />}
      {adminView === 'floors' && <AdminFloors />}
      {adminView === 'rooms' && <AdminRooms />}
      {adminView === 'facilities' && <AdminFacilities />}
      {adminView === 'editor' && <AdminMapEditor />}
      {adminView === 'paths' && <AdminGraph />}
      {adminView === 'users' && <AdminUsers />}
      {adminView === 'analytics' && <AdminAnalytics />}
      {adminView === 'reports' && <AdminReports />}
      {adminView === 'settings' && <AdminSettings />}
      {adminView === 'profile' && <AdminProfile />}
    </AdminLayout>
  );
};

export default AdminRoute;
