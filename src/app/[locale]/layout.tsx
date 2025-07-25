// src/app/[locale]/layout.tsx
import '@/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
// Importa 'locales' diretamente do i18n.ts consolidado para generateStaticParams
import { locales } from '../../i18n'; // Caminho relativo de src/app/[locale]/ para src/i18n.ts
import PageTransition from '@/components/PageTransition';
import LocaleSwitcher from '@/components/LocaleSwitcher';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' }); // Corrigido para '--font-geist-sans'
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' }); // Corrigido para '--font-geist-mono'

export const metadata: Metadata = {
  title: 'Rick & Morty Challenge',
  description: 'Desafio Front-end Rick & Morty',
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;

  // A validação do locale pode ser feita aqui ou no i18n.ts.
  // Se o i18n.ts já faz, aqui é opcional, mas não prejudica.
  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    // Importa a função getRequestConfig do i18n.ts e a executa
    const getRequestConfigModule = await import('../../i18n'); // Caminho relativo de src/app/[locale]/ para src/i18n.ts
    const requestConfig = getRequestConfigModule.default;
    const config = await requestConfig({ locale });
    messages = config.messages;
  } catch (error) {
    console.error("Failed to load messages for locale:", locale, error);
    notFound(); // Redireciona para 404 se as mensagens não puderem ser carregadas
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}> {/* ADICIONADO suppressHydrationWarning */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleSwitcher />
          <PageTransition>{children}</PageTransition>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}