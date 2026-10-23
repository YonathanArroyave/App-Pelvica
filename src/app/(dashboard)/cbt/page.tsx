'use client';

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Flame,
  Zap,
  ZapOff,
  Wind,
  CheckCircle2,
  Award,
  ArrowRight,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { StpDimmersMatrix } from '@/components/clinical/StpDimmersMatrix';
import { sensoryEngine } from '@/core/engine/sensoryFeedbackEngine';
import { StpMatrix } from '@/core/types/clinical.types';

type CbtTab = 'STP_MATRIX' | 'BARLOW_LOOP' | 'SPECTATORING';

export default function CbtMobilePage() {
  const profile = usePatientStore((s) => s.profile);
  const addXp = usePatientStore((s) => s.addXp);
  const unlockAchievement = usePatientStore((s) => s.unlockAchievement);

  const [activeTab, setActiveTab] = useState<CbtTab>('STP_MATRIX');

  // Estado del ejercicio de respiración 4-7-8 de Barlow
  const [breathingPhase, setBreathingPhase] = useState<'IDLE' | 'INHALE' | 'HOLD' | 'EXHALE'>('IDLE');
  const [breathingSec, setBreathingSec] = useState<number>(0);
  const [cbtSessionSaved, setCbtSessionSaved] = useState<boolean>(false);

  // Matriz STP local
  const [stpMatrix, setStpMatrix] = useState<StpMatrix>({
    excitatory: {
      sensory_focus: 6,
      erotic_imagery: 6,
      pelvic_awareness: 5
    },
    inhibitory: {
      performance_anxiety: 6,
      spectatoring: 6,
      sympathetic_hypervigilance: 5
    }
  });

  // Ejecutor de respiración 4-7-8
  const startBreathingCycle = () => {
    setBreathingPhase('INHALE');
    sensoryEngine.playTone(440, 'sine', 300);

    let sec = 4;
    setBreathingSec(sec);

    const inhaleInterval = setInterval(() => {
      sec--;
      setBreathingSec(sec);
      if (sec <= 0) {
        clearInterval(inhaleInterval);
        // Fase RETENER (7 segundos)
        setBreathingPhase('HOLD');
        sensoryEngine.playTone(330, 'sine', 200);
        let holdSec = 7;
        setBreathingSec(holdSec);

        const holdInterval = setInterval(() => {
          holdSec--;
          setBreathingSec(holdSec);
          if (holdSec <= 0) {
            clearInterval(holdInterval);
            // Fase EXHALAR (8 segundos)
            setBreathingPhase('EXHALE');
            sensoryEngine.playTone(261.6, 'sine', 500);
            let exhaleSec = 8;
            setBreathingSec(exhaleSec);

            const exhaleInterval = setInterval(() => {
              exhaleSec--;
              setBreathingSec(exhaleSec);
              if (exhaleSec <= 0) {
                clearInterval(exhaleInterval);
                setBreathingPhase('IDLE');
                setBreathingSec(0);
              }
            }, 1000);
          }
        }, 1000);
      }
    }, 1000);
  };

  const handleCompleteCbtSession = () => {
    addXp(100);
    unlockAchievement('DOMINIO_COGNITIVO_STP');
    setCbtSessionSaved(true);
  };

  return (
    <div className="space-y-4 pt-1 animate-fadeIn pb-12">
      {/* Header del Módulo CBT-Mobile */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7C4DFF]/15 text-[#7C4DFF] flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <h1 className="text-base font-bold text-white">CBT-Mobile & STP</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Terapia Cognitivo-Conductual y Sexual Tipping Point®
          </p>
        </div>

        <span className="text-[10px] font-bold text-[#7C4DFF] bg-[#7C4DFF]/10 px-2.5 py-1 rounded-full border border-[#7C4DFF]/20 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> +100 XP por Sesión
        </span>
      </div>

      {/* Selector de Pestañas CBT */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#11141E] rounded-2xl border border-[#212838]">
        <button
          type="button"
          onClick={() => setActiveTab('STP_MATRIX')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'STP_MATRIX'
              ? 'bg-[#00E5FF] text-[#090A0F] shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sliders STP
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('BARLOW_LOOP')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'BARLOW_LOOP'
              ? 'bg-[#7C4DFF] text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Bucle Barlow
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('SPECTATORING')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'SPECTATORING'
              ? 'bg-[#00E676] text-[#090A0F] shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Espectadorismo
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: Matriz de Sliders STP (Perelman) */}
      {/* ========================================================================= */}
      {activeTab === 'STP_MATRIX' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="oled-card p-4 space-y-2 border border-[#212838]">
            <span className="text-xs font-bold text-white block">
              Modelo del Punto de Inflexión Sexual (STP)
            </span>
            <p className="text-xs text-gray-300 leading-relaxed">
              La respuesta eyaculatoria es el resultado neto de un balancín neurobiológico. Ajusta los deslizadores para visualizar cómo tus pensamientos inhibitorios aumentan la sobreactivación refleja.
            </p>
          </div>

          <StpDimmersMatrix
            initialMatrix={stpMatrix}
            showSaveButton={false}
            onChange={(m) => setStpMatrix(m)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: Desarticulación del Bucle de Barlow */}
      {/* ========================================================================= */}
      {activeTab === 'BARLOW_LOOP' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="oled-card p-4 space-y-3 border border-[#7C4DFF]/30">
            <div className="flex items-center gap-2 text-[#7C4DFF]">
              <ZapOff className="w-5 h-5" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                El Bucle Vicioso de Ansiedad (David Barlow)
              </h2>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              La anticipación del fracaso estimula el sistema nervioso simpático, provocando taquicardia, vasoconstricción y un disparo eyaculatorio reflejo acelerado.
            </p>

            {/* Fases del Bucle */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-[#090A0F] border border-[#212838]">
                <span className="text-[#00E5FF] font-bold block text-[11px]">1. Demanda de Desempeño:</span>
                <p className="text-gray-400 text-[11px] mt-0.5">&quot;Debo durar mucho tiempo o seré juzgado&quot;.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090A0F] border border-[#212838]">
                <span className="text-[#FFB300] font-bold block text-[11px]">2. Hipervigilancia Autocrítica:</span>
                <p className="text-gray-400 text-[11px] mt-0.5">Atención obsesiva en el reloj en vez de sentir placer corporal.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090A0F] border border-[#212838]">
                <span className="text-[#FF1744] font-bold block text-[11px]">3. Descarga Simpática Refleja:</span>
                <p className="text-gray-400 text-[11px] mt-0.5">Adrenalina estimula los centros toracolumbares eyaculatorios.</p>
              </div>
            </div>
          </div>

          {/* Herramienta Práctica: Respiración 4-7-8 para Desactivación Simpática */}
          <div className="oled-card p-5 text-center space-y-4 border border-[#212838]">
            <div className="flex items-center justify-center gap-2 text-[#00E676]">
              <Wind className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Ruptura Inmediata: Protocolo Vagal 4-7-8
              </h3>
            </div>
            <p className="text-xs text-gray-400 leading-snug max-w-xs mx-auto">
              Inhala en 4s, retén en 7s y exhala en 8s para activar el tono parasimpático y desactivar la adrenalina.
            </p>

            {/* Indicador Radial / Pulsante */}
            <div className="py-2 flex flex-col items-center justify-center">
              <div
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 ${
                  breathingPhase === 'INHALE'
                    ? 'border-[#00E5FF] scale-115 glow-cyan bg-[#00E5FF]/10'
                    : breathingPhase === 'HOLD'
                    ? 'border-[#7C4DFF] scale-115 glow-violet bg-[#7C4DFF]/10'
                    : breathingPhase === 'EXHALE'
                    ? 'border-[#00E676] scale-95 glow-emerald bg-[#00E676]/10'
                    : 'border-[#212838] bg-[#11141E]'
                }`}
              >
                <span className="text-2xl font-extrabold text-white font-mono">
                  {breathingSec > 0 ? `${breathingSec}s` : 'Listo'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 mt-0.5">
                  {breathingPhase === 'IDLE' && 'Iniciar'}
                  {breathingPhase === 'INHALE' && 'Inhala (4s)'}
                  {breathingPhase === 'HOLD' && 'Retén (7s)'}
                  {breathingPhase === 'EXHALE' && 'Exhala (8s)'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={startBreathingCycle}
              disabled={breathingPhase !== 'IDLE'}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-lg disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{breathingPhase !== 'IDLE' ? 'Ciclo Activo...' : 'Iniciar Ciclo de Desactivación'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 3: Neutralización del Espectadorismo (Spectatoring) */}
      {/* ========================================================================= */}
      {activeTab === 'SPECTATORING' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="oled-card p-4 space-y-3 border border-[#212838]">
            <div className="flex items-center gap-2 text-[#00E676]">
              <EyeOff className="w-5 h-5 text-[#00E676]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Eliminar el Rol de &quot;Espectador Crítico&quot;
              </h2>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              El espectadorismo consiste en mirarse desde afuera durante el sexo, evaluando constantemente la erección o el tiempo. Esta división de la atención elimina las sensaciones eróticas reales.
            </p>

            <div className="p-3 rounded-xl bg-[#090A0F] border border-[#212838] space-y-2">
              <span className="text-[11px] font-bold text-[#00E5FF] block">
                Técnica de Reanclaje Somatosensorial Inmediato:
              </span>
              <ul className="text-[11px] text-gray-300 space-y-1.5 list-disc pl-4">
                <li>
                  <strong>Tacto Puro:</strong> Siente la temperatura exacta de la piel de tu pareja bajo la yema de tus dedos.
                </li>
                <li>
                  <strong>Respiración Sincronizada:</strong> Coordina tu inhalación con la suya sin hablar.
                </li>
                <li>
                  <strong>Aceptación:</strong> Si notas que estás evaluando cuánto vas a durar, di mentalmente: <em>&quot;Observo mi pensamiento y regreso a la textura de sus manos&quot;</em>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Guardar Sesión CBT y Acreditar Neuroplasticidad */}
      {!cbtSessionSaved ? (
        <button
          type="button"
          onClick={handleCompleteCbtSession}
          className="w-full h-12 rounded-xl bg-[#11141E] border border-[#00E676]/40 text-[#00E676] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#00E676]/10 active:scale-[0.99] transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Registrar Sesión CBT (+100 XP Neuroplasticidad)</span>
        </button>
      ) : (
        <div className="p-3 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 text-center text-xs text-[#00E676] font-bold flex items-center justify-center gap-2">
          <Award className="w-4 h-4" />
          <span>¡Sesión Cognitiva Registrada! +100 XP Acreditados</span>
        </div>
      )}
    </div>
  );
}
