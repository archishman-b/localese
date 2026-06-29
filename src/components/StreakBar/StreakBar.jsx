import { useStore } from '../../store/index.js';
import './StreakBar.css';

export default function StreakBar() {
  const { streak, xp, xpToday, lessonsToday, lastActiveDate } = useStore();

  const today = new Date().toDateString();
  const isActiveToday = lastActiveDate === today && lessonsToday > 0;

  return (
    <div className="streak-bar">
      <div className="streak-pill">
        <span className="streak-icon">🔥</span>
        <span className="streak-value">{streak}</span>
        <span className="streak-label">day{streak !== 1 ? 's' : ''}</span>
      </div>

      <div className="streak-goal">
        {isActiveToday ? (
          <div className="goal-done">
            <span className="goal-check">✓</span>
            <span className="goal-text">
              {lessonsToday} lesson{lessonsToday > 1 ? 's' : ''} today · +{xpToday} XP
            </span>
          </div>
        ) : (
          <div className="goal-pending">
            <span className="goal-ring">○</span>
            <span className="goal-text">
              {streak > 0 ? 'Complete a lesson to keep your streak' : 'Complete a lesson to start your streak'}
            </span>
          </div>
        )}
      </div>

      <div className="xp-pill">
        <span className="xp-icon">⚡</span>
        <span className="xp-value">{xp}</span>
        <span className="xp-label">XP</span>
      </div>
    </div>
  );
}
