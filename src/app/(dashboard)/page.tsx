'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  HeartPulse,
  Brain,
  Info,
  Lock,
  Settings
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { getProtocolForWeek } from '@/core/engine/clinicalProgressionRules';
import { PatientProfileModal } from '@/components/profile/PatientProfileModal';

export default function DashboardHubPage() {
  const profile = usePatientStore((s) => s.profile);
  const assessments = usePatientStore((s) => s.assessments);
  const lockApp = usePatientStore((s) => s.lockApp);
  const currentProtocol = getProtocolForWeek(profile.current_week, profile.has_hypertonia);
  const hasCompletedOnboarding = assessments.length > 0;

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const globalDayNumber = ((profile.current_week - 1) * 7) + profile.current_day;

  return (
    <div className="space-y-5 pt-3 animate-fadeIn">
      {/* Banner de Onboarding Pendiente si es la primera vez */}
      {!hasCompletedOnboarding && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00E5FF]/15 via-[#7C4DFF]/15 to-[#00E5FF]/10 border border-[#00E5FF]/40 glow-cyan flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#00E5FF] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              Cribado Basal Pendiente
            </span>
            <p className="text-[11px] text-gray-300">
              Calibra tu tono basal, calcula tu PEDT y registra tu tiempo de inicio.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="px-3.5 py-2 rounded-xl bg-[#00E5FF] text-[#090A0F] text-xs font-bold shrink-0 hover:bg-[#00cce6] transition-all flex items-center gap-1"
          >
            <span>Evaluar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Tarjeta de Bienvenida y Estado del Paciente */}
      <div className="oled-card p-5 relative overflow-hidden bg-gradient-to-br from-[#11141E] via-[#11141E] to-[#181D2B]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Reto Clínico 12 Semanas
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                Día {globalDayNumber} de 84
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">
              Hola, {profile.alias}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            {profile.pin_hash && (
              <button
                type="button"
                onClick={lockApp}
                title="Bloquear aplicación con PIN"
                className="p-2 rounded-xl bg-[#181D2B] border border-[#212838] text-gray-300 hover:text-[#7C4DFF] hover:border-[#7C4DFF]/40 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              title="Ajustes de Perfil y Privacidad"
              className="p-2 rounded-xl bg-[#181D2B] border border-[#212838] text-gray-300 hover:text-white hover:border-gray-500 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Indicador de Racha, Neuroplasticidad y Progreso */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-[#212838] text-xs">
          <div>
            <span className="text-[10px] text-gray-400 block">Semana Activa</span>
            <span className="font-bold text-white text-[11px]">
              Semana {profile.current_week} / 12
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block">Racha Actual</span>
            <span className="font-bold text-[#FFB300] flex items-center gap-1 text-[11px]">
              <Flame className="w-3.5 h-3.5 fill-[#FFB300]" />
              {profile.current_streak} días
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block">Neuroplasticidad</span>
            <span className="font-bold text-[#7C4DFF] flex items-center gap-1 text-[11px]">
              <Award className="w-3.5 h-3.5" />
              {profile.neuroplasticity_xp} XP
            </span>
          </div>
        </div>

        {/* Alerta Médica de Hipertonía (Bloqueador de Seguridad Activo) */}
        {profile.has_hypertonia ? (
          <div className="mt-4 p-3.5 rounded-xl bg-[#FF1744]/10 border border-[#FF1744]/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#FF1744] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-[#FF1744]">Protocolo de Seguridad Activado</p>
              <p className="text-gray-300 mt-0.5 leading-relaxed">
                Se han detectado signos de hipertonía basal. Las contracciones activas permanecen bloqueadas.
                Tu prescripción de hoy es <strong>Down-Training</strong> (Kegel inverso + respiración diafragmática).
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" />
              <span className="text-xs text-gray-300">
                Tono basal normalizado • Aislamiento seguro
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#00E676] bg-[#00E676]/15 px-2 py-0.5 rounded-full">
              Activo
            </span>
          </div>
        )}
      </div>

      {/* Tarjeta de Prescripción Diaria (Paso Mandatorio del Día) */}
      <div className="oled-card p-5 border border-[#00E5FF]/30 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF] uppercase tracking-wider">
            <HeartPulse className="w-4 h-4 text-[#00E5FF]" />
            Prescripción de Hoy
          </span>
          <span className="text-xs bg-[#181D2B] text-gray-300 px-2.5 py-0.5 rounded-full border border-[#212838]">
            {currentProtocol.bodyPosition === 'SUPINE' && 'Decúbito Supino'}
            {currentProtocol.bodyPosition === 'SEATED' && 'Sedestación'}
            {currentProtocol.bodyPosition === 'STANDING' && 'Bipedestación'}
            {currentProtocol.bodyPosition === 'COITAL' && 'Posición Coital'}
          </span>
        </div>

        <h2 className="text-base font-semibold text-white">
          {currentProtocol.phaseName}
        </h2>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          {currentProtocol.clinicalInstructions}
        </p>

        {/* Especificaciones de Dosificación */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="bg-[#090A0F] border border-[#212838] p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-gray-400 block">Series Diarias</span>
            <span className="text-sm font-bold text-white">{currentProtocol.dailySets}</span>
          </div>
          <div className="bg-[#090A0F] border border-[#212838] p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-gray-400 block">Tónicas</span>
            <span className="text-sm font-bold text-[#00E5FF]">
              {currentProtocol.tonicSpecs.reps > 0
                ? `${currentProtocol.tonicSpecs.reps}x (${currentProtocol.tonicSpecs.holdSec}s)`
                : 'Bloqueado'}
            </span>
          </div>
          <div className="bg-[#090A0F] border border-[#212838] p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-gray-400 block">Fásicas</span>
            <span className="text-sm font-bold text-[#7C4DFF]">
              {currentProtocol.phasicSpecs.reps > 0
                ? `${currentProtocol.phasicSpecs.reps}x (${currentProtocol.phasicSpecs.holdSec}s)`
                : 'Bloqueado'}
            </span>
          </div>
        </div>

        {/* CTA Iniciar Sesión en Gym */}
        <Link
          href="/gym"
          className="w-full h-13 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-cyan-500/25 cursor-pointer glow-cyan"
        >
          <Play className="w-5 h-5 fill-[#090A0F]" />
          <span>Iniciar Sesión Guiada</span>
        </Link>
      </div>

      {/* Accesos Rápidos a Módulos Complementarios */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/cbt"
          className="oled-card p-4 hover:border-[#7C4DFF]/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#7C4DFF]/15 text-[#7C4DFF] flex items-center justify-center mb-2.5">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-white">Módulo CBT-STP</h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-snug">
              Matriz de Sliders y ruptura de bucle de Barlow.
            </p>
          </div>
          <span className="text-[10px] font-medium text-[#7C4DFF] flex items-center gap-1 mt-3">
            Explorar <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          href="/tracking"
          className="oled-card p-4 hover:border-[#00E676]/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#00E676]/15 text-[#00E676] flex items-center justify-center mb-2.5">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-white">Logros e IELT</h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-snug">
              Curvas evolutivas y catálogo de neuroplasticidad.
            </p>
          </div>
          <span className="text-[10px] font-medium text-[#00E676] flex items-center gap-1 mt-3">
            Ver progreso <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Banner de Evidencia y Adherencia */}
      <div className="oled-card p-4 border border-[#212838] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#181D2B] flex items-center justify-center text-[#FFB300] shrink-0">
          <Info className="w-5 h-5 text-[#FFB300]" />
        </div>
        <div className="text-xs">
          <p className="font-medium text-white">Consistencia = Neuroplasticidad</p>
          <p className="text-gray-400 mt-0.5 text-[11px]">
            Los RCTs (Pastore et al.) demuestran que 12 semanas de PFMT multiplican el IELT por más de 4x sin recaídas a 5 años.
          </p>
        </div>
      </div>

      {/* Modal de Ajustes de Perfil y Privacidad */}
      <PatientProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
