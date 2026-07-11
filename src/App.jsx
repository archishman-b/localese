import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Learn from './pages/Learn.jsx';
import Lesson from './pages/Lesson.jsx';
import StageUnlock from './pages/StageUnlock.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Privacy from './pages/Privacy.jsx';
import { useStore } from './store/index.js';
import './styles/tokens.css';

// Redirects root visitors based on onboarding state
function SmartRoot() {
  const { hasOnboarded, activeLanguage } = useStore();
  if (!hasOnboarded) return <Navigate to="/onboarding" replace />;
  if (activeLanguage) return <Navigate to={`/learn/${activeLanguage}`} replace />;
  return <Navigate to="/home" replace />;
}

// Android hardware back button handler
// Uses a runtime string to prevent Vite from statically resolving
// @capacitor/app before it's installed (added by npm install + cap add android)
const CAP_APP_MODULE = '@capacitor/app';

function IOSSwipeBackHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const isIOS = window.Capacitor?.getPlatform() === 'ios';
    if (!isIOS) return;
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = Math.abs(endY - startY);
      // Left-edge swipe: starts within 30px of left edge, moves right >80px, mostly horizontal
      if (startX < 30 && dx > 80 && dy < 60) {
        navigate(-1);
      }
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [navigate]);
  return null;
}

function AndroidBackHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!window.Capacitor) return; // browser — skip entirely
    let listener;
    (async () => {
      try {
        const { App: CapApp } = await import(CAP_APP_MODULE);
        listener = await CapApp.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) navigate(-1);
          else CapApp.exitApp();
        });
      } catch {
        // Package not yet installed or not in Capacitor context — silent no-op
      }
    })();
    return () => { listener?.remove?.(); };
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AndroidBackHandler />
      <IOSSwipeBackHandler />
      <Routes>
        <Route path="/" element={<SmartRoot />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/learn/:langId" element={<Learn />} />
        <Route path="/lesson/:langId/:lessonId" element={<Lesson />} />
        <Route path="/stage-unlock/:langId/:stageId" element={<StageUnlock />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
