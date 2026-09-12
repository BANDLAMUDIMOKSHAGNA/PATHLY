import React, { useState, useRef } from 'react';
import {
  Map,
  Plus,
  MousePointer,
  GitCommit,
  Share2,
  Play,
  Upload,
  Layers,
  Save,
  Trash2,
  CheckCircle2,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapNode, MapEdge } from '../../types';

export const AdminMapEditor: React.FC = () => {
  const {
    selectedBlock,
    selectedFloor,
    nodes,
    edges,
    addNode,
    deleteNode,
    addEdge,
    rooms,
  } = useApp();

  const [activeTool, setActiveTool] = useState<'select' | 'add-node' | 'connect-edge' | 'test-route'>('select');
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [edgeStartNode, setEdgeStartNode] = useState<MapNode | null>(null);
  const [nodeTypeToAdd, setNodeTypeToAdd] = useState<MapNode['type']>('corridor');
  const [testSourceNode, setTestSourceNode] = useState<MapNode | null>(null);
  const [testTargetNode, setTestTargetNode] = useState<MapNode | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const floorNodes = nodes.filter((n) => n.floorId === selectedFloor.id);
  const floorNodeIds = new Set(floorNodes.map((n) => n.id));
  const floorEdges = edges.filter(
    (e) => floorNodeIds.has(e.fromNodeId) && floorNodeIds.has(e.toNodeId)
  );

  // SVG coordinate transformation
  const svgRef = useRef<SVGSVGElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool !== 'add-node' || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const newNodeName = `Node ${floorNodes.length + 1}`;
    addNode({
      floorId: selectedFloor.id,
      name: newNodeName,
      type: nodeTypeToAdd,
      x: Math.round(clickX * 10) / 10,
      y: Math.round(clickY * 10) / 10,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleNodeClick = (node: MapNode, e: React.MouseEvent) => {
    e.stopPropagation();

    if (activeTool === 'select') {
      setSelectedNode(node);
    } else if (activeTool === 'connect-edge') {
      if (!edgeStartNode) {
        setEdgeStartNode(node);
      } else if (edgeStartNode.id !== node.id) {
        const dx = (node.x - edgeStartNode.x) * 1.5;
        const dy = (node.y - edgeStartNode.y) * 1.5;
        const dist = Math.max(5, Math.round(Math.hypot(dx, dy)));

        addEdge({
          fromNodeId: edgeStartNode.id,
          toNodeId: node.id,
          distanceMeters: dist,
          isAccessible: true,
          walkwayType: 'corridor',
        });

        setEdgeStartNode(null);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
      }
    } else if (activeTool === 'test-route') {
      if (!testSourceNode) {
        setTestSourceNode(node);
      } else if (!testTargetNode) {
        setTestTargetNode(node);
      } else {
        setTestSourceNode(node);
        setTestTargetNode(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2">
            <Map className="w-3.5 h-3.5 text-teal-600" />
            <span>Visual CAD Blueprint Editor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Floor Map & Spatial Topology Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Editing: <strong className="text-slate-800">{selectedBlock.name}</strong> ·{' '}
            <strong className="text-teal-700">{selectedFloor.name}</strong>
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <label className="py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs">
            <Upload className="w-4 h-4 text-teal-600" />
            <span>Upload Blueprint (SVG/PNG)</span>
            <input type="file" accept="image/*,.svg" className="hidden" />
          </label>
        </div>
      </div>

      {/* Editor Tool Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Tool Selectors */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTool('select')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'select'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            <span>Inspect / Move</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('add-node')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'add-node'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>Add Node</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTool('connect-edge');
              setEdgeStartNode(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'connect-edge'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Connect Walkway</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTool('test-route');
              setTestSourceNode(null);
              setTestTargetNode(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'test-route'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Test Route</span>
          </button>
        </div>

        {/* Node Sub-Type Selection if in add mode */}
        {activeTool === 'add-node' && (
          <div className="flex items-center gap-2 text-xs bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold px-1">Type:</span>
            {(['corridor', 'door', 'stairs', 'elevator'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setNodeTypeToAdd(t)}
                className={`px-2.5 py-1 rounded-lg capitalize font-bold text-xs ${
                  nodeTypeToAdd === t ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Tooltip description */}
        <div className="text-xs text-slate-500 font-medium">
          {activeTool === 'add-node' && 'Click anywhere on canvas to place a waypoint node.'}
          {activeTool === 'connect-edge' &&
            (edgeStartNode
              ? `Selected start: ${edgeStartNode.name}. Now click second node.`
              : 'Click first node to begin walkway connection.')}
          {activeTool === 'test-route' &&
            (!testSourceNode
              ? 'Click starting node'
              : !testTargetNode
              ? 'Click target destination node'
              : 'Route calculated! Click reset to test another.')}
        </div>
      </div>

      {/* Editor Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Canvas (9 cols) */}
        <div className="lg:col-span-9 bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-xl overflow-hidden relative min-h-[500px] flex items-center justify-center">
          {/* Blueprint SVG Canvas */}
          <svg
            ref={svgRef}
            viewBox="0 0 1000 600"
            onClick={handleCanvasClick}
            className="w-full h-full max-h-[600px] select-none cursor-crosshair"
            style={{ background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)' }}
          >
            {/* Grid */}
            <defs>
              <pattern id="editor-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#editor-grid)" />

            {/* Floor Boundary */}
            <rect
              x="50"
              y="50"
              width="900"
              height="500"
              rx="12"
              fill="rgba(30, 41, 59, 0.5)"
              stroke="#475569"
              strokeWidth="4"
            />

            {/* Walkway corridor area */}
            <rect x="100" y="270" width="800" height="70" fill="rgba(51, 65, 85, 0.4)" rx="4" />

            {/* Existing Edges (Corridors / Walkways) */}
            {floorEdges.map((edge) => {
              const n1 = floorNodes.find((n) => n.id === edge.fromNodeId);
              const n2 = floorNodes.find((n) => n.id === edge.toNodeId);
              if (!n1 || !n2) return null;

              return (
                <g key={edge.id}>
                  <line
                    x1={n1.x * 10}
                    y1={n2.y ? n1.y * 6 : 0}
                    x2={n2.x * 10}
                    y2={n2.y * 6}
                    stroke="#14b8a6"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />
                  {/* Distance label */}
                  <text
                    x={(n1.x * 10 + n2.x * 10) / 2}
                    y={(n1.y * 6 + n2.y * 6) / 2 - 4}
                    fill="#5eead4"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {edge.distanceMeters}m
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {floorNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isEdgeStart = edgeStartNode?.id === node.id;
              const isSource = testSourceNode?.id === node.id;
              const isTarget = testTargetNode?.id === node.id;

              let fill = '#0284c7';
              if (node.type === 'door') fill = '#10b981';
              if (node.type === 'stairs') fill = '#f59e0b';
              if (node.type === 'elevator') fill = '#a855f7';
              if (isSelected || isEdgeStart) fill = '#14b8a6';
              if (isSource) fill = '#0284c7';
              if (isTarget) fill = '#ef4444';

              return (
                <g
                  key={node.id}
                  onClick={(e) => handleNodeClick(node, e)}
                  className="cursor-pointer"
                >
                  {/* Node Outer Ring */}
                  {(isSelected || isEdgeStart || isSource || isTarget) && (
                    <circle
                      cx={node.x * 10}
                      cy={node.y * 6}
                      r="12"
                      fill="none"
                      stroke="#5eead4"
                      strokeWidth="2.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={node.x * 10}
                    cy={node.y * 6}
                    r="6"
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Label */}
                  <text
                    x={node.x * 10}
                    y={node.y * 6 - 9}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="600"
                    className="drop-shadow-md pointer-events-none"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}

            {/* If testing route and both set, draw test route line */}
            {testSourceNode && testTargetNode && (
              <line
                x1={testSourceNode.x * 10}
                y1={testSourceNode.y * 6}
                x2={testTargetNode.x * 10}
                y2={testTargetNode.y * 6}
                stroke="#38bdf8"
                strokeWidth="5"
                strokeDasharray="6 3"
                className="animate-route-dash"
              />
            )}
          </svg>

          {/* Toast on save */}
          {saveToast && (
            <div className="absolute top-4 right-4 bg-teal-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Spatial topology updated</span>
            </div>
          )}
        </div>

        {/* Sidebar Properties Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Inspector & Node Properties
            </h3>

            {selectedNode ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Node ID:</span>
                  <div className="font-mono font-bold text-slate-800">{selectedNode.id}</div>
                </div>

                <div>
                  <span className="text-slate-400">Node Name:</span>
                  <input
                    type="text"
                    value={selectedNode.name}
                    onChange={() => {}}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <span className="text-slate-400">Type:</span>
                  <div className="font-semibold text-teal-700 capitalize mt-0.5">
                    {selectedNode.type}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>X: {selectedNode.x}%</div>
                  <div>Y: {selectedNode.y}%</div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      deleteNode(selectedNode.id);
                      setSelectedNode(null);
                    }}
                    className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Node</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any waypoint node on the map to inspect its spatial coordinates, linked rooms, and connected edges.
              </p>
            )}
          </div>

          {/* Map Layer Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-xs space-y-2">
            <h4 className="font-bold text-slate-800">Topology Graph Summary</h4>
            <div className="flex justify-between text-slate-500">
              <span>Nodes on floor:</span>
              <strong className="text-slate-900">{floorNodes.length}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Walkway segments:</span>
              <strong className="text-slate-900">{floorEdges.length}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Rooms anchored:</span>
              <strong className="text-slate-900">{rooms.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
