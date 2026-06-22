import { useState } from 'react';
import './Exercise.css';

export default function ExerciseWordBank({ exercise, onAnswer, feedback }) {
  const [selected, setSelected] = useState([]);

  const handleAdd = (word, idx) => {
    if (feedback) return;
    setSelected(prev => [...prev, { word, idx }]);
  };

  const handleRemove = (itemIdx) => {
    if (feedback) return;
    setSelected(prev => prev.filter((_, i) => i !== itemIdx));
  };

  const handleCheck = () => {
    if (selected.length === 0 || feedback) return;
    const answer = selected.map(s => s.word);
    const isCorrect = JSON.stringify(answer) === JSON.stringify(exercise.correct);
    onAnswer(answer, isCorrect);
  };

  const usedIndices = new Set(selected.map(s => s.idx));

  return (
    <div className="exercise-wrap">
      {exercise.nativeHint && (
        <div className="native-showcase">
          <span className="native-script">{exercise.nativeHint}</span>
        </div>
      )}

      <h2 className="exercise-question">{exercise.question}</h2>

      {/* Answer tray */}
      <div className={`answer-tray ${feedback ? `tray-${feedback}` : ''}`}>
        {selected.length === 0 && (
          <span className="tray-placeholder">Tap words to build the phrase</span>
        )}
        {selected.map((item, i) => (
          <button
            key={i}
            className="tray-word"
            onClick={() => handleRemove(i)}
            disabled={!!feedback}
          >
            {item.word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="word-bank">
        {exercise.words.map((word, idx) => (
          <button
            key={idx}
            className={`bank-word ${usedIndices.has(idx) ? 'bank-word-used' : ''}`}
            onClick={() => !usedIndices.has(idx) && handleAdd(word, idx)}
            disabled={!!feedback || usedIndices.has(idx)}
          >
            {word}
          </button>
        ))}
      </div>

      {!feedback && (
        <button
          className={`check-btn ${selected.length === 0 ? 'check-btn-disabled' : ''}`}
          onClick={handleCheck}
          disabled={selected.length === 0}
        >
          Check
        </button>
      )}
    </div>
  );
}
