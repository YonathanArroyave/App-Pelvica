'use client';

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ShieldAlert,
  Sliders,
  Flame,
  EyeOff,
  ZapOff
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
      {/* Balance General del Sexual Tipping Point */}
      <div className="oled-card p-4 space-y-3 border border-[#212838]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#7C4DFF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Balance Sexual Tipping Point®
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              evaluation.netBalance >= 0
                ? 'bg-[#00E676]/20 text-[#00E676]'
                : 'bg-[#FF1744]/20 text-[#FF1744]'
            }`}
          >
            Balance Neto: {evaluation.netBalance > 0 ? `+${evaluation.netBalance}` : evaluation.netBalance}
          </span>
        </div>

        {/* Barra Visual de Balance Excitación vs. Inhibición */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#00E5FF] font-semibold">Excitatorios: {evaluation.totalExcitatory}/30</span>
            <span className="text-[#FF1744] font-semibold">Inhibitorios: {evaluation.totalInhibitory}/30</span>
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

        {/* Alerta de Bucle de Barlow si predominan factores inhibitorios */}
        {evaluation.requiresBarlowIntervention && (
          <div className="p-3 rounded-xl bg-[#7C4DFF]/10 border border-[#7C4DFF]/30 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#7C4DFF] shrink-0 mt-0.5" />
            <p className="text-gray-300 leading-relaxed text-[11px]">
              {evaluation.diagnosticRecommendation}
            </p>
          </div>
        )}
      </div>

      {/* Sliders: Factores Excitatorios (+) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
            Factores Excitatorios Somatosensoriales (+)
          </h3>
        </div>

        {/* Foco Sensorial */}
        <div className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-white">Focalización en Sensaciones Táctiles</span>
            <span className="font-bold text-[#00E5FF]">{matrix.excitatory.sensory_focus}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={matrix.excitatory.sensory_focus}
            onChange={(e) => updateExcitatory('sensory_focus', Number(e.target.value))}
            className="w-full accent-[#00E5FF] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-500">Capacidad de conectar con caricias y calor genital sin juicio.</p>
        </div>

        {/* Imaginería Erótica */}
        <div className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-white">Fantasía e Imaginería Erótica</span>
            <span className="font-bold text-[#00E5FF]">{matrix.excitatory.erotic_imagery}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={matrix.excitatory.erotic_imagery}
            onChange={(e) => updateExcitatory('erotic_imagery', Number(e.target.value))}
            className="w-full accent-[#00E5FF] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-500">Activación dopaminérgica mediante fantasías estimulantes placenteras.</p>
        </div>

        {/* Propiocepción Pélvica */}
        <div className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-white">Conciencia Propioceptiva Pélvica</span>
            <span className="font-bold text-[#00E5FF]">{matrix.excitatory.pelvic_awareness}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={matrix.excitatory.pelvic_awareness}
            onChange={(e) => updateExcitatory('pelvic_awareness', Number(e.target.value))}
            className="w-full accent-[#00E5FF] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-500">Percepción clara del músculo bulboesponjoso antes del punto de no retorno.</p>
        </div>
      </div>

      {/* Sliders: Factores Inhibitorios (-) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <ZapOff className="w-4 h-4 text-[#FF1744]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF1744]">
            Factores Inhibitorios / Bucle de Barlow (-)
          </h3>
        </div>

        {/* Ansiedad de Rendimiento */}
        <div className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-white">Ansiedad de Ejecución / Miedo a Fallar</span>
            <span className="font-bold text-[#FF1744]">{matrix.inhibitory.performance_anxiety}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={matrix.inhibitory.performance_anxiety}
            onChange={(e) => updateInhibitory('performance_anxiety', Number(e.target.value))}
            className="w-full accent-[#FF1744] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-500">Preocupación obsesiva por el tiempo transcurrido o la satisfacción ajena.</p>
        </div>

        {/* Espectadorismo */}
        <div className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-white">Espectadorismo (Spectatoring)</span>
            <span className="font-bold text-[#FF1744]">{matrix.inhibitory.spectatoring}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={matrix.inhibitory.spectatoring}
            onChange={(e) => updateInhibitory('spectatoring', Number(e.target.value))}
            className="w-full accent-[#FF1744] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-500">Observarse a sí mismo como un tercero crítico en lugar de sentir placer.</p>
        </div>

        {/* Hipervigilancia Simpática */}
        <div className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-white">Hipervigilancia Simpática / Tensión Somática</span>
            <span className="font-bold text-[#FF1744]">{matrix.inhibitory.sympathetic_hypervigilance}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={matrix.inhibitory.sympathetic_hypervigilance}
            onChange={(e) => updateInhibitory('sympathetic_hypervigilance', Number(e.target.value))}
            className="w-full accent-[#FF1744] h-2 bg-[#090A0F] rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-gray-500">Respiración superficial torácica y descarga adrenérgica involuntaria.</p>
        </div>
      </div>
    </div>
  );
}
