// ==============================================================================
// Deterministic Timer State Machine: Clinical Neuromuscular & Partner Engine
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: 60 FPS Determinism, Zero Audio Drift, Strict Clinical Invariants
// ==============================================================================

import { ActivePhase, ExerciseMode } from '../types/clinical.types';

export interface TimerStateMachineConfig {
  mode: ExerciseMode;
  targetSets: number;
  repsPerSet: number;
  contractionDurationSec: number;
  relaxationDurationSec: number;
  reverseKegelCyclesEndSet?: number;
  reverseKegelDurationSec?: number;
  partnerPauseDurationSec?: number;
  setRestDurationSec?: number;
  preparationDurationSec?: number;
}

export interface TimerStateMachineSnapshot {
  mode: ExerciseMode;
  phase: ActivePhase;
  currentSet: number;
  targetSets: number;
  currentRep: number;
  targetReps: number;
  timeRemainingSec: number;
  phaseDurationSec: number;
  normalizedProgress: number;
  contractionFactor: number;
  arousalLevel: number;
  isPaused: boolean;
  isCompleted: boolean;
  totalElapsedSec: number;
  zeroParasiticCompensation: boolean;
}

type StateChangeListener = (snapshot: TimerStateMachineSnapshot) => void;
type PhaseChangeListener = (newPhase: ActivePhase, oldPhase: ActivePhase) => void;

export class TimerStateMachine {
  private config: Required<TimerStateMachineConfig>;
  private phase: ActivePhase;
  private currentSet: number = 1;
  private currentRep: number = 1;
  private timeRemainingMs: number = 0;
  private phaseDurationMs: number = 0;
  private arousalLevel: number = 1;
  private isPaused: boolean = true;
  private isCompleted: boolean = false;
  private totalElapsedMs: number = 0;
  private zeroParasiticCompensation: boolean = true;
  private reverseKegelCyclesDoneInSet: number = 0;

  private stateListeners: Set<StateChangeListener> = new Set();
  private phaseListeners: Set<PhaseChangeListener> = new Set();

  constructor(config: TimerStateMachineConfig) {
    this.config = {
      mode: config.mode,
      targetSets: Math.max(config.targetSets, 1),
      repsPerSet: Math.max(config.repsPerSet, 1),
      contractionDurationSec: config.contractionDurationSec,
      relaxationDurationSec: config.relaxationDurationSec,
      reverseKegelCyclesEndSet: config.reverseKegelCyclesEndSet ?? 0,
      reverseKegelDurationSec: config.reverseKegelDurationSec ?? 5,
      partnerPauseDurationSec:
        config.partnerPauseDurationSec ??
        (config.mode === 'PARTNER_SQUEEZE' ? 12 : 35),
      setRestDurationSec: config.setRestDurationSec ?? 15,
      preparationDurationSec: config.preparationDurationSec ?? 3
    };

    // Inicializar primera fase según modo
    if (this.config.preparationDurationSec > 0) {
      this.phase = 'PREPARATION';
      this.phaseDurationMs = this.config.preparationDurationSec * 1000;
      this.timeRemainingMs = this.phaseDurationMs;
    } else {
      this.phase = this.getInitialActivePhase();
      this.phaseDurationMs = this.getDurationForPhase(this.phase);
      this.timeRemainingMs = this.phaseDurationMs;
    }
  }

  private getInitialActivePhase(): ActivePhase {
    switch (this.config.mode) {
      case 'DOWN_TRAINING':
        return 'REVERSE_KEGEL';
      case 'SOLO_STOP_START':
      case 'PARTNER_STOP_START':
      case 'PARTNER_SQUEEZE':
      case 'SENSATE_FOCUS_I':
      case 'SENSATE_FOCUS_II':
        return 'STIMULATION_ACTIVE';
      default:
        return 'CONTRACTION';
    }
  }

  private getDurationForPhase(phase: ActivePhase): number {
    switch (phase) {
      case 'PREPARATION':
        return this.config.preparationDurationSec * 1000;
      case 'CONTRACTION':
        return this.config.contractionDurationSec * 1000;
      case 'RELAXATION':
        return this.config.relaxationDurationSec * 1000;
      case 'REVERSE_KEGEL':
        return this.config.reverseKegelDurationSec * 1000;
      case 'PAUSE_STOP_START':
      case 'APPLY_SQUEEZE':
        return this.config.partnerPauseDurationSec * 1000;
      case 'SET_REST':
        return this.config.setRestDurationSec * 1000;
      case 'STIMULATION_ACTIVE':
        // Estimulación en pareja/solo corre continuamente hasta que se active pausa
        return 60000; // 60s base
      case 'COMPLETED':
        return 0;
      default:
        return 1000;
    }
  }

  public start(): void {
    if (this.isCompleted) return;
    this.isPaused = false;
    this.notifyState();
  }

  public pause(): void {
    this.isPaused = true;
    this.notifyState();
  }

  public resume(): void {
    if (this.isCompleted) return;
    this.isPaused = false;
    this.notifyState();
  }

  public setArousalLevel(level: number): void {
    this.arousalLevel = Math.min(Math.max(level, 1), 10);
    this.notifyState();
  }

  public setZeroParasiticCompensation(val: boolean): void {
    this.zeroParasiticCompensation = val;
    this.notifyState();
  }

  public triggerStopStartPause(): void {
    if (
      this.phase === 'STIMULATION_ACTIVE' &&
      (this.config.mode === 'SOLO_STOP_START' || this.config.mode === 'PARTNER_STOP_START')
    ) {
      this.transitionToPhase('PAUSE_STOP_START');
    }
  }

  public triggerSqueeze(): void {
    if (
      this.phase === 'STIMULATION_ACTIVE' &&
      this.config.mode === 'PARTNER_SQUEEZE'
    ) {
      this.transitionToPhase('APPLY_SQUEEZE');
    }
  }

  public tick(deltaMs: number): void {
    if (this.isPaused || this.isCompleted) return;

    this.totalElapsedMs += deltaMs;
    this.timeRemainingMs -= deltaMs;

    if (this.timeRemainingMs <= 0) {
      this.handlePhaseCompletion();
    } else {
      this.notifyState();
    }
  }

  private handlePhaseCompletion(): void {
    switch (this.phase) {
      case 'PREPARATION':
        this.transitionToPhase(this.getInitialActivePhase());
        break;

      case 'CONTRACTION':
        this.transitionToPhase('RELAXATION');
        break;

      case 'RELAXATION':
        if (this.config.mode === 'DOWN_TRAINING') {
          // Ciclo de down-training: Avanza repetición
          if (this.currentRep < this.config.repsPerSet) {
            this.currentRep++;
            this.transitionToPhase('REVERSE_KEGEL');
          } else {
            this.completeOrNextSet();
          }
        } else {
          // Modo Tónico / Fásico estándar
          if (this.currentRep < this.config.repsPerSet) {
            this.currentRep++;
            this.transitionToPhase('CONTRACTION');
          } else {
            // Repeticiones del set completadas: Ejecutar Kegel Inverso al final del set si configurado
            if (
              this.config.reverseKegelCyclesEndSet > 0 &&
              this.reverseKegelCyclesDoneInSet < this.config.reverseKegelCyclesEndSet
            ) {
              this.reverseKegelCyclesDoneInSet++;
              this.transitionToPhase('REVERSE_KEGEL');
            } else {
              this.completeOrNextSet();
            }
          }
        }
        break;

      case 'REVERSE_KEGEL':
        if (this.config.mode === 'DOWN_TRAINING') {
          this.transitionToPhase('RELAXATION');
        } else {
          // Si faltan ciclos de reverse kegel al final del set
          if (this.reverseKegelCyclesDoneInSet < this.config.reverseKegelCyclesEndSet) {
            this.reverseKegelCyclesDoneInSet++;
            this.transitionToPhase('REVERSE_KEGEL');
          } else {
            this.completeOrNextSet();
          }
        }
        break;

      case 'PAUSE_STOP_START':
      case 'APPLY_SQUEEZE':
        if (this.currentRep < this.config.repsPerSet) {
          this.currentRep++;
          this.arousalLevel = Math.max(this.arousalLevel - 4, 3);
          this.transitionToPhase('STIMULATION_ACTIVE');
        } else {
          this.completeOrNextSet();
        }
        break;

      case 'SET_REST':
        this.currentSet++;
        this.currentRep = 1;
        this.reverseKegelCyclesDoneInSet = 0;
        this.transitionToPhase(this.getInitialActivePhase());
        break;

      default:
        this.completeSession();
        break;
    }
  }

  private completeOrNextSet(): void {
    if (this.currentSet < this.config.targetSets) {
      this.transitionToPhase('SET_REST');
    } else {
      this.completeSession();
    }
  }

  private completeSession(): void {
    this.isCompleted = true;
    this.isPaused = true;
    this.transitionToPhase('COMPLETED');
  }

  private transitionToPhase(newPhase: ActivePhase): void {
    const oldPhase = this.phase;
    this.phase = newPhase;
    this.phaseDurationMs = this.getDurationForPhase(newPhase);
    this.timeRemainingMs = this.phaseDurationMs;

    this.phaseListeners.forEach((listener) => listener(newPhase, oldPhase));
    this.notifyState();
  }

  public getSnapshot(): TimerStateMachineSnapshot {
    const elapsedInPhase = Math.max(this.phaseDurationMs - this.timeRemainingMs, 0);
    const normalizedProgress =
      this.phaseDurationMs > 0 ? Math.min(elapsedInPhase / this.phaseDurationMs, 1.0) : 0;

    let contractionFactor = 0;
    if (this.phase === 'CONTRACTION') {
      contractionFactor = Math.max(normalizedProgress, 0.05); // 0.05 -> +1.0
    } else if (this.phase === 'REVERSE_KEGEL' || this.phase === 'PAUSE_STOP_START') {
      contractionFactor = Math.min(-1.0 * (normalizedProgress || 0.05), -0.05); // -0.05 -> -1.0
    } else if (this.phase === 'APPLY_SQUEEZE') {
      contractionFactor = -0.5;
    }

    return {
      mode: this.config.mode,
      phase: this.phase,
      currentSet: this.currentSet,
      targetSets: this.config.targetSets,
      currentRep: this.currentRep,
      targetReps: this.config.repsPerSet,
      timeRemainingSec: Math.max(Math.ceil(this.timeRemainingMs / 1000), 0),
      phaseDurationSec: Math.ceil(this.phaseDurationMs / 1000),
      normalizedProgress,
      contractionFactor,
      arousalLevel: this.arousalLevel,
      isPaused: this.isPaused,
      isCompleted: this.isCompleted,
      totalElapsedSec: Math.floor(this.totalElapsedMs / 1000),
      zeroParasiticCompensation: this.zeroParasiticCompensation
    };
  }

  public onStateChange(listener: StateChangeListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  public onPhaseChange(listener: PhaseChangeListener): () => void {
    this.phaseListeners.add(listener);
    return () => this.phaseListeners.delete(listener);
  }

  private notifyState(): void {
    const snapshot = this.getSnapshot();
    this.stateListeners.forEach((listener) => listener(snapshot));
  }
}
