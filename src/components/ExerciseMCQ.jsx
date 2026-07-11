import { useSpeech } from '../hooks/useSpeech.js';
import './Exercise.css';

export default function ExerciseMCQ({ exercise, onAnswer, feedback, selectedAnswer, langId }) {
  const { speak, isSupported } = useSpeech(langId);

  const handleSelect = (option) => {
    if (feedback) return;
    const isCorrect = option === exercise.correct;
    onAnswer(option, isCorrect);
  };

  return (
    <div className="exercise-wrap">
      {exercise.nativeHint && (
        <div className="native-showcase">
          <span className="native-script">{exercise.nativeHint}</span>
          {isSupported && (
            <button className="native-speak-btn" onClick={() => speak(exercise.nativeHint)} title="Hear pronunciation">🔊</button>
          )}
        </div>
      )}

      <h2 className="exercise-question">{exercise.question}</h2>

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
