import manifest from '../data/audio-manifest.json';

// Web Speech API language codes — fallback when no pre-generated audio
const LANG_CODES = {
  hindi:   'hi-IN',
  telugu:  'te-IN',
  kannada: 'kn-IN',
  bengali: 'bn-IN',
  marathi: 'mr-IN',
};

// Single audio instance — prevents overlapping playback
let currentAudio = null;

function playFile(src) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(src);
  currentAudio.play().catch(() => {
    // Autoplay may be blocked until first user interaction — silent fail is ok
  });
}

function playSpeechAPI(text, langCode) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  utter.rate = 0.82;
  utter.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.speak(utter);
      window.speechSynthesis.onvoiceschanged = null;
    };
  } else {
    window.speechSynthesis.speak(utter);
  }
}

export function useSpeech(langId) {
  const langManifest = manifest[langId] || {};
  const langCode     = LANG_CODES[langId] || 'hi-IN';
  const isSupported  = typeof window !== 'undefined' &&
    ('Audio' in window || 'speechSynthesis' in window);

  const speak = (text) => {
    if (!text || typeof window === 'undefined') return;

    // ① Pre-generated MP3 — best quality
    const hash = langManifest[text];
    if (hash) {
      playFile(`/audio/${langId}/${hash}.mp3`);
      return;
    }

    // ② Web Speech API — decent fallback, free, zero setup
    if ('speechSynthesis' in window) {
      playSpeechAPI(text, langCode);
    }
  };

  return { speak, isSupported };
}
