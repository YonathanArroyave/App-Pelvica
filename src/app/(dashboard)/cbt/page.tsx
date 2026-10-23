'use client';

import React from 'react';
import { Brain, Sliders } from 'lucide-react';

export default function CbtPage() {
  return (
    <div className="space-y-4 pt-2">
      <div className="oled-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">CBT-Mobile & Matriz STP</h1>
            <p className="text-xs text-gray-400">Sexual Tipping Point® & Bucle de Barlow</p>
          </div>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Reestructuración cognitiva sexológica para neutralizar la hipervigilancia simpática y el espectadorismo (spectatoring).
        </p>
      </div>
    </div>
  );
}
