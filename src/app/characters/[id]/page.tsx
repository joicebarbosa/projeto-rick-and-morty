'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useParams para pegar o ID da URL, useRouter para navegação
import { request, gql } from 'graphql-request';
import Image from 'next/image';
import styles from './characterDetail.module.css'; // Vamos criar este CSS em seguida

const API_URL = 'https://rickandmortyapi.com/graphql';

// Definição dos tipos para os dados do personagem
interface Location {
  id: string;
  name: string;
  type: string;
  dimension: string;
}

interface Episode {
  id: string;
  name: string;
  episode: string;
  air_date: string;
}

interface CharacterDetailData {
  character: {
    id: string;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: string;
    image: string;
    origin: Location;
    location: Location;
    episode: Episode[]; // Lista de episódios
  } | null; // Pode ser null se o personagem não for encontrado
}

export default function CharacterDetailPage() {
  const params = useParams(); // Hook para acessar os parâmetros da URL
  const characterId = params.id as string; // O ID do personagem da URL
  const router = useRouter();

  const [character, setCharacter] = useState<CharacterDetailData['character']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) {
      setLoading(false);
      setError("ID do personagem não fornecido.");
      return;
    }

    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);

      // Query GraphQL para buscar um único personagem por ID
      const GET_CHARACTER_DETAIL_QUERY = gql`
        query GetCharacter($id: ID!) {
          character(id: $id) {
            id
            name
            status
            species
            type
            gender
            image
            origin {
              id
              name
              type
              dimension
            }
            location {
              id
              name
              type
              dimension
            }
            episode {
              id
              name
              episode
              air_date
            }
          }
        }
      `;

      try {
        const data = await request<CharacterDetailData>(API_URL, GET_CHARACTER_DETAIL_QUERY, {
          id: characterId,
        });

        if (data.character) {
          setCharacter(data.character);
        } else {
          setError(`Personagem com ID "${characterId}" não encontrado.`);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Erro ao buscar detalhes do personagem:", err.message);
          setError(`Não foi possível carregar os detalhes do personagem: ${err.message}`);
        } else {
          console.error("Erro desconhecido ao buscar detalhes do personagem:", err);
          setError("Não foi possível carregar os detalhes do personagem. Erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]); // Re-executa quando o characterId muda

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando detalhes do personagem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          Voltar para a busca
        </button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className={styles.container}>
        <p>Dados do personagem não disponíveis.</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          Voltar para a busca
        </button>
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
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Voltar para a Busca
        </button>
        <h1 className={styles.characterName}>{character.name}</h1>
        <div className={styles.detailContainer}>
          <div className={styles.imageAndStatus}>
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              className={`${styles.characterImage} ${
                character.status === 'Dead' ? styles.dead : ''
              } ${character.status === 'Alive' ? styles.alive : ''} ${
                character.status === 'unknown' ? styles.unknown : ''
              }`}
            />
            <p className={styles.characterStatus}>Status: <span className={`${
                character.status === 'Dead' ? styles.statusDead : ''
              } ${character.status === 'Alive' ? styles.statusAlive : ''} ${
                character.status === 'unknown' ? styles.statusUnknown : ''
              }`}>
                {character.status}
              </span>
            </p>
          </div>
          <div className={styles.infoBlock}>
            <p><strong>Espécie:</strong> {character.species}</p>
            <p><strong>Gênero:</strong> {character.gender}</p>
            {character.type && <p><strong>Tipo:</strong> {character.type}</p>}
            <p><strong>Origem:</strong> {character.origin.name}</p>
            <p><strong>Última Localização:</strong> {character.location.name}</p>

            <h2 className={styles.episodesTitle}>Aparições em Episódios:</h2>
            <ul className={styles.episodeList}>
              {character.episode.map((ep) => (
                <li key={ep.id} className={styles.episodeItem}>
                  {ep.episode} - {ep.name} (Data: {ep.air_date})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}