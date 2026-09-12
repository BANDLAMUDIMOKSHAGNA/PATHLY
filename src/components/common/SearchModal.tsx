import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Navigation, ArrowRight, BookOpen, Coffee, Beaker, Building, Laptop } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room, Facility } from '../../types';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    rooms,
    facilities,
    blocks,
    startNavigationToRoom,
    startNavigationToFacility,
    setSelectedRoom,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredRooms = rooms.filter((r) => {
    if (!normalizedQuery) return false;
    const blk = blocks.find((b) => b.id === r.blockId)?.name || '';
    return (
      r.name.toLowerCase().includes(normalizedQuery) ||
      r.code.toLowerCase().includes(normalizedQuery) ||
      r.type.toLowerCase().includes(normalizedQuery) ||
      blk.toLowerCase().includes(normalizedQuery)
    );
  });

  const filteredFacilities = facilities.filter((f) => {
    if (!normalizedQuery) return false;
    return (
      f.name.toLowerCase().includes(normalizedQuery) ||
      f.type.toLowerCase().includes(normalizedQuery) ||
      f.location.toLowerCase().includes(normalizedQuery)
    );
  });

  const popularSearches = [
    { name: 'AI Lab', type: 'Laboratory', block: 'CSE Block · 2nd Floor', room: rooms.find((r) => r.id === 'rm-204') },
    { name: 'Classroom 103', type: 'Classroom', block: 'CSE Block · 1st Floor', room: rooms.find((r) => r.id === 'rm-103') },
    { name: 'Campus Central Canteen', type: 'Food Court', block: 'Food Court · Ground Floor', facility: facilities[0] },
    { name: 'Restrooms', type: 'Facility', block: 'CSE Block · 2nd Floor', room: rooms.find((r) => r.id === 'rm-rr-2') },
    { name: 'University Book Store', type: 'Shop', block: 'Main Block · Ground Floor', facility: facilities[1] },
    { name: 'North Central Elevator', type: 'Elevator', block: 'CSE Block · 2nd Floor', room: rooms.find((r) => r.id === 'rm-elev-2') },
  ];

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laboratory':
        return <Beaker className="w-4 h-4 text-sky-600" />;
      case 'canteen':
      case 'food court':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'classroom':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'elevator':
      case 'stairs':
        return <Building className="w-4 h-4 text-purple-600" />;
      default:
        return <Laptop className="w-4 h-4 text-teal-600" />;
    }
  };

  const handleSelectRoom = (room: Room) => {
    setIsSearchOpen(false);
    startNavigationToRoom(room);
  };

  const handleSelectFacility = (fac: Facility) => {
    setIsSearchOpen(false);
    startNavigationToFacility(fac);
  };

  const handleViewRoomInfo = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setIsSearchOpen(false);
    setSelectedRoom(room);
  };

  return (
    <div
      id="search-modal-backdrop"
      onClick={() => setIsSearchOpen(false)}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 p-4 animate-in fade-in duration-150"
    >
      <div
        id="search-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a building, room, shop or facility... (e.g. AI Lab, Room 204)"
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Popular Destinations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {popularSearches.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (item.room) handleSelectRoom(item.room);
                      else if (item.facility) handleSelectFacility(item.facility);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-700 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        {getIconForType(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-900 dark:group-hover:text-teal-400 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.block}</div>
                      </div>
                    </div>
                    <Navigation className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : filteredRooms.length === 0 && filteredFacilities.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-base font-medium text-slate-700 dark:text-slate-300">No destinations found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try searching for &ldquo;AI Lab&rdquo;, &ldquo;204&rdquo;, &ldquo;Classroom&rdquo;, or &ldquo;Canteen&rdquo;</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRooms.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Rooms & Labs ({filteredRooms.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredRooms.map((room) => {
                      const block = blocks.find((b) => b.id === room.blockId);
                      return (
                        <div
                          key={room.id}
                          onClick={() => handleSelectRoom(room)}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50/40 dark:hover:bg-slate-800/70 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                              {getIconForType(room.type)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-800 dark:group-hover:text-teal-400">
                                  {room.name}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                  {room.type}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span>{block?.name || 'Academic Block'}</span>
                                <span>·</span>
                                <span>Floor {room.floorLevel}</span>
                                <span>·</span>
                                <span className="text-emerald-600 dark:text-emerald-400">{room.accessibility}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleViewRoomInfo(e, room)}
                              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectRoom(room)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Route</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredFacilities.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Shops & Facilities ({filteredFacilities.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredFacilities.map((fac) => (
                      <div
                        key={fac.id}
                        onClick={() => handleSelectFacility(fac)}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/40 dark:hover:bg-slate-800/70 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                            {getIconForType(fac.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400">
                                {fac.name}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-medium">
                                {fac.type}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{fac.location}</span>
                              <span>·</span>
                              <span>{fac.openingHours}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectFacility(fac)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg shadow-2xs transition-colors shrink-0"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Route</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <span className="text-teal-700 dark:text-teal-400 font-medium">From Entrance to Exact Door</span>
          </div>
          <span className="font-mono text-[11px]">Pathly Indoor Engine v2.4</span>
        </div>
      </div>
    </div>
  );
};
