'use client';

import React from 'react';
import {
  Users,
  Hand,
  PauseCircle,
  Heart,
  Sparkles,
  AlertOctagon,
  ShieldCheck
} from 'lucide-react';
import { ActivePhase, ExerciseMode } from '@/core/types/clinical.types';

interface PartnerDualGuideProps {
  mode: ExerciseMode;
  phase: ActivePhase;
  arousalLevel: number;
}

export function PartnerDualGuide({
  mode,
  phase,
  arousalLevel
}: PartnerDualGuideProps) {
  const isStopStart = mode === 'PARTNER_STOP_START' || mode === 'SOLO_STOP_START';
  const isSqueeze = mode === 'PARTNER_SQUEEZE';
  const isSensateI = mode === 'SENSATE_FOCUS_I';
  const isSensateII = mode === 'SENSATE_FOCUS_II';

  // Determinación de instrucciones duales
  let partnerInstruction = 'Acaricia suavemente el cuerpo de tu pareja sin prisas.';
  let patientInstruction = 'Cierra los ojos y focaliza en la temperatura y el tacto en tu piel.';
  let partnerActionStatus: 'ACTIVE_TOUCH' | 'PAUSE_REQUIRED' | 'SQUEEZE_REQUIRED' | 'REST' =
    'ACTIVE_TOUCH';

  if (isSensateI) {
    partnerInstruction =
      'Caricias suaves en espalda, hombros, cuello y extremidades. ZONA GENITAL EXCLUIDA rigurosamente para anular la presión de rendimiento.';
    patientInstruction =
      'Respira lento y profundo. Si notas que tu mente viaja a evaluar tu respuesta, redirige tu atención a la textura de sus manos.';
    partnerActionStatus = 'ACTIVE_TOUCH';
  } else if (isSensateII) {
    partnerInstruction =
      'Exploración genital suave sin objetivo de erección ni orgasmo. Cambia de ritmo si notas tensión.';
    patientInstruction =
      'Prohibido intentar mantener la erección. Disfruta de la sensación pura sin espectadorismo.';
    partnerActionStatus = 'ACTIVE_TOUCH';
  } else if (isStopStart) {
    if (phase === 'PAUSE_STOP_START') {
      partnerInstruction =
        '¡DETENER ESTIMULACIÓN! Retira completamente las manos y permanece en contacto quieto sin frotar.';
      patientInstruction =
        'Realiza Kegel Inverso (empuja suavemente hacia abajo con el diafragma) hasta que la excitación baje a 3-4/10.';
      partnerActionStatus = 'PAUSE_REQUIRED';
    } else {
      partnerInstruction =
        'Estimula con ritmo moderado y caricias continuas. Mantén la mirada atenta a la señal de nivel 7-8/10.';
      patientInstruction =
        'Identifica tus sensaciones uretrales y perineales. Al llegar a nivel 7-8/10, avisa a tu pareja o presiona Pausa.';
      partnerActionStatus = 'ACTIVE_TOUCH';
    }
  } else if (isSqueeze) {
    if (phase === 'APPLY_SQUEEZE') {
      partnerInstruction =
        '¡APLICAR SQUEEZE! Coloca el pulgar en el frenillo y los dedos índice/medio en la cara dorsal sobre el surco coronal. Presiona con firmeza constante durante 10-15 segundos.';
      patientInstruction =
        'Relaja el suelo pélvico por completo. La compresión inhibe el reflejo eyaculatorio y reduce la turgencia.';
      partnerActionStatus = 'SQUEEZE_REQUIRED';
    } else {
      partnerInstruction =
        'Estimulación guiada hacia la excitación progresiva previa al punto de no retorno.';
      patientInstruction =
        'Monitorea la excitación. En nivel 8/10 se ejecutará la compresión Squeeze.';
      partnerActionStatus = 'ACTIVE_TOUCH';
    }
  }

  return (
    <div className="space-y-3">
      {/* Alerta de Acción en Tiempo Real para la Pareja */}
      <div
        className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
          partnerActionStatus === 'PAUSE_REQUIRED'
            ? 'bg-[#FF1744]/15 border-[#FF1744]/50 glow-crimson'
            : partnerActionStatus === 'SQUEEZE_REQUIRED'
            ? 'bg-[#FFB300]/15 border-[#FFB300]/50 shadow-md shadow-amber-500/20'
            : 'bg-[#11141E] border-[#212838]'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7C4DFF]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Guía Dual en Pareja
            </span>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              partnerActionStatus === 'PAUSE_REQUIRED'
                ? 'bg-[#FF1744] text-[#090A0F]'
                : partnerActionStatus === 'SQUEEZE_REQUIRED'
                ? 'bg-[#FFB300] text-[#090A0F]'
                : 'bg-[#00E676]/20 text-[#00E676]'
            }`}
          >
            {partnerActionStatus === 'PAUSE_REQUIRED' && (
              <>
                <PauseCircle className="w-3 h-3" /> Pausa Táctil 30-45s
              </>
            )}
            {partnerActionStatus === 'SQUEEZE_REQUIRED' && (
              <>
                <AlertOctagon className="w-3 h-3" /> Compresión Squeeze 10-15s
              </>
            )}
            {partnerActionStatus === 'ACTIVE_TOUCH' && (
              <>
                <Hand className="w-3 h-3" /> Estimulación Activa
              </>
            )}
          </span>
        </div>

        {/* Panel Dividido: Rol de la Pareja vs Rol del Paciente */}
        <div className="grid grid-cols-2 gap-2.5 mt-2">
          {/* Tarjeta Pareja */}
          <div className="bg-[#090A0F]/80 p-3 rounded-xl border border-[#212838] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#7C4DFF] block">
              Rol de la Pareja:
            </span>
            <p className="text-[11px] text-gray-200 leading-snug">
              {partnerInstruction}
            </p>
          </div>

          {/* Tarjeta Paciente */}
          <div className="bg-[#090A0F]/80 p-3 rounded-xl border border-[#212838] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#00E5FF] block">
              Tu Rol (Paciente):
            </span>
            <p className="text-[11px] text-gray-200 leading-snug">
              {patientInstruction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
