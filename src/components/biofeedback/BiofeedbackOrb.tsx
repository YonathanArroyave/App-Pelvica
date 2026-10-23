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

  // Radio y escala:
  // Al contraer se condensa hacia el centro (escala 0.7)
  // Al relajar / elongar se expande hacia afuera (escala 1.15)
  const scale = factor >= 0 ? 1 - factor * 0.35 : 1 + Math.abs(factor) * 0.25;

  const getStatusText = () => {
    if (isReverseKegel) {
      return {
        verb: 'SUELTA Y DEJA CAER',
        detail: 'Como al empezar a orinar • Inhala profundo y abre la entrepierna'
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
    <div className={`relative flex flex-col items-center justify-center w-full h-full select-none ${className}`}>
      {/* Contenedor central del orbe orgánico */}
      <div className="relative w-40 h-36 flex items-center justify-center">
        {/* Anillo de onda exterior */}
        <div
          className="absolute rounded-full border border-dashed transition-all duration-300 ease-out"
          style={{
            width: `${130 * scale}px`,
            height: `${130 * scale}px`,
            borderColor: primaryColor,
            opacity: 0.25
          }}
        />

        {/* Halo resplandeciente difuso */}
        <div
          className="absolute rounded-full blur-xl transition-all duration-200 ease-out"
          style={{
            width: `${100 * scale}px`,
            height: `${100 * scale}px`,
            backgroundColor: primaryColor,
            opacity: 0.3 + Math.abs(factor) * 0.35
          }}
        />

        {/* Segundo anillo concéntrico con rotación */}
        <div
          className="absolute rounded-full border-2 transition-all duration-200 ease-out"
          style={{
            width: `${86 * scale}px`,
            height: `${86 * scale}px`,
            borderColor: primaryColor,
            opacity: 0.6
          }}
        />

        {/* Núcleo central condensado */}
        <div
          className="relative rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-150 ease-out"
          style={{
            width: `${68 * scale}px`,
            height: `${68 * scale}px`,
            backgroundColor: '#090A0F',
            border: `2px solid ${primaryColor}`,
            boxShadow: `0 0 20px ${primaryColor}`
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

      {/* Pista somatosensorial inferior */}
      <div className="text-center px-2 py-0.5 mt-[-2px] z-10">
        <div
          className="text-[11px] font-extrabold uppercase tracking-wider"
          style={{ color: primaryColor }}
        >
          {status.verb}
        </div>
        <div className="text-[10px] text-gray-300 font-medium leading-tight max-w-[200px] mx-auto mt-0.5">
          {status.detail}
        </div>
      </div>
    </div>
  );
};
