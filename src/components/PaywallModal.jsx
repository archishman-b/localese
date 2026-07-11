import { useEffect, useRef, useState } from 'react';
import { useRevenueCat } from '../hooks/useRevenueCat.js';
import './PaywallModal.css';

const FEATURES = [
  { icon: '📚', text: 'All 4 stages per language — 32 lessons total' },
  { icon: '🎧', text: 'Native audio for every word and phrase' },
  { icon: '🗺️', text: 'City-ready phrases for 5 Indian metros' },
  { icon: '📖', text: 'Full reference guide — 600+ phrases' },
  { icon: '🔥', text: 'Streak tracking & XP across all languages' },
];

const PLANS = [
  {
    id: 'annual',
    label: 'Annual',
    price: '₹1,999',
    per: '/year',
    subtext: 'Just ₹167/month',
    badge: 'Best value · Save 44%',
    recommended: true,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '₹299',
    per: '/month',
    subtext: 'Flexible, cancel anytime',
    badge: null,
    recommended: false,
  },
];

export default function PaywallModal({ langName, onClose }) {
  const sheetRef = useRef(null);
  const startY = useRef(null);
  const currentY = useRef(0);
  const [loading, setLoading] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState(null);
  const { purchase, restore } = useRevenueCat();

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Swipe-down-to-close
  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      currentY.current = dy;
      if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };
  const onTouchEnd = () => {
    if (currentY.current > 90) onClose();
    else if (sheetRef.current) sheetRef.current.style.transform = 'translateY(0)';
    currentY.current = 0;
  };

  const handlePurchase = async (planKey = 'annual') => {
    setLoading(true);
    const result = await purchase(planKey);
    setLoading(false);
    if (result?.success) onClose();
  };

  const handleRestore = async () => {
    setLoading(true);
    const result = await restore();
    setLoading(false);
    if (result?.hasPremium) {
      onClose();
    } else {
      setRestoreMsg('No active subscription found.');
      setTimeout(() => setRestoreMsg(null), 3000);
    }
  };

  return (
    <div className="pw-backdrop" onClick={onClose}>
      <div
        className="pw-sheet"
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="pw-handle" />

        {/* Header */}
        <div className="pw-header">
          <div className="pw-lock-icon">🔓</div>
          <h2 className="pw-title">Unlock full {langName}</h2>
          <p className="pw-subtitle">
            You've mastered the essentials. Keep going — the best conversations are ahead.
          </p>
        </div>

        {/* Features */}
        <ul className="pw-features">
          {FEATURES.map((f, i) => (
            <li key={i} className="pw-feature">
              <span className="pw-feature-icon">{f.icon}</span>
              <span className="pw-feature-text">{f.text}</span>
            </li>
          ))}
        </ul>

        {/* Plans */}
        <div className="pw-plans">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              className={`pw-plan ${plan.recommended ? 'pw-plan--recommended' : ''}`}
              onClick={() => handlePurchase(plan.id)}
              disabled={loading}
            >
              {plan.badge && <div className="pw-plan-badge">{plan.badge}</div>}
              <div className="pw-plan-label">{plan.label}</div>
              <div className="pw-plan-price">
                <span className="pw-plan-amount">{plan.price}</span>
                <span className="pw-plan-per">{plan.per}</span>
              </div>
              <div className="pw-plan-sub">{plan.subtext}</div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="pw-cta" onClick={() => handlePurchase('annual')} disabled={loading}>
          {loading ? 'Processing…' : 'Start 7-day free trial'}
        </button>

        <div className="pw-fine">
          Auto-renews after trial · Cancel anytime in App Store settings
        </div>

        <div className="pw-bottom-row">
          <button className="pw-dismiss" onClick={onClose}>Maybe later</button>
          <button className="pw-restore" onClick={handleRestore} disabled={loading}>
            Restore purchases
          </button>
        </div>
        {restoreMsg && <div className="pw-restore-msg">{restoreMsg}</div>}
      </div>
    </div>
  );
}
