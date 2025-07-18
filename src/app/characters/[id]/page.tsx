// src/app/characters/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { request, gql } from 'graphql-request';
import Image from 'next/image';
import styles from './characterDetail.module.css';

const API_URL = 'https://rickandmortyapi.com/graphql';

interface Location {
  id: string;
  name: string;
  type: string;
  dimension: string;
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
  } | null;
}

export default function CharacterDetailPage() {
  const params = useParams();
  const characterId = params.id as string;
  const router = useRouter();

  const [character, setCharacter] = useState<CharacterDetailData['character']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) {
      setLoading(false);
      setError('ID do personagem não fornecido.');
      return;
    }

    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);

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
          console.error('Erro ao buscar detalhes do personagem:', err.message);
          setError(`Não foi possível carregar os detalhes do personagem: ${err.message}`);
        } else {
          console.error('Erro desconhecido ao buscar detalhes do personagem:', err);
          setError('Erro desconhecido ao carregar os detalhes do personagem.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingMessage}>Carregando detalhes do personagem...</p>
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
        <p className={styles.noResults}>Dados do personagem não disponíveis.</p>
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
          src="/assets/background.png"
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

        <div className={styles.cardFloat}>
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
          <p className={`${styles.characterStatus} ${
            character.status === 'Dead' ? styles.statusDead : ''
          } ${character.status === 'Alive' ? styles.statusAlive : ''} ${
            character.status === 'unknown' ? styles.statusUnknown : ''
          }`}>
            {character.status}
          </p>
        </div>

        <h1 className={styles.characterName}>{character.name}</h1>

        <div className={styles.infoBlocksContainer}> {/* Novo container para os blocos de info */}
            <div className={styles.infoBlock}>
                <h2>Sobre</h2>
                <p><strong>Espécie:</strong> {character.species}</p>
                <p><strong>Gênero:</strong> {character.gender}</p>
                {character.type && <p><strong>Tipo:</strong> {character.type}</p>}
            </div>

            <div className={styles.infoBlock}>
                <h2>Origem</h2>
                <p>{character.origin.name || 'Desconhecida'}</p>
                {character.origin.type && <p><strong>Tipo:</strong> {character.origin.type}</p>}
                {character.origin.dimension && <p><strong>Dimensão:</strong> {character.origin.dimension}</p>}
            </div>

            <div className={styles.infoBlock}>
                <h2>Localização Atual</h2>
                <p>{character.location.name || 'Desconhecida'}</p>
                {character.location.type && <p><strong>Tipo:</strong> {character.location.type}</p>}
                {character.location.dimension && <p><strong>Dimensão:</strong> {character.location.dimension}</p>}
            </div>
        </div>
      </div>
    </main>
  );
}