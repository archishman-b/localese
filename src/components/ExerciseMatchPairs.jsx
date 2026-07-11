import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech.js';
import './Exercise.css';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ExerciseMatchPairs({ exercise, onAnswer, feedback, langId }) {
  const { pairs } = exercise;
  const { speak } = useSpeech(langId);

  const [natives]  = useState(() => shuffle(pairs));
  const [meanings] = useState(() => shuffle(pairs));

  const [selectedNative,  setSelectedNative]  = useState(null);
  const [matched,         setMatched]         = useState({});   // { nativeIdx: meaningIdx }
  const [wrongPair,       setWrongPair]       = useState(null); // { n, m }
  const [hadError,        setHadError]        = useState(false);

  const matchedNatives  = new Set(Object.keys(matched).map(Number));
  const matchedMeanings = new Set(Object.values(matched).map(Number));

  const tryMatch = (nIdx, mIdx) => {
    const native  = natives[nIdx];
    const meaning = meanings[mIdx];

    if (native.meaning === meaning.meaning) {
      const newMatched = { ...matched, [nIdx]: mIdx };
      setMatched(newMatched);
      setSelectedNative(null);

      if (Object.keys(newMatched).length === pairs.length) {
        // all done — brief delay so user sees all-green before feedback bar
        setTimeout(() => onAnswer(null, !hadError), 350);
      }
    } else {
      setHadError(true);
      setWrongPair({ n: nIdx, m: mIdx });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedNative(null);
      }, 650);
    }
  };

  const handleNative = (idx) => {
    if (matchedNatives.has(idx) || wrongPair || feedback) return;
    speak(natives[idx].native);
    setSelectedNative(idx === selectedNative ? null : idx);
  };

  const handleMeaning = (idx) => {
    if (matchedMeanings.has(idx) || wrongPair || feedback || selectedNative === null) return;
    tryMatch(selectedNative, idx);
  };

  return (
    <div className="exercise-wrap">
      <h2 className="exercise-question">
        {exercise.question || 'Match each word to its meaning'}
      </h2>

      <div className="match-grid">
        {/* Left column: native script */}
        <div className="match-col">
          {natives.map((pair, idx) => {
            const isMatched  = matchedNatives.has(idx);
            const isSelected = selectedNative === idx;
            const isWrong    = wrongPair?.n === idx;
            return (
              <button
                key={idx}
                className={[
                  'match-btn match-native',
                  isMatched  ? 'match-done'       : '',
                  isSelected ? 'match-selected'    : '',
                  isWrong    ? 'match-wrong-shake' : '',
                ].join(' ')}
                onClick={() => handleNative(idx)}
                disabled={isMatched || !!wrongPair || !!feedback}
              >
                <span className="match-native-script">{pair.native}</span>
                <span className="match-native-romanize">{pair.word}</span>
              </button>
            );
          })}
        </div>

        {/* Right column: meanings */}
        <div className="match-col">
          {meanings.map((pair, idx) => {
            const isMatched  = matchedMeanings.has(idx);
            const isSelected = selectedNative !== null && !isMatched;
            const isWrong    = wrongPair?.m === idx;
            return (
              <button
                key={idx}
                className={[
                  'match-btn match-meaning',
                  isMatched ? 'match-done'       : '',
                  isSelected && !isMatched ? 'match-hoverable' : '',
                  isWrong   ? 'match-wrong-shake' : '',
                ].join(' ')}
                onClick={() => handleMeaning(idx)}
                disabled={isMatched || !!wrongPair || !!feedback}
              >
                {pair.meaning}
              </button>
            );
          })}
        </div>
      </div>

      <p className="match-hint">
        {selectedNative !== null
          ? 'Now tap the matching meaning →'
          : 'Tap a word on the left to start'}
      </p>
    </div>
  );
}
