'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Activity,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { getProtocolForWeek } from '@/core/engine/clinicalProgressionRules';
import { TimerStateMachine, TimerStateMachineSnapshot } from '@/core/engine/timerStateMachine';
import { sensoryEngine } from '@/core/engine/sensoryFeedbackEngine';
import { PelvicVisualizer } from '@/components/biofeedback/PelvicVisualizer';
import { SvgTimerRing } from '@/components/timer/SvgTimerRing';
import { ThumbZoneControls } from '@/components/timer/ThumbZoneControls';
import { PartnerDualGuide } from '@/components/canvas3d/PartnerDualGuide';
import { SoundpackSelector } from '@/components/timer/SoundpackSelector';
import { PelvicStretchesGuide } from '@/components/clinical/PelvicStretchesGuide';
import { ExerciseMode } from '@/core/types/clinical.types';

export default function GymTrainingPage() {
  const profile = usePatientStore((s) => s.profile);
  const recordTrainingSession = usePatientStore((s) => s.recordTrainingSession);
  const advanceDay = usePatientStore((s) => s.advanceDay);

  const protocol = getProtocolForWeek(profile.current_week, profile.has_hypertonia);

  const [isStretchesOpen, setIsStretchesOpen] = useState(false);

  // Modo de ejercicio activo
  const [selectedMode, setSelectedMode] = useState<ExerciseMode>(
    profile.has_hypertonia
      ? 'DOWN_TRAINING'
      : profile.current_week >= 9 && profile.has_partner
      ? 'PARTNER_STOP_START'
      : profile.current_week >= 7 && !profile.has_partner
      ? 'SOLO_STOP_START'
      : 'INDIVIDUAL_TONIC'
  );

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionSaved, setSessionSaved] = useState(false);

  // Instancia de la Máquina de Estados Finitos
  const stateMachineRef = useRef<TimerStateMachine | null>(null);
  const [snapshot, setSnapshot] = useState<TimerStateMachineSnapshot | null>(null);

  // Inicializar Máquina de Estados
  const initializeStateMachine = useCallback((mode: ExerciseMode) => {
    let repsPerSet = protocol.tonicSpecs.reps || 10;
    let contractionDurationSec = protocol.tonicSpecs.holdSec || 3;
    let relaxationDurationSec = protocol.tonicSpecs.restSec || 6;
    let targetSets = protocol.dailySets || 3;
    let reverseKegelCyclesEndSet = protocol.reverseKegelCyclesEndSet || 3;

    if (mode === 'INDIVIDUAL_PHASIC') {
      repsPerSet = protocol.phasicSpecs.reps || 10;
      contractionDurationSec = protocol.phasicSpecs.holdSec || 1;
      relaxationDurationSec = protocol.phasicSpecs.restSec || 2;
    } else if (mode === 'DOWN_TRAINING') {
      repsPerSet = 5;
      contractionDurationSec = 0;
      relaxationDurationSec = 5;
      reverseKegelCyclesEndSet = 0;
      targetSets = 1;
    } else if (mode === 'PARTNER_STOP_START' || mode === 'SOLO_STOP_START') {
      repsPerSet = 3; // 3 ciclos de stop-start
      contractionDurationSec = 0;
      relaxationDurationSec = 0;
      targetSets = 1;
    } else if (mode === 'PARTNER_SQUEEZE') {
      repsPerSet = 3;
      contractionDurationSec = 0;
      relaxationDurationSec = 0;
      targetSets = 1;
    }

    const sm = new TimerStateMachine({
      mode,
      targetSets,
      repsPerSet,
      contractionDurationSec,
      relaxationDurationSec,
      reverseKegelCyclesEndSet,
      reverseKegelDurationSec: 6,
      partnerPauseDurationSec: mode === 'PARTNER_SQUEEZE' ? 12 : 35,
      setRestDurationSec: 15,
      preparationDurationSec: 3
    });

    sm.onPhaseChange((newPhase) => {
      sensoryEngine.triggerHaptic(newPhase);
      sensoryEngine.playPhaseSound(newPhase);
    });

    stateMachineRef.current = sm;
    setSnapshot(sm.getSnapshot());
    setSessionSaved(false);
  }, [protocol]);

  useEffect(() => {
    initializeStateMachine(selectedMode);
  }, [selectedMode, initializeStateMachine]);

  // Tick loop determinista a 50ms (20 Hz de muestreo para 60 FPS de renderizado interpolado)
  useEffect(() => {
    const interval = setInterval(() => {
      if (stateMachineRef.current) {
        stateMachineRef.current.tick(50);
        setSnapshot(stateMachineRef.current.getSnapshot());
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Guardar sesión al completarse
  useEffect(() => {
    if (snapshot?.isCompleted && !sessionSaved) {
      sensoryEngine.releaseWakeLock();
      recordTrainingSession({
        week_number: profile.current_week,
        day_number: profile.current_day,
        exercise_mode: selectedMode,
        body_position: protocol.bodyPosition,
        completed_sets: snapshot.targetSets,
        target_sets: snapshot.targetSets,
        max_arousal_reached: snapshot.arousalLevel,
        zero_parasitic_compensation: snapshot.zeroParasiticCompensation,
        duration_seconds: snapshot.totalElapsedSec
      });
      setSessionSaved(true);
    }
  }, [
    snapshot?.isCompleted,
    sessionSaved,
    recordTrainingSession,
    profile.current_week,
    profile.current_day,
    selectedMode,
    protocol.bodyPosition,
    snapshot
  ]);

  const handlePlay = async () => {
    await sensoryEngine.requestWakeLock();
    stateMachineRef.current?.start();
  };

  const handlePause = async () => {
    await sensoryEngine.releaseWakeLock();
    stateMachineRef.current?.pause();
  };

  const handleReset = () => {
    sensoryEngine.releaseWakeLock();
    initializeStateMachine(selectedMode);
  };

  if (!snapshot) return null;

  const isPartnerOrSoloMode =
    selectedMode === 'PARTNER_STOP_START' ||
    selectedMode === 'SOLO_STOP_START' ||
    selectedMode === 'PARTNER_SQUEEZE';

  return (
    <div className="space-y-4 pt-1 animate-fadeIn pb-10">
      {/* Selector de Modo de Sesión */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white">Gym Neuromuscular</h1>
            <span className="text-[10px] bg-[#181D2B] text-gray-300 px-2 py-0.5 rounded-full border border-[#212838]">
              {protocol.bodyPosition}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Serie {snapshot.currentSet}/{snapshot.targetSets} • Repetición {snapshot.currentRep}/{snapshot.targetReps}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Reiniciar Sesión"
          className="p-2 rounded-xl bg-[#11141E] border border-[#212838] text-gray-400 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs de Modos de Ejercicio Disponibles */}
      {!profile.has_hypertonia && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedMode('INDIVIDUAL_TONIC')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedMode === 'INDIVIDUAL_TONIC'
                ? 'bg-[#00E5FF] text-[#090A0F]'
                : 'bg-[#11141E] border border-[#212838] text-gray-400'
            }`}
          >
            Tónico (Fibras I)
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode('INDIVIDUAL_PHASIC')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedMode === 'INDIVIDUAL_PHASIC'
                ? 'bg-[#7C4DFF] text-white'
                : 'bg-[#11141E] border border-[#212838] text-gray-400'
            }`}
          >
            Fásico (Fibras II)
          </button>
          <button
            type="button"
            onClick={() => setSelectedMode('DOWN_TRAINING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedMode === 'DOWN_TRAINING'
                ? 'bg-[#00E676] text-[#090A0F]'
                : 'bg-[#11141E] border border-[#212838] text-gray-400'
            }`}
          >
            Kegel Inverso
          </button>

          {profile.has_partner ? (
            <>
              <button
                type="button"
                onClick={() => setSelectedMode('PARTNER_STOP_START')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMode === 'PARTNER_STOP_START'
                    ? 'bg-[#FF1744] text-white'
                    : 'bg-[#11141E] border border-[#212838] text-gray-400'
                }`}
              >
                Pareja: Stop-Start
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('PARTNER_SQUEEZE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedMode === 'PARTNER_SQUEEZE'
                    ? 'bg-[#FFB300] text-[#090A0F]'
                    : 'bg-[#11141E] border border-[#212838] text-gray-400'
                }`}
              >
                Pareja: Squeeze
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSelectedMode('SOLO_STOP_START')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedMode === 'SOLO_STOP_START'
                  ? 'bg-[#FF1744] text-white'
                  : 'bg-[#11141E] border border-[#212838] text-gray-400'
              }`}
            >
              Solo: Stop-Start 7/10
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsStretchesOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] hover:bg-[#00E676]/25 flex items-center gap-1.5"
          >
            <span>🧘</span>
            <span>Estiramientos</span>
          </button>
        </div>
      )}

      {/* Contenedor Principal: Escena de Biofeedback con Anillo Radial de Tiempo */}
      <div className="oled-card p-4 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#11141E] to-[#090A0F]">
        <SvgTimerRing
          phase={snapshot.phase}
          timeRemainingSec={snapshot.timeRemainingSec}
          normalizedProgress={snapshot.normalizedProgress}
          size={320}
          strokeWidth={10}
        >
          {/* Visualizador Multivista de Biofeedback (Silueta Médica, Ascensor o Orbe) */}
          <div className="w-56 h-56 flex items-center justify-center pointer-events-auto overflow-hidden">
            <PelvicVisualizer
              contractionFactor={snapshot.contractionFactor}
              phase={snapshot.phase}
              className="w-full h-full"
            />
          </div>
        </SvgTimerRing>

        {/* Indicador Central de Tiempo y Fase */}
        <div className="text-center mt-3 w-full max-w-xs">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold text-white font-mono">
              {snapshot.timeRemainingSec}
            </span>
            <span className="text-xs text-gray-400 font-semibold">seg restantes</span>
          </div>

          {/* Único Mensaje de Instrucción Somatosensorial (Claro, Completo y Sin Cortes) */}
          <div className="mt-2.5 px-4 py-2.5 rounded-2xl bg-[#090A0F] border border-[#212838] shadow-inner text-center animate-fadeIn">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span
                className={`text-xs font-black uppercase tracking-wider ${
                  snapshot.phase === 'CONTRACTION'
                    ? 'text-[#7C4DFF]'
                    : snapshot.phase === 'REVERSE_KEGEL'
                    ? 'text-[#00E676]'
                    : snapshot.phase === 'PAUSE_STOP_START'
                    ? 'text-[#FF1744]'
                    : snapshot.phase === 'APPLY_SQUEEZE'
                    ? 'text-[#FFB300]'
                    : 'text-[#00E5FF]'
                }`}
              >
                {snapshot.phase === 'PREPARATION' && 'Prepárate • Posición correcta'}
                {snapshot.phase === 'CONTRACTION' && '▲ Eleva y Cierra (Contrae)'}
                {snapshot.phase === 'RELAXATION' && '■ Reposo Neutro • Respira'}
                {snapshot.phase === 'REVERSE_KEGEL' && '▼ Suelta el Perineo (Kegel Inverso)'}
                {snapshot.phase === 'STIMULATION_ACTIVE' && 'Estimulación Guiada Activa'}
                {snapshot.phase === 'PAUSE_STOP_START' && '¡Pausa Stop-Start de 35s!'}
                {snapshot.phase === 'APPLY_SQUEEZE' && 'Compresión Squeeze (12s)'}
                {snapshot.phase === 'SET_REST' && 'Descanso entre series'}
                {snapshot.phase === 'COMPLETED' && '¡Sesión Finalizada!'}
              </span>
              {Math.abs(snapshot.contractionFactor) > 0.05 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#181D2B] text-gray-300">
                  {Math.round(Math.abs(snapshot.contractionFactor) * 100)}%
                </span>
              )}
            </div>

            <p className="text-xs text-gray-300 font-medium leading-relaxed mt-1">
              {snapshot.phase === 'CONTRACTION' &&
                'Eleva los testículos hacia el ombligo y corta el flujo • Sin apretar glúteos ni abdomen'}
              {snapshot.phase === 'REVERSE_KEGEL' &&
                'Deja caer la entrepierna como al empezar a orinar (relaja suavemente sin pujar)'}
              {snapshot.phase === 'RELAXATION' &&
                'Relaja el 100% del suelo pélvico e inhala inflando la parte baja del abdomen'}
              {snapshot.phase === 'PAUSE_STOP_START' &&
                'Detén toda estimulación y respira hondo hasta que baje la urgencia eyaculatoria'}
              {snapshot.phase === 'APPLY_SQUEEZE' &&
                'Aplica compresión suave con el pulgar en el frenillo para desactivar el reflejo'}
              {snapshot.phase === 'PREPARATION' &&
                'Adopta la postura recomendada y relaja los hombros antes de comenzar'}
              {snapshot.phase === 'SET_REST' &&
                'Recupérate, bebe agua y mantén la mente en calma para la siguiente serie'}
              {snapshot.phase === 'COMPLETED' &&
                '¡Excelente trabajo neuromuscular registrado en tu progreso diario!'}
            </p>
          </div>
        </div>
      </div>

      {/* Guía Dual en Pareja / Solo si aplica */}
      {isPartnerOrSoloMode && (
        <PartnerDualGuide
          mode={selectedMode}
          phase={snapshot.phase}
          arousalLevel={snapshot.arousalLevel}
        />
      )}

      {/* Modal / Card de Sesión Completada */}
      {snapshot.isCompleted && (
        <div className="oled-card p-5 border border-[#00E676]/40 bg-[#00E676]/10 glow-emerald space-y-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E676] text-[#090A0F] flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">¡Sesión de Hoy Completada!</h2>
              <p className="text-xs text-gray-300">
                +125 XP acreditados • Racha: {profile.current_streak + 1} días
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Has completado la dosis neuromuscular prescrita sin compensaciones parasitarias. La neuroplasticidad perineal se consolida con el descanso.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                advanceDay();
                handleReset();
              }}
              className="h-11 rounded-xl bg-[#00E676] text-[#090A0F] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Avanzar al Siguiente Día</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/"
              className="h-11 rounded-xl bg-[#11141E] border border-[#212838] text-white font-bold text-xs flex items-center justify-center cursor-pointer"
            >
              Volver al Hub
            </Link>
          </div>
        </div>
      )}

      {/* Selector de Experiencia Sonora y Biofeedback */}
      <SoundpackSelector />

      {/* Controles de la Thumb-Zone (40 mm Inferiores) */}
      <ThumbZoneControls
        mode={selectedMode}
        phase={snapshot.phase}
        isPaused={snapshot.isPaused}
        arousalLevel={snapshot.arousalLevel}
        zeroParasiticCompensation={snapshot.zeroParasiticCompensation}
        onPlay={handlePlay}
        onPause={handlePause}
        onArousalChange={(level) => stateMachineRef.current?.setArousalLevel(level)}
        onTriggerStopStartPause={() => stateMachineRef.current?.triggerStopStartPause()}
        onTriggerSqueeze={() => stateMachineRef.current?.triggerSqueeze()}
        onToggleParasiticCompensation={(val) =>
          stateMachineRef.current?.setZeroParasiticCompensation(val)
        }
      />
      {/* Modal Guía de Estiramientos Pélvicos Miofasciales */}
      <PelvicStretchesGuide
        isOpen={isStretchesOpen}
        onClose={() => setIsStretchesOpen(false)}
      />
    </div>
  );
}
