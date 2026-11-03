// ==============================================================================
// Persistent Patient Store (Zustand + Local Storage / IndexedDB Sync)
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Offline-First, Clinical State Invariants, Safe Medical Defaults
// ==============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  PatientProfile,
  ClinicalAssessment,
  TrainingSession,
  HypertoniaSymptoms,
  StpMatrix
} from '../types/clinical.types';
import { hashPin } from '@/lib/utils';

interface PatientState {
  // Estado del Perfil
  profile: PatientProfile;
  isLocked: boolean;
  isHydrated: boolean;

  // Historial Clínico Local (Offline-first)
  assessments: ClinicalAssessment[];
  trainingSessions: TrainingSession[];
  unlockedAchievements: string[];

  // Acciones de Autenticación y PIN Local
  setAlias: (alias: string) => void;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  removePin: () => void;
  lockApp: () => void;
  unlockApp: () => void;
  setHydrated: (val: boolean) => void;

  // Acciones Clínicas y Algorítmicas
  setHypertonia: (hasHypertonia: boolean) => void;
  setHasPartner: (hasPartner: boolean) => void;
  recordAssessment: (assessment: Omit<ClinicalAssessment, 'id' | 'user_id' | 'recorded_at'>) => void;
  recordTrainingSession: (session: Omit<TrainingSession, 'id' | 'user_id' | 'completed_at'>) => void;
  advanceDay: () => void;
  useGraceToken: () => boolean;
  addXp: (amount: number) => void;
  unlockAchievement: (code: string) => boolean;
  importBackupData: (data: any) => boolean;
  resetProgress: () => void;
}

const DEFAULT_PROFILE: PatientProfile = {
  id: 'local_patient_001',
  alias: 'Paciente',
  pin_hash: null,
  has_partner: false,
  has_hypertonia: false,
  current_week: 1,
  current_day: 1,
  current_streak: 0,
  longest_streak: 0,
  grace_tokens_remaining: 1,
  neuroplasticity_xp: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      isLocked: false,
      isHydrated: false,
      assessments: [],
      trainingSessions: [],
      unlockedAchievements: [],

      setHydrated: (val: boolean) => set({ isHydrated: val }),

      setAlias: (alias: string) =>
        set((state) => ({
          profile: { ...state.profile, alias, updated_at: new Date().toISOString() }
        })),

      setPin: async (pin: string) => {
        const hash = await hashPin(pin);
        set((state) => ({
          profile: { ...state.profile, pin_hash: hash, updated_at: new Date().toISOString() }
        }));
      },

      verifyPin: async (pin: string) => {
        const storedHash = get().profile.pin_hash;
        if (!storedHash) {
          set({ isLocked: false });
          return true;
        }
        const inputHash = await hashPin(pin);
        const isValid = storedHash === inputHash;
        if (isValid) {
          set({ isLocked: false });
        }
        return isValid;
      },

      removePin: () =>
        set((state) => ({
          profile: { ...state.profile, pin_hash: null, updated_at: new Date().toISOString() },
          isLocked: false
        })),

      lockApp: () => {
        if (get().profile.pin_hash) {
          set({ isLocked: true });
        }
      },

      unlockApp: () => set({ isLocked: false }),

      setHypertonia: (hasHypertonia: boolean) =>
        set((state) => ({
          profile: {
            ...state.profile,
            has_hypertonia: hasHypertonia,
            updated_at: new Date().toISOString()
          }
        })),

      setHasPartner: (hasPartner: boolean) =>
        set((state) => ({
          profile: {
            ...state.profile,
            has_partner: hasPartner,
            updated_at: new Date().toISOString()
          }
        })),

      recordAssessment: (data) => {
        const newAssessment: ClinicalAssessment = {
          ...data,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `assessment_${Date.now()}`,
          user_id: get().profile.id,
          recorded_at: new Date().toISOString()
        };

        // Regla no negociable: Si hay síntomas de hipertonía, activar flag protector
        const hasHypertoniaDetected = Object.values(data.hypertonia_symptoms).some(Boolean);

        set((state) => ({
          assessments: [newAssessment, ...state.assessments],
          profile: {
            ...state.profile,
            has_hypertonia: hasHypertoniaDetected || state.profile.has_hypertonia,
            updated_at: new Date().toISOString()
          }
        }));
      },

      recordTrainingSession: (sessionData) => {
        const newSession: TrainingSession = {
          ...sessionData,
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `session_${Date.now()}`,
          user_id: get().profile.id,
          completed_at: new Date().toISOString()
        };

        const currentStreak = get().profile.current_streak + 1;
        const longestStreak = Math.max(currentStreak, get().profile.longest_streak);
        const xpEarned = 100 + (sessionData.zero_parasitic_compensation ? 25 : 0);

        set((state) => ({
          trainingSessions: [newSession, ...state.trainingSessions],
          profile: {
            ...state.profile,
            current_streak: currentStreak,
            longest_streak: longestStreak,
            neuroplasticity_xp: state.profile.neuroplasticity_xp + xpEarned,
            updated_at: new Date().toISOString()
          }
        }));

        // Desbloqueo de logros por hitos
        if (get().profile.current_week >= 2 && sessionData.zero_parasitic_compensation) {
          get().unlockAchievement('AISLAMIENTO_PURO_W2');
        }
        if (get().profile.current_week >= 6) {
          get().unlockAchievement('RESISTENCIA_TONICA_W6');
        }
        if (get().profile.current_week >= 12) {
          get().unlockAchievement('SINCRONIA_COITAL_W12');
        }
      },

      advanceDay: () => {
        const { current_day, current_week } = get().profile;
        if (current_day < 7) {
          set((state) => ({
            profile: {
              ...state.profile,
              current_day: current_day + 1,
              updated_at: new Date().toISOString()
            }
          }));
        } else {
          // Nueva semana clínica: Avanza de semana y regenera 1 Grace Token (máximo 3)
          set((state) => ({
            profile: {
              ...state.profile,
              current_week: Math.min(current_week + 1, 13),
              current_day: 1,
              grace_tokens_remaining: Math.min(state.profile.grace_tokens_remaining + 1, 3),
              updated_at: new Date().toISOString()
            }
          }));
        }
      },

      useGraceToken: () => {
        const { grace_tokens_remaining } = get().profile;
        if (grace_tokens_remaining > 0) {
          set((state) => ({
            profile: {
              ...state.profile,
              grace_tokens_remaining: grace_tokens_remaining - 1,
              updated_at: new Date().toISOString()
            }
          }));
          return true;
        }
        return false;
      },

      addXp: (amount: number) =>
        set((state) => ({
          profile: {
            ...state.profile,
            neuroplasticity_xp: state.profile.neuroplasticity_xp + amount,
            updated_at: new Date().toISOString()
          }
        })),

      unlockAchievement: (code: string) => {
        const current = get().unlockedAchievements;
        if (!current.includes(code)) {
          set({ unlockedAchievements: [...current, code] });
          return true;
        }
        return false;
      },

      importBackupData: (data: any) => {
        if (!data || !data.profile) return false;
        try {
          set({
            profile: {
              ...DEFAULT_PROFILE,
              ...data.profile,
              updated_at: new Date().toISOString()
            },
            assessments: Array.isArray(data.assessments) ? data.assessments : [],
            trainingSessions: Array.isArray(data.trainingSessions) ? data.trainingSessions : [],
            unlockedAchievements: Array.isArray(data.unlockedAchievements) ? data.unlockedAchievements : [],
            isLocked: false
          });
          return true;
        } catch {
          return false;
        }
      },

      resetProgress: () =>
        set({
          profile: {
            ...DEFAULT_PROFILE,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          assessments: [],
          trainingSessions: [],
          unlockedAchievements: [],
          isLocked: false
        })
    }),
    {
      name: 'pelvic_rehab_patient_storage_v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          // Si tiene PIN configurado, arranca bloqueado por privacidad
          if (state.profile?.pin_hash) {
            state.lockApp();
          }
        }
      }
    }
  )
);
