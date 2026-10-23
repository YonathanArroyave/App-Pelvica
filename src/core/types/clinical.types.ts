// ==============================================================================
// Clinical Contracts and TypeScript Definitions
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Strict TypeScript, Medical Informatics Precision
// ==============================================================================

export type ExerciseMode =
  | 'INDIVIDUAL_TONIC'
  | 'INDIVIDUAL_PHASIC'
  | 'DOWN_TRAINING'
  | 'SOLO_STOP_START'
  | 'SENSATE_FOCUS_I'
  | 'SENSATE_FOCUS_II'
  | 'PARTNER_STOP_START'
  | 'PARTNER_SQUEEZE';

export type ActivePhase =
  | 'PREPARATION'
  | 'CONTRACTION'
  | 'RELAXATION'
  | 'STIMULATION_ACTIVE'
  | 'PAUSE_STOP_START'
  | 'APPLY_SQUEEZE'
  | 'REVERSE_KEGEL'
  | 'SET_REST'
  | 'COMPLETED';

export type BodyPosition = 'SUPINE' | 'SEATED' | 'STANDING' | 'COITAL';

export type PartnerModality =
  | 'EXCLUDED'
  | 'PASSIVE_EDU'
  | 'SENSATE_FOCUS_I'
  | 'PARTNER_STOP_START'
  | 'COITAL_SQUEEZE'
  | 'SOLO_STOP_START';

export interface HypertoniaSymptoms {
  pelvic_pain: boolean;              // Dolor perineal / pélvico
  urinary_hesitancy: boolean;        // Micción vacilante / dificultad para iniciar micción
  post_ejaculatory_burning: boolean; // Escozor post-eyaculatorio
  tenesmus: boolean;                 // Sensación de evacuación incompleta / tenesmo
}

export interface StpExcitatoryFactors {
  sensory_focus: number;     // 1 a 10
  erotic_imagery: number;    // 1 a 10
  pelvic_awareness: number;  // 1 a 10
}

export interface StpInhibitoryFactors {
  performance_anxiety: number;        // 1 a 10 (Ansiedad de ejecución)
  spectatoring: number;               // 1 a 10 (Espectadorismo)
  sympathetic_hypervigilance: number; // 1 a 10 (Hipervigilancia simpática)
}

export interface StpMatrix {
  excitatory: StpExcitatoryFactors;
  inhibitory: StpInhibitoryFactors;
}

export interface PatientProfile {
  id: string;
  alias: string;
  pin_hash?: string | null;
  has_partner: boolean;
  has_hypertonia: boolean;
  current_week: number;
  current_day: number;
  current_streak: number;
  longest_streak: number;
  grace_tokens_remaining: number;
  neuroplasticity_xp: number;
  created_at: string;
  updated_at: string;
}

export interface ClinicalAssessment {
  id: string;
  user_id: string;
  week_number: number;
  ielt_seconds: number;
  pedt_score: number;
  hypertonia_symptoms: HypertoniaSymptoms;
  stp_matrix: StpMatrix;
  recorded_at: string;
}

export interface TrainingSession {
  id?: string;
  user_id: string;
  week_number: number;
  day_number: number;
  exercise_mode: ExerciseMode;
  body_position: BodyPosition;
  completed_sets: number;
  target_sets: number;
  max_arousal_reached?: number;
  zero_parasitic_compensation: boolean;
  duration_seconds: number;
  completed_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_code: string;
  unlocked_at: string;
}

export interface AchievementMetadata {
  code: string;
  title: string;
  description: string;
  badge_tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  required_week: number;
  category: 'NEUROMUSCULAR' | 'COGNITIVE' | 'PARTNER' | 'ENDURANCE';
}

export interface WeeklyProtocolSpec {
  phaseNumber: number;
  phaseName: string;
  weeks: number[];
  bodyPosition: BodyPosition;
  dailySets: number;
  tonicSpecs: { reps: number; holdSec: number; restSec: number };
  phasicSpecs: { reps: number; holdSec: number; restSec: number };
  reverseKegelCyclesEndSet: number;
  partnerModality: PartnerModality;
  clinicalInstructions: string;
}
