export interface UserSettings {
  studyTimerMinutes: number;
  breakTimerMinutes: number;
  dailyTargetMinutes: number;
  reminderIntervalMinutes: number;
  remindersEnabled: boolean;
  workSchedule: WorkDaySchedule[];
  sleepStart: string; // "22:00"
  sleepEnd: string;   // "06:00"
}

export interface WorkDaySchedule {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  start: string; // "09:00"
  end: string;   // "17:00"
}

const STORAGE_KEY = "dat-study-settings";

const defaults: UserSettings = {
  studyTimerMinutes: 45,
  breakTimerMinutes: 15,
  dailyTargetMinutes: 120,
  reminderIntervalMinutes: 90,
  remindersEnabled: true,
  workSchedule: [],
  sleepStart: "22:00",
  sleepEnd: "06:00",
};

function getStored(): Partial<UserSettings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getSettings(): UserSettings {
  return { ...defaults, ...getStored() };
}

export function saveSettings(partial: Partial<UserSettings>) {
  const current = getSettings();
  const next = { ...current, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
