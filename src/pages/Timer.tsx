import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { addSession } from "../store/sessions";
import { getSettings } from "../store/settings";
import { DAT_SUBJECTS, type SubjectId } from "../constants/subjects";

type SessionStatus = "idle" | "running" | "paused";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function playTimerSound(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const duration = 0.15;
    const now = ctx.currentTime;

    const playTone = (time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, time);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.2, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    playTone(now);
    playTone(now + 0.2);
  } catch {
    // Ignore audio errors (e.g. autoplay restrictions)
  }
}

export function Timer() {
  const settings = getSettings();
  const [studyMinutes, setStudyMinutes] = useState(settings.studyTimerMinutes);
  const [breakMinutes, setBreakMinutes] = useState(settings.breakTimerMinutes);
  const [subject, setSubject] = useState<SubjectId | null>(null);

  const [studyStatus, setStudyStatus] = useState<SessionStatus>("idle");
  const [breakStatus, setBreakStatus] = useState<SessionStatus>("idle");
  const [studyRemainingSeconds, setStudyRemainingSeconds] = useState(studyMinutes * 60);
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(breakMinutes * 60);

  // Keep defaults in sync with settings page when both timers are idle.
  useEffect(() => {
    if (studyStatus !== "idle" || breakStatus !== "idle") return;
    const next = getSettings();
    setStudyMinutes(next.studyTimerMinutes);
    setBreakMinutes(next.breakTimerMinutes);
  }, [studyStatus, breakStatus]);

  useEffect(() => {
    if (studyStatus === "idle") setStudyRemainingSeconds(studyMinutes * 60);
  }, [studyMinutes, studyStatus]);

  useEffect(() => {
    if (breakStatus === "idle") setBreakRemainingSeconds(breakMinutes * 60);
  }, [breakMinutes, breakStatus]);

  useEffect(() => {
    if (studyStatus !== "running") return;
    const id = setInterval(() => {
      setStudyRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [studyStatus]);

  useEffect(() => {
    if (breakStatus !== "running") return;
    const id = setInterval(() => {
      setBreakRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [breakStatus]);

  const endStudy = useCallback(() => {
    const elapsedSeconds = Math.max(0, studyMinutes * 60 - studyRemainingSeconds);
    const durationMinutes = Math.floor(elapsedSeconds / 60);
    if (subject && durationMinutes > 0) {
      addSession({
        subject,
        startedAt: Date.now() - elapsedSeconds * 1000,
        durationMinutes,
      });
    }
    setStudyStatus("idle");
    setStudyRemainingSeconds(studyMinutes * 60);
  }, [studyMinutes, studyRemainingSeconds, subject]);

  const endBreak = useCallback(() => {
    setBreakStatus("idle");
    setBreakRemainingSeconds(breakMinutes * 60);
  }, [breakMinutes]);

  useEffect(() => {
    if (studyStatus === "running" && studyRemainingSeconds === 0) {
      playTimerSound();
      endStudy();
    }
  }, [studyStatus, studyRemainingSeconds, endStudy]);

  useEffect(() => {
    if (breakStatus === "running" && breakRemainingSeconds === 0) {
      playTimerSound();
      endBreak();
    }
  }, [breakStatus, breakRemainingSeconds, endBreak]);

  const startStudy = useCallback(() => {
    if (!subject) return;
    if (breakStatus !== "idle") endBreak();
    setStudyRemainingSeconds(studyMinutes * 60);
    setStudyStatus("running");
  }, [subject, breakStatus, endBreak, studyMinutes]);

  const startBreak = useCallback(() => {
    if (studyStatus !== "idle") endStudy();
    setBreakRemainingSeconds(breakMinutes * 60);
    setBreakStatus("running");
  }, [studyStatus, endStudy, breakMinutes]);

  const toggleStudyPause = useCallback(() => {
    setStudyStatus((prev) => (prev === "running" ? "paused" : prev === "paused" ? "running" : prev));
  }, []);

  const toggleBreakPause = useCallback(() => {
    setBreakStatus((prev) => (prev === "running" ? "paused" : prev === "paused" ? "running" : prev));
  }, []);

  return (
    <div className="space-y-6">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Focus timer</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Study and break sessions</p>
      </motion.header>

      <Card className="space-y-5 py-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text)]">Study session</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Default: {studyMinutes} min</p>
        </div>

        <p className="text-center text-5xl font-mono font-semibold text-primary tabular-nums">
          {formatTime(studyRemainingSeconds)}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {DAT_SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={`
                rounded-xl px-3 py-1.5 text-sm font-medium transition-colors
                ${subject === s
                  ? "border border-[var(--color-accent-dark)] bg-[var(--color-accent)] text-white"
                  : "bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-primary/10"
                }
              `}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={studyStatus === "idle" ? "primary" : "secondary"}
            onClick={studyStatus === "idle" ? startStudy : endStudy}
            disabled={studyStatus === "idle" && !subject}
          >
            {studyStatus === "idle" ? "Start session" : "End session"}
          </Button>
          <Button variant="secondary" onClick={toggleStudyPause} disabled={studyStatus === "idle"}>
            {studyStatus === "paused" ? "Resume session" : "Pause session"}
          </Button>
        </div>
      </Card>

      <Card className="space-y-5 py-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text)]">Break session</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Default: {breakMinutes} min</p>
        </div>

        <p className="text-center text-5xl font-mono font-semibold text-primary tabular-nums">
          {formatTime(breakRemainingSeconds)}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={breakStatus === "idle" ? "primary" : "secondary"}
            onClick={breakStatus === "idle" ? startBreak : endBreak}
          >
            {breakStatus === "idle" ? "Start break" : "End break"}
          </Button>
          <Button variant="secondary" onClick={toggleBreakPause} disabled={breakStatus === "idle"}>
            {breakStatus === "paused" ? "Resume break" : "Pause break"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
