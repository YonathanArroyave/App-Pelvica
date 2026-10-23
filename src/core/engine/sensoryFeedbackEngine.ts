// ==============================================================================
// Sensory Feedback Engine: Web Audio API, Haptics & Screen Wake Lock
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: 60 FPS determinism, zero battery drain, silent safety
// ==============================================================================

import { ActivePhase, ExerciseMode } from '../types/clinical.types';

export interface TimerEngineConfig {
  mode: ExerciseMode;
  targetSets: number;
  targetRepsPerSet: number;
  contractionDurationSec: number;
  relaxationDurationSec: number;
  partnerPauseDurationSec: number; // 30-45s en Stop-Start, 10-15s en Squeeze
}

export interface CurrentTimerState {
  currentSet: number;
  currentRep: number;
  phase: ActivePhase;
  timeRemainingMs: number;
  normalizedProgress: number; // 0.0 a 1.0 para interpolar el Shader 3D y el Anillo SVG
  arousalLevel: number;       // Escala 1 - 10 controlada desde la Thumb-Zone
  isPaused: boolean;
  screenWakeLockActive: boolean;
}

export class SensoryFeedbackEngine {
  private audioCtx: AudioContext | null = null;
  private wakeLockSentinel: WakeLockSentinel | null = null;

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

  public triggerHaptic(phase: ActivePhase): void {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

    switch (phase) {
      case 'CONTRACTION':
        // Pulso suave de tensión guiada (50ms)
        navigator.vibrate([50]);
        break;
      case 'RELAXATION':
      case 'REVERSE_KEGEL':
        // Pulso doble largo de liberación muscular ([200ms, 100ms, 200ms])
        navigator.vibrate([200, 100, 200]);
        break;
      case 'PAUSE_STOP_START':
      case 'APPLY_SQUEEZE':
        // Alerta continua/doble firme para que la pareja detenga estimulación o aplique Squeeze
        navigator.vibrate([300, 100, 300]);
        break;
      default:
        break;
    }
  }

  public playTone(frequencyHz: number, type: OscillatorType = 'sine', durationMs: number = 300): void {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(frequencyHz, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durationMs / 1000);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public triggerSensoryCues(phase: ActivePhase): void {
    this.triggerHaptic(phase);
    this.playPhaseSound(phase);
  }

  public playPhaseSound(phase: ActivePhase): void {
    switch (phase) {
      case 'CONTRACTION':
        this.playTone(523.25, 'sine', 350); // C5 (Tensión ascendente)
        break;
      case 'RELAXATION':
        this.playTone(329.63, 'sine', 400); // E4 (Relajación descendente)
        break;
      case 'REVERSE_KEGEL':
        this.playTone(261.63, 'sine', 500); // C4 (Tono grave de elongación diafragmática)
        break;
      case 'PAUSE_STOP_START':
      case 'APPLY_SQUEEZE':
        this.playTone(698.46, 'triangle', 250); // F5 (Alerta firme)
        break;
      case 'COMPLETED':
        this.playTone(587.33, 'sine', 400);
        setTimeout(() => this.playTone(880, 'sine', 600), 200);
        break;
      default:
        break;
    }
  }

  public async requestWakeLock(): Promise<boolean> {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) return false;
    try {
      this.wakeLockSentinel = await navigator.wakeLock.request('screen');
      return true;
    } catch {
      return false;
    }
  }

  public async releaseWakeLock(): Promise<void> {
    if (this.wakeLockSentinel) {
      try {
        await this.wakeLockSentinel.release();
      } catch {
        // ignore
      }
      this.wakeLockSentinel = null;
    }
  }
}

export const sensoryEngine = new SensoryFeedbackEngine();
