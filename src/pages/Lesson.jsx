import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LANGUAGES } from '../data/index.js';
import { useStore } from '../store/index.js';
import Flashcard from '../components/Flashcard.jsx';
import ExerciseMCQ from '../components/ExerciseMCQ.jsx';
import ExerciseWordBank from '../components/ExerciseWordBank.jsx';
import ExerciseTranslate from '../components/ExerciseTranslate.jsx';
import ExerciseScenarioMCQ from '../components/ExerciseScenarioMCQ.jsx';
import Results from '../components/Results.jsx';
import './Lesson.css';

// How many exercises run as "guided" (no heart loss, extra hints)
const GUIDED_COUNT = 2;

const PHASES = {
  TEACH: 'teach',
  GUIDED: 'guided',
  QUIZ: 'quiz',
};

function PhaseHeader({ phase }) {
  const labels = {
    [PHASES.TEACH]: { label: 'Learn', icon: '📖', desc: 'Study the new words' },
    [PHASES.GUIDED]: { label: 'Practice', icon: '✍️', desc: 'Try with help — no penalty' },
    [PHASES.QUIZ]: { label: 'Quiz', icon: '⚡', desc: 'Test yourself' },
  };
  const info = labels[phase];
  if (!info) return null;
  return (
    <div className="phase-header">
      <span className="phase-icon">{info.icon}</span>
      <div>
        <div className="phase-label">{info.label}</div>
        <div className="phase-desc">{info.desc}</div>
      </div>
    </div>
  );
}

function PhaseTransition({ phase, onContinue }) {
  const config = {
    [PHASES.GUIDED]: {
      emoji: '✍️',
      heading: 'Words learned!',
      sub: 'Now try them out — no penalty for mistakes here.',
      btn: 'Start practice',
    },
    [PHASES.QUIZ]: {
      emoji: '⚡',
      heading: 'Practice done!',
      sub: 'Time for the real quiz. Hearts are back on.',
      btn: 'Start quiz',
    },
  };
  const c = config[phase];
  if (!c) return null;
  return (
    <div className="phase-transition">
      <div className="pt-emoji">{c.emoji}</div>
      <h2 className="pt-heading">{c.heading}</h2>
      <p className="pt-sub">{c.sub}</p>
      <button className="fc-next-btn" onClick={onContinue}>{c.btn}</button>
    </div>
  );
}

export default function Lesson() {
  const { langId, lessonId } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langId];
  const { session, startSession, answerExercise, nextExercise, completeSession, clearSession } = useStore();

  const [phase, setPhase] = useState(PHASES.TEACH);
  const [showTransition, setShowTransition] = useState(false);
  const [pendingPhase, setPendingPhase] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Find lesson across all stages
  const lesson = lang?.stages
    .flatMap(s => s.units)
    .flatMap(u => u.lessons)
    .find(l => l.id === lessonId);

  useEffect(() => {
    if (lang && lesson && (!session || session.lessonId !== lessonId)) {
      startSession(langId, lessonId);
      setPhase(PHASES.TEACH);
      setShowTransition(false);
    }
  }, [langId, lessonId]);

  if (!lang || !lesson || !session) return <div className="lesson-loading">Loading...</div>;

  const exercises = lesson.exercises;
  const currentIdx = session.currentExerciseIndex;
  const exercise = exercises[currentIdx];
  const isComplete = session.completed || currentIdx >= exercises.length;
  const isGuided = phase === PHASES.GUIDED;

  // Progress combines teach cards + exercises
  const vocabCount = lesson.vocab.length;
  const totalSteps = vocabCount + exercises.length;
  const progressPct = phase === PHASES.TEACH
    ? 0
    : Math.round(((vocabCount + currentIdx) / totalSteps) * 100);

  // ── Teach complete → go to Guided ──
  const handleTeachComplete = () => {
    if (exercises.length === 0) {
      completeSession();
      return;
    }
    setPendingPhase(PHASES.GUIDED);
    setShowTransition(true);
  };

  const handleTransitionContinue = () => {
    setPhase(pendingPhase);
    setShowTransition(false);
  };

  // ── Answer handler ──
  const handleAnswer = (answer, isCorrect) => {
    if (feedback) return;
    setSelectedAnswer(answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    answerExercise(isCorrect, isGuided); // guided = no heart loss
  };

  const handleContinue = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    const nextIdx = currentIdx + 1;

    // Transition: guided → quiz
    if (phase === PHASES.GUIDED && nextIdx >= Math.min(GUIDED_COUNT, exercises.length)) {
      if (nextIdx >= exercises.length) {
        completeSession();
        return;
      }
      nextExercise();
      setPendingPhase(PHASES.QUIZ);
      setShowTransition(true);
      return;
    }

    if (nextIdx >= exercises.length) {
      completeSession();
    } else {
      nextExercise();
    }
  };

  const handleExit = () => {
    clearSession();
    navigate(`/learn/${langId}`);
  };

  // ── Results ──
  if (isComplete) {
    return (
      <Results
        session={session}
        lesson={lesson}
        lang={lang}
        onContinue={() => {
          clearSession();
          navigate(`/learn/${langId}`);
        }}
      />
    );
  }

  const topBar = (
    <div className="lesson-topbar">
      <button className="exit-btn" onClick={handleExit} title="Exit lesson">✕</button>
      <div className="lesson-progressbar">
        <div className="lesson-progressfill" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="hearts-display">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`heart ${i >= session.hearts ? 'heart-lost' : ''}`}>❤️</span>
        ))}
      </div>
    </div>
  );

  // ── Phase transition screen ──
  if (showTransition) {
    return (
      <div className="lesson-page">
        {topBar}
        <div className="exercise-area">
          <PhaseTransition phase={pendingPhase} onContinue={handleTransitionContinue} />
        </div>
      </div>
    );
  }

  return (
    <div className={`lesson-page ${feedback ? `feedback-${feedback}` : ''}`}>
      {topBar}

      <div className="exercise-area">
        <PhaseHeader phase={phase} />

        {/* ── TEACH ── */}
        {phase === PHASES.TEACH && (
          <Flashcard vocab={lesson.vocab} onComplete={handleTeachComplete} />
        )}

        {/* ── GUIDED / QUIZ ── */}
        {(phase === PHASES.GUIDED || phase === PHASES.QUIZ) && exercise && (
          <>
            <div className="exercise-counter">
              {currentIdx + 1} / {exercises.length}
              {isGuided && <span className="guided-badge"> · no penalty</span>}
            </div>

            {exercise.type === 'mcq' && (
              <ExerciseMCQ
                exercise={exercise}
                onAnswer={handleAnswer}
                feedback={feedback}
                selectedAnswer={selectedAnswer}
              />
            )}
            {exercise.type === 'scenario-mcq' && (
              <ExerciseScenarioMCQ
                exercise={exercise}
                onAnswer={handleAnswer}
                feedback={feedback}
                selectedAnswer={selectedAnswer}
              />
            )}
            {exercise.type === 'wordbank' && (
              <ExerciseWordBank
                exercise={exercise}
                onAnswer={handleAnswer}
                feedback={feedback}
              />
            )}
            {exercise.type === 'translate' && (
              <ExerciseTranslate
                exercise={exercise}
                onAnswer={handleAnswer}
                feedback={feedback}
                selectedAnswer={selectedAnswer}
              />
            )}
          </>
        )}
      </div>

      {/* Feedback bar */}
      {feedback && (
        <div className={`feedback-bar feedback-bar-${feedback}`}>
          <div className="feedback-content">
            <div className="feedback-message">
              {feedback === 'correct' ? (
                <>
                  <span className="feedback-icon">✓</span>
                  <span className="feedback-text">Correct!</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">✗</span>
                  <div>
                    <div className="feedback-text">
                      {isGuided ? "Not quite — here's the answer" : 'Not quite'}
                    </div>
                    <div className="feedback-hint">
                      Answer: <strong>{Array.isArray(exercise.correct) ? exercise.correct.join(' ') : exercise.correct}</strong>
                      {exercise.nativeHint && (
                        <span className="feedback-native"> · {exercise.nativeHint}</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button className="continue-btn" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
