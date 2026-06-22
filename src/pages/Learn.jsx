import { useParams, useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../data/index.js';
import { useStore } from '../store/index.js';
import './Learn.css';

export default function Learn() {
  const { langId } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langId];
  const { isLessonCompleted, getLangXP, getCompletedCount, streak } = useStore();

  if (!lang) {
    navigate('/');
    return null;
  }

  const totalLessons = lang.units.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedCount = getCompletedCount(langId);
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="learn">
      <header className="learn-header" style={{ background: lang.gradient }}>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="learn-header-content">
          <div className="learn-script">{lang.nativeName}</div>
          <h1 className="learn-lang-name">{lang.name}</h1>
          <p className="learn-context">{lang.migrationContext}</p>
        </div>
        <div className="learn-header-stats">
          <div className="hstat">
            <span className="hstat-val">{getLangXP(langId)}</span>
            <span className="hstat-label">XP</span>
          </div>
          <div className="hstat">
            <span className="hstat-val">{completedCount}/{totalLessons}</span>
            <span className="hstat-label">lessons</span>
          </div>
          {streak > 0 && (
            <div className="hstat">
              <span className="hstat-val">🔥{streak}</span>
              <span className="hstat-label">streak</span>
            </div>
          )}
        </div>
        <div className="learn-progress-bar">
          <div className="learn-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="learn-main">
        {lang.units.map((unit, unitIdx) => {
          const unitCompleted = unit.lessons.every(l => isLessonCompleted(langId, l.id));
          const unitStarted = unit.lessons.some(l => isLessonCompleted(langId, l.id));

          return (
            <div key={unit.id} className="unit-block">
              <div className={`unit-header ${unitCompleted ? 'unit-done' : ''}`}>
                <div className="unit-emoji">{unit.emoji}</div>
                <div className="unit-meta">
                  <div className="unit-label">Unit {unitIdx + 1}</div>
                  <h2 className="unit-title">{unit.title}</h2>
                  <p className="unit-context">{unit.context}</p>
                </div>
                {unitCompleted && <div className="unit-check">✓</div>}
              </div>

              <div className="lessons-list">
                {unit.lessons.map((lesson, lessonIdx) => {
                  const done = isLessonCompleted(langId, lesson.id);
                  // A lesson is locked if the previous lesson in this unit isn't done
                  // (first lesson is always unlocked)
                  const prevDone = lessonIdx === 0 || isLessonCompleted(langId, unit.lessons[lessonIdx - 1].id);
                  const locked = !done && !prevDone && unitIdx > 0 && !unitStarted;

                  return (
                    <button
                      key={lesson.id}
                      className={`lesson-row ${done ? 'lesson-done' : ''} ${locked ? 'lesson-locked' : ''}`}
                      onClick={() => !locked && navigate(`/lesson/${langId}/${lesson.id}`)}
                      disabled={locked}
                    >
                      <div className="lesson-icon">{done ? '✅' : locked ? '🔒' : lesson.emoji}</div>
                      <div className="lesson-meta">
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-hook">{lesson.hook}</div>
                      </div>
                      <div className="lesson-badge">
                        {done
                          ? <span className="badge-done">Done</span>
                          : <span className="badge-start">{locked ? 'Locked' : 'Start →'}</span>
                        }
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
