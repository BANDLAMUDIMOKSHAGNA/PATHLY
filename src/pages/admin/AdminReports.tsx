import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, ArrowUpRight, CheckCircle2, Building, Users, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminReports: React.FC = () => {
  const { buildings, analytics } = useApp();
  const [activeTab, setActiveTab] = useState<'navigation' | 'building' | 'users' | 'shops'>('navigation');
  const [dateRange, setDateRange] = useState('Aug 1, 2025 - Aug 11, 2025');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const reportRecords = [
    { date: '11 Aug 2025', navigations: 1840, users: 490, topBuilding: 'CSE Block', avgTime: '2m 10s', successRate: '99.4%' },
    { date: '10 Aug 2025', navigations: 1620, users: 420, topBuilding: 'Main Block', avgTime: '2m 24s', successRate: '98.8%' },
    { date: '09 Aug 2025', navigations: 1450, users: 380, topBuilding: 'CSE Block', avgTime: '2m 15s', successRate: '99.1%' },
    { date: '08 Aug 2025', navigations: 1980, users: 510, topBuilding: 'ECE Block', avgTime: '2m 45s', successRate: '99.6%' },
    { date: '07 Aug 2025', navigations: 1750, users: 460, topBuilding: 'CSE Block', avgTime: '2m 30s', successRate: '98.9%' },
    { date: '06 Aug 2025', navigations: 1890, users: 495, topBuilding: 'Mechanical Block', avgTime: '3m 05s', successRate: '99.2%' },
    { date: '05 Aug 2025', navigations: 1950, users: 525, topBuilding: 'CSE Block', avgTime: '2m 20s', successRate: '99.5%' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setNotification('Report generated and ready for export.');
      setTimeout(() => setNotification(null), 3500);
    }, 800);
  };

  const handleDownload = (format: 'CSV' | 'PDF') => {
    setNotification(`Downloading ${format} report...`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header matching path1.png screen 16 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Download and view detailed traffic, occupancy, and route performance reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownload('CSV')}
            className="py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownload('PDF')}
            className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs matching reference */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('navigation')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-xl transition-colors ${
            activeTab === 'navigation'
              ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Navigation Reports
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('building')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-xl transition-colors ${
            activeTab === 'building'
              ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Building Reports
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-xl transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          User Report
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shops')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-xl transition-colors ${
            activeTab === 'shops'
              ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Shop & Facility Report
        </button>
      </div>

      {/* Filter & Date controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRange}</span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          7 days summary · 12,480 total navigations
        </div>
      </div>

      {/* Report Table matching path1.png screen 16 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Total Navigations</th>
                <th className="px-6 py-3.5">Unique Users</th>
                <th className="px-6 py-3.5">Top Building</th>
                <th className="px-6 py-3.5">Avg. Trip Time</th>
                <th className="px-6 py-3.5">Success Rate</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reportRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{rec.date}</td>
                  <td className="px-6 py-4 font-bold text-teal-700">{rec.navigations.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{rec.users}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-[11px]">
                      {rec.topBuilding}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{rec.avgTime}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {rec.successRate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload('CSV')}
                      className="text-teal-600 hover:text-teal-800 font-bold hover:underline"
                    >
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
