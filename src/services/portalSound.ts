/**
 * RYVANTA '26 Dolby Atmos 3D Spatial Cinema Sound Synthesizer
 * Generates an authentic Dolby Atmos-style 3D spatial surround cinematic sound:
 * - 360° Dynamic Stereo Panning Swirl (Left -> Center -> Right -> Spatial Field)
 * - Infrasonic Subwoofer Cinematic Horizon Bass Drop (24Hz – 85Hz)
 * - Dolby Signature Crystal Acoustic Bloom (9-harmonic spatial arpeggio)
 * - Wide Cinema Auditorium Reverb & Acoustic Tail
 */
class DolbyAtmosSpatialSoundEngine {
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
   * Plays the Dolby Atmos 3D Spatial Cinematic Login Sequence
   */
  public playLoginSound() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // ─────────────────────────────────────────────────────────────
      // 1. INFRASONIC CINEMA SUBWOOFER DROP ("THE DOLBY HORIZON RUMBLE")
      // ─────────────────────────────────────────────────────────────
      // Fundamental sub-sine
      const subOsc1 = this.ctx.createOscillator();
      const subGain1 = this.ctx.createGain();
      subOsc1.type = 'sine';
      subOsc1.frequency.setValueAtTime(85, now);
      subOsc1.frequency.exponentialRampToValueAtTime(24, now + 0.6);

      subGain1.gain.setValueAtTime(0.01, now);
      subGain1.gain.linearRampToValueAtTime(0.38, now + 0.1);
      subGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      subOsc1.connect(subGain1);
      subGain1.connect(this.ctx.destination);
      subOsc1.start(now);
      subOsc1.stop(now + 1.0);

      // Low harmonic growl (warmth)
      const subOsc2 = this.ctx.createOscillator();
      const subGain2 = this.ctx.createGain();
      const subFilter = this.ctx.createBiquadFilter();

      subOsc2.type = 'triangle';
      subOsc2.frequency.setValueAtTime(60, now);
      subOsc2.frequency.exponentialRampToValueAtTime(32, now + 0.55);

      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(140, now);

      subGain2.gain.setValueAtTime(0.01, now);
      subGain2.gain.linearRampToValueAtTime(0.22, now + 0.12);
      subGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      subOsc2.connect(subFilter);
      subFilter.connect(subGain2);
      subGain2.connect(this.ctx.destination);
      subOsc2.start(now);
      subOsc2.stop(now + 0.75);

      // ─────────────────────────────────────────────────────────────
      // 2. 3D SPATIAL SWIRL (DYNAMIC STEREO PANNING FROM LEFT TO RIGHT)
      // ─────────────────────────────────────────────────────────────
      const createPanner = (startPan: number, endPan: number, dur: number) => {
        if (this.ctx!.createStereoPanner) {
          const panner = this.ctx!.createStereoPanner();
          panner.pan.setValueAtTime(startPan, now);
          panner.pan.linearRampToValueAtTime(endPan, now + dur);
          return panner;
        }
        return null;
      };

      // Spatial Swirling Whoosh
      const bufferSize = this.ctx.sampleRate * 0.7;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }

      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(6800, now + 0.45);
      noiseFilter.Q.setValueAtTime(3.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      const swirlPanner = createPanner(-0.9, 0.9, 0.55);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);

      if (swirlPanner) {
        noiseGain.connect(swirlPanner);
        swirlPanner.connect(this.ctx.destination);
      } else {
        noiseGain.connect(this.ctx.destination);
      }

      noiseSrc.start(now);
      noiseSrc.stop(now + 0.65);

      // ─────────────────────────────────────────────────────────────
      // 3. DOLBY ACOUSTIC PURITY CRYSTAL HARMONICS (SPATIAL 3D CHORD BLOOM)
      // ─────────────────────────────────────────────────────────────
      const dolbyChords = [
        { freq: 440.00, pan: -0.75, delay: 0.08 },  // A4 (Left)
        { freq: 554.37, pan: -0.45, delay: 0.13 },  // C#5 (Mid-Left)
        { freq: 659.25, pan: -0.15, delay: 0.18 },  // E5 (Center-Left)
        { freq: 830.61, pan: 0.15, delay: 0.23 },   // G#5 (Center-Right)
        { freq: 1108.73, pan: 0.45, delay: 0.28 },  // C#6 (Mid-Right)
        { freq: 1318.51, pan: 0.75, delay: 0.33 },  // E6 (Far Right)
        { freq: 1661.22, pan: 0.0, delay: 0.38 },   // G#6 (Center Surround Peak)
        { freq: 2217.46, pan: 0.0, delay: 0.43 }    // C#7 (Top Spatial Sparkle)
      ];

      dolbyChords.forEach(({ freq, pan, delay }) => {
        const chordOsc = this.ctx!.createOscillator();
        const chordGain = this.ctx!.createGain();
        const chordFilter = this.ctx!.createBiquadFilter();

        const startTime = now + delay;

        chordOsc.type = 'sine';
        chordOsc.frequency.setValueAtTime(freq, startTime);

        chordFilter.type = 'bandpass';
        chordFilter.frequency.setValueAtTime(freq * 1.02, startTime);
        chordFilter.Q.setValueAtTime(4.0, startTime);

        chordGain.gain.setValueAtTime(0.001, startTime);
        chordGain.gain.linearRampToValueAtTime(0.12, startTime + 0.025);
        chordGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.1);

        chordOsc.connect(chordFilter);
        chordFilter.connect(chordGain);

        if (this.ctx!.createStereoPanner) {
          const notePanner = this.ctx!.createStereoPanner();
          notePanner.pan.setValueAtTime(pan, startTime);
          chordGain.connect(notePanner);
          notePanner.connect(this.ctx!.destination);
        } else {
          chordGain.connect(this.ctx!.destination);
        }

        chordOsc.start(startTime);
        chordOsc.stop(startTime + 1.2);
      });

      // ─────────────────────────────────────────────────────────────
      // 4. SPATIAL CINEMA REVERB REFLECTION ECHO TAIL
      // ─────────────────────────────────────────────────────────────
      if (this.ctx.createDelay) {
        const delayNode = this.ctx.createDelay();
        const feedback = this.ctx.createGain();
        const delayFilter = this.ctx.createBiquadFilter();

        delayNode.delayTime.setValueAtTime(0.14, now); // 140ms spatial delay
        feedback.gain.setValueAtTime(0.35, now);
        delayFilter.type = 'lowpass';
        delayFilter.frequency.setValueAtTime(2800, now);

        feedback.connect(delayFilter);
        delayFilter.connect(delayNode);
        delayNode.connect(feedback);
        delayNode.connect(this.ctx.destination);
      }
    } catch {
      // Audio fallback
    }
  }
}

export const portalSound = new DolbyAtmosSpatialSoundEngine();

export function playPortalLoginSound() {
  portalSound.playLoginSound();
}
