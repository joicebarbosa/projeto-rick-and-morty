// src/components/RouteSoundEffect.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClickSound } from '@/utils/useClickSound';

export default function RouteSoundEffect() {
  const router = useRouter();
  const playClick = useClickSound();

  useEffect(() => {
    const originalPush = router.push;

    router.push = (...args: Parameters<typeof router.push>) => {
      playClick();
      return originalPush.apply(router, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router, playClick]);

  return null;
}
