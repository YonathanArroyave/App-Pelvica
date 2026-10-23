'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  HelpCircle,
  FileText,
  Activity,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  EVIDENCE_COMPARISON_DATA,
  PASTORE_RCT_BENCHMARKS
} from '@/core/clinical/clinicalMetricsCalculator';

export default function EduSaludPage() {
  const [selectedParamIndex, setSelectedParamIndex] = useState<number>(0);

  return (
    <div className="space-y-5 pt-1 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFB300]/15 text-[#FFB300] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-base font-bold text-white">EduSalud: Evidencia Clínica</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Ensayos Clínicos Randomizados (Pastore et al. & RCTs)
          </p>
        </div>

        <span className="text-[10px] font-bold text-[#00E676] bg-[#00E676]/10 px-2.5 py-1 rounded-full border border-[#00E676]/20 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Nivel Evidencia 1b
        </span>
      </div>

      {/* Tarjeta de Resumen Clínico */}
      <div className="oled-card p-4 space-y-2.5 border border-[#212838] bg-gradient-to-br from-[#11141E] to-[#181D2B]">
        <span className="text-xs font-bold text-white block">
          ¿Por qué Rehabilitación Neuromuscular antes que Fármacos?
        </span>
        <p className="text-xs text-gray-300 leading-relaxed">
          Los inhibidores de recaptación de serotonina (como la Dapoxetina) actúan como un parche químico temporal: al suspenderlos, el 100% de los pacientes regresa a su IELT basal. Por el contrario, la fisioterapia de suelo pélvico (**PFMT**) reorganiza los arcos reflejos espinales bulbocavernosos, generando un control motor duradero a 5 años sin toxicidad.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* TABLA COMPARATIVA OFICIAL: SECCIÓN 7.2 DEL PRD */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Cuadro Métrico Comparativo: PFMT vs. Dapoxetina
        </h2>

        <div className="space-y-2.5">
          {EVIDENCE_COMPARISON_DATA.map((row, idx) => {
            const isSelected = selectedParamIndex === idx;
            return (
              <div
                key={row.parameter}
                onClick={() => setSelectedParamIndex(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#11141E] border-[#00E5FF] shadow-md shadow-cyan-950/20'
                    : 'bg-[#11141E]/60 border-[#212838] hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{row.parameter}</span>
                  <span className="text-[10px] text-gray-400">Toca para ver impacto</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Grupo PFMT (Fisioterapia Pélvica) */}
                  <div className="p-2.5 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30">
                    <span className="text-[10px] font-bold text-[#00E676] block mb-0.5">
                      Fisioterapia Pélvica (PFMT)
                    </span>
                    <span className="text-xs font-semibold text-white leading-snug">
                      {row.pfmtGroup}
                    </span>
                  </div>

                  {/* Grupo Dapoxetina */}
                  <div className="p-2.5 rounded-xl bg-[#FF1744]/10 border border-[#FF1744]/30">
                    <span className="text-[10px] font-bold text-[#FF1744] block mb-0.5">
                      Dapoxetina (30/60 mg)
                    </span>
                    <span className="text-xs font-semibold text-gray-300 leading-snug">
                      {row.dapoxetineGroup}
                    </span>
                  </div>
                </div>

                {/* Detalle Clínico Expandido */}
                {isSelected && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#090A0F] border border-[#212838] text-[11px] text-gray-300 animate-fadeIn">
                    <strong className="text-[#00E5FF]">Impacto Terapéutico en la PWA: </strong>
                    {row.clinicalImpact}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RETENCIÓN LONGITUDINAL A 5 AÑOS: SIMULADOR VISUAL */}
      {/* ========================================================================= */}
      <div className="oled-card p-4 space-y-3 border border-[#212838]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#7C4DFF]" />
            Mantenimiento a 5 Años (60 Meses)
          </span>
          <span className="text-xs font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-md">
            81% Persistencia
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          En los seguimientos a 24 y 60 meses de los RCTs:
        </p>

        {/* Comparativa Gráfica de Retención */}
        <div className="space-y-3 pt-1">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-semibold text-white">Grupo PFMT (Rehabilitación Pélvica)</span>
              <span className="font-bold text-[#00E676]">66% - 81% mantiene control</span>
            </div>
            <div className="h-2.5 w-full bg-[#090A0F] rounded-full overflow-hidden border border-[#212838]">
              <div
                className="h-full bg-[#00E676] rounded-full"
                style={{ width: '81%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-semibold text-white">Grupo Dapoxetina (Post-Suspensión)</span>
              <span className="font-bold text-[#FF1744]">0% (Reversión a basal)</span>
            </div>
            <div className="h-2.5 w-full bg-[#090A0F] rounded-full overflow-hidden border border-[#212838]">
              <div
                className="h-full bg-[#FF1744] rounded-full"
                style={{ width: '5%' }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#181D2B] border border-[#212838] text-[11px] text-gray-300 leading-snug">
          <strong>Conclusión médica:</strong> La reconfiguración neuromuscular no genera tolerancia farmacológica ni síndrome de abstinencia, convirtiendo al paciente en el gestor autónomo de su reflejo eyaculatorio.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FISIOLOGÍA: CÓMO ACTÚA EL ENTRENAMIENTO EN LOS MÚSCULOS PÉLVICOS */}
      {/* ========================================================================= */}
      <div className="oled-card p-4 space-y-3 border border-[#212838]">
        <div className="flex items-center gap-2 text-[#00E5FF]">
          <Zap className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Mecanismo Neuromuscular: El Reflejo Bulbocavernoso
          </h3>
        </div>

        <div className="space-y-2 text-xs text-gray-300">
          <p className="leading-relaxed">
            La eyaculación consta de dos fases: <em>emisión</em> (simpática) y <em>expulsión</em> (contracciones fásicas del bulboesponjoso e isquiocavernoso).
          </p>
          <ul className="space-y-2 list-disc pl-4 text-[11px] text-gray-400">
            <li>
              <strong className="text-white">Aislamiento Fibras Tipo I (Tónicas):</strong> Incrementa la resistencia perineal en decúbito supino y sedestación para soportar aumentos de presión sin disparar el reflejo.
            </li>
            <li>
              <strong className="text-white">Aislamiento Fibras Tipo II (Fásicas):</strong> Aumenta la velocidad de oclusión de la uretra membranosa mediante contracciones explosivas de 1 segundo.
            </li>
            <li>
              <strong className="text-white">Kegel Inverso (Down-Training):</strong> Inhibe las motoneuronas somáticas del nervio pudendo en el Núcleo de Onuf, desacelerando el arco eyaculatorio en nivel 7-8/10.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
