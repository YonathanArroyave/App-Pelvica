'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Stethoscope } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F0F4F8] p-5 max-w-md mx-auto flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="p-2 rounded-lg bg-[#11141E] text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-semibold">Cribado Clínico y Evaluación Basal</h1>
        </div>
        <div className="oled-card p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-white">Módulo 1: Evaluación Inicial</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Este módulo calibra tu tono basal mediante el Screener de Hipertonía, calcula el puntaje PEDT y registra tu IELT de inicio para personalizar el reto de 12 semanas.
          </p>
        </div>
      </div>
      <div className="pt-4">
        <Link
          href="/"
          className="w-full h-12 rounded-xl bg-[#00E5FF] text-[#090A0F] font-semibold text-sm flex items-center justify-center"
        >
          Ir al Reto
        </Link>
      </div>
    </div>
  );
}
