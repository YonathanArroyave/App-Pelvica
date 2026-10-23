// ==============================================================================
// TDD Test Suite: Clinical Metrics Calculator & EduSalud Data Engine
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Pastore et al. Benchmarks, 84-Day Adherence Heatmap Invariants
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  generateIeltProgressionData,
  generatePedtProgressionData,
  calculate84DayAdherenceHeatmap,
  EVIDENCE_COMPARISON_DATA,
  PASTORE_RCT_BENCHMARKS
} from '../clinicalMetricsCalculator';
import { ClinicalAssessment, TrainingSession } from '../../types/clinical.types';

describe('Calculador de Métricas de Progreso IELT y PEDT', () => {
  it('debe generar puntos de evolución IELT para semanas 0, 4, 8 y 12 con benchmarks RCT', () => {
    const mockAssessments: ClinicalAssessment[] = [
      {
        id: '1',
        user_id: 'u1',
        week_number: 0,
        ielt_seconds: 40,
        pedt_score: 16,
        hypertonia_symptoms: {
          pelvic_pain: false,
          urinary_hesitancy: false,
          post_ejaculatory_burning: false,
          tenesmus: false
        },
        stp_matrix: {
          excitatory: { sensory_focus: 5, erotic_imagery: 5, pelvic_awareness: 5 },
          inhibitory: { performance_anxiety: 7, spectatoring: 7, sympathetic_hypervigilance: 6 }
        },
        recorded_at: '2026-10-01T00:00:00Z'
      },
      {
        id: '2',
        user_id: 'u1',
        week_number: 4,
        ielt_seconds: 75,
        pedt_score: 12,
        hypertonia_symptoms: {
          pelvic_pain: false,
          urinary_hesitancy: false,
          post_ejaculatory_burning: false,
          tenesmus: false
        },
        stp_matrix: {
          excitatory: { sensory_focus: 6, erotic_imagery: 6, pelvic_awareness: 6 },
          inhibitory: { performance_anxiety: 5, spectatoring: 5, sympathetic_hypervigilance: 4 }
        },
        recorded_at: '2026-10-28T00:00:00Z'
      }
    ];

    const data = generateIeltProgressionData(mockAssessments, 40);

    expect(data.length).toBe(4); // Semanas 0, 4, 8, 12
    expect(data[0].week).toBe('S0');
    expect(data[0].patientIelt).toBe(40);
    expect(data[0].rctBenchmark).toBe(PASTORE_RCT_BENCHMARKS.week0);

    expect(data[1].week).toBe('S4');
    expect(data[1].patientIelt).toBe(75);
    expect(data[1].rctBenchmark).toBe(PASTORE_RCT_BENCHMARKS.week4);

    expect(data[2].week).toBe('S8');
    expect(data[3].week).toBe('S12');
    expect(data[3].rctBenchmark).toBe(PASTORE_RCT_BENCHMARKS.week12);
  });

  it('debe generar puntos de evolución PEDT con umbral clínico de normalidad (<= 8)', () => {
    const mockAssessments: ClinicalAssessment[] = [
      {
        id: '1',
        user_id: 'u1',
        week_number: 0,
        ielt_seconds: 35,
        pedt_score: 15,
        hypertonia_symptoms: {
          pelvic_pain: false,
          urinary_hesitancy: false,
          post_ejaculatory_burning: false,
          tenesmus: false
        },
        stp_matrix: {
          excitatory: { sensory_focus: 5, erotic_imagery: 5, pelvic_awareness: 5 },
          inhibitory: { performance_anxiety: 7, spectatoring: 7, sympathetic_hypervigilance: 6 }
        },
        recorded_at: '2026-10-01T00:00:00Z'
      }
    ];

    const data = generatePedtProgressionData(mockAssessments, 15);

    expect(data.length).toBe(4);
    expect(data[0].patientPedt).toBe(15);
    expect(data[0].clinicalThreshold).toBe(8); // Umbral de ausencia de EP
  });
});

describe('Mapa de Calor (Heatmap) de Adherencia de 84 Días', () => {
  it('debe calcular exactamente 84 días estructurados en 12 semanas x 7 días', () => {
    const mockSessions: TrainingSession[] = [
      {
        user_id: 'u1',
        week_number: 1,
        day_number: 1,
        exercise_mode: 'INDIVIDUAL_TONIC',
        body_position: 'SUPINE',
        completed_sets: 3,
        target_sets: 3,
        zero_parasitic_compensation: true,
        duration_seconds: 450,
        completed_at: new Date().toISOString()
      },
      {
        user_id: 'u1',
        week_number: 1,
        day_number: 2,
        exercise_mode: 'INDIVIDUAL_TONIC',
        body_position: 'SUPINE',
        completed_sets: 3,
        target_sets: 3,
        zero_parasitic_compensation: true,
        duration_seconds: 450,
        completed_at: new Date().toISOString()
      }
    ];

    const heatmap = calculate84DayAdherenceHeatmap(mockSessions, 1, 3);

    expect(heatmap.days.length).toBe(84);
    expect(heatmap.completedCount).toBe(2);
    expect(heatmap.adherenceRatePercent).toBeGreaterThan(0);

    // Día 1 y Día 2 deben marcarse como completados
    expect(heatmap.days[0].status).toBe('COMPLETED');
    expect(heatmap.days[1].status).toBe('COMPLETED');
    // Día 3 es el día actual
    expect(heatmap.days[2].isCurrentDay).toBe(true);
    // Día 84 es futuro
    expect(heatmap.days[83].status).toBe('FUTURE');
  });
});

describe('Cuadro Métrico de Evidencia Clínica (Pastore et al. vs Dapoxetina)', () => {
  it('debe contener los 4 parámetros clínicos exactos de la Sección 7.2', () => {
    expect(EVIDENCE_COMPARISON_DATA.length).toBe(4);

    const params = EVIDENCE_COMPARISON_DATA.map((d) => d.parameter);
    expect(params).toContain('IELT Basal Medio');
    expect(params).toContain('IELT a las 12 Semanas');
    expect(params).toContain('Mantenimiento a 5 Años');
    expect(params).toContain('Efectos Adversos');

    const adverse = EVIDENCE_COMPARISON_DATA.find((d) => d.parameter === 'Efectos Adversos');
    expect(adverse?.pfmtGroup).toContain('Ninguno');
    expect(adverse?.dapoxetineGroup).toContain('Náuseas');
  });
});
