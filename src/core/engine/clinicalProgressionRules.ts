// ==============================================================================
// Clinical Progression Rules: 12-Week Neuromuscular PFMT Protocol
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Evidence: Pastore et al., RCTs, STP Model (Perelman)
// ==============================================================================

import { WeeklyProtocolSpec } from '../types/clinical.types';

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
    tonicSpecs: { reps: 10, holdSec: 7, restSec: 14 }, // Progresión 5-8s sostén / 8-16s reposo
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
    tonicSpecs: { reps: 12, holdSec: 9, restSec: 10 }, // 8-10s sostén / 10s reposo
    phasicSpecs: { reps: 15, holdSec: 1, restSec: 1 },
    reverseKegelCyclesEndSet: 5,
    partnerModality: 'SENSATE_FOCUS_I',
    clinicalInstructions:
      'Bipedestación. En pareja: 2 sesiones/semana (20 min) de caricias no genitales sin meta orgásmica. Individual: Reeducación masturbatoria Stop-Start pausando en nivel 7/10 + Kegel inverso.'
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

export function getProtocolForWeek(week: number, hasHypertonia: boolean): WeeklyProtocolSpec {
  if (hasHypertonia) {
    return DOWN_TRAINING_PROTOCOL;
  }
  const normalizedWeek = Math.min(Math.max(week, 1), 12);
  const found = TWELVE_WEEK_PROTOCOL.find(p => p.weeks.includes(normalizedWeek));
  return found || TWELVE_WEEK_PROTOCOL[0];
}
