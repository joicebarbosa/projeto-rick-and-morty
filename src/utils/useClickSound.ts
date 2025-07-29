export function useClickSound() {
  const audio =
    typeof Audio !== 'undefined' ? new Audio('/sounds/click.wav') : null;

  const play = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play().catch((err) => {
        console.error('Erro ao tocar som:', err);
      });
    }
  };

  return play;
}
