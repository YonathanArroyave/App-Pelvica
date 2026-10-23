'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Shield, ArrowRight, UserCheck, KeyRound, Sparkles } from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { DiscreetPinLock } from '@/components/auth/DiscreetPinLock';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const profile = usePatientStore((s) => s.profile);
  const isLocked = usePatientStore((s) => s.isLocked);
  const setAlias = usePatientStore((s) => s.setAlias);
  const unlockApp = usePatientStore((s) => s.unlockApp);

  const [aliasInput, setAliasInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Si la app está bloqueada por PIN existente, mostrar directamente el teclado de PIN
  if (isLocked && profile.pin_hash) {
    return (
      <DiscreetPinLock
        mode="VERIFY"
        onSuccess={() => {
          router.push('/');
        }}
      />
    );
  }

  const handleAnonymousAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const chosenAlias = aliasInput.trim() || 'Paciente';
    setAlias(chosenAlias);
    unlockApp();
    
    // Si aún no tiene PIN configurado, ofrecer configurarlo o entrar directo
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 400);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setLoading(true);

    if (!isSupabaseConfigured) {
      setStatusMessage('Modo local privado activo. Accediendo con tu alias...');
      setTimeout(() => {
        setAlias(emailInput.split('@')[0] || 'Paciente');
        unlockApp();
        setLoading(false);
        router.push('/');
      }, 700);
      return;
    }

    setStatusMessage('Enviando enlace discreto de acceso...');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailInput,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });

      if (error) {
        setStatusMessage('Nota: Modo sin conexión activo. Accediendo con alias seguro.');
        setTimeout(() => {
          setAlias(emailInput.split('@')[0]);
          unlockApp();
          router.push('/');
        }, 1200);
      } else {
        setStatusMessage('Enlace enviado a tu correo. Revisa tu bandeja de entrada.');
      }
    } catch {
      setStatusMessage('Accediendo en modo local...');
      setTimeout(() => {
        setAlias(emailInput.split('@')[0] || 'Paciente');
        unlockApp();
        router.push('/');
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F0F4F8] flex flex-col justify-between px-5 py-8 max-w-md mx-auto">
      {/* Header Discreto */}
      <div className="pt-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#11141E] border border-[#212838] mb-5 shadow-lg shadow-cyan-950/20">
          <Shield className="w-7 h-7 text-[#00E5FF]" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Acceso Clínico Privado
        </h1>
        <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">
          Protocolo de Rehabilitación Neuromuscular Pélvica de 12 Semanas
        </p>
      </div>

      {/* Formulario Principal */}
      <div className="w-full my-auto space-y-6">
        <div className="bg-[#11141E] border border-[#212838] rounded-2xl p-6 shadow-xl">
          {!isEmailMode ? (
            <form onSubmit={handleAnonymousAccess} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Alias Confidencial (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    placeholder="Ej. Alex / Paciente"
                    className="w-full h-12 bg-[#090A0F] border border-[#212838] rounded-xl px-4 text-sm text-[#F0F4F8] placeholder-gray-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                  <UserCheck className="absolute right-3.5 top-3.5 w-5 h-5 text-gray-500" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  No requiere datos reales. Tu progreso se resguarda en este dispositivo.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] text-[#090A0F] font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Iniciando...' : 'Entrar en Modo Privado'}</span>
                <ArrowRight className="w-4 h-4 text-[#090A0F]" />
              </button>

              <button
                type="button"
                onClick={() => setIsEmailMode(true)}
                className="w-full text-center text-xs text-gray-400 hover:text-[#00E5FF] transition-colors pt-1"
              >
                ¿Deseas sincronizar con Supabase Cloud? Usa Email
              </button>
            </form>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Correo Electrónico (Magic Link)
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full h-12 bg-[#090A0F] border border-[#212838] rounded-xl px-4 text-sm text-[#F0F4F8] placeholder-gray-600 focus:outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>

              {statusMessage && (
                <p className="text-xs text-[#00E676] bg-[#00E676]/10 p-2.5 rounded-lg border border-[#00E676]/30">
                  {statusMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#00E5FF] text-[#090A0F] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#00cce6] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Verificando...' : 'Enviar Magic Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsEmailMode(false)}
                className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors pt-1"
              >
                Volver a acceso anónimo local
              </button>
            </form>
          )}
        </div>

        {/* Opción de bloqueo rápido por PIN */}
        <div className="bg-[#11141E]/60 border border-[#212838] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#181D2B] flex items-center justify-center text-[#7C4DFF]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-200">
                {profile.pin_hash ? 'PIN de 4 dígitos activo' : 'Configurar PIN rápido'}
              </p>
              <p className="text-[11px] text-gray-500">
                {profile.pin_hash ? 'Protege la app ante miradas curiosas' : 'Bloqueo instantáneo de pantalla'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPinSetup(true)}
            className="text-xs font-semibold text-[#00E5FF] hover:underline"
          >
            {profile.pin_hash ? 'Cambiar' : 'Activar'}
          </button>
        </div>
      </div>

      {/* Modal de Configuración de PIN */}
      {showPinSetup && (
        <DiscreetPinLock
          mode="SETUP"
          onSetupComplete={() => {
            setShowPinSetup(false);
          }}
          onSuccess={() => {
            setShowPinSetup(false);
          }}
        />
      )}

      {/* Footer con Garantía de Privacidad */}
      <footer className="text-center text-[11px] text-gray-600 space-y-1">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#00E5FF]" />
          <span>Arquitectura Offline-First • Cero PII compartida</span>
        </p>
        <p>Cifrado en reposo y estándares de salud sexual confidencial</p>
      </footer>
    </main>
  );
}
