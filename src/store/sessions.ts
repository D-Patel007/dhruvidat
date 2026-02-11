import type { SubjectId } from "../constants/subjects";

export interface StudySession {
  id: string;
  subject: SubjectId;
  startedAt: number;
  durationMinutes: number;
  dateKey: string; // YYYY-MM-DD for grouping
}

const STORAGE_KEY = "dat-study-sessions";

function getSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: StudySession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function addSession(session: Omit<StudySession, "id" | "dateKey">): StudySession {
  const dateKey = new Date().toISOString().slice(0, 10);
  const newSession: StudySession = {
    ...session,
    id: crypto.randomUUID(),
    dateKey,
  };
  const sessions = [...getSessions(), newSession];
  saveSessions(sessions);
  return newSession;
}

export function getSessionsForDate(date: Date): StudySession[] {
  const dateKey = date.toISOString().slice(0, 10);
  return getSessions().filter((s) => s.dateKey === dateKey);
}

export function getAllSessions(): StudySession[] {
  return getSessions();
}

export function getTotalMinutesForDate(date: Date): number {
  return getSessionsForDate(date).reduce((sum, s) => sum + s.durationMinutes, 0);
}
