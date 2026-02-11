import { getAllSessions } from "../store/sessions";

/**
 * Streak = number of consecutive days (including today) with at least one study session.
 */
export function getCurrentStreak(): number {
  const sessions = getAllSessions();
  const byDate = new Map<string, number>();
  for (const s of sessions) {
    const prev = byDate.get(s.dateKey) ?? 0;
    byDate.set(s.dateKey, prev + s.durationMinutes);
  }

  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let d = new Date();
  d.setHours(0, 0, 0, 0);

  while (true) {
    const key = d.toISOString().slice(0, 10);
    const minutes = byDate.get(key) ?? 0;
    if (minutes > 0) {
      streak++;
    } else if (key === today) {
      // Today with no session yet – still count if we have past streak
      break;
    } else {
      break;
    }
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

/**
 * Whether the user has met their daily target today (from settings).
 */
export function isTargetMetToday(
  totalMinutesToday: number,
  targetMinutes: number
): boolean {
  return targetMinutes > 0 && totalMinutesToday >= targetMinutes;
}
