'use client';

import React from 'react';
import { BarChart3, Award, Flame } from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';

export default function TrackingPage() {
  const profile = usePatientStore((s) => s.profile);
  const achievements = usePatientStore((s) => s.unlockedAchievements);

  return (
    <div className="space-y-4 pt-2">
      <div className="oled-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Seguimiento y Logros</h1>
            <p className="text-xs text-gray-400">Evolución de IELT, PEDT y Adherencia</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="bg-[#181D2B] p-3 rounded-xl text-center border border-[#212838]">
            <span className="text-[10px] text-gray-400 block">Racha Actual</span>
            <span className="text-lg font-bold text-[#00E5FF] flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-[#00E5FF]" /> {profile.current_streak} días
            </span>
          </div>
          <div className="bg-[#181D2B] p-3 rounded-xl text-center border border-[#212838]">
            <span className="text-[10px] text-gray-400 block">Logros Clínicos</span>
            <span className="text-lg font-bold text-[#7C4DFF] flex items-center justify-center gap-1">
              <Award className="w-4 h-4" /> {achievements.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
