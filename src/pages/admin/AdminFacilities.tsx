import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Coffee, Store, MapPin, Eye, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Facility, FacilityType } from '../../types';

export const AdminFacilities: React.FC = () => {
  const { facilities, buildings, floors, addFacility, updateFacility, deleteFacility, selectedBuilding } = useApp();
  const [search, setSearch] = useState('');
  const [filterBuildingId, setFilterBuildingId] = useState<string>(selectedBuilding?.id || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<FacilityType>('Canteen');
  const [buildingId, setBuildingId] = useState(selectedBuilding?.id || buildings[0]?.id || 'bld-main');
  const [floorLevel, setFloorLevel] = useState(0);
  const [location, setLocation] = useState('Ground Floor');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [openingHours, setOpeningHours] = useState('8:00 AM - 8:00 PM');
  const [status, setStatus] = useState<'Active' | 'Temporarily Closed'>('Active');

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase());
    const matchesBuilding = filterBuildingId === 'all' || f.buildingId === filterBuildingId;
    return matchesSearch && matchesBuilding;
  });

  const openAddModal = () => {
    setEditingFacility(null);
    setName('');
    setType('Canteen');
    setBuildingId(filterBuildingId !== 'all' ? filterBuildingId : buildings[0]?.id || 'bld-main');
    setFloorLevel(0);
    setLocation('Ground Floor');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80');
    setOpeningHours('8:00 AM - 8:00 PM');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (fac: Facility) => {
    setEditingFacility(fac);
    setName(fac.name);
    setType(fac.type);
    setBuildingId(fac.buildingId);
    setFloorLevel(fac.floorLevel);
    setLocation(fac.location);
    setDescription(fac.description);
    setImage(fac.image);
    setOpeningHours(fac.openingHours);
    setStatus(fac.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFacility) {
      updateFacility({
        ...editingFacility,
        name,
        type,
        buildingId,
        floorLevel,
        location,
        description,
        image,
        openingHours,
        status,
      });
    } else {
      addFacility({
        name,
        type,
        buildingId,
        blockId: 'blk-cse',
        floorId: 'fl-cse-0',
        floorLevel,
        location,
        description,
        image,
        openingHours,
        status,
        coordinates: { x: 50, y: 50 },
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
            Shops & Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage shops, food courts, ATMs, medical centers, and amenity points.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shop / Facility</span>
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
              placeholder="Search shops & facilities..."
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
          Total: <strong className="text-slate-800">{filteredFacilities.length}</strong> facilities
        </div>
      </div>

      {/* Facilities Table matching path1.png screen 12 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 w-14">#</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Hours</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFacilities.map((fac, idx) => (
                <tr key={fac.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={fac.image}
                          alt={fac.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{fac.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{fac.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {fac.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{fac.location}</td>
                  <td className="px-6 py-4 text-slate-500 text-[11px]">{fac.openingHours}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        fac.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          fac.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {fac.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(fac)}
                        title="Edit Facility"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFacility(fac.id)}
                        title="Delete Facility"
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

      {/* Add / Edit Facility Modal matching reference */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingFacility ? 'Edit Shop / Facility' : 'Add Shop / Facility'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure venue details, operating hours, and location.
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
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Canteen, Book Store, ATM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Facility Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as FacilityType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="Canteen">Canteen</option>
                    <option value="Food Court">Food Court</option>
                    <option value="Book Store">Book Store</option>
                    <option value="ATM">ATM</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Medical Room">Medical Room</option>
                    <option value="Gym">Gym</option>
                    <option value="Help Desk">Help Desk</option>
                    <option value="Restroom">Restroom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent Building *
                  </label>
                  <select
                    value={buildingId}
                    onChange={(e) => setBuildingId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Floor Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ground Floor, First Floor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="e.g. 8:00 AM - 8:00 PM"
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
                  placeholder="Details regarding services or menu available..."
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

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Active Status</div>
                  <div className="text-[11px] text-slate-500">Show facility on indoor maps</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus(status === 'Active' ? 'Temporarily Closed' : 'Active')}
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
                  {editingFacility ? 'Save Changes' : 'Add Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
