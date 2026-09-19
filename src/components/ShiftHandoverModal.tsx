import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Printer, 
  CheckCircle2, 
  X, 
  UserCheck, 
  Calendar,
  Clock,
  Video,
  Users
} from 'lucide-react';
import { ShiftSummary, ShiftRotationState, CheckinTimerState } from '../types';
import { soundManager } from '../utils/audio';

interface ShiftHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ShiftSummary;
  rotation: ShiftRotationState;
  checkinTimer: CheckinTimerState;
  sopVerifiedRatio: string;
  onSignOffAndReset: (nextShiftName: string, notes: string) => void;
}

export const ShiftHandoverModal: React.FC<ShiftHandoverModalProps> = ({
  isOpen,
  onClose,
  summary,
  rotation,
  checkinTimer,
  sopVerifiedRatio,
  onSignOffAndReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [briefing, setBriefing] = useState(summary.supervisorBriefing);
  const [equipmentNotes, setEquipmentNotes] = useState(summary.equipmentNotes);
  const [nextShiftName, setNextShiftName] = useState('Swing Shift (Bravo) - 14:00 to 22:00');

  if (!isOpen) return null;

  const staffNamesFormatted = rotation.staffList.map(s => s.name).join(', ');

  const generatePlainTextLog = () => {
    return `
=====================================================
FETS WALK & DVR - 3-STAFF SHIFT HANDOVER LOG
=====================================================
Shift Name: ${summary.shiftName}
Date: ${summary.date} (${summary.startTime} to ${summary.endTime})
Duty Staff Members: ${staffNamesFormatted}

--- OPERATIONAL 90M ROTATION & 10M ROUND METRICS ---
✓ 90-Minute Duty Rotations Completed: ${rotation.totalRotationsCompleted}
✓ 10-Minute Check-in & DVR Rounds Completed: ${checkinTimer.totalRoundsCompleted}
✓ SOP Verification Points Completed: ${sopVerifiedRatio}
✓ Notification Mode: Visual Light Blink (Silent Operation)

--- SUPERVISOR BRIEFING & EQUIPMENT DIRECTIVES ---
${briefing}

--- SYSTEM & DVR HARDWARE STATUS ---
${equipmentNotes}
=====================================================
Log Generated: ${new Date().toLocaleString()}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePlainTextLog());
    setCopied(true);
    soundManager.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSignOff = () => {
    soundManager.playSuccess();
    onSignOffAndReset(nextShiftName, briefing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#111217] border border-[#2B241A] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#252018]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#8C6D2D]/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C887]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[#F5F3EE] tracking-wide flex items-center gap-2">
                <span>SHIFT HANDOVER PROTOCOL</span>
                <span className="text-[10px] uppercase font-telemetry px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5E6C8]">
                  3-STAFF RECORD
                </span>
              </h3>
              <p className="text-xs text-[#A6A095] mt-0.5 font-light">
                Consolidated operational log for 90-minute duty handovers and 10-minute check-in rounds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A857B] hover:text-[#F5F3EE] hover:bg-[#1D1E27] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {/* Shift Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0E0F14] p-3.5 rounded-xl border border-[#252018]">
              <div className="flex items-center gap-1.5 text-[#8A857B] text-xs font-telemetry mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>ACTIVE SHIFT</span>
              </div>
              <div className="font-display font-semibold text-sm text-[#F5F3EE]">
                {summary.shiftName}
              </div>
              <div className="text-[11px] text-[#A6A095] font-telemetry mt-0.5">
                {summary.date} • {summary.startTime} - {summary.endTime}
              </div>
            </div>

            <div className="bg-[#0E0F14] p-3.5 rounded-xl border border-[#252018]">
              <div className="flex items-center gap-1.5 text-[#8A857B] text-xs font-telemetry mb-1">
                <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>3 ON-DUTY STAFF MEMBERS</span>
              </div>
              <div className="text-xs text-[#F5E6C8] font-semibold font-display">
                {staffNamesFormatted}
              </div>
              <div className="text-[10px] text-[#8A857B] font-telemetry mt-0.5">
                90-min rotational schedule
              </div>
            </div>
          </div>

          {/* Operational Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0E0F14] p-4 rounded-xl border border-[#252018] text-center">
              <div className="flex items-center justify-center gap-1 text-[#E6C887] mb-1">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-2xl font-bold font-telemetry">{rotation.totalRotationsCompleted}</span>
              </div>
              <div className="text-[11px] uppercase font-telemetry text-[#8A857B] font-medium">
                90m Rotations
              </div>
              <div className="text-[10px] text-emerald-400 font-telemetry mt-0.5">Executed on time</div>
            </div>

            <div className="bg-[#0E0F14] p-4 rounded-xl border border-[#252018] text-center">
              <div className="flex items-center justify-center gap-1 text-[#C5A880] mb-1">
                <Video className="w-4 h-4 text-[#C5A880]" />
                <span className="text-2xl font-bold font-telemetry">{checkinTimer.totalRoundsCompleted}</span>
              </div>
              <div className="text-[11px] uppercase font-telemetry text-[#8A857B] font-medium">
                10m Rounds
              </div>
              <div className="text-[10px] text-emerald-400 font-telemetry mt-0.5">Silent light-blink check</div>
            </div>

            <div className="bg-[#0E0F14] p-4 rounded-xl border border-[#252018] text-center">
              <div className="text-2xl font-bold font-telemetry text-[#F5E6C8] mb-1">
                {sopVerifiedRatio}
              </div>
              <div className="text-[11px] uppercase font-telemetry text-[#8A857B] font-medium">
                SOP Verified
              </div>
              <div className="text-[10px] text-emerald-400 font-telemetry mt-0.5">Admin & DVR Points</div>
            </div>
          </div>

          {/* Supervisor Briefing Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#F5F3EE] mb-1 font-display">
              Supervisor Briefing & Incoming Handover Directives
            </label>
            <textarea
              rows={3}
              value={briefing}
              onChange={e => setBriefing(e.target.value)}
              className="w-full bg-[#0E0F14] border border-[#252018] rounded-xl p-3 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37] leading-relaxed font-telemetry"
              placeholder="Detail scheduled technician visits, VIP arrivals, access gate maintenance..."
            />
          </div>

          {/* Next Shift Selection */}
          <div className="bg-[#0E0F14] p-3.5 rounded-xl border border-[#252018] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-[#A6A095]">
              <span className="font-semibold text-[#F5F3EE]">Prepare for Next Shift:</span>
            </div>
            <select
              value={nextShiftName}
              onChange={e => setNextShiftName(e.target.value)}
              className="bg-[#15161D] border border-[#352D21] rounded-lg px-3 py-1.5 text-xs text-[#F5F3EE] font-telemetry focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="Swing Shift (Bravo) - 14:00 to 22:00">Swing Shift (Bravo) - 14:00 to 22:00</option>
              <option value="Night Shift (Charlie) - 22:00 to 06:00">Night Shift (Charlie) - 22:00 to 06:00</option>
              <option value="Day Shift (Alpha) - 06:00 to 14:00">Day Shift (Alpha) - 06:00 to 14:00</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-[#252018]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                copied 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600' 
                  : 'bg-[#15161D] hover:bg-[#1E1F2A] text-[#F5F3EE] border-[#2B241A]'
              }`}
            >
              <Copy className="w-4 h-4 text-[#D4AF37]" />
              <span>{copied ? 'LOG COPIED TO CLIPBOARD!' : 'Copy Handover Log'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#15161D] hover:bg-[#1E1F2A] text-[#F5F3EE] border border-[#2B241A] transition-colors"
            >
              <Printer className="w-4 h-4 text-[#8A857B]" />
              <span>Print Manifest</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A857B] hover:text-[#F5F3EE]"
            >
              Keep Reviewing
            </button>
            <button
              onClick={handleSignOff}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-display bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-[#0E0F12] shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign Off & Transfer Shift</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
