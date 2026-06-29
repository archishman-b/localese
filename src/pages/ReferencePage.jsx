import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { REFERENCE_DATA, REFERENCE_LIST } from '../data/reference/index.js';
import './ReferencePage.css';

// ── Category Card Stack view ────────────────────────────────────────────────
function CategoryCards({ items, onBack, categoryTitle, categoryEmoji, langData }) {
  return (
    <div className="ref-cards-view">
      <header className="ref-cards-header" style={{ background: langData.gradient }}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="ref-cards-header-content">
          <span className="ref-cards-emoji">{categoryEmoji}</span>
          <h2 className="ref-cards-title">{categoryTitle}</h2>
          <p className="ref-cards-lang">{langData.langName} · {items.length} phrases</p>
        </div>
      </header>
      <div className="ref-cards-list">
        {items.map((item, i) => (
          <div key={i} className="ref-vocab-card">
            <div className="rvc-transliteration">{item.transliteration}</div>
            <div
              className="rvc-native"
              style={{ color: langData.scriptColor }}
            >
              {item.native}
            </div>
            <div className="rvc-meaning">{item.meaning}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Language Reference view (category grid) ─────────────────────────────────
function LanguageReference({ langData, onSelectCategory, onBack }) {
  return (
    <div className="ref-lang-view">
      <header className="ref-lang-header" style={{ background: langData.gradient }}>
        <button className="back-btn" onClick={onBack}>← Languages</button>
        <div className="ref-lang-header-content">
          <div className="ref-lang-script" style={{ color: langData.scriptColor }}>
            {langData.nativeName}
          </div>
          <h1 className="ref-lang-name">{langData.langName} Reference</h1>
          <p className="ref-lang-sub">Tap any category to browse phrases</p>
        </div>
      </header>
      <div className="ref-categories-grid">
        {langData.categories.map((cat) => (
          <button
            key={cat.id}
            className="ref-cat-card"
            onClick={() => onSelectCategory(cat)}
          >
            <span className="ref-cat-emoji">{cat.emoji}</span>
            <span className="ref-cat-title">{cat.title}</span>
            <span className="ref-cat-count">{cat.items.length} phrases</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Language selector home ───────────────────────────────────────────────────
function ReferenceHome({ onSelectLang }) {
  return (
    <div className="ref-home-view">
      <header className="ref-home-header">
        <div className="ref-home-title-row">
          <span className="ref-home-icon">📖</span>
          <h1 className="ref-home-title">Reference</h1>
        </div>
        <p className="ref-home-sub">Quick lookup — all phrases, no exercises</p>
      </header>
      <div className="ref-lang-grid">
        {REFERENCE_LIST.map((lang) => (
          <button
            key={lang.langId}
            className="ref-lang-card"
            style={{ '--ref-lang-gradient': lang.gradient }}
            onClick={() => onSelectLang(lang)}
          >
            <div
              className="ref-lang-card-script"
              style={{ color: lang.scriptColor }}
            >
              {lang.nativeName}
            </div>
            <div className="ref-lang-card-name">{lang.langName}</div>
            <div className="ref-lang-card-count">
              {lang.categories.length} categories · {lang.categories.reduce((s, c) => s + c.items.length, 0)} phrases
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main ReferencePage component ─────────────────────────────────────────────
export default function ReferencePage() {
  const { langId, categoryId } = useParams();
  const navigate = useNavigate();

  // State for when navigating within the page without changing URL
  const [selectedLang, setSelectedLang] = useState(
    langId ? REFERENCE_DATA[langId] : null
  );
  const [selectedCategory, setSelectedCategory] = useState(
    langId && categoryId
      ? (REFERENCE_DATA[langId]?.categories.find(c => c.id === categoryId) || null)
      : null
  );

  const handleSelectLang = (lang) => {
    setSelectedLang(lang);
    setSelectedCategory(null);
    navigate(`/reference/${lang.langId}`, { replace: true });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    navigate(`/reference/${selectedLang.langId}/${cat.id}`, { replace: true });
  };

  const handleBackToLangs = () => {
    setSelectedLang(null);
    setSelectedCategory(null);
    navigate('/reference', { replace: true });
  };

  const handleBackToLang = () => {
    setSelectedCategory(null);
    navigate(`/reference/${selectedLang.langId}`, { replace: true });
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (selectedLang && selectedCategory) {
    return (
      <div className="reference-page">
        <CategoryCards
          items={selectedCategory.items}
          onBack={handleBackToLang}
          categoryTitle={selectedCategory.title}
          categoryEmoji={selectedCategory.emoji}
          langData={selectedLang}
        />
        <BottomNav active="reference" />
      </div>
    );
  }

  if (selectedLang) {
    return (
      <div className="reference-page">
        <LanguageReference
          langData={selectedLang}
          onSelectCategory={handleSelectCategory}
          onBack={handleBackToLangs}
        />
        <BottomNav active="reference" />
      </div>
    );
  }

  return (
    <div className="reference-page">
      <ReferenceHome onSelectLang={handleSelectLang} />
      <BottomNav active="reference" />
    </div>
  );
}

// ── Bottom nav shared between Home and Reference ─────────────────────────────
export function BottomNav({ active }) {
  const navigate = useNavigate();
  return (
    <nav className="bottom-nav">
      <button
        className={`bnav-item ${active === 'home' ? 'bnav-active' : ''}`}
        onClick={() => navigate('/')}
      >
        <span className="bnav-icon">🏠</span>
        <span className="bnav-label">Learn</span>
      </button>
      <button
        className={`bnav-item ${active === 'reference' ? 'bnav-active' : ''}`}
        onClick={() => navigate('/reference')}
      >
        <span className="bnav-icon">📖</span>
        <span className="bnav-label">Reference</span>
      </button>
    </nav>
  );
}
