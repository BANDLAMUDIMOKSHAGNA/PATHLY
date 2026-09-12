import React, { useState } from 'react';
import { Search, Building, ArrowRight, Layers, MapPin, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { College } from '../../types';

export const BuildingsPage: React.FC = () => {
  const { colleges, setSelectedCollege, setUserView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'college' | 'mall' | 'hospital' | 'office'>('all');

  const filteredColleges = colleges.filter((col) => {
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedFilter === 'all' || col.type === selectedFilter;
    return matchesSearch && matchesType;
  });

  const handleExplore = (college: College) => {
    setSelectedCollege(college);
    setUserView('campus');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Choose a Building
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5 max-w-xl">
            Select a building to start exploring rooms, floors, and indoor facilities.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buildings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:border-teal-500 dark:focus:border-teal-400 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedFilter === 'all'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Spaces ({colleges.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('college')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedFilter === 'college'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Colleges & Universities
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('mall')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedFilter === 'mall'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Shopping Malls
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('hospital')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedFilter === 'hospital'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Hospitals & Clinics
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('office')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            selectedFilter === 'office'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Corporate Offices
        </button>
      </div>

      {/* Building Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredColleges.map((college) => (
          <div
            key={college.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            {/* Building Image */}
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                {college.status}
              </div>
            </div>

            {/* Building Information */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {college.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">{college.location}</span>
                </p>

                {/* Stats Pills */}
                <div className="grid grid-cols-3 gap-1.5 my-4 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">Blocks</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{college.blocksCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">Floors</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{college.floorsCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">Rooms</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{college.roomsCount}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {college.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  type="button"
                  onClick={() => handleExplore(college)}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
