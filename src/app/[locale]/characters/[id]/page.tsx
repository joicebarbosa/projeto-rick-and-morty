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
      <div className={styles.overlay}>
        <div className={styles.loadingContainer}>
          <p>Carregando detalhes do personagem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.overlay}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={() => router.back()} className={styles.backButton}>
            Voltar para a Busca
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className={styles.overlay}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Dados do personagem não disponíveis.</p>
          <button onClick={() => router.back()} className={styles.backButton}>
            Voltar para a Busca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.detailModal}> {/* Container principal do modal */}
        <button onClick={() => router.back()} className={styles.closeButton}>
          Fechar
        </button>
        {/* **MOVIDO PARA CÁ: Card da Imagem Flutuante (agora filho direto de .detailModal)** */}
        <div className={styles.imageFloatCard}>
          <Image
            src={character.image}
            alt={character.name}
            width={200} // Tamanho da imagem dentro do card
            height={200} // Tamanho da imagem dentro do card
            className={styles.characterImage}
            style={{ objectFit: 'cover' }} // Garante que a imagem preencha sem deformar
          />
          <div className={styles.characterTextOverlay}>
            <h2 className={styles.floatingCharacterName}>{character.name}</h2>
            <p className={styles.floatingCharacterSpecies}>{character.species}</p>
          </div>
        </div>

        {/* Painel Esquerdo: Área para o background cinza (agora sem o card da imagem dentro) */}
        <div className={styles.leftPanel}>
          {/* O conteúdo do imageFloatCard foi movido para fora daqui */}
        </div>

        {/* Painel Direito: Conteúdo do personagem (SOBRE, ORIGEM, LOCALIDADE) */}
        <div className={styles.rightContent}>
          {/* SOBRE */}
          <h3 className={styles.sectionTitle}>SOBRE</h3>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Status:</span>
            <span className={`${styles.statusBadge} ${
              character.status === 'Dead'
                ? styles.deadStatus
                : character.status === 'Alive'
                ? styles.aliveStatus
                : styles.unknownStatus
            }`}>
              {character.status}
            </span>
          </p>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Espécie:</span> {character.species}
          </p>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Gênero:</span> {character.gender}
          </p>
          {character.type && character.type !== "" && (
            <p className={styles.detailItem}>
              <span className={styles.detailLabel}>Tipo:</span> {character.type}
            </p>
          )}

          {/* ORIGEM */}
          <h3 className={styles.sectionTitle}>ORIGEM</h3>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Nome:</span> {character.origin.name}
          </p>
          {character.origin.type && character.origin.type !== "unknown" && (
              <p className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tipo:</span> {character.origin.type}
              </p>
          )}
          {character.origin.dimension && character.origin.dimension !== "unknown" && (
              <p className={styles.detailItem}>
                  <span className={styles.detailLabel}>Dimensão:</span> {character.origin.dimension}
              </p>
          )}

          {/* LOCALIDADE */}
          <h3 className={styles.sectionTitle}>LOCALIDADE</h3>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Nome:</span> {character.location.name}
          </p>
          {character.location.type && character.location.type !== "unknown" && (
              <p className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tipo:</span> {character.location.type}
              </p>
          )}
          {character.location.dimension && character.location.dimension !== "unknown" && (
              <p className={styles.detailItem}>
                  <span className={styles.detailLabel}>Dimensão:</span> {character.location.dimension}
              </p>
          )}
        </div>
      </div>
    </div>
  );
}