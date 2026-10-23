// ==============================================================================
// TDD Test Suite: 12-Week Progression, Bifurcation & Maintenance Protocol
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Strict Clinical Invariants (Pastore / Perelman / Masters & Johnson)
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  getProtocolForWeek,
  TWELVE_WEEK_PROTOCOL,
  DOWN_TRAINING_PROTOCOL,
  MAINTENANCE_PROTOCOL,
  ACHIEVEMENT_CATALOG
} from '../clinicalProgressionRules';

describe('Reglas de Progresión Clínica de 12 Semanas y Bifurcación', () => {
  it('debe asignar obligatoriamente DOWN_TRAINING_PROTOCOL ante cualquier semana si hasHypertonia === true', () => {
    [1, 4, 8, 12, 13].forEach((week) => {
      const protocol = getProtocolForWeek(week, true, true);
      expect(protocol.phaseNumber).toBe(0);
      expect(protocol.phaseName).toContain('Down-Training');
      expect(protocol.tonicSpecs.reps).toBe(0);
      expect(protocol.phasicSpecs.reps).toBe(0);
      expect(protocol.partnerModality).toBe('EXCLUDED');
    });
  });

  it('debe prohibir estrictamente la participación de la pareja en las semanas 1 y 2 aunque hasPartner === true', () => {
    const week1 = getProtocolForWeek(1, false, true);
    const week2 = getProtocolForWeek(2, false, true);

    expect(week1.partnerModality).toBe('EXCLUDED');
    expect(week2.partnerModality).toBe('EXCLUDED');
    expect(week1.bodyPosition).toBe('SUPINE');
    expect(week1.clinicalInstructions).toContain('Pareja excluida para inhibir ansiedad evaluativa');
  });

  it('debe activar integración educativa pasiva en Fase 2 (Semanas 3 a 6)', () => {
    [3, 4, 5, 6].forEach((week) => {
      const protocol = getProtocolForWeek(week, false, true);
      expect(protocol.phaseNumber).toBe(2);
      expect(protocol.bodyPosition).toBe('SEATED');
      expect(protocol.partnerModality).toBe('PASSIVE_EDU');
    });
  });

  it('debe bifurcar automáticamente hacia la Ruta Individual Solo si hasPartner === false en Semanas 7-8', () => {
    const soloProtocol = getProtocolForWeek(7, false, false);
    const partnerProtocol = getProtocolForWeek(7, false, true);

    expect(soloProtocol.partnerModality).toBe('SOLO_STOP_START');
    expect(soloProtocol.clinicalInstructions).toContain('Reeducación masturbatoria Stop-Start');

    expect(partnerProtocol.partnerModality).toBe('SENSATE_FOCUS_I');
    expect(partnerProtocol.clinicalInstructions).toContain('Focalización Sensorial I');
  });

  it('debe bifurcar automáticamente hacia Stop-Start Solo en Semanas 9-10 si hasPartner === false', () => {
    const soloProtocol = getProtocolForWeek(9, false, false);
    const partnerProtocol = getProtocolForWeek(9, false, true);

    expect(soloProtocol.partnerModality).toBe('SOLO_STOP_START');
    expect(partnerProtocol.partnerModality).toBe('PARTNER_STOP_START');
  });

  it('debe bifurcar hacia Coito Pautado/Squeeze en pareja vs Transferencia Individual si hasPartner === false en Semanas 11-12', () => {
    const soloProtocol = getProtocolForWeek(12, false, false);
    const partnerProtocol = getProtocolForWeek(12, false, true);

    expect(soloProtocol.partnerModality).toBe('SOLO_STOP_START');
    expect(soloProtocol.clinicalInstructions).toContain('Maniobra de Knack');

    expect(partnerProtocol.partnerModality).toBe('COITAL_SQUEEZE');
    expect(partnerProtocol.clinicalInstructions).toContain('Squeeze');
  });

  it('debe activar el Modo Mantenimiento post-Semana 12 (Semana 13+) con 3 series semanales', () => {
    const postChallengeProtocol = getProtocolForWeek(13, false, true);

    expect(postChallengeProtocol.phaseNumber).toBe(6);
    expect(postChallengeProtocol.phaseName).toContain('Mantenimiento');
    expect(postChallengeProtocol.dailySets).toBe(1); // 1 sesion de mantenimiento (3 veces por semana)
    expect(postChallengeProtocol.clinicalInstructions).toContain('3 series/semana');
  });
});

describe('Catálogo Oficial de Logros Clínicos del Reto de 12 Semanas', () => {
  it('debe incluir los 5 logros de neuroplasticidad definidos en la Sección 7.1', () => {
    const codes = ACHIEVEMENT_CATALOG.map((a) => a.code);

    expect(codes).toContain('AISLAMIENTO_PURO_W2');
    expect(codes).toContain('RESISTENCIA_TONICA_W6');
    expect(codes).toContain('DOMINIO_COGNITIVO_STP');
    expect(codes).toContain('UMBRAL_7_CONTROLADO');
    expect(codes).toContain('SINCRONIA_COITAL_W12');
  });
});
