// ==============================================================================
// TDD Test Suite: Timer State Machine & Deterministic Clinical Engine
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: 60 FPS Determinism, Partner Mode Protocol, Medical Invariants
// ==============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TimerStateMachine,
  TimerStateMachineConfig
} from '../timerStateMachine';

describe('TimerStateMachine (Modo Individual Tónico / Fásico)', () => {
  let config: TimerStateMachineConfig;

  beforeEach(() => {
    config = {
      mode: 'INDIVIDUAL_TONIC',
      targetSets: 2,
      repsPerSet: 2,
      contractionDurationSec: 3,
      relaxationDurationSec: 6,
      reverseKegelCyclesEndSet: 1,
      reverseKegelDurationSec: 5,
      setRestDurationSec: 10,
      preparationDurationSec: 3
    };
  });

  it('debe iniciar en fase PREPARATION con progreso en 0 y contracción en reposo', () => {
    const sm = new TimerStateMachine(config);
    const snap = sm.getSnapshot();

    expect(snap.phase).toBe('PREPARATION');
    expect(snap.currentSet).toBe(1);
    expect(snap.currentRep).toBe(1);
    expect(snap.timeRemainingSec).toBe(3);
    expect(snap.contractionFactor).toBe(0);
    expect(snap.isCompleted).toBe(false);
  });

  it('debe transicionar de PREPARATION a CONTRACTION al consumir el tiempo de preparación', () => {
    const sm = new TimerStateMachine(config);
    sm.start();

    // Consumir 3 segundos de PREPARATION
    sm.tick(3000);

    const snap = sm.getSnapshot();
    expect(snap.phase).toBe('CONTRACTION');
    expect(snap.currentSet).toBe(1);
    expect(snap.currentRep).toBe(1);
    expect(snap.timeRemainingSec).toBe(3);
    expect(snap.contractionFactor).toBeGreaterThan(0);
  });

  it('debe calcular contractionFactor = 1.0 al alcanzar la contracción máxima', () => {
    const sm = new TimerStateMachine(config);
    sm.start();
    sm.tick(3000); // Entra en CONTRACTION (3s)

    sm.tick(1500); // Mitad de contracción
    expect(sm.getSnapshot().contractionFactor).toBeCloseTo(0.5, 1);

    sm.tick(1500); // Fin de contracción -> pasa a RELAXATION
    expect(sm.getSnapshot().phase).toBe('RELAXATION');
    expect(sm.getSnapshot().contractionFactor).toBe(0);
  });

  it('debe avanzar a la siguiente repetición tras completar RELAXATION', () => {
    const sm = new TimerStateMachine(config);
    sm.start();
    sm.tick(3000); // Fin de PREPARATION (3s)
    sm.tick(3000); // Fin de CONTRACTION rep 1 (3s)
    sm.tick(6000); // Fin de RELAXATION rep 1 (6s)

    const snap = sm.getSnapshot();
    expect(snap.phase).toBe('CONTRACTION');
    expect(snap.currentRep).toBe(2);
    expect(snap.currentSet).toBe(1);
  });

  it('debe ejecutar REVERSE_KEGEL (-1.0) al finalizar todas las repeticiones del set', () => {
    const sm = new TimerStateMachine(config);
    sm.start();
    sm.tick(3000); // PREPARATION
    sm.tick(3000); // CONTRACTION rep 1
    sm.tick(6000); // RELAXATION rep 1
    sm.tick(3000); // CONTRACTION rep 2
    sm.tick(6000); // RELAXATION rep 2 -> Fin de repeticiones del set 1

    const snap = sm.getSnapshot();
    expect(snap.phase).toBe('REVERSE_KEGEL');
    expect(snap.contractionFactor).toBeLessThan(0); // Vector descendente negativo
  });

  it('debe pausar y reanudar el cronómetro sin alterar el progreso acumulado', () => {
    const sm = new TimerStateMachine(config);
    sm.start();
    sm.tick(3000); // Entra a CONTRACTION
    sm.tick(1000); // 1s transcurrido en CONTRACTION

    sm.pause();
    expect(sm.getSnapshot().isPaused).toBe(true);
    const timePaused = sm.getSnapshot().timeRemainingSec;

    // Ticks en pausa no deben alterar el tiempo restante
    sm.tick(5000);
    expect(sm.getSnapshot().timeRemainingSec).toBe(timePaused);

    sm.resume();
    expect(sm.getSnapshot().isPaused).toBe(false);
    sm.tick(1000);
    expect(sm.getSnapshot().timeRemainingSec).toBeCloseTo(timePaused - 1, 1);
  });
});

describe('TimerStateMachine (Modo Down-Training por Hipertonía)', () => {
  it('en modo DOWN_TRAINING solo ejecuta REVERSE_KEGEL y relajación diafragmática (cero contracción)', () => {
    const sm = new TimerStateMachine({
      mode: 'DOWN_TRAINING',
      targetSets: 1,
      repsPerSet: 3,
      contractionDurationSec: 0,
      relaxationDurationSec: 5,
      reverseKegelCyclesEndSet: 0,
      reverseKegelDurationSec: 10,
      preparationDurationSec: 0
    });

    sm.start();
    expect(sm.getSnapshot().phase).toBe('REVERSE_KEGEL');
    expect(sm.getSnapshot().contractionFactor).toBeLessThanOrEqual(0);

    sm.tick(10000); // Fin de ciclo de elongación
    expect(sm.getSnapshot().phase).toBe('RELAXATION');

    sm.tick(5000); // Fin de reposo diafragmático -> rep 2 de REVERSE_KEGEL
    expect(sm.getSnapshot().phase).toBe('REVERSE_KEGEL');
    expect(sm.getSnapshot().currentRep).toBe(2);
  });
});

describe('TimerStateMachine (Módulo de Pareja: Partner Stop-Start y Squeeze)', () => {
  it('debe soportar PARTNER_STOP_START iniciando en estimulación activa y pausando en nivel 7-8', () => {
    const sm = new TimerStateMachine({
      mode: 'PARTNER_STOP_START',
      targetSets: 1,
      repsPerSet: 3,
      contractionDurationSec: 0,
      relaxationDurationSec: 0,
      partnerPauseDurationSec: 35, // 30-45s pausa
      preparationDurationSec: 0
    });

    sm.start();
    expect(sm.getSnapshot().phase).toBe('STIMULATION_ACTIVE');

    // Paciente reporta excitación 8/10 y presiona botón de pausa
    sm.setArousalLevel(8);
    sm.triggerStopStartPause();

    const snap = sm.getSnapshot();
    expect(snap.phase).toBe('PAUSE_STOP_START');
    expect(snap.timeRemainingSec).toBe(35);
    expect(snap.contractionFactor).toBeLessThanOrEqual(0); // Kegel inverso durante pausa

    // Tras 35s de pausa e inactivación, regresa a estimulación activa en repetición 2
    sm.tick(35000);
    expect(sm.getSnapshot().phase).toBe('STIMULATION_ACTIVE');
    expect(sm.getSnapshot().currentRep).toBe(2);
  });

  it('debe soportar PARTNER_SQUEEZE aplicando compresión firme por 10-15s en nivel 8/10', () => {
    const sm = new TimerStateMachine({
      mode: 'PARTNER_SQUEEZE',
      targetSets: 1,
      repsPerSet: 2,
      contractionDurationSec: 0,
      relaxationDurationSec: 0,
      partnerPauseDurationSec: 12, // 10-15s squeeze
      preparationDurationSec: 0
    });

    sm.start();
    expect(sm.getSnapshot().phase).toBe('STIMULATION_ACTIVE');

    sm.setArousalLevel(8);
    sm.triggerSqueeze();

    const snap = sm.getSnapshot();
    expect(snap.phase).toBe('APPLY_SQUEEZE');
    expect(snap.timeRemainingSec).toBe(12);

    // Tras 12s de squeeze, avanza
    sm.tick(12000);
    expect(sm.getSnapshot().phase).toBe('STIMULATION_ACTIVE');
    expect(sm.getSnapshot().currentRep).toBe(2);
  });
});
