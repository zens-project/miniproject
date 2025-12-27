import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coffee Shop Management',
    short_name: 'Coffee Shop',
    description: 'Quản lý coffee shop hiện đại',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#222a63',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
