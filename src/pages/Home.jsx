import { useNavigate, Link } from 'react-router-dom';
import { LANGUAGE_LIST } from '../data/index.js';
import { useStore } from '../store/index.js';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { setActiveLanguage, getCompletedCount } = useStore();

  const handleSelectLanguage = (lang) => {
    setActiveLanguage(lang.id);
    navigate(`/learn/${lang.id}`);
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-logo">
          <img src="/icon.png" alt="Localese" className="logo-icon-img" />
          <span className="logo-text">Localese</span>
        </div>
      </header>

      <main className="home-main">
        <div className="home-hero">
          <h1 className="home-title">
            Learn Indian languages.<br />
            <span className="home-title-accent">Speak from day one.</span>
          </h1>
          <p className="home-subtitle">
            Built for professionals who've just moved cities —<br />
            practical phrases, zero fluff, instant confidence.
          </p>
        </div>

        <div className="languages-grid">
          {LANGUAGE_LIST.map((lang) => {
            const completedCount = getCompletedCount(lang.id);
            return (
              <button
                key={lang.id}
                className="language-card"
                style={{ '--lang-gradient': lang.gradient }}
                onClick={() => handleSelectLanguage(lang)}
              >
                <div className="lang-card-header">
                  <div className="lang-script-badge" style={{ color: lang.scriptColor }}>
                    {lang.nativeName}
                  </div>
                  {completedCount > 0 && (
                    <div className="lang-progress-badge">{completedCount} done</div>
                  )}
                </div>
                <div className="lang-card-body">
                  <h2 className="lang-name">{lang.name}</h2>
                  <p className="lang-context">{lang.migrationContext}</p>
                </div>
                <div className="lang-card-footer">
                  <span className="lang-tagline">{lang.tagline}</span>
                  <span className="lang-units">{lang.stages.flatMap(s => s.units).length} units</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="home-mission">
          <div className="mission-icon">🧳</div>
          <p>
            <strong>Designed for the urban migrant.</strong> Whether you've just moved to Hyderabad, Bengaluru, or Mumbai — learn what actually matters: autos, food, numbers, small talk.
          </p>
        </div>

        <footer className="home-footer">
          <Link to="/privacy" className="home-footer-link">Privacy Policy</Link>
          <span className="home-footer-sep">·</span>
          <span className="home-footer-copy">© 2026 Localese</span>
        </footer>
      </main>
    </div>
  );
}
