/**
 * ECHOCRAFT VR — Procedural Audio Engine
 * Pure Web Audio API procedural synthesizer for resonant chimes, storm ambience, and sunrise swells.
 * 100% offline, zero network requests, zero external assets required.
 */

class EchoCraftAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAmbiencePlaying: boolean = false;

  // Ambience nodes
  private windGain: GainNode | null = null;
  private oceanGain: GainNode | null = null;
  private humGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Initializes atmospheric ambient soundscape (wind, ocean waves, lighthouse hum)
   * Safely triggered upon first user gesture (e.g. click, grab, button press)
   */
  startAmbience(): void {
    if (this.isAmbiencePlaying || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isAmbiencePlaying = true;

    // 1. Pink Noise generator for coastal storm wind
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(380, ctx.currentTime);

    this.windGain = ctx.createGain();
    this.windGain.gain.setValueAtTime(0.045, ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(ctx.destination);
    windSource.start(0);

    // 2. Low Ocean Surf generator (filtered oscillating noise)
    const oceanSource = ctx.createBufferSource();
    oceanSource.buffer = noiseBuffer;
    oceanSource.loop = true;

    const oceanFilter = ctx.createBiquadFilter();
    oceanFilter.type = 'bandpass';
    oceanFilter.frequency.setValueAtTime(140, ctx.currentTime);
    oceanFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    this.oceanGain = ctx.createGain();
    this.oceanGain.gain.setValueAtTime(0.035, ctx.currentTime);

    oceanSource.connect(oceanFilter);
    oceanFilter.connect(this.oceanGain);
    this.oceanGain.connect(ctx.destination);
    oceanSource.start(0);

    // 3. Faint electrical/lantern hum in the distance
    const humOsc = ctx.createOscillator();
    humOsc.type = 'sine';
    humOsc.frequency.setValueAtTime(110, ctx.currentTime);

    this.humGain = ctx.createGain();
    this.humGain.gain.setValueAtTime(0.012, ctx.currentTime);

    humOsc.connect(this.humGain);
    this.humGain.connect(ctx.destination);
    humOsc.start(0);
  }

  /**
   * Adjusts ambient soundscape to reflect world restoration state
   */
  setAmbienceStage(stage: number): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (stage === 0) {
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.045, now, 1.0);
      if (this.oceanGain) this.oceanGain.gain.setTargetAtTime(0.035, now, 1.0);
    } else if (stage === 1) {
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.03, now, 1.0);
    } else if (stage === 2) {
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.015, now, 1.0);
      if (this.oceanGain) this.oceanGain.gain.setTargetAtTime(0.025, now, 1.0);
    } else if (stage === 3) {
      // Calming peaceful sea at sunrise, gentle breeze
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.005, now, 2.0);
      if (this.oceanGain) this.oceanGain.gain.setTargetAtTime(0.018, now, 2.0);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.isMuted) {
        this.ctx.suspend().catch(() => {});
      } else {
        this.ctx.resume().catch(() => {});
      }
    }
    return this.isMuted;
  }

  /**
   * Plays a resonant harmonic chime when a memory fragment is socketed or interacted with
   */
  playChime(type: 'warmth' | 'life' | 'hope' | 'complete' | 'grab' | 'reset' | 'wrong'): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      return;
    }

    if (type === 'grab') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
      return;
    }

    if (type === 'reset') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
      return;
    }

    // Musical Chords for the 3 fragments
    let freqs: number[] = [261.63, 329.63, 392.0, 493.88]; // C maj7 (Warmth)
    if (type === 'life') {
      freqs = [329.63, 415.3, 493.88, 659.25, 783.99]; // E maj / Emerald
    } else if (type === 'hope') {
      freqs = [349.23, 440.0, 523.25, 659.25, 880.0]; // F maj9 / Azure
    } else if (type === 'complete') {
      freqs = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // Grand Sunrise
    }

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.12 / Math.sqrt(freqs.length), now + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + delay + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 2.0);
    });
  }
}

export const SoundEngine = new EchoCraftAudioEngine();
