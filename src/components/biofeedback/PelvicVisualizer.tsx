'use client';

import React, { useState, useEffect } from 'react';
import type { ActivePhase } from '@/core/types/clinical.types';
import { PelvicMedicalSilhouette } from './PelvicMedicalSilhouette';
import { PelvicElevatorGauge } from './PelvicElevatorGauge';
import { BiofeedbackOrb } from './BiofeedbackOrb';

export type VisualizerMode = 'SILHOUETTE' | 'ELEVATOR' | 'ORB';

interface PelvicVisualizerProps {
  contractionFactor: number;
  phase?: ActivePhase;
  className?: string;
}

const STORAGE_KEY = 'pelvic_visualizer_preferred_mode';

/**
 * PelvicVisualizer
 * Selector multivista de biofeedback que permite al paciente elegir la representación
 * visual más intuitiva y clara para su entrenamiento:
 * 1. Silueta Médica: Corte sagital anatómico claro con elevación visceral.
 * 2. Ascensor Pélvico: Metáfora clásica de pisos (Piso 0 a Piso 3 / Sótano).
 * 3. Orbe Zen: Pulso biomórfico de concentración y ritmo.
 */
export const PelvicVisualizer: React.FC<PelvicVisualizerProps> = ({
  contractionFactor,
  phase,
  className = ''
}) => {
  const [mode, setMode] = useState<VisualizerMode>('SILHOUETTE');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(STORAGE_KEY) as VisualizerMode | null;
    if (saved && (saved === 'SILHOUETTE' || saved === 'ELEVATOR' || saved === 'ORB')) {
      setMode(saved);
    }
  }, []);

  const handleSelectMode = (newMode: VisualizerMode) => {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-between w-full h-full ${className}`}>
      {/* Selector de modo estilo pill en la parte superior */}
      <div className="z-20 flex items-center gap-1 bg-[#090A0F]/80 backdrop-blur-md border border-[#212838] p-1 rounded-xl shadow-lg mt-0.5">
        <button
          type="button"
          onClick={() => handleSelectMode('SILHOUETTE')}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
            mode === 'SILHOUETTE'
              ? 'bg-[#7C4DFF] text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Silueta anatómica lateral del cuerpo humano"
        >
          <span>🩺</span>
          <span>Silueta</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMode('ELEVATOR')}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
            mode === 'ELEVATOR'
              ? 'bg-[#00E5FF] text-[#090A0F] shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Manómetro del Ascensor Pélvico por pisos"
        >
          <span>🛗</span>
          <span>Ascensor</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMode('ORB')}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
            mode === 'ORB'
              ? 'bg-[#00E676] text-[#090A0F] shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Orbe de respiración y biofeedback minimalista"
        >
          <span>💫</span>
          <span>Orbe</span>
        </button>
      </div>

      {/* Área de visualización interactiva */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        {mode === 'SILHOUETTE' && (
          <PelvicMedicalSilhouette
            contractionFactor={contractionFactor}
            phase={phase}
          />
        )}

        {mode === 'ELEVATOR' && (
          <PelvicElevatorGauge
            contractionFactor={contractionFactor}
            phase={phase}
          />
        )}

        {mode === 'ORB' && (
          <BiofeedbackOrb
            contractionFactor={contractionFactor}
            phase={phase}
          />
        )}
      </div>
    </div>
  );
};
