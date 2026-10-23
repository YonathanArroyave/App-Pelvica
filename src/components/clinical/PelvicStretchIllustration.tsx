'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Maximize2, X, Activity, Play, Pause, Wind, Video, Gauge } from 'lucide-react';

interface PelvicStretchIllustrationProps {
  stretchId: string;
  className?: string;
}

interface StretchMeta {
  imageSrc: string;
  videoSrc: string;
  muscleLabel: string;
  focusArea: string;
  clinicalAction: string;
  somaticMotionCue: string;
  pullActionCue: string;
  releaseActionCue: string;
}

const STRETCH_METADATA: Record<string, StretchMeta> = {
  child_pose: {
    imageSrc: '/images/stretches/child_pose.jpg',
    videoSrc: '/videos/stretches/child_pose.mp4',
    muscleLabel: 'Sacro, Dorsal y Suelo Pélvico Posterior',
    focusArea: 'Base Pélvica Posterior',
    clinicalAction: 'Apertura con respiración diafragmática 360°',
    somaticMotionCue: 'Inhala inflando la pelvis posterior • Exhala hundiendo los glúteos',
    pullActionCue: 'Hunde el pecho y glúteos hacia los talones (Elongación)',
    releaseActionCue: 'Inhala permitiendo que la espalda suba suavemente'
  },
  happy_baby: {
    imageSrc: '/images/stretches/happy_baby.jpg',
    videoSrc: '/videos/stretches/happy_baby.mp4',
    muscleLabel: 'Elevador del Ano y Esfínteres Pélvicos',
    focusArea: 'Diafragma Pélvico Central',
    clinicalAction: 'Elongación pasiva asistida por gravedad',
    somaticMotionCue: 'Deja caer el periné hacia el suelo • Gravedad sin resistencia',
    pullActionCue: 'Tracciona los pies suavemente hacia las axilas (Apertura máxima)',
    releaseActionCue: 'Alivia la tracción manteniendo las rodillas abiertas'
  },
  figure_four: {
    imageSrc: '/images/stretches/figure_four.jpg',
    videoSrc: '/videos/stretches/figure_four.mp4',
    muscleLabel: 'Piriforme y Rotadores Glúteos Profundos',
    focusArea: 'Túnel del Nervio Pudendo',
    clinicalAction: 'Descompresión del canal pudendo (eyaculación)',
    somaticMotionCue: 'Tracciona suavemente con la exhalación • Descomprime el nervio',
    pullActionCue: 'Tira del muslo hacia el pecho (La pierna se flexiona al pecho)',
    releaseActionCue: 'Aleja suavemente la pierna hacia la posición inicial'
  },
  reclined_butterfly: {
    imageSrc: '/images/stretches/reclined_butterfly.jpg',
    videoSrc: '/videos/stretches/reclined_butterfly.mp4',
    muscleLabel: 'Aductores (Muslo Interno) y Suelo Anterior',
    focusArea: 'Ingle y Aductores Mayor/Largo',
    clinicalAction: 'Desactiva la contracción compensatoria inconsciente',
    somaticMotionCue: 'Las rodillas se abren lateralmente • Suelta los muslos internos',
    pullActionCue: 'Deja que las rodillas caigan más hacia el suelo por gravedad',
    releaseActionCue: 'Inhala inflando el abdomen inferior'
  },
  low_lunge_psoas: {
    imageSrc: '/images/stretches/low_lunge_psoas.jpg',
    videoSrc: '/videos/stretches/low_lunge_psoas.mp4',
    muscleLabel: 'Psoas-Ilíaco y Flexores de Cadera',
    focusArea: 'Cadera Anterior y Raquis Lumbar',
    clinicalAction: 'Libera la anteversión que acorta el suelo pélvico',
    somaticMotionCue: 'Hunde la pelvis hacia adelante y abajo en cada exhalación',
    pullActionCue: 'Hunde la pelvis hacia adelante y abajo (Estira el psoas)',
    releaseActionCue: 'Eleva ligeramente la cadera al inhalar'
  }
};

/**
 * PelvicStretchIllustration
 * Atlas Anatómico Muscular 3D con Motor de Movimiento Biomecánico Articulado (Kinetic Motion & Video Loop).
 * 
 * Capacidades:
 * 1. Reproducción de Video Loop (.mp4/.webm) si está disponible en /videos/stretches/.
 * 2. Motor Cinemático Biomecánico 60 FPS: la pierna o pelvis realiza el movimiento real (tracción hacia el pecho,
 *    hundimiento de cadera o apertura de rodillas) sincronizado con el ciclo respiratorio y muscular.
 * 3. Intensificación lumínica de fibras musculares en el punto álgido del estiramiento.
 * 4. Control de velocidad (1x normal / 0.5x cámara lenta) y pausa.
 */
export const PelvicStretchIllustration: React.FC<PelvicStretchIllustrationProps> = ({
  stretchId,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMotionActive, setIsMotionActive] = useState(true);
  const [useVideoMode, setUseVideoMode] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [motionSpeed, setMotionSpeed] = useState<1 | 0.6>(1);
  const [cyclePhase, setCyclePhase] = useState<'PULL' | 'HOLD' | 'RETURN'>('PULL');
  const [phaseSeconds, setPhaseSeconds] = useState(3);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const meta = STRETCH_METADATA[stretchId] || STRETCH_METADATA.child_pose;

  // Ciclo biomecánico continuo: 3s Tracción -> 1s Sostén -> 3s Retorno
  useEffect(() => {
    if (!isMotionActive || useVideoMode) return;

    const intervalTime = motionSpeed === 1 ? 1000 : 1600;

    const interval = setInterval(() => {
      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          setCyclePhase((current) => {
            if (current === 'PULL') return 'HOLD';
            if (current === 'HOLD') return 'RETURN';
            return 'PULL';
          });
          return 3;
        }
        return prev - 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isMotionActive, useVideoMode, motionSpeed]);

  // Estilos de transformación biomecánica articular para cada postura específica
  const getBiomechanicalTransform = () => {
    if (!isMotionActive || useVideoMode) return 'scale(1) translate(0px, 0px) rotate(0deg)';

    const isEngaged = cyclePhase === 'PULL' || cyclePhase === 'HOLD';

    switch (stretchId) {
      case 'figure_four':
        // En Figura 4: La pierna y cadera se flexionan y traccionan hacia el pecho (-6.5deg y -7px)
        return isEngaged
          ? 'rotate(-6deg) translate(-7px, -4px) scale(1.025)'
          : 'rotate(0deg) translate(0px, 0px) scale(1)';

      case 'happy_baby':
        // En Bebé Feliz: Las piernas descienden hacia las axilas por la tracción de las manos
        return isEngaged
          ? 'translate(0px, 6px) scale(1.03)'
          : 'translate(0px, 0px) scale(1)';

      case 'child_pose':
        // En Postura del Niño: El torso y pelvis se hunden hacia los talones y el suelo
        return isEngaged
          ? 'translate(-4px, 5px) scale(1.02)'
          : 'translate(0px, 0px) scale(1)';

      case 'reclined_butterfly':
        // En Mariposa: Las rodillas se abren más hacia el suelo
        return isEngaged
          ? 'translate(0px, 5px) scaleX(1.03) scaleY(0.97)'
          : 'translate(0px, 0px) scale(1)';

      case 'low_lunge_psoas':
        // En Zancada: La pelvis se hunde hacia adelante y abajo
        return isEngaged
          ? 'translate(8px, 6px) scale(1.02)'
          : 'translate(0px, 0px) scale(1)';

      default:
        return isEngaged ? 'scale(1.03)' : 'scale(1)';
    }
  };

  const currentDurationMs = motionSpeed === 1 ? 3000 : 4800;

  return (
    <>
      <div
        className={`relative w-full rounded-2xl bg-[#090D16] border border-[#212838] overflow-hidden group shadow-lg ${className}`}
      >
        {/* Contenedor de Imagen o Video 16:9 con Articulación Biomecánica */}
        <div className="relative w-full aspect-video bg-[#05070B] overflow-hidden select-none">
          {useVideoMode && !hasVideoError ? (
            <video
              ref={videoRef}
              src={meta.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              poster={meta.imageSrc}
              onError={() => {
                setHasVideoError(true);
                setUseVideoMode(false);
              }}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div
              style={{
                transform: getBiomechanicalTransform(),
                transformOrigin: stretchId === 'figure_four' ? '48% 72%' : '50% 60%',
                transition: `transform ${currentDurationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`
              }}
              className="relative w-full h-full"
            >
              <Image
                src={meta.imageSrc}
                alt={meta.muscleLabel}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                priority
                className="object-cover object-center"
              />

              {/* Capa de Intensificación Muscular en el punto álgido del estiramiento */}
              {isMotionActive && (cyclePhase === 'PULL' || cyclePhase === 'HOLD') && (
                <div
                  className="absolute inset-0 bg-[#FF3D00]/10 mix-blend-color-dodge transition-opacity duration-1000 pointer-events-none"
                  style={{ opacity: cyclePhase === 'HOLD' ? 0.75 : 0.4 }}
                />
              )}
            </div>
          )}

          {/* Gradiente sutil inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-black/25 pointer-events-none" />

          {/* CAPA CINEMÁTICA VECTORIAL DE TRAYECTORIA ARTICULAR (SVG 60 FPS) */}
          {isMotionActive && !useVideoMode && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              <defs>
                <filter id="pulseGlow2" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* FIGURA 4: TRAYECTORIA CURVA DE LA PIERNA TIRANDO AL PECHO */}
              {stretchId === 'figure_four' && (
                <g>
                  {/* Flecha curva biomecánica de la pierna aproximándose al pecho */}
                  <path
                    d="M 52 64 Q 44 50 34 40"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="2.2"
                    strokeDasharray="4 3"
                    filter="url(#pulseGlow2)"
                  >
                    <animate attributeName="stroke-dashoffset" values="14;0" dur="2s" repeatCount="indefinite" />
                  </path>
                  <polygon points="32,38 37,42 33,45" fill="#00E5FF">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                  </polygon>

                  {/* Resplandor rotacional en el piriforme */}
                  <circle cx="48" cy="65" r="8" fill="none" stroke="#FF3D00" strokeWidth="1.8">
                    <animate attributeName="r" values="8;18;24" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.4;0" dur="3s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* POSTURA DEL NIÑO: DIRECCIÓN DE HUNDIMIENTO Y RESPIRACIÓN */}
              {stretchId === 'child_pose' && (
                <g>
                  <circle cx="28" cy="46" r="6" fill="none" stroke="#FF3D00" strokeWidth="1.2">
                    <animate attributeName="r" values="6;20;28" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.4;0" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <path d="M 28 38 Q 24 26 18 20" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 3">
                    <animate attributeName="stroke-dashoffset" values="12;0" dur="2s" repeatCount="indefinite" />
                  </path>
                </g>
              )}

              {/* BEBÉ FELIZ: CASCADA DE GRAVEDAD */}
              {stretchId === 'happy_baby' && (
                <g>
                  <line x1="45" y1="48" x2="45" y2="68" stroke="#00E676" strokeWidth="2" strokeDasharray="4 3">
                    <animate attributeName="stroke-dashoffset" values="0;14" dur="2s" repeatCount="indefinite" />
                  </line>
                  <polygon points="45,71 42,65 48,65" fill="#00E676" />
                </g>
              )}

              {/* MARIPOSA RECLINADA: APERTURA LATERAL */}
              {stretchId === 'reclined_butterfly' && (
                <g>
                  <path d="M 40 50 L 26 44" stroke="#FF3D00" strokeWidth="2" strokeDasharray="3 3">
                    <animate attributeName="stroke-dashoffset" values="12;0" dur="2s" repeatCount="indefinite" />
                  </path>
                  <polygon points="23,43 28,40 28,46" fill="#FF3D00" />
                  <path d="M 48 56 L 56 68" stroke="#FF3D00" strokeWidth="2" strokeDasharray="3 3">
                    <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
                  </path>
                  <polygon points="58,70 53,67 57,63" fill="#FF3D00" />
                </g>
              )}

              {/* ZANCADA BAJA: HUNDIMIENTO DE CADERA */}
              {stretchId === 'low_lunge_psoas' && (
                <g>
                  <path d="M 52 48 L 57 65" stroke="#FF3D00" strokeWidth="2.2" strokeDasharray="4 3">
                    <animate attributeName="stroke-dashoffset" values="0;14" dur="2.5s" repeatCount="indefinite" />
                  </path>
                  <polygon points="58,68 54,62 60,62" fill="#FF3D00" />
                </g>
              )}
            </svg>
          )}

          {/* Badge superior: Foco Anatómico */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#090A0F]/85 backdrop-blur-md border border-[#FF3D00]/40 px-2.5 py-1 rounded-full shadow-lg z-20">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
            <span className="text-[10px] font-bold text-white tracking-wide">
              {meta.focusArea}
            </span>
          </div>

          {/* Barra de Controles Superiores: Toggle Movimiento, Velocidad y Zoom */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
            {/* Toggle de Modo Video (si no hay error de archivo) */}
            {!hasVideoError && (
              <button
                type="button"
                onClick={() => setUseVideoMode((prev) => !prev)}
                title={useVideoMode ? 'Cambiar a Modelo Biomecánico' : 'Cambiar a Video Loop'}
                className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                  useVideoMode
                    ? 'bg-[#7C4DFF]/30 border-[#7C4DFF] text-white'
                    : 'bg-[#090A0F]/80 border-[#212838] text-gray-400 hover:text-white'
                }`}
              >
                <Video className="w-2.5 h-2.5" />
                <span>{useVideoMode ? 'Video MP4' : '3D Articulado'}</span>
              </button>
            )}

            {/* Selector de Velocidad (1x / 0.5x) */}
            <button
              type="button"
              onClick={() => setMotionSpeed((prev) => (prev === 1 ? 0.6 : 1))}
              title="Velocidad del movimiento"
              className="px-2 py-1 rounded-full text-[10px] font-mono font-bold bg-[#090A0F]/80 border border-[#212838] text-gray-300 hover:text-white backdrop-blur-md cursor-pointer flex items-center gap-1"
            >
              <Gauge className="w-2.5 h-2.5 text-[#00E5FF]" />
              <span>{motionSpeed === 1 ? '1.0x' : '0.5x'}</span>
            </button>

            {/* Toggle de Movimiento Activo / Pausa */}
            <button
              type="button"
              onClick={() => setIsMotionActive((prev) => !prev)}
              title={isMotionActive ? 'Pausar movimiento articular' : 'Reanudar movimiento'}
              className={`p-1.5 rounded-full text-[10px] font-bold backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                isMotionActive
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF]/50 text-[#00E5FF]'
                  : 'bg-[#090A0F]/80 border-[#212838] text-gray-400 hover:text-white'
              }`}
            >
              {isMotionActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            </button>

            {/* Zoom a Pantalla Completa */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="Ver en pantalla completa"
              className="p-1.5 rounded-full bg-[#090A0F]/80 backdrop-blur-md border border-[#212838] text-gray-300 hover:text-white hover:bg-black transition-all cursor-pointer shadow-md"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Barra Flotante de Movimiento Biomecánico Articular en Vivo */}
          {isMotionActive && !useVideoMode && (
            <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between bg-[#090A0F]/90 backdrop-blur-md border border-[#212838] px-3 py-1.5 rounded-xl shadow-lg animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cyclePhase === 'PULL' ? 'bg-[#00E5FF] animate-ping' : cyclePhase === 'HOLD' ? 'bg-[#FF3D00]' : 'bg-[#00E676]'}`} />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {cyclePhase === 'PULL' && 'Tracción hacia el pecho'}
                  {cyclePhase === 'HOLD' && 'Sostén (Tensión profunda)'}
                  {cyclePhase === 'RETURN' && 'Regreso suave'}
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-400 bg-[#181D2B] px-1.5 py-0.5 rounded">
                  {phaseSeconds}s
                </span>
              </div>

              <span className="text-[9px] text-[#00E5FF] font-semibold hidden sm:inline truncate max-w-[220px]">
                {cyclePhase === 'PULL' || cyclePhase === 'HOLD' ? meta.pullActionCue : meta.releaseActionCue}
              </span>
            </div>
          )}
        </div>

        {/* Micro-cinta de indicación biomecánica */}
        <div className="px-3 py-1.5 bg-[#0D111A] border-t border-[#1E2638] flex items-center justify-between text-[10px] text-gray-400 select-none">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#FF3D00]" />
            <span>Músculo en elongación:</span>
            <strong className="text-[#FF6E40]">{meta.muscleLabel}</strong>
          </div>
          <span className="text-[9px] text-[#00E5FF] font-semibold whitespace-nowrap ml-2">
            Movimiento Articular Activo
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
