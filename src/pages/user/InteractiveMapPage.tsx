import React, { useState } from 'react';
import {
  Layers,
  Navigation,
  Search,
  Bookmark,
  Share2,
  Info,
  MapPin,
  Compass,
  ArrowLeft,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FloorPlanMap } from '../../components/map/FloorPlanMap';
import { FloorSwitcher } from '../../components/map/FloorSwitcher';
import { NavigationPanel } from '../../components/navigation/NavigationPanel';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Room } from '../../types';

export const InteractiveMapPage: React.FC = () => {
  const {
    selectedBlock,
    selectedFloor,
    rooms,
    setSelectedRoom,
    isNavigating,
    startNavigationToRoom,
    setUserView,
    setIsSearchOpen,
    activeRoute,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showRoomDrawer, setShowRoomDrawer] = useState(false);

  // Floor rooms
  const currentFloorRooms = rooms.filter(
    (r) => r.blockId === selectedBlock.id && r.floorId === selectedFloor.id
  );

  const filteredRooms = currentFloorRooms.filter((r) => {
    if (activeCategoryFilter === 'all') return true;
    return r.type.toLowerCase() === activeCategoryFilter.toLowerCase();
  });

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumb />

        {/* Quick buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Search This Floor</span>
          </button>

          <button
            type="button"
            onClick={() => setUserView('campus')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Campus Overview</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Floor Switcher + Directory Sidebar (Desktop) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
          {/* Vertical Floor Switcher */}
          <FloorSwitcher orientation="vertical" />

          {/* Room Directory List on Current Floor */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col max-h-[460px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rooms on {selectedFloor.name}
              </h3>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
                {currentFloorRooms.length} spaces
              </span>
            </div>

            {/* Room filters */}
            <div className="flex items-center gap-1 py-2 overflow-x-auto text-[11px]">
              {['all', 'Classroom', 'Laboratory', 'Office'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeCategoryFilter === cat
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Room list items */}
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 pt-1">
              {filteredRooms.map((room) => {
                const isTarget = activeRoute?.targetRoom?.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isTarget
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 font-bold'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{room.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400">
                        {room.type} · Cap: {room.capacity}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startNavigationToRoom(room);
                      }}
                      className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 dark:hover:bg-teal-500 text-teal-700 dark:text-teal-400 hover:text-white transition-colors"
                      title="Route here"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center / Floor Plan Vector Canvas */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Mobile Floor Switcher */}
          <div className="lg:hidden">
            <FloorSwitcher orientation="horizontal" />
          </div>

          {/* Interactive Canvas */}
          <div className="relative h-[480px] sm:h-[580px] w-full">
            <FloorPlanMap interactive={true} onRoomClick={handleRoomClick} />
          </div>

          {/* Mobile Drawer Trigger for Room List */}
          <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Explore {currentFloorRooms.length} rooms on this floor
            </span>
            <button
              type="button"
              onClick={() => setShowRoomDrawer(!showRoomDrawer)}
              className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-lg"
            >
              {showRoomDrawer ? 'Hide Rooms' : 'View Room List'}
            </button>
          </div>

          {showRoomDrawer && (
            <div className="lg:hidden bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 max-h-60 overflow-y-auto">
              {currentFloorRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{room.name}</span>
                    <span className="text-slate-400 ml-2">({room.type})</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startNavigationToRoom(room);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px]"
                  >
                    Direct
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right / Turn-by-Turn Directions Panel (or Destination Helper) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {isNavigating && activeRoute ? (
            <NavigationPanel />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ready to Navigate?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Click any room on the floor blueprint, or pick from popular spaces below to launch live turn-by-turn indoor routing.
                </p>
              </div>

              {/* Demo target quick start button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const aiLab = rooms.find((r) => r.id === 'rm-204');
                    if (aiLab) startNavigationToRoom(aiLab);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Route to AI Lab (Room 204)</span>
                </button>
              </div>

              {/* Tips */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Interactive Tips</span>
                </div>
                <div>• Drag map to pan across corridors</div>
                <div>• Use + / - to zoom into classroom doors</div>
                <div>• Switch floors using the floor panel</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
