import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LANGUAGES } from '../data/index.js';
import { useStore } from '../store/index.js';
import ExerciseMCQ from '../components/ExerciseMCQ.jsx';
import ExerciseWordBank from '../components/ExerciseWordBank.jsx';
import ExerciseTranslate from '../components/ExerciseTranslate.jsx';
import Results from '../components/Results.jsx';
import './Lesson.css';

export default function Lesson() {
  const { langId, lessonId } = useParams();
  const navigate = useNavigate();
  const lang = LANGUAGES[langId];
  const { session, startSession, answerExercise, nextExercise, completeSession, clearSession } = useStore();

  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Find lesson
  const lesson = lang?.units.flatMap(u => u.lessons).find(l => l.id === lessonId);

  useEffect(() => {
    if (lang && lesson && (!session || session.lessonId !== lessonId)) {
      startSession(langId, lessonId);
    }
  }, [langId, lessonId]);

  if (!lang || !lesson || !session) return <div className="lesson-loading">Loading...</div>;

  const exercises = lesson.exercises;
  const currentIdx = session.currentExerciseIndex;
  const exercise = exercises[currentIdx];
  const isComplete = session.completed || currentIdx >= exercises.length;

  const progressPct = Math.round((currentIdx / exercises.length) * 100);

  const handleAnswer = (answer, isCorrect) => {
    if (feedback) return; // already answered
    setSelectedAnswer(answer);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    answerExercise(isCorrect);
  };

  const handleContinue = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentIdx + 1 >= exercises.length) {
      completeSession();
    } else {
      nextExercise();
    }
  };

  const handleExit = () => {
    clearSession();
    navigate(`/learn/${langId}`);
  };

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

  return (
    <div className={`lesson-page ${feedback ? `feedback-${feedback}` : ''}`}>
      {/* Top bar */}
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

      {/* Exercise area */}
      <div className="exercise-area">
        <div className="exercise-counter">{currentIdx + 1} / {exercises.length}</div>

        {exercise.type === 'mcq' && (
          <ExerciseMCQ
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
                    <div className="feedback-text">Not quite</div>
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
