'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Info,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { sensoryEngine } from '@/core/engine/sensoryFeedbackEngine';
import { PelvicStretchIllustration } from './PelvicStretchIllustration';

export interface PelvicStretch {
  id: string;
  name: string;
  durationSec: number;
  targetArea: string;
  clinicalPurpose: string;
  somaticInstruction: string;
  whatToAvoid: string;
  visualGraphic: string; // SVG icon or illustration identifier
}

export const PELVIC_STRETCHES: PelvicStretch[] = [
  {
    id: 'child_pose',
    name: "Postura del Niño Pélvica (Child's Pose)",
    durationSec: 60,
    targetArea: 'Suelo pélvico posterior, sacro y zona lumbar',
    clinicalPurpose: 'Abre la base pélvica posterior y normaliza el tono vagal mediante respiración diafragmática 360°.',
    somaticInstruction: 'De rodillas, sepáralas al ancho de tu colchoneta y junta los dedos gordos de los pies. Baja los glúteos hacia los talones y extiende los brazos hacia adelante en el suelo. Inhala inflando la barriga y siente cómo el perineo desciende y se abre.',
    whatToAvoid: 'No aprietes la mandíbula ni contengas la respiración.',
    visualGraphic: 'child'
  },
  {
    id: 'happy_baby',
    name: 'Bebé Feliz (Happy Baby Pose)',
    durationSec: 60,
    targetArea: 'Músculo Elevador del Ano y esfínteres',
    clinicalPurpose: 'Es la postura de oro en fisioterapia urológica para permitir que la gravedad elongue el diafragma pélvico sin resistencia.',
    somaticInstruction: 'Boca arriba, flexiona las rodillas hacia el pecho, ábrelas hacia las axilas y sujeta la parte exterior de los pies o los tobillos. Deja que las rodillas caigan hacia los costados. Con cada exhalación, imagina que el espacio entre tus testículos y tu ano se relaja por completo.',
    whatToAvoid: 'No levantes la cabeza ni tenses el cuello; mantén la espalda apoyada.',
    visualGraphic: 'baby'
  },
  {
    id: 'figure_four',
    name: 'Figura 4 (Estiramiento de Piriforme y Glúteo Profundo)',
    durationSec: 60,
    targetArea: 'Músculo piramidal y canal del nervio pudendo',
    clinicalPurpose: 'Descomprime el nervio pudendo (que controla el reflejo eyaculatorio y la sensibilidad genital).',
    somaticInstruction: 'Boca arriba con rodillas dobladas, cruza el tobillo derecho sobre la rodilla izquierda formando un "4". Toma tu muslo izquierdo con ambas manos y acércalo suavemente al pecho. Siente el estiramiento profundo en el glúteo. Mantén 30s por cada lado.',
    whatToAvoid: 'No tirones con fuerza; el estiramiento debe ser agradable y sin dolor articular.',
    visualGraphic: 'figure4'
  },
  {
    id: 'reclined_butterfly',
    name: 'Mariposa Reclinada (Supta Baddha Konasana)',
    durationSec: 60,
    targetArea: 'Aductores y suelo pélvico anterior',
    clinicalPurpose: 'Elonga los aductores (muslo interno), anulando la compensación parasitaria inconsciente.',
    somaticInstruction: 'Boca arriba, junta las plantas de los pies y deja que las rodillas caigan relajadas hacia los lados en forma de diamante. Coloca una mano en el abdomen y otra en el pecho. Respira lento, permitiendo que la entrepierna se abra por gravedad.',
    whatToAvoid: 'No fuerces las rodillas hacia el suelo; deja que la gravedad actúe sin empujar.',
    visualGraphic: 'butterfly'
  },
  {
    id: 'low_lunge_psoas',
    name: 'Zancada Baja (Estiramiento de Psoas e Ilíaco)',
    durationSec: 60,
    targetArea: 'Psoas-ilíaco y flexores de cadera',
    clinicalPurpose: 'Libera la tensión anterior de la pelvis que inclina la cadera hacia adelante y contractura el suelo pélvico.',
    somaticInstruction: 'Apoya una rodilla en el suelo y da un paso adelante con el otro pie a 90°. Con el torso erguido, empuja la pelvis suavemente hacia adelante y abajo hasta sentir el estiramiento en el frente de la cadera. Mantén 30s por pierna.',
    whatToAvoid: 'No arquees en exceso la espalda baja; mantén el abdomen activo.',
    visualGraphic: 'lunge'
  }
];

interface PelvicStretchesGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PelvicStretchesGuide: React.FC<PelvicStretchesGuideProps> = ({
  isOpen,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(PELVIC_STRETCHES[0].durationSec);
  const [isRunning, setIsRunning] = useState(false);
  const [completedStretches, setCompletedStretches] = useState<string[]>([]);

  const currentStretch = PELVIC_STRETCHES[currentIndex];

  useEffect(() => {
    setTimeRemaining(currentStretch.durationSec);
    setIsRunning(false);
  }, [currentIndex, currentStretch.durationSec]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            sensoryEngine.triggerSensoryCues('RELAXATION');
            setCompletedStretches((completed) =>
              completed.includes(currentStretch.id) ? completed : [...completed, currentStretch.id]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, currentStretch.id]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentIndex < PELVIC_STRETCHES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleTimer = async () => {
    if (!isRunning) {
      await sensoryEngine.requestWakeLock();
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(currentStretch.durationSec);
  };

  const progressPercent = Math.round(
    ((currentStretch.durationSec - timeRemaining) / currentStretch.durationSec) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0D111A] border border-[#212838] rounded-3xl p-5 space-y-3.5 shadow-2xl relative max-h-[95vh] overflow-y-auto">
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#212838]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Estiramientos Pélvicos Miofasciales</h3>
              <p className="text-[10px] text-gray-400">Postura {currentIndex + 1} de {PELVIC_STRETCHES.length} • Descompresión del Diafragma Pélvico</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-[#181D2B] border border-[#212838] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Pestañas Rápidas para Navegar las 5 Posturas */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PELVIC_STRETCHES.map((s, idx) => {
            const isCurrent = currentIndex === idx;
            const isDone = completedStretches.includes(s.id);
            const shortNames = ['1. Niño', '2. Bebé Feliz', '3. Figura 4', '4. Mariposa', '5. Zancada'];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-[#00E676] text-[#090A0F] shadow-md shadow-[#00E676]/20'
                    : isDone
                    ? 'bg-[#182032] text-[#00E676] border border-[#00E676]/30'
                    : 'bg-[#11141E] border border-[#212838] text-gray-400 hover:text-white'
                }`}
              >
                <span>{shortNames[idx]}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-[#00E676]" />}
              </button>
            );
          })}
        </div>

        {/* Tarjeta de la Postura Activa */}
        <div className="oled-card p-4 space-y-3 border border-[#00E676]/30 bg-gradient-to-br from-[#11141E] to-[#0A0D14]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#00E676] uppercase tracking-wider block">
                {currentStretch.targetArea}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {currentStretch.name}
              </h4>
            </div>
            {completedStretches.includes(currentStretch.id) && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#00E676] bg-[#00E676]/15 px-2.5 py-0.5 rounded-full border border-[#00E676]/30">
                <CheckCircle2 className="w-3 h-3" /> Completado
              </span>
            )}
          </div>

          {/* Gráfico 2D Vectorial de la Postura */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-0.5">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Eye className="w-3.5 h-3.5 text-[#00E676]" />
                Ilustración Anatómica 2D
              </span>
              <span className="text-[10px] text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-full border border-[#00E676]/25 font-bold">
                ● Verde = Zona de descompresión
              </span>
            </div>
            <PelvicStretchIllustration stretchId={currentStretch.id} />
          </div>

          {/* Instrucción Somatosensorial Clara */}
          <div className="p-3 rounded-xl bg-[#090A0F] border border-[#212838] text-xs text-gray-300 leading-relaxed">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Cómo realizarlo paso a paso:
            </span>
            {currentStretch.somaticInstruction}
          </div>

          {/* Beneficio Clínico y Qué Evitar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-[#090A0F] border border-[#212838] space-y-1">
              <div className="flex items-center gap-1 text-[#00E5FF] font-semibold">
                <Info className="w-3.5 h-3.5" />
                <span>Beneficio Clínico:</span>
              </div>
              <p className="text-gray-400 text-[10px] leading-tight">
                {currentStretch.clinicalPurpose}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090A0F] border border-[#212838] space-y-1">
              <div className="flex items-center gap-1 text-[#FFB300] font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Qué Evitar:</span>
              </div>
              <p className="text-gray-400 text-[10px] leading-tight">
                {currentStretch.whatToAvoid}
              </p>
            </div>
          </div>

          {/* Temporizador Integrado Horizontal Compacto */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#090A0F] border border-[#212838]">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    stroke="#181D2B"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    stroke="#00E676"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 23}
                    strokeDashoffset={2 * Math.PI * 23 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black font-mono text-white">
                    {timeRemaining}s
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-white block">
                  {isRunning ? 'Sostén y respira hondo' : timeRemaining === 0 ? '¡Postura completada!' : 'Temporizador de 60s'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  {isRunning ? 'Inhala inflando el vientre suavemente' : 'Cronometra el estiramiento guiado'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTimer}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  isRunning
                    ? 'bg-[#FF1744] text-white hover:bg-red-600'
                    : 'bg-[#00E676] text-[#090A0F] hover:bg-[#00c966]'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{timeRemaining === 0 ? 'Repetir' : 'Iniciar'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Reiniciar temporizador"
                className="p-2 rounded-xl bg-[#181D2B] border border-[#212838] text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navegación entre Estiramientos */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="px-3 py-2 rounded-xl bg-[#181D2B] border border-[#212838] text-xs font-semibold text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <span className="text-xs text-gray-400 font-medium">
            Postura {currentIndex + 1} de {PELVIC_STRETCHES.length}
          </span>

          <button
            type="button"
            disabled={currentIndex === PELVIC_STRETCHES.length - 1}
            onClick={handleNext}
            className="px-3 py-2 rounded-xl bg-[#181D2B] border border-[#212838] text-xs font-semibold text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Nota de calma para el paciente */}
        <div className="p-3 rounded-2xl bg-[#11141E] border border-[#212838] text-[11px] text-gray-400 leading-relaxed">
          💡 <strong>Regla de oro:</strong> Los estiramientos nunca deben causar dolor agudo. Respira lento inflando el abdomen y deja que el suelo pélvico se libere por gravedad.
        </div>
      </div>
    </div>
  );
};
