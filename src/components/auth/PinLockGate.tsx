'use client';

import React, { useEffect } from 'react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { DiscreetPinLock } from './DiscreetPinLock';

export function PinLockGate({ children }: { children: React.ReactNode }) {
  const isLocked = usePatientStore((s) => s.isLocked);
  const isHydrated = usePatientStore((s) => s.isHydrated);
  const lockApp = usePatientStore((s) => s.lockApp);
  const profile = usePatientStore((s) => s.profile);

  // Escuchar cuando el usuario oculta la pestaña / bloquea el móvil para auto-bloquear
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && profile.pin_hash) {
        lockApp();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile.pin_hash, lockApp]);

  if (!isHydrated) {
    return (
      <div className="fixed inset-0 bg-[#090A0F] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isLocked && profile.pin_hash) {
    return <DiscreetPinLock mode="VERIFY" />;
  }

  return <>{children}</>;
}
