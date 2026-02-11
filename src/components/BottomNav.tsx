import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/app/home", label: "Home", icon: HomeIcon },
  { to: "/app/timer", label: "Timer", icon: TimerIcon },
  { to: "/app/schedule", label: "Schedule", icon: CalendarIcon },
  { to: "/app/reminders", label: "Reminders", icon: BellIcon },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--color-surface-muted)] bg-[var(--color-surface-card)] py-2 safe-area-pb">
      {navItems.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 no-underline transition-colors ${
              isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-primary"
            }`}
          >
            <span className={`relative flex items-center justify-center rounded-lg p-1.5 ${isActive ? "bg-[var(--color-accent)]/15" : ""}`}>
              <Icon className={isActive ? "text-[var(--color-accent)]" : ""} />
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[var(--color-accent)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                />
              )}
            </span>
            <span className={`text-xs ${isActive ? "font-semibold text-[var(--color-accent)]" : ""}`}>
              {label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-6 w-6 ${className ?? ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.2 12 4l7.5 6.2V19a1.5 1.5 0 0 1-1.5 1.5h-3.8v-5h-4.4v5H6A1.5 1.5 0 0 1 4.5 19v-8.8Z" />
    </svg>
  );
}

function TimerIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-6 w-6 ${className ?? ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 3.2h5M12 12V8.2m0 3.8 2.8 1.8M8.2 5.6 6.8 4.2m9 1.4 1.4-1.4M12 20.2a8.2 8.2 0 1 0 0-16.4 8.2 8.2 0 0 0 0 16.4Z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-6 w-6 ${className ?? ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 2.8v2.4M17 2.8v2.4M3.8 9.2h16.4M5.8 5.2h12.4A2 2 0 0 1 20.2 7v12a2 2 0 0 1-2 2H5.8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-1.8Zm3.4 9.1 1.9 1.9 4.1-4.1" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-6 w-6 ${className ?? ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.2a5.2 5.2 0 0 0-5.2 5.2v2.1c0 .9-.3 1.7-.9 2.3L4.8 15c-.5.5-.2 1.4.5 1.4h13.4c.7 0 1-.9.5-1.4l-1.1-1.2a3.2 3.2 0 0 1-.9-2.3V9.4A5.2 5.2 0 0 0 12 4.2Zm-2 13.2a2 2 0 1 0 4 0" />
    </svg>
  );
}
