// ==============================================================================
// Clinical Metrics Calculator & EduSalud Data Engine
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Pastore et al. RCT Benchmarks, 84-Day Adherence Heatmap
// ==============================================================================

import { ClinicalAssessment, TrainingSession } from '../types/clinical.types';

export const PASTORE_RCT_BENCHMARKS = {
  week0: 31.5,   // Media basal: 31.2 - 31.7s
  week4: 65.0,   // Progreso inicial intermedio
  week8: 105.0,  // Carga dinámica y stop-start
  week12: 136.2  // Media 12 semanas: 126.2 - 146.2s (>4x incremento)
};

export interface IeltChartDataPoint {
  week: string;
  patientIelt: number | null;
  rctBenchmark: number;
}

export interface PedtChartDataPoint {
  week: string;
  patientPedt: number | null;
  clinicalThreshold: number; // 8 = Umbral de corte sin EP
}

export interface HeatmapDay {
  absoluteDay: number; // 1 a 84
  week: number;        // 1 a 12
  dayOfWeek: number;   // 1 a 7
  status: 'COMPLETED' | 'MISSED' | 'FUTURE';
  isCurrentDay: boolean;
  zeroParasiticCompensation?: boolean;
  exerciseMode?: string;
  durationSeconds?: number;
}

export interface AdherenceSummary {
  days: HeatmapDay[];
  completedCount: number;
  totalElapsedDays: number;
  adherenceRatePercent: number;
}

export interface EvidenceComparisonRow {
  parameter: string;
  pfmtGroup: string;
  dapoxetineGroup: string;
  clinicalImpact: string;
}

export const EVIDENCE_COMPARISON_DATA: EvidenceComparisonRow[] = [
  {
    parameter: 'IELT Basal Medio',
    pfmtGroup: '31.2 a 31.7 segundos',
    dapoxetineGroup: '37.2 a 37.8 segundos',
    clinicalImpact: 'Punto de partida clínico homogéneo sin diferencias significativas basales.'
  },
  {
    parameter: 'IELT a las 12 Semanas',
    pfmtGroup: '126.2 a 146.2 segundos (Aumento >4x)',
    dapoxetineGroup: '168.6 s (30 mg) / 222.5 s (60 mg)',
    clinicalImpact: 'Éxito clínico en el 57% al 82% de los pacientes con PFMT sin fármacos.'
  },
  {
    parameter: 'Mantenimiento a 5 Años',
    pfmtGroup: '66% a 81% mantiene el control a los 24 y 60 meses',
    dapoxetineGroup: 'Reversión inmediata a valores basales al suspender el fármaco',
    clinicalImpact: 'Reorganización neuromuscular y reflexogénica duradera y permanente.'
  },
  {
    parameter: 'Efectos Adversos',
    pfmtGroup: 'Ninguno (cero eventos registrados)',
    dapoxetineGroup: 'Náuseas, mareos, cefalea, diarrea',
    clinicalImpact: 'Tratamiento 100% libre de toxicidad farmacológica y dependencia.'
  }
];

export function generateIeltProgressionData(
  assessments: ClinicalAssessment[],
  fallbackBaseline?: number
): IeltChartDataPoint[] {
  const weeks = [0, 4, 8, 12];

  return weeks.map((w) => {
    // Buscar evaluación registrada para esta semana específica o en su rango
    const match = assessments.find((a) => {
      if (w === 0) return a.week_number === 0;
      if (w === 4) return a.week_number >= 3 && a.week_number <= 5;
      if (w === 8) return a.week_number >= 7 && a.week_number <= 9;
      if (w === 12) return a.week_number >= 11;
      return false;
    });

    let patientIelt: number | null = null;
    if (match) {
      patientIelt = Number(match.ielt_seconds);
    } else if (w === 0 && fallbackBaseline) {
      patientIelt = fallbackBaseline;
    }

    let rctBenchmark = PASTORE_RCT_BENCHMARKS.week0;
    if (w === 4) rctBenchmark = PASTORE_RCT_BENCHMARKS.week4;
    if (w === 8) rctBenchmark = PASTORE_RCT_BENCHMARKS.week8;
    if (w === 12) rctBenchmark = PASTORE_RCT_BENCHMARKS.week12;

    return {
      week: `S${w}`,
      patientIelt,
      rctBenchmark
    };
  });
}

export function generatePedtProgressionData(
  assessments: ClinicalAssessment[],
  fallbackBaselinePedt?: number
): PedtChartDataPoint[] {
  const weeks = [0, 4, 8, 12];

  return weeks.map((w) => {
    const match = assessments.find((a) => {
      if (w === 0) return a.week_number === 0;
      if (w === 4) return a.week_number >= 3 && a.week_number <= 5;
      if (w === 8) return a.week_number >= 7 && a.week_number <= 9;
      if (w === 12) return a.week_number >= 11;
      return false;
    });

    let patientPedt: number | null = null;
    if (match) {
      patientPedt = match.pedt_score;
    } else if (w === 0 && fallbackBaselinePedt !== undefined) {
      patientPedt = fallbackBaselinePedt;
    }

    return {
      week: `S${w}`,
      patientPedt,
      clinicalThreshold: 8
    };
  });
}

export function calculate84DayAdherenceHeatmap(
  sessions: TrainingSession[],
  currentWeek: number,
  currentDay: number
): AdherenceSummary {
  const currentAbsoluteDay = Math.min((currentWeek - 1) * 7 + currentDay, 84);
  const days: HeatmapDay[] = [];
  let completedCount = 0;

  for (let d = 1; d <= 84; d++) {
    const week = Math.floor((d - 1) / 7) + 1;
    const dayOfWeek = ((d - 1) % 7) + 1;
    const isCurrentDay = d === currentAbsoluteDay;

    // Buscar si hay sesión registrada para esta semana y día
    const session = sessions.find(
      (s) => s.week_number === week && s.day_number === dayOfWeek
    );

    let status: 'COMPLETED' | 'MISSED' | 'FUTURE' = 'FUTURE';

    if (session) {
      status = 'COMPLETED';
      completedCount++;
    } else if (d < currentAbsoluteDay) {
      status = 'MISSED';
    }

    days.push({
      absoluteDay: d,
      week,
      dayOfWeek,
      status,
      isCurrentDay,
      zeroParasiticCompensation: session?.zero_parasitic_compensation,
      exerciseMode: session?.exercise_mode,
      durationSeconds: session?.duration_seconds
    });
  }

  const totalElapsedDays = Math.max(currentAbsoluteDay - 1, 1);
  const adherenceRatePercent = Math.min(
    Math.round((completedCount / totalElapsedDays) * 100),
    100
  );

  return {
    days,
    completedCount,
    totalElapsedDays,
    adherenceRatePercent
  };
}
