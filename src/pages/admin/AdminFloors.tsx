import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, MapPin, Eye, X, Map, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Floor } from '../../types';

export const AdminFloors: React.FC = () => {
  const { floors, blocks, addFloor, updateFloor, deleteFloor, setSelectedFloor, setAdminView, selectedBlock } = useApp();
  const [filterBlockId, setFilterBlockId] = useState<string>(selectedBlock?.id || 'blk-cse');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);

  // Form states
  const [level, setLevel] = useState(0);
  const [name, setName] = useState('Ground Floor');
  const [description, setDescription] = useState('Labs, Classrooms');
  const [blockId, setBlockId] = useState(selectedBlock?.id || 'blk-cse');
  const [roomsCount, setRoomsCount] = useState(12);
  const [facilitiesCount, setFacilitiesCount] = useState(3);
  const [mapStatus, setMapStatus] = useState<Floor['mapStatus']>('Configured');

  const filteredFloors = floors
    .filter((f) => filterBlockId === 'all' || f.blockId === filterBlockId)
    .sort((a, b) => a.level - b.level);

  const openAddModal = () => {
    setEditingFloor(null);
    setLevel(filteredFloors.length);
    setName(`${filteredFloors.length === 0 ? 'Ground' : filteredFloors.length + (filteredFloors.length === 1 ? 'st' : filteredFloors.length === 2 ? 'nd' : filteredFloors.length === 3 ? 'rd' : 'th')} Floor`);
    setDescription('Classrooms & Staff Rooms');
    setBlockId(filterBlockId !== 'all' ? filterBlockId : blocks[0]?.id || 'blk-cse');
    setRoomsCount(10);
    setFacilitiesCount(2);
    setMapStatus('Configured');
    setIsModalOpen(true);
  };

  const openEditModal = (floor: Floor) => {
    setEditingFloor(floor);
    setLevel(floor.level);
    setName(floor.name);
    setDescription(floor.description);
    setBlockId(floor.blockId);
    setRoomsCount(floor.roomsCount);
    setFacilitiesCount(floor.facilitiesCount);
    setMapStatus(floor.mapStatus);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFloor) {
      updateFloor({
        ...editingFloor,
        level,
        name,
        description,
        blockId,
        roomsCount,
        facilitiesCount,
        mapStatus,
      });
    } else {
      addFloor({
        buildingId: 'bld-cse',
        blockId,
        level,
        name,
        description,
        roomsCount,
        facilitiesCount,
        mapStatus,
        width: 1000,
        height: 700,
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
            Floors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage floors in a block and configure floor level blueprints.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Floor</span>
        </button>
      </div>

      {/* Filter Bar matching path1.png screen 9 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Select Block:</span>
          <select
            value={filterBlockId}
            onChange={(e) => setFilterBlockId(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
          >
            <option value="all">All Blocks</option>
            {blocks.map((blk) => (
              <option key={blk.id} value={blk.id}>
                {blk.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Total Levels: <strong className="text-slate-800">{filteredFloors.length}</strong>
        </div>
      </div>

      {/* Floors Table matching reference */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 w-16">#</th>
                <th className="px-6 py-3.5">Floor Name</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Rooms</th>
                <th className="px-6 py-3.5">Facilities</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFloors.map((flr) => (
                <tr key={flr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-500">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
                      {flr.level === 0 ? 'G' : flr.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{flr.name}</div>
                    <div className="text-[11px] text-slate-400">Level {flr.level}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 max-w-xs truncate">
                    {flr.description}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{flr.roomsCount}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{flr.facilitiesCount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        flr.mapStatus === 'Configured'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          flr.mapStatus === 'Configured' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {flr.mapStatus === 'Configured' ? 'Active' : flr.mapStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFloor(flr);
                          setAdminView('editor');
                        }}
                        title="Open Map Editor"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                      >
                        <Map className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(flr)}
                        title="Edit Floor"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFloor(flr.id)}
                        title="Delete Floor"
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

      {/* Add / Edit Floor Modal matching reference */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingFloor ? 'Edit Floor' : 'Add Floor'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure floor number, name, and blueprint layout.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Floor Level / Number *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    required
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Floor Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ground Floor, 2nd Floor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent Block *
                </label>
                <select
                  value={blockId}
                  onChange={(e) => setBlockId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 bg-white"
                >
                  {blocks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Amenities
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Labs, Classrooms, Library"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Upload Floor Plan Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Floor Plan Blueprint (SVG / PNG)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-teal-400 transition-colors bg-slate-50 cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-slate-700">Click or drag blueprint image</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">SVG, PNG, or high-res CAD export (Max 10MB)</div>
                </div>
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
                  {editingFloor ? 'Save Changes' : 'Add Floor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
