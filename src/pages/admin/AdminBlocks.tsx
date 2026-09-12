import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, Building, Eye, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Block } from '../../types';

export const AdminBlocks: React.FC = () => {
  const { blocks, buildings, addBlock, updateBlock, deleteBlock, setSelectedBlock, setAdminView, selectedBuilding } = useApp();
  const [search, setSearch] = useState('');
  const [filterBuildingId, setFilterBuildingId] = useState<string>(selectedBuilding?.id || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [buildingId, setBuildingId] = useState(selectedBuilding?.id || (buildings[0]?.id ?? 'bld-cse'));
  const [floorsCount, setFloorsCount] = useState(4);
  const [roomsCount, setRoomsCount] = useState(45);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const filteredBlocks = blocks.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    const matchesBuilding = filterBuildingId === 'all' || b.buildingId === filterBuildingId;
    return matchesSearch && matchesBuilding;
  });

  const openAddModal = () => {
    setEditingBlock(null);
    setName('');
    setBuildingId(filterBuildingId !== 'all' ? filterBuildingId : buildings[0]?.id || 'bld-cse');
    setFloorsCount(4);
    setRoomsCount(45);
    setDescription('');
    setImage('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (blk: Block) => {
    setEditingBlock(blk);
    setName(blk.name);
    setBuildingId(blk.buildingId);
    setFloorsCount(blk.floorsCount);
    setRoomsCount(blk.roomsCount);
    setDescription(blk.description);
    setImage(blk.image);
    setStatus(blk.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlock) {
      updateBlock({
        ...editingBlock,
        name,
        buildingId,
        floorsCount,
        roomsCount,
        description,
        image,
        status,
      });
    } else {
      addBlock({
        collegeId: 'col-1',
        buildingId,
        name,
        description,
        image,
        floorsCount,
        roomsCount,
        importantFacilities: ['Labs', 'Classrooms', 'Restrooms'],
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
            Blocks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage blocks and departmental wings in your buildings.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Block</span>
        </button>
      </div>

      {/* Filter & Search Bar matching reference */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blocks..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden md:inline">Select Building:</span>
            <select
              value={filterBuildingId}
              onChange={(e) => setFilterBuildingId(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
            >
              <option value="all">All Buildings</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing <strong className="text-slate-800">{filteredBlocks.length}</strong> blocks
        </div>
      </div>

      {/* Blocks Table matching path1.png screen 7 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 w-14">#</th>
                <th className="px-6 py-3.5">Block Name</th>
                <th className="px-6 py-3.5">Parent Building</th>
                <th className="px-6 py-3.5">Floors</th>
                <th className="px-6 py-3.5">Rooms</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBlocks.map((blk, idx) => {
                const parentBld = buildings.find((b) => b.id === blk.buildingId);
                return (
                  <tr key={blk.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={blk.image}
                            alt={blk.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{blk.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{blk.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        {parentBld?.name || 'Main Block'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{blk.floorsCount}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{blk.roomsCount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          blk.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            blk.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {blk.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBlock(blk);
                            setAdminView('floors');
                          }}
                          title="View Floors"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(blk)}
                          title="Edit Block"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBlock(blk.id)}
                          title="Delete Block"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Block Modal matching path1.png screen 8 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingBlock ? 'Edit Block' : 'Add Block'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the details to add or edit a building block.
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
                  Block Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE Block A, Mechanical Wing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Parent Building *
                </label>
                <select
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 bg-white"
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={floorsCount}
                    onChange={(e) => setFloorsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
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
                  placeholder="Departmental facilities, labs, and faculty zones..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Active Status</div>
                  <div className="text-[11px] text-slate-500">Enable routing through this block</div>
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
                  {editingBlock ? 'Save Changes' : 'Add Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
