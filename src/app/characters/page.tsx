'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook para ler parâmetros da URL
import { request, gql } from 'graphql-request'; // Importa graphql-request
import Image from 'next/image';
import Link from 'next/link'; // Importa o componente Link do Next.js para navegação
import styles from './characters.module.css'; // Importa os estilos CSS Modules

// URL da API GraphQL do Rick and Morty
const API_URL = 'https://rickandmortyapi.com/graphql';

// Definição do tipo para um personagem (TypeScript)
interface Character {
  id: string;
  name: string;
  image: string;
  type: string;
  status: 'Alive' | 'Dead' | 'unknown'; // O status 'unknown' é uma opção válida
  species: string;
  gender: string;
}

// Definição do tipo para a resposta da API (TypeScript)
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
  const searchTerm = searchParams.get('name') || ''; // Pega o termo 'name' da URL
  const initialPage = Number(searchParams.get('page')) || 1; // Pega o número da página

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  // Função assíncrona para buscar os personagens
  const fetchCharacters = async (name: string, page: number) => {
    setLoading(true);
    setError(null); // Limpa erros anteriores

    // Query GraphQL para buscar personagens
    // 'gql' é um template literal tag para parsear a string da query
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
      // Faz a requisição GraphQL
      const data = await request<CharactersData>(API_URL, GET_CHARACTERS_QUERY, {
        name,
        page,
      });

      setCharacters(data.characters.results);
      setTotalPages(data.characters.info.pages);
      setCurrentPage(page); // Garante que a página atual seja atualizada após a busca
    } catch (err: unknown) { // Usando 'unknown' e fazendo type guard para lidar com o erro
      if (err instanceof Error) {
        console.error("Erro ao buscar personagens:", err.message);
        setError(`Não foi possível carregar os personagens: ${err.message}`);
      } else {
        console.error("Erro desconhecido ao buscar personagens:", err);
        setError("Não foi possível carregar os personagens. Erro desconhecido.");
      }
      setCharacters([]); // Limpa os personagens em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // useEffect para disparar a busca quando o componente é montado ou o searchTerm/currentPage muda
  useEffect(() => {
    // Se não houver termo de busca, não faz a requisição e exibe mensagem
    if (!searchTerm) {
      setLoading(false); // Para de carregar se não houver termo
      return;
    }
    fetchCharacters(searchTerm, currentPage);
  }, [searchTerm, currentPage]); // Dependências: re-executa se searchTerm ou currentPage mudar

  const handlePageChange = (newPage: number) => {
    // Aqui, estamos apenas atualizando o estado local da página.
    // O `useEffect` acima vai detectar essa mudança e disparar uma nova busca.
    setCurrentPage(newPage); 
  };


  // Renderização condicional para estados de carregamento, erro e resultados
  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando personagens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className={styles.container}>
        <p>{`Nenhum personagem encontrado com o nome "${searchTerm}".`}</p> {/* Uso de template literal */}
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.background}>
        <Image
          src="/assets/background.png" // Reutiliza o background
          alt="Rick and Morty Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{`Resultados para "${searchTerm}"`}</h1> {/* Uso de template literal */}
        <div className={styles.characterGrid}>
          {characters.map((character) => (
            // Envolve o card inteiro com o Link para torná-lo clicável
            <Link key={character.id} href={`/characters/${character.id}`} passHref>
              <div className={styles.characterCard}> {/* Este div agora é o filho do Link */}
                <Image
                  src={character.image}
                  alt={character.name}
                  width={200}
                  height={200}
                  className={`${styles.characterImage} ${
                    character.status === 'Dead' ? styles.dead : ''
                  } ${character.status === 'Alive' ? styles.alive : ''} ${
                    character.status === 'unknown' ? styles.unknown : '' // Adicionado para status 'unknown'
                  }`}
                />
                <h2 className={styles.characterName}>{character.name}</h2>
                <p className={styles.characterType}>Tipo: {character.type || 'Desconhecido'}</p>
                <p className={styles.characterStatus}>Status: <span className={`${
                    character.status === 'Dead' ? styles.statusDead : ''
                  } ${character.status === 'Alive' ? styles.statusAlive : ''} ${
                    character.status === 'unknown' ? styles.statusUnknown : '' // Adicionado para status 'unknown'
                  }`}>
                    {character.status}
                  </span>
                </p>
                {/* O TODO sobre tornar o card clicável pode ser removido agora */}
              </div>
            </Link>
          ))}
        </div>
        
        {/* Controles de Paginação */}
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Anterior
          </button>
          <span className={styles.pageInfo}>{`Página ${currentPage} de ${totalPages}`}</span> {/* Uso de template literal */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Próxima
          </button>
        </div>

      </div>
    </main>
  );
}