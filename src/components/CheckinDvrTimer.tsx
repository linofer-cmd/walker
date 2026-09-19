import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  Video, 
  Eye, 
  SunMedium, 
  AlertCircle,
  BellOff,
  Check
} from 'lucide-react';
import { CheckinTimerState } from '../types';
import { soundManager } from '../utils/audio';

interface CheckinDvrTimerProps {
  timer: CheckinTimerState;
  onUpdateTimer: (updater: (prev: CheckinTimerState) => CheckinTimerState) => void;
  onAcknowledgeAndNextRound: () => void;
  activeStaffName: string;
  onOpenChecklist: () => void;
}

export const CheckinDvrTimer: React.FC<CheckinDvrTimerProps> = ({
  timer,
  onUpdateTimer,
  onAcknowledgeAndNextRound,
  activeStaffName,
  onOpenChecklist,
}) => {
  const isOverdue = timer.remainingSec <= 0 || timer.isBlinking;

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSec = Math.abs(seconds);
    const mins = Math.floor(absSec / 60);
    const secs = absSec % 60;
    const padded = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return isNegative ? `+${padded}` : padded;
  };

  const handleToggleTimer = () => {
    soundManager.playClick();
    onUpdateTimer(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
      // If user starts while blinking, stop blinking
      isBlinking: prev.remainingSec <= 0 ? false : prev.isBlinking,
    }));
  };

  const handleResetTimer = (durationSec?: number) => {
    soundManager.playClick();
    const dur = durationSec ?? timer.defaultDurationSec;
    onUpdateTimer(prev => ({
      ...prev,
      defaultDurationSec: dur,
      remainingSec: dur,
      isRunning: false,
      isBlinking: false,
    }));
  };

  const handleAddMinute = () => {
    soundManager.playClick();
    onUpdateTimer(prev => ({
      ...prev,
      remainingSec: prev.remainingSec + 60,
      isBlinking: (prev.remainingSec + 60) <= 0,
    }));
  };

  // Trigger simulated light blink for demonstration
  const handleTestLightBlink = () => {
    onUpdateTimer(prev => ({
      ...prev,
      isBlinking: !prev.isBlinking,
    }));
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, ((timer.defaultDurationSec - timer.remainingSec) / timer.defaultDurationSec) * 100)
  );

  return (
    <div 
      className={`rounded-2xl border transition-all duration-300 p-6 relative overflow-hidden bg-[#111217] shadow-xl ${
        isOverdue 
          ? 'animate-light-blink border-[#E6C887] ring-2 ring-[#D4AF37]/80' 
          : timer.isRunning 
          ? 'border-[#D4AF37]/60 shadow-[#D4AF37]/5' 
          : 'border-[#2B241A] hover:border-[#3E3426]'
      }`}
    >
      {/* Light blink visual ambient strobe behind container when blinking */}
      {isOverdue && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/20 via-[#E6C887]/10 to-transparent pointer-events-none animate-beacon-pulse" />
      )}

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            isOverdue 
              ? 'bg-[#D4AF37] text-[#0E0F12] animate-beacon-pulse' 
              : 'bg-gradient-to-br from-[#E6C887]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 text-[#E6C887]'
          }`}>
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-base sm:text-lg tracking-wider text-[#F5F3EE]">
                10-MINUTE CHECK-IN & DVR CHRONOMETER
              </h2>
              <span className={`text-[9px] uppercase font-telemetry tracking-widest px-2.5 py-0.5 rounded-full font-semibold border ${
                isOverdue 
                  ? 'bg-[#D4AF37] text-[#0E0F12] border-[#F5E6C8] font-bold animate-beacon-pulse' 
                  : timer.isRunning 
                  ? 'bg-[#D4AF37]/15 text-[#F5E6C8] border-[#D4AF37]/40' 
                  : 'bg-[#181920] text-[#8A857B] border-[#2B251D]'
              }`}>
                {isOverdue ? '⚡ LIGHT BLINK ACTIVE' : timer.isRunning ? 'COUNTDOWN RUNNING' : 'STANDBY'}
              </span>
            </div>
            <p className="text-xs text-[#A6A095] font-light">
              Assigned to: <span className="text-[#E6C887] font-semibold">{activeStaffName}</span> (Second Person • Check-in & DVR)
            </p>
          </div>
        </div>

        {/* Quick links & Test Light Blink */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestLightBlink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-telemetry border transition-all ${
              timer.isBlinking 
                ? 'bg-[#D4AF37] text-[#0E0F12] font-bold border-[#F5E6C8]' 
                : 'bg-[#16171E] text-[#D4AF37] hover:bg-[#20222B] border-[#3A3225]'
            }`}
            title="Test visual light blink effect"
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span>{timer.isBlinking ? 'Stop Test Blink' : 'Test Light Blink'}</span>
          </button>

          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#16171E] hover:bg-[#20222B] text-[#A6A095] hover:text-[#F5F3EE] border border-[#2B241A] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>SOP Checklist</span>
          </button>
        </div>
      </div>

      {/* VISUAL LIGHT BLINK BANNER (Shown when 10m reaches 0) */}
      {isOverdue && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#2A2315] border-2 border-[#D4AF37] text-[#F5E6C8] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-beacon-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37] text-[#0E0F12]">
              <SunMedium className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#F5E6C8] tracking-wide">
                10-MINUTE CHECK-IN & DVR ROUND COMPLETE
              </div>
              <div className="text-xs text-[#E6C887] font-telemetry flex items-center gap-1.5 mt-0.5">
                <BellOff className="w-3.5 h-3.5 text-emerald-400" />
                <span>Silent mode active: Only flashing visual light alert as requested</span>
              </div>
            </div>
          </div>

          <button
            onClick={onAcknowledgeAndNextRound}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E6C887] to-[#C5A880] text-[#0E0F12] font-display font-bold text-xs tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#0E0F12]" />
            <span>ACKNOWLEDGE & START NEXT ROUND</span>
          </button>
        </div>
      )}

      {/* Main Digital Clock Dial */}
      <div className="flex flex-col items-center justify-center my-4 py-6 rounded-2xl bg-gradient-to-b from-[#14151B] to-[#0E0F14] border border-[#2B241A] relative shadow-inner">
        <div className="flex items-center gap-2 text-[10px] uppercase font-telemetry tracking-[0.25em] text-[#8A857B] mb-1">
          <span>{isOverdue ? 'ROUND INTERVAL ELAPSED • LIGHT BLINK' : 'REMAINING CHECK-IN & DVR TIME'}</span>
          <span className="text-[#D4AF37]">•</span>
          <span className="text-[#E6C887] font-bold">ROUND {timer.currentRound} OF 9</span>
        </div>

        <div className={`font-telemetry font-bold text-6xl sm:text-7xl tracking-tight transition-colors ${
          isOverdue 
            ? 'text-[#F5E6C8] drop-shadow-[0_0_25px_rgba(212,175,55,0.7)] animate-beacon-pulse' 
            : timer.isRunning 
            ? 'text-[#F5E6C8] drop-shadow-[0_2px_15px_rgba(212,175,55,0.25)]' 
            : 'text-[#8A857B]'
        }`}>
          {formatTime(timer.remainingSec)}
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-[#8A857B] font-telemetry">
          <span>Total Rounds Completed in Shift: <strong className="text-[#D4AF37]">{timer.totalRoundsCompleted}</strong></span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <BellOff className="w-3 h-3" /> Silent Visual Alert
          </span>
        </div>

        {/* Luxury Gold Progress Rail */}
        <div className="w-full max-w-md h-2 bg-[#1C1D24] rounded-full mt-4 overflow-hidden border border-[#2B241A]">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              isOverdue 
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5E6C8]' 
                : 'bg-gradient-to-r from-[#8C6D2D] via-[#D4AF37] to-[#E6C887]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interval Presets */}
      <div className="flex items-center justify-between gap-1.5 mb-5 text-xs">
        <span className="text-[#8A857B] font-telemetry text-[10px] tracking-wider uppercase">Interval:</span>
        <div className="flex items-center gap-1.5">
          {[
            { label: '10m Standard', sec: 10 * 60 },
            { label: '5m Quick Audit', sec: 5 * 60 },
            { label: '15m Deep Check', sec: 15 * 60 },
          ].map(preset => (
            <button
              key={preset.sec}
              onClick={() => handleResetTimer(preset.sec)}
              className={`px-3 py-1 rounded-lg text-[11px] font-telemetry transition-all border ${
                timer.defaultDurationSec === preset.sec && !timer.isRunning
                  ? 'bg-[#D4AF37]/20 text-[#F5E6C8] border-[#D4AF37]/50 font-semibold'
                  : 'bg-[#15161D] text-[#8A857B] border-[#2B241A] hover:text-[#F5F3EE] hover:border-[#3E3426]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={handleToggleTimer}
          className={`col-span-2 py-3 rounded-xl font-display font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg ${
            timer.isRunning
              ? 'bg-[#1E1912] border border-[#D4AF37]/60 text-[#F5E6C8] hover:bg-[#282117]'
              : 'bg-gradient-to-r from-[#D4AF37] via-[#E6C887] to-[#C5A880] text-[#0E0F12] shadow-[#D4AF37]/15 hover:brightness-105'
          }`}
        >
          {timer.isRunning ? (
            <>
              <Pause className="w-4 h-4 text-[#D4AF37]" />
              <span>PAUSE 10M TIMER</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>START 10M TIMER</span>
            </>
          )}
        </button>

        <button
          onClick={handleAddMinute}
          title="Add 1 Minute"
          className="py-3 rounded-xl bg-[#16171E] hover:bg-[#20222B] text-[#F5F3EE] font-telemetry text-xs font-semibold border border-[#2B241A] hover:border-[#3E3426] flex items-center justify-center gap-1 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>+1m</span>
        </button>

        <button
          onClick={() => handleResetTimer()}
          title="Reset timer to 10 minutes"
          className="py-3 rounded-xl bg-[#16171E] hover:bg-[#20222B] text-[#8A857B] hover:text-[#F5F3EE] font-telemetry text-xs font-semibold border border-[#2B241A] hover:border-[#3E3426] flex items-center justify-center gap-1 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Complete / Next Round Action */}
      <div className="mt-4 pt-3 border-t border-[#201C16]">
        <button
          onClick={onAcknowledgeAndNextRound}
          className="w-full py-2.5 rounded-xl bg-[#14181F] hover:bg-[#1A202A] text-emerald-300 font-display font-semibold text-xs tracking-wider border border-emerald-800/40 hover:border-emerald-600 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>CONFIRM 10-MIN ROUND & LOG CHECK-IN / DVR AUDIT</span>
        </button>
      </div>
    </div>
  );
};
