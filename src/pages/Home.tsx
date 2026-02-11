import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { getSessionsForDate, getTotalMinutesForDate } from "../store/sessions";
import { getSettings } from "../store/settings";
import { getCurrentStreak, isTargetMetToday } from "../services/streak";
import { DAT_SUBJECTS } from "../constants/subjects";

function formatMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return min ? `${h}h ${min}m` : `${h}h`;
}

export function Home() {
  const today = useMemo(() => new Date(), []);
  const sessions = useMemo(() => getSessionsForDate(today), [today]);
  const totalMinutes = useMemo(() => getTotalMinutesForDate(today), [today]);
  const settings = useMemo(() => getSettings(), []);
  const targetMinutes = settings.dailyTargetMinutes;
  const targetMet = isTargetMetToday(totalMinutes, targetMinutes);
  const streak = useMemo(() => getCurrentStreak(), []);

  const progressPercent = targetMinutes > 0
    ? Math.min(100, (totalMinutes / targetMinutes) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text)]">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Today&apos;s progress</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/15 px-3 py-1.5">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium text-[var(--color-accent)]">{streak} day streak</span>
          </div>
        )}
      </motion.header>

      <Card className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-[var(--color-text-muted)]">Study time today</span>
          <span className="text-2xl font-semibold text-primary">{formatMinutes(totalMinutes)}</span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--color-text-muted)]">Target: {formatMinutes(targetMinutes)}</span>
            {targetMet && (
              <span className="text-[var(--color-accent)] font-medium">Target met</span>
            )}
          </div>
          <div className="h-2 rounded-full bg-[var(--color-surface-muted)] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Today&apos;s sessions</h2>
        {sessions.length === 0 ? (
          <Card>
            <p className="text-center text-[var(--color-text-muted)] text-sm py-4">
              No sessions yet. Start a focus session to track your study time.
            </p>
            <Link to="/app/timer" className="block">
              <Button fullWidth>Start studying</Button>
            </Link>
          </Card>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <Card key={s.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--color-text)]">{s.subject}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {formatMinutes(s.durationMinutes)}
                  </p>
                </div>
              </Card>
            ))}
            <Link to="/app/timer" className="block">
              <Button variant="secondary" fullWidth>Add session</Button>
            </Link>
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DAT_SUBJECTS.map((sub) => {
          const subMinutes = sessions
            .filter((s) => s.subject === sub)
            .reduce((a, s) => a + s.durationMinutes, 0);
          return (
            <Card key={sub} className="py-2">
              <p className="text-xs text-[var(--color-text-muted)] truncate">{sub}</p>
              <p className="text-lg font-semibold text-primary">{formatMinutes(subMinutes)}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
