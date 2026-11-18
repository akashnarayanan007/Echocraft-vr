/**
 * Synthesizes a dedicated 180.0-second background soundtrack for the developer walkthrough.
 * Delivers gentle, subtle, ambient cinematic texture designed to sit smoothly underneath narration.
 */

import fs from 'fs';

const SAMPLE_RATE = 48000;
const DURATION = 180.0; // 180 seconds
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

const NOTES = {
  C2: 65.41,
  G2: 98.00,
  C3: 130.81,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  G3: 196.00,
  A3: 220.00,
  Bb3: 233.08,
  B3: 246.94,
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
};

function addTone(freq, startTime, duration, gain, pan = 0, wave = 'sine') {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const endSample = Math.min(TOTAL_SAMPLES, Math.floor((startTime + duration) * SAMPLE_RATE));
  
  for (let i = startSample; i < endSample; i++) {
    const t = (i - startSample) / SAMPLE_RATE;
    
    let env = 1.0;
    const attack = Math.min(2.0, duration * 0.25);
    const release = Math.min(2.5, duration * 0.3);
    
    if (t < attack) env = t / attack;
    else if (t > duration - release) env = (duration - t) / release;

    let sampleVal = 0;
    const phase = 2 * Math.PI * freq * t;
    
    if (wave === 'sine') {
      sampleVal = Math.sin(phase);
    } else if (wave === 'warm') {
      sampleVal = 0.75 * Math.sin(phase) + 0.2 * Math.sin(phase * 2) + 0.05 * Math.sin(phase * 3);
    } else if (wave === 'bell') {
      sampleVal = Math.sin(phase) * Math.exp(-t * 1.8) + 0.25 * Math.sin(phase * 2.76) * Math.exp(-t * 2.8);
    }

    const val = sampleVal * gain * env;
    const leftGain = Math.cos((pan + 1) * Math.PI / 4);
    const rightGain = Math.sin((pan + 1) * Math.PI / 4);
    
    left[i] += val * leftGain;
    right[i] += val * rightGain;
  }
}

// 1. Foundation Ambience: Ocean sub-bass & lighthouse resonant frequency (0 - 180s)
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  // Sub bass pulse
  const sub = Math.sin(2 * Math.PI * 55.0 * t) * 0.04;
  const drone = (Math.sin(2 * Math.PI * 110.0 * t) + 0.4 * Math.sin(2 * Math.PI * 165.0 * t)) * 0.025;
  
  // Attenuate slightly in the golden sunrise finale
  const ambientEnv = t < 125 ? 1.0 : Math.max(0.3, 1.0 - (t - 125) / 40.0);
  left[i] += (sub + drone) * ambientEnv;
  right[i] += (sub + drone) * ambientEnv;
}

// 2. Continuous Subtle Harmonic Progressions across all 8 segments:
// Segment 1: Intro (0-20s) C minor atmospheric
addTone(NOTES.C3, 0.5, 19.0, 0.10, -0.3, 'warm');
addTone(NOTES.G3, 2.0, 17.5, 0.08, 0.3, 'warm');
addTone(NOTES.Eb3, 4.0, 15.0, 0.06, 0.0, 'sine');

// Segment 2: World & Objective (20-44s)
addTone(NOTES.C3, 20.5, 23.0, 0.10, -0.2, 'warm');
addTone(NOTES.Ab3, 22.0, 21.0, 0.08, 0.2, 'warm');
addTone(NOTES.Eb4, 25.0, 18.0, 0.06, 0.0, 'sine');

// Segment 3: VR Controls (44-68s)
addTone(NOTES.G2, 44.5, 23.0, 0.10, -0.3, 'warm');
addTone(NOTES.D3, 46.0, 21.5, 0.08, 0.3, 'warm');
addTone(NOTES.Bb3, 48.0, 19.0, 0.07, 0.0, 'sine');

// Segment 4: Warmth Restoration (68-92s) -> Harmonizes in warm C Major
addTone(NOTES.C3, 68.5, 23.0, 0.12, -0.2, 'warm');
addTone(NOTES.E3, 69.5, 22.0, 0.10, 0.2, 'warm');
addTone(NOTES.G3, 71.0, 20.0, 0.08, 0.0, 'warm');
addTone(NOTES.C4, 71.5, 5.0, 0.08, 0.3, 'bell');
addTone(NOTES.G4, 72.0, 5.0, 0.08, -0.3, 'bell');

// Segment 5: Life Restoration (92-116s) -> Harmonizes in blooming F Major
addTone(NOTES.F2, 92.5, 23.0, 0.12, -0.2, 'warm');
addTone(NOTES.A3, 93.5, 22.0, 0.10, 0.2, 'warm');
addTone(NOTES.C4, 95.0, 20.0, 0.09, 0.0, 'warm');
addTone(NOTES.F4, 95.5, 5.0, 0.08, 0.3, 'bell');
addTone(NOTES.A4, 96.0, 5.0, 0.08, -0.3, 'bell');

// Segment 6: Hope Restoration (116-140s) -> Bright G Major / Sunrise transition
addTone(NOTES.G2, 116.5, 23.0, 0.13, -0.2, 'warm');
addTone(NOTES.B3, 117.5, 22.0, 0.11, 0.2, 'warm');
addTone(NOTES.D4, 119.0, 20.0, 0.10, 0.0, 'warm');
addTone(NOTES.G4, 119.5, 5.0, 0.09, 0.3, 'bell');
addTone(NOTES.B4, 120.0, 5.0, 0.09, -0.3, 'bell');

// Segment 7: Finale & Room-scale Expansion (140-162s) -> Radiant C-G-Am-F
const finaleChords = [
  { time: 140.0, notes: [NOTES.C3, NOTES.G3, NOTES.E4, NOTES.C5] },
  { time: 146.0, notes: [NOTES.G2, NOTES.G3, NOTES.D4, NOTES.B4] },
  { time: 151.0, notes: [NOTES.A2, NOTES.E3, NOTES.C4, NOTES.A4] },
  { time: 156.0, notes: [NOTES.F2, NOTES.C3, NOTES.A3, NOTES.F4] }
];
finaleChords.forEach(c => {
  c.notes.forEach((freq, idx) => {
    addTone(freq, c.time, 6.0, 0.09, (idx % 2 === 0 ? -0.25 : 0.25), 'warm');
  });
});

// Segment 8: Replay & Peaceful Closing (162-180s)
addTone(NOTES.C3, 162.5, 17.0, 0.10, -0.2, 'warm');
addTone(NOTES.G3, 164.0, 15.5, 0.08, 0.2, 'warm');
addTone(NOTES.E4, 166.0, 13.0, 0.06, 0.0, 'sine');
addTone(NOTES.C5, 172.0, 7.5, 0.06, 0.0, 'bell');

// Normalize peak to -3.0 dBFS so it never overpowers speech
let maxPeak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  if (Math.abs(left[i]) > maxPeak) maxPeak = Math.abs(left[i]);
  if (Math.abs(right[i]) > maxPeak) maxPeak = Math.abs(right[i]);
}
const targetPeak = 0.707; // -3.0 dBFS
const normFactor = maxPeak > 0 ? (targetPeak / maxPeak) : 1.0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  left[i] *= normFactor;
  right[i] *= normFactor;
}

// Write 48kHz Stereo 16-bit WAV
const wavHeader = Buffer.alloc(44);
const dataSize = TOTAL_SAMPLES * 2 * 2;

wavHeader.write('RIFF', 0);
wavHeader.writeUInt32LE(36 + dataSize, 4);
wavHeader.write('WAVE', 8);
wavHeader.write('fmt ', 12);
wavHeader.writeUInt32LE(16, 16);
wavHeader.writeUInt16LE(1, 20);
wavHeader.writeUInt16LE(2, 22);
wavHeader.writeUInt32LE(SAMPLE_RATE, 24);
wavHeader.writeUInt32LE(SAMPLE_RATE * 2 * 2, 28);
wavHeader.writeUInt16LE(4, 32);
wavHeader.writeUInt16LE(16, 34);
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

const outFile = 'public/audit-artifacts/echocraft_walkthrough_music.wav';
fs.writeFileSync(outFile, Buffer.concat([wavHeader, pcmBuffer]));
console.log(`Generated official 180s walkthrough music: ${outFile} (${(fs.statSync(outFile).size / (1024 * 1024)).toFixed(2)} MB, 180.0s)`);
