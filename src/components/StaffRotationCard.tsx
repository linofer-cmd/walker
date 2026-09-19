import React, { useState } from 'react';
import { 
  Users, 
  RotateCw, 
  Play, 
  Pause, 
  RotateCcw, 
  Edit3, 
  Check, 
  Clock, 
  Building2, 
  Video, 
  Coffee,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ShiftRotationState, StaffMember } from '../types';
import { soundManager } from '../utils/audio';

interface StaffRotationCardProps {
  rotation: ShiftRotationState;
  onUpdateRotation: (updater: (prev: ShiftRotationState) => ShiftRotationState) => void;
  onManualRotate: () => void;
  onUpdateStaffNames: (names: [string, string, string]) => void;
}

export const StaffRotationCard: React.FC<StaffRotationCardProps> = ({
  rotation,
  onUpdateRotation,
  onManualRotate,
  onUpdateStaffNames,
}) => {
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [editedNames, setEditedNames] = useState<[string, string, string]>([
    rotation.staffList[0]?.name || 'Staff 1',
    rotation.staffList[1]?.name || 'Staff 2',
    rotation.staffList[2]?.name || 'Staff 3',
  ]);

  // Roles assignment based on rotation index
  // Person 1 (Front Office), Person 2 (Check in & DVR), Person 3 (Standby)
  const staffA = rotation.staffList[rotation.currentIndex % 3];
  const staffB = rotation.staffList[(rotation.currentIndex + 1) % 3];
  const staffC = rotation.staffList[(rotation.currentIndex + 2) % 3];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSaveNames = () => {
    onUpdateStaffNames(editedNames);
    setIsEditingNames(false);
    soundManager.playClick();
  };

  const toggleRotationTimer = () => {
    soundManager.playClick();
    onUpdateRotation(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetRotationTimer = () => {
    soundManager.playClick();
    onUpdateRotation(prev => ({
      ...prev,
      remainingSec: prev.rotationDurationSec,
      isRunning: false,
    }));
  };

  const progressPercent = Math.max(
    0,
    Math.min(100, ((rotation.rotationDurationSec - rotation.remainingSec) / rotation.rotationDurationSec) * 100)
  );

  return (
    <div className="bg-[#111217] rounded-2xl border border-[#2B241A] p-5 lg:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle Luxury Gold Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Title, 90-Min Countdown & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-[#252018]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E6C887]/20 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C887]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-base sm:text-lg text-[#F5F3EE] tracking-wide">
                3-STAFF 90-MINUTE DUTY ROTATION
              </h2>
              <span className="text-[9px] uppercase font-telemetry tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5E6C8] font-semibold">
                90M CYCLE
              </span>
            </div>
            <p className="text-xs text-[#A6A095] mt-0.5 font-light">
              Automatic role handover every 90 minutes between the 3 duty staff members
            </p>
          </div>
        </div>

        {/* 90-min master countdown & rotation trigger */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="bg-[#0E0F14] border border-[#2B251D] px-3.5 py-1.5 rounded-xl flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <div className="text-[9px] uppercase font-telemetry text-[#8A857B] tracking-wider">
                Rotation Clock
              </div>
              <div className="text-base font-bold font-telemetry text-[#F5E6C8] tracking-wider">
                {formatTime(rotation.remainingSec)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleRotationTimer}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                rotation.isRunning
                  ? 'bg-[#1C1812] border-[#D4AF37]/50 text-[#F5E6C8]'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A880] text-[#0E0F12] hover:brightness-105'
              }`}
              title={rotation.isRunning ? "Pause 90m rotation timer" : "Start 90m rotation timer"}
            >
              {rotation.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={resetRotationTimer}
              title="Reset 90m timer"
              className="p-2 rounded-xl bg-[#16171E] hover:bg-[#20222B] text-[#8A857B] hover:text-[#F5F3EE] border border-[#2B241A] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onManualRotate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1C1D27] hover:bg-[#252735] text-[#D4AF37] border border-[#3A3225] hover:border-[#D4AF37]/60 transition-all shadow-sm"
              title="Rotate positions to next staff member"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* 90-minute cycle progress bar */}
      <div className="mb-5 bg-[#0E0F14] p-3 rounded-xl border border-[#252018]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[#8A857B] font-telemetry uppercase text-[10px] tracking-wider">
              90-Minute Duty Progress:
            </span>
            <span className="text-[#E6C887] font-telemetry font-bold">
              {Math.floor((rotation.rotationDurationSec - rotation.remainingSec) / 60)}m / 90m
            </span>
          </div>
          <div className="text-[11px] text-[#A6A095] font-telemetry">
            Completed 90m Shifts: <span className="text-[#D4AF37] font-bold">{rotation.totalRotationsCompleted}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-[#1C1D24] rounded-full overflow-hidden border border-[#2B241A]">
          <div
            className="h-full bg-gradient-to-r from-[#8C6D2D] via-[#D4AF37] to-[#E6C887] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Staff Name Editing Trigger */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#A6A095] uppercase font-telemetry tracking-wider">
          Active Station Duty Assignments
        </span>
        <button
          onClick={() => {
            if (isEditingNames) {
              handleSaveNames();
            } else {
              setIsEditingNames(true);
            }
          }}
          className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F5E6C8] transition-colors"
        >
          {isEditingNames ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Save Names</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Staff Names</span>
            </>
          )}
        </button>
      </div>

      {/* Inline Staff Name Editor (Shown when user clicks Edit Staff Names) */}
      {isEditingNames && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#0E0F14] border border-[#D4AF37]/40 grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-fadeIn">
          <div>
            <label className="text-[10px] font-telemetry text-[#8A857B] uppercase block mb-1">
              Staff Member 1:
            </label>
            <input
              type="text"
              value={editedNames[0]}
              onChange={e => setEditedNames([e.target.value, editedNames[1], editedNames[2]])}
              className="w-full bg-[#15161D] border border-[#3A3225] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37] font-telemetry"
              placeholder="e.g. Marcus Vance"
            />
          </div>
          <div>
            <label className="text-[10px] font-telemetry text-[#8A857B] uppercase block mb-1">
              Staff Member 2:
            </label>
            <input
              type="text"
              value={editedNames[1]}
              onChange={e => setEditedNames([editedNames[0], e.target.value, editedNames[2]])}
              className="w-full bg-[#15161D] border border-[#3A3225] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37] font-telemetry"
              placeholder="e.g. Elena Rostova"
            />
          </div>
          <div>
            <label className="text-[10px] font-telemetry text-[#8A857B] uppercase block mb-1">
              Staff Member 3:
            </label>
            <input
              type="text"
              value={editedNames[2]}
              onChange={e => setEditedNames([editedNames[0], editedNames[1], e.target.value])}
              className="w-full bg-[#15161D] border border-[#3A3225] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37] font-telemetry"
              placeholder="e.g. Darius Thorne"
            />
          </div>
        </div>
      )}

      {/* The 3 Active Role Stations (Front Office, Check-in & DVR, Standby) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* ROLE 1: Front Office */}
        <div className="p-4 rounded-xl bg-[#0E0F14] border border-[#D4AF37]/50 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-telemetry uppercase tracking-widest px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#E6C887] font-bold border border-[#D4AF37]/30">
              FIRST PERSON • STATION 1
            </span>
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <h3 className="font-display font-semibold text-sm text-[#F5F3EE] tracking-wide mb-1">
            FRONT OFFICE
          </h3>

          <div className="text-base font-bold text-[#E6C887] font-display flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{staffA?.name || 'Staff 1'}</span>
          </div>

          <p className="text-[11px] text-[#A6A095] leading-relaxed font-light">
            ID verifying, updating database and other reports in the admin system.
          </p>

          <div className="mt-3 pt-2 border-t border-[#201C16] flex items-center justify-between text-[10px] font-telemetry text-[#8A857B]">
            <span>Current: Active on Admin Desk</span>
            <span className="text-[#D4AF37]">90m Shift</span>
          </div>
        </div>

        {/* ROLE 2: Check-in and DVR */}
        <div className="p-4 rounded-xl bg-[#0E0F14] border border-[#C5A880]/50 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-telemetry uppercase tracking-widest px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#F5E6C8] font-bold border border-[#C5A880]/30">
              SECOND PERSON • STATION 2
            </span>
            <Video className="w-4 h-4 text-[#C5A880]" />
          </div>

          <h3 className="font-display font-semibold text-sm text-[#F5F3EE] tracking-wide mb-1">
            CHECK-IN & DVR
          </h3>

          <div className="text-base font-bold text-[#F5E6C8] font-display flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>{staffB?.name || 'Staff 2'}</span>
          </div>

          <p className="text-[11px] text-[#A6A095] leading-relaxed font-light">
            Check in and DVR verification, active 10-minute inspection intervals & light-blink check.
          </p>

          <div className="mt-3 pt-2 border-t border-[#201C16] flex items-center justify-between text-[10px] font-telemetry text-[#8A857B]">
            <span>Active on 10-min Inspection</span>
            <span className="text-[#C5A880]">90m Shift</span>
          </div>
        </div>

        {/* ROLE 3: Standby / Relief */}
        <div className="p-4 rounded-xl bg-[#0E0F14] border border-[#2B241A] shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-telemetry uppercase tracking-widest px-2 py-0.5 rounded bg-[#1A1B22] text-[#8A857B] font-bold border border-[#2B251D]">
              THIRD PERSON • STANDBY
            </span>
            <Coffee className="w-4 h-4 text-[#8A857B]" />
          </div>

          <h3 className="font-display font-semibold text-sm text-[#A6A095] tracking-wide mb-1">
            STANDBY / RELIEVER
          </h3>

          <div className="text-base font-bold text-[#A6A095] font-display flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-sky-400/80" />
            <span>{staffC?.name || 'Staff 3'}</span>
          </div>

          <p className="text-[11px] text-[#8A857B] leading-relaxed font-light">
            Scheduled rest break / relief reserve. Next in line to rotate into Front Office.
          </p>

          <div className="mt-3 pt-2 border-t border-[#201C16] flex items-center justify-between text-[10px] font-telemetry text-[#8A857B]">
            <span>Incoming Next: Front Office</span>
            <span className="text-sky-400">Standby</span>
          </div>
        </div>
      </div>

      {/* Next upcoming rotation preview */}
      <div className="mt-4 pt-3 border-t border-[#201C16] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#8A857B] gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>
            When 90m completes: <strong className="text-[#F5F3EE]">{staffC?.name}</strong> rotates to Front Office, <strong className="text-[#F5F3EE]">{staffA?.name}</strong> to Check-in & DVR.
          </span>
        </div>
        <div className="font-telemetry text-[11px] text-[#A6A095]">
          Handover Interval: 90 Minutes (Auto-Rotates)
        </div>
      </div>
    </div>
  );
};
