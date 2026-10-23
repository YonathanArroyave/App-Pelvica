'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ExerciseMode, ActivePhase } from '@/core/types/clinical.types';

interface ThumbZoneControlsProps {
  mode: ExerciseMode;
  phase: ActivePhase;
  isPaused: boolean;
  arousalLevel: number;
  zeroParasiticCompensation: boolean;
  onPlay: () => void;
  onPause: () => void;
  onArousalChange: (level: number) => void;
  onTriggerStopStartPause: () => void;
  onTriggerSqueeze: () => void;
  onToggleParasiticCompensation: (val: boolean) => void;
}

export function ThumbZoneControls({
  mode,
  phase,
  isPaused,
  arousalLevel,
  zeroParasiticCompensation,
  onPlay,
  onPause,
  onArousalChange,
  onTriggerStopStartPause,
  onTriggerSqueeze,
  onToggleParasiticCompensation
}: ThumbZoneControlsProps) {
  const isPartnerMode =
    mode === 'PARTNER_STOP_START' ||
    mode === 'SOLO_STOP_START' ||
    mode === 'PARTNER_SQUEEZE';

  const isStopStart = mode === 'PARTNER_STOP_START' || mode === 'SOLO_STOP_START';
  const isSqueeze = mode === 'PARTNER_SQUEEZE';

  return (
    <div className="w-full space-y-3 pt-2">
      {/* Selector de Excitación (1 a 10) en Modos de Pareja / Solo */}
      {isPartnerMode && (
        <div className="bg-[#11141E] border border-[#212838] p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FFB300]" />
              Nivel de Excitación Actual:
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                arousalLevel >= 8
                  ? 'bg-[#FF1744]/20 text-[#FF1744]'
                  : arousalLevel >= 7
                  ? 'bg-[#FFB300]/20 text-[#FFB300]'
                  : 'bg-[#00E5FF]/20 text-[#00E5FF]'
              }`}
            >
              {arousalLevel} / 10 {arousalLevel >= 7 ? '(Umbral Crítico)' : ''}
            </span>
          </div>

          {/* Selector de botones táctiles 1-10 en Thumb-Zone */}
          <div className="grid grid-cols-10 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = arousalLevel === num;
              const isThreshold = num >= 7;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onArousalChange(num)}
                  className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? isThreshold
                        ? 'bg-[#FF1744] text-white shadow-md shadow-red-500/30 scale-105'
                        : 'bg-[#00E5FF] text-[#090A0F] shadow-md shadow-cyan-500/30 scale-105'
                      : isThreshold
                      ? 'bg-[#181D2B] text-[#FFB300] border border-[#FFB300]/30 hover:bg-[#FFB300]/10'
                      : 'bg-[#090A0F] text-gray-400 border border-[#212838] hover:text-white'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Botones de Control Principal en los 40mm Inferiores */}
      <div className="flex items-center gap-2.5">
        {/* Botón Play / Pause Principal */}
        <button
          type="button"
          onClick={isPaused ? onPlay : onPause}
          className={`flex-1 h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-98 ${
            isPaused
              ? 'bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] shadow-cyan-500/25 glow-cyan'
              : 'bg-[#181D2B] text-white border border-[#212838] hover:bg-[#212838]'
          }`}
        >
          {isPaused ? (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{phase === 'PREPARATION' ? 'Iniciar Sesión' : 'Reanudar'}</span>
            </>
          ) : (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausar</span>
            </>
          )}
        </button>

        {/* Botón de Emergencia Terapéutica en Nivel 7-8/10 (Stop-Start o Squeeze) */}
        {isStopStart && (
          <button
            type="button"
            onClick={onTriggerStopStartPause}
            disabled={phase === 'PAUSE_STOP_START'}
            className="h-14 px-4 rounded-2xl bg-[#FF1744]/20 border border-[#FF1744]/50 text-[#FF1744] font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Pausar 7-8/10</span>
          </button>
        )}

        {isSqueeze && (
          <button
            type="button"
            onClick={onTriggerSqueeze}
            disabled={phase === 'APPLY_SQUEEZE'}
            className="h-14 px-4 rounded-2xl bg-[#FFB300]/20 border border-[#FFB300]/50 text-[#FFB300] font-bold text-xs flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Squeeze 8/10</span>
          </button>
        )}
      </div>

      {/* Control Biomecánico de Cero Compensación Parasitaria */}
      <button
        type="button"
        onClick={() => onToggleParasiticCompensation(!zeroParasiticCompensation)}
        className={`w-full py-2 px-3 rounded-xl border text-[11px] font-medium flex items-center justify-between transition-all cursor-pointer ${
          zeroParasiticCompensation
            ? 'bg-[#00E676]/10 border-[#00E676]/30 text-gray-200'
            : 'bg-[#FFB300]/10 border-[#FFB300]/30 text-[#FFB300]'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
          Aislamiento puro: Cero contracción de glúteos, abdomen o aductores
        </span>
        <span
          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
            zeroParasiticCompensation
              ? 'bg-[#00E676] text-[#090A0F]'
              : 'bg-[#FFB300] text-[#090A0F]'
          }`}
        >
          {zeroParasiticCompensation ? '100% Aislado' : 'Compensando'}
        </span>
      </button>
    </div>
  );
}
