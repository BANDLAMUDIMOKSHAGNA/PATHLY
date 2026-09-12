import React from 'react';
import { Layers, Building, ArrowRight, MapPin, CheckCircle2, Navigation, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampusOverviewMap } from '../../components/map/CampusOverviewMap';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Block } from '../../types';

export const CampusPage: React.FC = () => {
  const { selectedCollege, blocks, setSelectedBlock, setUserView } = useApp();

  const collegeBlocks = blocks.filter((b) => b.collegeId === selectedCollege.id);

  const handleBlockExplore = (block: Block) => {
    setSelectedBlock(block);
    setUserView('block');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* College Overview Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold">
            <Building className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Campus Overview</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {selectedCollege.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{selectedCollege.location}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {selectedCollege.description}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shrink-0 text-center">
          <div className="px-3 border-r border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-400 font-semibold">Blocks</div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">{collegeBlocks.length}</div>
          </div>
          <div className="px-3 border-r border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-400 font-semibold">Total Floors</div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedCollege.floorsCount}</div>
          </div>
          <div className="px-3">
            <div className="text-xs text-slate-400 font-semibold">Active Rooms</div>
            <div className="text-lg font-extrabold text-teal-700 dark:text-teal-400">{selectedCollege.roomsCount}</div>
          </div>
        </div>
      </div>

      {/* Visual Interactive Campus Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Interactive Campus Masterplan</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Click any block on the map or select from the cards below
          </span>
        </div>

        <CampusOverviewMap onSelectBlock={handleBlockExplore} />
      </div>

      {/* Select a Block Cards Section */}
      <div className="space-y-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Select a Block
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore departments, floor plans, and facilities within each building block.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collegeBlocks.map((block) => (
            <div
              key={block.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={block.image}
                  alt={block.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100">
                  {block.floorsCount} Floors
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {block.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {block.description}
                  </p>

                  {/* Important Facilities */}
                  {block.importantFacilities && block.importantFacilities.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Key Facilities
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {block.importantFacilities.slice(0, 3).map((fac, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md truncate max-w-[150px]"
                          >
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-4">
                  <button
                    type="button"
                    onClick={() => handleBlockExplore(block)}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all"
                  >
                    <span>Explore Block</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
