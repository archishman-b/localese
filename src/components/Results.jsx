import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/index.js';
import './Results.css';

// Check if completing this lesson finishes a stage
function getCompletedStage(lang, lessonId, progress) {
  const completedLessons = progress[lang.id]?.completedLessons || [];
  // Include the lesson just completed
  const allCompleted = completedLessons.includes(lessonId)
    ? completedLessons
    : [...completedLessons, lessonId];

  for (const stage of lang.stages) {
    if (stage.comingSoon || stage.units.length === 0) continue;
    const stageLessons = stage.units.flatMap(u => u.lessons).map(l => l.id);
    if (stageLessons.length === 0) continue;
    const stageNowComplete = stageLessons.every(id => allCompleted.includes(id));
    // Was it already complete before?
    const stageWasComplete = stageLessons.every(id => completedLessons.includes(id));
    if (stageNowComplete && !stageWasComplete) {
      return stage;
    }
  }
  return null;
}

export default function Results({ session, lesson, lang, onContinue }) {
  const navigate = useNavigate();
  const { progress, hasSeenStageUnlock, markStageUnlockSeen } = useStore();

  const accuracy = session.totalCount > 0
    ? Math.round((session.correctCount / session.totalCount) * 100)
    : 0;

  const getRating = () => {
    if (accuracy === 100) return { label: 'Perfect!', emoji: '🏆', color: '#F4722B' };
    if (accuracy >= 80)   return { label: 'Great job!', emoji: '⭐', color: '#F39C12' };
    if (accuracy >= 60)   return { label: 'Good effort', emoji: '👍', color: '#2ECC71' };
    return { label: 'Keep practicing', emoji: '💪', color: '#3498DB' };
  };

  const rating = getRating();

  const newlyCompletedStage = getCompletedStage(lang, lesson.id, progress);
  const showUnlockBtn = newlyCompletedStage && !hasSeenStageUnlock(lang.id, newlyCompletedStage.id);

  const handleContinue = () => {
    if (showUnlockBtn) {
      markStageUnlockSeen(lang.id, newlyCompletedStage.id);
      onContinue(); // clears session
      navigate(`/stage-unlock/${lang.id}/${newlyCompletedStage.id}`);
    } else {
      onContinue();
    }
  };

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

        {showUnlockBtn ? (
          <button className="results-continue-btn results-unlock-btn" onClick={handleContinue}>
            🎉 See your milestone →
          </button>
        ) : (
          <button className="results-continue-btn" onClick={handleContinue}>
            Continue learning
          </button>
        )}
      </div>
    </div>
  );
}
