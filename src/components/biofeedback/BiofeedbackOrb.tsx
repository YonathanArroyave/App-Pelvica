'use client';

import React from 'react';
import type { ActivePhase } from '@/core/types/clinical.types';

interface BiofeedbackOrbProps {
  contractionFactor: number; // -1.0 a 1.0
  phase?: ActivePhase;
  className?: string;
}

/**
 * BiofeedbackOrb
 * Modo minimalista inspirado en interfaces biomórficas (Apple Watch Breathe / Whoop).
 * Se condensa hacia el centro al contraer y se expande suavemente al relajar.
 */
export const BiofeedbackOrb: React.FC<BiofeedbackOrbProps> = ({
  contractionFactor,
  phase,
  className = ''
}) => {
  const factor = Math.max(-1, Math.min(1, contractionFactor));

  const isReverseKegel = factor < -0.15 || phase === 'REVERSE_KEGEL';
  const isContraction = factor > 0.15;

  const primaryColor = isReverseKegel
    ? '#00E676' // Esmeralda Kegel Inverso
    : isContraction
    ? '#7C4DFF' // Violeta Tensión
    : '#00E5FF'; // Cian Reposo

  // Radio y escala compacta para no colisionar con el aro exterior:
  const scale = factor >= 0 ? 1 - factor * 0.3 : 1 + Math.abs(factor) * 0.2;

  const getStatusText = () => {
    if (isReverseKegel) {
      return {
        verb: 'SUELTA Y DEJA CAER',
        detail: 'Como al empezar a orinar • Inhala profundo'
      };
    }
    if (factor > 0.7) {
      return {
        verb: 'MANTÉN ARRIBA',
        detail: 'Tensión máxima sostenida'
      };
    }
    if (factor > 0.15) {
      return {
        verb: 'CIERRA Y ELEVA',
        detail: 'Condensa hacia el centro'
      };
    }
    return {
      verb: 'SUELTA Y RESPIRA',
      detail: 'Relajación completa'
    };
  };

  const status = getStatusText();

  return (
    <div className={`relative flex items-center justify-center w-full h-full select-none ${className}`}>
      {/* Contenedor central del orbe orgánico limpio y centrado */}
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Anillo de onda exterior */}
        <div
          className="absolute rounded-full border border-dashed transition-all duration-300 ease-out"
          style={{
            width: `${115 * scale}px`,
            height: `${115 * scale}px`,
            borderColor: primaryColor,
            opacity: 0.25
          }}
        />

        {/* Halo resplandeciente difuso */}
        <div
          className="absolute rounded-full blur-xl transition-all duration-200 ease-out"
          style={{
            width: `${90 * scale}px`,
            height: `${90 * scale}px`,
            backgroundColor: primaryColor,
            opacity: 0.3 + Math.abs(factor) * 0.35
          }}
        />

        {/* Segundo anillo concéntrico con rotación */}
        <div
          className="absolute rounded-full border-2 transition-all duration-200 ease-out"
          style={{
            width: `${78 * scale}px`,
            height: `${78 * scale}px`,
            borderColor: primaryColor,
            opacity: 0.6
          }}
        />

        {/* Núcleo central condensado */}
        <div
          className="relative rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-150 ease-out"
          style={{
            width: `${60 * scale}px`,
            height: `${60 * scale}px`,
            backgroundColor: '#090A0F',
            border: `2px solid ${primaryColor}`,
            boxShadow: `0 0 16px ${primaryColor}`
          }}
        >
          <span className="font-mono text-xs font-black text-white">
            {factor >= 0 ? `${Math.round(factor * 100)}%` : `${Math.round(factor * 100)}%`}
          </span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
            {factor > 0 ? 'Tensión' : factor < -0.1 ? 'Suelta' : 'Neutro'}
          </span>
        </div>
      </div>
    </div>
  );
};
