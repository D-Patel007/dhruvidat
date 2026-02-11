import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getSettings, saveSettings, type UserSettings, type WorkDaySchedule } from "../store/settings";
import { requestNotificationPermission, showReminder, canShowReminderNow, type ReminderType } from "../services/notifications";

const REMINDER_OPTIONS: { id: ReminderType; label: string; icon: string }[] = [
  { id: "strong", label: "Stay strong", icon: "💪" },
  { id: "breathe", label: "Breathe", icon: "🌬️" },
  { id: "relax", label: "Relax", icon: "🍃" },
  { id: "water", label: "Drink water", icon: "💧" },
];

const INTERVAL_OPTIONS = [60, 90, 120];
const DAYS: { value: 0 | 1 | 2 | 3 | 4 | 5 | 6; label: string }[] = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function Reminders() {
  const [settings, setSettings] = useState<UserSettings>(getSettings);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [lastReminderTime, setLastReminderTime] = useState<number>(0);

  useEffect(() => {
    requestNotificationPermission().then(setNotifPermission);
  }, []);

  const update = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(partial);
      return next;
    });
  }, []);

  const updateWorkDay = useCallback((day: 0 | 1 | 2 | 3 | 4 | 5 | 6, start: string, end: string) => {
    setSettings((prev) => {
      const rest = prev.workSchedule.filter((w) => w.day !== day);
      const next: WorkDaySchedule[] = start && end ? [...rest, { day, start, end }] : rest;
      saveSettings({ workSchedule: next });
      return { ...prev, workSchedule: next };
    });
  }, []);

  useEffect(() => {
    if (!settings.remindersEnabled || notifPermission !== "granted") return;
    const intervalMs = settings.reminderIntervalMinutes * 60 * 1000;
    const now = Date.now();
    if (now - lastReminderTime < intervalMs) return;
    if (!canShowReminderNow()) return;

    const t = setInterval(() => {
      if (!canShowReminderNow()) return;
      const types: ReminderType[] = ["strong", "breathe", "relax", "water"];
      const type = types[Math.floor(Math.random() * types.length)];
      showReminder(type);
      setLastReminderTime(Date.now());
    }, intervalMs);
    return () => clearInterval(t);
  }, [settings.remindersEnabled, settings.reminderIntervalMinutes, notifPermission, lastReminderTime]);

  return (
    <div className="space-y-6 pb-6">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Reminders</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Wellness reminders when you&apos;re not in quiet hours</p>
      </motion.header>

      {notifPermission !== "granted" && (
        <Card>
          <p className="text-sm text-[var(--color-text-muted)] mb-3">Enable notifications to get reminders.</p>
          <Button onClick={() => requestNotificationPermission().then(setNotifPermission)}>
            Enable notifications
          </Button>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-[var(--color-text)]">Reminders</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.remindersEnabled}
            onClick={() => update({ remindersEnabled: !settings.remindersEnabled })}
            className={`
              relative w-11 h-6 rounded-full transition-colors
              ${settings.remindersEnabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-surface-muted)]"}
            `}
          >
            <span
              className={`
                absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                ${settings.remindersEnabled ? "left-6" : "left-1"}
              `}
            />
          </button>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">Remind every</p>
        <div className="flex gap-2">
          {INTERVAL_OPTIONS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => update({ reminderIntervalMinutes: min })}
              className={`
                flex-1 py-2 rounded-xl text-sm font-medium transition-colors
                ${settings.reminderIntervalMinutes === min
                  ? "border border-[var(--color-accent-dark)] bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-text)]"
                }
              `}
            >
              {min} min
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-[var(--color-text)] mb-3">Reminder types</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">You&apos;ll get random reminders from these when the interval passes (outside work & sleep).</p>
        <ul className="space-y-2">
          {REMINDER_OPTIONS.map(({ id, label, icon }) => (
            <li key={id} className="flex items-center justify-between py-1">
              <span>{icon} {label}</span>
              <Button variant="ghost" className="text-sm" onClick={() => showReminder(id)}>
                Test
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="font-medium text-[var(--color-text)] mb-3">Sleep time</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">No reminders during this window.</p>
        <div className="flex gap-4 items-center">
          <label className="flex-1">
            <span className="text-xs text-[var(--color-text-muted)] block">From</span>
            <input
              type="time"
              value={settings.sleepStart}
              onChange={(e) => update({ sleepStart: e.target.value })}
              className="w-full mt-1 rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)]"
            />
          </label>
          <label className="flex-1">
            <span className="text-xs text-[var(--color-text-muted)] block">To</span>
            <input
              type="time"
              value={settings.sleepEnd}
              onChange={(e) => update({ sleepEnd: e.target.value })}
              className="w-full mt-1 rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)]"
            />
          </label>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-[var(--color-text)] mb-3">Work schedule</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">No reminders during these hours. Add or edit per day.</p>
        <ul className="space-y-3">
          {DAYS.map(({ value, label }) => {
            const work = settings.workSchedule.find((w) => w.day === value);
            return (
              <li key={value} className="flex items-center gap-2 flex-wrap">
                <span className="w-10 text-sm text-[var(--color-text-muted)]">{label}</span>
                <input
                  type="time"
                  value={work?.start ?? ""}
                  onChange={(e) => updateWorkDay(value, e.target.value, work?.end ?? "17:00")}
                  className="w-24 rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] px-2 py-1.5 text-sm"
                />
                <span className="text-[var(--color-text-muted)]">–</span>
                <input
                  type="time"
                  value={work?.end ?? ""}
                  onChange={(e) => updateWorkDay(value, work?.start ?? "09:00", e.target.value)}
                  className="w-24 rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] px-2 py-1.5 text-sm"
                />
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <h3 className="font-medium text-[var(--color-text)] mb-3">Timer defaults</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">Study and break duration used on the Timer page.</p>
        <div className="flex gap-4">
          <label className="flex-1">
            <span className="text-xs text-[var(--color-text-muted)] block">Study (min)</span>
            <input
              type="number"
              min={5}
              max={120}
              value={settings.studyTimerMinutes}
              onChange={(e) => update({ studyTimerMinutes: Number(e.target.value) || 45 })}
              className="w-full mt-1 rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)]"
            />
          </label>
          <label className="flex-1">
            <span className="text-xs text-[var(--color-text-muted)] block">Break (min)</span>
            <input
              type="number"
              min={5}
              max={60}
              value={settings.breakTimerMinutes}
              onChange={(e) => update({ breakTimerMinutes: Number(e.target.value) || 15 })}
              className="w-full mt-1 rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)]"
            />
          </label>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-[var(--color-text)] mb-3">Daily target</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-2">Used on the dashboard for progress and streaks.</p>
        <label>
          <input
            type="number"
            min={0}
            max={480}
            value={settings.dailyTargetMinutes}
            onChange={(e) => update({ dailyTargetMinutes: Number(e.target.value) || 0 })}
            className="w-full rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)]"
          />
          <span className="text-xs text-[var(--color-text-muted)] ml-2">minutes per day</span>
        </label>
      </Card>
    </div>
  );
}
