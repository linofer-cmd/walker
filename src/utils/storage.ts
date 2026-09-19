import { StaffMember, ShiftRotationState, CheckinTimerState, ChecklistItem, ShiftSummary, AudioSettings, DvrUnit } from '../types';

const STORAGE_KEYS = {
  ROTATION_STATE: 'fets_rotation_v3',
  CHECKIN_TIMER: 'fets_checkin_timer_v3',
  CHECKLISTS: 'fets_checklists_v3',
  SHIFT_STATS: 'fets_shift_stats_v3',
  AUDIO_SETTINGS: 'fets_audio_settings_v3',
  DVR_UNITS: 'fets_dvr_units_v3',
};

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'staff-1', name: 'Staff 1 (Alpha)' },
  { id: 'staff-2', name: 'Staff 2 (Bravo)' },
  { id: 'staff-3', name: 'Staff 3 (Charlie)' },
];

export const INITIAL_ROTATION_STATE: ShiftRotationState = {
  staffList: INITIAL_STAFF,
  currentIndex: 0,
  rotationDurationSec: 90 * 60, // 90 minutes
  remainingSec: 90 * 60,
  isRunning: false,
  totalRotationsCompleted: 0,
};

export const INITIAL_CHECKIN_TIMER: CheckinTimerState = {
  defaultDurationSec: 10 * 60, // 10 minutes
  remainingSec: 10 * 60,
  isRunning: false,
  isBlinking: false,
  currentRound: 1, // Round 1 of 9 in this 90m block
  totalRoundsCompleted: 0,
};

export const INITIAL_DVR_UNITS: DvrUnit[] = [
  {
    id: 'dvr-1',
    name: 'DVR-01',
    channelCount: 16,
    coverageZone: 'North & East Perimeter Gates',
    status: 'verified',
    retentionDays: 42,
    lastCheckedTime: '06:15',
  },
  {
    id: 'dvr-2',
    name: 'DVR-02',
    channelCount: 16,
    coverageZone: 'Server Room & Main Data Center',
    status: 'verified',
    retentionDays: 45,
    lastCheckedTime: '06:20',
  },
  {
    id: 'dvr-3',
    name: 'DVR-03',
    channelCount: 16,
    coverageZone: 'Underground Parking B1 & B2',
    status: 'pending',
    retentionDays: 35,
  },
  {
    id: 'dvr-4',
    name: 'DVR-04',
    channelCount: 16,
    coverageZone: 'Main Lobby & Turnstiles',
    status: 'verified',
    retentionDays: 40,
    lastCheckedTime: '06:30',
  },
  {
    id: 'dvr-5',
    name: 'DVR-05',
    channelCount: 16,
    coverageZone: 'Loading Dock & Logistics Corridor',
    status: 'pending',
    retentionDays: 32,
  },
  {
    id: 'dvr-6',
    name: 'DVR-06',
    channelCount: 16,
    coverageZone: 'Emergency Stairwells & Fire Exits',
    status: 'pending',
    retentionDays: 45,
  },
  {
    id: 'dvr-7',
    name: 'NVR-07',
    channelCount: 16,
    coverageZone: 'Perimeter PTZ 4K Optical Towers',
    status: 'verified',
    retentionDays: 30,
    lastCheckedTime: '06:40',
  },
  {
    id: 'dvr-8',
    name: 'NVR-08',
    channelCount: 16,
    coverageZone: 'Executive Elevators & Floor Lobbies',
    status: 'pending',
    retentionDays: 38,
  },
];

export const INITIAL_CHECKLISTS: ChecklistItem[] = [
  // Front Office Items
  {
    id: 'fo-1',
    category: 'front_office',
    label: 'Visitor & Contractor ID Verification',
    zoneOrUnit: 'Front Desk Console',
    description: 'Inspect photo ID, government credentials, and visitor escort authorization.',
    status: 'passed',
  },
  {
    id: 'fo-2',
    category: 'front_office',
    label: 'Admin Database Entry & Badge Sync',
    zoneOrUnit: 'Admin System Station',
    description: 'Update visitor badge numbers, company name, entry timestamp in the central database.',
    status: 'passed',
  },
  {
    id: 'fo-3',
    category: 'front_office',
    label: 'Daily Access & Shift Admin Reports',
    zoneOrUnit: 'Management Portal',
    description: 'Generate shift access report and verify anomaly flags in access control records.',
    status: 'pending',
  },
  {
    id: 'fo-4',
    category: 'front_office',
    label: 'Key Safe & Physical Pass Reconcile',
    zoneOrUnit: 'Front Office Key Cabinet',
    description: 'Confirm master keys returned and signed in the admin register.',
    status: 'pending',
  },

  // Check-in & DVR Items
  {
    id: 'cd-1',
    category: 'checkin_dvr',
    label: 'DVR Video Loss & Signal Audit',
    zoneOrUnit: 'DVR-01 to DVR-04',
    description: 'Verify 64 camera streams are active with zero black screens or lost video.',
    status: 'passed',
  },
  {
    id: 'cd-2',
    category: 'checkin_dvr',
    label: 'Check-in Turnstile & Biometrics Check',
    zoneOrUnit: 'Main Entry Point',
    description: 'Verify optical turnstile barrier response and biometric reader status.',
    status: 'passed',
  },
  {
    id: 'cd-3',
    category: 'checkin_dvr',
    label: 'CCTV Live Timestamp Advancing Check',
    zoneOrUnit: 'Matrix Mon-1 & Mon-2',
    description: 'Inspect live seconds counter on recorders to ensure frames are not frozen.',
    status: 'pending',
  },
  {
    id: 'cd-4',
    category: 'checkin_dvr',
    label: 'Physical Check-in Barrier Perimeter Walk',
    zoneOrUnit: 'Check-in Corridor & Gate',
    description: 'Inspect physical boundary gates, emergency push bars, and perimeter locks.',
    status: 'pending',
  },
  {
    id: 'cd-5',
    category: 'checkin_dvr',
    label: 'DVR HDD Retention & S.M.A.R.T. Health',
    zoneOrUnit: 'NVR Server Bay',
    description: 'Ensure 30+ day storage overwriting window with zero drive sector errors.',
    status: 'pending',
  },
];

export const INITIAL_AUDIO_SETTINGS: AudioSettings = {
  soundEnabled: false, // Silent mode per user requirement
  lightBlinkEnabled: true,
  alarmVolume: 0.5,
};

export const INITIAL_SHIFT_SUMMARY: ShiftSummary = {
  shiftId: 'SHIFT-ALPHA-8HR',
  shiftName: '8-Hour Operational Shift',
  date: new Date().toISOString().slice(0, 10),
  startTime: '06:00',
  endTime: '14:00',
  staffMembers: ['Staff 1 (Alpha)', 'Staff 2 (Bravo)', 'Staff 3 (Charlie)'],
  total90mRotations: 0,
  total10mRounds: 0,
  supervisorBriefing: '3-staff rotational shift active. 90-minute duty handovers, 10-minute check-in intervals, and DVR column audit nominal.',
  equipmentNotes: 'Front office admin database online. DVR recorders 1-8 recording 24/7.',
  signedOff: false,
};

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage limit fallback
  }
}

export { STORAGE_KEYS };
