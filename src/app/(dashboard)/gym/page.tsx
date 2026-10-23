'use client';

import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { getProtocolForWeek } from '@/core/engine/clinicalProgressionRules';

export default function GymPage() {
  const profile = usePatientStore((s) => s.profile);
  const protocol = getProtocolForWeek(profile.current_week, profile.has_hypertonia);

  return (
    <div className="space-y-4 pt-2">
      <div className="oled-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Gym Pélvico Neuromuscular</h1>
            <p className="text-xs text-gray-400">Semana {profile.current_week} • {protocol.phaseName}</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#181D2B] border border-[#212838] my-3 text-xs text-gray-300">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <span className="font-semibold text-white">Instrucción Biomecánica:</span>
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            {protocol.clinicalInstructions}
          </p>
        </div>
      </div>
    </div>
  );
}
