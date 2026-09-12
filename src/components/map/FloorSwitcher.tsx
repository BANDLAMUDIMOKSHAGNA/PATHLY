import React from 'react';
import { Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Floor } from '../../types';

interface FloorSwitcherProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const FloorSwitcher: React.FC<FloorSwitcherProps> = ({
  orientation = 'vertical',
  className = '',
}) => {
  const { floors, selectedBlock, selectedFloor, setSelectedFloor } = useApp();

  const blockFloors = floors
    .filter((f) => f.blockId === selectedBlock.id)
    .sort((a, b) => (orientation === 'vertical' ? b.level - a.level : a.level - b.level));

  const getFloorShortCode = (level: number) => {
    if (level === 0) return 'GF';
    return `${level}F`;
  };

  return (
    <div
      id="floor-switcher"
      className={`bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md ${
        orientation === 'vertical' ? 'flex flex-col gap-1.5' : 'flex items-center gap-1.5'
      } ${className}`}
    >
      <div
        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1 ${
          orientation === 'vertical' ? 'border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-0.5' : 'hidden sm:flex mr-1'
        }`}
      >
        <Layers className="w-3 h-3 text-teal-600 dark:text-teal-400" />
        <span>Floors</span>
      </div>

      {blockFloors.map((floor) => {
        const isActive = selectedFloor.id === floor.id;
        return (
          <button
            key={floor.id}
            type="button"
            onClick={() => setSelectedFloor(floor)}
            className={`relative flex items-center transition-all ${
              orientation === 'vertical'
                ? 'w-full px-3 py-2 rounded-xl text-left justify-between'
                : 'px-3 py-1.5 rounded-xl'
            } ${
              isActive
                ? 'bg-teal-600 text-white font-bold shadow-xs shadow-teal-700/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {getFloorShortCode(floor.level)}
              </span>
              <span className="text-xs truncate">{floor.name}</span>
            </div>

            {orientation === 'vertical' && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {floor.roomsCount} rms
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
