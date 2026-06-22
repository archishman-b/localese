import './Results.css';

export default function Results({ session, lesson, lang, onContinue }) {
  const accuracy = session.totalCount > 0
    ? Math.round((session.correctCount / session.totalCount) * 100)
    : 0;

  const getRating = () => {
    if (accuracy === 100) return { label: 'Perfect!', emoji: '🏆', color: '#F4722B' };
    if (accuracy >= 80) return { label: 'Great job!', emoji: '⭐', color: '#F39C12' };
    if (accuracy >= 60) return { label: 'Good effort', emoji: '👍', color: '#2ECC71' };
    return { label: 'Keep practicing', emoji: '💪', color: '#3498DB' };
  };

  const rating = getRating();

  return (
    <div className="results-page">
      <div className="results-card">
        <div className="results-emoji" style={{ color: rating.color }}>{rating.emoji}</div>
        <h1 className="results-rating">{rating.label}</h1>
        <p className="results-lesson">{lesson.title}</p>

        <div className="results-stats">
          <div className="rstat">
            <div className="rstat-val" style={{ color: rating.color }}>{accuracy}%</div>
            <div className="rstat-label">Accuracy</div>
          </div>
          <div className="rstat-divider" />
          <div className="rstat">
            <div className="rstat-val">+{session.score}</div>
            <div className="rstat-label">XP earned</div>
          </div>
          <div className="rstat-divider" />
          <div className="rstat">
            <div className="rstat-val">{session.hearts}</div>
            <div className="rstat-label">Hearts left</div>
          </div>
        </div>

        <div className="results-native">
          <span className="results-native-text">{lang.nativeName}</span>
          <span className="results-lang-name">{lang.name}</span>
        </div>

        <button className="results-continue-btn" onClick={onContinue}>
          Continue learning
        </button>
      </div>
    </div>
  );
}
