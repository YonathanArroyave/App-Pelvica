// ==============================================================================
// TDD Test Suite: Advanced Audio Engine & Acoustic Soundpacks
// Project: pelvic-rehab-12w-pwa (Reto Clínico de 12 Semanas)
// Standards: Tone.js / Web Audio API Hybrid, Offline-First, Zero Latency
// ==============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  AdvancedAudioEngine,
  SoundpackType
} from '../advancedAudioEngine';

describe('AdvancedAudioEngine (Tone.js / Web Audio Design)', () => {
  let audioEngine: AdvancedAudioEngine;

  beforeEach(() => {
    audioEngine = new AdvancedAudioEngine();
  });

  it('debe inicializarse con el soundpack ZEN por defecto', () => {
    expect(audioEngine.getSoundpack()).toBe('ZEN');
  });

  it('debe permitir cambiar de soundpack entre ZEN, CLINICAL y MUTED', () => {
    audioEngine.setSoundpack('CLINICAL');
    expect(audioEngine.getSoundpack()).toBe('CLINICAL');

    audioEngine.setSoundpack('MUTED');
    expect(audioEngine.getSoundpack()).toBe('MUTED');

    audioEngine.setSoundpack('ZEN');
    expect(audioEngine.getSoundpack()).toBe('ZEN');
  });

  it('no debe emitir sonido si el soundpack es MUTED', () => {
    audioEngine.setSoundpack('MUTED');
    const playSpy = vi.spyOn(audioEngine, 'playToneDirect');

    audioEngine.playPhaseSound('CONTRACTION');
    audioEngine.playPhaseSound('RELAXATION');
    audioEngine.playPhaseSound('REVERSE_KEGEL');

    expect(playSpy).not.toHaveBeenCalled();
  });

  it('debe ajustar el volumen dentro del rango permitido (0 a 1)', () => {
    audioEngine.setVolume(0.8);
    expect(audioEngine.getVolume()).toBe(0.8);

    audioEngine.setVolume(1.5); // Limitar a 1.0
    expect(audioEngine.getVolume()).toBe(1.0);

    audioEngine.setVolume(-0.2); // Limitar a 0.0
    expect(audioEngine.getVolume()).toBe(0.0);
  });
});
