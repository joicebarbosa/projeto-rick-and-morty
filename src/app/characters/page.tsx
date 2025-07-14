'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { request, gql } from 'graphql-request';
import Image from 'next/image';
import Link from 'next/link';
import styles from './characters.module.css'; // Estilos para os cards e paginação
import homeStyles from '../page.module.css'; // <--- IMPORTA OS ESTILOS DA PÁGINA INICIAL PARA LOGO/BUSCA

const API_URL = 'https://rickandmortyapi.com/graphql';

// Tipos (mantidos como estavam)
interface Character {
  id: string;
  name: string;
  image: string;
  type: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  gender: string;
}

interface CharactersData {
  characters: {
    results: Character[];
    info: {
      count: number;
      pages: number;
      next: number | null;
      prev: number | null;
    };
  };
}

export default function CharactersPage() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('name') || ''; // Termo de busca da URL
  const initialPage = Number(searchParams.get('page')) || 1; // Página da URL

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  // Estado local para o input de busca (para que o usuário possa digitar)
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);

  // Atualiza o estado local do termo de busca quando a URL muda
  useEffect(() => {
    setLocalSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Lida com a mudança no input de busca
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  // Lida com o envio do formulário de busca
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTerm = localSearchTerm.trim();
    if (trimmedTerm) {
      // Navega para a página de personagens com o novo termo e reseta para a página 1
      router.push(`/characters?name=${trimmedTerm}&page=1`);
    } else {
      // Se a busca estiver vazia, navega para /characters (mostrando todos na primeira página)
      router.push('/characters?page=1');
    }
  };

  // Função para buscar os personagens
  const fetchCharacters = async (name: string, page: number) => {
    setLoading(true);
    setError(null);
    const GET_CHARACTERS_QUERY = gql`
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
          }
        }
      }
    `;
    try {
      const data = await request<CharactersData>(API_URL, GET_CHARACTERS_QUERY, { name, page });
      setCharacters(data.characters.results);
      setTotalPages(data.characters.info.pages);
      setCurrentPage(page); // Atualiza a página atual após a busca
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erro ao buscar personagens:", err.message);
        setError(`Não foi possível carregar os personagens: ${err.message}`);
      } else {
        console.error("Erro desconhecido ao buscar personagens:", err);
        setError("Não foi possível carregar os detalhes do personagem. Erro desconhecido.");
      }
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para disparar a busca quando o termo de busca ou a página na URL mudam
  useEffect(() => {
    fetchCharacters(initialSearchTerm, initialPage);
  }, [initialSearchTerm, initialPage]);

  // Lida com a mudança de página da paginação
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    // Garante que o termo de busca atual seja mantido na URL ao mudar de página
    if (initialSearchTerm) {
      params.set('name', initialSearchTerm);
    }
    router.push(`/characters?${params.toString()}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.background}>
        <Image
          src="/assets/background.png"
          alt="Rick and Morty Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      <div className={styles.content}>
        {/* LOGO (reutilizando estilos da home) */}
        <div className={homeStyles.logoContainer}>
          <Link href="/"> {/* Torna o logo clicável para voltar à home */}
            <Image
              src="/assets/logo.png"
              alt="Rick and Morty Logo"
              width={450}
              height={200}
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </div>

        {/* FORMULÁRIO DE BUSCA (reutilizando estilos da home) */}
        <form onSubmit={handleSearchSubmit} className={homeStyles.searchForm}>
          <input
            type="text"
            placeholder="Buscar personagem"
            value={localSearchTerm}
            onChange={handleSearchChange}
            className={homeStyles.searchInput}
          />
          <button type="submit" className={homeStyles.searchButton}>Buscar</button>
        </form>

        {/* Renderização condicional para carregamento, erro ou resultados */}
        {loading ? (
          <p className={styles.loadingMessage}>Carregando personagens...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : characters.length === 0 ? (
          <p className={styles.noResults}>Nenhum personagem encontrado com o nome "{initialSearchTerm}".</p>
        ) : (
          <>
            {/* O título "Resultados para..." foi removido para se adequar à referência */}
            <div className={styles.characterGrid}>
              {characters.map((character) => (
                <Link key={character.id} href={`/characters/${character.id}`} passHref>
                  <div className={styles.characterCard}>
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={200}
                      height={200}
                      className={`${styles.characterImage} ${
                        character.status === 'Dead' ? styles.dead : ''
                      } ${character.status === 'Alive' ? styles.alive : ''} ${
                        character.status === 'unknown' ? styles.unknown : ''
                      }`}
                    />
                    <h2 className={styles.characterName}>{character.name}</h2>
                    <p className={styles.characterType}>Tipo: {character.type || 'Desconhecido'}</p>
                    <p className={styles.characterStatus}>Status: <span className={`${
                        character.status === 'Dead' ? styles.statusDead : ''
                      } ${character.status === 'Alive' ? styles.statusAlive : ''} ${
                        character.status === 'unknown' ? styles.statusUnknown : ''
                      }`}>
                        {character.status}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginação */}
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Anterior
              </button>
              <span className={styles.pageInfo}>{`Página ${currentPage} de ${totalPages}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}