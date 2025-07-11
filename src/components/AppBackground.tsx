import React from 'react';

const AppBackground: React.FC = () => {
  return (
  // Em src/app/page.tsx, dentro do <main>
<div
  className="absolute inset-0 z-0"
  style={{
    backgroundImage: 'url(/assets/background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 1, // <--- Aumentar a opacidade para 1
    backgroundColor: 'black', // <--- Mudar para preto puro
  }}
></div>
  );
}

export default AppBackground;