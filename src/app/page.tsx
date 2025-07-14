'use client'; // Indica que é um Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para navegação
import Image from 'next/image'; // Para otimização de imagens
import styles from './page.module.css'; // Importa os estilos específicos da página inicial

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca
  const router = useRouter(); // Hook para roteamento

  // Lida com a mudança no input de busca
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Lida com o envio do formulário de busca
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o recarregamento da página
    if (searchTerm.trim()) { // Se o termo de busca não estiver vazio
      // Navega para a página de personagens com o termo de busca na URL
      router.push(`/characters?name=${searchTerm.trim()}`);
    }
  };

  return (
    <main className={styles.main}>
      {/* Fundo da página */}
      <div className={styles.background}>
        <Image
          src="/assets/background.png" // Imagem de fundo
          alt="Rick and Morty Background"
          layout="fill" // Preenche o contêiner pai
          objectFit="cover" // Garante que a imagem cubra a área
          quality={100} // Qualidade da imagem
        />
      </div>

      {/* Conteúdo principal (logo e busca) */}
      <div className={styles.content}>
        {/* Contêiner para o logo */}
        <div className={styles.logoContainer}>
          <Image
            src="/assets/logo.png" // Imagem do logo
            alt="Rick and Morty Logo"
            width={450} // Largura do logo
            height={200} // Altura do logo
          />
        </div>

        {/* Formulário de busca */}
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
      </div>
    </main>
  );
}