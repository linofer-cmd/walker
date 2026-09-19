export type StaffRole = 'front_office' | 'checkin_dvr' | 'standby';

export interface StaffMember {
  id: string;
  name: string;
}

export interface ShiftRotationState {
  staffList: StaffMember[]; // 3 staff members
  currentIndex: number; // 0, 1, or 2
  rotationDurationSec: number; // 90 * 60 = 5400 sec
  remainingSec: number;
  isRunning: boolean;
  totalRotationsCompleted: number;
}

export interface CheckinTimerState {
  defaultDurationSec: number; // 10 * 60 = 600 sec
  remainingSec: number;
  isRunning: boolean;
  isBlinking: boolean; // visual light blink active when timer expires
  currentRound: number; // 1 to 9 (since 90m / 10m = 9 rounds)
  totalRoundsCompleted: number;
}

export interface DvrUnit {
  id: string;
  name: string;
  channelCount: number;
  coverageZone: string;
  status: 'verified' | 'pending' | 'flagged';
  retentionDays: number;
  lastCheckedTime?: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  category: 'front_office' | 'checkin_dvr';
  label: string;
  zoneOrUnit: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
  notes?: string;
}

export interface ShiftSummary {
  shiftId: string;
  shiftName: string;
  date: string;
  startTime: string;
  endTime: string;
  staffMembers: string[];
  total90mRotations: number;
  total10mRounds: number;
  supervisorBriefing: string;
  equipmentNotes: string;
  signedOff: boolean;
}

export interface AudioSettings {
  soundEnabled: boolean;
  lightBlinkEnabled: boolean; // Visual blinking lights
  alarmVolume: number;
}
