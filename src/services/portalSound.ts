/**
 * RYVANTA '26 Portal Login & Entrance Sound Synthesizer
 * Plays distinct sci-fi login audio ONLY when logging into or entering the website.
 */
class PortalLoginSoundEngine {
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
   * Plays a distinct, rich futuristic portal login sound effect
   */
  public playLoginSound() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Deep Sub-Bass Warp Swell (Frequency sweep)
      const swellOsc = this.ctx.createOscillator();
      const swellGain = this.ctx.createGain();
      swellOsc.type = 'sine';
      swellOsc.frequency.setValueAtTime(55, now);
      swellOsc.frequency.exponentialRampToValueAtTime(240, now + 0.35);

      swellGain.gain.setValueAtTime(0.01, now);
      swellGain.gain.linearRampToValueAtTime(0.24, now + 0.22);
      swellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      swellOsc.connect(swellGain);
      swellGain.connect(this.ctx.destination);
      swellOsc.start(now);
      swellOsc.stop(now + 0.75);

      // 2. High Cyber Portal Chimes (C Major 9 ascending harmonics: 523Hz, 659Hz, 783Hz, 987Hz, 1174Hz, 1318Hz)
      const chordFreqs = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51];
      chordFreqs.forEach((freq, idx) => {
        const chordOsc = this.ctx!.createOscillator();
        const chordGain = this.ctx!.createGain();
        const chordFilter = this.ctx!.createBiquadFilter();

        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(freq, now + idx * 0.04);

        chordFilter.type = 'bandpass';
        chordFilter.frequency.setValueAtTime(freq * 1.15, now);

        chordGain.gain.setValueAtTime(0.001, now + idx * 0.04);
        chordGain.gain.linearRampToValueAtTime(0.12, now + 0.12 + idx * 0.04);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

        chordOsc.connect(chordFilter);
        chordFilter.connect(chordGain);
        chordGain.connect(this.ctx!.destination);

        chordOsc.start(now + idx * 0.04);
        chordOsc.stop(now + 1.0);
      });

      // 3. Cyber Shimmer Pulse
      const shimOsc = this.ctx.createOscillator();
      const shimGain = this.ctx.createGain();
      shimOsc.type = 'triangle';
      shimOsc.frequency.setValueAtTime(880, now + 0.15);
      shimOsc.frequency.exponentialRampToValueAtTime(1760, now + 0.45);
      shimGain.gain.setValueAtTime(0.001, now + 0.15);
      shimGain.gain.linearRampToValueAtTime(0.08, now + 0.25);
      shimGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      shimOsc.connect(shimGain);
      shimGain.connect(this.ctx.destination);
      shimOsc.start(now + 0.15);
      shimOsc.stop(now + 0.65);
    } catch {
      // Audio fallback
    }
  }
}

export const portalSound = new PortalLoginSoundEngine();
export function playPortalLoginSound() {
  portalSound.playLoginSound();
}
