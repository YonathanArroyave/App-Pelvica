-- ==============================================================================
-- Clinical Schema Script: src/lib/supabase/schema.sql
-- Project: pelvic-rehab-12w-pwa (Reto Clinico 12 Semanas)
-- Standards: postgres-patterns, HIPAA-compliant privacy, RLS enforcement
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabla de Perfiles Clinicos y Progreso del Reto de 12 Semanas
CREATE TABLE IF NOT EXISTS public.patient_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  alias TEXT NOT NULL DEFAULT 'Paciente',
  pin_hash TEXT, -- Hash SHA-256 de PIN opcional de 4 digitos
  has_partner BOOLEAN NOT NULL DEFAULT FALSE,
  has_hypertonia BOOLEAN NOT NULL DEFAULT FALSE,
  current_week INT NOT NULL DEFAULT 1 CHECK (current_week BETWEEN 1 AND 13),
  current_day INT NOT NULL DEFAULT 1 CHECK (current_day BETWEEN 1 AND 7),
  current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INT NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  grace_tokens_remaining INT NOT NULL DEFAULT 1 CHECK (grace_tokens_remaining BETWEEN 0 AND 3),
  neuroplasticity_xp INT NOT NULL DEFAULT 0 CHECK (neuroplasticity_xp >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Evaluaciones Clinicas Longitudinales
CREATE TABLE IF NOT EXISTS public.clinical_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number BETWEEN 0 AND 12),
  ielt_seconds NUMERIC(6,2) NOT NULL CHECK (ielt_seconds >= 0),
  pedt_score INT NOT NULL CHECK (pedt_score BETWEEN 0 AND 20),
  hypertonia_symptoms JSONB NOT NULL DEFAULT '{
    "pelvic_pain": false,
    "urinary_hesitancy": false,
    "post_ejaculatory_burning": false,
    "tenesmus": false
  }'::jsonb,
  stp_matrix JSONB NOT NULL DEFAULT '{
    "excitatory": {"sensory_focus": 5, "erotic_imagery": 5, "pelvic_awareness": 5},
    "inhibitory": {"performance_anxiety": 7, "spectatoring": 7, "sympathetic_hypervigilance": 6}
  }'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Sesiones Entrenadas
CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number BETWEEN 1 AND 13),
  day_number INT NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  exercise_mode TEXT NOT NULL CHECK (exercise_mode IN (
    'INDIVIDUAL_TONIC',
    'INDIVIDUAL_PHASIC',
    'DOWN_TRAINING',
    'SOLO_STOP_START',
    'SENSATE_FOCUS_I',
    'SENSATE_FOCUS_II',
    'PARTNER_STOP_START',
    'PARTNER_SQUEEZE'
  )),
  body_position TEXT NOT NULL CHECK (body_position IN ('SUPINE', 'SEATED', 'STANDING', 'COITAL')),
  completed_sets INT NOT NULL CHECK (completed_sets >= 0),
  target_sets INT NOT NULL DEFAULT 3 CHECK (target_sets > 0),
  max_arousal_reached INT CHECK (max_arousal_reached BETWEEN 1 AND 10),
  zero_parasitic_compensation BOOLEAN NOT NULL DEFAULT TRUE,
  duration_seconds INT NOT NULL CHECK (duration_seconds >= 0),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Logros Desbloqueados
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  achievement_code TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_code)
);

CREATE INDEX IF NOT EXISTS idx_clinical_assessments_user_week 
  ON public.clinical_assessments(user_id, week_number);

CREATE INDEX IF NOT EXISTS idx_training_sessions_user_week_day 
  ON public.training_sessions(user_id, week_number, day_number);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user 
  ON public.user_achievements(user_id);

ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own profile" ON public.patient_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Patients manage own assessments" ON public.clinical_assessments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Patients manage own sessions" ON public.training_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Patients manage own achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id);
