// src/app/[locale]/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl'; // Importa useLocale
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './page.module.css';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale(); // Obtém o idioma atual

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      router.push(`/${locale}/characters?name=${trimmedTerm}`); // Usa o idioma atual
    } else {
      router.push(`/${locale}/characters`); // Usa o idioma atual
    }
  };

  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <motion.main
      className={styles.main}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div className={styles.background} style={{ y: yOffset }}>
        <Image
          src="/assets/background.png"
          alt="Rick and Morty Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </motion.div>

      <motion.div
        className={styles.logoContainer}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link href={`/${locale}`}> {/* Link para a home page com o idioma atual */}
          <Image
            src="/assets/logo.png"
            alt="Rick and Morty Logo"
            width={450}
            height={200}
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </motion.div>

      <motion.form
        onSubmit={handleSearchSubmit}
        className={styles.searchForm}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          {t('searchButton')}
        </button>
      </motion.form>

    <button
      onClick={() => {
        const audio = new Audio('/sounds/click.mp3');
        audio.volume = 0.5;
        audio.play().catch((err) => console.error('Erro ao tocar som:', err));
      }}
    >
      Testar som
    </button>

    </motion.main>



  );
}