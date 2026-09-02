/**
 * RYVANTA '26 Technical Cybernetic Login Sound Synthesizer
 * Synthesizes multi-layered technical audio (biometric digital handshake,
 * quantum server core boot, high-voltage laser grid lock & access granted chime)
 * exclusively when logging into the portal.
 */
class TechnicalPortalSoundEngine {
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
   * Plays a high-tech, multi-layered cybernetic login sequence
   */
  public playLoginSound() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // ─────────────────────────────────────────────────────────────
      // LAYER 1: Rapid Biometric Digital Data Stream (Micro-pulses)
      // ─────────────────────────────────────────────────────────────
      const pulseFreqs = [1850, 2200, 2750, 3300, 2400, 3600, 4200];
      pulseFreqs.forEach((freq, idx) => {
        const pulseOsc = this.ctx!.createOscillator();
        const pulseGain = this.ctx!.createGain();
        const pulseFilter = this.ctx!.createBiquadFilter();

        const startTime = now + idx * 0.035;

        pulseOsc.type = idx % 2 === 0 ? 'square' : 'triangle';
        pulseOsc.frequency.setValueAtTime(freq, startTime);
        pulseOsc.frequency.exponentialRampToValueAtTime(freq * 1.3, startTime + 0.03);

        pulseFilter.type = 'bandpass';
        pulseFilter.frequency.setValueAtTime(freq, startTime);
        pulseFilter.Q.setValueAtTime(4.0, startTime);

        pulseGain.gain.setValueAtTime(0.001, startTime);
        pulseGain.gain.linearRampToValueAtTime(0.06, startTime + 0.008);
        pulseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.035);

        pulseOsc.connect(pulseFilter);
        pulseFilter.connect(pulseGain);
        pulseGain.connect(this.ctx!.destination);

        pulseOsc.start(startTime);
        pulseOsc.stop(startTime + 0.04);
      });

      // ─────────────────────────────────────────────────────────────
      // LAYER 2: Quantum Server Sub-Bass Core Boot (Power Surge)
      // ─────────────────────────────────────────────────────────────
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      const subFilter = this.ctx.createBiquadFilter();

      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(45, now + 0.1);
      subOsc.frequency.exponentialRampToValueAtTime(190, now + 0.55);

      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(180, now + 0.1);
      subFilter.frequency.exponentialRampToValueAtTime(800, now + 0.5);

      subGain.gain.setValueAtTime(0.001, now + 0.1);
      subGain.gain.linearRampToValueAtTime(0.25, now + 0.3);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now + 0.1);
      subOsc.stop(now + 0.9);

      // ─────────────────────────────────────────────────────────────
      // LAYER 3: High-Voltage Grid Lock Laser Shimmer (FM modulation)
      // ─────────────────────────────────────────────────────────────
      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const carrierGain = this.ctx.createGain();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(750, now + 0.25);
      carrier.frequency.exponentialRampToValueAtTime(1600, now + 0.6);

      modulator.type = 'sawtooth';
      modulator.frequency.setValueAtTime(80, now + 0.25);
      modulator.frequency.linearRampToValueAtTime(30, now + 0.6);

      modGain.gain.setValueAtTime(400, now + 0.25);
      modGain.gain.exponentialRampToValueAtTime(10, now + 0.6);

      carrierGain.gain.setValueAtTime(0.001, now + 0.25);
      carrierGain.gain.linearRampToValueAtTime(0.08, now + 0.35);
      carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(carrierGain);
      carrierGain.connect(this.ctx.destination);

      modulator.start(now + 0.25);
      carrier.start(now + 0.25);
      modulator.stop(now + 0.8);
      carrier.stop(now + 0.8);

      // ─────────────────────────────────────────────────────────────
      // LAYER 4: Access Granted Technical Confirmation Chimes
      // ─────────────────────────────────────────────────────────────
      const chimeTones = [880, 1174.66, 1760, 2093];
      chimeTones.forEach((freq, idx) => {
        const chimeOsc = this.ctx!.createOscillator();
        const chimeGain = this.ctx!.createGain();

        const chimeStart = now + 0.45 + idx * 0.055;

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, chimeStart);

        chimeGain.gain.setValueAtTime(0.001, chimeStart);
        chimeGain.gain.linearRampToValueAtTime(0.12, chimeStart + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeStart + 0.8);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx!.destination);

        chimeOsc.start(chimeStart);
        chimeOsc.stop(chimeStart + 0.85);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const portalSound = new TechnicalPortalSoundEngine();

export function playPortalLoginSound() {
  portalSound.playLoginSound();
}
