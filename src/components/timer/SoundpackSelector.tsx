'use client';

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  Radio,
  Bell,
  Check
} from 'lucide-react';
import { sensoryEngine } from '@/core/engine/sensoryFeedbackEngine';
import { advancedAudio, SoundpackType } from '@/core/engine/advancedAudioEngine';

interface SoundpackSelectorProps {
  onSoundpackChange?: (pack: SoundpackType) => void;
}

export function SoundpackSelector({ onSoundpackChange }: SoundpackSelectorProps) {
  const [currentPack, setCurrentPack] = useState<SoundpackType>(
    advancedAudio.getSoundpack()
  );

  const handleSelect = (pack: SoundpackType) => {
    setCurrentPack(pack);
    sensoryEngine.setSoundpack(pack);
    onSoundpackChange?.(pack);

    // Reproducir vista previa de sonido
    if (pack === 'ZEN') {
      advancedAudio.playTibetanSingingBowl(216);
    } else if (pack === 'CLINICAL') {
      advancedAudio.playToneDirect([523.25], 'sine', 350, 0.7);
    }
  };

  return (
    <div className="oled-card p-4 space-y-3 border border-[#212838]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Music className="w-4 h-4 text-[#00E5FF]" />
          Experiencia Sonora & Biofeedback
        </span>
        <span className="text-[10px] font-semibold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-md">
          {currentPack === 'ZEN' && '🧘 Zen (432 Hz)'}
          {currentPack === 'CLINICAL' && '🔬 Biofeedback Clínico'}
          {currentPack === 'MUTED' && '🔕 Silencioso (Háptico)'}
        </span>
      </div>

      <p className="text-[11px] text-gray-400">
        Personaliza los estímulos auditivos para favorecer la relajación del elevador del ano y la concentración:
      </p>

      {/* Tarjetas de Selección de Soundpack */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* Opción 1: Zen 432 Hz */}
        <button
          type="button"
          onClick={() => handleSelect('ZEN')}
          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between cursor-pointer ${
            currentPack === 'ZEN'
              ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-sm shadow-cyan-950/20'
              : 'bg-[#090A0F] border-[#212838] text-gray-400 hover:text-white'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center mb-1">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-white block">Zen 432Hz</span>
          <span className="text-[9px] text-gray-400 block mt-0.5">Cuenco Tibetano</span>
        </button>

        {/* Opción 2: Clínico */}
        <button
          type="button"
          onClick={() => handleSelect('CLINICAL')}
          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between cursor-pointer ${
            currentPack === 'CLINICAL'
              ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] shadow-sm shadow-violet-950/20'
              : 'bg-[#090A0F] border-[#212838] text-gray-400 hover:text-white'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center mb-1">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-white block">Clínico</span>
          <span className="text-[9px] text-gray-400 block mt-0.5">Pips Precisos</span>
        </button>

        {/* Opción 3: Discreto / Silencio */}
        <button
          type="button"
          onClick={() => handleSelect('MUTED')}
          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between cursor-pointer ${
            currentPack === 'MUTED'
              ? 'bg-[#00E676]/15 border-[#00E676] shadow-sm shadow-emerald-950/20'
              : 'bg-[#090A0F] border-[#212838] text-gray-400 hover:text-white'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-[#00E676]/10 text-[#00E676] flex items-center justify-center mb-1">
            <VolumeX className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-white block">Discreto</span>
          <span className="text-[9px] text-gray-400 block mt-0.5">Solo Vibración</span>
        </button>
      </div>
    </div>
  );
}
