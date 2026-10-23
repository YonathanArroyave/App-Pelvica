'use client';

import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EduSaludPage() {
  return (
    <div className="space-y-4 pt-2">
      <div className="oled-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFB300]/10 text-[#FFB300] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">EduSalud: Evidencia Clínica</h1>
            <p className="text-xs text-gray-400">PFMT vs. Farmacoterapia (Dapoxetina)</p>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          La rehabilitación neuromuscular (PFMT) ofrece reorganización reflexogénica permanente con tasa de éxito de hasta 81% a 5 años sin toxicidad química.
        </p>

        {/* Resumen comparativo */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Fisioterapia Pélvica (PFMT)</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Aumento de IELT &gt; 4x con efectos duraderos a 5 años sin recaída.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#FF1744]/10 border border-[#FF1744]/20 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FF1744] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Dapoxetina 30/60 mg</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Reversión a valores basales al suspender y efectos secundarios frecuentes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
