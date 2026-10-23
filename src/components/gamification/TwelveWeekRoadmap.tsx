'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  Flame,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import {
  getProtocolForWeek,
  TWELVE_WEEK_PROTOCOL,
  MAINTENANCE_PROTOCOL
} from '@/core/engine/clinicalProgressionRules';

export function TwelveWeekRoadmap() {
  const profile = usePatientStore((s) => s.profile);
  const [selectedWeek, setSelectedWeek] = useState<number>(profile.current_week);

  const selectedProtocol = getProtocolForWeek(
    selectedWeek,
    profile.has_hypertonia,
    profile.has_partner
  );

  const allPhases = [
    ...TWELVE_WEEK_PROTOCOL,
    MAINTENANCE_PROTOCOL
  ];

  return (
    <div className="space-y-4">
      {/* Header del Mapa */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Hoja de Ruta Clínica (12 Semanas)
          </h2>
          <p className="text-[11px] text-gray-500">
            Ruta activa: {profile.has_partner ? 'Integración en Pareja' : 'Reeducación Solo'}
          </p>
        </div>

        <span className="text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-0.5 rounded-full border border-[#00E5FF]/20">
          Semana {profile.current_week} de 12
        </span>
      </div>

      {/* Grid Interactivo de las 12 Semanas + Mantenimiento */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 13 }, (_, i) => i + 1).map((w) => {
          const isCurrent = w === profile.current_week;
          const isCompleted = w < profile.current_week;
          const isSelected = w === selectedWeek;
          const isMaintenance = w === 13;

          return (
            <button
              key={w}
              type="button"
              onClick={() => setSelectedWeek(w)}
              className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#00E5FF] bg-[#00E5FF]/10 scale-105 shadow-md shadow-cyan-950/30'
                  : isCurrent
                  ? 'border-[#00E5FF]/50 bg-[#11141E] glow-cyan'
                  : isCompleted
                  ? 'border-[#00E676]/30 bg-[#00E676]/5 text-gray-300'
                  : 'border-[#212838] bg-[#090A0F] text-gray-600'
              }`}
            >
              {/* Badge superior */}
              <div className="flex items-center justify-center mb-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                ) : isCurrent ? (
                  <Flame className="w-3.5 h-3.5 text-[#00E5FF] fill-[#00E5FF] animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-gray-600" />
                )}
              </div>

              <span className="text-xs font-bold block text-white">
                {isMaintenance ? 'Mant.' : `S${w}`}
              </span>
              <span className="text-[9px] text-gray-400 block truncate mt-0.5">
                {isMaintenance ? 'Post-12' : `Días ${((w - 1) * 7) + 1}-${w * 7}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de Detalle de la Semana Seleccionada */}
      <div className="oled-card p-4 space-y-3 border border-[#212838]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#7C4DFF]" />
            {selectedWeek === 13 ? 'Fase de Mantenimiento' : `Detalle de la Semana ${selectedWeek}`}
          </span>
          <span className="text-[10px] bg-[#181D2B] text-gray-300 px-2 py-0.5 rounded-full border border-[#212838]">
            {selectedProtocol.bodyPosition === 'SUPINE' && 'Decúbito Supino'}
            {selectedProtocol.bodyPosition === 'SEATED' && 'Sedestación'}
            {selectedProtocol.bodyPosition === 'STANDING' && 'Bipedestación'}
            {selectedProtocol.bodyPosition === 'COITAL' && 'Posición Coital'}
          </span>
        </div>

        <h3 className="text-sm font-bold text-white">
          {selectedProtocol.phaseName}
        </h3>

        <p className="text-xs text-gray-300 leading-relaxed">
          {selectedProtocol.clinicalInstructions}
        </p>

        {/* Dosificación Semanal */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#212838] text-center text-xs">
          <div className="bg-[#090A0F] p-2 rounded-xl border border-[#212838]">
            <span className="text-[10px] text-gray-400 block">Series</span>
            <span className="font-bold text-white">{selectedProtocol.dailySets}</span>
          </div>
          <div className="bg-[#090A0F] p-2 rounded-xl border border-[#212838]">
            <span className="text-[10px] text-gray-400 block">Tónicas</span>
            <span className="font-bold text-[#00E5FF]">
              {selectedProtocol.tonicSpecs.reps}x ({selectedProtocol.tonicSpecs.holdSec}s)
            </span>
          </div>
          <div className="bg-[#090A0F] p-2 rounded-xl border border-[#212838]">
            <span className="text-[10px] text-gray-400 block">Fásicas</span>
            <span className="font-bold text-[#7C4DFF]">
              {selectedProtocol.phasicSpecs.reps}x ({selectedProtocol.phasicSpecs.holdSec}s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const WeeklyRoadmap = TwelveWeekRoadmap;
