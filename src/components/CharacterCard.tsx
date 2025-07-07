// src/components/CharacterCard.tsx
import React from 'react';
import Image from 'next/image';

// Interface para o objeto de personagem
interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type?: string; // Type pode ser opcional ou vazio
  gender: string;
  image: string;
  origin: {
    name: string;
    dimension: string;
  } | null;
  location: {
    name: string;
    dimension: string;
  } | null;
  episode?: { // Episódios também podem ser adicionados para detalhes futuros
    name: string;
  }[];
}

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  // Determina a cor da borda e texto com base no status (para o efeito de "apagado")
  const isAlive = character.status === 'Alive';
  const borderColorClass = isAlive ? 'border-yellow-500' : 'border-gray-500';
  const textColorClass = isAlive ? 'text-white' : 'text-gray-400';
  const filterClass = isAlive ? '' : 'grayscale opacity-70'; // Aplica filtro para "apagado"

  return (
    <div
      className={`
        bg-zinc-800 rounded-lg shadow-lg flex flex-col items-center p-4 cursor-pointer
        hover:border-yellow-300 hover:shadow-yellow-500/50 transition-all duration-200 ease-in-out transform hover:scale-105
        ${borderColorClass} border-2 ${filterClass}
      `}
      onClick={() => onClick(character)}
    >
      <Image
        src={character.image}
        alt={character.name}
        width={120} // Ajuste conforme necessário
        height={120} // Ajuste conforme necessário
        className={`rounded-full border-2 border-yellow-600 mb-4 ${filterClass}`}
      />
      <h3 className={`text-lg font-bold text-center ${textColorClass}`}>{character.name}</h3>
      <p className={`text-sm ${textColorClass}`}>{character.species}</p>
      {/* Você pode adicionar mais informações aqui se quiser no card */}
    </div>
  );
};

export default CharacterCard;