// ==============================================================================
// Clinical Progression Rules: 12-Week Protocol, Bifurcation & Maintenance
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Pastore et al., RCTs, Sexual Tipping Point (Perelman)
// ==============================================================================

import { WeeklyProtocolSpec, AchievementMetadata, PartnerModality } from '../types/clinical.types';

export const ACHIEVEMENT_CATALOG: AchievementMetadata[] = [
  {
    code: 'AISLAMIENTO_PURO_W2',
    title: 'Aislamiento Puro W2',
    description: 'Completar la Fase 1 (Semanas 1–2) en decúbito supino con 100% de sesiones libres de contracción parasitaria.',
    badge_tier: 'BRONZE',
    required_week: 2,
    category: 'NEUROMUSCULAR'
  },
  {
    code: 'RESISTENCIA_TONICA_W6',
    title: 'Resistencia Tónica W6',
    description: 'Superar la Fase 2 (Semana 6) sosteniendo contracciones tónicas de 8 segundos en sedestación.',
    badge_tier: 'SILVER',
    required_week: 6,
    category: 'ENDURANCE'
  },
  {
    code: 'DOMINIO_COGNITIVO_STP',
    title: 'Dominio Cognitivo STP',
    description: 'Completar 5 sesiones de reestructuración del Bucle de Barlow y ajuste de Sliders STP.',
    badge_tier: 'GOLD',
    required_week: 6,
    category: 'COGNITIVE'
  },
  {
    code: 'UMBRAL_7_CONTROLADO',
    title: 'Umbral 7-8 Controlado',
    description: 'Ejecutar 6 sesiones exitosas de Stop-Start (Individual o en Pareja) deteniendo la excitación en el nivel 7-8/10 con Kegel inverso.',
    badge_tier: 'GOLD',
    required_week: 8,
    category: 'PARTNER'
  },
  {
    code: 'SINCRONIA_COITAL_W12',
    title: 'Sincronía Coital W12',
    description: 'Completar el protocolo de las 12 semanas integrando la técnica Squeeze y la Maniobra de Knack, desbloqueando el Modo Mantenimiento (3 series/semana).',
    badge_tier: 'PLATINUM',
    required_week: 12,
    category: 'ENDURANCE'
  }
];

export const TWELVE_WEEK_PROTOCOL: WeeklyProtocolSpec[] = [
  {
    phaseNumber: 1,
    phaseName: 'Fase 1: Aislamiento Neuromuscular y Propiocepción Individual',
    weeks: [1, 2],
    bodyPosition: 'SUPINE',
    dailySets: 3,
    tonicSpecs: { reps: 10, holdSec: 3, restSec: 6 }, // Relación 1:2 para evitar fatiga
    phasicSpecs: { reps: 8, holdSec: 1, restSec: 2 },
    reverseKegelCyclesEndSet: 3,
    partnerModality: 'EXCLUDED',
    clinicalInstructions:
      'Decúbito supino con rodillas flexionadas para anular la gravedad. Cero activación de glúteos, aductores o abdomen. Pareja excluida para inhibir ansiedad evaluativa.'
  },
  {
    phaseNumber: 2,
    phaseName: 'Fase 2: Consolidación Tónica/Fásica e Integración Educativa Pasiva',
    weeks: [3, 4, 5, 6],
    bodyPosition: 'SEATED',
    dailySets: 3,
    tonicSpecs: { reps: 10, holdSec: 7, restSec: 14 },
    phasicSpecs: { reps: 10, holdSec: 1, restSec: 1 },
    reverseKegelCyclesEndSet: 3,
    partnerModality: 'PASSIVE_EDU',
    clinicalInstructions:
      'Sedestación erguida sobre superficie firme venciendo peso visceral. Lectura compartida del modelo STP con la pareja para eliminar culpa mutua.'
  },
  {
    phaseNumber: 3,
    phaseName: 'Fase 3: Carga Dinámica e Inicio de Focalización Sensorial I',
    weeks: [7, 8],
    bodyPosition: 'STANDING',
    dailySets: 3,
    tonicSpecs: { reps: 12, holdSec: 9, restSec: 10 },
    phasicSpecs: { reps: 15, holdSec: 1, restSec: 1 },
    reverseKegelCyclesEndSet: 5,
    partnerModality: 'SENSATE_FOCUS_I',
    clinicalInstructions:
      'Bipedestación. En pareja: 2 sesiones/semana (20 min) de caricias no genitales sin meta orgásmica (Focalización Sensorial I).'
  },
  {
    phaseNumber: 4,
    phaseName: 'Fase 4: Integración Terapéutica Activa en Pareja (Stop-Start Asistido)',
    weeks: [9, 10],
    bodyPosition: 'STANDING',
    dailySets: 3,
    tonicSpecs: { reps: 15, holdSec: 10, restSec: 10 },
    phasicSpecs: { reps: 15, holdSec: 1, restSec: 1 },
    reverseKegelCyclesEndSet: 5,
    partnerModality: 'PARTNER_STOP_START',
    clinicalInstructions:
      'Estimulación manual/oral por la pareja. Al llegar a excitación 7-8/10, presionar Pausa: 30-45s de inactivación ejecutando Kegel inverso + respiración diafragmática hasta bajar a 3-4/10 (3 ciclos).'
  },
  {
    phaseNumber: 5,
    phaseName: 'Fase 5: Transferencia a la Intimidad Coital, Squeeze y Mantenimiento',
    weeks: [11, 12],
    bodyPosition: 'COITAL',
    dailySets: 3,
    tonicSpecs: { reps: 15, holdSec: 10, restSec: 10 },
    phasicSpecs: { reps: 15, holdSec: 1, restSec: 1 },
    reverseKegelCyclesEndSet: 5,
    partnerModality: 'COITAL_SQUEEZE',
    clinicalInstructions:
      'Coito pautado. Si la excitación sube a 8/10, aplicar técnica Squeeze (compresión en frenillo/glande por 10-15s) y Maniobra de Knack previa a cambios de ritmo. Post-Semana 12: 3 series/semana.'
  }
];

export const DOWN_TRAINING_PROTOCOL: WeeklyProtocolSpec = {
  phaseNumber: 0,
  phaseName: 'Protocolo de Seguridad: Down-Training (Hipertonía Basal Activa)',
  weeks: [0],
  bodyPosition: 'SUPINE',
  dailySets: 2,
  tonicSpecs: { reps: 0, holdSec: 0, restSec: 0 },
  phasicSpecs: { reps: 0, holdSec: 0, restSec: 0 },
  reverseKegelCyclesEndSet: 10,
  partnerModality: 'EXCLUDED',
  clinicalInstructions:
    'ALERTA CLÍNICA: Signos de hipertonía perineal detectados. Contracciones tónicas y fásicas bloqueadas estrictamente. Realizar respiración diafragmática profunda combinada con Kegel inverso (relajación descendente) para normalizar tono basal y restaurar longitud de sarcómeras.'
};

export const MAINTENANCE_PROTOCOL: WeeklyProtocolSpec = {
  phaseNumber: 6,
  phaseName: 'Fase 6: Modo Mantenimiento Reflexogénico (Post-Semana 12)',
  weeks: [13],
  bodyPosition: 'COITAL',
  dailySets: 1, // 1 sesión diaria de refuerzo, recomendada 3 series/semana
  tonicSpecs: { reps: 15, holdSec: 10, restSec: 10 },
  phasicSpecs: { reps: 15, holdSec: 1, restSec: 1 },
  reverseKegelCyclesEndSet: 5,
  partnerModality: 'COITAL_SQUEEZE',
  clinicalInstructions:
    'Reconfiguración post-reto (3 series/semana). Mantén la Maniobra de Knack previa a cambios de ritmo y 1 sesión de refuerzo neuromuscular semanal para preservar la reorganización del reflejo bulbocavernoso.'
};

export function getProtocolForWeek(
  week: number,
  hasHypertonia: boolean,
  hasPartner: boolean = false
): WeeklyProtocolSpec {
  if (hasHypertonia) {
    return DOWN_TRAINING_PROTOCOL;
  }

  // Post-Semana 12: Modo Mantenimiento
  if (week >= 13) {
    return {
      ...MAINTENANCE_PROTOCOL,
      partnerModality: hasPartner ? 'COITAL_SQUEEZE' : 'SOLO_STOP_START'
    };
  }

  const normalizedWeek = Math.min(Math.max(week, 1), 12);
  const baseProtocol =
    TWELVE_WEEK_PROTOCOL.find((p) => p.weeks.includes(normalizedWeek)) ||
    TWELVE_WEEK_PROTOCOL[0];

  // Regla de Bifurcación: Si el paciente no tiene pareja, bifurcar Fases 3, 4 y 5 hacia Ruta Solo
  if (!hasPartner) {
    if (normalizedWeek >= 7 && normalizedWeek <= 8) {
      return {
        ...baseProtocol,
        partnerModality: 'SOLO_STOP_START' as PartnerModality,
        clinicalInstructions:
          'Bipedestación. Reeducación masturbatoria Stop-Start individual pausando en nivel 7/10 + Kegel inverso diafragmático para reconfigurar el umbral eyaculatorio sin dependencia de la pareja.'
      };
    }

    if (normalizedWeek >= 9 && normalizedWeek <= 10) {
      return {
        ...baseProtocol,
        partnerModality: 'SOLO_STOP_START' as PartnerModality,
        clinicalInstructions:
          'Ruta Individual Solo: Estimulación masturbatoria manual variando velocidad. Al llegar a nivel 7-8/10, pausar completamente 30-45s ejecutando Kegel inverso hasta descender a nivel 3-4/10 (3 ciclos).'
      };
    }

    if (normalizedWeek >= 11 && normalizedWeek <= 12) {
      return {
        ...baseProtocol,
        partnerModality: 'SOLO_STOP_START' as PartnerModality,
        clinicalInstructions:
          'Transferencia individual: Integración de la Maniobra de Knack previa al punto de no retorno. Preparación para intimidad libre de ansiedad.'
      };
    }
  }

  return baseProtocol;
}
