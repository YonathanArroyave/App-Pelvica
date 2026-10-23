## project_name: "pelvic-rehab-12w-pwa"
architecture: "Next.js App Router (PWA Mobile-First)"
primary_theme: "#090A0F (OLED Pure Dark)"
target_fps: 60
clinical_protocol: "12-Week Progressive Neuromuscular PFMT + Sexological CBT (STP Model)"
agent_execution_mode: "autonomous_step_by_step"
harness_framework: "affaan-m/ecc (Everything Claude Code / Universal Agent Harness)"

# Especificación Técnica y Blueprint de Ingeniería (Agent-Ready PRD)

**Proyecto:** Web App PWA Mobile-First para Rehabilitación Pélvica Neuromuscular y Salud Sexual Masculina (Reto Clínico de 12 Semanas)

## 1. Directivas del Sistema para Antigravity (Reglas de Oro)

Actúa como un Arquitecto de Software Principal e Ingeniero Frontend/Fullstack Senior operando bajo el arnés de alto rendimiento **ECC (`affaan-m/ecc`)**. Tu objetivo es construir una Aplicación Web Progresiva (PWA) *mobile-first* centrada en que el paciente complete el **Reto Clínico de 12 Semanas** para el tratamiento integral de la eyaculación precoz (EP) y la disfunción sexual masculina, integrando la reeducación neuromuscular del suelo pélvico (**PFMT**) con la terapia cognitivo-conductual sexológica (**CBT**) basada en el modelo del Punto de Inflexión Sexual (*Sexual Tipping Point®* o **STP**).

### Restricciones No Negociables

1. **Seguridad Clínica Automatizada (Bloqueador de Hipertonía):** Antes de habilitar cualquier rutina de fortalecimiento, el sistema evalúa el tono basal. Si el paciente presenta signos de hipertonía (dolor perineal, micción vacilante o escozor post-eyaculatorio), el sistema **bloquea por completo** las contracciones tónicas y fásicas y asigna exclusivamente el protocolo de *down-training* (Kegel inverso + respiración diafragmática).

2. **Ergonomía Mobile-First (Thumb-Zone de** $40\text{ mm}$**):** Todos los controles interactivos de alta frecuencia durante una sesión (*Iniciar*, *Pausar*, *Alerta de Nivel de Excitación* $7\text{--}8/10$, *Selector de Excitación* $1\text{--}10$) deben ubicarse estrictamente en los $40\text{ mm}$ inferiores de la pantalla para operarse con una sola mano.

3. **Privacidad y Modo Oscuro OLED (`#090A0F`):** Paleta predeterminada en negro puro (`#090A0F`) y grises profundos para máxima discreción visual, ahorro de batería en paneles OLED y cero deslumbramiento nocturno. Incluye bloqueo rápido con PIN local de 4 dígitos.

4. **Rendimiento a** $60\text{ FPS}$ **y Cero Latencia:** Escena 3D en Three.js / WebGL ultraligera (*low-poly* con deformación mediante *Vertex Shaders* en GLSL) y motor de cuentas regresivas determinista sincronizado con `Web Audio API`, `Navigator.vibrate` y `Screen Wake Lock API`.

## 2. Stack Tecnológico Requerido

* **Core & Framework:** Next.js (App Router), React 19, TypeScript estricto.

* **Soporte PWA & Offline-First:** `@serwist/next` (Service Worker con precarga de shaders, audio sintetizado y sincronización en segundo plano).

* **Estilos & Componentes UI:** Tailwind CSS + `shadcn/ui` (tema personalizado `#090A0F`) + `framer-motion` (transiciones de fase y desbloqueo de logros) + `lucide-react`.

* **Renderizado 3D:** `three`, `@react-three/fiber`, `@react-three/drei` (Shaders GLSL personalizados).

* **Estado Global & Persistencia:** `zustand` con middleware `persist` sobre `IndexedDB` (`idb-keyval` o `dexie`) para garantizar funcionamiento offline y sincronización con base de datos remota.

* **Autenticación y Base de Datos (Backend-as-a-Service):** **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) para Login básico discreto (Email/Password o Magic Link con alias anónimo) y PostgreSQL con *Row Level Security* (RLS).

* **Visualización Clínica:** `recharts` para gráficas evolutivas de IELT, puntaje PEDT, adherencia al reto de 12 semanas y balance de factores STP.

## 3. Arquitectura de Módulos y Árbol de Directorios

### 3.1. Diagrama de los 6 Espacios Funcionales

```
+-----------------------------------------------------------------------------+
|                         ARQUITECTURA DE MODULOS PWA                         |
+------------------------------+------------------------------+---------------+
| 1. Evaluador & Screening     | 2. Gym Pelvico Neuromuscular | 3. CBT-Mobile |
|    - PEDT / IELT Basal       |    - Tonico / Fasico         |    - Perfil   |
|    - Screening Hipertonia    |    - Kegel Inverso (Down)    |      STP      |
+------------------------------+------------------------------+---------------+
| 4. Modulo de Pareja / Solo   | 5. Seguimiento & Gamificacion| 6. EduSalud   |
|    - Sensate Focus I y II    |    - Graficos IELT / PEDT    |    - PFMT vs  |
|    - Stop-Start / Squeeze    |    - Reto 12 Semanas y Logros|      Dapox.   |
+------------------------------+------------------------------+---------------+

```

### 3.2. Estructura de Archivos del Proyecto

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx               # Login basico discreto + PIN local de 4 digitos
│   │   └── onboarding/page.tsx          # Modulo 1: Screening Hipertonia, PEDT, IELT, STP
│   ├── (dashboard)/
│   │   ├── layout.tsx                   # Shell Mobile-First + Bottom Nav en Thumb-Zone
│   │   ├── page.tsx                     # Hub Central del Reto de 12 Semanas (Progreso y Racha)
│   │   ├── gym/page.tsx                 # Modulos 2 y 4: Temporizador + Escena 3D + Modo Pareja
│   │   ├── cbt/page.tsx                 # Modulo 3: Sliders STP, Bucle de Barlow y Spectatoring
│   │   ├── tracking/page.tsx            # Modulo 5: Seguimiento al Paciente, IELT/PEDT y Logros
│   │   └── edusalud/page.tsx            # Modulo 6: Evidencia Comparativa (PFMT vs. Dapoxetina)
│   ├── manifest.ts                      # Manifiesto PWA instalable
│   └── globals.css                      # Variables OLED #090A0F y utilidades Thumb-Zone
├── components/
│   ├── canvas3d/
│   │   ├── PelvicMeshScene.tsx          # Lienzo R3F optimizado a 60 FPS
│   │   ├── PartnerDualGuide.tsx         # Vista dual Varon/Pareja (Stop-Start y Squeeze)
│   │   └── shaders/pelvicKinematic.ts   # Vertex y Fragment Shaders GLSL
│   ├── timer/
│   │   ├── SvgTimerRing.tsx             # Anillo radial SVG de grosor dinamico
│   │   └── ThumbZoneControls.tsx        # Controles inferiores (40mm) + Excitacion 1-10
│   ├── clinical/
│   │   ├── HypertoniaScreener.tsx       # Algoritmo de seguridad de tono basal
│   │   ├── PedtQuestionnaire.tsx        # Herramienta validada PEDT + registro IELT
│   │   ├── StpDimmersMatrix.tsx         # Matriz de Sliders excitatorios (+) e inhibitorios (-)
│   │   └── PatientMetricsChart.tsx      # Evolucion clinica del paciente (Recharts)
│   └── gamification/
│       ├── TwelveWeekRoadmap.tsx        # Mapa interactivo de las 12 semanas
│       └── AchievementBadges.tsx        # Tarjetas de logros y barra de neuroplasticidad
├── core/
│   ├── engine/
│   │   ├── timerStateMachine.ts         # Maquina de estados finitos determinista
│   │   ├── sensoryFeedbackEngine.ts     # Web Audio API + Haptica + Screen Wake Lock
│   │   └── clinicalProgressionRules.ts  # Parametrizacion exacta Semanas 1 a 12 + Bifurcacion
│   ├── store/
│   │   └── usePatientStore.ts           # Estado global Zustand + persistencia IndexedDB
│   └── types/
│       └── clinical.types.ts            # Contratos e interfaces TypeScript
└── lib/
    └── supabase/
        ├── client.ts                    # Cliente navegador Supabase
        └── schema.sql                   # Script DDL PostgreSQL + RLS

```

## 4. Esquema de Base de Datos y Login Básico (`schema.sql`)

Ejecutar en Supabase SQL Editor. Implementa autenticación básica vinculada a `auth.users`, seguimiento longitudinal del paciente, registro de sesiones y desbloqueo de logros.

```
-- 1. Tabla de Perfiles Clinicos y Progreso del Reto de 12 Semanas
CREATE TABLE public.patient_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  alias TEXT NOT NULL DEFAULT 'Paciente',
  pin_hash TEXT, -- PIN opcional de 4 digitos para bloqueo rapido de privacidad
  has_partner BOOLEAN NOT NULL DEFAULT FALSE,
  has_hypertonia BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE bloquea Kegel activo y fuerza Down-Training
  current_week INT NOT NULL DEFAULT 1 CHECK (current_week BETWEEN 1 AND 13), -- 13 = Modo Mantenimiento
  current_day INT NOT NULL DEFAULT 1 CHECK (current_day BETWEEN 1 AND 7),
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  grace_tokens_remaining INT NOT NULL DEFAULT 1, -- Escudo semanal para evitar abandono por ansiedad
  neuroplasticity_xp INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Evaluaciones Clinicas Longitudinales (Seguimiento al Paciente)
CREATE TABLE public.clinical_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number BETWEEN 0 AND 12),
  ielt_seconds NUMERIC(6,2) NOT NULL, -- <= 60s define eyaculacion precoz primaria
  pedt_score INT NOT NULL CHECK (pedt_score BETWEEN 0 AND 20),
  hypertonia_symptoms JSONB NOT NULL DEFAULT '{
    "pelvic_pain": false,
    "urinary_hesitancy": false,
    "post_ejaculatory_burning": false,
    "tenesmus": false
  }',
  stp_matrix JSONB NOT NULL DEFAULT '{
    "excitatory": {"sensory_focus": 5, "erotic_imagery": 5, "pelvic_awareness": 5},
    "inhibitory": {"performance_anxiety": 7, "spectatoring": 7, "sympathetic_hypervigilance": 6}
  }',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Sesiones Entrenadas (Adherencia Diaria y Biomecanica)
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  day_number INT NOT NULL,
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
  completed_sets INT NOT NULL,
  target_sets INT NOT NULL DEFAULT 3,
  max_arousal_reached INT CHECK (max_arousal_reached BETWEEN 1 AND 10),
  zero_parasitic_compensation BOOLEAN NOT NULL DEFAULT TRUE, -- Cero activacion de gluteos/aductores/abdomen
  duration_seconds INT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Logros Desbloqueados (Gamificacion Terapeutica)
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  achievement_code TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_code)
);

-- Politicas Row Level Security (RLS) para privacidad medica estricta
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

```

## 5. Reglas Clínicas de los 6 Módulos y Algoritmo de las 12 Semanas

### 5.1. Especificación Funcional por Módulo

1. **Módulo 1 (Evaluador Clínico y Cribado):**

   * **Cuestionarios Validados:** Calcula el *Premature Ejaculation Diagnostic Tool* (**PEDT**, escala $0\text{--}20$) y registra el *Intravaginal Ejaculatory Latency Time* (**IELT**) basal en segundos ($\text{IELT} \le 60\text{ s}$ clasifica EP primaria).

   * **Examen de "Sex Status" y Mapeo STP:** Evalúa factores biológicos, psicológicos, relacionales y culturales.

   * **Algoritmo Bloqueador de Hipertonía:** Si cualquier síntoma de `hypertonia_symptoms` es `true`, el sistema establece `has_hypertonia = true`, bloquea los ejercicios de contracción y activa exclusivamente el protocolo de *down-training* (Kegel inverso de $10\text{ minutos}$ con respiración diafragmática) para prevenir espasmos o isquemia perineal.

2. **Módulo 2 (Gimnasio Neuromuscular Interactivo):**

   * **Aislamiento Propioceptivo:** Entrena la maniobra de "cierre y elevación" de los músculos pubococcígeo, bulboesponjoso e isquiocavernoso. Incluye alerta pre/post serie para verificar **cero contracción parasitaria** de glúteos, aductores o rectos abdominales (evitando aumentos nocivos de presión intraabdominal).

   * **Fisiología Mixta:**

     * *Contracciones Tónicas (Fibras Tipo I - Pubococcígeo):* Sostén mantenido para resistencia tónica.

     * *Contracciones Fásicas (Fibras Tipo II - Bulboesponjoso / Isquiocavernoso):* Contracciones explosivas de $1\text{ segundo}$ para reactividad refleja y cierre uretral/eyaculatorio.

     * *Kegel Inverso (Down-Training):* Elongación caudal de la placa del elevador del ano coordinada con inspiración diafragmática para restaurar la longitud de reposo de las sarcómeras.

3. **Módulo 3 (CBT-Mobile y Modelo STP):**

   * **Ruptura del Bucle de Barlow:** Ejercicios cognitivos para interrumpir el ciclo de hipervigilancia, rumiación y descarga simpática vasoconstrictora.

   * **Neutralización del Espectadorismo (*Spectatoring*) y Pensamientos No Eróticos (PNE):** Tareas de atención focalizada para redirigir el foco mental desde la autoevaluación crítica hacia las sensaciones somatosensoriales eróticas.

   * **Matriz de "Sliders" STP:** Interfaz interactiva donde el paciente ajusta los deslizadores (*dimmers*) de sus factores excitatorios ($+$) e inhibitorios ($-$).

4. **Módulo 4 (Integración Progresiva de Pareja y Bifurcación Individual):**

   * **Regla de Inhibición de Ansiedad Previa:** Prohibida la participación de la pareja en las Semanas 1 y 2 para evitar exacerbar el espectadorismo y bloquear el aprendizaje propioceptivo central.

   * **Bifurcación Automática (`has_partner === false`):** Si el usuario no tiene pareja o reporta conflicto relacional agudo, el motor conmuta automáticamente las fases 3, 4 y 5 a la **Ruta de Reeducación Masturbatoria Individual** (*Stop-Start Solo* con masturbación no idiosincrásica).

5. **Módulo 5 (Seguimiento al Paciente, Progresión y Gamificación):**

   * **Curvas Clínicas:** Evolución del IELT (en segundos) y reducción del puntaje PEDT en las semanas $0, 4, 8\text{ y }12$.

   * **Gamificación de Neuroplasticidad:** Mapa desbloqueable de 12 semanas (84 días), racha diaria con *Grace Token* semanal y medallas clínicas.

6. **Módulo 6 (EduSalud - Evidencia Comparativa):**

   * Panel comparativo basado en los ensayos clínicos (Pastore et al. y RCTs) entre la rehabilitación pélvica (**PFMT**) y la **Dapoxetina** ($30\text{ mg} / 60\text{ mg}$).

### 5.2. Flujograma Determinista de las 12 Semanas

```
+-----------------------------------------------------------------------------+
|               FLUJOGRAMA DEL ALGORITMO CLINICO DE 12 SEMANAS                |
+-----------------------------------------------------------------------------+
| SEMANAS 1-2: Aislamiento Neuromuscular Individual (Decubito Supino)         |
|              - Screening Hipertonia --> [Si Hipertonia: Solo Down-Training] |
|              - 100% Individual (Sin pareja para prevenir ansiedad)          |
+-----------------------------------------------------------------------------+
| SEMANAS 3-6: Consolidacion Tonica/Fasica (Sedestacion)                      |
|              - Integracion Educativa Pasiva de la Pareja (Lecturas STP)     |
+-----------------------------------------------------------------------------+
| SEMANAS 7-8: Carga Dinamica (Bipedestacion) + Focalizacion Sensorial I      |
|              - Pareja: Caricias corporales no genitales (Sin exigencia)     |
|              - Individual: Reeducacion Masturbatoria (Stop-Start Solo 7/10) |
+-----------------------------------------------------------------------------+
| SEMANAS 9-10: Focalizacion Sensorial II + Stop-Start Asistido               |
|              - Estimulacion manual/oral por parte de la pareja              |
|              - Pausa tactil (30-45s) + Kegel Inverso al llegar a Nivel 7-8  |
+-----------------------------------------------------------------------------+
| SEMANAS 11-12: Transferencia a la Intimidad Coital + Squeeze + Mantenimiento|
|              - Coito pautado + Compresion (Squeeze 10-15s en Nivel 8/10)    |
|              - Maniobra de Knack + Reconfiguracion post-reto (3 series/sem) |
+-----------------------------------------------------------------------------+

```

### 5.3. Parametrización Exacta Semana a Semana (`clinicalProgressionRules.ts`)

```
// src/core/engine/clinicalProgressionRules.ts

export interface WeeklyProtocolSpec {
  phaseNumber: number;
  phaseName: string;
  weeks: number[];
  bodyPosition: 'SUPINE' | 'SEATED' | 'STANDING' | 'COITAL';
  dailySets: number;
  tonicSpecs: { reps: number; holdSec: number; restSec: number };
  phasicSpecs: { reps: number; holdSec: number; restSec: number };
  reverseKegelCyclesEndSet: number;
  partnerModality: 'EXCLUDED' | 'PASSIVE_EDU' | 'SENSATE_FOCUS_I' | 'PARTNER_STOP_START' | 'COITAL_SQUEEZE';
  clinicalInstructions: string;
}

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

```

## 6. Código Core: Máquina de Estados, APIs Sensoriales y Shaders 3D

### 6.1. Motor del Temporizador y Retroalimentación Multisensorial (`sensoryFeedbackEngine.ts`)

```
// src/core/engine/sensoryFeedbackEngine.ts

export type ExerciseMode =
  | 'INDIVIDUAL_TONIC'
  | 'INDIVIDUAL_PHASIC'
  | 'DOWN_TRAINING'
  | 'SOLO_STOP_START'
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

export interface TimerEngineConfig {
  mode: ExerciseMode;
  targetSets: number;
  targetRepsPerSet: number;
  contractionDurationSec: number;
  relaxationDurationSec: number;
  partnerPauseDurationSec: number; // 30-45s en Stop-Start, 10-15s en Squeeze
}

export interface CurrentTimerState {
  currentSet: number;
  currentRep: number;
  phase: ActivePhase;
  timeRemainingMs: number;
  normalizedProgress: number; // 0.0 a 1.0 para interpolar el Shader 3D y el Anillo SVG
  arousalLevel: number;       // Escala 1 - 10 controlada desde la Thumb-Zone
  isPaused: boolean;
  screenWakeLockActive: boolean;
}

export class SensoryFeedbackEngine {
  private audioCtx: AudioContext | null = null;
  private wakeLockSentinel: WakeLockSentinel | null = null;

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public triggerHaptic(phase: ActivePhase): void {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

    switch (phase) {
      case 'CONTRACTION':
        // Pulso suave de tensión guiada (50ms)
        navigator.vibrate([50]);
        break;
      case 'RELAXATION':
      case 'REVERSE_KEGEL':
        // Pulso doble largo de liberación muscular ([200ms, 100ms, 200ms])
        navigator.vibrate([200, 100, 200]);
        break;
      case 'PAUSE_STOP_START':
      case 'APPLY_SQUEEZE':
        // Alerta continua/doble firme para que la pareja detenga estimulación o aplique Squeeze
        navigator.vibrate([300, 100, 300]);
        break;
      default:
        break;
    }
  }

  public playTone(frequencyHz: number, type: OscillatorType = 'sine', durationMs: number = 300): void {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(frequencyHz, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  public async requestWakeLock(): Promise<boolean> {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) return false;
    try {
      this.wakeLockSentinel = await navigator.wakeLock.request('screen');
      return true;
    } catch {
      return false;
    }
  }

  public async releaseWakeLock(): Promise<void> {
    if (this.wakeLockSentinel) {
      await this.wakeLockSentinel.release();
      this.wakeLockSentinel = null;
    }
  }
}

```

### 6.2. Shaders GLSL de la Malla Pélvica 3D (`pelvicKinematic.ts`)

```
// src/components/canvas3d/shaders/pelvicKinematic.ts

export const pelvicVertexShader = /* glsl */ `
  uniform float uContractionFactor; // -1.0 (Kegel Inverso) | 0.0 (Reposo) | +1.0 (Contracción Máxima)
  varying vec3 vNormal;
  varying float vFactor;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vFactor = uContractionFactor;
    vec3 displacement = position;

    if (uContractionFactor >= 0.0) {
      // Fase Contracción: Vector de ascenso craneal (Y+) y estrechamiento interno (XZ-)
      displacement.y += normal.y * uContractionFactor * 0.35;
      displacement.xz -= normal.xz * uContractionFactor * 0.15;
    } else {
      // Fase Relajación / Kegel Inverso: Elongación descendente (Y-) y expansión lateral (XZ+)
      float downFactor = abs(uContractionFactor);
      displacement.y -= normal.y * downFactor * 0.25;
      displacement.xz += normal.xz * downFactor * 0.20;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacement, 1.0);
  }
`;

export const pelvicFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying float vFactor;

  void main() {
    vec3 cyanColor = vec3(0.0, 0.898, 1.0);      // #00E5FF (Base / Inicio tensión)
    vec3 violetColor = vec3(0.486, 0.302, 1.0);  // #7C4DFF (Contracción máxima)
    vec3 emeraldColor = vec3(0.0, 0.902, 0.463); // #00E676 (Kegel Inverso / Relajación)

    vec3 baseColor = vFactor >= 0.0
      ? mix(cyanColor, violetColor, clamp(vFactor, 0.0, 1.0))
      : mix(cyanColor, emeraldColor, clamp(abs(vFactor), 0.0, 1.0));

    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
    vec3 finalColor = mix(baseColor * 0.75, baseColor * 1.25, fresnel);

    gl_FragColor = vec4(finalColor, 0.92);
  }
`;

```

## 7. Gamificación, Logros y Cuadro Métrico de Evidencia (Módulos 5 y 6)

### 7.1. Catálogo de Logros del Reto de 12 Semanas

* `AISLAMIENTO_PURO_W2`: Completar la Fase 1 (Semanas 1–2) en decúbito supino con $100\%$ de sesiones libres de contracción parasitaria.

* `RESISTENCIA_TONICA_W6`: Superar la Fase 2 (Semana 6) sosteniendo contracciones tónicas de $8\text{ segundos}$ en sedestación.

* `DOMINIO_COGNITIVO_STP`: Completar 5 sesiones de reestructuración del Bucle de Barlow y ajuste de *Sliders* STP.

* `UMBRAL_7_CONTROLADO`: Ejecutar 6 sesiones exitosas de *Stop-Start* (Individual o en Pareja) deteniendo la excitación en el nivel $7\text{--}8/10$ con Kegel inverso.

* `SINCRONIA_COITAL_W12`: Completar el protocolo de las 12 semanas integrando la técnica *Squeeze* y la Maniobra de *Knack*, desbloqueando el **Modo Mantenimiento (**$3\text{ series/semana}$**)**.

### 7.2. Cuadro Métrico de Evidencia Clínica para `edusalud/page.tsx`

| Parámetro / Estudio Clínico | Grupo Fisioterapia Pélvica (PFMT) | Grupo Dapoxetina ($30\text{ mg} / 60\text{ mg}$) | Impacto a Largo Plazo en la PWA | 
| ----- | ----- | ----- | ----- | 
| **IELT Basal Medio** | $31.2\text{ a }31.7\text{ segundos}$ | $37.2\text{ a }37.8\text{ segundos}$ | Punto de partida clínico homogéneo. | 
| **IELT a las 12 Semanas** | $126.2\text{ a }146.2\text{ segundos}$ (Aumento $>4\times$) | $168.6\text{ s}$ ($30\text{ mg}$) / $222.5\text{ s}$ ($60\text{ mg}$) | Éxito clínico en el $57\%$ al $82\%$ de los pacientes con PFMT. | 
| **Mantenimiento a 5 Años** | $66\%$ **a** $81\%$ **mantiene el control** a los 24 y 60 meses | Reversión inmediata a valores basales al suspender el fármaco | Reorganización neuromuscular y reflexogénica duradera. | 
| **Efectos Adversos** | **Ninguno** (cero eventos registrados) | Náuseas, mareos, cefalea, diarrea | Tratamiento $100\%$ libre de toxicidad farmacológica. | 

## 8. Plan de Ejecución Secuencial para Antigravity (Checklist de Tareas)

Ejecuta la construcción del proyecto siguiendo estrictamente este orden y verificando cada bloque antes de avanzar al siguiente:

* [x] **Paso 1: Inicialización, Tema OLED `#090A0F` y Base de Datos**

  * [x] Inicializar aplicación Next.js con TypeScript, Tailwind CSS, Zustand, Recharts y React Three Fiber.

  * [x] Configurar `globals.css` con fondo `#090A0F`, tipografía legible de alto contraste y contenedor móvil con barra fija en los $40\text{ mm}$ inferiores (*Thumb-Zone*).

  * [x] Configurar cliente Supabase, ejecutar `schema.sql` y construir la vista `/login` (acceso discreto + bloqueo por PIN de 4 dígitos).

* [x] **Paso 2: Módulo 1 (Onboarding Clínico, PEDT/IELT y Bloqueador de Hipertonía)**

  * [x] Construir `HypertoniaScreener.tsx` y `PedtQuestionnaire.tsx`.

  * [x] Implementar la regla condicional: si `has_hypertonia === true`, bloquear modos de contracción y redirigir el plan diario a `DOWN_TRAINING`.

* [x] **Paso 3: Módulos 2 y 4 (Motor de Estados, APIs Sensoriales, Escena 3D y Modo Pareja)**

  * [x] Implementar `sensoryFeedbackEngine.ts` y la máquina de estados del temporizador.

  * [x] Construir `PelvicMeshScene.tsx` con los shaders GLSL, rodeado por `SvgTimerRing.tsx` y controlado desde `ThumbZoneControls.tsx` (incluyendo el selector de excitación $1\text{--}10$ y botón de pausa en nivel $7\text{--}8/10$).

  * [x] Construir `PartnerDualGuide.tsx` para la vista dividida Varón/Pareja en *Sensate Focus I/II*, *Partner Stop-Start* ($30\text{--}45\text{ s}$ de pausa) y *Squeeze* ($10\text{--}15\text{ s}$ de compresión).

* [x] **Paso 4: Módulo 3 (CBT-Mobile y Matriz STP)**

  * [x] Construir `StpDimmersMatrix.tsx` con deslizadores interactivos para factores excitatorios ($+$) e inhibitorios ($-$), y guías prácticas contra el Bucle de Barlow y el espectadorismo.

* \[ \] **Paso 5: Módulos 5 y 6 (Reto de 12 Semanas, Seguimiento al Paciente y EduSalud)**

  * \[ \] Conectar `clinicalProgressionRules.ts` con `TwelveWeekRoadmap.tsx` y `AchievementBadges.tsx` (incluyendo bifurcación automática a *Ruta Individual Solo* si `has_partner === false`).

  * \[ \] Construir `PatientMetricsChart.tsx` con las gráficas de evolución de IELT, PEDT y adherencia de 84 días, junto con la tabla comparativa de evidencia científica en `/edusalud`.

## 9. Orquestación del Ecosistema ECC (`affaan-m/ecc`) — Directivas de Skills, Agentes y Comandos

Este proyecto cuenta con el arnés de optimización **ECC (`affaan-m/ecc` - Everything Claude Code / Universal Agent Harness)** instalado. Durante todo el ciclo de vida del desarrollo (`plan -> test -> implement -> review -> verify -> remember -> improve`), el agente **DEBE** invocar proactivamente los sub-agentes, *skills*, *hooks* y comandos de ECC según corresponda a cada tarea:

### 9.1. Flujo de Trabajo Mandatorio con Comandos ECC

Para cada uno de los 5 pasos del Plan de Ejecución (Sección 8), ejecuta secuencialmente el ciclo PDCA de ECC:

1. **`/plan` (`planner` + `architect` agents):** Antes de escribir código en cada fase, descompón las subtareas, valida los contratos de estado y verifica que no se rompa la arquitectura *Mobile-First* ni las reglas clínicas.
2. **`/tdd` (`tdd-guide` agent + `tdd-workflow` skill):** Aplica desarrollo guiado por pruebas (cobertura objetivo $\ge 80\%$) de forma obligatoria en la lógica clínica crítica:
   * Algoritmo bloqueador de hipertonía (`HypertoniaScreener`).
   * Cálculo de puntajes PEDT, umbral IELT ($\le 60\text{ s}$) y matriz STP.
   * Máquina de estados finitos del temporizador (`timerStateMachine.ts`) y progresión de las 12 semanas (`clinicalProgressionRules.ts`).
3. **`/multi-frontend` y `/multi-backend`:** Enruta las tareas de interfaz 3D/UI y las de base de datos/RLS a sus flujos especializados.
4. **`/build-fix` (`build-error-resolver` agent):** Si aparecen errores de tipado en TypeScript, Next.js App Router o *shaders* de Three.js/WebGL, invoca este agente inmediatamente para repararlos de forma incremental.
5. **`/code-review` y `/security-review` (`code-reviewer` + `security-reviewer` + `AgentShield`):** Audita cada bloque antes de darlo por completado.
6. **`/verify` (`verification-loop` skill + `e2e-runner` agent):** Ejecuta la verificación integral del código y pruebas E2E al cerrar cada fase.
7. **`/checkpoint` y `/learn` (`strategic-compact` + `continuous-learning-v2` skills):** Al terminar cada uno de los 5 pasos del roadmap, guarda un punto de control, compacta el contexto estratégicamente para no saturar la ventana de tokens y extrae patrones aprendidos (*instincts*).

### 9.2. Matriz de Activación de Skills y Sub-Agentes ECC por Módulo del Proyecto

| Módulo / Componente de la PWA | Skills de ECC a Cargar (`skills/`) | Sub-Agentes de ECC (`agents/`) | Reglas e Invariantes Aplicadas (`rules/`) |
| ----- | ----- | ----- | ----- |
| **Arquitectura Base, Next.js PWA y Estado Offline (Zustand + IndexedDB)** | `frontend-patterns`, `coding-standards`, `strategic-compact` | `architect`, `planner` | Inmutabilidad, organización modular, manejo de errores tipado y carga diferida (*lazy loading*). |
| **Base de Datos Supabase, Auth Discreto y PIN Local de 4 Dígitos** | `postgres-patterns`, `backend-patterns`, `security-review` | `security-reviewer`, `architect` | Políticas RLS estrictas por `auth.uid()`, cero exposición de PII médica, hash seguro del PIN local y escaneo con **AgentShield**. |
| **Módulo 1: Cribado de Hipertonía, PEDT, IELT y Perfil STP** | `tdd-workflow`, `coding-standards`, `verification-loop` | `tdd-guide`, `code-reviewer` | Cobertura de tests $\ge 80\%$ en la regla de seguridad clínica: si `has_hypertonia === true`, bloqueo determinista de contracciones activas. |
| **Módulos 2 y 4: Motor del Temporizador, Web Audio, Háptica y Escena 3D WebGL** | `frontend-patterns`, `plankton-code-quality`, `verification-loop` | `build-error-resolver`, `code-reviewer` | Presupuesto estricto de $60\text{ FPS}$, malla $< 2500$ vértices, limpieza de memoria WebGL/AudioContext y ergonomía táctil en los $40\text{ mm}$ inferiores (*Thumb-Zone*). |
| **Módulos 3, 5 y 6: CBT-Mobile, Reto 12 Semanas, Gamificación y Recharts** | `frontend-patterns`, `tdd-workflow`, `continuous-learning-v2` | `tdd-guide`, `e2e-runner`, `refactor-cleaner` | Validación E2E de la bifurcación automática (`has_partner === false` $\rightarrow$ Ruta Individual Solo) y progresión exacta de la Semana 1 a la 12. |

### 9.3. Reglas de Gobernanza de Contexto y Calidad (ECC Runtime)

* **Carga Selectiva de Contexto (*Context Optimization*):** No cargues todas las *skills* en memoria simultáneamente; activa únicamente las *skills* listadas en la tabla 9.2 correspondientes al paso actual del checklist.
* **Puertas de Calidad Automáticas (*Quality Gates & Hooks*):** Respeta los *hooks* `PostToolUse` de ECC para *linting*, verificación de tipos (`tsc --noEmit`) y formato antes de marcar cualquier casilla `[x]` del Plan de Ejecución.
* **Seguridad Clínica y de Datos Primero:** Ningún cambio en el esquema de Supabase, autenticación o lógica de cribado pélvico puede darse por finalizado sin pasar por el agente `security-reviewer` y el flujo `/verify`.