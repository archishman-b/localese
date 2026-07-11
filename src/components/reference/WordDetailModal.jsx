import { useEffect, useRef } from 'react';
import { useSpeech } from '../../hooks/useSpeech.js';
import './WordDetailModal.css';

export default function WordDetailModal({ item, langData, langId, onClose }) {
  const { speak, isSupported } = useSpeech(langId);
  const sheetRef = useRef(null);
  const startY = useRef(null);
  const currentY = useRef(0);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Simple swipe-down-to-close
  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      currentY.current = dy;
      if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };
  const onTouchEnd = () => {
    if (currentY.current > 100) {
      onClose();
    } else {
      if (sheetRef.current) sheetRef.current.style.transform = 'translateY(0)';
    }
    currentY.current = 0;
  };

  if (!item) return null;

  const hasForms = item.forms && item.forms.length > 0;
  const hasExamples = item.examples && item.examples.length > 0;
  const hasExpressions = item.expressions && item.expressions.length > 0;

  return (
    <div className="wdm-backdrop" onClick={onClose}>
      <div
        className="wdm-sheet"
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="wdm-handle" />

        {/* Header */}
        <div className="wdm-header">
          <div className="wdm-native-row">
            <div className="wdm-native" style={{ color: langData.scriptColor }}>
              {item.native}
            </div>
            {isSupported && (
              <button className="wdm-speak-btn" onClick={() => speak(item.native)} title="Hear pronunciation">
                🔊
              </button>
            )}
          </div>
          <div className="wdm-transliteration">{item.transliteration}</div>
          <div className="wdm-meaning">{item.meaning}</div>
        </div>

        {/* Scrollable body */}
        <div className="wdm-body">

          {/* Forms / Conjugations */}
          {hasForms && (
            <section className="wdm-section">
              <h3 className="wdm-section-title">📐 Forms</h3>
              <div className="wdm-forms-list">
                {item.forms.map((f, i) => (
                  <div key={i} className="wdm-form-row">
                    {typeof f === 'string' ? (
                      <span className="wdm-form-string">{f}</span>
                    ) : (
                      <>
                        <span className="wdm-form-label">{f.label}</span>
                        <div className="wdm-form-content">
                          <span className="wdm-form-trans">{f.transliteration}</span>
                          <span className="wdm-form-native" style={{ color: langData.scriptColor }}>
                            {f.native}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Usage examples */}
          {hasExamples && (
            <section className="wdm-section">
              <h3 className="wdm-section-title">💬 Usage</h3>
              <div className="wdm-examples-list">
                {item.examples.map((ex, i) => (
                  <div key={i} className="wdm-example">
                    {ex.context && <div className="wdm-ex-context">{ex.context}</div>}
                    <div className="wdm-ex-phrase">{ex.phrase}</div>
                    <div className="wdm-ex-native-row">
                      <div className="wdm-ex-native" style={{ color: langData.scriptColor }}>
                        {ex.native}
                      </div>
                      {isSupported && ex.native && (
                        <button className="wdm-speak-btn wdm-speak-sm" onClick={() => speak(ex.native)} title="Hear phrase">🔊</button>
                      )}
                    </div>
                    {ex.meaning && <div className="wdm-ex-meaning">{ex.meaning}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Expressions / Idioms */}
          {hasExpressions && (
            <section className="wdm-section">
              <h3 className="wdm-section-title">✨ Expressions</h3>
              <div className="wdm-expressions-list">
                {item.expressions.map((ex, i) => (
                  <div key={i} className="wdm-expression">
                    <div className="wdm-exp-phrase">{ex.phrase}</div>
                    <div className="wdm-exp-native" style={{ color: langData.scriptColor }}>
                      {ex.native}
                    </div>
                    <div className="wdm-exp-meaning">{ex.meaning}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="wdm-bottom-space" />
        </div>
      </div>
    </div>
  );
}
