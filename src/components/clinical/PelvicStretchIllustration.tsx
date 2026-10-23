'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2, X, Activity, Play, Pause, Wind } from 'lucide-react';

interface PelvicStretchIllustrationProps {
  stretchId: string;
  className?: string;
}

interface StretchMeta {
  imageSrc: string;
  muscleLabel: string;
  focusArea: string;
  clinicalAction: string;
  somaticMotionCue: string;
}

const STRETCH_METADATA: Record<string, StretchMeta> = {
  child_pose: {
    imageSrc: '/images/stretches/child_pose.jpg',
    muscleLabel: 'Sacro, Dorsal y Suelo Pélvico Posterior',
    focusArea: 'Base Pélvica Posterior',
    clinicalAction: 'Apertura con respiración diafragmática 360°',
    somaticMotionCue: 'Inhala inflando la pelvis posterior • Exhala hundiendo los glúteos'
  },
  happy_baby: {
    imageSrc: '/images/stretches/happy_baby.jpg',
    muscleLabel: 'Elevador del Ano y Esfínteres Pélvicos',
    focusArea: 'Diafragma Pélvico Central',
    clinicalAction: 'Elongación pasiva asistida por gravedad',
    somaticMotionCue: 'Deja caer el periné hacia el suelo • Gravedad sin resistencia'
  },
  figure_four: {
    imageSrc: '/images/stretches/figure_four.jpg',
    muscleLabel: 'Piriforme y Rotadores Glúteos Profundos',
    focusArea: 'Túnel del Nervio Pudendo',
    clinicalAction: 'Descompresión del canal pudendo (eyaculación)',
    somaticMotionCue: 'Tracciona suavemente con la exhalación • Descomprime el nervio'
  },
  reclined_butterfly: {
    imageSrc: '/images/stretches/reclined_butterfly.jpg',
    muscleLabel: 'Aductores (Muslo Interno) y Suelo Anterior',
    focusArea: 'Ingle y Aductores Mayor/Largo',
    clinicalAction: 'Desactiva la contracción compensatoria inconsciente',
    somaticMotionCue: 'Las rodillas se abren lateralmente • Suelta los muslos internos'
  },
  low_lunge_psoas: {
    imageSrc: '/images/stretches/low_lunge_psoas.jpg',
    muscleLabel: 'Psoas-Ilíaco y Flexores de Cadera',
    focusArea: 'Cadera Anterior y Raquis Lumbar',
    clinicalAction: 'Libera la anteversión que acorta el suelo pélvico',
    somaticMotionCue: 'Hunde la pelvis hacia adelante y abajo en cada exhalación'
  }
};

/**
 * PelvicStretchIllustration
 * Atlas Anatómico Muscular 3D con Motor de Movimiento Somatosensorial (Cinemagraph & Breath Pacing).
 * Proporciona:
 * 1. Figura 3D anatómica realista de alta definición.
 * 2. Capa cinemática de ondas de elongación muscular animadas a 60 FPS en SVG.
 * 3. Ritmo de respiración guiada de 8s (4s Inhalación / 4s Exhalación) sincronizado con micro-zoom.
 * 4. Control interactivo para activar/pausar el movimiento según preferencia del paciente.
 */
export const PelvicStretchIllustration: React.FC<PelvicStretchIllustrationProps> = ({
  stretchId,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMotionActive, setIsMotionActive] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'EXHALE'>('INHALE');
  const [breathSeconds, setBreathSeconds] = useState(4);

  const meta = STRETCH_METADATA[stretchId] || STRETCH_METADATA.child_pose;

  // Ciclo rítmico respiratorio para guiar el movimiento somático
  useEffect(() => {
    if (!isMotionActive) return;

    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          setBreathPhase((current) => (current === 'INHALE' ? 'EXHALE' : 'INHALE'));
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMotionActive]);

  return (
    <>
      <div
        className={`relative w-full rounded-2xl bg-[#090D16] border border-[#212838] overflow-hidden group shadow-lg ${className}`}
      >
        {/* Contenedor de Imagen 16:9 con Micro-movimiento Respiratorio */}
        <div className="relative w-full aspect-video bg-[#05070B] overflow-hidden select-none">
          <div
            className={`relative w-full h-full transition-transform duration-[4000ms] ease-in-out ${
              isMotionActive
                ? breathPhase === 'INHALE'
                  ? 'scale-100'
                  : 'scale-[1.035]'
                : 'scale-100'
            }`}
          >
            <Image
              src={meta.imageSrc}
              alt={meta.muscleLabel}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Gradiente sutil inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-black/25 pointer-events-none" />

          {/* CAPA CINEMÁTICA VECTORIAL DE MOVIMIENTO (SVG 60 FPS) */}
          {isMotionActive && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              <defs>
                <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. MOVIMIENTO PARA POSTURA DEL NIÑO: ONDAS DE APERTURA SACRO-PÉLVICA */}
              {stretchId === 'child_pose' && (
                <g>
                  {/* Ondas concéntricas que respiran en la base pélvica */}
                  <circle cx="28" cy="46" r="6" fill="none" stroke="#FF3D00" strokeWidth="1.2" filter="url(#pulseGlow)">
                    <animate attributeName="r" values="6;20;28" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.4;0" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="28" cy="46" r="10" fill="none" stroke="#FF6E40" strokeWidth="0.8">
                    <animate attributeName="r" values="10;24;32" dur="4s" begin="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.3;0" dur="4s" begin="1.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Vector de expansión hacia la espalda baja */}
                  <path d="M 28 38 Q 24 26 18 20" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 3">
                    <animate attributeName="stroke-dashoffset" values="12;0" dur="2s" repeatCount="indefinite" />
                  </path>
                  <polygon points="16,18 21,21 17,25" fill="#00E5FF">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                  </polygon>
                </g>
              )}

              {/* 2. MOVIMIENTO PARA BEBÉ FELIZ: CASCADA DE GRAVEDAD HACIA EL PERINEO */}
              {stretchId === 'happy_baby' && (
                <g>
                  {/* Flujo vertical de gravedad que desciende el suelo pélvico */}
                  <line x1="42" y1="52" x2="42" y2="67" stroke="#00E676" strokeWidth="1.6" strokeDasharray="3 3" filter="url(#pulseGlow)">
                    <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
                  </line>
                  <polygon points="42,70 39,64 45,64" fill="#00E676" />

                  <line x1="48" y1="50" x2="48" y2="68" stroke="#FF3D00" strokeWidth="1.8" strokeDasharray="4 3" filter="url(#pulseGlow)">
                    <animate attributeName="stroke-dashoffset" values="0;14" dur="2s" repeatCount="indefinite" />
                  </line>
                  <polygon points="48,72 45,65 51,65" fill="#FF3D00" />

                  {/* Pulso de relajación en el centro del elevador del ano */}
                  <ellipse cx="45" cy="68" rx="8" ry="4" fill="none" stroke="#FF3D00" strokeWidth="1.5">
                    <animate attributeName="rx" values="8;16;22" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="4;8;11" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.3;0" dur="3.5s" repeatCount="indefinite" />
                  </ellipse>
                </g>
              )}

              {/* 3. MOVIMIENTO PARA FIGURA 4: DESCOMPRESIÓN DEL PIRIFORME Y NERVIO PUDENDO */}
              {stretchId === 'figure_four' && (
                <g>
                  {/* Pulsos de descompresión rotacional */}
                  <circle cx="48" cy="65" r="7" fill="none" stroke="#FF3D00" strokeWidth="1.5" filter="url(#pulseGlow)">
                    <animate attributeName="r" values="7;18;26" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.3;0" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* Flecha dinámica de tracción hacia el pecho */}
                  <path d="M 52 58 Q 45 48 36 42" fill="none" stroke="#00E5FF" strokeWidth="1.8" strokeDasharray="3 3">
                    <animate attributeName="stroke-dashoffset" values="12;0" dur="2.5s" repeatCount="indefinite" />
                  </path>
                  <polygon points="34,40 38,44 34,47" fill="#00E5FF" />
                </g>
              )}

              {/* 4. MOVIMIENTO PARA MARIPOSA: APERTURA LATERAL DE ADUCTORES */}
              {stretchId === 'reclined_butterfly' && (
                <g>
                  {/* Flecha deslizante hacia rodilla izquierda */}
                  <path d="M 40 50 L 26 44" stroke="#FF3D00" strokeWidth="2" strokeDasharray="3 3" filter="url(#pulseGlow)">
                    <animate attributeName="stroke-dashoffset" values="12;0" dur="2s" repeatCount="indefinite" />
                  </path>
                  <polygon points="23,43 28,40 28,46" fill="#FF3D00" />

                  {/* Flecha deslizante hacia rodilla derecha */}
                  <path d="M 48 56 L 56 68" stroke="#FF3D00" strokeWidth="2" strokeDasharray="3 3" filter="url(#pulseGlow)">
                    <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
                  </path>
                  <polygon points="58,70 53,67 57,63" fill="#FF3D00" />

                  {/* Pulso de expansión en la sínfisis púbica */}
                  <circle cx="45" cy="50" r="5" fill="none" stroke="#00E676" strokeWidth="1.2">
                    <animate attributeName="r" values="5;14;20" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.3;0" dur="4s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* 5. MOVIMIENTO PARA ZANCADA BAJA: HUNDIMIENTO PÉLVICO Y ELONGACIÓN DEL PSOAS */}
              {stretchId === 'low_lunge_psoas' && (
                <g>
                  {/* Flujo oblicuo descendente del psoas hacia la cadera */}
                  <path d="M 52 48 L 57 65" stroke="#FF3D00" strokeWidth="2.2" strokeDasharray="4 3" filter="url(#pulseGlow)">
                    <animate attributeName="stroke-dashoffset" values="0;14" dur="2.5s" repeatCount="indefinite" />
                  </path>
                  <polygon points="58,68 54,62 60,62" fill="#FF3D00" />

                  {/* Pulso de apertura en la cadera anterior */}
                  <ellipse cx="53" cy="58" rx="6" ry="10" fill="none" stroke="#00E5FF" strokeWidth="1.4">
                    <animate attributeName="rx" values="6;14;20" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="10;18;26" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.3;0" dur="3.5s" repeatCount="indefinite" />
                  </ellipse>
                </g>
              )}
            </svg>
          )}

          {/* Badge superior: Foco Anatómico Iluminado */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#090A0F]/85 backdrop-blur-md border border-[#FF3D00]/40 px-2.5 py-1 rounded-full shadow-lg z-20">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
            <span className="text-[10px] font-bold text-white tracking-wide">
              {meta.focusArea}
            </span>
          </div>

          {/* Botones de Control: Toggle Movimiento y Zoom Fullscreen */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
            {/* Toggle de Movimiento */}
            <button
              type="button"
              onClick={() => setIsMotionActive((prev) => !prev)}
              title={isMotionActive ? 'Pausar animación de movimiento' : 'Activar movimiento guiado'}
              className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                isMotionActive
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF]/30'
                  : 'bg-[#090A0F]/80 border-[#212838] text-gray-400 hover:text-white'
              }`}
            >
              {isMotionActive ? (
                <>
                  <Pause className="w-2.5 h-2.5" />
                  <span>Movimiento ON</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Movimiento OFF</span>
                </>
              )}
            </button>

            {/* Zoom a Pantalla Completa */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="Ver imagen en tamaño completo"
              className="p-1.5 rounded-full bg-[#090A0F]/80 backdrop-blur-md border border-[#212838] text-gray-300 hover:text-white hover:bg-black transition-all cursor-pointer shadow-md"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Barra Flotante de Respiración Guiada con Movimiento */}
          {isMotionActive && (
            <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between bg-[#090A0F]/90 backdrop-blur-md border border-[#212838] px-3 py-1.5 rounded-xl shadow-lg animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <Wind className={`w-3.5 h-3.5 ${breathPhase === 'INHALE' ? 'text-[#00E5FF] animate-pulse' : 'text-[#00E676]'}`} />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {breathPhase === 'INHALE' ? 'Inhala (Expande)' : 'Exhala (Suelta tensión)'}
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-400 bg-[#181D2B] px-1.5 py-0.5 rounded">
                  {breathSeconds}s
                </span>
              </div>

              <span className="text-[9px] text-gray-300 hidden sm:inline truncate max-w-[200px]">
                {meta.somaticMotionCue}
              </span>
            </div>
          )}
        </div>

        {/* Micro-cinta de indicación biomecánica */}
        <div className="px-3 py-1.5 bg-[#0D111A] border-t border-[#1E2638] flex items-center justify-between text-[10px] text-gray-400 select-none">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#FF3D00]" />
            <span>Músculo activo:</span>
            <strong className="text-[#FF6E40]">{meta.muscleLabel}</strong>
          </div>
          <span className="text-[9px] text-[#00E5FF] font-semibold whitespace-nowrap ml-2">
            Cinemática 3D Activa
          </span>
        </div>
      </div>

      {/* Modal Pantalla Completa (Zoom de Anatomía Muscular) */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#090D16] border border-[#212838] rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#212838]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D00] animate-ping" />
                <h4 className="text-sm font-bold text-white">{meta.muscleLabel}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-xl bg-[#181D2B] text-gray-400 hover:text-white border border-[#212838] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
              <Image
                src={meta.imageSrc}
                alt={meta.muscleLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-contain"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#0F1420] border border-[#212838] text-xs text-gray-300">
              <span className="text-[#FF6E40] font-bold block mb-0.5">
                Zona de Elongación Activa ({meta.focusArea}):
              </span>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {meta.clinicalAction}. Las fibras musculares resaltadas en rojo incandescente representan el objetivo principal del estiramiento para descomprimir el suelo pélvico.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
