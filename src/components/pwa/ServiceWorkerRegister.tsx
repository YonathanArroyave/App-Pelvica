'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegister
 * Registra el Service Worker en segundo plano para permitir navegación
 * y entrenamiento 100% offline en dispositivos móviles.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registrado con éxito:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Error al registrar Service Worker:', err);
          });
      });
    }
  }, []);

  return null;
}
