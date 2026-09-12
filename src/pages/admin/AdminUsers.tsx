import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Shield, Mail, Eye, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminUser, UserRole } from '../../types';

export const AdminUsers: React.FC = () => {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('College Admin');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [assignedCollege, setAssignedCollege] = useState('ABC Engineering College');

  const filteredUsers = adminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('College Admin');
    setStatus('Active');
    setAssignedCollege('ABC Engineering College');
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setAssignedCollege(user.assignedCollege || 'ABC Engineering College');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateAdminUser({
        ...editingUser,
        name,
        email,
        role,
        status,
        assignedCollege,
      });
    } else {
      addAdminUser({
        name,
        email,
        role,
        status,
        lastActive: 'Just now',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        assignedCollege,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls matching reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage admin, staff, building managers, and regular users.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search Bar matching reference */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Total Users: <strong className="text-slate-800">{filteredUsers.length}</strong>
        </div>
      </div>

      {/* Users Table matching path1.png screen 14 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 w-14">#</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u, idx) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 overflow-hidden flex items-center justify-center font-bold text-teal-800 text-xs shrink-0">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                        {u.id === currentUser?.id && (
                          <span className="text-[10px] text-teal-600 font-bold">(You)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.role === 'Super Admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : u.role === 'College Admin'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : u.role === 'Building Manager'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        title="Edit User"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => deleteAdminUser(u.id)}
                          title="Delete User"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal matching reference */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure role permissions and access levels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Reddy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@pathly.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Permission *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 bg-white"
                >
                  <option value="Super Admin">Super Admin (Full System Control)</option>
                  <option value="College Admin">College Admin (Campus Management)</option>
                  <option value="Building Manager">Building Manager (Floor & Room Editing)</option>
                  <option value="Editor">Editor (Map Points & Paths)</option>
                  <option value="User">User (Public Viewer)</option>
                </select>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Active Status</div>
                  <div className="text-[11px] text-slate-500">Enable account login access</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus(status === 'Active' ? 'Inactive' : 'Active')}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    status === 'Active' ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
