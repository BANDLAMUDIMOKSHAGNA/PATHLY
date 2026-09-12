import React, { useState } from 'react';
import { GitFork, Plus, CheckCircle2, ShieldCheck, Trash2, ArrowRight, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MapEdge } from '../../types';

export const AdminGraph: React.FC = () => {
  const { nodes, edges, addEdge, deleteEdge } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [fromNodeId, setFromNodeId] = useState(nodes[0]?.id || '');
  const [toNodeId, setToNodeId] = useState(nodes[1]?.id || '');
  const [distanceMeters, setDistanceMeters] = useState(25);
  const [isAccessible, setIsAccessible] = useState(true);
  const [walkwayType, setWalkwayType] = useState<MapEdge['walkwayType']>('corridor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromNodeId === toNodeId) {
      alert('Source and destination node cannot be identical.');
      return;
    }

    addEdge({
      fromNodeId,
      toNodeId,
      distanceMeters,
      isAccessible,
      walkwayType,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indoor Navigation Graph & Paths
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure graph nodes, edge weights (distances in meters), and step-free accessibility constraints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Graph Edge</span>
        </button>
      </div>

      {/* Graph Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Waypoints & Spatial Nodes</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{nodes.length}</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Doors, corridors & vertical stairs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Walkway Edges & Corridors</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{edges.length}</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Bidirectional walkable segments</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Accessible Walkway Ratio</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {Math.round((edges.filter((e) => e.isAccessible).length / (edges.length || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Wheelchair compliant segments</div>
        </div>
      </div>

      {/* Edge Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Edge ID</th>
                <th className="py-3.5 px-4">From Waypoint</th>
                <th className="py-3.5 px-4">To Waypoint</th>
                <th className="py-3.5 px-4">Weight (Distance)</th>
                <th className="py-3.5 px-4">Walkway Type</th>
                <th className="py-3.5 px-4">Accessibility</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {edges.map((edge) => {
                const nodeA = nodes.find((n) => n.id === edge.fromNodeId);
                const nodeB = nodes.find((n) => n.id === edge.toNodeId);

                return (
                  <tr key={edge.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">{edge.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {nodeA?.name || edge.fromNodeId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {nodeB?.name || edge.toNodeId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-teal-700">
                      {edge.distanceMeters} meters
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-600 font-medium">
                      {edge.walkwayType}
                    </td>
                    <td className="py-3 px-4">
                      {edge.isAccessible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Wheelchair Step-free</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Stairs / Inaccessible</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => deleteEdge(edge.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete Edge"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Edge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Edge / Walkway</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source Node</label>
                <select
                  value={fromNodeId}
                  onChange={(e) => setFromNodeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Node</label>
                <select
                  value={toNodeId}
                  onChange={(e) => setToNodeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Distance (Meters)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={distanceMeters}
                    onChange={(e) => setDistanceMeters(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Walkway Type</label>
                  <select
                    value={walkwayType}
                    onChange={(e: any) => setWalkwayType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="corridor">Corridor</option>
                    <option value="stairs">Staircase</option>
                    <option value="elevator">Elevator Shaft</option>
                    <option value="ramp">Accessibility Ramp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={isAccessible}
                    onChange={(e) => setIsAccessible(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Wheelchair Accessible (Step-free path)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Edge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
