// src/app/[locale]/layout.tsx
import '@/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales } from '@/i18n'; // Importa 'locales' de '@/i18n'
import PageTransition from '@/components/PageTransition';
import LocaleSwitcher from '@/components/LocaleSwitcher';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Rick & Morty Challenge',
  description: 'Desafio Front-end Rick & Morty',
};

export function generateStaticParams() {
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

  if (!locales.includes(locale)) notFound();

  // Carrega as mensagens do idioma correto
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}> {/* Adicionado suppressHydrationWarning */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleSwitcher />
          <PageTransition>{children}</PageTransition>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}