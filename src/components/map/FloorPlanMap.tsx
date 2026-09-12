import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Compass,
  Layers,
  MapPin,
  Footprints,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Room, MapNode } from '../../types';

interface FloorPlanMapProps {
  interactive?: boolean;
  showAllNodes?: boolean;
  className?: string;
  onRoomClick?: (room: Room) => void;
}

export const FloorPlanMap: React.FC<FloorPlanMapProps> = ({
  interactive = true,
  showAllNodes = false,
  className = '',
  onRoomClick,
}) => {
  const {
    selectedBlock,
    selectedFloor,
    rooms,
    facilities,
    nodes,
    setSelectedRoom,
    isNavigating,
    activeRoute,
    currentStepIndex,
    isSimulatingWalk,
    theme,
  } = useApp();

  const isDark = theme === 'dark';

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter rooms on current floor
  const floorRooms = rooms.filter(
    (r) => r.blockId === selectedBlock.id && r.floorId === selectedFloor.id
  );

  // Filter facilities on current floor
  const floorFacilities = facilities.filter(
    (f) => f.blockId === selectedBlock.id && f.floorId === selectedFloor.id
  );

  // Filter nodes on current floor
  const floorNodes = nodes.filter((n) => n.floorId === selectedFloor.id);

  // Reset zoom & pan when floor changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [selectedFloor.id]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.6));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleRoomClick = (room: Room) => {
    if (onRoomClick) {
      onRoomClick(room);
    } else {
      setSelectedRoom(room);
    }
  };

  // Color mapping by room type
  const getRoomFill = (type: string, isHovered: boolean, isTarget: boolean) => {
    if (isTarget) return isDark ? '#134e4a' : '#ccfbf1';
    if (isHovered) return isDark ? '#1e3a8a' : '#e0f2fe';
    if (isDark) {
      switch (type) {
        case 'Laboratory':
          return '#064e3b';
        case 'Classroom':
          return '#1e293b';
        case 'Office':
          return '#362c12';
        case 'Restroom':
          return '#1e293b';
        case 'Stairs':
          return '#064e3b';
        case 'Elevator':
          return '#3b0764';
        default:
          return '#1e293b';
      }
    }
    switch (type) {
      case 'Laboratory':
        return '#f0fdf4';
      case 'Classroom':
        return '#f8fafc';
      case 'Office':
        return '#fefce8';
      case 'Restroom':
        return '#f1f5f9';
      case 'Stairs':
        return '#ecfdf5';
      case 'Elevator':
        return '#f3e8ff';
      default:
        return '#ffffff';
    }
  };

  const getRoomBorder = (type: string, isHovered: boolean, isTarget: boolean) => {
    if (isTarget) return '#14b8a6';
    if (isHovered) return '#38bdf8';
    if (isDark) {
      switch (type) {
        case 'Laboratory':
          return '#059669';
        case 'Classroom':
          return '#475569';
        case 'Office':
          return '#ca8a04';
        case 'Restroom':
          return '#64748b';
        case 'Stairs':
          return '#10b981';
        case 'Elevator':
          return '#9333ea';
        default:
          return '#334155';
      }
    }
    switch (type) {
      case 'Laboratory':
        return '#86efac';
      case 'Classroom':
        return '#cbd5e1';
      case 'Office':
        return '#fde047';
      case 'Restroom':
        return '#94a3b8';
      case 'Stairs':
        return '#34d399';
      case 'Elevator':
        return '#c084fc';
      default:
        return '#e2e8f0';
    }
  };

  // Animated walker position
  const walkerPoint = activeRoute && activeRoute.pathPoints.length > 0
    ? activeRoute.pathPoints[
        Math.min(currentStepIndex, activeRoute.pathPoints.length - 1)
      ]
    : null;

  // Render SVG Path string from route points
  const getRouteSvgPath = () => {
    if (!activeRoute || !activeRoute.pathPoints || activeRoute.pathPoints.length < 2) return '';
    const points = activeRoute.pathPoints;
    // Map percentage coordinates (0-100) to SVG canvas (0-800, 0-520)
    let d = `M ${points[0].x * 8} ${points[0].y * 5.2}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x * 8} ${points[i].y * 5.2}`;
    }
    return d;
  };

  return (
    <div
      id="floor-plan-interactive-map"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full min-h-[420px] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Top Overlay Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <div className="text-xs">
            <span className="font-bold text-slate-800 dark:text-white">{selectedBlock.name}</span>
            <span className="text-slate-400 dark:text-slate-500 mx-1.5">/</span>
            <span className="font-semibold text-teal-700 dark:text-teal-400">{selectedFloor.name}</span>
          </div>
        </div>

        {isNavigating && activeRoute && (
          <div className="bg-teal-600 dark:bg-teal-700 text-white px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold animate-pulse">
            <Navigation className="w-3.5 h-3.5" />
            <span>Navigating to: {activeRoute.targetRoom?.name || 'Destination'}</span>
          </div>
        )}
      </div>

      {/* Floating Controls (Zoom / Pan / Fit) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-200 dark:bg-slate-700 my-0.5" />
        <button
          type="button"
          onClick={handleResetZoom}
          title="Reset View"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Compass in top right */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">
          <span>N ↑</span>
        </div>
      </div>

      {/* Map SVG Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          viewBox="0 0 800 520"
          className="w-full h-full max-w-[900px] drop-shadow-md"
          style={{ background: isDark ? '#0f172a' : '#f8fafc' }}
        >
          {/* Subtle architectural grid */}
          <defs>
            <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="0.8" />
            </pattern>
            {/* Route glow filter */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={isDark ? '#0284c7' : '#0284c7'} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Canvas blueprint background */}
          <rect width="800" height="520" fill="url(#arch-grid)" />

          {/* Building Floor Outer Boundary Wall */}
          <rect
            x="40"
            y="40"
            width="720"
            height="440"
            rx="16"
            fill={isDark ? '#090d16' : '#ffffff'}
            stroke={isDark ? '#334155' : '#94a3b8'}
            strokeWidth="6"
          />

          {/* Central Main Corridor (Walkable Area) */}
          <rect
            x="80"
            y="225"
            width="640"
            height="70"
            rx="6"
            fill={isDark ? '#1e293b' : '#e2e8f0'}
            opacity="0.85"
          />
          {/* Corridor text label */}
          <text
            x="400"
            y="266"
            textAnchor="middle"
            fill={isDark ? '#64748b' : '#64748b'}
            fontSize="12"
            fontWeight="600"
            letterSpacing="2"
          >
            MAIN CENTRAL CORRIDOR
          </text>

          {/* Left Wing Stairs Corridor Link */}
          <rect x="120" y="225" width="40" height="70" fill={isDark ? '#334155' : '#cbd5e1'} opacity="0.6" />

          {/* Render Rooms */}
          {floorRooms.map((room) => {
            const isHovered = hoveredRoomId === room.id;
            const isTarget = activeRoute?.targetRoom?.id === room.id;

            // Room coords mapped to 800x520
            const rx = room.coordinates.x * 8;
            const ry = room.coordinates.y * 5.2;
            const rw = room.coordinates.width * 8;
            const rh = room.coordinates.height * 5.2;

            const fill = getRoomFill(room.type, isHovered, isTarget);
            const border = getRoomBorder(room.type, isHovered, isTarget);

            return (
              <g
                key={room.id}
                onClick={() => handleRoomClick(room)}
                onMouseEnter={() => setHoveredRoomId(room.id)}
                onMouseLeave={() => setHoveredRoomId(null)}
                className="cursor-pointer transition-all duration-150"
              >
                {/* Room Shape */}
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  rx="8"
                  fill={fill}
                  stroke={border}
                  strokeWidth={isTarget ? '3' : isHovered ? '2.5' : '1.5'}
                  className={isTarget ? 'filter drop-shadow-md' : ''}
                />

                {/* Door Opening indicator */}
                {room.doorLocation && (
                  <circle
                    cx={room.doorLocation.x * 8}
                    cy={room.doorLocation.y * 5.2}
                    r="4"
                    fill={isDark ? '#2dd4bf' : '#0d9488'}
                    stroke={isDark ? '#0f172a' : '#ffffff'}
                    strokeWidth="1.5"
                  />
                )}

                {/* Room Title */}
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 - 2}
                  textAnchor="middle"
                  fill={isTarget ? (isDark ? '#2dd4bf' : '#0f766e') : (isDark ? '#f1f5f9' : '#1e293b')}
                  fontSize={rw < 90 ? '11' : '13'}
                  fontWeight="700"
                  className="pointer-events-none"
                >
                  {room.code}
                </text>

                {/* Room Subtype or Capacity */}
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 + 14}
                  textAnchor="middle"
                  fill={isTarget ? (isDark ? '#14b8a6' : '#0d9488') : (isDark ? '#94a3b8' : '#64748b')}
                  fontSize="10"
                  fontWeight="500"
                  className="pointer-events-none"
                >
                  {room.type === 'Classroom' ? `${room.capacity} seats` : room.type}
                </text>

                {/* Target badge on room */}
                {isTarget && (
                  <g transform={`translate(${rx + rw - 24}, ${ry + 8})`}>
                    <circle cx="8" cy="8" r="9" fill="#0d9488" />
                    <text x="8" y="11" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                      ★
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Stairs Room Block (West Wing) */}
          <g
            onClick={() => {}}
            className="cursor-pointer"
          >
            <rect
              x="120"
              y="225"
              width="50"
              height="70"
              rx="4"
              fill={isDark ? '#064e3b' : '#ecfdf5'}
              stroke={isDark ? '#059669' : '#34d399'}
              strokeWidth="1.5"
            />
            {/* Stairs icon symbol */}
            <path
              d="M130 275 L140 275 L140 265 L150 265 L150 255 L160 255 L160 245"
              stroke={isDark ? '#34d399' : '#059669'}
              strokeWidth="2.5"
              fill="none"
            />
            <text x="145" y="288" textAnchor="middle" fill={isDark ? '#a7f3d0' : '#065f46'} fontSize="9" fontWeight="bold">
              Stairs
            </text>
          </g>

          {/* Elevator Room Block (East Wing) */}
          <g className="cursor-pointer">
            <rect
              x="630"
              y="225"
              width="50"
              height="70"
              rx="4"
              fill={isDark ? '#3b0764' : '#f3e8ff'}
              stroke={isDark ? '#9333ea' : '#c084fc'}
              strokeWidth="1.5"
            />
            {/* Elevator symbol */}
            <rect x="10" y="10" width="16" height="20" fill="none" stroke={isDark ? '#c084fc' : '#7e22ce'} strokeWidth="2" />
            <path d="M 648 250 L 655 242 L 662 250 M 648 260 L 655 268 L 662 260" stroke={isDark ? '#c084fc' : '#7e22ce'} strokeWidth="2" fill="none" />
            <text x="655" y="288" textAnchor="middle" fill={isDark ? '#e9d5ff' : '#6b21a8'} fontSize="9" fontWeight="bold">
              Elevator
            </text>
          </g>

          {/* Optional: Show All Nodes for Admin Map Editor preview */}
          {showAllNodes &&
            floorNodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x * 8}
                  cy={node.y * 5.2}
                  r="5"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={node.x * 8}
                  y={node.y * 5.2 - 8}
                  textAnchor="middle"
                  fill="#0369a1"
                  fontSize="8"
                  fontWeight="600"
                >
                  {node.name}
                </text>
              </g>
            ))}

          {/* Navigation Route Path Line */}
          {isNavigating && activeRoute && (
            <g filter="url(#route-glow)">
              {/* Route Background thick glow line */}
              <path
                d={getRouteSvgPath()}
                fill="none"
                stroke="#0284c7"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />
              {/* Route Active Animated Dashed Line */}
              <path
                d={getRouteSvgPath()}
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-route-dash"
              />
            </g>
          )}

          {/* Origin Marker (Blue User Location with Pulsing Ring) */}
          {isNavigating && activeRoute && (
            <g
              transform={`translate(${
                (walkerPoint ? walkerPoint.x : activeRoute.originNode.x) * 8
              }, ${
                (walkerPoint ? walkerPoint.y : activeRoute.originNode.y) * 5.2
              })`}
            >
              {/* Outer pulsing circle */}
              <circle cx="0" cy="0" r="16" fill="#38bdf8" opacity="0.4" className="animate-pulse-ring" />
              {/* Main blue circle */}
              <circle cx="0" cy="0" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              {/* Inner core */}
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              {/* Label */}
              <rect x="-44" y="-28" width="88" height="18" rx="5" fill="#0f172a" opacity="0.85" />
              <text x="0" y="-16" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                {isSimulatingWalk ? 'Walking...' : 'Your Location'}
              </text>
            </g>
          )}

          {/* Destination Marker (Red / Teal Pin) */}
          {isNavigating && activeRoute && (
            <g
              transform={`translate(${activeRoute.destinationNode.x * 8}, ${
                activeRoute.destinationNode.y * 5.2
              })`}
            >
              {/* Shadow */}
              <ellipse cx="0" cy="4" rx="6" ry="2.5" fill="#000" opacity="0.3" />
              {/* Pin body */}
              <path
                d="M 0 -22 C -8 -22 -12 -16 -12 -10 C -12 -2 0 4 0 4 C 0 4 12 -2 12 -10 C 12 -16 8 -22 0 -22 Z"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="-11" r="4" fill="#ffffff" />
              {/* Destination text pill */}
              <rect x="-42" y="-46" width="84" height="18" rx="6" fill="#ef4444" />
              <text x="0" y="-34" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                Destination
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Map Legend at bottom left */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-sky-600 rounded-full" />
          <span>Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-xs bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-400 dark:border-emerald-600" />
          <span>Lab / Stairs</span>
        </div>
      </div>
    </div>
  );
};
