import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  AlertOctagon, 
  Building2, 
  Video, 
  CheckCheck, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ChecklistItem } from '../types';
import { soundManager } from '../utils/audio';

interface ChecklistsViewProps {
  checklists: ChecklistItem[];
  onUpdateItem: (id: string, status: 'passed' | 'failed' | 'pending') => void;
  onPassAll: (category: 'front_office' | 'checkin_dvr') => void;
  staffFrontOfficeName: string;
  staffCheckinDvrName: string;
}

export const ChecklistsView: React.FC<ChecklistsViewProps> = ({
  checklists,
  onUpdateItem,
  onPassAll,
  staffFrontOfficeName,
  staffCheckinDvrName,
}) => {
  const [activeCategory, setActiveCategory] = useState<'front_office' | 'checkin_dvr'>('front_office');

  const currentList = checklists.filter(i => i.category === activeCategory);
  const passedCount = currentList.filter(i => i.status === 'passed').length;
  const failedCount = currentList.filter(i => i.status === 'failed').length;
  const totalCount = currentList.length;
  const completionRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const handleItemToggle = (item: ChecklistItem) => {
    soundManager.playClick();
    const nextStatus = item.status === 'passed' ? 'pending' : 'passed';
    if (nextStatus === 'passed') {
      soundManager.playSuccess();
    }
    onUpdateItem(item.id, nextStatus);
  };

  const handleFlagDefect = (item: ChecklistItem) => {
    soundManager.playTone(400, 0.2, 'sawtooth');
    const nextStatus = item.status === 'failed' ? 'pending' : 'failed';
    onUpdateItem(item.id, nextStatus);
  };

  const handlePassAllClick = () => {
    soundManager.playSuccess();
    onPassAll(activeCategory);
  };

  const frontOfficePassed = checklists.filter(i => i.category === 'front_office' && i.status === 'passed').length;
  const frontOfficeTotal = checklists.filter(i => i.category === 'front_office').length;

  const checkinDvrPassed = checklists.filter(i => i.category === 'checkin_dvr' && i.status === 'passed').length;
  const checkinDvrTotal = checklists.filter(i => i.category === 'checkin_dvr').length;

  return (
    <div className="bg-[#111217] rounded-2xl border border-[#2B241A] p-6 flex flex-col h-full shadow-xl">
      {/* Header & Category Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#252018]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E6C887]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-display font-semibold text-base text-[#F5F3EE] tracking-wider">
              OPERATIONAL DUTY CHECKLISTS
            </h3>
          </div>
          <p className="text-xs text-[#A6A095] mt-1 font-light">
            Standard operating verification points for Front Office Admin and Check-in & DVR
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-[#0E0F14] p-1 rounded-xl border border-[#26211A]">
          <button
            onClick={() => { soundManager.playClick(); setActiveCategory('front_office'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'front_office' 
                ? 'bg-[#D4AF37]/15 text-[#F5E6C8] border border-[#D4AF37]/40 shadow-sm font-semibold' 
                : 'text-[#8A857B] hover:text-[#F5F3EE]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Front Office Admin ({frontOfficePassed}/{frontOfficeTotal})</span>
          </button>
          <button
            onClick={() => { soundManager.playClick(); setActiveCategory('checkin_dvr'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === 'checkin_dvr' 
                ? 'bg-[#C5A880]/15 text-[#F5E6C8] border border-[#C5A880]/40 shadow-sm font-semibold' 
                : 'text-[#8A857B] hover:text-[#F5F3EE]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Check-in & DVR ({checkinDvrPassed}/{checkinDvrTotal})</span>
          </button>
        </div>
      </div>

      {/* Assigned Staff Notice */}
      <div className="mt-3.5 mb-2 text-xs text-[#A6A095] flex items-center gap-2">
        <span className="text-[#8A857B] font-telemetry uppercase text-[10px]">Active Duty Operator:</span>
        <span className="text-[#E6C887] font-semibold">
          {activeCategory === 'front_office' ? staffFrontOfficeName : staffCheckinDvrName}
        </span>
        <span className="text-[#4A4235]">•</span>
        <span className="text-[11px] font-telemetry text-[#8A857B]">
          {activeCategory === 'front_office' 
            ? 'ID verifying, updating database and admin reports' 
            : 'Check-in entry points & 10-minute DVR health checks'}
        </span>
      </div>

      {/* Progress Metric Bar */}
      <div className="my-3 p-3.5 rounded-xl bg-[#0E0F14] border border-[#26211A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-xs text-[#A6A095] font-light">
            Verification Progress: <span className="text-[#E6C887] font-telemetry font-bold">{passedCount} of {totalCount} verified</span>
            {failedCount > 0 && (
              <span className="text-rose-400 font-telemetry font-bold ml-2">
                ({failedCount} flagged defect{failedCount > 1 ? 's' : ''})
              </span>
            )}
          </div>
          <div className="w-24 sm:w-36 h-2 bg-[#1C1D24] rounded-full overflow-hidden border border-[#2B241A]">
            <div 
              className="h-full bg-gradient-to-r from-[#8C6D2D] via-[#D4AF37] to-[#E6C887] transition-all duration-300 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <button
          onClick={handlePassAllClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#16171E] hover:bg-[#20222B] text-emerald-400 border border-emerald-900/40 hover:border-emerald-700 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mark All Category Passed</span>
        </button>
      </div>

      {/* Checkpoints List */}
      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[520px]">
        {currentList.map((item) => {
          const isPassed = item.status === 'passed';
          const isFailed = item.status === 'failed';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isPassed 
                  ? 'bg-[#12141A]/70 border-[#2A2A28] opacity-85' 
                  : isFailed
                  ? 'bg-rose-950/20 border-rose-800/80'
                  : 'bg-[#15161D] border-[#252018] hover:border-[#352D21]'
              }`}
            >
              <div 
                onClick={() => handleItemToggle(item)}
                className="flex items-start gap-3 cursor-pointer flex-1 select-none"
              >
                <div className="mt-0.5">
                  {isPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/60" />
                  ) : isFailed ? (
                    <AlertOctagon className="w-5 h-5 text-rose-500 fill-rose-950/60" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#4E473D] hover:text-[#D4AF37]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold font-display tracking-wide ${
                      isPassed ? 'line-through text-[#6E685E]' : 'text-[#F5F3EE]'
                    }`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-telemetry px-2 py-0.5 rounded bg-[#0E0F14] border border-[#2B241A] text-[#D4AF37] font-medium">
                      {item.zoneOrUnit}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A6A095] mt-1 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                <button
                  onClick={() => handleItemToggle(item)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    isPassed 
                      ? 'bg-emerald-950/80 border border-emerald-700/40 text-emerald-400' 
                      : 'bg-[#1D1E27] hover:bg-[#252732] border border-[#3A3225] text-[#F5F3EE]'
                  }`}
                >
                  {isPassed ? 'PASS ✓' : 'VERIFY'}
                </button>

                <button
                  onClick={() => handleFlagDefect(item)}
                  title="Flag defect"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                    isFailed
                      ? 'bg-rose-950 border border-rose-600 text-rose-300'
                      : 'bg-[#15161D] hover:bg-rose-950/40 border border-[#352D21] hover:border-rose-800 text-[#8A857B] hover:text-rose-300'
                  }`}
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">{isFailed ? 'FLAGGED' : 'FLAG'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="mt-4 pt-3 border-t border-[#252018] flex items-center justify-between text-[11px] text-[#8A857B]">
        <span className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
          Verifying front office access control and 10-minute check-in / DVR recorder integrity.
        </span>
        <span className="font-telemetry text-[#A6A095]">SOP V4.3 3-Staff Edition</span>
      </div>
    </div>
  );
};
