/**
 * Synthesizes a dedicated 85-second cinematic trailer soundtrack
 * Built using Web Audio API synthesis principles & exported to 48kHz Stereo WAV
 */

import fs from 'fs';

const SAMPLE_RATE = 48000;
const DURATION = 85.0; // 85 seconds
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

// Note frequencies (Hz)
const NOTES = {
  // Low C drone & bass
  C2: 65.41,
  G2: 98.00,
  C3: 130.81,
  Eb3: 155.56,
  F3: 174.61,
  G3: 196.00,
  Ab3: 207.65,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.00,
  C6: 1046.50
};

// Procedural musical events across the 85-second arc:
// Act 1 (0-10s): Moody C minor atmospheric pads, deep 65Hz oceanic drone, gentle wind
// Act 1.5 (10-22s): Soft celestial arpeggio (C3, G3, Eb3, Bb3), mystery & expectation
// Act 2 (22-36s): Warmth restoration swell at 22s (warm C major triad C3, E3, G3, C4 chord bloom)
// Act 3 (36-50s): Life restoration swell at 36s (lush lyrical strings & bells E3, G#3, B3, E4)
// Act 4 (50-64s): Hope restoration swell at 50s (triumphant crescendo moving to A major/D major)
// Act 5 (64-78s): Grand golden sunrise majesty (full cinematic chords C-G-Am-F triumphant progression)
// Act 6 (78-85s): Peaceful resonant celestial resolution chord fading gently

function addTone(freq, startTime, duration, gain, pan = 0, wave = 'sine') {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const endSample = Math.min(TOTAL_SAMPLES, Math.floor((startTime + duration) * SAMPLE_RATE));
  
  for (let i = startSample; i < endSample; i++) {
    const t = (i - startSample) / SAMPLE_RATE;
    const progress = t / duration;
    
    // Smooth attack and release envelope
    let env = 1.0;
    const attack = Math.min(1.2, duration * 0.2);
    const release = Math.min(2.0, duration * 0.3);
    
    if (t < attack) env = t / attack;
    else if (t > duration - release) env = (duration - t) / release;

    let sampleVal = 0;
    const phase = 2 * Math.PI * freq * t;
    
    if (wave === 'sine') {
      sampleVal = Math.sin(phase);
    } else if (wave === 'warm') {
      sampleVal = 0.7 * Math.sin(phase) + 0.25 * Math.sin(phase * 2) + 0.1 * Math.sin(phase * 3);
    } else if (wave === 'bell') {
      sampleVal = Math.sin(phase) * Math.exp(-t * 2.5) + 0.3 * Math.sin(phase * 2.76) * Math.exp(-t * 3.5);
    }

    const val = sampleVal * gain * env;
    const leftGain = Math.cos((pan + 1) * Math.PI / 4);
    const rightGain = Math.sin((pan + 1) * Math.PI / 4);
    
    left[i] += val * leftGain;
    right[i] += val * rightGain;
  }
}

// 1. Deep Ocean & Lighthouse Ambient Drone (Continuous 0 - 85s)
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  // Sub bass pulse
  const sub = Math.sin(2 * Math.PI * 55.0 * t) * 0.08;
  const drone = (Math.sin(2 * Math.PI * 110.0 * t) + 0.5 * Math.sin(2 * Math.PI * 165.0 * t)) * 0.05;
  // Dynamic attenuation as sunrise breaks
  const ambientEnv = t < 55 ? 1.0 : Math.max(0.2, 1.0 - (t - 55) / 20.0);
  left[i] += (sub + drone) * ambientEnv;
  right[i] += (sub + drone) * ambientEnv;
}

// 2. Act 1: Atmospheric Pads (0 - 12s)
addTone(NOTES.C3, 0.5, 11.5, 0.15, -0.3, 'warm');
addTone(NOTES.G3, 1.0, 11.0, 0.12, 0.3, 'warm');
addTone(NOTES.Eb3, 2.0, 10.0, 0.10, 0.0, 'sine');

// 3. Act 1.5: Mystery Chimes (11 - 22s)
const mysteryChimes = [NOTES.C4, NOTES.Eb4, NOTES.G4, NOTES.Bb4, NOTES.C5];
mysteryChimes.forEach((note, idx) => {
  addTone(note, 11.5 + idx * 2.0, 4.0, 0.08, (idx % 2 === 0 ? -0.4 : 0.4), 'bell');
});

// 4. Act 2: Warmth Restoration Chords & Swell (22 - 36s)
// Swell sound at 22s
addTone(NOTES.C3, 22.0, 14.0, 0.18, -0.2, 'warm');
addTone(NOTES.E3, 22.5, 13.5, 0.16, 0.2, 'warm');
addTone(NOTES.G3, 22.8, 13.0, 0.14, 0.0, 'warm');
addTone(NOTES.C4, 23.0, 6.0, 0.12, 0.3, 'bell');
addTone(NOTES.E4, 23.3, 6.0, 0.12, -0.3, 'bell');
addTone(NOTES.G4, 23.6, 6.0, 0.12, 0.1, 'bell');

// Secondary lyrical arpeggio
addTone(NOTES.G4, 28.0, 5.0, 0.10, 0.2, 'bell');
addTone(NOTES.E4, 30.0, 5.0, 0.10, -0.2, 'bell');
addTone(NOTES.C4, 32.0, 5.0, 0.10, 0.0, 'bell');

// 5. Act 3: Life Restoration Chords & Organic Bloom (36 - 50s)
addTone(NOTES.F3, 36.5, 13.5, 0.18, -0.3, 'warm');
addTone(NOTES.A3, 36.8, 13.2, 0.16, 0.3, 'warm');
addTone(NOTES.C4, 37.0, 13.0, 0.15, 0.0, 'warm');
addTone(NOTES.E4, 37.2, 7.0, 0.14, 0.3, 'bell');
addTone(NOTES.A4, 37.5, 7.0, 0.14, -0.3, 'bell');
addTone(NOTES.C5, 37.8, 7.0, 0.12, 0.0, 'bell');

// Blooming melodic counterpoint
addTone(NOTES.D4, 43.0, 6.0, 0.11, -0.2, 'bell');
addTone(NOTES.F4, 45.0, 6.0, 0.11, 0.2, 'bell');
addTone(NOTES.A4, 47.0, 6.0, 0.11, 0.0, 'bell');

// 6. Act 4: Hope Climax & Storm Dissolve (50 - 64s)
addTone(NOTES.G3, 50.5, 14.0, 0.22, -0.2, 'warm');
addTone(NOTES.B3, 50.8, 13.7, 0.20, 0.2, 'warm');
addTone(NOTES.D4, 51.0, 13.5, 0.18, 0.0, 'warm');
addTone(NOTES.G4, 51.2, 7.0, 0.15, 0.3, 'bell');
addTone(NOTES.B4, 51.5, 7.0, 0.15, -0.3, 'bell');
addTone(NOTES.D5, 51.8, 7.0, 0.15, 0.1, 'bell');

// 7. Act 5: Grand Sunrise Majesty & Full Choir Resonances (64 - 78s)
// Radiant C Major crescendo
const sunriseChords = [
  { time: 64.0, notes: [NOTES.C3, NOTES.G3, NOTES.E4, NOTES.C5] },
  { time: 68.0, notes: [NOTES.G2, NOTES.G3, NOTES.D4, NOTES.B4] },
  { time: 72.0, notes: [NOTES.A2, NOTES.E3, NOTES.C4, NOTES.A4] },
  { time: 75.0, notes: [NOTES.F2, NOTES.C3, NOTES.A3, NOTES.F4, NOTES.C5] }
];

sunriseChords.forEach(chord => {
  chord.notes.forEach((freq, idx) => {
    addTone(freq, chord.time, 5.0, 0.16, (idx % 2 === 0 ? -0.25 : 0.25), 'warm');
    addTone(freq, chord.time, 4.0, 0.08, (idx % 2 === 0 ? 0.25 : -0.25), 'bell');
  });
});

// 8. Act 6: Celestial Epilogue & Final Resolution (78 - 85s)
addTone(NOTES.C3, 78.5, 6.5, 0.18, 0.0, 'warm');
addTone(NOTES.G3, 78.5, 6.5, 0.15, -0.2, 'warm');
addTone(NOTES.E4, 78.8, 6.2, 0.12, 0.2, 'warm');
addTone(NOTES.G4, 79.0, 6.0, 0.10, 0.0, 'bell');
addTone(NOTES.C5, 79.2, 5.8, 0.10, 0.0, 'bell');

// Peak normalization to -2 dBFS to guarantee headroom under voiceover
let maxPeak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  if (Math.abs(left[i]) > maxPeak) maxPeak = Math.abs(left[i]);
  if (Math.abs(right[i]) > maxPeak) maxPeak = Math.abs(right[i]);
}

const targetPeak = 0.794; // -2.0 dBFS
const normFactor = maxPeak > 0 ? (targetPeak / maxPeak) : 1.0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  left[i] *= normFactor;
  right[i] *= normFactor;
}

// Convert Float32 to 16-bit PCM WAV
const wavHeader = Buffer.alloc(44);
const dataSize = TOTAL_SAMPLES * 2 * 2; // 2 channels, 16-bit (2 bytes)

// RIFF header
wavHeader.write('RIFF', 0);
wavHeader.writeUInt32LE(36 + dataSize, 4);
wavHeader.write('WAVE', 8);
wavHeader.write('fmt ', 12);
wavHeader.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
wavHeader.writeUInt16LE(1, 20); // audioFormat (1 = PCM)
wavHeader.writeUInt16LE(2, 22); // numChannels (2)
wavHeader.writeUInt32LE(SAMPLE_RATE, 24); // sampleRate (48000)
wavHeader.writeUInt32LE(SAMPLE_RATE * 2 * 2, 28); // byteRate
wavHeader.writeUInt16LE(4, 32); // blockAlign
wavHeader.writeUInt16LE(16, 34); // bitsPerSample
wavHeader.write('data', 36);
wavHeader.writeUInt32LE(dataSize, 40);

const pcmBuffer = Buffer.alloc(dataSize);
let offset = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const lSample = Math.max(-1, Math.min(1, left[i]));
  const rSample = Math.max(-1, Math.min(1, right[i]));
  
  const lInt = lSample < 0 ? lSample * 32768 : lSample * 32767;
  const rInt = rSample < 0 ? rSample * 32768 : rSample * 32767;
  
  pcmBuffer.writeInt16LE(Math.floor(lInt), offset);
  pcmBuffer.writeInt16LE(Math.floor(rInt), offset + 2);
  offset += 4;
}

const outFile = 'public/audit-artifacts/echocraft_trailer_music.wav';
fs.writeFileSync(outFile, Buffer.concat([wavHeader, pcmBuffer]));
console.log(`Generated official trailer music track: ${outFile} (${(fs.statSync(outFile).size / (1024 * 1024)).toFixed(2)} MB, 85.0s)`);
