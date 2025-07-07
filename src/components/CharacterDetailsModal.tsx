// src/components/CharacterDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import styles from './CharacterDetailsModal.module.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Interface para o objeto de personagem (baseado no que a API retorna)
interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
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

// Interface para as props do componente Modal
interface CharacterDetailsModalProps {
  character: Character | null;
  onClose: () => void;
  isOpen: boolean;
}

// Configuração do cliente Apollo (verifique a URL da API do Rick and Morty)
const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

const CharacterDetailsModal: React.FC<CharacterDetailsModalModalProps> = ({ character, onClose, isOpen }) => {
  // Se o modal não estiver aberto ou não houver personagem, não renderize nada
  if (!isOpen || !character) return null;

  // Função para determinar a classe de estilo do status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Alive':
        return styles.statusAlive;
      case 'Dead':
        return styles.statusDead;
      case 'unknown':
        return styles.statusUnknown;
      default:
        return '';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} data-is-open={isOpen}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Botão Fechar no canto superior esquerdo da seção da imagem */}
        <button onClick={onClose} className={styles.closeButton}>
          Fechar
        </button>

        <div className={styles.leftSection}>
          <div className={styles.imageWrapper}>
            <img
              src={character.image}
              alt={character.name}
              className={styles.characterImage}
            />
            {/* Banner amarelo com nome e tipo/espécie */}
            <div className={styles.characterNameBanner}>
              <h2 className={styles.characterName}>{character.name}</h2>
              <p className={styles.characterTypeSpecies}>
                {character.type ? character.type : character.species}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          {/* Informações Básicas */}
          <div className={styles.infoGroup}>
            <h3 className={styles.infoTitle}>SOBRE</h3>
            <p>
              <span className={getStatusClass(character.status)}>{character.status}</span>
              {' '} - {character.species}
              {character.type && ` - ${character.type}`}
              {' '} - {character.gender === 'Male' ? 'Masculino' : character.gender === 'Female' ? 'Feminino' : 'Gênero Desconhecido'}.
            </p>
          </div>

          {/* Origem */}
          <div className={styles.infoGroup}>
            <h3 className={styles.infoTitle}>ORIGEM</h3>
            <p>
              Planeta: {character.origin?.name || 'Desconhecido'}
              {character.origin?.dimension && character.origin.dimension !== 'unknown' && ` (${character.origin.dimension})`}
            </p>
          </div>

          {/* Localização Atual */}
          <div className={styles.infoGroup}>
            <h3 className={styles.infoTitle}>LOCALIDADE ATUAL</h3>
            <p>
              Planeta: {character.location?.name || 'Desconhecido'}
              {character.location?.dimension && character.location.dimension !== 'unknown' && ` (${character.location.dimension})`}
            </p>
          </div>

          {/* Se você precisar de uma lista de episódios (como no modelo), pode ativar este bloco.
              Por enquanto, vamos manter simples. Você precisaria buscar os episódios separadamente
              ou ter essa informação já no objeto 'character' passado.
          */}
          {/* {character.episode && character.episode.length > 0 && (
            <div className={styles.infoGroup}>
              <h3 className={styles.infoTitle}>EPISÓDIOS</h3>
              <div className={styles.episodeList}>
                <ul className={styles.episodesScroll}>
                  {character.episode.map((ep, index) => (
                    <li key={index}>{ep.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailsModal;