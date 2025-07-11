// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next'; // Importe Metadata, se ainda não estiver importado
import { Inter } from "next/font/google"; 

const inter = Inter({ subsets: ["latin"] }); 

export const metadata: Metadata = { // Certifique-se de que Metadata está importado e usado
  title: 'Rick and Morty Challenge',
  description: 'Um desafio de Rick e Morty com Next.js e Tailwind CSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head> {/* A tag <head> deve ser adicionada aqui */}
        <link rel="icon" href="/assets/favicon.png" /> {/* A tag do favicon vai DENTRO de <head> */}
      </head>
      <body className={inter.className}> {/* Se estiver usando fontes, aplique a classe aqui */}
        {children}
      </body>
    </html>
  );
}