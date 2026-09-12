import React, { useState } from 'react';
import {
  Navigation,
  ArrowRight,
  CornerUpRight,
  CornerUpLeft,
  MoveUp,
  ArrowUpCircle,
  Play,
  Pause,
  RotateCcw,
  X,
  Clock,
  Footprints,
  Layers,
  MapPin,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TurnDirection } from '../../types';

export const NavigationPanel: React.FC = () => {
  const {
    activeRoute,
    isNavigating,
    currentStepIndex,
    setCurrentStepIndex,
    isSimulatingWalk,
    startWalkingSimulation,
    pauseWalkingSimulation,
    stopNavigation,
    recalculateRoute,
    setIsSearchOpen,
  } = useApp();

  const [voiceGuidance, setVoiceGuidance] = useState(true);

  if (!isNavigating || !activeRoute) return null;

  const steps = activeRoute.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isFinished = currentStepIndex >= steps.length - 1;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'turn-right':
        return <CornerUpRight className="w-5 h-5 text-sky-500" />;
      case 'turn-left':
        return <CornerUpLeft className="w-5 h-5 text-sky-500" />;
      case 'stairs-up':
      case 'stairs-down':
        return <Layers className="w-5 h-5 text-emerald-500" />;
      case 'elevator':
        return <ArrowUpCircle className="w-5 h-5 text-purple-500" />;
      case 'arrive':
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      default:
        return <MoveUp className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div
      id="indoor-navigation-panel"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col"
    >
      {/* Primary Header: Destination + Distance & Time */}
      <div className="bg-slate-900 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            <span className="text-xs uppercase font-bold tracking-wider text-teal-300">
              Active Indoor Route
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setVoiceGuidance(!voiceGuidance)}
              title={voiceGuidance ? 'Mute Voice' : 'Enable Voice'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {voiceGuidance ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={stopNavigation}
              title="Exit Navigation"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Destination Title */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{activeRoute.targetRoom?.name || 'Destination'}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              CSE Block · {activeRoute.targetRoom ? `Floor ${activeRoute.targetRoom.floorLevel}` : '2nd Floor'}
            </p>
          </div>

          {/* Time & Distance Pill */}
          <div className="text-right shrink-0 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
            <div className="text-sm font-extrabold text-teal-300 flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.ceil(activeRoute.estimatedTimeSeconds / 60)} min</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {activeRoute.totalDistanceMeters} m total
            </div>
          </div>
        </div>
      </div>

      {/* Multi-floor Alert Banner if route traverses floors */}
      {activeRoute.multiFloor && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border-y border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
          <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Multi-Floor Route: Change Floor → Take Staircase → 2nd Floor</span>
        </div>
      )}

      {/* Active Instruction Card (Prominent Turn Card) */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
          <span>Current Step ({currentStepIndex + 1} of {steps.length})</span>
          {isSimulatingWalk && (
            <span className="text-teal-700 dark:text-teal-300 font-bold animate-pulse flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5" />
              Walking Simulation Active
            </span>
          )}
        </div>

        <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-teal-200/80 dark:border-teal-800/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center shrink-0 shadow-2xs">
            {getActionIcon(currentStep.action)}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {currentStep.instruction}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className="font-semibold text-teal-700 dark:text-teal-400">{currentStep.distanceMeters} m</span>
              <span>·</span>
              <span>{currentStep.floorName || '2nd Floor'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Route Progression Flow */}
      <div className="p-4 overflow-y-auto max-h-[220px] space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Turn-by-Turn Guidance
        </div>

        <div className="space-y-1.5">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-teal-50/90 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 font-semibold text-teal-950 dark:text-teal-200 shadow-2xs'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 line-through'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-teal-600 text-white'
                        : isCompleted
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span>{step.instruction}</span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                  {step.distanceMeters}m
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route Action Controls */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (isSimulatingWalk) {
              pauseWalkingSimulation();
            } else {
              startWalkingSimulation();
            }
          }}
          className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
            isSimulatingWalk
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {isSimulatingWalk ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Walk</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>{currentStepIndex > 0 ? 'Resume Walk' : 'Start Navigation'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={recalculateRoute}
          title="Recalculate Route"
          className="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Recalculate</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Change</span>
        </button>
      </div>
    </div>
  );
};
