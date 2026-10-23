'use client';

import React, { useState } from 'react';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Clock
} from 'lucide-react';
import {
  evaluatePedtScore,
  evaluateIelt
} from '@/core/clinical/clinicalAssessmentEvaluator';

interface PedtQuestionnaireProps {
  initialAnswers?: number[];
  initialIelt?: number;
  onComplete?: (pedtScore: number, ieltSeconds: number) => void;
  showSubmitButton?: boolean;
}

const PEDT_QUESTIONS = [
  {
    id: 1,
    question: '1. ¿Qué tan difícil te resulta retrasar o posponer la eyaculación?',
    options: [
      { label: 'Nada difícil', value: 0 },
      { label: 'Ligeramente difícil', value: 1 },
      { label: 'Moderadamente difícil', value: 2 },
      { label: 'Muy difícil', value: 3 },
      { label: 'Casi imposible', value: 4 }
    ]
  },
  {
    id: 2,
    question: '2. ¿Eyaculas antes de lo que tú deseas?',
    options: [
      { label: 'Casi nunca / Nunca (0%)', value: 0 },
      { label: 'Pocas veces (aprox. 25%)', value: 1 },
      { label: 'La mitad de las veces (50%)', value: 2 },
      { label: 'La mayoría de las veces (75%)', value: 3 },
      { label: 'Casi siempre / Siempre (100%)', value: 4 }
    ]
  },
  {
    id: 3,
    question: '3. ¿Eyaculas ante una estimulación mínima o muy leve?',
    options: [
      { label: 'Casi nunca / Nunca', value: 0 },
      { label: 'Pocas veces', value: 1 },
      { label: 'La mitad de las veces', value: 2 },
      { label: 'La mayoría de las veces', value: 3 },
      { label: 'Casi siempre / Siempre', value: 4 }
    ]
  },
  {
    id: 4,
    question: '4. ¿Te sientes frustrado o decepcionado por eyacular antes de desearlo?',
    options: [
      { label: 'Nada frustrado', value: 0 },
      { label: 'Ligeramente frustrado', value: 1 },
      { label: 'Moderadamente frustrado', value: 2 },
      { label: 'Muy frustrado', value: 3 },
      { label: 'Extremadamente frustrado', value: 4 }
    ]
  },
  {
    id: 5,
    question: '5. ¿Qué tanto te preocupa que tu tiempo eyaculatorio no satisfaga a tu pareja?',
    options: [
      { label: 'Nada preocupado', value: 0 },
      { label: 'Ligeramente preocupado', value: 1 },
      { label: 'Moderadamente preocupado', value: 2 },
      { label: 'Muy preocupado', value: 3 },
      { label: 'Extremadamente preocupado', value: 4 }
    ]
  }
];

export function PedtQuestionnaire({
  initialAnswers = [2, 3, 2, 3, 3],
  initialIelt = 45,
  onComplete,
  showSubmitButton = true
}: PedtQuestionnaireProps) {
  const [answers, setAnswers] = useState<number[]>(initialAnswers);
  const [ieltSeconds, setIeltSeconds] = useState<number>(initialIelt);

  const pedtEval = evaluatePedtScore(answers);
  const ieltEval = evaluateIelt(ieltSeconds);

  const handleSelectOption = (questionIndex: number, value: number) => {
    const updated = [...answers];
    updated[questionIndex] = value;
    setAnswers(updated);
    if (!showSubmitButton) {
      const evalScore = evaluatePedtScore(updated).score;
      onComplete?.(evalScore, ieltSeconds);
    }
  };

  const handleIeltChange = (sec: number) => {
    setIeltSeconds(sec);
    if (!showSubmitButton) {
      onComplete?.(pedtEval.score, sec);
    }
  };

  const handleSubmit = () => {
    onComplete?.(pedtEval.score, ieltSeconds);
  };

  return (
    <div className="space-y-6">
      {/* Resumen Clínico Diagnóstico en Tiempo Real */}
      <div className="grid grid-cols-2 gap-3">
        {/* PEDT Score */}
        <div className="oled-card p-4 border border-[#212838]">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">
            Puntaje PEDT
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-white">{pedtEval.score}</span>
            <span className="text-xs text-gray-400">/ 20</span>
          </div>
          <span
            className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              pedtEval.classification === 'DEFINITE_PE'
                ? 'bg-[#FF1744]/20 text-[#FF1744]'
                : pedtEval.classification === 'PROBABLE_PE'
                ? 'bg-[#FFB300]/20 text-[#FFB300]'
                : 'bg-[#00E676]/20 text-[#00E676]'
            }`}
          >
            {pedtEval.classification === 'DEFINITE_PE' && 'EP Confirmada'}
            {pedtEval.classification === 'PROBABLE_PE' && 'Probable EP (Borderline)'}
            {pedtEval.classification === 'NO_PE' && 'Sin Disfunción'}
          </span>
        </div>

        {/* IELT Basal */}
        <div className="oled-card p-4 border border-[#212838]">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">
            IELT Estimado
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-[#00E5FF]">{ieltSeconds}</span>
            <span className="text-xs text-gray-400">segundos</span>
          </div>
          <span
            className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              ieltEval.classification === 'PRIMARY_OR_SEVERE'
                ? 'bg-[#FF1744]/20 text-[#FF1744]'
                : ieltEval.classification === 'ACQUIRED_OR_MILD'
                ? 'bg-[#FFB300]/20 text-[#FFB300]'
                : 'bg-[#00E676]/20 text-[#00E676]'
            }`}
          >
            {ieltEval.classification === 'PRIMARY_OR_SEVERE' && 'Primaria (≤ 60s)'}
            {ieltEval.classification === 'ACQUIRED_OR_MILD' && 'Leve / Adquirida'}
            {ieltEval.classification === 'NORMAL_LATENCY' && 'Latencia Normal'}
          </span>
        </div>
      </div>

      {/* Control Deslizante de IELT Basal (Tiempo de Penetración Activa) */}
      <div className="oled-card p-4 space-y-3 border border-[#212838]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            Tiempo de penetración activa antes de eyacular:
          </label>
          <span className="text-xs font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-0.5 rounded-lg border border-[#00E5FF]/20">
            {ieltSeconds < 60
              ? `${ieltSeconds} seg`
              : `${Math.floor(ieltSeconds / 60)} min ${ieltSeconds % 60} s`}
          </span>
        </div>

        <p className="text-[11px] text-gray-400 leading-relaxed">
          Mide la duración promedio (en minutos o segundos) desde que inicia la penetración hasta el clímax (conocido en medicina como <strong>IELT</strong>).
        </p>

        <input
          type="range"
          min="10"
          max="360"
          step="5"
          value={ieltSeconds}
          onChange={(e) => handleIeltChange(Number(e.target.value))}
          className="w-full accent-[#00E5FF] cursor-pointer h-2 bg-[#090A0F] rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
          <span>10s (Muy rápido)</span>
          <span className="text-[#FF1744] font-semibold">60s (1 min - Umbral clínico)</span>
          <span>180s (3 min)</span>
          <span>360s (6+ min)</span>
        </div>
      </div>

      {/* Las 5 Preguntas PEDT Validadas */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
          Cuestionario PEDT Validado (5 preguntas):
        </p>

        {PEDT_QUESTIONS.map((q, qIndex) => {
          const selectedValue = answers[qIndex];
          return (
            <div key={q.id} className="oled-card p-4 space-y-2.5 border border-[#212838]">
              <p className="text-xs font-medium text-white leading-snug">{q.question}</p>
              <div className="grid grid-cols-1 gap-1.5">
                {q.options.map((opt) => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(qIndex, opt.value)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white font-medium shadow-sm shadow-cyan-950/20'
                          : 'bg-[#090A0F] border-[#212838] text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          isSelected ? 'bg-[#00E5FF] text-[#090A0F] font-bold' : 'text-gray-600'
                        }`}
                      >
                        {opt.value} pts
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showSubmitButton && (
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <span>Guardar Diagnóstico Basal</span>
        </button>
      )}
    </div>
  );
}
