import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Key, CheckCircle2, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminProfile: React.FC = () => {
  const { currentUser, updateAdminUser } = useApp();
  const [name, setName] = useState(currentUser?.name || 'Campus Administrator');
  const [email, setEmail] = useState(currentUser?.email || 'admin@pathly.io');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateAdminUser({
        ...currentUser,
        name,
        email,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header matching reference */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal credentials, contact details, and security preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile information updated successfully.</span>
        </div>
      )}

      {/* Main Profile Card matching path1.png screen 18 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        {/* Avatar banner */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <button
              type="button"
              title="Change Avatar"
              className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentUser?.name || 'Administrator'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                {currentUser?.role || 'Super Admin'}
              </span>
              <span className="text-xs text-slate-400">· Pathly Campus Engine</span>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-slate-500" />
              <span>Change Password</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enter your new secure account password.</p>

            {passwordSuccess ? (
              <div className="py-6 text-center text-xs font-bold text-emerald-700 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <span>Password updated successfully!</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                  >
                    Save Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
