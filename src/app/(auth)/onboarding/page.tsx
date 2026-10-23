'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Heart,
  User,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { HypertoniaScreener } from '@/components/clinical/HypertoniaScreener';
import { PedtQuestionnaire } from '@/components/clinical/PedtQuestionnaire';
import { StpDimmersMatrix } from '@/components/clinical/StpDimmersMatrix';
import {
  HypertoniaSymptoms,
  StpMatrix
} from '@/core/types/clinical.types';
import { getProtocolForWeek } from '@/core/engine/clinicalProgressionRules';

type OnboardingStep = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const profile = usePatientStore((s) => s.profile);
  const setHasPartner = usePatientStore((s) => s.setHasPartner);
  const setHypertonia = usePatientStore((s) => s.setHypertonia);
  const recordAssessment = usePatientStore((s) => s.recordAssessment);

  const [step, setStep] = useState<OnboardingStep>(1);

  // Estados locales del Onboarding
  const [symptoms, setSymptoms] = useState<HypertoniaSymptoms>({
    pelvic_pain: false,
    urinary_hesitancy: false,
    post_ejaculatory_burning: false,
    tenesmus: false
  });
  const [hasHypertoniaDetected, setHasHypertoniaDetected] = useState(false);

  const [pedtScore, setPedtScore] = useState<number>(14);
  const [ieltSeconds, setIeltSeconds] = useState<number>(45);

  const [hasPartnerLocal, setHasPartnerLocal] = useState<boolean>(profile.has_partner);

  const [stpMatrix, setStpMatrix] = useState<StpMatrix>({
    excitatory: {
      sensory_focus: 5,
      erotic_imagery: 6,
      pelvic_awareness: 4
    },
    inhibitory: {
      performance_anxiety: 8,
      spectatoring: 7,
      sympathetic_hypervigilance: 7
    }
  });

  const nextStep = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as OnboardingStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as OnboardingStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishOnboarding = () => {
    // 1. Guardar en Store la evaluación diagnóstica basal (Semana 0)
    recordAssessment({
      week_number: 0,
      ielt_seconds: ieltSeconds,
      pedt_score: pedtScore,
      hypertonia_symptoms: symptoms,
      stp_matrix: stpMatrix
    });

    // 2. Establecer banderas de bifurcación
    setHypertonia(hasHypertoniaDetected);
    setHasPartner(hasPartnerLocal);

    // 3. Redirigir al Hub del Reto de 12 Semanas
    router.push('/');
  };

  const assignedProtocol = getProtocolForWeek(1, hasHypertoniaDetected);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F0F4F8] flex flex-col justify-between max-w-md mx-auto px-4 py-6">
      {/* Header con Indicador de Pasos Clínicos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#11141E] border border-[#212838] flex items-center justify-center text-[#00E5FF]">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide">
                Evaluación Clínica Basal
              </span>
              <p className="text-[10px] text-gray-400">Paso {step} de 4</p>
            </div>
          </div>

          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 p-1.5 rounded-lg bg-[#11141E] border border-[#212838]"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Volver
            </button>
          )}
        </div>

        {/* Barra de Progreso de 4 Pasos */}
        <div className="grid grid-cols-4 gap-1.5 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF]' : 'bg-[#181D2B]'
              }`}
            />
          ))}
        </div>

        {/* ========================================================================= */}
        {/* PASO 1: Bloqueador de Hipertonía (Seguridad Mandatoria) */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>1. Chequeo de Tensión en tu Suelo Pélvico</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Antes de iniciar, verificamos si tus músculos están relajados o contracturados. Si existe tensión excesiva, adaptaremos tu rutina para protegerte y evitar molestias.
              </p>
            </div>

            <HypertoniaScreener
              initialSymptoms={symptoms}
              showSaveButton={false}
              onAssessmentComplete={(updatedSymptoms, isHypertonic) => {
                setSymptoms(updatedSymptoms);
                setHasHypertoniaDetected(isHypertonic);
              }}
            />

            <button
              type="button"
              onClick={nextStep}
              className="w-full h-12 rounded-xl bg-[#00E5FF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00cce6] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Continuar a Medición de Control</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 2: Diagnóstico PEDT e IELT Basal */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>2. Tu Punto de Partida (Control y Tiempo)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Estas 5 preguntas clínicas nos permiten medir tu nivel de control actual y tu tiempo aproximado para comparar tus avances semana a semana.
              </p>
            </div>

            <PedtQuestionnaire
              initialIelt={ieltSeconds}
              showSubmitButton={false}
              onComplete={(score, sec) => {
                setPedtScore(score);
                setIeltSeconds(sec);
              }}
            />

            <button
              type="button"
              onClick={nextStep}
              className="w-full h-12 rounded-xl bg-[#00E5FF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00cce6] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Continuar a Factores Mentales</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 3: Factores STP y Modalidad de Pareja */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>3. Tu Mente, Tus Emociones y Tu Entorno</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                El control eyaculatorio es mente y cuerpo. La preocupación por el tiempo o la respiración superficial aceleran el reflejo involuntariamente.
              </p>
            </div>

            {/* Selector de Modalidad: Individual vs Con Pareja */}
            <div className="oled-card p-4 space-y-2 border border-[#212838]">
              <span className="text-xs font-semibold text-white block">
                ¿Cómo realizarás las prácticas avanzadas (semanas 7 a 12)?
              </span>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Las primeras 6 semanas son ejercicios individuales. En las semanas avanzadas (técnicas Stop-Start y Squeeze) podrás realizarlas de forma individual o en pareja.
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setHasPartnerLocal(false)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    !hasPartnerLocal
                      ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white shadow-sm'
                      : 'bg-[#090A0F] border-[#212838] text-gray-400'
                  }`}
                >
                  <User className="w-5 h-5 text-[#00E5FF]" />
                  <span>Ruta Solo (Individual)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHasPartnerLocal(true)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    hasPartnerLocal
                      ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white shadow-sm'
                      : 'bg-[#090A0F] border-[#212838] text-gray-400'
                  }`}
                >
                  <Users className="w-5 h-5 text-[#7C4DFF]" />
                  <span>Ruta en Pareja</span>
                </button>
              </div>
            </div>

            <StpDimmersMatrix
              initialMatrix={stpMatrix}
              showSaveButton={false}
              onChange={(updated) => setStpMatrix(updated)}
            />

            <button
              type="button"
              onClick={nextStep}
              className="w-full h-12 rounded-xl bg-[#00E5FF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00cce6] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Ver Mi Plan Personalizado</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 4: Resumen de Calibración Clínica y Activación */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#7C4DFF]/20 border border-[#00E5FF]/30 inline-flex items-center justify-center text-[#00E5FF] mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-white">
                ¡Tu Plan de 12 Semanas está Listo!
              </h2>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
                Hemos configurado tu rutina basándonos en tu tono muscular, tu tiempo actual y tu balance mente-cuerpo.
              </p>
            </div>

            {/* Resumen de Prescripción Asignada */}
            <div className="oled-card p-4 space-y-3 border border-[#00E5FF]/30">
              <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider block">
                Prescripción para Semanas 1 y 2
              </span>

              <div className="flex items-start gap-3">
                {hasHypertoniaDetected ? (
                  <ShieldAlert className="w-6 h-6 text-[#FF1744] shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-[#00E676] shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {assignedProtocol.phaseName}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {assignedProtocol.clinicalInstructions}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#212838] text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block">Posición</span>
                  <span className="font-semibold text-white">
                    {assignedProtocol.bodyPosition === 'SUPINE' ? 'Decúbito Supino' : 'Sedestación'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">IELT Basal</span>
                  <span className="font-semibold text-[#00E5FF]">{ieltSeconds}s</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Ruta</span>
                  <span className="font-semibold text-[#7C4DFF]">
                    {hasPartnerLocal ? 'En Pareja' : 'Solo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Banner de Neuroplasticidad */}
            <div className="oled-card p-3.5 bg-[#181D2B] border border-[#212838] flex items-center gap-3">
              <Award className="w-5 h-5 text-[#00E676] shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white">+100 XP de Inicio Clínico</span>
                <p className="text-gray-400 text-[11px]">
                  Diagnóstico basal registrado exitosamente en tu almacenamiento privado.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="w-full h-13 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-cyan-500/25 cursor-pointer glow-cyan"
            >
              <Flame className="w-5 h-5 fill-[#090A0F]" />
              <span>Activar Reto de 12 Semanas</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer confidencial */}
      <footer className="text-center text-[10px] text-gray-500 mt-6">
        Información médica cifrada localmente • Conforme a protocolos EAU / ISSM
      </footer>
    </div>
  );
}
