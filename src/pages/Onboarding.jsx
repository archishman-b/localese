import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_LIST } from '../data/index.js';
import { useStore } from '../store/index.js';
import './Onboarding.css';

// ── Step 1: Welcome ──────────────────────────────────────────────────────────
function WelcomeStep({ onNext }) {
  return (
    <div className="ob-step ob-welcome">
      <div className="ob-logo">
        <img src="/icon.png" alt="Localese" className="logo-icon-img" />
        <span className="ob-logo-text">Localese</span>
      </div>

      <div className="ob-scripts-row" aria-hidden="true">
        <span style={{ color: '#E86A3A' }}>हिन्दी</span>
        <span style={{ color: '#2E86AB' }}>తెలుగు</span>
        <span style={{ color: '#48BB78' }}>ಕನ್ನಡ</span>
        <span style={{ color: '#9B5DE5' }}>বাংলা</span>
        <span style={{ color: '#F4A261' }}>मराठी</span>
      </div>

      <div className="ob-headline">
        <h1>Your heritage language,<br /><em>finally within reach.</em></h1>
        <p className="ob-body">
          Localese teaches Indian languages the way you actually need them —
          for autos, chai stalls, office small talk, and everything in between.
          No memorising grammar. Just real phrases, real fast.
        </p>
      </div>

      <div className="ob-pillars">
        <div className="ob-pillar">
          <span className="ob-pillar-icon">🎧</span>
          <div>
            <strong>Native audio</strong>
            <span>Every word spoken by a real voice</span>
          </div>
        </div>
        <div className="ob-pillar">
          <span className="ob-pillar-icon">🗺️</span>
          <div>
            <strong>City-ready</strong>
            <span>Hyderabad, Bengaluru, Mumbai &amp; more</span>
          </div>
        </div>
        <div className="ob-pillar">
          <span className="ob-pillar-icon">⚡</span>
          <div>
            <strong>5 mins a day</strong>
            <span>Practical from lesson one</span>
          </div>
        </div>
      </div>

      <button className="ob-cta" onClick={onNext}>
        Get started
      </button>

      <p className="ob-fine">Free to start · no account needed</p>
    </div>
  );
}

// ── Step 2: Language picker ──────────────────────────────────────────────────
function LanguageStep({ onPick }) {
  const [selected, setSelected] = useState(null);

  const handlePick = (lang) => {
    setSelected(lang.id);
    // Small pause so the selection tap registers visually before transition
    setTimeout(() => onPick(lang), 280);
  };

  return (
    <div className="ob-step ob-lang-step">
      <div className="ob-lang-header">
        <h2>Which language<br />are you reconnecting with?</h2>
        <p>You can always switch or add more later.</p>
      </div>

      <div className="ob-lang-list">
        {LANGUAGE_LIST.map((lang) => (
          <button
            key={lang.id}
            className={`ob-lang-card ${selected === lang.id ? 'ob-lang-card--selected' : ''}`}
            style={{ '--card-gradient': lang.gradient, '--card-color': lang.scriptColor }}
            onClick={() => handlePick(lang)}
          >
            <div className="ob-lang-script">{lang.nativeName}</div>
            <div className="ob-lang-info">
              <span className="ob-lang-name">{lang.name}</span>
              <span className="ob-lang-context">{lang.migrationContext}</span>
            </div>
            <div className="ob-lang-check">
              {selected === lang.id ? '✓' : '›'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Onboarding ──────────────────────────────────────────────────────────
export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();
  const { completeOnboarding } = useStore();

  const goToStep1 = () => {
    setLeaving(true);
    setTimeout(() => { setStep(1); setLeaving(false); }, 220);
  };

  const handleLanguagePick = (lang) => {
    completeOnboarding(lang.id);
    navigate(`/learn/${lang.id}`, { replace: true });
  };

  return (
    <div className={`ob-root ${leaving ? 'ob-leaving' : ''}`}>
      {/* Step dots */}
      <div className="ob-dots">
        <span className={`ob-dot ${step === 0 ? 'ob-dot--active' : 'ob-dot--done'}`} />
        <span className={`ob-dot ${step === 1 ? 'ob-dot--active' : ''}`} />
      </div>

      {step === 0 && <WelcomeStep onNext={goToStep1} />}
      {step === 1 && <LanguageStep onPick={handleLanguagePick} />}
    </div>
  );
}
