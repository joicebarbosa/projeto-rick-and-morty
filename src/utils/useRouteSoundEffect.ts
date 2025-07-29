'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useRouteSoundEffect() {
  const pathname = usePathname();

  useEffect(() => {
    const audio = new Audio('/sounds/click.wav');
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn('Erro ao tocar som:', err));
  }, [pathname]);
}
