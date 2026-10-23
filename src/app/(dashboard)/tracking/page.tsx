'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  Flame,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { TwelveWeekRoadmap } from '@/components/gamification/TwelveWeekRoadmap';
import { AchievementBadges } from '@/components/gamification/AchievementBadges';

export default function TrackingPage() {
  const profile = usePatientStore((s) => s.profile);
  const achievements = usePatientStore((s) => s.unlockedAchievements);
  const assessments = usePatientStore((s) => s.assessments);
  const sessions = usePatientStore((s) => s.trainingSessions);

  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'ACHIEVEMENTS'>('ROADMAP');

  const baselineAssessment = assessments[assessments.length - 1];

  return (
    <div className="space-y-4 pt-1 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-base font-bold text-white">Seguimiento & Logros</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Progreso del Reto de 12 Semanas y Neuroplasticidad
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#11141E] border border-[#212838] px-2.5 py-1 rounded-full text-xs font-bold text-[#00E5FF]">
          <Flame className="w-3.5 h-3.5 text-[#00E5FF] fill-[#00E5FF]" />
          <span>{profile.current_streak} días</span>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="oled-card p-3 border border-[#212838]">
          <span className="text-[10px] text-gray-400 block">IELT Basal</span>
          <span className="text-sm font-bold text-[#00E5FF]">
            {baselineAssessment ? `${baselineAssessment.ielt_seconds}s` : '45s'}
          </span>
        </div>
        <div className="oled-card p-3 border border-[#212838]">
          <span className="text-[10px] text-gray-400 block">Puntaje PEDT</span>
          <span className="text-sm font-bold text-[#7C4DFF]">
            {baselineAssessment ? `${baselineAssessment.pedt_score}/20` : '14/20'}
          </span>
        </div>
        <div className="oled-card p-3 border border-[#212838]">
          <span className="text-[10px] text-gray-400 block">Sesiones</span>
          <span className="text-sm font-bold text-[#00E676]">
            {sessions.length}
          </span>
        </div>
      </div>

      {/* Selector de Pestaña: Hoja de Ruta vs. Insignias */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#11141E] rounded-2xl border border-[#212838]">
        <button
          type="button"
          onClick={() => setActiveTab('ROADMAP')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'ROADMAP'
              ? 'bg-[#00E5FF] text-[#090A0F] shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Mapa 12 Semanas</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ACHIEVEMENTS')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'ACHIEVEMENTS'
              ? 'bg-[#7C4DFF] text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Logros ({achievements.length}/5)</span>
        </button>
      </div>

      {/* Contenido Dinámico */}
      {activeTab === 'ROADMAP' ? (
        <TwelveWeekRoadmap />
      ) : (
        <AchievementBadges />
      )}
    </div>
  );
}
