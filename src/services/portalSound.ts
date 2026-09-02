/**
 * RYVANTA '26 Ultra-Modern Quantum Holographic Login Sound Synthesizer
 * Generates an ultra-crisp, premium sci-fi portal login sound effect:
 * (Sub-bass hydraulic power drop + airlock energy whoosh + crystal holographic bell arpeggio + positive cyber ping)
 */
class HolographicPortalSoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Plays the new Quantum Holographic Login Sound
   */
  public playLoginSound() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // ─────────────────────────────────────────────────────────────
      // 1. PUNCHY SUB-BASS HYDRAULIC IMPACT (808 Power Drop)
      // ─────────────────────────────────────────────────────────────
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(125, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.42);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.48);

      // ─────────────────────────────────────────────────────────────
      // 2. SILKY AIRLOCK ENERGY WHOOSH (Noise Particle Sweep)
      // ─────────────────────────────────────────────────────────────
      const bufferSize = this.ctx.sampleRate * 0.5;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(900, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(5400, now + 0.35);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.48);

      // ─────────────────────────────────────────────────────────────
      // 3. CRYSTAL HOLOGRAPHIC BELL ARPEGGIO (E Major 9 Celestial Tones)
      // ─────────────────────────────────────────────────────────────
      const crystalNotes = [
        659.25,  // E5
        830.61,  // G#5
        987.77,  // B5
        1244.51, // D#6
        1318.51, // E6
        1661.22, // G#6
        1975.53  // B6
      ];

      crystalNotes.forEach((freq, idx) => {
        const bellOsc = this.ctx!.createOscillator();
        const bellGain = this.ctx!.createGain();
        const bellFilter = this.ctx!.createBiquadFilter();

        const noteStart = now + 0.05 + idx * 0.04;

        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(freq, noteStart);

        bellFilter.type = 'bandpass';
        bellFilter.frequency.setValueAtTime(freq * 1.05, noteStart);
        bellFilter.Q.setValueAtTime(5.0, noteStart);

        bellGain.gain.setValueAtTime(0.001, noteStart);
        bellGain.gain.linearRampToValueAtTime(0.14, noteStart + 0.015);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.85);

        bellOsc.connect(bellFilter);
        bellFilter.connect(bellGain);
        bellGain.connect(this.ctx!.destination);

        bellOsc.start(noteStart);
        bellOsc.stop(noteStart + 0.9);
      });

      // ─────────────────────────────────────────────────────────────
      // 4. POSITIVE CONFIRMATION CYBER PING (Dual High Resonance)
      // ─────────────────────────────────────────────────────────────
      const pingOsc1 = this.ctx.createOscillator();
      const pingOsc2 = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();

      const pingStart = now + 0.32;

      pingOsc1.type = 'sine';
      pingOsc1.frequency.setValueAtTime(2637.02, pingStart); // E7
      pingOsc2.type = 'sine';
      pingOsc2.frequency.setValueAtTime(3135.96, pingStart); // G7

      pingGain.gain.setValueAtTime(0.001, pingStart);
      pingGain.gain.linearRampToValueAtTime(0.09, pingStart + 0.015);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, pingStart + 0.55);

      pingOsc1.connect(pingGain);
      pingOsc2.connect(pingGain);
      pingGain.connect(this.ctx.destination);

      pingOsc1.start(pingStart);
      pingOsc2.start(pingStart);
      pingOsc1.stop(pingStart + 0.6);
      pingOsc2.stop(pingStart + 0.6);
    } catch {
      // Audio fallback
    }
  }
}

export const portalSound = new HolographicPortalSoundEngine();

export function playPortalLoginSound() {
  portalSound.playLoginSound();
}
