// src/components/CharacterDetailsModal.tsx
import React from 'react';
import Image from 'next/image';

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type?: string;
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
  episode?: {
    name: string;
  }[];
}

interface CharacterDetailsModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

const CharacterDetailsModal: React.FC<CharacterDetailsModalProps> = ({ character, isOpen, onClose }) => {
  if (!isOpen || !character) {
    return null;
  }

  // Função auxiliar para formatar a string de tipo, se existir
  const getCharacterType = () => {
    if (character.type && character.type.trim() !== '') {
      return ` - ${character.type}`;
    }
    return '';
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Fecha o modal ao clicar fora
    >
      <div
        className="bg-zinc-900 rounded-lg shadow-2xl p-6 relative
                   max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6
                   border-2 border-yellow-500 overflow-hidden transform transition-all duration-300 ease-out scale-95 opacity-0
                   data-[state=open]:scale-100 data-[state=open]:opacity-100" // Adicionado para animação de abertura
        onClick={(e) => e.stopPropagation()} // Impede que o clique interno feche o modal
        // Ajuste no className para usar 'data-[state=open]' para Tailwind 3.2+ para animação
        // Se você não tem Tailwind 3.2+, pode usar um estado local para controlar a classe de animação
      >
        {/* Botão Fechar no canto superior direito (ícone X) */}
        <button
          className="absolute top-3 right-3 text-white text-2xl font-bold p-2
                     hover:text-yellow-500 transition-colors z-20"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          &times; {/* Caractere 'x' */}
        </button>

        {/* Botão Fechar no canto superior esquerdo (com o texto) */}
        <button
          className="absolute top-3 left-3 px-4 py-2 bg-zinc-700 text-white text-sm
                     rounded-md hover:bg-zinc-600 transition-colors z-20"
          onClick={onClose}
        >
          Fechar
        </button>


        {/* Coluna da Esquerda: Imagem e Nome/Status Básico */}
        <div className="flex flex-col items-center justify-start relative p-4 bg-zinc-800 rounded-lg border border-yellow-500">
            <Image
                src={character.image}
                alt={character.name}
                width={200} // Tamanho maior para a imagem no modal
                height={200} // Tamanho maior para a imagem no modal
                className="rounded-lg border-2 border-yellow-600 shadow-md mb-4 flex-shrink-0"
            />
            <h2 className="text-3xl font-bold text-yellow-400 mb-2 text-center">{character.name}</h2>
            <p className="text-lg text-white mb-1">
                <span className="font-semibold">Status:</span> {character.status}
            </p>
            <p className="text-lg text-white mb-1">
                <span className="font-semibold">Espécie:</span> {character.species}
            </p>
            <p className="text-lg text-white mb-1">
                <span className="font-semibold">Gênero:</span> {character.gender}
            </p>
        </div>


        {/* Coluna da Direita: Detalhes Separados */}
        <div className="flex flex-col space-y-6">
          {/* SOBRE */}
          <div className="bg-zinc-800 p-4 rounded-lg border border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-400 mb-2 uppercase border-b border-yellow-700 pb-2">SOBRE</h3>
            <p className="text-white text-lg">{character.name} is a {character.gender} {character.species}{getCharacterType()}. It is {character.status.toLowerCase()}.</p>
          </div>

          {/* ORIGEM */}
          <div className="bg-zinc-800 p-4 rounded-lg border border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-400 mb-2 uppercase border-b border-yellow-700 pb-2">ORIGEM</h3>
            <p className="text-white text-lg">
              <span className="font-semibold">Planeta:</span> {character.origin?.name || 'unknown'}
            </p>
            <p className="text-white text-lg">
              <span className="font-semibold">Dimensão:</span> {character.origin?.dimension || 'unknown'}
            </p>
          </div>

          {/* LOCALIDADE ATUAL */}
          <div className="bg-zinc-800 p-4 rounded-lg border border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-400 mb-2 uppercase border-b border-yellow-700 pb-2">LOCALIDADE ATUAL</h3>
            <p className="text-white text-lg">
              <span className="font-semibold">Planeta:</span> {character.location?.name || 'unknown'}
            </p>
            <p className="text-white text-lg">
              <span className="font-semibold">Dimensão:</span> {character.location?.dimension || 'unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailsModal;