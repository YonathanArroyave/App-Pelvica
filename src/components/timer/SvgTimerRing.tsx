'use client';

import React from 'react';
import { ActivePhase } from '@/core/types/clinical.types';

interface SvgTimerRingProps {
  phase: ActivePhase;
  timeRemainingSec: number;
  normalizedProgress: number; // 0.0 a 1.0
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function SvgTimerRing({
  phase,
  timeRemainingSec,
  normalizedProgress,
  size = 280,
  strokeWidth = 10,
  children
}: SvgTimerRingProps) {
  const center = size / 2;
  const radius = center - strokeWidth - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - normalizedProgress);

  // Paleta dinámica basada en la fase clínica
  let strokeColor = '#00E5FF';
  let phaseLabel = 'Preparación';
  let glowClass = 'glow-cyan';

  switch (phase) {
    case 'PREPARATION':
      strokeColor = '#00E5FF';
      phaseLabel = 'Prepárate';
      glowClass = 'glow-cyan';
      break;
    case 'CONTRACTION':
      strokeColor = '#7C4DFF';
      phaseLabel = 'Contrae (Sostén)';
      glowClass = 'glow-violet';
      break;
    case 'RELAXATION':
      strokeColor = '#00E676';
      phaseLabel = 'Relaja y Suelta';
      glowClass = 'glow-emerald';
      break;
    case 'REVERSE_KEGEL':
      strokeColor = '#00E676';
      phaseLabel = 'Kegel Inverso (Abajo)';
      glowClass = 'glow-emerald';
      break;
    case 'PAUSE_STOP_START':
      strokeColor = '#FF1744';
      phaseLabel = '¡Pausa Stop-Start!';
      glowClass = 'glow-crimson';
      break;
    case 'APPLY_SQUEEZE':
      strokeColor = '#FFB300';
      phaseLabel = 'Compresión Squeeze';
      glowClass = 'shadow-lg shadow-amber-500/30';
      break;
    case 'STIMULATION_ACTIVE':
      strokeColor = '#00E5FF';
      phaseLabel = 'Estimulación Activa';
      glowClass = 'glow-cyan';
      break;
    case 'SET_REST':
      strokeColor = '#8A99AD';
      phaseLabel = 'Descanso entre Series';
      glowClass = '';
      break;
    case 'COMPLETED':
      strokeColor = '#00E676';
      phaseLabel = '¡Sesión Completada!';
      glowClass = 'glow-emerald';
      break;
  }

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Pista de fondo */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#181D2B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Anillo de progreso determinista */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={phase === 'CONTRACTION' ? strokeWidth + 2 : strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-150 ease-linear"
        />
      </svg>

      {/* Contenido Central: Tiempo, Fase o Lienzo 3D superpuesto */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {children ? (
          children
        ) : (
          <div className="text-center">
            <span
              className={`text-4xl font-extrabold tracking-tight transition-colors ${
                phase === 'CONTRACTION'
                  ? 'text-[#7C4DFF]'
                  : phase === 'PAUSE_STOP_START'
                  ? 'text-[#FF1744]'
                  : 'text-white'
              }`}
            >
              {timeRemainingSec}s
            </span>
            <span className="text-xs font-semibold text-gray-300 block mt-1 tracking-wide">
              {phaseLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
