import React from 'react';

const AppBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: 'url(/assets/background.png)',
        backgroundSize: 'cover', // Mantemos 'cover' aqui para tentar preencher
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.2, // Voltamos para a opacidade desejada
        backgroundColor: '#1a202c', // Fallback color, caso a imagem não carregue
      }}
    />
  );
};

export default AppBackground;