import { useSpeech } from '../hooks/useSpeech.js';
import './Exercise.css';

export default function ExerciseScenarioMCQ({ exercise, onAnswer, feedback, selectedAnswer, langId }) {
  const { speak, isSupported } = useSpeech(langId);

  const handleSelect = (option) => {
    if (feedback) return;
    const isCorrect = option === exercise.correct;
    onAnswer(option, isCorrect);
  };

  return (
    <div className="exercise-wrap">
      {/* Scenario card */}
      <div className="scenario-card">
        <div className="scenario-label">📍 The situation</div>
        <p className="scenario-text">{exercise.scenario}</p>
      </div>

      {exercise.nativeHint && isSupported && (
        <div className="scenario-speak-row">
          <button className="native-speak-btn" onClick={() => speak(exercise.nativeHint)} title="Hear pronunciation">
            🔊 Hear the phrase
          </button>
        </div>
      )}

      <h2 className="exercise-question">What do you say?</h2>

      <div className="options-grid options-grid-2">
        {exercise.options.map((option) => {
          let state = 'idle';
          if (feedback && option === selectedAnswer) {
            state = feedback === 'correct' ? 'correct' : 'wrong';
          } else if (feedback && option === exercise.correct && feedback === 'wrong') {
            state = 'reveal';
          }

          return (
            <button
              key={option}
              className={`option-btn option-${state}`}
              onClick={() => handleSelect(option)}
              disabled={!!feedback}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
