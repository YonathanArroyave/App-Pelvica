'use client';

import React from 'react';
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Shield,
  ShieldCheck,
  Brain,
  Flame,
  Zap
} from 'lucide-react';
import { ACHIEVEMENT_CATALOG } from '@/core/engine/clinicalProgressionRules';
import { usePatientStore } from '@/core/store/usePatientStore';

export function AchievementBadges() {
  const profile = usePatientStore((s) => s.profile);
  const unlocked = usePatientStore((s) => s.unlockedAchievements);

  // Cálculo de nivel de neuroplasticidad
  const level = Math.floor(profile.neuroplasticity_xp / 500) + 1;
  const xpCurrentLevel = profile.neuroplasticity_xp % 500;
  const xpProgressPercent = Math.min((xpCurrentLevel / 500) * 100, 100);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM':
        return 'text-[#00E5FF] border-[#00E5FF]/50 bg-[#00E5FF]/10';
      case 'GOLD':
        return 'text-[#FFB300] border-[#FFB300]/50 bg-[#FFB300]/10';
      case 'SILVER':
        return 'text-gray-300 border-gray-400/40 bg-gray-400/10';
      case 'BRONZE':
      default:
        return 'text-[#FF8A65] border-[#FF8A65]/40 bg-[#FF8A65]/10';
    }
  };

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'COGNITIVE':
        return Brain;
      case 'PARTNER':
        return Flame;
      case 'NEUROMUSCULAR':
        return Zap;
      case 'ENDURANCE':
      default:
        return Award;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Progreso de Neuroplasticidad XP y Nivel */}
      <div className="oled-card p-4 space-y-3 border border-[#212838]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#7C4DFF]/15 text-[#7C4DFF] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide">
                Nivel {level} de Neuroplasticidad
              </span>
              <p className="text-[10px] text-gray-400">
                {profile.neuroplasticity_xp} XP totales acumulados
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-[#00E5FF] font-bold">
              {xpCurrentLevel} / 500 XP
            </span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="h-2.5 w-full bg-[#090A0F] rounded-full overflow-hidden border border-[#212838]">
          <div
            className="h-full bg-gradient-to-r from-[#00E5FF] via-[#7C4DFF] to-[#00E676] transition-all duration-500 rounded-full"
            style={{ width: `${xpProgressPercent}%` }}
          />
        </div>

        {/* Estado del Escudo Grace Token */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
            Escudos Grace Token:
          </span>
          <span className="font-semibold text-white">
            {profile.grace_tokens_remaining} disponible{profile.grace_tokens_remaining !== 1 ? 's' : ''} (Protección semanal)
          </span>
        </div>
      </div>

      {/* Catálogo de Medallas e Insignias Clínicas */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
          Insignias de Neuroplasticidad Pélvica:
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {ACHIEVEMENT_CATALOG.map((item) => {
            const isUnlocked = unlocked.includes(item.code);
            const Icon = getBadgeIcon(item.category);
            const tierStyle = getTierColor(item.badge_tier);

            return (
              <div
                key={item.code}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-[#11141E] border-[#00E5FF]/30 shadow-md shadow-cyan-950/20'
                    : 'bg-[#11141E]/40 border-[#212838] opacity-60'
                }`}
              >
                {/* Icono de la Medalla */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked ? tierStyle : 'bg-[#181D2B] border-[#212838] text-gray-600'
                  }`}
                >
                  {isUnlocked ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                {/* Detalles del Logro */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isUnlocked ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isUnlocked
                          ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30'
                          : 'bg-[#181D2B] text-gray-500'
                      }`}
                    >
                      {isUnlocked ? 'Desbloqueado' : `Semana ${item.required_week}`}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
