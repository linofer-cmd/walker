/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, MainTabType } from './components/Header';
import { StaffRotationCard } from './components/StaffRotationCard';
import { CheckinDvrTimer } from './components/CheckinDvrTimer';
import { DvrColumn } from './components/DvrColumn';
import { ChecklistsView } from './components/ChecklistsView';
import { ShiftHandoverModal } from './components/ShiftHandoverModal';
import { FloatingMiniWindow } from './components/FloatingMiniWindow';
import { 
  ShiftRotationState, 
  CheckinTimerState, 
  ChecklistItem, 
  ShiftSummary, 
  AudioSettings,
  DvrUnit
} from './types';
import { 
  INITIAL_ROTATION_STATE, 
  INITIAL_CHECKIN_TIMER, 
  INITIAL_CHECKLISTS, 
  INITIAL_SHIFT_SUMMARY, 
  INITIAL_AUDIO_SETTINGS,
  INITIAL_DVR_UNITS,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage
} from './utils/storage';
import { soundManager } from './utils/audio';
import { BellOff, Monitor } from 'lucide-react';

export default function App() {
  // Load persistent state
  const [rotationState, setRotationState] = useState<ShiftRotationState>(() =>
    loadFromStorage(STORAGE_KEYS.ROTATION_STATE, INITIAL_ROTATION_STATE)
  );

  const [checkinTimer, setCheckinTimer] = useState<CheckinTimerState>(() =>
    loadFromStorage(STORAGE_KEYS.CHECKIN_TIMER, INITIAL_CHECKIN_TIMER)
  );

  const [dvrUnits, setDvrUnits] = useState<DvrUnit[]>(() =>
    loadFromStorage(STORAGE_KEYS.DVR_UNITS, INITIAL_DVR_UNITS)
  );

  const [checklists, setChecklists] = useState<ChecklistItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.CHECKLISTS, INITIAL_CHECKLISTS)
  );

  const [shiftSummary, setShiftSummary] = useState<ShiftSummary>(() =>
    loadFromStorage(STORAGE_KEYS.SHIFT_STATS, INITIAL_SHIFT_SUMMARY)
  );

  const [audioSettings] = useState<AudioSettings>(() =>
    loadFromStorage(STORAGE_KEYS.AUDIO_SETTINGS, INITIAL_AUDIO_SETTINGS)
  );

  // Main navigation tab - front page is minimal cockpit
  const [activeTab, setActiveTab] = useState<MainTabType>('cockpit');

  // UI view modes
  const [isMiniMode, setIsMiniMode] = useState<boolean>(false);
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ROTATION_STATE, rotationState);
  }, [rotationState]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHECKIN_TIMER, checkinTimer);
  }, [checkinTimer]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DVR_UNITS, dvrUnits);
  }, [dvrUnits]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHECKLISTS, checklists);
  }, [checklists]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SHIFT_STATS, shiftSummary);
  }, [shiftSummary]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AUDIO_SETTINGS, audioSettings);
    // User requested NO ALARM, only visual light blink
    soundManager.setMuted(true);
  }, [audioSettings]);

  // Master 90-Minute Rotation Countdown
  useEffect(() => {
    let interval: number | undefined;
    if (rotationState.isRunning) {
      interval = window.setInterval(() => {
        setRotationState(prev => {
          const nextSec = prev.remainingSec - 1;
          if (nextSec <= 0) {
            // 90 minutes completed -> Rotate to next person!
            const nextIndex = (prev.currentIndex + 1) % 3;
            soundManager.playSuccess();
            // Reset 10-minute round counter for new rotation block
            setCheckinTimer(ct => ({
              ...ct,
              currentRound: 1,
              remainingSec: ct.defaultDurationSec,
              isBlinking: false,
            }));

            return {
              ...prev,
              currentIndex: nextIndex,
              remainingSec: prev.rotationDurationSec,
              totalRotationsCompleted: prev.totalRotationsCompleted + 1,
            };
          }
          return { ...prev, remainingSec: nextSec };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rotationState.isRunning]);

  // 10-Minute Check-in & DVR Timer Countdown
  useEffect(() => {
    let interval: number | undefined;
    if (checkinTimer.isRunning) {
      interval = window.setInterval(() => {
        setCheckinTimer(prev => {
          const nextSec = prev.remainingSec - 1;
          if (nextSec <= 0) {
            // 10 minutes elapsed -> Trigger VISUAL LIGHT BLINK (No audio alarm!)
            return {
              ...prev,
              remainingSec: 0,
              isRunning: false,
              isBlinking: true, // activates screen light blink
            };
          }
          return { ...prev, remainingSec: nextSec };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkinTimer.isRunning]);

  // Manual rotation to next staff member
  const handleManualRotate = () => {
    soundManager.playSuccess();
    setRotationState(prev => {
      const nextIndex = (prev.currentIndex + 1) % 3;
      return {
        ...prev,
        currentIndex: nextIndex,
        remainingSec: prev.rotationDurationSec,
        totalRotationsCompleted: prev.totalRotationsCompleted + 1,
      };
    });
    // Reset round counter for new rotation block
    setCheckinTimer(prev => ({
      ...prev,
      currentRound: 1,
      remainingSec: prev.defaultDurationSec,
      isBlinking: false,
    }));
  };

  // Update staff names
  const handleUpdateStaffNames = (newNames: [string, string, string]) => {
    setRotationState(prev => ({
      ...prev,
      staffList: [
        { id: prev.staffList[0]?.id || 'staff-1', name: newNames[0] || 'Staff 1' },
        { id: prev.staffList[1]?.id || 'staff-2', name: newNames[1] || 'Staff 2' },
        { id: prev.staffList[2]?.id || 'staff-3', name: newNames[2] || 'Staff 3' },
      ],
    }));
  };

  // Acknowledge 10-minute round and start next round
  const handleAcknowledgeAndNextRound = () => {
    soundManager.playSuccess();
    setCheckinTimer(prev => {
      const nextRound = prev.currentRound < 9 ? prev.currentRound + 1 : 1;
      return {
        ...prev,
        isBlinking: false,
        remainingSec: prev.defaultDurationSec,
        isRunning: true,
        currentRound: nextRound,
        totalRoundsCompleted: prev.totalRoundsCompleted + 1,
      };
    });

    setShiftSummary(prev => ({
      ...prev,
      total10mRounds: prev.total10mRounds + 1,
    }));
  };

  // DVR Unit Status Toggle
  const handleToggleUnitStatus = (id: string, newStatus: 'verified' | 'pending' | 'flagged') => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setDvrUnits(prev =>
      prev.map(unit =>
        unit.id === id
          ? {
              ...unit,
              status: newStatus,
              lastCheckedTime: newStatus === 'verified' ? timeNow : unit.lastCheckedTime,
            }
          : unit
      )
    );
  };

  // Mark all DVR units verified
  const handleVerifyAllUnits = () => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setDvrUnits(prev =>
      prev.map(unit => ({
        ...unit,
        status: 'verified' as const,
        lastCheckedTime: timeNow,
      }))
    );
  };

  // Checklist updates
  const handleUpdateChecklistItem = (id: string, status: 'passed' | 'failed' | 'pending') => {
    setChecklists(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const handlePassAllChecklist = (category: 'front_office' | 'checkin_dvr') => {
    setChecklists(prev => prev.map(item => item.category === category ? { ...item, status: 'passed' as const } : item));
  };

  // Handover reset
  const handleSignOffAndReset = (nextShiftName: string, notes: string) => {
    setShiftSummary(prev => ({
      ...prev,
      shiftName: nextShiftName,
      supervisorBriefing: notes,
      total90mRotations: 0,
      total10mRounds: 0,
    }));

    setRotationState(prev => ({
      ...prev,
      currentIndex: 0,
      remainingSec: prev.rotationDurationSec,
      isRunning: false,
      totalRotationsCompleted: 0,
    }));

    setCheckinTimer(prev => ({
      ...prev,
      remainingSec: prev.defaultDurationSec,
      isRunning: false,
      isBlinking: false,
      currentRound: 1,
      totalRoundsCompleted: 0,
    }));

    // Reset DVR units for new shift
    setDvrUnits(prev => prev.map(u => ({ ...u, status: 'pending' as const })));
  };

  // Derived active staff roles
  const staffFrontOffice = rotationState.staffList[rotationState.currentIndex % 3]?.name || 'Staff 1';
  const staffCheckinDvr = rotationState.staffList[(rotationState.currentIndex + 1) % 3]?.name || 'Staff 2';

  const totalSopItems = checklists.length;
  const passedSopItems = checklists.filter(i => i.status === 'passed').length;
  const verifiedSopRatio = `${passedSopItems}/${totalSopItems}`;

  const isLightBlinking = checkinTimer.isBlinking || checkinTimer.remainingSec <= 0;

  return (
    <div className={`min-h-screen bg-[#0A0B0E] text-[#F5F3EE] flex flex-col selection:bg-[#D4AF37] selection:text-[#0E0F12] transition-colors duration-500 ${
      isLightBlinking ? 'ring-4 ring-[#D4AF37]/50' : ''
    }`}>
      {/* Top Luxury Navigation Hub */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenHandover={() => setShowHandoverModal(true)}
        isMiniMode={isMiniMode}
        onToggleMiniMode={() => {
          soundManager.playClick();
          setIsMiniMode(prev => !prev);
        }}
        verifiedSopRatio={verifiedSopRatio}
        activeStaffCheckinName={staffCheckinDvr}
        isLightBlinking={isLightBlinking}
      />

      {/* Main Canvas Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* 
          1. FRONT PAGE (COCKPIT):
          - Top: 3-Staff 90-Minute Duty Rotation Card (Staff 1, 2, 3 with Front Office & Check-in / DVR assignments)
          - Columns Grid:
            - Left Column: 10-Minute Check-in Chronometer with Visual Light Blink (Silent alert)
            - Right Column: DVR & NVR Audit Column (Unit statuses, HDD retention, verify & flag)
        */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top: 3-Staff 90-Minute Duty Rotation */}
            <StaffRotationCard
              rotation={rotationState}
              onUpdateRotation={setRotationState}
              onManualRotate={handleManualRotate}
              onUpdateStaffNames={handleUpdateStaffNames}
            />

            {/* 2 Columns Side-by-Side: 10-Min Check-in & Dedicated DVR Column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Left Column: 10-Minute Check-in Chronometer */}
              <div className="h-full">
                <CheckinDvrTimer
                  timer={checkinTimer}
                  onUpdateTimer={setCheckinTimer}
                  onAcknowledgeAndNextRound={handleAcknowledgeAndNextRound}
                  activeStaffName={staffCheckinDvr}
                  onOpenChecklist={() => setActiveTab('checklists')}
                />
              </div>

              {/* Right Column: Dedicated DVR & NVR Audit Column */}
              <div className="h-full">
                <DvrColumn
                  dvrUnits={dvrUnits}
                  onToggleUnitStatus={handleToggleUnitStatus}
                  onVerifyAllUnits={handleVerifyAllUnits}
                  assignedStaffName={staffCheckinDvr}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SOP CHECKLISTS TAB */}
        {activeTab === 'checklists' && (
          <div className="animate-fadeIn">
            <ChecklistsView
              checklists={checklists}
              onUpdateItem={handleUpdateChecklistItem}
              onPassAll={handlePassAllChecklist}
              staffFrontOfficeName={staffFrontOffice}
              staffCheckinDvrName={staffCheckinDvr}
            />
          </div>
        )}
      </main>

      {/* Floating Mini Window HUD Widget */}
      {isMiniMode && (
        <FloatingMiniWindow
          timer={checkinTimer}
          rotation={rotationState}
          activeStaffCheckinName={staffCheckinDvr}
          activeStaffFrontOfficeName={staffFrontOffice}
          onToggleMiniMode={() => setIsMiniMode(false)}
          onToggleTimer={() => setCheckinTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))}
          onAddMinute={() => setCheckinTimer(prev => ({ ...prev, remainingSec: prev.remainingSec + 60 }))}
          onAcknowledgeAndNextRound={handleAcknowledgeAndNextRound}
        />
      )}

      {/* Shift Handover Modal */}
      <ShiftHandoverModal
        isOpen={showHandoverModal}
        onClose={() => setShowHandoverModal(false)}
        summary={shiftSummary}
        rotation={rotationState}
        checkinTimer={checkinTimer}
        sopVerifiedRatio={verifiedSopRatio}
        onSignOffAndReset={handleSignOffAndReset}
      />

      {/* Bottom Status Bar */}
      <footer className="bg-[#0B0C10] border-t border-[#201B14] py-3.5 px-6 text-center text-xs text-[#8A857B] font-telemetry">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="font-display tracking-widest text-[#F5F3EE] text-[11px]">
              FETS WALK & DVR
            </span>
            <span className="text-[#4E473D]">|</span>
            <span className="text-[11px] text-[#8A857B]">
              3-STAFF 90M ROTATION • 10M CHECK-IN & DVR AUDIT COLUMN
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <BellOff className="w-3.5 h-3.5 text-emerald-400" />
              <span>Silent Visual Alert Mode Active</span>
            </span>
            <span className="text-[#352D21]">•</span>
            <button 
              onClick={() => setIsMiniMode(true)}
              className="text-[#D4AF37] hover:text-[#F5E6C8] flex items-center gap-1 transition-colors"
            >
              <Monitor className="w-3 h-3" />
              <span>Detach Mini HUD</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
