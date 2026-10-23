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
  Award,
  Lock,
  KeyRound,
  Mail,
  Shield,
  HardDrive
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
import { supabase } from '@/lib/supabase/client';

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export default function OnboardingPage() {
  const router = useRouter();
  const profile = usePatientStore((s) => s.profile);
  const setAlias = usePatientStore((s) => s.setAlias);
  const setPin = usePatientStore((s) => s.setPin);
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

  // Estados de Identidad y Seguridad (Paso 4)
  const [aliasInput, setAliasInput] = useState<string>(
    profile.alias === 'Paciente' ? '' : profile.alias
  );
  const [enablePin, setEnablePin] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [wantsCloudBackup, setWantsCloudBackup] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const nextStep = () => {
    // Si estamos en el paso de identidad y se activó PIN, validar coincidencia
    if (step === 4 && enablePin) {
      if (pinInput.length !== 4) {
        setPinError('El PIN debe tener exactamente 4 dígitos numéricos.');
        return;
      }
      if (pinInput !== confirmPinInput) {
        setPinError('Los PIN ingresados no coinciden.');
        return;
      }
      setPinError(null);
    }

    if (step < 5) {
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

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // 1. Guardar Nombre o Alias
      const chosenAlias = aliasInput.trim() || 'Paciente';
      setAlias(chosenAlias);

      // 2. Guardar PIN si se configuró
      if (enablePin && pinInput.length === 4 && pinInput === confirmPinInput) {
        await setPin(pinInput);
      }

      // 3. Respaldo en la nube opcional vía Magic Link
      if (wantsCloudBackup && emailInput.trim()) {
        try {
          await supabase.auth.signInWithOtp({
            email: emailInput.trim(),
            options: {
              emailRedirectTo:
                typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
            }
          });
        } catch {
          // Si falla conexión o Supabase no está configurado, fallback local silencioso
          console.warn('Modo local activo: los datos quedan guardados en este dispositivo.');
        }
      }

      // 4. Guardar evaluación diagnóstica basal (Semana 0)
      recordAssessment({
        week_number: 0,
        ielt_seconds: ieltSeconds,
        pedt_score: pedtScore,
        hypertonia_symptoms: symptoms,
        stp_matrix: stpMatrix
      });

      // 5. Establecer banderas clínicas de bifurcación
      setHypertonia(hasHypertoniaDetected);
      setHasPartner(hasPartnerLocal);

      // 6. Redirigir al Hub principal
      router.push('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  const assignedProtocol = getProtocolForWeek(1, hasHypertoniaDetected);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F0F4F8] flex flex-col justify-between max-w-md mx-auto px-4 py-6">
      {/* Header con Indicador de Pasos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#11141E] border border-[#212838] flex items-center justify-center text-[#00E5FF]">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide">
                Configuración del Reto 12 Semanas
              </span>
              <p className="text-[10px] text-gray-400">Paso {step} de 5</p>
            </div>
          </div>

          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-[#11141E] border border-[#212838]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          )}
        </div>

        {/* Barra de Progreso de 5 Pasos */}
        <div className="grid grid-cols-5 gap-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
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
        {/* PASO 2: Diagnóstico PEDT y Tiempo de Penetración (IELT) */}
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
        {/* PASO 3: Factores Mente-Cuerpo y Modalidad de Práctica */}
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
              <span>Continuar a Perfil y Privacidad</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 4: Tu Perfil, Identidad y Privacidad (NUEVO) */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>4. Tu Perfil y Privacidad</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Configura cómo te identificamos y protege tu información íntima para que nadie más pueda ver tu progreso.
              </p>
            </div>

            {/* 1. Nombre o Alias */}
            <div className="oled-card p-4 space-y-2 border border-[#212838]">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#00E5FF]" />
                ¿Cómo te gustaría que te llamemos?
              </label>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Puede ser tu nombre de pila o un alias discreto (ej. Alex, Carlos, Leo).
              </p>
              <input
                type="text"
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                placeholder="Escribe tu nombre o alias aquí..."
                className="w-full bg-[#090A0F] border border-[#212838] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors"
                maxLength={25}
              />
            </div>

            {/* 2. Protección con PIN Discreto de 4 Dígitos */}
            <div className="oled-card p-4 space-y-3 border border-[#212838]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#7C4DFF]/15 text-[#7C4DFF]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Bloqueo con PIN de 4 dígitos
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Evita que terceros abran la app si toman tu teléfono
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enablePin}
                    onChange={(e) => {
                      setEnablePin(e.target.checked);
                      if (!e.target.checked) setPinError(null);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#212838] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7C4DFF]"></div>
                </label>
              </div>

              {enablePin && (
                <div className="pt-2 border-t border-[#212838] space-y-2.5 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-gray-300 block mb-1">
                        PIN (4 dígitos):
                      </span>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full bg-[#090A0F] border border-[#212838] rounded-xl px-3 py-2 text-center text-sm font-mono text-white tracking-widest focus:outline-none focus:border-[#7C4DFF]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-gray-300 block mb-1">
                        Confirmar PIN:
                      </span>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full bg-[#090A0F] border border-[#212838] rounded-xl px-3 py-2 text-center text-sm font-mono text-white tracking-widest focus:outline-none focus:border-[#7C4DFF]"
                      />
                    </div>
                  </div>

                  {pinError && (
                    <p className="text-[11px] text-[#FF1744] font-medium animate-fadeIn">
                      ⚠️ {pinError}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 3. Dónde se guarda tu progreso (Offline-first & Nube) */}
            <div className="oled-card p-4 space-y-2.5 border border-[#212838]">
              <div className="flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-white block">
                    Guardado seguro en este dispositivo
                  </span>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Tus 12 semanas de entrenamiento y métricas se guardan de forma privada en la memoria de este teléfono o navegador (sin necesidad obligatoria de correo).
                  </p>
                </div>
              </div>

              {/* Opción de respaldo por correo */}
              <div className="pt-2 border-t border-[#212838]">
                <button
                  type="button"
                  onClick={() => setWantsCloudBackup(!wantsCloudBackup)}
                  className="text-[11px] text-[#00E5FF] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>
                    {wantsCloudBackup
                      ? 'Ocultar respaldo por correo'
                      : '¿Deseas respaldar también en la nube? (Opcional)'}
                  </span>
                </button>

                {wantsCloudBackup && (
                  <div className="mt-2 space-y-1.5 animate-fadeIn">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="tu-correo@ejemplo.com"
                      className="w-full bg-[#090A0F] border border-[#212838] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]"
                    />
                    <span className="text-[10px] text-gray-400 block">
                      Te enviaremos un enlace de acceso seguro sin contraseñas para recuperar tu progreso si cambias de teléfono.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full h-12 rounded-xl bg-[#00E5FF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00cce6] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Ver Resumen de Mi Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 5: Resumen de Calibración Clínica y Activación */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E5FF]/20 to-[#7C4DFF]/20 border border-[#00E5FF]/30 inline-flex items-center justify-center text-[#00E5FF] mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-white">
                ¡Tu Plan de 12 Semanas está Listo, {aliasInput.trim() || 'Paciente'}!
              </h2>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
                Hemos calibrado tu rutina inicial basándonos en tu tono muscular, tu tiempo actual y tu balance mental.
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

              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-[#212838] text-center text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block">Posición</span>
                  <span className="font-semibold text-white text-[11px]">
                    {assignedProtocol.bodyPosition === 'SUPINE' ? 'Acostado' : 'Sentado'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Tiempo Basal</span>
                  <span className="font-semibold text-[#00E5FF] text-[11px]">{ieltSeconds}s</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Ruta</span>
                  <span className="font-semibold text-[#7C4DFF] text-[11px]">
                    {hasPartnerLocal ? 'En Pareja' : 'Solo'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Privacidad</span>
                  <span className="font-semibold text-[#00E676] text-[11px]">
                    {enablePin ? 'PIN Activo' : 'Local'}
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
              disabled={isSubmitting}
              onClick={handleFinishOnboarding}
              className="w-full h-13 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-cyan-500/25 cursor-pointer glow-cyan disabled:opacity-50"
            >
              <Flame className="w-5 h-5 fill-[#090A0F]" />
              <span>{isSubmitting ? 'Iniciando Reto...' : 'Activar Reto de 12 Semanas'}</span>
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
