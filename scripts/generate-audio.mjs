/**
 * Bhasha — Audio Generation Script
 * ─────────────────────────────────
 * Pre-generates MP3 files for every native-script word in the app using
 * Google Cloud Text-to-Speech, then writes a manifest so the app can
 * play them as static files (zero per-user TTS cost).
 *
 * SETUP (one-time):
 *   1. Go to https://console.cloud.google.com
 *   2. Create a project → Enable "Cloud Text-to-Speech API"
 *   3. Create a Service Account → download the JSON key
 *   4. export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
 *   5. npm run generate-audio
 *
 * Re-running is safe — already-generated files are skipped.
 */

import textToSpeech from '@google-cloud/text-to-speech';
import { createHash } from 'crypto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Voice selection per language ─────────────────────────────────
// Neural2 > WaveNet > Standard — use best available for each lang
const VOICES = {
  hindi:   { languageCode: 'hi-IN', name: 'hi-IN-Neural2-D' },   // best quality
  marathi: { languageCode: 'mr-IN', name: 'mr-IN-Wavenet-A' },   // wavenet (no Neural2 yet)
  bengali: { languageCode: 'bn-IN', name: 'bn-IN-Wavenet-A' },   // wavenet
  telugu:  { languageCode: 'te-IN', name: 'te-IN-Standard-A' },  // standard (best available)
  kannada: { languageCode: 'kn-IN', name: 'kn-IN-Standard-A' },  // standard (best available)
};

// ── Extract native texts from lesson content ─────────────────────
function extractFromLessons(langData) {
  const set = new Set();
  langData.stages?.forEach(stage => {
    stage.units?.forEach(unit => {
      unit.lessons?.forEach(lesson => {
        lesson.vocab?.forEach(v => { if (v.native) set.add(v.native); });
        lesson.exercises?.forEach(e => {
          if (e.nativeHint) set.add(e.nativeHint);
          e.pairs?.forEach(p => { if (p.native) set.add(p.native); });
        });
      });
    });
  });
  return set;
}

// ── Extract native texts from reference data ─────────────────────
function extractFromReference(refData) {
  const set = new Set();
  refData.categories?.forEach(cat => {
    cat.items?.forEach(item => {
      if (item.native) set.add(item.native);
      // Also include example phrases for deeper learning
      item.examples?.forEach(ex => { if (ex.native) set.add(ex.native); });
    });
  });
  return set;
}

// ── Deterministic filename from text ────────────────────────────
function toHash(text) {
  return createHash('md5').update(text).digest('hex').slice(0, 8);
}

// ── Delay helper ─────────────────────────────────────────────────
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('\n✗ Missing GOOGLE_APPLICATION_CREDENTIALS env var.');
    console.error('  export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"\n');
    process.exit(1);
  }

  const client = new textToSpeech.TextToSpeechClient();

  // Import all language + reference data
  const [
    { hindi },   { telugu },  { kannada },
    { bengali }, { marathi },
    { hindiReference },   { teluguReference },
    { kannadaReference }, { bengaliReference },
    { marathiReference },
  ] = await Promise.all([
    import('../src/data/languages/hindi.js'),
    import('../src/data/languages/telugu.js'),
    import('../src/data/languages/kannada.js'),
    import('../src/data/languages/bengali.js'),
    import('../src/data/languages/marathi.js'),
    import('../src/data/reference/hindi-reference.js'),
    import('../src/data/reference/telugu-reference.js'),
    import('../src/data/reference/kannada-reference.js'),
    import('../src/data/reference/bengali-reference.js'),
    import('../src/data/reference/marathi-reference.js'),
  ]);

  const LANGUAGES  = { hindi, telugu, kannada, bengali, marathi };
  const REFERENCES = {
    hindi: hindiReference, telugu: teluguReference,
    kannada: kannadaReference, bengali: bengaliReference, marathi: marathiReference,
  };

  const manifest = {};
  let totalGenerated = 0;
  let totalSkipped   = 0;
  let totalFailed    = 0;

  for (const [langId, langData] of Object.entries(LANGUAGES)) {
    console.log(`\n── ${langId.toUpperCase()} (${VOICES[langId].name}) ──`);

    const outDir = join(ROOT, 'public', 'audio', langId);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const texts = new Set([
      ...extractFromLessons(langData),
      ...extractFromReference(REFERENCES[langId]),
    ]);

    console.log(`  ${texts.size} unique native texts`);
    manifest[langId] = {};

    for (const text of texts) {
      const hash    = toHash(text);
      const outPath = join(outDir, `${hash}.mp3`);

      // Skip if already generated
      if (existsSync(outPath)) {
        manifest[langId][text] = hash;
        totalSkipped++;
        process.stdout.write('·');
        continue;
      }

      try {
        const [response] = await client.synthesizeSpeech({
          input: { text },
          voice: VOICES[langId],
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.82, pitch: 0 },
        });

        writeFileSync(outPath, Buffer.from(response.audioContent));
        manifest[langId][text] = hash;
        totalGenerated++;
        process.stdout.write('▪');
      } catch (err) {
        totalFailed++;
        process.stdout.write('✗');
        console.error(`\n  Failed: "${text}" — ${err.message}`);
      }

      // Avoid hammering the API — 50ms between requests
      await delay(50);
    }

    console.log(); // newline after progress dots
  }

  // Write manifest to src/data — gets bundled with the app
  const manifestPath = join(ROOT, 'src', 'data', 'audio-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\n────────────────────────────────');
  console.log(`✓ Generated : ${totalGenerated} files`);
  console.log(`· Skipped   : ${totalSkipped} (already existed)`);
  if (totalFailed) console.log(`✗ Failed    : ${totalFailed}`);
  console.log(`✓ Manifest  : src/data/audio-manifest.json`);
  console.log('\nNext: npm run build  (audio files in public/audio/ are served as static assets)');
}

main().catch(err => {
  console.error('\n✗ Fatal:', err.message);
  process.exit(1);
});
