import React, { useState } from 'react';
import { 
  Maximize2, 
  Video, 
  Play, 
  Pause, 
  Check, 
  Move,
  Users,
  SunMedium,
  BellOff
} from 'lucide-react';
import { CheckinTimerState, ShiftRotationState } from '../types';

interface FloatingMiniWindowProps {
  timer: CheckinTimerState;
  rotation: ShiftRotationState;
  activeStaffCheckinName: string;
  activeStaffFrontOfficeName: string;
  onToggleMiniMode: () => void;
  onToggleTimer: () => void;
  onAddMinute: () => void;
  onAcknowledgeAndNextRound: () => void;
}

export const FloatingMiniWindow: React.FC<FloatingMiniWindowProps> = ({
  timer,
  rotation,
  activeStaffCheckinName,
  activeStaffFrontOfficeName,
  onToggleMiniMode,
  onToggleTimer,
  onAddMinute,
  onAcknowledgeAndNextRound,
}) => {
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');

  const isBlinking = timer.remainingSec <= 0 || timer.isBlinking;

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSec = Math.abs(seconds);
    const mins = Math.floor(absSec / 60);
    const secs = absSec % 60;
    const padded = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return isNegative ? `+${padded}` : padded;
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-5 right-5';
      case 'bottom-left':
        return 'bottom-5 left-5';
      case 'top-right':
        return 'top-20 right-5';
      case 'top-left':
        return 'top-20 left-5';
    }
  };

  const cyclePosition = () => {
    const positions: Array<'bottom-right' | 'bottom-left' | 'top-left' | 'top-right'> = [
      'bottom-right',
      'bottom-left',
      'top-left',
      'top-right',
    ];
    const currentIndex = positions.indexOf(position);
    const nextIndex = (currentIndex + 1) % positions.length;
    setPosition(positions[nextIndex]);
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${getPositionClasses()}`}>
      <div className={`w-84 rounded-2xl bg-[#0E0F14]/95 backdrop-blur-md border shadow-2xl p-4 ${
        isBlinking ? 'animate-light-blink border-[#E6C887] ring-2 ring-[#D4AF37]/80' : 'border-[#2B241A]'
      }`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#201C16]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-display font-semibold text-xs tracking-wider text-[#F5F3EE]">
              FETS PRIVÉ HUD
            </span>
            {isBlinking && (
              <span className="text-[10px] font-telemetry bg-[#D4AF37] text-[#0E0F12] px-1.5 py-0.5 rounded font-bold animate-beacon-pulse flex items-center gap-1">
                <SunMedium className="w-3 h-3 animate-spin" />
                <span>LIGHT BLINK</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={cyclePosition}
              title="Dock to different corner"
              className="p-1 rounded text-[#8A857B] hover:text-[#F5F3EE] hover:bg-[#1D1E27]"
            >
              <Move className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleMiniMode}
              title="Restore Full Control Room Dashboard"
              className="p-1 rounded bg-gradient-to-r from-[#D4AF37] to-[#C5A880] text-[#0E0F12] hover:brightness-105 font-bold transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 10-Min Timer Row */}
        <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 mb-2.5 ${
          isBlinking 
            ? 'bg-[#2A2315] border-[#D4AF37] text-[#F5E6C8]' 
            : 'bg-[#15161D] border-[#252018] text-[#F5F3EE]'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isBlinking ? 'bg-[#D4AF37] text-[#0E0F12] animate-beacon-pulse' : 'bg-[#D4AF37]/15 text-[#E6C887]'}`}>
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-telemetry uppercase text-[#8A857B] flex items-center gap-1">
                <span>10M ROUND {timer.currentRound}/9</span>
                <span className="text-[#D4AF37] font-semibold">({activeStaffCheckinName})</span>
              </div>
              <div className={`font-telemetry font-bold text-xl tracking-tight ${
                isBlinking ? 'text-[#F5E6C8] font-extrabold animate-beacon-pulse' : timer.isRunning ? 'text-[#F5E6C8]' : 'text-[#8A857B]'
              }`}>
                {formatTime(timer.remainingSec)}
              </div>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleTimer}
              className="p-2 rounded-lg bg-[#1E1F2A] hover:bg-[#282937] text-[#F5F3EE] text-xs border border-[#352D21]"
            >
              {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={onAddMinute}
              title="+1 min"
              className="p-2 rounded-lg bg-[#1E1F2A] hover:bg-[#282937] text-[#D4AF37] text-[10px] font-telemetry font-bold border border-[#352D21]"
            >
              +1m
            </button>
            <button
              onClick={onAcknowledgeAndNextRound}
              title="Acknowledge and Next Round"
              className="p-2 rounded-lg bg-[#D4AF37] text-[#0E0F12] hover:brightness-110 font-bold"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rotation status summary */}
        <div className="p-2.5 rounded-xl bg-[#12131A] border border-[#23201B] flex items-center justify-between text-[10px] font-telemetry text-[#8A857B]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>90m Clock: <strong className="text-[#F5E6C8]">{Math.floor(rotation.remainingSec / 60)}m left</strong></span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <BellOff className="w-3 h-3" />
            <span>Silent Light Blink</span>
          </div>
        </div>
      </div>
    </div>
  );
};
