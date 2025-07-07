// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import CharacterDetailsModal from '@/components/CharacterDetailsModal';
import CharacterCard from '@/components/CharacterCard'; // Importe o novo componente CharacterCard
import Image from 'next/image'; // Para o logo

// Cliente Apollo
const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

// Query GraphQL (mantém a mesma)
const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results {
        id
        name
        status
        species
        type
        gender
        image
        origin {
          name
          dimension
        }
        location {
          name
          dimension
        }
      }
    }
  }
`;

// Interface para o objeto de personagem (mantenha consistente)
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

// Componente principal da página
const HomePageContent: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CHARACTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o campo de busca

  const handleCardClick = (character: Character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  // Filtra os personagens com base no termo de busca
  const filteredCharacters = data?.characters?.results.filter((character: Character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-white text-center mt-8 text-xl">Carregando personagens...</p>;
  if (error) return <p className="text-red-500 text-center mt-8 text-xl">Erro ao carregar personagens: {error.message}</p>;

  return (
    // O `min-h-screen` e `bg-cover` `bg-center` para a imagem de fundo
    <main className="min-h-screen bg-gray-900 text-white p-8 relative overflow-hidden">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/background.png)', // Certifique-se que o caminho está correto
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="relative z-10"> {/* Conteúdo principal acima da imagem de fundo */}
        <header className="flex flex-col items-center justify-center mb-10">
          {/* Adicione o logo, certifique-se que o caminho está correto em public/assets */}
          <Image
            src="/assets/img-logo.png"
            alt="Rick and Morty Logo"
            width={300} // Ajuste o tamanho conforme necessário
            height={150} // Ajuste o tamanho conforme necessário
            className="mb-6"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Pesquisar personagem..."
              className="p-3 rounded-lg border-2 border-yellow-500 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 transition-colors"
              // A busca é em tempo real com onChange, então o botão pode ser opcional ou para uma ação diferente
              onClick={() => { /* Ação de busca já ocorre no onChange */ }}
            >
              Buscar
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {filteredCharacters && filteredCharacters.length > 0 ? (
            filteredCharacters.map((character: Character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={handleCardClick}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 text-lg">Nenhum personagem encontrado.</p>
          )}
        </div>

        <CharacterDetailsModal
          character={selectedCharacter}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </main>
  );
};

const Home: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <HomePageContent />
    </ApolloProvider>
  );
};

export default Home;