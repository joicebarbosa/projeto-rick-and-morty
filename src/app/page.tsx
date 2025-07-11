// src/app/page.tsx - Código COMPLETO e CORRIGIDO
'use client';

import React, { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useLazyQuery } from '@apollo/client';
import CharacterDetailsModal from '@/components/CharacterDetailsModal';
import CharacterCard from '@/components/CharacterCard';
import Image from 'next/image';

// Cliente Apollo
const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

// Query GraphQL com variáveis para busca e paginação
const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info {
        count
        pages
        next
        prev
      }
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
        episode {
          name
        }
      }
    }
  }
`;

// Interface para o objeto de personagem
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

const HomePageContent: React.FC = () => {
  const [getCharacters, { loading, error, data }] = useLazyQuery(GET_CHARACTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const handleCardClick = (character: Character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setHasSearched(true);
    getCharacters({ variables: { page: 1, name: searchTerm } });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    getCharacters({ variables: { page: newPage, name: searchTerm } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const characters = data?.characters?.results || [];
  const info = data?.characters?.info;

  return (
    // A tag <main> terá o conteúdo principal. O background de todo o body já está no globals.css.
    <main className="min-h-screen text-white p-8 relative overflow-hidden flex flex-col items-center justify-start">

      {/* ESTE DIV QUE ERA O PROBLEMA FOI REMOVIDO DAQUI */}
      {/* <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'url(/assets/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}></div> */}


      <div className="relative z-10 flex flex-col items-center justify-start pt-20 w-full">
        <header className="flex flex-col items-center justify-center mb-10">
          <Image
            src="/assets/img-logo.png"
            alt="Rick and Morty Logo"
            width={400}
            height={200}
            className="mb-10 animate-fade-in"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Pesquisar personagem..."
              // Classes para o efeito de "vidro" no input
              className="p-3 rounded-lg border-2 border-yellow-500 bg-gray-900 bg-opacity-60 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-300 focus:bg-opacity-80 backdrop-blur-md w-full sm:w-80 transition-all duration-300 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              // Classes para o efeito de "vidro" no botão
              className="px-6 py-3 bg-yellow-600 bg-opacity-70 text-white font-bold rounded-lg hover:bg-yellow-500 hover:bg-opacity-90 backdrop-blur-md transition-all duration-300 ease-in-out"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
        </header>

        {hasSearched && (
          <div className="w-full max-w-7xl mx-auto">
            {loading && <p className="text-white text-center mt-8 text-xl">Carregando personagens...</p>}
            {error && <p className="text-red-500 text-center mt-8 text-xl">Erro ao carregar personagens: {error.message}</p>}

            {!loading && !error && characters.length === 0 && (
              <p className="col-span-full text-center text-gray-400 text-lg mt-8">Nenhum personagem encontrado com este nome.</p>
            )}

            {!loading && !error && characters.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8">
                  {characters.map((character: Character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>

                <div className="flex justify-center items-center space-x-4 mt-12 mb-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!info?.prev}
                    className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-white text-lg">Página {currentPage} de {info?.pages || 1}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!info?.next}
                    className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próximo
                  </button>
                </div>
              </>
            )}
          </div>
        )}

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