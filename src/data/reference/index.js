import { hindiReference } from './hindi-reference.js';
import { teluguReference } from './telugu-reference.js';
import { kannadaReference } from './kannada-reference.js';
import { bengaliReference } from './bengali-reference.js';
import { marathiReference } from './marathi-reference.js';

export const REFERENCE_DATA = {
  hindi: hindiReference,
  telugu: teluguReference,
  kannada: kannadaReference,
  bengali: bengaliReference,
  marathi: marathiReference,
};

export const REFERENCE_LIST = Object.values(REFERENCE_DATA);
