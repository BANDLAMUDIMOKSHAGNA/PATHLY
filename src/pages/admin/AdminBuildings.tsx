import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Building, Layers, MapPin, X, Check, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Building as BuildingType } from '../../types';

export const AdminBuildings: React.FC = () => {
  const { buildings, addBuilding, updateBuilding, deleteBuilding, setSelectedBuilding, setAdminView, selectedCollege } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<BuildingType | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Academic');
  const [location, setLocation] = useState('Main Campus');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [blocksCount, setBlocksCount] = useState(3);
  const [floorsCount, setFloorsCount] = useState(4);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const filteredBuildings = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.type.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingBuilding(null);
    setName('');
    setType('Academic');
    setLocation('Main Campus');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80');
    setBlocksCount(3);
    setFloorsCount(4);
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (bld: BuildingType) => {
    setEditingBuilding(bld);
    setName(bld.name);
    setType(bld.type);
    setLocation(bld.location);
    setDescription(bld.description);
    setImage(bld.image);
    setBlocksCount(bld.blocksCount || 3);
    setFloorsCount(bld.floorsCount || 4);
    setStatus(bld.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuilding) {
      updateBuilding({
        ...editingBuilding,
        name,
        type,
        location,
        description,
        image,
        blocksCount,
        floorsCount,
        status,
      });
    } else {
      addBuilding({
        collegeId: selectedCollege?.id || 'col-1',
        name,
        type,
        location,
        description,
        image,
        blocksCount,
        floorsCount,
        roomsCount: blocksCount * floorsCount * 10,
        status,
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
            Buildings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage buildings in your college campus and facilities.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Building</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buildings..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Total: <strong className="text-slate-800">{filteredBuildings.length}</strong> buildings
        </div>
      </div>

      {/* Buildings Table matching path1.png screen 5 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 w-14">#</th>
                <th className="px-6 py-3.5">Building Name</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Blocks</th>
                <th className="px-6 py-3.5">Floors</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBuildings.map((bld, idx) => (
                <tr key={bld.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={bld.image}
                          alt={bld.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{bld.name}</div>
                        <div className="text-[11px] text-slate-400">{bld.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {bld.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{bld.blocksCount || 3}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{bld.floorsCount || 4}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        bld.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          bld.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {bld.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBuilding(bld);
                          setAdminView('blocks');
                        }}
                        title="View Blocks"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(bld)}
                        title="Edit Building"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBuilding(bld.id)}
                        title="Delete Building"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

      {/* Add / Edit Building Modal matching path1.png screen 6 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingBuilding ? 'Edit Building' : 'Add Building'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the details to configure the building.
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
                  Building Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE Block, Main Block"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Building Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Sports & Recreational">Sports & Recreational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location Area
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. North Campus"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Blocks
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={blocksCount}
                    onChange={(e) => setBlocksCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={floorsCount}
                    onChange={(e) => setFloorsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details about this building..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Status Switch matching reference */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Building Active Status</div>
                  <div className="text-[11px] text-slate-500">Allow navigation inside this building</div>
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
                  {editingBuilding ? 'Save Changes' : 'Add Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
