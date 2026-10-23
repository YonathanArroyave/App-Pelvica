'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Activity,
  Brain,
  BarChart3,
  BookOpen,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const profile = usePatientStore((s) => s.profile);
  const lockApp = usePatientStore((s) => s.lockApp);

  const navItems = [
    { label: 'Reto 12W', href: '/', icon: Flame },
    { label: 'Gym 3D', href: '/gym', icon: Activity },
    { label: 'CBT-STP', href: '/cbt', icon: Brain },
    { label: 'Progreso', href: '/tracking', icon: BarChart3 },
    { label: 'EduSalud', href: '/edusalud', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F0F4F8] flex flex-col justify-between max-w-md mx-auto relative border-x border-[#181D2B]/40 shadow-2xl">
      {/* Top Bar Discreto */}
      <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-md border-b border-[#212838] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#11141E] border border-[#212838] flex items-center justify-center text-[#00E5FF] shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white tracking-wide">
                Semana {profile.current_week}
              </span>
              <span className="text-[10px] text-gray-400">• Día {profile.current_day}/7</span>
            </div>
            {profile.has_hypertonia ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#FFB300] font-medium">
                <ShieldAlert className="w-3 h-3 text-[#FFB300]" />
                Modo Down-Training
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#00E676] font-medium">
                <ShieldCheck className="w-3 h-3 text-[#00E676]" />
                Aislamiento Activo
              </span>
            )}
          </div>
        </div>

        {/* Indicadores de Racha y Bloqueo */}
        <div className="flex items-center gap-2">
          {/* Grace Token */}
          <div className="flex items-center gap-1 bg-[#11141E] border border-[#212838] px-2.5 py-1 rounded-full text-[11px] text-gray-300">
            <Sparkles className="w-3 h-3 text-[#7C4DFF]" />
            <span>{profile.grace_tokens_remaining} escudo{profile.grace_tokens_remaining !== 1 ? 's' : ''}</span>
          </div>

          {/* Racha */}
          <div className="flex items-center gap-1 bg-[#11141E] border border-[#212838] px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#00E5FF]">
            <Flame className="w-3 h-3 text-[#00E5FF] fill-[#00E5FF]" />
            <span>{profile.current_streak} d</span>
          </div>

          {/* Botón de bloqueo manual si tiene PIN */}
          {profile.pin_hash && (
            <button
              onClick={() => lockApp()}
              title="Bloqueo Rápido de Privacidad"
              className="p-1.5 rounded-lg bg-[#11141E] border border-[#212838] text-gray-400 hover:text-white active:scale-95 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Contenido Principal con padding inferior para no solapar la Thumb-Zone de 40mm */}
      <main className="flex-1 pb-28 pt-2 px-4 overflow-y-auto">
        {children}
      </main>

      {/* Thumb-Zone Dock Fija Inferior (40mm de ergonomía estricta) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto thumb-zone-dock flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#00E5FF] scale-105 font-medium'
                  : 'text-gray-400 hover:text-gray-200 active:scale-95'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#00E5FF]/10 shadow-sm shadow-cyan-400/20' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#00E5FF]' : 'text-gray-400'}`} />
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
