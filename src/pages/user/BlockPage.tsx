import React from 'react';
import { Layers, Building, Navigation, Bookmark, ArrowRight, Beaker, BookOpen, Coffee, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Room, Floor } from '../../types';

export const BlockPage: React.FC = () => {
  const {
    selectedCollege,
    selectedBlock,
    floors,
    rooms,
    setSelectedFloor,
    setSelectedRoom,
    startNavigationToRoom,
    setUserView,
  } = useApp();

  const blockFloors = floors
    .filter((f) => f.blockId === selectedBlock.id)
    .sort((a, b) => a.level - b.level);

  const blockRooms = rooms.filter((r) => r.blockId === selectedBlock.id);

  // Popular destinations highlighted in Section 6
  const popularDestinations = [
    { name: 'AI Lab (Room 204)', type: 'Laboratory', floor: '2nd Floor', roomId: 'rm-204' },
    { name: 'Classroom 101', type: 'Classroom', floor: '1st Floor', roomId: 'rm-101' },
    { name: 'Classroom 103', type: 'Classroom', floor: '1st Floor', roomId: 'rm-103' },
    { name: 'Systems & Networks Lab 1', type: 'Laboratory', floor: '2nd Floor', roomId: 'rm-lab1' },
    { name: 'CSE Faculty Room', type: 'Office', floor: '2nd Floor', roomId: 'rm-fac' },
    { name: 'Restrooms (M/F)', type: 'Restroom', floor: '2nd Floor', roomId: 'rm-rr-2' },
    { name: 'Central Passenger Elevator', type: 'Elevator', floor: '2nd Floor', roomId: 'rm-elev-2' },
  ];

  const handleSelectFloor = (floor: Floor) => {
    setSelectedFloor(floor);
    setUserView('map');
  };

  const handleSelectDestination = (destRoomId: string) => {
    const targetRoom = rooms.find((r) => r.id === destRoomId);
    if (targetRoom) {
      startNavigationToRoom(targetRoom);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Block Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 opacity-25">
          <img
            src={selectedBlock.image}
            alt={selectedBlock.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Building className="w-3.5 h-3.5" />
            <span>Academic Department Block</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {selectedBlock.name}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {selectedBlock.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-slate-300">
            <div>
              <span className="text-slate-400">Floors:</span>{' '}
              <strong className="text-white font-bold">{selectedBlock.floorsCount} Levels</strong>
            </div>
            <div>
              <span className="text-slate-400">Classrooms & Labs:</span>{' '}
              <strong className="text-white font-bold">{selectedBlock.roomsCount} Rooms</strong>
            </div>
            <div>
              <span className="text-slate-400">Status:</span>{' '}
              <strong className="text-teal-400 font-bold">Open for Navigation</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Select Floor
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Open interactive blueprints for any floor level.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blockFloors.map((floor) => (
            <div
              key={floor.id}
              onClick={() => handleSelectFloor(floor)}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-black text-sm flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    {floor.level === 0 ? 'GF' : `${floor.level}F`}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {floor.mapStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {floor.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {floor.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {floor.roomsCount} Rooms · {floor.facilitiesCount} Facilities
                </span>
                <span className="text-teal-600 dark:text-teal-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                  View Map →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Quickly launch route guidance to frequently visited spaces in {selectedBlock.name}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularDestinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectDestination(dest.roomId)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50/30 dark:hover:bg-slate-800/60 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-100 dark:group-hover:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center transition-colors">
                  {dest.type === 'Laboratory' ? (
                    <Beaker className="w-5 h-5" />
                  ) : dest.type === 'Classroom' ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {dest.name}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{dest.floor}</span>
                    <span>·</span>
                    <span className="text-teal-600 dark:text-teal-400">{dest.type}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 group-hover:bg-teal-600 text-teal-700 dark:text-teal-400 group-hover:text-white flex items-center justify-center transition-colors"
                title="Get Directions"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
