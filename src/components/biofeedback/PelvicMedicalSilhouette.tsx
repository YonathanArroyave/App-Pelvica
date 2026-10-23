'use client';

import React from 'react';
import type { ActivePhase } from '@/core/types/clinical.types';

interface PelvicMedicalSilhouetteProps {
  contractionFactor: number; // -1.0 a 1.0
  phase?: ActivePhase;
  className?: string;
}

/**
 * PelvicMedicalSilhouette
 * Representación anatómica 2D vectorial clara en corte sagital (perfil).
 * Muestra el contorno corporal, el pubis al frente, el cóccix atrás,
 * y la hamaca del suelo pélvico elevándose visiblemente al contraer.
 */
export const PelvicMedicalSilhouette: React.FC<PelvicMedicalSilhouetteProps> = ({
  contractionFactor,
  phase,
  className = ''
}) => {
  const factor = Math.max(-1, Math.min(1, contractionFactor));

  // Posición Y de la hamaca del suelo pélvico (en el centro del arco pubis-cóccix):
  // Línea base neutra: y = 145
  // Contracción máxima (+1.0): y = 118 (elevación de 27px hacia el abdomen)
  // Elongación máxima (-1.0): y = 162 (descenso de 17px hacia abajo)
  const muscleLiftY = 145 - factor * (factor >= 0 ? 27 : 17);

  // Grosor del músculo: se engrosa al contraer
  const muscleStrokeWidth = factor > 0 ? 6 + factor * 4 : 5;

  // Color del músculo y energía:
  const isReverseKegel = factor < -0.15 || phase === 'REVERSE_KEGEL';
  const muscleColor = isReverseKegel
    ? '#00E676' // Verde esmeralda para Kegel Inverso
    : factor > 0.1
    ? '#7C4DFF' // Violeta neón para Contracción
    : '#00E5FF'; // Cian para reposo neutro

  // Texto de retroalimentación somatosensorial en lenguaje claro y accesible
  const getSomaticCue = () => {
    if (isReverseKegel) {
      return {
        action: 'SUELTA EL PERINEO',
        desc: 'Deja caer el músculo como al iniciar la orina (sin pujar)',
        arrow: '↓'
      };
    }
    if (factor > 0.6) {
      return {
        action: 'ELEVACIÓN MÁXIMA',
        desc: 'Eleva los testículos hacia el ombligo • Sin apretar glúteos',
        arrow: '↑'
      };
    }
    if (factor > 0.1) {
      return {
        action: 'CIERRE Y ASCENSO',
        desc: 'Contrae el esfínter como cortando el flujo',
        arrow: '↑'
      };
    }
    return {
      action: 'REPOSO NEUTRO',
      desc: 'Suelo pélvico en calma • Respira con el diafragma',
      arrow: '•'
    };
  };

  const cue = getSomaticCue();

  return (
    <div className={`relative flex items-center justify-center w-full h-full select-none ${className}`}>
      {/* SVG del corte sagital anatómico limpio y centrado */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 240 210"
          className="w-full max-w-[190px] max-h-[125px] drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Brillo neon del músculo activo */}
            <filter id="muscleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradiente de elevación */}
            <linearGradient id="liftGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={muscleColor} stopOpacity="0.0" />
              <stop offset="100%" stopColor={muscleColor} stopOpacity={Math.abs(factor) * 0.4} />
            </linearGradient>
          </defs>

          {/* 1. Silueta corporal externa de perfil */}
          <path
            d="M 50 25 Q 52 70 65 110 Q 75 140 92 165 Q 105 185 105 200"
            fill="none"
            stroke="#212838"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
          <path
            d="M 185 25 Q 180 70 175 105 Q 170 135 180 160 Q 192 185 188 200"
            fill="none"
            stroke="#212838"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />

          {/* 2. Referencias Óseas Claras (Fijas) */}
          {/* Sínfisis del Pubis */}
          <g transform="translate(72, 125)">
            <rect
              x="-8"
              y="-10"
              width="16"
              height="22"
              rx="6"
              fill="#1E2638"
              stroke="#475569"
              strokeWidth="2"
            />
            <text
              x="-4"
              y="26"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="bold"
              letterSpacing="0.5"
            >
              PUBIS
            </text>
          </g>

          {/* Cóccix / Sacro */}
          <g transform="translate(168, 130)">
            <path
              d="M -6 -16 L 6 -16 L 3 12 L -3 12 Z"
              fill="#1E2638"
              stroke="#475569"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text
              x="-14"
              y="24"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="bold"
              letterSpacing="0.5"
            >
              CÓCCIX
            </text>
          </g>

          {/* 3. Vejiga urinaria */}
          <path
            d="M 85 85 C 85 62, 155 62, 155 85 C 155 108, 125 118, 120 128 C 115 118, 85 108, 85 85 Z"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x="120"
            y="88"
            textAnchor="middle"
            fill="#475569"
            fontSize="8"
            fontWeight="semibold"
          >
            Vejiga
          </text>

          {/* 4. Campo de Deformación / Sombra de Elevación */}
          {factor > 0.05 && (
            <path
              d={`M 74 135 Q 120 ${muscleLiftY} 165 138 L 165 145 Q 120 145 74 135 Z`}
              fill="url(#liftGradient)"
              className="transition-all duration-150 ease-out"
            />
          )}

          {/* 5. MÚSCULO DEL SUELO PÉLVICO */}
          <path
            d={`M 74 135 Q 120 ${muscleLiftY} 165 138`}
            fill="none"
            stroke={muscleColor}
            strokeWidth={muscleStrokeWidth}
            strokeLinecap="round"
            filter="url(#muscleGlow)"
            className="transition-all duration-150 ease-out"
          />

          <circle cx="74" cy="135" r="3.5" fill="#FFFFFF" />
          <circle cx="165" cy="138" r="3.5" fill="#FFFFFF" />

          {/* 6. Flecha y Vector de Elevación/Descenso */}
          {Math.abs(factor) > 0.15 && (
            <g transform={`translate(120, ${muscleLiftY + (factor > 0 ? -16 : 14)})`}>
              <circle cx="0" cy="0" r="10" fill="#090A0F" stroke={muscleColor} strokeWidth="1.5" />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fill={muscleColor}
                fontSize="12"
                fontWeight="bold"
              >
                {cue.arrow}
              </text>
            </g>
          )}

          <g transform={`translate(120, ${muscleLiftY + (factor > 0 ? 16 : -8)})`}>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill={muscleColor}
              fontSize="9"
              fontWeight="bold"
              letterSpacing="0.5"
              className="drop-shadow"
            >
              SUELO PÉLVICO
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
