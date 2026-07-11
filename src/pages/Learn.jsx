import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LANGUAGES } from '../data/index.js';
import { REFERENCE_DATA } from '../data/reference/index.js';
import { useStore } from '../store/index.js';
import ReferenceView from '../components/reference/ReferenceView.jsx';
import { useSwipeBack } from '../hooks/useSwipeBack.js';
import './Learn.css';

export default function Learn() {
  const { langId } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langId];
  const [activeTab, setActiveTab] = useState('learn');
  const [showPaywall, setShowPaywall] = useState(false);
  const { isLessonCompleted, getCompletedCount } = useStore();
  const isPremium = true; // Free launch — all stages unlocked
  useSwipeBack();

  if (!lang) {
    navigate('/home');
    return null;
  }

  const allLessons = lang.stages.flatMap(s => s.units.flatMap(u => u.lessons));
  const totalLessons = allLessons.length;
  const completedCount = getCompletedCount(langId);
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // All stages unlocked for free launch
  const isStageUnlocked = () => true;

  const isStageComplete = (stage) => {
    const lessons = stage.units.flatMap(u => u.lessons);
    return lessons.length > 0 && lessons.every(l => isLessonCompleted(langId, l.id));
  };

  const langRefData = REFERENCE_DATA[langId] || null;

  return (
    <div className="learn">
      {/* ── Language header ── */}
      <header className="learn-header" style={{ background: lang.gradient }}>
        <button className="back-btn" onClick={() => navigate('/home')}>
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '3px'}}>
            <path d="M9.5 1.5L1.5 9.5L9.5 17.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div className="learn-header-content">
          <div className="learn-script">{lang.nativeName}</div>
          <h1 className="learn-lang-name">{lang.name}</h1>
          <p className="learn-context">{lang.migrationContext}</p>
        </div>
        <div className="learn-header-stats">
          <div className="hstat">
            <span className="hstat-val">{completedCount}/{totalLessons}</span>
            <span className="hstat-label">lessons done</span>
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
          <main className="learn-main">
            {lang.stages.map((stage) => {
              const unlocked = isStageUnlocked(stage);
              const complete = isStageComplete(stage);
              const stageLessons = stage.units.flatMap(u => u.lessons);
              const stageCompleted = stageLessons.filter(l => isLessonCompleted(langId, l.id)).length;

              // Premium gate: stages 2+ require subscription
              const premiumGated = stage.order > 1 && !isPremium;

              if (premiumGated) {
                return (
                  <div key={stage.id} className="stage-block stage-premium-locked">
                    <button className="stage-premium-banner" onClick={() => setShowPaywall(true)}>
                      <div className="stage-premium-left">
                        <div className="stage-premium-emoji">✨</div>
                        <div className="stage-premium-meta">
                          <div className="stage-order-label">Stage {stage.order} · Premium</div>
                          <h2 className="stage-title">{stage.title}</h2>
                          <p className="stage-subtitle">{stage.subtitle}</p>
                        </div>
                      </div>
                      <div className="stage-premium-cta">
                        <span className="stage-premium-lock">🔒</span>
                        <span className="stage-premium-unlock">Unlock</span>
                      </div>
                    </button>
                    {/* Preview: first 2 lesson titles to show value */}
                    <div className="stage-premium-preview">
                      {stageLessons.slice(0, 3).map((l) => (
                        <div key={l.id} className="stage-preview-lesson">
                          <span>{l.emoji}</span>
                          <span>{l.title}</span>
                          <span className="preview-locked">🔒</span>
                        </div>
                      ))}
                      {stageLessons.length > 3 && (
                        <div className="stage-preview-more">+{stageLessons.length - 3} more lessons</div>
                      )}
                    </div>
                  </div>
                );
              }

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
                            const locked = false; // All lessons unlocked for free launch

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

      {/* ── Paywall modal ── */}
      {showPaywall && (
        <PaywallModal langName={lang.name} onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
