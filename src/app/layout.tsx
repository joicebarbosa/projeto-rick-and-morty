// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Rick and Morty Challenge',
  description: 'Um desafio de Rick and Morty com Next.js e Tailwind CSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}