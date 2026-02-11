import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { getSettings } from "../store/settings";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const settings = getSettings();
  const { workSchedule, sleepStart, sleepEnd } = settings;

  const weekStart = useMemo(() => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [selectedDate]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const selectedDaySchedule = useMemo(() => {
    const day = selectedDate.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const work = workSchedule.filter((w) => w.day === day);
    return [
      ...work.map((w) => ({ type: "Work" as const, start: w.start, end: w.end })),
      { type: "Sleep" as const, start: sleepStart, end: sleepEnd },
    ].filter((s) => s.start && s.end);
  }, [selectedDate, workSchedule, sleepStart, sleepEnd]);

  const isSelected = (d: Date) =>
    d.getDate() === selectedDate.getDate() &&
    d.getMonth() === selectedDate.getMonth() &&
    d.getFullYear() === selectedDate.getFullYear();

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Schedule</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Work & sleep from Reminders; connect Google Calendar later</p>
      </motion.header>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-medium text-[var(--color-text)]">
            {weekStart.toLocaleDateString("en-US", { month: "short" })} {weekStart.getDate()} – {weekDates[6]?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button
            type="button"
            onClick={() => setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text)]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="flex justify-between gap-1">
          {weekDates.map((d) => (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`
                flex-1 flex flex-col items-center py-2 rounded-xl text-sm transition-colors
                ${isSelected(d)
                  ? "border border-[var(--color-accent-dark)] bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-primary/10"
                }
              `}
            >
              <span>{DAYS[d.getDay()]}</span>
              <span className="font-medium">{d.getDate()}</span>
            </button>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">My schedule</h2>
        {selectedDaySchedule.length === 0 ? (
          <Card>
            <p className="text-center text-[var(--color-text-muted)] text-sm py-6">
              No work or sleep set for this day. Add work hours and sleep time in Reminders.
            </p>
            <p className="text-center text-xs text-[var(--color-text-muted)]">
              Google Calendar integration can be added to show events here.
            </p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {selectedDaySchedule.map((s, i) => (
              <Card key={i} className="flex items-center justify-between">
                <span className="font-medium text-[var(--color-text)]">{s.type}</span>
                <span className="text-sm text-[var(--color-text-muted)]">{s.start} – {s.end}</span>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
