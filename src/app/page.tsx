// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      router.push(`/characters?name=${trimmedTerm}`);
    } else {
        // Se a busca estiver vazia na home, pode redirecionar para a página de caracteres sem filtro
        router.push(`/characters`);
    }
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

      {/* Logo Container */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="Rick and Morty Logo"
            width={450}
            height={200}
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar personagem"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Buscar</button>
      </form>
    </main>
  );
}