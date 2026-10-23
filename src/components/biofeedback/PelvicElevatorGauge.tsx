'use client';

import React from 'react';
import type { ActivePhase } from '@/core/types/clinical.types';

interface PelvicElevatorGaugeProps {
  contractionFactor: number; // -1.0 a 1.0
  phase?: ActivePhase;
  className?: string;
}

/**
 * PelvicElevatorGauge
 * Metáfora clínica del "Ascensor Pélvico" estándar en kinesiología y urología:
 * - Piso 3 (100%): Tensión Máxima y Elevación Cefálica
 * - Piso 2 (66%): Contracción Tónica de Resistencia
 * - Piso 1 (33%): Activación Suave / Cierre
 * - Piso 0 (0%): Planta Baja (Relajación Neutra)
 * - Sótano (-100%): Kegel Inverso (Elongación Diafragmática)
 */
export const PelvicElevatorGauge: React.FC<PelvicElevatorGaugeProps> = ({
  contractionFactor,
  phase,
  className = ''
}) => {
  const factor = Math.max(-1, Math.min(1, contractionFactor));

  // Determinar en qué piso se encuentra la cabina del ascensor:
  // factor de -1.0 a 1.0 se proyecta al recorrido visual del eje vertical
  // Porcentaje de altura visual:
  // Sótano (-1.0) = 5% desde abajo
  // Planta Baja (0.0) = 30% desde abajo
  // Piso 1 (0.33) = 52% desde abajo
  // Piso 2 (0.66) = 75% desde abajo
  // Piso 3 (1.0) = 95% desde abajo
  const getElevatorHeightPercent = () => {
    if (factor >= 0) {
      // 0 a 1.0 mapeado de 30% a 95%
      return 30 + factor * 65;
    }
    // -1.0 a 0 mapeado de 5% a 30%
    return 30 + factor * 25;
  };

  const currentFloorLabel = () => {
    if (factor < -0.2 || phase === 'REVERSE_KEGEL') {
      return {
        floor: 'SÓTANO',
        level: 'Kegel Inverso',
        color: '#00E676',
        instruction: 'Desciende suavemente sin pujar'
      };
    }
    if (factor >= 0.8) {
      return {
        floor: 'PISO 3',
        level: 'Tensión Máxima',
        color: '#7C4DFF',
        instruction: 'Sostén arriba • Respira normalmente'
      };
    }
    if (factor >= 0.45) {
      return {
        floor: 'PISO 2',
        level: 'Resistencia Media',
        color: '#00E5FF',
        instruction: 'Mantén el tono muscular firme'
      };
    }
    if (factor >= 0.15) {
      return {
        floor: 'PISO 1',
        level: 'Activación Suave',
        color: '#2DD4BF',
        instruction: 'Cierre inicial del esfínter'
      };
    }
    return {
      floor: 'PLANTA BAJA',
      level: 'Relajación Neutra',
      color: '#94A3B8',
      instruction: 'Relaja 100% el suelo pélvico'
    };
  };

  const state = currentFloorLabel();
  const heightPercent = getElevatorHeightPercent();

  return (
    <div className={`relative flex flex-col items-center justify-center w-full h-full select-none ${className}`}>
      {/* Contenedor central del pozo del ascensor */}
      <div className="relative w-44 h-38 bg-[#0B0D14] rounded-2xl border border-[#1E2638] px-3 py-2 flex items-center justify-between shadow-inner">
        {/* Marcadores de Pisos a la izquierda */}
        <div className="flex flex-col justify-between h-full py-0.5 text-[10px] font-bold">
          <div
            className={`flex items-center gap-1.5 transition-colors ${
              factor >= 0.75 ? 'text-[#7C4DFF] font-extrabold' : 'text-gray-500'
            }`}
          >
            <span className="w-4 text-right">P3</span>
            <span className="text-[9px] font-mono">100%</span>
          </div>

          <div
            className={`flex items-center gap-1.5 transition-colors ${
              factor >= 0.45 && factor < 0.75 ? 'text-[#00E5FF] font-extrabold' : 'text-gray-500'
            }`}
          >
            <span className="w-4 text-right">P2</span>
            <span className="text-[9px] font-mono">66%</span>
          </div>

          <div
            className={`flex items-center gap-1.5 transition-colors ${
              factor >= 0.15 && factor < 0.45 ? 'text-[#2DD4BF] font-extrabold' : 'text-gray-500'
            }`}
          >
            <span className="w-4 text-right">P1</span>
            <span className="text-[9px] font-mono">33%</span>
          </div>

          <div
            className={`flex items-center gap-1.5 transition-colors ${
              factor > -0.2 && factor < 0.15 ? 'text-white font-extrabold' : 'text-gray-500'
            }`}
          >
            <span className="w-4 text-right">PB</span>
            <span className="text-[9px] font-mono">0%</span>
          </div>

          <div
            className={`flex items-center gap-1.5 transition-colors ${
              factor <= -0.2 ? 'text-[#00E676] font-extrabold' : 'text-gray-500'
            }`}
          >
            <span className="w-4 text-right">S</span>
            <span className="text-[9px] font-mono">Desc</span>
          </div>
        </div>

        {/* Pozo y riel vertical de la cabina */}
        <div className="relative w-12 h-full bg-[#131825] rounded-xl border border-[#212838] overflow-hidden flex flex-col justify-end">
          {/* Fondo del riel con marcas */}
          <div className="absolute inset-0 flex flex-col justify-between p-1 pointer-events-none opacity-20">
            <div className="w-full h-px bg-white" />
            <div className="w-full h-px bg-white" />
            <div className="w-full h-px bg-white" />
            <div className="w-full h-px bg-white" />
            <div className="w-full h-px bg-white" />
          </div>

          {/* Relleno lumínico del ascensor desde la planta baja */}
          <div
            className="absolute left-0 right-0 transition-all duration-150 ease-out"
            style={{
              bottom: factor >= 0 ? '30%' : `${heightPercent}%`,
              height: factor >= 0 ? `${heightPercent - 30}%` : `${30 - heightPercent}%`,
              backgroundColor: state.color,
              opacity: 0.25
            }}
          />

          {/* Cabina móvil del ascensor con indicador numérico */}
          <div
            className="absolute left-1 right-1 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] text-white shadow-lg transition-all duration-150 ease-out z-10"
            style={{
              bottom: `calc(${heightPercent}% - 12px)`,
              backgroundColor: state.color,
              boxShadow: `0 0 12px ${state.color}`
            }}
          >
            {factor >= 0 ? `+${Math.round(factor * 100)}%` : `${Math.round(factor * 100)}%`}
          </div>
        </div>

        {/* Panel lateral derecho con estado actual */}
        <div className="flex flex-col justify-center items-center text-center w-14">
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
            Nivel
          </span>
          <span
            className="text-xs font-black tracking-wide my-0.5"
            style={{ color: state.color }}
          >
            {state.floor}
          </span>
          <span className="text-[8px] font-bold text-gray-300 leading-tight">
            {state.level}
          </span>
        </div>
      </div>

      {/* Pista somatosensorial inferior */}
      <div className="text-center px-2 py-0.5 mt-1 z-10">
        <div
          className="text-[11px] font-extrabold uppercase tracking-wider"
          style={{ color: state.color }}
        >
          {factor > 0 ? '▲ Subiendo Ascensor' : factor < -0.2 ? '▼ Descendiendo al Sótano' : '■ En Planta Baja'}
        </div>
        <div className="text-[10px] text-gray-300 font-medium leading-tight max-w-[210px] mx-auto mt-0.5">
          {state.instruction}
        </div>
      </div>
    </div>
  );
};
