'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Maximize2, X, Activity } from 'lucide-react';

interface PelvicStretchIllustrationProps {
  stretchId: string;
  className?: string;
}

interface StretchMeta {
  imageSrc: string;
  muscleLabel: string;
  focusArea: string;
  clinicalAction: string;
}

const STRETCH_METADATA: Record<string, StretchMeta> = {
  child_pose: {
    imageSrc: '/images/stretches/child_pose.jpg',
    muscleLabel: 'Sacro, Dorsal y Suelo Pélvico Posterior',
    focusArea: 'Base Pélvica Posterior',
    clinicalAction: 'Apertura con respiración diafragmática 360°'
  },
  happy_baby: {
    imageSrc: '/images/stretches/happy_baby.jpg',
    muscleLabel: 'Elevador del Ano y Esfínteres Pélvicos',
    focusArea: 'Diafragma Pélvico Central',
    clinicalAction: 'Elongación pasiva asistida por gravedad'
  },
  figure_four: {
    imageSrc: '/images/stretches/figure_four.jpg',
    muscleLabel: 'Piriforme y Rotadores Glúteos Profundos',
    focusArea: 'Túnel del Nervio Pudendo',
    clinicalAction: 'Descompresión del canal pudendo (eyaculación)'
  },
  reclined_butterfly: {
    imageSrc: '/images/stretches/reclined_butterfly.jpg',
    muscleLabel: 'Aductores (Muslo Interno) y Suelo Anterior',
    focusArea: 'Ingle y Aductores Mayor/Largo',
    clinicalAction: 'Desactiva la contracción compensatoria inconsciente'
  },
  low_lunge_psoas: {
    imageSrc: '/images/stretches/low_lunge_psoas.jpg',
    muscleLabel: 'Psoas-Ilíaco y Flexores de Cadera',
    focusArea: 'Cadera Anterior y Raquis Lumbar',
    clinicalAction: 'Libera la anteversión que acorta el suelo pélvico'
  }
};

/**
 * PelvicStretchIllustration
 * Renderiza ilustraciones anatómicas 3D estilo "Muscle & Motion" / atlas de anatomía fitness:
 * Silueta muscular completa en acabado plateado/grafito con los grupos musculares activos
 * iluminados en rojo/coral incandescente para máxima claridad visual.
 */
export const PelvicStretchIllustration: React.FC<PelvicStretchIllustrationProps> = ({
  stretchId,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const meta = STRETCH_METADATA[stretchId] || STRETCH_METADATA.child_pose;

  return (
    <>
      <div
        className={`relative w-full rounded-2xl bg-[#090D16] border border-[#212838] overflow-hidden group shadow-lg ${className}`}
      >
        {/* Contenedor de Imagen 16:9 de Alta Definición */}
        <div className="relative w-full aspect-video bg-[#05070B] overflow-hidden">
          <Image
            src={meta.imageSrc}
            alt={meta.muscleLabel}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            priority
            className="object-cover object-center transition-transform duration-500 group-hover:scale-102"
          />

          {/* Gradiente sutil inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-black/25 pointer-events-none" />

          {/* Badge superior: Foco Anatómico Iluminado */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#090A0F]/85 backdrop-blur-md border border-[#FF3D00]/40 px-2.5 py-1 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
            <span className="text-[10px] font-bold text-white tracking-wide">
              {meta.focusArea}
            </span>
          </div>

          {/* Botón para expandir imagen en modal de pantalla completa */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            title="Ver imagen en tamaño completo"
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#090A0F]/80 backdrop-blur-md border border-[#212838] text-gray-300 hover:text-white hover:bg-black transition-all cursor-pointer shadow-md"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Leyenda inferior con el músculo activo en rojo/coral */}
          <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-white font-semibold drop-shadow">
              <Activity className="w-3 h-3 text-[#FF3D00]" />
              <span className="text-gray-300">Músculo activo:</span>
              <strong className="text-[#FF6E40]">{meta.muscleLabel}</strong>
            </span>
          </div>
        </div>

        {/* Micro-cinta de indicación biomecánica */}
        <div className="px-3 py-1.5 bg-[#0D111A] border-t border-[#1E2638] flex items-center justify-between text-[10px] text-gray-400">
          <span className="truncate">{meta.clinicalAction}</span>
          <span className="text-[9px] text-[#00E5FF] font-semibold whitespace-nowrap ml-2">
            Atlas Anatómico 3D
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
