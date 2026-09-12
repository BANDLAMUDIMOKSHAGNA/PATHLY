import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Users, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';

export const AdminRooms: React.FC = () => {
  const { rooms, blocks, floors, addRoom, updateRoom, deleteRoom, selectedBlock, setSelectedRoom } = useApp();
  const [search, setSearch] = useState('');
  const [filterBlockId, setFilterBlockId] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [blockId, setBlockId] = useState('blk-cse');
  const [floorId, setFloorId] = useState('fl-cse-2');
  const [floorLevel, setFloorLevel] = useState(2);
  const [type, setType] = useState<Room['type']>('Classroom');
  const [capacity, setCapacity] = useState(60);
  const [accessibility, setAccessibility] = useState<'Wheelchair Accessible' | 'Standard Stairs Access'>('Wheelchair Accessible');
  const [status, setStatus] = useState<Room['status']>('Available');
  const [description, setDescription] = useState('');

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = filterBlockId === 'all' || r.blockId === filterBlockId;
    return matchesSearch && matchesBlock;
  });

  const openAddModal = () => {
    setEditingRoom(null);
    setName('');
    setCode('');
    setBlockId(selectedBlock.id);
    setFloorId('fl-cse-2');
    setFloorLevel(2);
    setType('Classroom');
    setCapacity(60);
    setAccessibility('Wheelchair Accessible');
    setStatus('Available');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setName(room.name);
    setCode(room.code);
    setBlockId(room.blockId);
    setFloorId(room.floorId);
    setFloorLevel(room.floorLevel);
    setType(room.type);
    setCapacity(room.capacity);
    setAccessibility(room.accessibility);
    setStatus(room.status);
    setDescription(room.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom.id, {
        name,
        code,
        blockId,
        floorId,
        floorLevel,
        type,
        capacity,
        accessibility,
        status,
        description,
      });
    } else {
      addRoom({
        collegeId: 'col-1',
        buildingId: 'bld-eng',
        blockId,
        floorId,
        name,
        code,
        floorLevel,
        type,
        capacity,
        accessibility,
        status,
        description,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
        coordinates: { x: 50, y: 15, width: 14, height: 18 },
        doorLocation: { x: 57, y: 33 },
        nearbyPlaces: [
          { name: 'Staircase', type: 'Stairs', distance: '15 m' },
          { name: 'Restroom', type: 'Restroom', distance: '20 m' },
        ],
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Room & Space Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage classrooms, labs, offices, restrooms, elevators, and points of interest.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code (e.g. 204), or type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Block:</label>
          <select
            value={filterBlockId}
            onChange={(e) => setFilterBlockId(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500 bg-white"
          >
            <option value="all">All Blocks</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Room & Code</th>
                <th className="py-3.5 px-4">Block & Floor</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Accessibility</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRooms.map((room) => {
                const block = blocks.find((b) => b.id === room.blockId);
                return (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                          {room.code}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{room.name}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{room.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-medium text-slate-900">{block?.name || 'Academic Block'}</span>
                      <div className="text-[11px] text-slate-400">Floor {room.floorLevel}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                        {room.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{room.capacity} seats</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{room.accessibility}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{room.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(room)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Edit Room"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete ${room.name}?`)) {
                              deleteRoom(room.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete Room"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingRoom ? 'Edit Room / Facility' : 'Add New Room / Space'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AI Lab"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room Code / Number</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. 204"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Block</label>
                  <select
                    value={blockId}
                    onChange={(e) => setBlockId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  >
                    {blocks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={floorLevel}
                    onChange={(e) => setFloorLevel(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Office">Office</option>
                    <option value="Restroom">Restroom</option>
                    <option value="Stairs">Stairs</option>
                    <option value="Elevator">Elevator</option>
                    <option value="Cafe">Cafe / Food</option>
                    <option value="Facility">General Facility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Accessibility</label>
                  <select
                    value={accessibility}
                    onChange={(e: any) => setAccessibility(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="Wheelchair Accessible">Wheelchair Accessible</option>
                    <option value="Standard Stairs Access">Standard Stairs Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Facility features, equipment, purpose..."
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
                  {editingRoom ? 'Save Changes' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
