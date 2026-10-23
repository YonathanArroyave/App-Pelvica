'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
  Heart
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
    title: 'Molestia o Pesadez en la Entrepierna en Reposo',
    description: 'Sensación de contractura, dolor sordo o como si tuvieras una pelota de tenis entre los testículos y el ano al estar sentado.',
    clinicalNote: 'Indica que los músculos profundos están tensos incluso cuando estás descansando.'
  },
  {
    key: 'urinary_hesitancy',
    title: 'Dificultad o Demora al Comenzar a Orinar',
    description: 'Tardar varios segundos frente al inodoro antes de que salga el chorro, o notar que sale débil o con interrupciones.',
    clinicalNote: 'Ocurre cuando el esfínter está tan apretado que le cuesta abrirse voluntariamente.'
  },
  {
    key: 'post_ejaculatory_burning',
    title: 'Ardor o Tirón Después de Eyacular',
    description: 'Sensación de quemazón, molestia o fatiga en la zona íntima durante los minutos posteriores al orgasmo.',
    clinicalNote: 'Señal clásica de que el músculo pélvico se sobrecargó durante el espasmo eyaculatorio.'
  },
  {
    key: 'tenesmus',
    title: 'Sensación de Tensión o Presión en el Ano',
    description: 'Sentir que el ano está apretado de manera inconsciente, o sensación de querer evacuar sin necesidad real.',
    clinicalNote: 'El músculo del esfínter anal comparte las mismas fibras que el suelo pélvico.'
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
      {/* Guía Explicativa Amigable */}
      <div className="oled-card p-4 bg-gradient-to-br from-[#11141E] to-[#0D101A] border border-[#212838] flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-gray-300">
          <span className="font-bold text-white block">¿Por qué evaluamos esto primero?</span>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Existe el mito de que la eyaculación precoz siempre se debe a un músculo &quot;débil&quot;. En realidad, muchos hombres tienen el músculo <strong className="text-white">demasiado tenso o contracturado</strong>. Si obligamos a apretar un músculo ya contracturado, el problema empeora.
          </p>
          <p className="text-[11px] text-[#00E5FF] font-medium leading-relaxed">
            Marca si experimentas alguna de las siguientes sensaciones con regularidad:
          </p>
        </div>
      </div>

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
                  Tensión Muscular Detectada
                </span>
                <span className="text-[10px] bg-[#FF1744]/20 text-[#FF1744] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Ruta Protectora Activada
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                Tus respuestas indican que tu suelo pélvico acumula tensión constante. Para tu seguridad, tu programa comenzará con <strong>ejercicios de relajación y elongación (Kegel Inverso)</strong> para liberar la musculatura antes de realizar contracciones activas.
              </p>
              <div className="mt-2 text-[11px] text-gray-400 bg-[#090A0F]/60 p-2.5 rounded-lg border border-[#212838]">
                <strong>Beneficio para ti:</strong> Aprender a relajar el músculo reduce la urgencia eyaculatoria y previene molestias perineales.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[#00E676]/20 text-[#00E676] shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#00E676] block">Suelo Pélvico en Buen Tono</span>
            <span className="text-[11px] text-gray-400">
              No se detectaron contracturas basales. Podrás iniciar directamente con tonificación y control de resistencia.
            </span>
          </div>
        </div>
      )}

      {/* Tarjetas de Síntomas Seleccionables */}
      <div className="space-y-2.5">
        {SYMPTOM_DEFINITIONS.map((symptom) => {
          const isSelected = symptoms[symptom.key];
          return (
            <div
              key={symptom.key}
              onClick={() => toggleSymptom(symptom.key)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                isSelected
                  ? 'bg-[#FF1744]/10 border-[#FF1744] text-white shadow-md'
                  : 'bg-[#11141E] border-[#212838] text-gray-300 hover:border-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? 'bg-[#FF1744] border-[#FF1744] text-white'
                    : 'border-gray-500 bg-[#090A0F]'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold leading-tight text-white">
                    {symptom.title}
                  </h4>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {symptom.description}
                </p>
                <p className="text-[10px] text-gray-400 italic pt-0.5">
                  💡 {symptom.clinicalNote}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {showSaveButton && (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-11 rounded-xl bg-[#00E5FF] text-[#090A0F] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#00cce6] transition-colors cursor-pointer"
        >
          <span>Confirmar Estado Basal</span>
        </button>
      )}
    </div>
  );
}
