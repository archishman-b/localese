import { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ vocab, onComplete }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seen, setSeen] = useState(new Set());

  const card = vocab[index];
  const isLast = index === vocab.length - 1;
  const allSeen = seen.size === vocab.length;

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    setSeen(prev => new Set([...prev, index]));
    if (isLast) {
      onComplete();
    } else {
      setIndex(i => i + 1);
      setRevealed(false);
    }
  };

  return (
    <div className="flashcard-wrap">
      {/* Progress dots */}
      <div className="fc-dots">
        {vocab.map((_, i) => (
          <div
            key={i}
            className={`fc-dot ${i === index ? 'fc-dot-active' : ''} ${seen.has(i) ? 'fc-dot-done' : ''}`}
          />
        ))}
      </div>

      {/* Card */}
      <div className={`fc-card ${revealed ? 'fc-card-revealed' : ''}`}>
        {/* Native script — ambient, decorative */}
        <div className="fc-native">{card.native}</div>

        {/* Main transliteration */}
        <div className="fc-transliteration">{card.transliteration}</div>

        {/* Meaning — hidden until revealed */}
        <div className={`fc-meaning-block ${revealed ? 'fc-meaning-visible' : 'fc-meaning-hidden'}`}>
          <div className="fc-meaning-label">means</div>
          <div className="fc-meaning">{card.meaning}</div>

          {card.usageSentence && (
            <div className="fc-usage">
              <span className="fc-usage-icon">💬</span>
              <span className="fc-usage-text">{card.usageSentence}</span>
            </div>
          )}
        </div>

        {/* Tap to reveal prompt */}
        {!revealed && (
          <button className="fc-reveal-btn" onClick={handleReveal}>
            Tap to see meaning
          </button>
        )}
      </div>

      {/* Navigation */}
      {revealed && (
        <button className="fc-next-btn" onClick={handleNext}>
          {isLast ? 'Start practicing →' : `Next (${index + 1}/${vocab.length})`}
        </button>
      )}
    </div>
  );
}
