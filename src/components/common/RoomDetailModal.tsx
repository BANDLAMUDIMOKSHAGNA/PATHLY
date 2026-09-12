import React from 'react';
import { X, Navigation, Bookmark, BookmarkCheck, Users, Building, ShieldCheck, MapPin, Layers, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';

export const RoomDetailModal: React.FC = () => {
  const {
    selectedRoom,
    setSelectedRoom,
    blocks,
    buildings,
    startNavigationToRoom,
    toggleSaveRoom,
    isRoomSaved,
    rooms,
  } = useApp();

  if (!selectedRoom) return null;

  const block = blocks.find((b) => b.id === selectedRoom.blockId);
  const building = buildings.find((b) => b.id === selectedRoom.buildingId);
  const isSaved = isRoomSaved(selectedRoom.id);

  const handleStartNav = () => {
    const r = selectedRoom;
    setSelectedRoom(null);
    startNavigationToRoom(r);
  };

  const handleSelectNearby = (nearbyName: string) => {
    const foundRoom = rooms.find(
      (r) =>
        r.name.toLowerCase().includes(nearbyName.toLowerCase()) ||
        r.code.toLowerCase().includes(nearbyName.toLowerCase())
    );
    if (foundRoom) {
      setSelectedRoom(foundRoom);
    }
  };

  return (
    <div
      id="room-detail-modal-backdrop"
      onClick={() => setSelectedRoom(null)}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        id="room-detail-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Image */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900">
          <img
            src={selectedRoom.image}
            alt={selectedRoom.name}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedRoom(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Title */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/90 text-white backdrop-blur-md">
                {selectedRoom.type}
              </span>
              <span className="text-xs text-teal-200 font-medium">
                {selectedRoom.status}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {selectedRoom.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-0.5">
              <span>{block?.name || 'Academic Block'}</span>
              <span>·</span>
              <span>Floor {selectedRoom.floorLevel}</span>
              <span>·</span>
              <span>{building?.name || 'Main Campus'}</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Capacity</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedRoom.capacity} People</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Floor Level</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {selectedRoom.floorLevel === 0 ? 'Ground' : `${selectedRoom.floorLevel}nd Floor`}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 text-center">
              <div className="flex items-center justify-center text-slate-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Accessibility</div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate">
                {selectedRoom.accessibility === 'Wheelchair Accessible' ? 'Wheelchair OK' : selectedRoom.accessibility}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">About This Space</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {selectedRoom.description}
            </p>
          </div>

          {/* Nearby Locations */}
          {selectedRoom.nearbyPlaces && selectedRoom.nearbyPlaces.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nearby Places (Walking Distance)
                </h3>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">On this corridor</span>
              </div>
              <div className="space-y-1.5">
                {selectedRoom.nearbyPlaces.map((place, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectNearby(place.name)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                          {place.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{place.type}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {place.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleSaveRoom(selectedRoom.id)}
            className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-sm font-semibold shrink-0 ${
              isSaved
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleStartNav}
            className="flex-1 py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
