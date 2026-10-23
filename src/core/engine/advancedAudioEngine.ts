// ==============================================================================
// Advanced Audio Engine: Tone.js & Acoustic Biofeedback Synthesizer
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: 432 Hz Solfeggio Tuning, Singing Bowls, Zero Bandwidth Assets
// ==============================================================================

import { ActivePhase } from '../types/clinical.types';

export type SoundpackType = 'ZEN' | 'CLINICAL' | 'MUTED';

export class AdvancedAudioEngine {
  private soundpack: SoundpackType = 'ZEN';
  private volume: number = 0.7; // 0.0 a 1.0
  private audioCtx: AudioContext | null = null;
  private toneInitialized: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction
  }

  public getSoundpack(): SoundpackType {
    return this.soundpack;
  }

  public setSoundpack(pack: SoundpackType): void {
    this.soundpack = pack;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0.0, Math.min(vol, 1.0));
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Generador de síntesis directa con armónicos y envolvente ADSR
   */
  public playToneDirect(
    frequencies: number[],
    type: OscillatorType = 'sine',
    durationMs: number = 500,
    gainMultiplier: number = 1.0
  ): void {
    if (this.soundpack === 'MUTED') return;

    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * gainMultiplier, now);
      masterGain.connect(ctx.destination);

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        // Envolvente de campana o cuenco: ataque rápido + decaimiento exponencial suave
        const peakGain = 0.15 / (idx + 1); // Disminución de amplitud en sobretonos armónicos
        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.04);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + durationMs / 1000);
      });
    } catch {
      // Ignorar bloqueos de autoplay de audio
    }
  }

  /**
   * Campana de Cuenco Tibetano Zen (432 Hz Healing Harmony)
   * Diseñado para generar relajación parasimpática y descenso de suelo pélvico
   */
  public playTibetanSingingBowl(baseFreq: number = 216): void {
    // 216 Hz fundamental + armónico de 432 Hz + sobretono de 648 Hz
    this.playToneDirect([baseFreq, baseFreq * 2, baseFreq * 3], 'sine', 1600, 0.85);
  }

  /**
   * Acorde Ascendente de Tensión Muscular Guiada
   */
  public playContractionChime(): void {
    if (this.soundpack === 'ZEN') {
      // Arpegio de cuenco C4 -> G4 -> C5
      this.playToneDirect([261.63, 392.0, 523.25], 'sine', 700, 0.7);
    } else if (this.soundpack === 'CLINICAL') {
      this.playToneDirect([523.25], 'sine', 350, 0.6);
    }
  }

  /**
   * Campana Resonante de Relajación y Alivio
   */
  public playRelaxationBell(): void {
    if (this.soundpack === 'ZEN') {
      this.playTibetanSingingBowl(216); // 432 Hz armónico
    } else if (this.soundpack === 'CLINICAL') {
      this.playToneDirect([329.63, 261.63], 'sine', 500, 0.6);
    }
  }

  /**
   * Resonancia Profunda para Kegel Inverso (Down-Training)
   */
  public playReverseKegelDrone(): void {
    if (this.soundpack === 'ZEN') {
      // Tono profundo de enraizamiento pélvico (174 Hz Solfeggio)
      this.playToneDirect([174.0, 348.0], 'sine', 2000, 0.9);
    } else if (this.soundpack === 'CLINICAL') {
      this.playToneDirect([220.0], 'sine', 800, 0.6);
    }
  }

  /**
   * Alerta no estridente para Pausa en Pareja (Nivel 7-8/10) o Squeeze
   */
  public playPartnerAlert(): void {
    if (this.soundpack === 'ZEN') {
      this.playToneDirect([587.33, 880.0], 'triangle', 450, 0.8);
    } else if (this.soundpack === 'CLINICAL') {
      this.playToneDirect([698.46], 'triangle', 250, 0.7);
    }
  }

  /**
   * Fanfarria Acústica de Logro o Sesión Completada
   */
  public playCompletionFanfare(): void {
    if (this.soundpack === 'MUTED') return;

    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    // Arpegio armónico de recompensa dopaminérgica: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playToneDirect([freq, freq * 1.5], 'sine', 800, 0.8);
      }, index * 140);
    });
  }

  /**
   * Reproducir sonido correspondiente a la fase activa
   */
  public playPhaseSound(phase: ActivePhase): void {
    if (this.soundpack === 'MUTED') return;

    switch (phase) {
      case 'CONTRACTION':
        this.playContractionChime();
        break;
      case 'RELAXATION':
        this.playRelaxationBell();
        break;
      case 'REVERSE_KEGEL':
        this.playReverseKegelDrone();
        break;
      case 'PAUSE_STOP_START':
      case 'APPLY_SQUEEZE':
        this.playPartnerAlert();
        break;
      case 'COMPLETED':
        this.playCompletionFanfare();
        break;
      default:
        break;
    }
  }
}

export const advancedAudio = new AdvancedAudioEngine();
