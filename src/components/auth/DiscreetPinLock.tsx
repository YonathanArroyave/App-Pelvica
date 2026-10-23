'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Delete, Lock, Unlock } from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';

interface DiscreetPinLockProps {
  onSuccess?: () => void;
  mode?: 'VERIFY' | 'SETUP';
  onSetupComplete?: (pin: string) => void;
}

export function DiscreetPinLock({ onSuccess, mode = 'VERIFY', onSetupComplete }: DiscreetPinLockProps) {
  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [firstPin, setFirstPin] = useState<string>('');

  const verifyPin = usePatientStore((s) => s.verifyPin);
  const setStorePin = usePatientStore((s) => s.setPin);
  const unlockApp = usePatientStore((s) => s.unlockApp);

  const triggerHaptic = (duration = 30) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  const handleKeyPress = useCallback((digit: string) => {
    triggerHaptic(20);
    setErrorMessage(null);
    setPin((prev) => {
      if (prev.length < 4) {
        return prev + digit;
      }
      return prev;
    });
  }, []);

  const handleDelete = useCallback(() => {
    triggerHaptic(15);
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  }, []);

  const handleClear = useCallback(() => {
    triggerHaptic(25);
    setPin('');
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      const processPin = async () => {
        if (mode === 'VERIFY') {
          const isValid = await verifyPin(pin);
          if (isValid) {
            triggerHaptic(50);
            unlockApp();
            onSuccess?.();
          } else {
            triggerHaptic(100);
            setErrorShake(true);
            setErrorMessage('PIN incorrecto');
            setTimeout(() => {
              setPin('');
              setErrorShake(false);
            }, 600);
          }
        } else if (mode === 'SETUP') {
          if (setupStep === 1) {
            setFirstPin(pin);
            setPin('');
            setSetupStep(2);
          } else {
            if (pin === firstPin) {
              await setStorePin(pin);
              triggerHaptic(50);
              onSetupComplete?.(pin);
              onSuccess?.();
            } else {
              triggerHaptic(100);
              setErrorShake(true);
              setErrorMessage('Los PINs no coinciden. Intenta de nuevo.');
              setTimeout(() => {
                setPin('');
                setFirstPin('');
                setSetupStep(1);
                setErrorShake(false);
              }, 700);
            }
          }
        }
      };

      processPin();
    }
  }, [pin, mode, setupStep, firstPin, verifyPin, setStorePin, unlockApp, onSuccess, onSetupComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#090A0F] text-[#F0F4F8] px-6 py-10 select-none">
      {/* Header Discreto: Cero referencias médicas explícitas */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-12 h-12 rounded-2xl bg-[#11141E] border border-[#212838] flex items-center justify-center text-[#00E5FF] mb-4 shadow-lg shadow-cyan-950/20">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-base font-medium tracking-wide text-gray-300">
          {mode === 'SETUP'
            ? setupStep === 1
              ? 'Configura tu PIN de 4 dígitos'
              : 'Confirma tu PIN'
            : 'Acceso Seguro'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {mode === 'SETUP' ? 'Protege tu privacidad clínica' : 'Ingresa tu código de desbloqueo'}
        </p>
      </div>

      {/* Indicadores de PIN (4 puntos) */}
      <div
        className={`flex items-center gap-6 my-6 transition-transform duration-200 ${
          errorShake ? 'translate-x-[-8px] animate-pulse' : ''
        }`}
      >
        {[0, 1, 2, 3].map((index) => {
          const isFilled = pin.length > index;
          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                isFilled
                  ? 'bg-[#00E5FF] scale-110 shadow-lg shadow-cyan-400/50'
                  : 'bg-[#181D2B] border border-[#212838]'
              }`}
            />
          );
        })}
      </div>

      {errorMessage && (
        <p className="text-xs text-[#FF1744] font-medium animate-fadeIn">{errorMessage}</p>
      )}

      {/* Teclado Numérico Ergonómico (Diseñado para una sola mano) */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleKeyPress(digit)}
            className="h-16 rounded-2xl bg-[#11141E] border border-[#212838] text-2xl font-light text-[#F0F4F8] hover:bg-[#181D2B] active:scale-95 active:bg-[#00E5FF]/20 active:border-[#00E5FF] transition-all flex items-center justify-center shadow-sm"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          onClick={handleClear}
          className="h-16 rounded-2xl bg-[#11141E]/40 border border-[#212838]/50 text-xs font-semibold text-gray-400 active:scale-95 transition-all flex items-center justify-center uppercase tracking-wider"
        >
          Borrar
        </button>

        <button
          type="button"
          onClick={() => handleKeyPress('0')}
          className="h-16 rounded-2xl bg-[#11141E] border border-[#212838] text-2xl font-light text-[#F0F4F8] hover:bg-[#181D2B] active:scale-95 active:bg-[#00E5FF]/20 active:border-[#00E5FF] transition-all flex items-center justify-center shadow-sm"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="h-16 rounded-2xl bg-[#11141E]/40 border border-[#212838]/50 text-gray-400 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Borrar último dígito"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Footer confidencial */}
      <div className="flex items-center gap-2 text-gray-500 text-[11px] mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
        <span>Cifrado local seguro • Privacidad médica total</span>
      </div>
    </div>
  );
}
