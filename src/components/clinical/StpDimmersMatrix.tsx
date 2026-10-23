'use client';

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldAlert,
  Info,
  Flame,
  EyeOff,
  ZapOff,
  HeartHandshake
} from 'lucide-react';
import { StpMatrix } from '@/core/types/clinical.types';
import { evaluateStpBalance } from '@/core/clinical/clinicalAssessmentEvaluator';

interface StpDimmersMatrixProps {
  initialMatrix?: StpMatrix;
  onChange?: (matrix: StpMatrix) => void;
  showSaveButton?: boolean;
}

export function StpDimmersMatrix({
  initialMatrix = {
    excitatory: {
      sensory_focus: 5,
      erotic_imagery: 5,
      pelvic_awareness: 5
    },
    inhibitory: {
      performance_anxiety: 7,
      spectatoring: 7,
      sympathetic_hypervigilance: 6
    }
  },
  onChange,
  showSaveButton = true
}: StpDimmersMatrixProps) {
  const [matrix, setMatrix] = useState<StpMatrix>(initialMatrix);

  const evaluation = evaluateStpBalance(matrix);

  const updateExcitatory = (key: keyof StpMatrix['excitatory'], val: number) => {
    const updated: StpMatrix = {
      ...matrix,
      excitatory: {
        ...matrix.excitatory,
        [key]: val
      }
    };
    setMatrix(updated);
    onChange?.(updated);
  };

  const updateInhibitory = (key: keyof StpMatrix['inhibitory'], val: number) => {
    const updated: StpMatrix = {
      ...matrix,
      inhibitory: {
        ...matrix.inhibitory,
        [key]: val
      }
    };
    setMatrix(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-6">
      {/* Guía Explicativa Amigable para el Paciente */}
      <div className="oled-card p-4 bg-gradient-to-br from-[#11141E] to-[#0D101A] border border-[#212838] space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              ¿Por qué te preguntamos esto?
            </h4>
            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
              El control de la eyaculación no es solo fuerza muscular; tu sistema nervioso y tu mente juegan un rol fundamental.
              Piensa en esto como una balanza:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20">
            <span className="font-bold text-[#00E5FF] block mb-0.5">✨ Factores de Placer (+)</span>
            <p className="text-gray-400 text-[10px] leading-tight">
              Te conectan con las sensaciones físicas reales y la propiocepción de tu cuerpo.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FF1744]/5 border border-[#FF1744]/20">
            <span className="font-bold text-[#FF1744] block mb-0.5">⚡ Factores de Tensión (-)</span>
            <p className="text-gray-400 text-[10px] leading-tight">
              La presión y la auto-observación aceleran el reflejo eyaculatorio involuntario.
            </p>
          </div>
        </div>
      </div>

      {/* Balance General del Sexual Tipping Point */}
      <div className="oled-card p-4 space-y-3 border border-[#212838]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#7C4DFF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Tu Balanza Mente-Cuerpo Actual
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              evaluation.netBalance >= 0
                ? 'bg-[#00E676]/20 text-[#00E676]'
                : 'bg-[#FF1744]/20 text-[#FF1744]'
            }`}
          >
            Balance: {evaluation.netBalance > 0 ? `+${evaluation.netBalance}` : evaluation.netBalance}
          </span>
        </div>

        {/* Barra Visual de Balance Excitación vs. Inhibición */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#00E5FF] font-semibold">Placer y Conexión: {evaluation.totalExcitatory}/30</span>
            <span className="text-[#FF1744] font-semibold">Estrés y Presión: {evaluation.totalInhibitory}/30</span>
          </div>
          <div className="h-3 w-full bg-[#090A0F] rounded-full overflow-hidden flex border border-[#212838]">
            <div
              className="bg-gradient-to-r from-[#00E5FF] to-[#00E676] h-full transition-all duration-300"
              style={{ width: `${(evaluation.totalExcitatory / 60) * 100}%` }}
            />
            <div
              className="bg-gradient-to-r from-[#7C4DFF] to-[#FF1744] h-full transition-all duration-300"
              style={{ width: `${(evaluation.totalInhibitory / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Mensaje de orientación si predominan factores de tensión */}
        {evaluation.requiresBarlowIntervention && (
          <div className="p-3 rounded-xl bg-[#7C4DFF]/10 border border-[#7C4DFF]/30 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#7C4DFF] shrink-0 mt-0.5" />
            <p className="text-gray-300 leading-relaxed text-[11px]">
              {evaluation.diagnosticRecommendation}
            </p>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 1: FACTORES DE PLACER Y CONEXIÓN SENSORIAL (+) */}
      {/* ===================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
            1. Factores de Placer y Conexión (+)
          </h3>
        </div>

        {/* Foco Sensorial */}
        <div className="oled-card p-4 space-y-2.5 border border-[#212838]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Conexión con las Sensaciones Físicas</span>
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
              {matrix.excitatory.sensory_focus} / 10
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed">
            ¿Qué tan fácil te resulta concentrarte en el tacto, las caricias y el calor genital sin que tu cabeza se distraiga?
          </p>

          <input
            type="range"
            min="1"
            max="10"
            value={matrix.excitatory.sensory_focus}
            onChange={(e) => updateExcitatory('sensory_focus', Number(e.target.value))}
            className="w-full accent-[#00E5FF] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>1: Me distraigo con facilidad</span>
            <span>5: A veces</span>
            <span>10: Conecto plenamente</span>
          </div>
        </div>

        {/* Imaginería Erótica */}
        <div className="oled-card p-4 space-y-2.5 border border-[#212838]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Deseo y Fantasía Erótica</span>
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
              {matrix.excitatory.erotic_imagery} / 10
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed">
            ¿Qué tan presente y fluido es tu deseo sexual durante el encuentro? (Tener pensamientos estimulantes y placenteros de forma natural).
          </p>

          <input
            type="range"
            min="1"
            max="10"
            value={matrix.excitatory.erotic_imagery}
            onChange={(e) => updateExcitatory('erotic_imagery', Number(e.target.value))}
            className="w-full accent-[#00E5FF] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>1: Deseo bajo o bloqueado</span>
            <span>5: Moderado</span>
            <span>10: Deseo activo y espontáneo</span>
          </div>
        </div>

        {/* Propiocepción Pélvica */}
        <div className="oled-card p-4 space-y-2.5 border border-[#212838]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Conciencia del Músculo Pélvico</span>
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
              {matrix.excitatory.pelvic_awareness} / 10
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed">
            ¿Sientes con claridad cuándo el músculo de tu suelo pélvico se empieza a tensar antes de llegar al punto de no retorno?
          </p>

          <input
            type="range"
            min="1"
            max="10"
            value={matrix.excitatory.pelvic_awareness}
            onChange={(e) => updateExcitatory('pelvic_awareness', Number(e.target.value))}
            className="w-full accent-[#00E5FF] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>1: No siento el músculo</span>
            <span>5: Lo noto vagamente</span>
            <span>10: Reconozco el momento exacto</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 2: FACTORES DE TENSIÓN Y PRESIÓN PSICOLÓGICA (-) */}
      {/* ===================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <ZapOff className="w-4 h-4 text-[#FF1744]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF1744]">
            2. Factores de Tensión y Ansiedad (-)
          </h3>
        </div>

        {/* Ansiedad de Rendimiento */}
        <div className="oled-card p-4 space-y-2.5 border border-[#212838]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Presión por el Rendimiento (Miedo a fallar)</span>
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#FF1744]/10 text-[#FF1744]">
              {matrix.inhibitory.performance_anxiety} / 10
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed">
            ¿Sientes preocupación constante por cuánto tiempo vas a durar o por si vas a defraudar a tu pareja?
          </p>

          <input
            type="range"
            min="1"
            max="10"
            value={matrix.inhibitory.performance_anxiety}
            onChange={(e) => updateInhibitory('performance_anxiety', Number(e.target.value))}
            className="w-full accent-[#FF1744] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>1: Cero presión, mente tranquila</span>
            <span>5: A veces me preocupa</span>
            <span>10: Preocupación constante</span>
          </div>
        </div>

        {/* Espectadorismo */}
        <div className="oled-card p-4 space-y-2.5 border border-[#212838]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Sentirte como un &quot;Espectador&quot; (Auto-vigilancia)</span>
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#FF1744]/10 text-[#FF1744]">
              {matrix.inhibitory.spectatoring} / 10
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed">
            En lugar de disfrutar el momento, ¿te descubres vigilándote o juzgándote desde afuera (&quot;¿cuánto tiempo llevo?&quot;, &quot;¿se me nota nervioso?&quot;)?
          </p>

          <input
            type="range"
            min="1"
            max="10"
            value={matrix.inhibitory.spectatoring}
            onChange={(e) => updateInhibitory('spectatoring', Number(e.target.value))}
            className="w-full accent-[#FF1744] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>1: Disfruto sin juzgarme</span>
            <span>5: Ocurre en ocasiones</span>
            <span>10: Me vigilo casi todo el tiempo</span>
          </div>
        </div>

        {/* Hipervigilancia Simpática */}
        <div className="oled-card p-4 space-y-2.5 border border-[#212838]">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Tensión Corporal y Respiración Acelerada</span>
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-[#FF1744]/10 text-[#FF1744]">
              {matrix.inhibitory.sympathetic_hypervigilance} / 10
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed">
            Durante la intimidad, ¿notas que aprietas el abdomen, los glúteos o que tu respiración se vuelve corta, rápida y superficial?
          </p>

          <input
            type="range"
            min="1"
            max="10"
            value={matrix.inhibitory.sympathetic_hypervigilance}
            onChange={(e) => updateInhibitory('sympathetic_hypervigilance', Number(e.target.value))}
            className="w-full accent-[#FF1744] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>1: Respiración lenta y cuerpo relajado</span>
            <span>5: Tensión moderada</span>
            <span>10: Muy acelerado y tenso</span>
          </div>
        </div>
      </div>
    </div>
  );
}
