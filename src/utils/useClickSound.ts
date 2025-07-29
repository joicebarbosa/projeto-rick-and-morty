// src/utils/useClickSound.ts
export function useClickSound() {
  if (typeof window === 'undefined') return () => {};

  const audio = new Audio('/sounds/click.mp3');
  audio.volume = 0.3;

  return () => {
    audio.currentTime = 0;
    audio.play().catch((err) => {
      // Usuário não interagiu com a página ainda (autoplay policy)
      console.warn('Falha ao reproduzir som:', err);
    });
  };
}


