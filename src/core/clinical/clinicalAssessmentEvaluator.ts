// ==============================================================================
// Clinical Assessment Evaluator & Safety Invariant Engine
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Strict TDD, Safety-First Medical Algorithms (Pastore / Perelman)
// ==============================================================================

import {
  HypertoniaSymptoms,
  ExerciseMode,
  StpMatrix,
  StpInhibitoryFactors
} from '../types/clinical.types';

export const BLOCKED_EXERCISE_MODES_ON_HYPERTONIA: ExerciseMode[] = [
  'INDIVIDUAL_TONIC',
  'INDIVIDUAL_PHASIC',
  'SOLO_STOP_START',
  'PARTNER_STOP_START',
  'PARTNER_SQUEEZE'
];

export interface HypertoniaEvaluationResult {
  hasHypertonia: boolean;
  clinicalAlert: 'HIPERTONIA_DETECTADA' | 'NORMAL_TONE';
  forcedMode: 'DOWN_TRAINING' | null;
  blockedModes: ExerciseMode[];
  protocolDurationMinutes: number;
  detectedSymptoms: string[];
  clinicalRationale: string;
}

export function evaluateHypertonia(symptoms: HypertoniaSymptoms): HypertoniaEvaluationResult {
  const activeSymptoms: string[] = [];

  if (symptoms.pelvic_pain) activeSymptoms.push('Dolor perineal/pélvico en reposo');
  if (symptoms.urinary_hesitancy) activeSymptoms.push('Micción vacilante / dificultad de inicio miccional');
  if (symptoms.post_ejaculatory_burning) activeSymptoms.push('Escozor o disestesia post-eyaculatoria');
  if (symptoms.tenesmus) activeSymptoms.push('Sensación de espasmo anal / tenesmo');

  const hasHypertonia = activeSymptoms.length > 0;

  if (hasHypertonia) {
    return {
      hasHypertonia: true,
      clinicalAlert: 'HIPERTONIA_DETECTADA',
      forcedMode: 'DOWN_TRAINING',
      blockedModes: [...BLOCKED_EXERCISE_MODES_ON_HYPERTONIA],
      protocolDurationMinutes: 10,
      detectedSymptoms: activeSymptoms,
      clinicalRationale:
        'SEGURIDAD CLÍNICA: La presencia de tono basal espástico genera riesgo de isquemia perineal o exacerbación de dolor crónico ante contracciones activas. Se bloquean ejercicios tónicos/fásicos y se asigna down-training diafragmático para restaurar la longitud de reposo de las sarcómeras.'
    };
  }

  return {
    hasHypertonia: false,
    clinicalAlert: 'NORMAL_TONE',
    forcedMode: null,
    blockedModes: [],
    protocolDurationMinutes: 0,
    detectedSymptoms: [],
    clinicalRationale:
      'Tono muscular basal óptimo. Proceder con el protocolo neuromuscular estándar según la semana correspondiente.'
  };
}

export function determineDailyTrainingMode(
  requestedMode: ExerciseMode,
  hasHypertonia: boolean
): ExerciseMode {
  if (hasHypertonia) {
    return 'DOWN_TRAINING';
  }
  return requestedMode;
}

export interface PedtEvaluationResult {
  score: number;
  classification: 'NO_PE' | 'PROBABLE_PE' | 'DEFINITE_PE';
  isClinicallySignificant: boolean;
  interpretationText: string;
}

export function evaluatePedtScore(answers: number[]): PedtEvaluationResult {
  const rawSum = answers.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
  const score = Math.min(Math.max(rawSum, 0), 20);

  if (score <= 8) {
    return {
      score,
      classification: 'NO_PE',
      isClinicallySignificant: false,
      interpretationText: 'Sin evidencia clínica de eyaculación prematura (Puntaje 0-8).'
    };
  }

  if (score <= 10) {
    return {
      score,
      classification: 'PROBABLE_PE',
      isClinicallySignificant: true,
      interpretationText: 'Probable eyaculación prematura / Límite clínico (Puntaje 9-10).'
    };
  }

  return {
    score,
    classification: 'DEFINITE_PE',
    isClinicallySignificant: true,
    interpretationText: 'Presencia clínica definida de eyaculación prematura (Puntaje 11-20).'
  };
}

export interface IeltEvaluationResult {
  seconds: number;
  isPrimaryPE: boolean;
  classification: 'PRIMARY_OR_SEVERE' | 'ACQUIRED_OR_MILD' | 'NORMAL_LATENCY';
  interpretationText: string;
}

export function evaluateIelt(seconds: number): IeltEvaluationResult {
  const normalizedSeconds = Math.max(seconds, 0);

  if (normalizedSeconds <= 60) {
    return {
      seconds: normalizedSeconds,
      isPrimaryPE: true,
      classification: 'PRIMARY_OR_SEVERE',
      interpretationText: 'Latencia menor o igual a 60s (Criterio ISSM de Eyaculación Precoz Primaria / Severa).'
    };
  }

  if (normalizedSeconds <= 120) {
    return {
      seconds: normalizedSeconds,
      isPrimaryPE: false,
      classification: 'ACQUIRED_OR_MILD',
      interpretationText: 'Latencia entre 61s y 120s (Eyaculación Precoz Leve o Adquirida).'
    };
  }

  return {
    seconds: normalizedSeconds,
    isPrimaryPE: false,
    classification: 'NORMAL_LATENCY',
    interpretationText: 'Latencia superior a 120s (Rango normotípico de latencia intravaginal).'
  };
}

export interface StpEvaluationResult {
  totalExcitatory: number;
  totalInhibitory: number;
  netBalance: number;
  predominantInhibitor: keyof StpInhibitoryFactors;
  requiresBarlowIntervention: boolean;
  diagnosticRecommendation: string;
}

export function evaluateStpBalance(matrix: StpMatrix): StpEvaluationResult {
  const { excitatory, inhibitory } = matrix;

  const totalExcitatory =
    (excitatory.sensory_focus || 0) +
    (eroticImagerySafe(excitatory.erotic_imagery)) +
    (excitatory.pelvic_awareness || 0);

  const totalInhibitory =
    (inhibitory.performance_anxiety || 0) +
    (inhibitory.spectatoring || 0) +
    (inhibitory.sympathetic_hypervigilance || 0);

  const netBalance = totalExcitatory - totalInhibitory;

  let predominantInhibitor: keyof StpInhibitoryFactors = 'performance_anxiety';
  let maxInhibitoryVal = inhibitory.performance_anxiety || 0;

  if ((inhibitory.spectatoring || 0) > maxInhibitoryVal) {
    predominantInhibitor = 'spectatoring';
    maxInhibitoryVal = inhibitory.spectatoring;
  }
  if ((inhibitory.sympathetic_hypervigilance || 0) > maxInhibitoryVal) {
    predominantInhibitor = 'sympathetic_hypervigilance';
  }

  const requiresBarlowIntervention =
    netBalance < 0 ||
    (inhibitory.performance_anxiety || 0) >= 7 ||
    (inhibitory.spectatoring || 0) >= 7;

  return {
    totalExcitatory,
    totalInhibitory,
    netBalance,
    predominantInhibitor,
    requiresBarlowIntervention,
    diagnosticRecommendation: requiresBarlowIntervention
      ? `Factor inhibitorio crítico: ${predominantInhibitor.toUpperCase()}. Priorizar Módulo CBT para desarticular el bucle de hipervigilancia simpática.`
      : 'Balance cognitivo estable. Mantener ejercicios de focalización sensorial.'
  };
}

function eroticImagerySafe(val: number | undefined): number {
  return typeof val === 'number' ? val : 0;
}
