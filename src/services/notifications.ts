import { getSettings } from "../store/settings";

export type ReminderType = "strong" | "breathe" | "relax" | "water";

const REMINDER_MESSAGES: Record<ReminderType, string> = {
  strong: "You've got this. Stay strong.",
  breathe: "Take a moment to breathe.",
  relax: "Time to relax for a minute.",
  water: "Remember to drink some water.",
};

function isInQuietHours(now: Date, settings: ReturnType<typeof getSettings>): boolean {
  const [sleepH, sleepM] = settings.sleepStart.split(":").map(Number);
  const [wakeH, wakeM] = settings.sleepEnd.split(":").map(Number);
  const sleepMinutes = sleepH * 60 + sleepM;
  const wakeMinutes = wakeH * 60 + wakeM;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (sleepMinutes > wakeMinutes) {
    if (currentMinutes >= sleepMinutes || currentMinutes < wakeMinutes) return true;
  } else {
    if (currentMinutes >= sleepMinutes && currentMinutes < wakeMinutes) return true;
  }

  const day = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  for (const w of settings.workSchedule) {
    if (w.day !== day) continue;
    const [startH, startM] = w.start.split(":").map(Number);
    const [endH, endM] = w.end.split(":").map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    if (currentMinutes >= start && currentMinutes < end) return true;
  }
  return false;
}

export function canShowReminderNow(): boolean {
  const settings = getSettings();
  if (!settings.remindersEnabled) return false;
  return !isInQuietHours(new Date(), settings);
}

export function getReminderMessage(type: ReminderType): string {
  return REMINDER_MESSAGES[type];
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return await Notification.requestPermission();
}

export function showReminder(type: ReminderType): void {
  if (!canShowReminderNow()) return;
  const title = "DAT Study Tracker";
  const body = getReminderMessage(type);
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
