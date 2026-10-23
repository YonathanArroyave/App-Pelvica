// ==============================================================================
// TDD Test Suite: Clinical Assessment & Hypertonia Safety Blocker
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: TDD Workflow, Medical Safety Invariants, 100% Coverage Target
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  evaluateHypertonia,
  evaluatePedtScore,
  evaluateIelt,
  evaluateStpBalance,
  determineDailyTrainingMode,
  BLOCKED_EXERCISE_MODES_ON_HYPERTONIA
} from '../clinicalAssessmentEvaluator';
import { HypertoniaSymptoms, StpMatrix, ExerciseMode } from '../../types/clinical.types';

describe('Algoritmo Bloqueador de Hipertonía (Clinical Safety Blocker)', () => {
  it('debe detectar hipertonía y bloquear contracciones activas si el paciente presenta dolor pélvico', () => {
    const symptoms: HypertoniaSymptoms = {
      pelvic_pain: true,
      urinary_hesitancy: false,
      post_ejaculatory_burning: false,
      tenesmus: false
    };

    const result = evaluateHypertonia(symptoms);

    expect(result.hasHypertonia).toBe(true);
    expect(result.clinicalAlert).toBe('HIPERTONIA_DETECTADA');
    expect(result.forcedMode).toBe('DOWN_TRAINING');
    expect(result.blockedModes).toEqual(BLOCKED_EXERCISE_MODES_ON_HYPERTONIA);
    expect(result.protocolDurationMinutes).toBe(10);
  });

  it('debe detectar hipertonía si el paciente presenta micción vacilante / dificultad urinaria', () => {
    const symptoms: HypertoniaSymptoms = {
      pelvic_pain: false,
      urinary_hesitancy: true,
      post_ejaculatory_burning: false,
      tenesmus: false
    };

    const result = evaluateHypertonia(symptoms);

    expect(result.hasHypertonia).toBe(true);
    expect(result.forcedMode).toBe('DOWN_TRAINING');
  });

  it('debe detectar hipertonía si el paciente presenta escozor post-eyaculatorio', () => {
    const symptoms: HypertoniaSymptoms = {
      pelvic_pain: false,
      urinary_hesitancy: false,
      post_ejaculatory_burning: true,
      tenesmus: false
    };

    const result = evaluateHypertonia(symptoms);

    expect(result.hasHypertonia).toBe(true);
    expect(result.forcedMode).toBe('DOWN_TRAINING');
  });

  it('debe detectar hipertonía si el paciente presenta tenesmo / sensación de evacuación incompleta', () => {
    const symptoms: HypertoniaSymptoms = {
      pelvic_pain: false,
      urinary_hesitancy: false,
      post_ejaculatory_burning: false,
      tenesmus: true
    };

    const result = evaluateHypertonia(symptoms);

    expect(result.hasHypertonia).toBe(true);
    expect(result.forcedMode).toBe('DOWN_TRAINING');
  });

  it('debe permitir contracciones activas y tono normal si todos los síntomas son false', () => {
    const symptoms: HypertoniaSymptoms = {
      pelvic_pain: false,
      urinary_hesitancy: false,
      post_ejaculatory_burning: false,
      tenesmus: false
    };

    const result = evaluateHypertonia(symptoms);

    expect(result.hasHypertonia).toBe(false);
    expect(result.clinicalAlert).toBe('NORMAL_TONE');
    expect(result.forcedMode).toBeNull();
    expect(result.blockedModes).toHaveLength(0);
  });

  it('debe forzar determinísticamente DOWN_TRAINING ante cualquier modo solicitado si has_hypertonia === true', () => {
    const activeModes: ExerciseMode[] = [
      'INDIVIDUAL_TONIC',
      'INDIVIDUAL_PHASIC',
      'SOLO_STOP_START',
      'PARTNER_STOP_START',
      'PARTNER_SQUEEZE'
    ];

    activeModes.forEach((mode) => {
      const assigned = determineDailyTrainingMode(mode, true);
      expect(assigned).toBe('DOWN_TRAINING');
    });
  });

  it('debe respetar el modo prescrito normal si has_hypertonia === false', () => {
    expect(determineDailyTrainingMode('INDIVIDUAL_TONIC', false)).toBe('INDIVIDUAL_TONIC');
    expect(determineDailyTrainingMode('INDIVIDUAL_PHASIC', false)).toBe('INDIVIDUAL_PHASIC');
    expect(determineDailyTrainingMode('SOLO_STOP_START', false)).toBe('SOLO_STOP_START');
  });
});

describe('Evaluador Clínico PEDT (Premature Ejaculation Diagnostic Tool)', () => {
  it('debe clasificar puntajes <= 8 como sin evidencia de eyaculación precoz', () => {
    // 5 respuestas de 1 punto = 5
    const result = evaluatePedtScore([1, 1, 1, 1, 1]);
    expect(result.score).toBe(5);
    expect(result.classification).toBe('NO_PE');
    expect(result.isClinicallySignificant).toBe(false);
  });

  it('debe clasificar puntajes entre 9 y 10 como probable eyaculación precoz (Borderline)', () => {
    // [2, 2, 2, 2, 2] = 10
    const result = evaluatePedtScore([2, 2, 2, 2, 2]);
    expect(result.score).toBe(10);
    expect(result.classification).toBe('PROBABLE_PE');
    expect(result.isClinicallySignificant).toBe(true);
  });

  it('debe clasificar puntajes >= 11 como presencia clínica de eyaculación precoz', () => {
    // [3, 3, 3, 2, 3] = 14
    const result = evaluatePedtScore([3, 3, 3, 2, 3]);
    expect(result.score).toBe(14);
    expect(result.classification).toBe('DEFINITE_PE');
    expect(result.isClinicallySignificant).toBe(true);
  });

  it('debe limitar el puntaje en el rango válido de 0 a 20', () => {
    const maxResult = evaluatePedtScore([4, 4, 4, 4, 4]);
    expect(maxResult.score).toBe(20);

    const minResult = evaluatePedtScore([0, 0, 0, 0, 0]);
    expect(minResult.score).toBe(0);
  });
});

describe('Evaluador de Latencia Eyaculatoria Intravaginal (IELT)', () => {
  it('debe clasificar un IELT <= 60s como Eyaculación Precoz Primaria / Severa', () => {
    const result = evaluateIelt(45);
    expect(result.isPrimaryPE).toBe(true);
    expect(result.classification).toBe('PRIMARY_OR_SEVERE');
  });

  it('debe clasificar exactamente 60 segundos como Eyaculación Precoz Primaria', () => {
    const result = evaluateIelt(60);
    expect(result.isPrimaryPE).toBe(true);
    expect(result.classification).toBe('PRIMARY_OR_SEVERE');
  });

  it('debe clasificar un IELT entre 61s y 120s como Leve o Adquirida', () => {
    const result = evaluateIelt(90);
    expect(result.isPrimaryPE).toBe(false);
    expect(result.classification).toBe('ACQUIRED_OR_MILD');
  });

  it('debe clasificar un IELT > 120s como dentro de límites normales de latencia', () => {
    const result = evaluateIelt(300);
    expect(result.isPrimaryPE).toBe(false);
    expect(result.classification).toBe('NORMAL_LATENCY');
  });
});

describe('Evaluador de Matriz STP (Sexual Tipping Point)', () => {
  it('debe calcular correctamente el balance neto y detectar el factor inhibitorio predominante', () => {
    const matrix: StpMatrix = {
      excitatory: {
        sensory_focus: 5,
        erotic_imagery: 6,
        pelvic_awareness: 4
      },
      inhibitory: {
        performance_anxiety: 8,
        spectatoring: 9, // Predominante
        sympathetic_hypervigilance: 7
      }
    };

    const result = evaluateStpBalance(matrix);
    expect(result.totalExcitatory).toBe(15);
    expect(result.totalInhibitory).toBe(24);
    expect(result.netBalance).toBe(-9);
    expect(result.predominantInhibitor).toBe('spectatoring');
    expect(result.requiresBarlowIntervention).toBe(true);
  });
});
