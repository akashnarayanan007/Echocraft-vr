/**
 * ECHOCRAFT VR — Procedural Audio Engine
 * Pure Web Audio API procedural synthesizer for resonant chimes, storm ambience, and sunrise swells.
 * 100% offline, zero network requests, zero external assets required.
 */

class EchoCraftAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

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
   * Plays a resonant harmonic chime when a memory fragment is socketed or interacted with
   */
  playChime(type: 'warmth' | 'life' | 'hope' | 'complete' | 'grab' | 'reset'): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

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
