import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../data/index.js';
import { REFERENCE_DATA } from '../data/reference/index.js';
import { useStore } from '../store/index.js';
import StreakBar from '../components/StreakBar/StreakBar.jsx';
import ReferenceView from '../components/reference/ReferenceView.jsx';
import './Learn.css';

export default function Learn() {
  const { langId } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langId];
  const [activeTab, setActiveTab] = useState('learn');
  const { isLessonCompleted, getLangXP, getCompletedCount } = useStore();

  if (!lang) {
    navigate('/');
    return null;
  }

  const allLessons = lang.stages.flatMap(s => s.units.flatMap(u => u.lessons));
  const totalLessons = allLessons.length;
  const completedCount = getCompletedCount(langId);
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isStageUnlocked = (stage) => {
    if (stage.order === 1) return true;
    const prev = lang.stages.find(s => s.order === stage.order - 1);
    if (!prev) return true;
    const prevLessons = prev.units.flatMap(u => u.lessons);
    return prevLessons.length > 0 && prevLessons.every(l => isLessonCompleted(langId, l.id));
  };

  const isStageComplete = (stage) => {
    const lessons = stage.units.flatMap(u => u.lessons);
    return lessons.length > 0 && lessons.every(l => isLessonCompleted(langId, l.id));
  };

  const langRefData = REFERENCE_DATA[langId] || null;

  return (
    <div className="learn">
      {/* ── Language header ── */}
      <header className="learn-header" style={{ background: lang.gradient }}>
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
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
        </div>
        <div className="learn-progress-bar">
          <div className="learn-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="learn-tab-bar">
        <button
          className={`learn-tab ${activeTab === 'learn' ? 'learn-tab-active' : ''}`}
          onClick={() => setActiveTab('learn')}
        >
          <span>📚</span> Learn
        </button>
        <button
          className={`learn-tab ${activeTab === 'reference' ? 'learn-tab-active' : ''}`}
          onClick={() => setActiveTab('reference')}
        >
          <span>📖</span> Reference
        </button>
      </div>

      {/* ── Learn tab ── */}
      {activeTab === 'learn' && (
        <>
          <StreakBar />
          <main className="learn-main">
            {lang.stages.map((stage) => {
              const unlocked = isStageUnlocked(stage);
              const complete = isStageComplete(stage);
              const stageLessons = stage.units.flatMap(u => u.lessons);
              const stageCompleted = stageLessons.filter(l => isLessonCompleted(langId, l.id)).length;

              return (
                <div
                  key={stage.id}
                  className={`stage-block ${!unlocked ? 'stage-locked' : ''} ${complete ? 'stage-complete' : ''}`}
                >
                  <div className="stage-header">
                    <div className="stage-emoji">{unlocked ? stage.emoji : '🔒'}</div>
                    <div className="stage-meta">
                      <div className="stage-order-label">Stage {stage.order}</div>
                      <h2 className="stage-title">{stage.title}</h2>
                      <p className="stage-subtitle">{stage.subtitle}</p>
                    </div>
                    {complete && <div className="stage-done-badge">✓</div>}
                  </div>

                  {unlocked && stageLessons.length > 0 && (
                    <div className="stage-progress-row">
                      <div className="stage-progress-bar">
                        <div
                          className="stage-progress-fill"
                          style={{ width: `${Math.round((stageCompleted / stageLessons.length) * 100)}%` }}
                        />
                      </div>
                      <span className="stage-progress-label">{stageCompleted}/{stageLessons.length} lessons</span>
                    </div>
                  )}

                  {stage.comingSoon && (
                    <div className="stage-coming-soon">
                      <span>🚧</span>
                      <span>Coming soon — finish Stage {stage.order - 1} first!</span>
                    </div>
                  )}

                  {!stage.comingSoon && unlocked && stage.units.map((unit, unitIdx) => {
                    const unitCompleted = unit.lessons.every(l => isLessonCompleted(langId, l.id));

                    return (
                      <div key={unit.id} className="unit-block">
                        <div className={`unit-header ${unitCompleted ? 'unit-done' : ''}`}>
                          <div className="unit-emoji">{unit.emoji}</div>
                          <div className="unit-meta">
                            <div className="unit-label">Unit {unitIdx + 1}</div>
                            <h3 className="unit-title">{unit.title}</h3>
                            <p className="unit-context">{unit.context}</p>
                          </div>
                          {unitCompleted && <div className="unit-check">✓</div>}
                        </div>

                        <div className="lessons-list">
                          {unit.lessons.map((lesson, lessonIdx) => {
                            const done = isLessonCompleted(langId, lesson.id);
                            const prevDone = lessonIdx === 0 || isLessonCompleted(langId, unit.lessons[lessonIdx - 1].id);
                            const locked = !done && !prevDone && unitIdx > 0;

                            return (
                              <button
                                key={lesson.id}
                                className={`lesson-row ${done ? 'lesson-done' : ''} ${locked ? 'lesson-locked' : ''}`}
                                onClick={() => !locked && navigate(`/lesson/${langId}/${lesson.id}`)}
                                disabled={locked}
                              >
                                <div className="lesson-icon">
                                  {done ? '✅' : locked ? '🔒' : lesson.emoji}
                                </div>
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
                </div>
              );
            })}
          </main>
        </>
      )}

      {/* ── Reference tab ── */}
      {activeTab === 'reference' && (
        <ReferenceView langRefData={langRefData} langData={lang} />
      )}
    </div>
  );
}
