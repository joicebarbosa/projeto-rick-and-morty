// src/app/[locale]/characters/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl'; // Importa useTranslations e useLocale
import styles from './characters.module.css';
import homeStyles from '../page.module.css'; // Mantido, mas considere refatorar se os estilos forem globais
import { motion } from 'framer-motion';
import BackToTopButton from '@/components/BackToTopButton';

interface Character {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
}

export default function CharactersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations(); // Hook de tradução
  const locale = useLocale(); // Hook para o idioma atual

  const initialSearchTerm = searchParams.get('name') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const fetchCharacters = useCallback(async (name: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}&page=${page}`);
      const data = await res.json();

      if (res.ok && !data.error) {
        setCharacters(data.results || []);
        setTotalPages(data.info.pages || 1);
      } else {
        setCharacters([]);
        setTotalPages(1);
        // Usa useTranslations para a mensagem de erro
        setError(data.error || t('noResults', { name: name }));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erro ao buscar personagens:', err.message);
        setError(t('errorMessage', { message: err.message })); // Exemplo de tradução para erro
      } else {
        console.error('Erro desconhecido ao buscar personagens:', err);
        setError(t('unknownErrorMessage')); // Exemplo de tradução para erro desconhecido
      }
      setCharacters([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [t]); // Adiciona 't' como dependência para useCallback

  useEffect(() => {
    const currentName = searchParams.get('name') || '';
    const currentPageFromUrl = Number(searchParams.get('page')) || 1;
    setSearchTerm(currentName);
    setCurrentPage(currentPageFromUrl);
    fetchCharacters(currentName, currentPageFromUrl);
  }, [searchParams, fetchCharacters]);

  const updateUrlAndFetch = (name: string, page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name) {
      params.set('name', name);
    } else {
      params.delete('name');
    }
    params.set('page', String(page));
    // Inclui o prefixo do idioma na URL
    router.push(`/${locale}/characters?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlAndFetch(searchTerm, 1);
  };

  const handlePageChange = (pageNumber: number) => {
    updateUrlAndFetch(searchTerm, pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 7;
    const half = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handleMouseEnter = (characterId: string) => {
    setHoveredCardId(characterId);
  };

  const handleMouseLeave = () => {
    setHoveredCardId(null);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardRect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top,
    });
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

      <div className={homeStyles.logoContainer}>
        <Link href={`/${locale}`}> {/* Link para a home page com o idioma atual */}
          <Image
            src="/assets/logo.png"
            alt="Rick and Morty Logo"
            width={450}
            height={200}
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className={homeStyles.searchForm}>
        <input
          type="text"
          name="search"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={homeStyles.searchInput}
        />
        <button type="submit" className={homeStyles.searchButton}>
          {t('searchButton')} {/* Usa tradução */}
        </button>
      </form>

      {loading && characters.length === 0 ? (
        <p className={styles.loadingMessage}>{t('loading')}</p> 
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : characters.length === 0 ? (
        <p className={styles.noResults}>
          {t('noResults', { name: searchTerm })} 
        </p>
      ) : (
        <div className={styles.gridContainer}>
          <div className={styles.characterGrid}>
            {characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/${locale}/characters/${character.id}`} 
                  className={`${styles.characterCard} ${character.status === 'Dead' ? styles.deadCharacterCard : ''}`}
                  onMouseEnter={() => handleMouseEnter(character.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={styles.imageWrapper}
                    onMouseMove={handleMouseMove}
                  >
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={200}
                      height={200}
                      // Aplica a classe condicionalmente
                      className={`${styles.characterImage} ${character.status === 'Dead' ? styles.deadCharacterImage : ''}`}
                    />
                    {hoveredCardId === character.id && (
                      <div
                        className={styles.statusPopup}
                        style={{
                          '--mouse-x': `${mousePosition.x}px`,
                          '--mouse-y': `${mousePosition.y}px`,
                        } as React.CSSProperties}
                      >
                        <span className={`${styles.statusBadge} ${
                          character.status === 'Dead'
                            ? styles.dead
                            : character.status === 'Alive'
                            ? styles.alive
                            : styles.unknown
                        }`}>
                          {character.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.info}>
                    <h3>{character.name}</h3>
                    <p>{t('speciesLabel')}: {character.species}</p> {/* Exemplo de tradução */}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              «
            </button>
            {totalPages > 0 && currentPage - Math.floor(getPageNumbers().length / 2) > 1 && (
              <>
                <button onClick={() => handlePageChange(1)}>1</button>
                {currentPage - Math.floor(getPageNumbers().length / 2) > 2 && (
                  <span className={styles.paginationEllipsis}>...</span>
                )}
              </>
            )}
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={pageNumber === currentPage ? styles.activePage : ''}
                disabled={loading}
              >
                {pageNumber}
              </button>
            ))}
            {totalPages > 0 && currentPage + Math.floor(getPageNumbers().length / 2) < totalPages && (
              <>
                {currentPage + Math.floor(getPageNumbers().length / 2) < totalPages - 1 && (
                  <span className={styles.paginationEllipsis}>...</span>
                )}
                <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
              </>
            )}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
            >
              »
            </button>
          </div>
        </div>
      )}

      <BackToTopButton />
    </main>
  );
}