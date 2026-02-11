import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Onboarding } from "./pages/Onboarding";
import { Home } from "./pages/Home";
import { Timer } from "./pages/Timer";
import { Schedule } from "./pages/Schedule";
import { Reminders } from "./pages/Reminders";

function useOnboardingSeen(): boolean {
  return typeof window !== "undefined" && localStorage.getItem("dat-onboarding-seen") === "true";
}

function ProtectedApp() {
  const seen = useOnboardingSeen();
  if (!seen) return <Navigate to="/" replace />;
  return <AppLayout />;
}

function OnboardingOrRedirect() {
  const seen = useOnboardingSeen();
  if (seen) return <Navigate to="/app/home" replace />;
  return <Onboarding />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingOrRedirect />} />
        <Route path="/app" element={<ProtectedApp />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="timer" element={<Timer />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="reminders" element={<Reminders />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
