import React from 'react';
import { Bookmark, Navigation, Trash2, MapPin, Layers, Sparkles, Building, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export const SavedRoomsPage: React.FC = () => {
  const {
    savedRoomIds,
    rooms,
    blocks,
    buildings,
    toggleSaveRoom,
    startNavigationToRoom,
    setSelectedRoom,
    setUserView,
  } = useApp();

  const savedRooms = rooms.filter((r) => savedRoomIds.includes(r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Saved Spaces</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Locations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
            Quick access to your favorite classrooms, offices, labs, and cafeteria spots.
          </p>
        </div>

        {savedRooms.length > 0 && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {savedRooms.length} {savedRooms.length === 1 ? 'place saved' : 'places saved'}
          </span>
        )}
      </div>

      {/* Saved List or Empty State */}
      {savedRooms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Saved Places Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            While exploring campus floor plans or clicking rooms, tap the bookmark icon to save frequent destinations for instant one-tap navigation.
          </p>
          <button
            type="button"
            onClick={() => setUserView('map')}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Explore Floor Maps</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedRooms.map((room) => {
            const block = blocks.find((b) => b.id === room.blockId);
            const building = buildings.find((b) => b.id === room.buildingId);

            return (
              <div
                key={room.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600 transition-all flex flex-col justify-between group"
              >
                {/* Room Image */}
                <div className="relative h-40 w-full bg-slate-900">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {room.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSaveRoom(room.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-red-500 text-white transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>
                        {block?.name || 'Academic Block'} · Floor {room.floorLevel}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => startNavigationToRoom(room)}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
