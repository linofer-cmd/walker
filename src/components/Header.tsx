import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Monitor, 
  FileSpreadsheet, 
  Clock, 
  Compass, 
  CheckSquare, 
  Users, 
  SunMedium,
  BellOff
} from 'lucide-react';

export type MainTabType = 'cockpit' | 'checklists';

interface HeaderProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onOpenHandover: () => void;
  isMiniMode: boolean;
  onToggleMiniMode: () => void;
  verifiedSopRatio: string;
  activeStaffCheckinName: string;
  isLightBlinking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenHandover,
  onToggleMiniMode,
  verifiedSopRatio,
  activeStaffCheckinName,
  isLightBlinking,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#0D0E12]/95 backdrop-blur-md border-b border-[#2A241C] sticky top-0 z-30 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top Tier: Brand Identity, Chronometer, Audio & Modals */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand Crest */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6C887] via-[#D4AF37] to-[#8C6D2D] p-[1px] shadow-lg shadow-[#D4AF37]/10 flex items-center justify-center">
                <div className="w-full h-full bg-[#121318] rounded-[11px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#E6C887]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-lg tracking-widest text-[#F5F3EE]">
                    FETS <span className="text-[#D4AF37] font-normal">PRIVÉ</span>
                  </span>
                  <span className="text-[9px] uppercase font-telemetry tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E6C887] font-semibold">
                    3-STAFF COCKPIT
                  </span>
                </div>
                <p className="text-[11px] text-[#A6A095] tracking-wide font-light hidden sm:block">
                  90m Rotation • 10m Check-in & DVR Column • Silent Light Alert
                </p>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-[#26211A] text-[11px] text-[#A6A095] font-telemetry">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>ON 10M ROUND: <strong className="text-[#E6C887]">{activeStaffCheckinName}</strong></span>
            </div>
          </div>

          {/* Precision Telemetry Clock */}
          <div className="flex items-center gap-3 bg-[#13141A] border border-[#2B251D] px-4 py-1.5 rounded-xl shadow-inner">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <div className="flex items-baseline gap-2">
              <span className="font-telemetry font-bold text-base text-[#F5E6C8] tracking-widest drop-shadow-[0_1px_8px_rgba(212,175,55,0.2)]">
                {currentTime || '--:--:--'}
              </span>
              <span className="text-[10px] font-telemetry text-[#8A857B] hidden sm:inline tracking-wider">
                {utcTime}
              </span>
            </div>
          </div>

          {/* Quick Actions (Mini HUD, Shift Handover) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            {/* Visual Light Alert Badge */}
            <div className="flex items-center gap-1.5 bg-[#13141A] px-2.5 py-1 rounded-xl border border-[#2B251D] text-[11px] text-[#A6A095] font-telemetry">
              <BellOff className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Visual Alert</span>
              {isLightBlinking && (
                <span className="flex items-center gap-1 text-[#D4AF37] font-bold animate-beacon-pulse">
                  <SunMedium className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                  <span>BLINKING</span>
                </span>
              )}
            </div>

            {/* Mini HUD Button */}
            <button
              onClick={onToggleMiniMode}
              title="Mini floating HUD"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#13141A] border border-[#2B251D] text-[#A6A095] hover:text-[#F5F3EE] hover:bg-[#1B1C22] transition-colors"
            >
              <Monitor className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Mini HUD</span>
            </button>

            {/* Shift Handover Button */}
            <button
              onClick={onOpenHandover}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D4AF37] via-[#E6C887] to-[#C5A880] text-[#0E0F12] font-display tracking-wider shadow-md shadow-[#D4AF37]/15 hover:brightness-105 transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#0E0F12]" />
              <span>Shift Handover</span>
            </button>
          </div>
        </div>

        {/* Bottom Tier: Main Menus */}
        <nav aria-label="Main Navigation" className="flex items-center justify-between border-t border-[#201C16] pt-2">
          <div className="flex items-center gap-2">
            {/* 1. Cockpit */}
            <button
              onClick={() => onSelectTab('cockpit')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                activeTab === 'cockpit'
                  ? 'bg-gradient-to-r from-[#2A2318] to-[#1E1912] border border-[#D4AF37]/50 text-[#F5E6C8] font-semibold shadow-sm'
                  : 'text-[#8A857B] hover:text-[#D4AF37] hover:bg-[#16171D] border border-transparent'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${activeTab === 'cockpit' ? 'text-[#D4AF37]' : 'text-[#605A50]'}`} />
              <span>FRONT PAGE • COCKPIT</span>
            </button>

            {/* 2. SOP Checklists */}
            <button
              onClick={() => onSelectTab('checklists')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                activeTab === 'checklists'
                  ? 'bg-gradient-to-r from-[#2A2318] to-[#1E1912] border border-[#D4AF37]/50 text-[#F5E6C8] font-semibold shadow-sm'
                  : 'text-[#8A857B] hover:text-[#D4AF37] hover:bg-[#16171D] border border-transparent'
              }`}
            >
              <CheckSquare className={`w-3.5 h-3.5 ${activeTab === 'checklists' ? 'text-[#D4AF37]' : 'text-[#605A50]'}`} />
              <span>DUTY CHECKLISTS</span>
              <span className="text-[10px] font-telemetry px-1.5 py-0.2 rounded bg-[#16171D] border border-[#2B241A] text-[#D4AF37]">
                {verifiedSopRatio} VERIFIED
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-telemetry text-[#8A857B] tracking-wider uppercase">
            <span>ROTATION: 90 MIN</span>
            <span>•</span>
            <span>10 MIN CHECK-IN & DVR COLUMN</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
