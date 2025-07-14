import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Mantém as fontes Geist
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rick & Morty Challenge", // Sugestão: Mudar o título para algo mais relevante
  description: "Desafio Front-end Rick & Morty", // Sugestão: Mudar a descrição
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/assets/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning={true} // <-- ADICIONE ESTA LINHA AQUI
      >
        {children}
      </body>
    </html>
  );
}