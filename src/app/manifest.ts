import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PelvicRehab - Salud Pélvica 12W',
    short_name: 'PelvicRehab',
    description: 'Protocolo Clínico de 12 Semanas: Rehabilitación Neuromuscular PFMT y Salud Sexual',
    start_url: '/',
    display: 'standalone',
    background_color: '#090A0F',
    theme_color: '#090A0F',
    orientation: 'portrait',
    scope: '/',
    categories: ['medical', 'health', 'fitness'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ]
  };
}
