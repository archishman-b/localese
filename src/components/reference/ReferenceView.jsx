import { useState } from 'react';
import WordDetailModal from './WordDetailModal.jsx';
import './ReferenceView.css';

// ── Individual vocab card (Level 1) ─────────────────────────────────────────
function VocabCard({ item, langData, onClick }) {
  const hasForms = item.forms && item.forms.length > 0;

  return (
    <button className="rvc-card" onClick={() => onClick(item)}>
      {/* Left panel */}
      <div className="rvc-left">
        <div className="rvc-transliteration">{item.transliteration}</div>
        <div className="rvc-native" style={{ color: langData.scriptColor }}>
          {item.native}
        </div>
        <div className="rvc-meaning">{item.meaning}</div>
      </div>

      {/* Right panel: quick forms */}
      {hasForms && (
        <div className="rvc-right">
          {item.forms.slice(0, 5).map((f, i) => (
            <div key={i} className="rvc-form-item">
              {typeof f === 'string' ? f : `${f.label} — ${f.transliteration}`}
            </div>
          ))}
        </div>
      )}

      {/* Tap hint */}
      <div className="rvc-tap-hint">›</div>
    </button>
  );
}

// ── Category card stack ──────────────────────────────────────────────────────
function CategoryCardStack({ category, langData, onBack }) {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div className="ref-stack">
      <div className="ref-stack-header">
        <button className="ref-back-btn" onClick={onBack}>← Back</button>
        <div className="ref-stack-meta">
          <span className="ref-stack-emoji">{category.emoji}</span>
          <span className="ref-stack-title">{category.title}</span>
          <span className="ref-stack-count">{category.items.length} phrases</span>
        </div>
      </div>

      <div className="ref-stack-list">
        {category.items.map((item, i) => (
          <VocabCard
            key={i}
            item={item}
            langData={langData}
            onClick={setActiveItem}
          />
        ))}
      </div>

      {activeItem && (
        <WordDetailModal
          item={activeItem}
          langData={langData}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  );
}

// ── Category grid ────────────────────────────────────────────────────────────
function CategoryGrid({ langRefData, langData, onSelectCategory }) {
  return (
    <div className="ref-grid-view">
      <div className="ref-grid-intro">
        <span className="ref-grid-script" style={{ color: langData.scriptColor }}>
          {langData.nativeName}
        </span>
        <p className="ref-grid-sub">Tap any category · tap a card for full detail</p>
      </div>
      <div className="ref-cat-grid">
        {langRefData.categories.map((cat) => (
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

// ── Main ReferenceView ───────────────────────────────────────────────────────
export default function ReferenceView({ langRefData, langData }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!langRefData) {
    return (
      <div className="ref-no-data">
        <p>Reference data coming soon for {langData.name}.</p>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <CategoryCardStack
        category={selectedCategory}
        langData={langData}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <CategoryGrid
      langRefData={langRefData}
      langData={langData}
      onSelectCategory={setSelectedCategory}
    />
  );
}
