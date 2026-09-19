import React, { useState } from 'react';
import { 
  Video, 
  CheckCircle2, 
  AlertOctagon, 
  HardDrive, 
  Clock, 
  CheckCheck, 
  Search, 
  ShieldCheck,
  CircleDot
} from 'lucide-react';
import { DvrUnit } from '../types';
import { soundManager } from '../utils/audio';

interface DvrColumnProps {
  dvrUnits: DvrUnit[];
  onToggleUnitStatus: (id: string, newStatus: 'verified' | 'pending' | 'flagged') => void;
  onVerifyAllUnits: () => void;
  assignedStaffName: string;
}

export const DvrColumn: React.FC<DvrColumnProps> = ({
  dvrUnits,
  onToggleUnitStatus,
  onVerifyAllUnits,
  assignedStaffName,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const verifiedCount = dvrUnits.filter(u => u.status === 'verified').length;
  const flaggedCount = dvrUnits.filter(u => u.status === 'flagged').length;
  const totalUnits = dvrUnits.length;
  const percentVerified = totalUnits > 0 ? Math.round((verifiedCount / totalUnits) * 100) : 0;

  const filteredUnits = dvrUnits.filter(unit => {
    const matchesFilter = filter === 'all' ? true : unit.status === filter;
    const matchesSearch = 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.coverageZone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUnitVerify = (unit: DvrUnit) => {
    soundManager.playSuccess();
    const nextStatus = unit.status === 'verified' ? 'pending' : 'verified';
    onToggleUnitStatus(unit.id, nextStatus);
  };

  const handleUnitFlag = (unit: DvrUnit) => {
    soundManager.playTone(380, 0.2, 'sawtooth');
    const nextStatus = unit.status === 'flagged' ? 'pending' : 'flagged';
    onToggleUnitStatus(unit.id, nextStatus);
  };

  return (
    <div className="bg-[#111217] rounded-2xl border border-[#2B241A] p-6 flex flex-col h-full shadow-xl relative overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Column Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#252018]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#8C6D2D]/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C887]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-base sm:text-lg tracking-wider text-[#F5F3EE]">
                DVR & NVR AUDIT COLUMN
              </h2>
              <span className="text-[9px] uppercase font-telemetry tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5E6C8] font-semibold">
                {verifiedCount}/{totalUnits} AUDITED
              </span>
            </div>
            <p className="text-xs text-[#A6A095] font-light">
              Auditor on duty: <span className="text-[#E6C887] font-semibold">{assignedStaffName}</span> (Second Person • Check-in & DVR)
            </p>
          </div>
        </div>

        {/* Audit All button */}
        <button
          onClick={() => {
            soundManager.playSuccess();
            onVerifyAllUnits();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#16171E] hover:bg-[#20222B] text-emerald-400 border border-emerald-900/40 hover:border-emerald-700 transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audit All Normal</span>
        </button>
      </div>

      {/* Progress & Quick Metrics Bar */}
      <div className="mb-4 p-3 rounded-xl bg-[#0E0F14] border border-[#252018] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-[#8A857B] font-telemetry uppercase text-[10px]">
            DVR Health Coverage:
          </span>
          <span className="text-[#E6C887] font-telemetry font-bold">
            {percentVerified}% ({verifiedCount} of {totalUnits} Units)
          </span>
          {flaggedCount > 0 && (
            <span className="text-rose-400 font-telemetry font-bold">
              • {flaggedCount} Flagged
            </span>
          )}
        </div>

        <div className="w-full sm:w-36 h-2 bg-[#1C1D24] rounded-full overflow-hidden border border-[#2B241A]">
          <div
            className="h-full bg-gradient-to-r from-[#8C6D2D] via-[#D4AF37] to-[#E6C887] transition-all duration-300 rounded-full"
            style={{ width: `${percentVerified}%` }}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[140px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A857B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search DVR units..."
            className="w-full bg-[#0E0F14] border border-[#252018] rounded-lg pl-8 pr-2.5 py-1 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37] font-telemetry"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1">
          {(['all', 'pending', 'verified', 'flagged'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-telemetry uppercase tracking-wider transition-colors border ${
                filter === tab
                  ? 'bg-[#D4AF37]/20 text-[#F5E6C8] border-[#D4AF37]/50 font-bold'
                  : 'bg-[#0E0F14] text-[#8A857B] border-[#252018] hover:text-[#F5F3EE]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* DVR Units List */}
      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[460px]">
        {filteredUnits.length === 0 ? (
          <div className="text-center py-8 text-[#8A857B] text-xs font-telemetry">
            No DVR units match the selected criteria.
          </div>
        ) : (
          filteredUnits.map(unit => {
            const isVerified = unit.status === 'verified';
            const isFlagged = unit.status === 'flagged';

            return (
              <div
                key={unit.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isVerified
                    ? 'bg-[#12141A]/70 border-[#2A2A28] opacity-90'
                    : isFlagged
                    ? 'bg-rose-950/25 border-rose-800/80 shadow-inner'
                    : 'bg-[#15161D] border-[#252018] hover:border-[#3A3225]'
                }`}
              >
                {/* Unit Details */}
                <div 
                  onClick={() => handleUnitVerify(unit)}
                  className="flex items-start gap-3 cursor-pointer select-none flex-1"
                >
                  <div className="mt-0.5 shrink-0">
                    {isVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/60" />
                    ) : isFlagged ? (
                      <AlertOctagon className="w-5 h-5 text-rose-500 fill-rose-950/60" />
                    ) : (
                      <CircleDot className="w-5 h-5 text-[#8A857B] hover:text-[#D4AF37]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-xs tracking-wider text-[#F5F3EE]">
                        {unit.name}
                      </span>
                      <span className="text-[10px] font-telemetry px-1.5 py-0.2 rounded bg-[#0E0F14] border border-[#2B241A] text-[#D4AF37]">
                        {unit.channelCount} CH
                      </span>
                      <span className="text-[10px] font-telemetry px-1.5 py-0.2 rounded bg-[#0E0F14] border border-[#2B241A] text-emerald-400 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{unit.retentionDays}d HDD OK</span>
                      </span>
                      {unit.lastCheckedTime && (
                        <span className="text-[10px] font-telemetry text-[#8A857B] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Audited: {unit.lastCheckedTime}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A6A095] mt-1 font-light leading-relaxed">
                      {unit.coverageZone}
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleUnitVerify(unit)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold font-display tracking-wider transition-colors ${
                      isVerified
                        ? 'bg-emerald-950/90 border border-emerald-700/50 text-emerald-300'
                        : 'bg-[#1E1F2A] hover:bg-[#282937] border border-[#3A3225] text-[#F5F3EE]'
                    }`}
                  >
                    {isVerified ? 'VERIFIED ✓' : 'VERIFY'}
                  </button>

                  <button
                    onClick={() => handleUnitFlag(unit)}
                    title="Flag DVR issue (e.g. video loss or frozen timestamp)"
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                      isFlagged
                        ? 'bg-rose-950 border-rose-600 text-rose-300'
                        : 'bg-[#15161D] hover:bg-rose-950/40 border-[#2B241A] hover:border-rose-800 text-[#8A857B] hover:text-rose-300'
                    }`}
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    <span className="sr-only">Flag</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[#252018] flex items-center justify-between text-[11px] text-[#8A857B]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Recorder S.M.A.R.T. audit & timestamp synchronicity checked</span>
        </span>
        <span className="font-telemetry text-[#A6A095]">8 Matrix Recorders</span>
      </div>
    </div>
  );
};
