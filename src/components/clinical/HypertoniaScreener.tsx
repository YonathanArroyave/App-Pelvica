'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { HypertoniaSymptoms } from '@/core/types/clinical.types';
import { evaluateHypertonia } from '@/core/clinical/clinicalAssessmentEvaluator';

interface HypertoniaScreenerProps {
  initialSymptoms?: HypertoniaSymptoms;
  onAssessmentComplete?: (symptoms: HypertoniaSymptoms, hasHypertonia: boolean) => void;
  showSaveButton?: boolean;
}

const SYMPTOM_DEFINITIONS: {
  key: keyof HypertoniaSymptoms;
  title: string;
  description: string;
  clinicalNote: string;
}[] = [
  {
    key: 'pelvic_pain',
    title: 'Dolor o Tensión Perineal en Reposo',
    description: 'Molestia, pesadez o contractura en la zona entre los testículos y el ano.',
    clinicalNote: 'Indica espasmo del elevador del ano o punto gatillo miofascial activo.'
  },
  {
    key: 'urinary_hesitancy',
    title: 'Micción Vacilante o Dificultad Inicial',
    description: 'Tardar varios segundos en iniciar el chorro de orina o chorro intermitente.',
    clinicalNote: 'Denota falta de relajación refleja del esfínter uretral externo.'
  },
  {
    key: 'post_ejaculatory_burning',
    title: 'Escozor o Ardor Post-Eyaculatorio',
    description: 'Sensación de quemazón o dolor urogenital durante o después del orgasmo.',
    clinicalNote: 'Signo clásico de sobrecarga fásica y atrapamiento del nervio pudendo.'
  },
  {
    key: 'tenesmus',
    title: 'Sensación de Tenesmo o Espasmo Anal',
    description: 'Sensación persistente de evacuación incompleta o calambres perianales.',
    clinicalNote: 'Hipertonía del haz puborrectal y del esfínter anal interno.'
  }
];

export function HypertoniaScreener({
  initialSymptoms = {
    pelvic_pain: false,
    urinary_hesitancy: false,
    post_ejaculatory_burning: false,
    tenesmus: false
  },
  onAssessmentComplete,
  showSaveButton = true
}: HypertoniaScreenerProps) {
  const [symptoms, setSymptoms] = useState<HypertoniaSymptoms>(initialSymptoms);

  const evaluation = evaluateHypertonia(symptoms);

  const toggleSymptom = (key: keyof HypertoniaSymptoms) => {
    const updated = {
      ...symptoms,
      [key]: !symptoms[key]
    };
    setSymptoms(updated);
    if (!showSaveButton) {
      const evalResult = evaluateHypertonia(updated);
      onAssessmentComplete?.(updated, evalResult.hasHypertonia);
    }
  };

  const handleConfirm = () => {
    onAssessmentComplete?.(symptoms, evaluation.hasHypertonia);
  };

  return (
    <div className="space-y-4">
      {/* Banner de Estado Clínico en Tiempo Real */}
      {evaluation.hasHypertonia ? (
        <div className="p-4 rounded-2xl bg-[#FF1744]/10 border border-[#FF1744]/40 glow-crimson animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#FF1744]/20 text-[#FF1744] shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-[#FF1744]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF1744]">
                  Bloqueador Clínico Activado
                </span>
                <span className="text-[10px] bg-[#FF1744]/20 text-[#FF1744] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Forzado Down-Training
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                {evaluation.clinicalRationale}
              </p>
              <div className="mt-2 text-[11px] text-gray-400 bg-[#090A0F]/60 p-2.5 rounded-lg border border-[#212838]">
                <strong>Acción inmediata:</strong> Se cancelan las contracciones fásicas/tónicas. Tu sesión consistirá en 10 minutos de <strong>Kegel Inverso con respiración diafragmática</strong> para evitar isquemia perineal.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 glow-emerald animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00E676]/20 text-[#00E676] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00E676]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00E676]">
                Tono Basal Normalizado
              </span>
              <p className="text-xs text-gray-300 mt-0.5">
                Cero signos de hipertonía perineal. Protocolo neuromuscular completo (Tónico + Fásico) habilitado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista Interactiva de Síntomas */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
          Cuestionario de Cribado de Tono (Selecciona si aplica):
        </p>

        {SYMPTOM_DEFINITIONS.map((def) => {
          const isChecked = symptoms[def.key];
          return (
            <div
              key={def.key}
              onClick={() => toggleSymptom(def.key)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isChecked
                  ? 'bg-[#FF1744]/10 border-[#FF1744]/50 shadow-md shadow-red-950/20'
                  : 'bg-[#11141E] border-[#212838] hover:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        isChecked ? 'text-[#FF1744]' : 'text-white'
                      }`}
                    >
                      {def.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    {def.description}
                  </p>
                  <p className="text-[10px] text-gray-500 italic mt-1">
                    Criterio: {def.clinicalNote}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isChecked
                      ? 'bg-[#FF1744] text-white shadow-sm'
                      : 'border border-gray-600 bg-[#090A0F]'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showSaveButton && (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <span>Confirmar y Calibrar Protocolo</span>
        </button>
      )}
    </div>
  );
}
