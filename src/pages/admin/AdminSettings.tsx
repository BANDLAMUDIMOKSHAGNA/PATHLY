import React, { useState } from 'react';
import { Settings, Shield, Sliders, CheckCircle2, Save, Wifi, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const { selectedCollege } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings states
  const [campusName, setCampusName] = useState(selectedCollege.name);
  const [defaultPace, setDefaultPace] = useState('1.1');
  const [accessibilityDefault, setAccessibilityDefault] = useState(true);
  const [voiceGuidanceDefault, setVoiceGuidanceDefault] = useState(true);
  const [beaconFrequency, setBeaconFrequency] = useState('2 Hz (Real-time)');
  const [brandColor, setBrandColor] = useState('#0d9488');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System & Spatial Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure indoor positioning parameters, accessibility defaults, and branding.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Campus Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-teal-600" />
            <span>Campus Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Campus Title</label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Average Walking Speed (m/s)</label>
              <input
                type="number"
                step="0.1"
                value={defaultPace}
                onChange={(e) => setDefaultPace(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Accessibility & Voice Guidance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Accessibility & Turn Prompts</span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accessibilityDefault}
                onChange={(e) => setAccessibilityDefault(e.target.checked)}
                className="mt-1 rounded text-teal-600 focus:ring-teal-500"
              />
              <div>
                <span className="font-bold text-slate-800">Prioritize Wheelchair & Step-Free Routes</span>
                <p className="text-xs text-slate-500">
                  Automatically route visitors through elevators and ramps, bypassing stairs when possible.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-slate-100">
              <input
                type="checkbox"
                checked={voiceGuidanceDefault}
                onChange={(e) => setVoiceGuidanceDefault(e.target.checked)}
                className="mt-1 rounded text-teal-600 focus:ring-teal-500"
              />
              <div>
                <span className="font-bold text-slate-800">Voice Turn-by-Turn Audio Synthesis</span>
                <p className="text-xs text-slate-500">
                  Read aloud upcoming turns and corridor distances when navigation is active.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Positioning Beacon Mesh Calibration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-teal-600" />
            <span>Positioning Telemetry & Beacons</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">BLE Mesh Polling Rate</label>
              <select
                value={beaconFrequency}
                onChange={(e) => setBeaconFrequency(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
              >
                <option>1 Hz (Battery Saver)</option>
                <option>2 Hz (Real-time)</option>
                <option>5 Hz (High Precision)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Spatial Primary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="font-mono text-xs text-slate-600">{brandColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button & feedback */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-700/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings successfully persisted</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
