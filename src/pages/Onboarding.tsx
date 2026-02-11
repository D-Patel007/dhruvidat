import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

export function Onboarding() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    localStorage.setItem("dat-onboarding-seen", "true");
    navigate("/app/home", { replace: true });
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-12 bg-[var(--color-surface)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Placeholder animation: subtle morphing circles */}
        <motion.div
          className="relative w-48 h-48 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-primary/30"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full bg-primary/40"
            animate={{
              rotate: 360,
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-12 rounded-full border-2 border-[var(--color-accent)]/50"
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.h1
          className="text-2xl font-semibold text-center text-[var(--color-text)] mb-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Your future starts with this hour.
        </motion.h1>
        <motion.p
          className="text-center text-[var(--color-text-muted)] text-base mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Track your study time, stay focused, and hit your DAT goals—one session at a time.
        </motion.p>
      </div>

      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Button fullWidth onClick={handleGetStarted} className="gap-2">
          Get started
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </motion.div>
    </motion.div>
  );
}
