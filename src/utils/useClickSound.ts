// src/utils/useClickSound.ts
export function useClickSound() {
  const audio = typeof Audio !== 'undefined' ? new Audio('/sounds/click.mp3') : null;

  const play = () => {
    audio?.currentTime = 0;
    audio?.play();
  };

  return play;
}
