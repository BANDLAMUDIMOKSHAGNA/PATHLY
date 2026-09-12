import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, MapPin, Building, GraduationCap, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { College } from '../../types';

export const AdminColleges: React.FC = () => {
  const { colleges, addCollege, updateCollege, deleteCollege, setSelectedCollege, setAdminView } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState<'college' | 'mall' | 'hospital' | 'office'>('college');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const filteredColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCollege(null);
    setName('');
    setLocation('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80');
    setType('college');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (col: College) => {
    setEditingCollege(col);
    setName(col.name);
    setLocation(col.location);
    setDescription(col.description);
    setImage(col.image);
    setType(col.type);
    setStatus(col.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCollege) {
      updateCollege(editingCollege.id, {
        name,
        location,
        description,
        image,
        type,
        status,
      });
    } else {
      addCollege({
        name,
        location,
        description,
        image,
        blocksCount: 2,
        floorsCount: 4,
        roomsCount: 40,
        status,
        type,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            College & Campus Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure campuses, university complexes, shopping malls, and facilities.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus / Facility</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campuses by name or city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-teal-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredColleges.length} of {colleges.length}
        </span>
      </div>

      {/* Colleges List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Campus / Facility</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Blocks / Floors</th>
                <th className="py-3.5 px-4">Rooms</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredColleges.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{col.name}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{col.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {col.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{col.location}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-bold text-slate-800">{col.blocksCount}</span> blocks ·{' '}
                    <span className="font-bold text-slate-800">{col.floorsCount}</span> flrs
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-700">{col.roomsCount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        col.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {col.status === 'Active' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{col.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(col)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        title="Edit Campus"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete ${col.name}?`)) {
                            deleteCollege(col.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete Campus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingCollege ? 'Edit Campus / Facility' : 'Add New Campus / Facility'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ABC Engineering College"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="college">College / University</option>
                    <option value="mall">Shopping Mall</option>
                    <option value="hospital">Hospital</option>
                    <option value="office">Corporate Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location / Address</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Campus North Gate, Tech Corridor"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  {editingCollege ? 'Save Changes' : 'Create Campus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
