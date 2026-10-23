'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import {
  generateIeltProgressionData,
  generatePedtProgressionData,
  calculate84DayAdherenceHeatmap
} from '@/core/clinical/clinicalMetricsCalculator';

export function PatientMetricsChart() {
  const assessments = usePatientStore((s) => s.assessments);
  const sessions = usePatientStore((s) => s.trainingSessions);
  const profile = usePatientStore((s) => s.profile);

  const [mounted, setMounted] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState<'IELT' | 'PEDT' | 'HEATMAP'>('IELT');

  useEffect(() => {
    setMounted(true);
  }, []);

  const baselineAssessment = assessments.find((a) => a.week_number === 0);
  const fallbackIelt = baselineAssessment ? Number(baselineAssessment.ielt_seconds) : 45;
  const fallbackPedt = baselineAssessment ? baselineAssessment.pedt_score : 14;

  const ieltData = generateIeltProgressionData(assessments, fallbackIelt);
  const pedtData = generatePedtProgressionData(assessments, fallbackPedt);
  const heatmapData = calculate84DayAdherenceHeatmap(
    sessions,
    profile.current_week,
    profile.current_day
  );

  if (!mounted) {
    return (
      <div className="oled-card p-8 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selector de Gráfico */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#11141E] rounded-2xl border border-[#212838]">
        <button
          type="button"
          onClick={() => setActiveMetricTab('IELT')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMetricTab === 'IELT'
              ? 'bg-[#00E5FF] text-[#090A0F] shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Curva IELT (s)
        </button>
        <button
          type="button"
          onClick={() => setActiveMetricTab('PEDT')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMetricTab === 'PEDT'
              ? 'bg-[#7C4DFF] text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Puntaje PEDT
        </button>
        <button
          type="button"
          onClick={() => setActiveMetricTab('HEATMAP')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeMetricTab === 'HEATMAP'
              ? 'bg-[#00E676] text-[#090A0F] shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Heatmap (84d)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* GRÁFICO 1: EVOLUCIÓN IELT (SEGUNDOS) VS. BENCHMARK RCT PASTORE */}
      {/* ========================================================================= */}
      {activeMetricTab === 'IELT' && (
        <div className="oled-card p-4 space-y-3 border border-[#212838] animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00E5FF]" />
                Latencia Eyaculatoria Intravaginal (IELT)
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Tu progreso frente a la cohorte de ensayo clínico (Pastore et al.)
              </p>
            </div>
            <span className="text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-md">
              &gt; 4x Aumento Objetivo
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ieltData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="patientIeltGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="week" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} domain={[0, 160]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11141E',
                    borderColor: '#212838',
                    borderRadius: '0.75rem',
                    color: '#F0F4F8',
                    fontSize: '11px'
                  }}
                  formatter={(val: any, name: any) => [
                    val !== null && val !== undefined ? `${val}s` : 'Sin registrar',
                    name === 'patientIelt' ? 'Tu IELT' : 'Benchmark RCT'
                  ]}
                />
                <ReferenceLine
                  y={60}
                  stroke="#FF1744"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Umbral EP (60s)',
                    fill: '#FF1744',
                    fontSize: 9,
                    position: 'insideBottomRight'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="patientIelt"
                  stroke="#00E5FF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#patientIeltGrad)"
                  name="patientIelt"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="rctBenchmark"
                  stroke="#7C4DFF"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: '#7C4DFF', r: 3 }}
                  name="rctBenchmark"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-[#212838]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
              <span>Tu IELT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C4DFF]" />
              <span>Ensayo Clínico Pastore (PFMT)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#FF1744]">
              <span>--- 60s Umbral EP</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GRÁFICO 2: REDUCCIÓN DE PUNTAJE PEDT (0-20) */}
      {/* ========================================================================= */}
      {activeMetricTab === 'PEDT' && (
        <div className="oled-card p-4 space-y-3 border border-[#212838] animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#7C4DFF]" />
                Puntaje Diagnóstico PEDT (0 a 20)
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Reducción del impacto clínico hacia la normalidad (≤ 8 puntos)
              </p>
            </div>
            <span className="text-xs font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-md">
              Meta: ≤ 8 pts
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pedtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="week" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} domain={[0, 20]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11141E',
                    borderColor: '#212838',
                    borderRadius: '0.75rem',
                    color: '#F0F4F8',
                    fontSize: '11px'
                  }}
                  formatter={(val: any) => [
                    val !== null && val !== undefined ? `${val} pts` : 'Pendiente',
                    'Puntaje PEDT'
                  ]}
                />
                <ReferenceLine
                  y={8}
                  stroke="#00E676"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Límite No-EP (≤ 8)',
                    fill: '#00E676',
                    fontSize: 9,
                    position: 'insideBottomRight'
                  }}
                />
                <ReferenceLine
                  y={11}
                  stroke="#FF1744"
                  strokeDasharray="4 4"
                  label={{
                    value: 'EP Severa (≥ 11)',
                    fill: '#FF1744',
                    fontSize: 9,
                    position: 'insideTopRight'
                  }}
                />
                <Bar
                  dataKey="patientPedt"
                  fill="#7C4DFF"
                  radius={[6, 6, 0, 0]}
                  name="Puntaje PEDT"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-[#212838]">
            <span className="text-[#00E676]">0 - 8: Sin disfunción</span>
            <span className="text-[#FFB300]">9 - 10: Borderline</span>
            <span className="text-[#FF1744]">11 - 20: EP Clínica</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GRÁFICO 3: HEATMAP DE ADHERENCIA DE 84 DÍAS (12 SEMANAS X 7 DÍAS) */}
      {/* ========================================================================= */}
      {activeMetricTab === 'HEATMAP' && (
        <div className="oled-card p-4 space-y-3 border border-[#212838] animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00E676]" />
                Mapa de Calor: 84 Días de Neuroplasticidad
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {heatmapData.completedCount} de {heatmapData.totalElapsedDays} días entrenados (
                {heatmapData.adherenceRatePercent}% de consistencia)
              </p>
            </div>
            <span className="text-xs font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-md">
              {heatmapData.adherenceRatePercent}% Adherencia
            </span>
          </div>

          {/* Grid de 84 Días (12 Columnas x 7 Filas) */}
          <div className="pt-2">
            <div className="grid grid-cols-12 gap-1.5">
              {Array.from({ length: 12 }, (_, wIndex) => {
                const weekNum = wIndex + 1;
                const weekDays = heatmapData.days.filter((d) => d.week === weekNum);

                return (
                  <div key={weekNum} className="flex flex-col gap-1.5">
                    <span className="text-[8px] text-gray-500 font-bold text-center block">
                      S{weekNum}
                    </span>

                    {weekDays.map((day) => (
                      <div
                        key={day.absoluteDay}
                        title={`Día ${day.absoluteDay} (S${day.week} D${day.dayOfWeek}): ${day.status}`}
                        className={`w-full aspect-square rounded-md transition-all ${
                          day.status === 'COMPLETED'
                            ? day.zeroParasiticCompensation
                              ? 'bg-[#00E676] shadow-sm shadow-emerald-500/30'
                              : 'bg-[#00E5FF]'
                            : day.status === 'MISSED'
                            ? 'bg-[#FF1744]/40 border border-[#FF1744]/60'
                            : day.isCurrentDay
                            ? 'border-2 border-[#00E5FF] bg-[#11141E] animate-pulse'
                            : 'bg-[#181D2B]/50 border border-[#212838]/60'
                        }`}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leyenda del Heatmap */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-[#212838]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#00E676]" />
              <span>Entrenado (Aislado)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded border border-[#00E5FF] bg-[#11141E]" />
              <span>Día Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#FF1744]/40 border border-[#FF1744]/60" />
              <span>Descanso / Perdido</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#181D2B]/50" />
              <span>Futuro</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
