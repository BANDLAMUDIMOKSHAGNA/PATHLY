import React from 'react';
import {
  GraduationCap,
  Building,
  Layers,
  MapPin,
  Search,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  GitFork,
  Map,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { setAdminView, colleges, blocks, rooms } = useApp();

  const metrics = [
    {
      label: 'Total Colleges & Campuses',
      value: '12',
      change: '+2 this month',
      icon: <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      bg: 'bg-teal-50 dark:bg-teal-950/60',
      action: () => setAdminView('colleges'),
    },
    {
      label: 'Total Buildings',
      value: '48',
      change: '+5 configured',
      icon: <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      action: () => setAdminView('buildings'),
    },
    {
      label: 'Total Blocks',
      value: '110',
      change: '100% mapped',
      icon: <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      action: () => setAdminView('buildings'),
    },
    {
      label: 'Total Rooms & Spaces',
      value: '3,420',
      change: '+140 updated',
      icon: <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      action: () => setAdminView('rooms'),
    },
    {
      label: 'Navigation Searches Today',
      value: '18,450',
      change: '+24% peak hours',
      icon: <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      action: () => setAdminView('analytics'),
    },
    {
      label: 'Most Searched Destination',
      value: 'AI Lab – Room 204',
      change: '2,840 trips routed',
      icon: <TrendingUp className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      action: () => setAdminView('analytics'),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Updated Node #204 boundary',
      target: 'CSE Block · 2nd Floor',
      user: 'Dr. Sarah Chen',
      time: '12 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      action: 'Published Blueprint Revision 3.2',
      target: 'Mechanical Block · Floor 1',
      user: 'Prof. Davis',
      time: '45 minutes ago',
      status: 'success',
    },
    {
      id: 3,
      action: 'Added Accessibility Ramp Route',
      target: 'Central Quad Walkway',
      user: 'Operations Lead',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 4,
      action: 'Temporary Elevator Maintenance Flag',
      target: 'East Wing Elevator #2',
      user: 'Facilities Team',
      time: '4 hours ago',
      status: 'warning',
    },
    {
      id: 5,
      action: 'New Classroom Batch Import (32 rooms)',
      target: 'ECE Block · All Floors',
      user: 'Admin Bot',
      time: 'Yesterday',
      status: 'success',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Campus Real-Time Spatial Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Indoor Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Live telemetry, navigation graph topology, and real-time indoor route statistics.
          </p>
        </div>

        {/* Quick launch buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdminView('editor')}
            className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Map className="w-4 h-4" />
            <span>Launch Map Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminView('paths')}
            className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <GitFork className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Graph View</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid (Section 12.1 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            onClick={m.action}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.label}</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                  {m.value}
                </div>
              </div>
              <div className={`p-3 rounded-xl ${m.bg} group-hover:scale-105 transition-transform`}>
                {m.icon}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-teal-700 dark:text-teal-400 font-semibold">{m.change}</span>
              <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 flex items-center gap-0.5">
                <span>View</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* System Status & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Table (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Admin Activity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Floor map and node updates across active campuses</p>
            </div>
            <button
              type="button"
              onClick={() => setAdminView('reports')}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
            >
              View All Logs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Location</th>
                  <th className="py-2.5 px-3">Admin</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{act.action}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{act.target}</td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{act.user}</td>
                    <td className="py-3 px-3 text-slate-400 dark:text-slate-500">{act.time}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          act.status === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {act.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        <span>{act.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Telemetry (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Spatial Engine Health</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sub-meter positioning & path routing status</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Dijkstra Routing Graph</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">840 nodes · 1,290 edges</div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                Operational
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Indoor Positioning Beacon Link</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">BLE 5.2 mesh synchronized</div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                99.8% Sync
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Accessibility Matrix</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">Ramp & elevator bypass active</div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 font-bold text-[10px]">
                Enforced
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Multi-Floor Elevator Sync</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">Vertical node linkages intact</div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                100% Intact
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
