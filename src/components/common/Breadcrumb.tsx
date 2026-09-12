import React from 'react';
import { ChevronRight, Home, Building2, Layers, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BreadcrumbProps {
  currentRoomName?: string;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentRoomName, className = '' }) => {
  const {
    selectedCollege,
    selectedBlock,
    selectedFloor,
    setUserView,
    setIsAdminMode,
    setSelectedRoom,
  } = useApp();

  return (
    <nav
      id="pathly-breadcrumb"
      aria-label="Hierarchy Breadcrumb"
      className={`flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 ${className}`}
    >
      <button
        type="button"
        onClick={() => {
          setIsAdminMode(false);
          setUserView('home');
          setSelectedRoom(null);
        }}
        className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />

      <button
        type="button"
        onClick={() => {
          setIsAdminMode(false);
          setUserView('campus');
          setSelectedRoom(null);
        }}
        className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-colors py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 truncate max-w-[140px] sm:max-w-none"
      >
        <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
        <span className="truncate">{selectedCollege.name}</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />

      <button
        type="button"
        onClick={() => {
          setIsAdminMode(false);
          setUserView('block');
          setSelectedRoom(null);
        }}
        className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition-colors py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 truncate max-w-[120px] sm:max-w-none"
      >
        <span className="truncate">{selectedBlock.name}</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />

      <button
        type="button"
        onClick={() => {
          setIsAdminMode(false);
          setUserView('map');
          setSelectedRoom(null);
        }}
        className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 font-semibold py-1 px-1.5 rounded hover:bg-teal-50 dark:hover:bg-teal-950/60"
      >
        <Layers className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
        <span>{selectedFloor.name}</span>
      </button>

      {currentRoomName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <span className="inline-flex items-center gap-1 text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
            <span className="truncate max-w-[140px]">{currentRoomName}</span>
          </span>
        </>
      )}
    </nav>
  );
};
