'use client'; // Esta linha é crucial para usar hooks do React no App Router

import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './page.module.css'; // Importa os estilos CSS Modules
import { useState } from 'react'; // Importa o hook useState para gerenciar o estado do input
import { useRouter } from 'next/navigation'; // Importa o hook useRouter para navegação

const inter = Inter({ subsets: ['latin'] }); // Configuração da fonte, se estiver usando

export default function Home() {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o texto digitado no campo de busca
  const router = useRouter(); // Instância do roteador para navegação

  // Função para lidar com a busca, redireciona para a página de caracteres
  const handleSearch = () => {
    if (searchTerm.trim()) { // Verifica se o termo de busca não está vazio
      router.push(`/characters?name=${searchTerm.trim()}`); // Redireciona com o termo na URL
    }
  };

  // Função para lidar com a tecla Enter no input de busca
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(); // Chama a função de busca
    }
  };

  return (
    <main className={`${styles.main} ${inter.className}`}>
      <div className={styles.background}>
        <Image
          src="/assets/background.png" // Caminho para a imagem de background
          alt="Rick and Morty Background"
          layout="fill" // Faz a imagem preencher o container
          objectFit="cover" // Garante que a imagem cubra a área sem distorcer
          quality={100} // Qualidade da imagem
        />
      </div>

      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Image
            src="/assets/logo.png" // Caminho para a imagem da logo (verifique se o nome é 'logo.png')
            alt="Rick and Morty Logo"
            width={450} // Largura da logo (ajuste se necessário)
            height={200} // Altura da logo (ajuste se necessário)
            objectFit="contain" // Garante que a logo caiba no espaço
          />
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar personagem" // Texto do placeholder
            className={styles.searchInput}
            value={searchTerm} // Conecta o input ao estado
            onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado ao digitar
            onKeyDown={handleKeyDown} // Adiciona o evento para a tecla Enter
          />
          <button
            className={styles.searchButton}
            onClick={handleSearch} // Adiciona o evento de clique ao botão
          >
            Buscar
          </button>
        </div>
      </div>
    </main>
  );
}