import React, { useState } from 'react';
import { Building2, Navigation, Layers, Compass, ArrowUpRight, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Block } from '../../types';

interface CampusOverviewMapProps {
  onSelectBlock?: (block: Block) => void;
  className?: string;
}

export const CampusOverviewMap: React.FC<CampusOverviewMapProps> = ({
  onSelectBlock,
  className = '',
}) => {
  const { blocks, selectedBlock, setSelectedBlock, setUserView } = useApp();
  const [hoveredBlock, setHoveredBlock] = useState<Block | null>(null);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    if (onSelectBlock) {
      onSelectBlock(block);
    } else {
      setUserView('block');
    }
  };

  return (
    <div
      id="campus-overview-map-container"
      className={`relative w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden ${className}`}
    >
      {/* Map Header Overlay */}
      <div className="absolute top-3.5 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-white text-xs font-semibold backdrop-blur-md border border-slate-700">
          <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '12s' }} />
          <span>Interactive Campus Overview</span>
        </div>
        <span className="hidden sm:inline-block text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-full backdrop-blur-md">
          Click any block to enter indoor floor plan
        </span>
      </div>

      {/* Compass rose */}
      <div className="absolute top-3.5 right-4 z-10 pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-teal-400 shadow-md">
          <span>N ↑</span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="w-full aspect-[16/10] sm:aspect-[16/9] min-h-[300px]">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full select-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, #0d2538 0%, #081724 100%)' }}
        >
          {/* Campus Grounds / Grid Pattern */}
          <defs>
            <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            {/* Building gradients */}
            <linearGradient id="cse-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="main-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="ece-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="mech-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          <rect width="1000" height="620" fill="url(#campus-grid)" />

          {/* Campus walkways / road network */}
          <g stroke="rgba(255,255,255,0.14)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Main Spine Road */}
            <path d="M 220 540 L 220 180 L 760 180" />
            <path d="M 500 180 L 500 540" />
            <path d="M 760 180 L 760 540" />
            <path d="M 220 360 L 760 360" />
          </g>

          {/* Walkway Dashed Centerlines */}
          <g stroke="rgba(45, 212, 191, 0.4)" strokeWidth="2" strokeDasharray="6 6" fill="none">
            <path d="M 220 540 L 220 180 L 760 180" />
            <path d="M 500 180 L 500 540" />
            <path d="M 760 180 L 760 540" />
            <path d="M 220 360 L 760 360" />
          </g>

          {/* Campus Greenery Zones */}
          <rect x="250" y="210" width="220" height="120" rx="16" fill="#064e3b" opacity="0.4" />
          <text x="360" y="275" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="600" opacity="0.8">
            Central Quad Greens
          </text>

          <rect x="530" y="210" width="200" height="120" rx="16" fill="#064e3b" opacity="0.4" />
          <text x="630" y="275" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="600" opacity="0.8">
            Botanical Garden
          </text>

          {/* Render All Campus Blocks */}
          {blocks.map((block) => {
            const isSelected = selectedBlock?.id === block.id;
            const isHovered = hoveredBlock?.id === block.id;

            // Coordinates scaled to SVG canvas (1000x620)
            const x = (block.mapPosition?.x ?? 20) * 9.5 + 20;
            const y = (block.mapPosition?.y ?? 20) * 5.8 + 20;
            const width = (block.mapPosition?.width ?? 20) * 9.5;
            const height = (block.mapPosition?.height ?? 18) * 5.8;

            return (
              <g
                key={block.id}
                onClick={() => handleBlockClick(block)}
                onMouseEnter={() => setHoveredBlock(block)}
                onMouseLeave={() => setHoveredBlock(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Glow ring if selected */}
                {(isSelected || isHovered) && (
                  <rect
                    x={x - 6}
                    y={y - 6}
                    width={width + 12}
                    height={height + 12}
                    rx="18"
                    fill="none"
                    stroke={isSelected ? '#14b8a6' : '#38bdf8'}
                    strokeWidth={isSelected ? '3' : '2'}
                    className={isSelected ? 'animate-pulse' : ''}
                  />
                )}

                {/* Building Base / Shadow */}
                <rect
                  x={x}
                  y={y + 8}
                  width={width}
                  height={height}
                  rx="14"
                  fill="#06121d"
                  opacity="0.7"
                />

                {/* Building Top Face */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="14"
                  fill={
                    block.id === 'blk-cse'
                      ? 'url(#cse-grad)'
                      : block.id === 'blk-main'
                      ? 'url(#main-grad)'
                      : block.id === 'blk-ece'
                      ? 'url(#ece-grad)'
                      : block.id === 'blk-mech'
                      ? 'url(#mech-grad)'
                      : '#1e293b'
                  }
                  stroke={isSelected ? '#5eead4' : '#334155'}
                  strokeWidth="1.5"
                />

                {/* Building Blueprint Details / Lines */}
                <rect
                  x={x + 10}
                  y={y + 10}
                  width={width - 20}
                  height={height - 20}
                  rx="8"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />

                {/* Block Name */}
                <text
                  x={x + width / 2}
                  y={y + height / 2 - 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="15"
                  fontWeight="700"
                  className="pointer-events-none drop-shadow-md"
                >
                  {block.name}
                </text>

                {/* Floors badge */}
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 16}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.85)"
                  fontSize="11"
                  fontWeight="500"
                  className="pointer-events-none"
                >
                  {block.floorsCount} Floors · {block.roomsCount} Rooms
                </text>

                {/* Indicator icon */}
                <circle cx={x + width - 18} cy={y + 18} r="8" fill="rgba(0,0,0,0.3)" />
                <text
                  x={x + width - 18}
                  y={y + 22}
                  textAnchor="middle"
                  fill="#5eead4"
                  fontSize="11"
                  fontWeight="bold"
                >
                  →
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Info Pill at bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto z-10 flex items-center justify-between sm:justify-start gap-3 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
          <span className="font-semibold text-white">Active Block:</span>
          <span className="text-teal-300 font-bold">{selectedBlock?.name}</span>
        </div>
        <button
          type="button"
          onClick={() => setUserView('block')}
          className="inline-flex items-center gap-1 font-semibold text-white bg-teal-600 hover:bg-teal-500 px-3 py-1 rounded-lg transition-colors"
        >
          <span>Explore Block</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
