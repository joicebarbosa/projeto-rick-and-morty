// src/app/[locale]/layout.tsx
import '@/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales, Locale } from '../../i18n';
import PageTransition from '@/components/PageTransition';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import getRequestConfig from '../../i18n';
import RouteSoundEffect from '@/components/RouteSoundEffect';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

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
  // CORREÇÃO: Use `await` para desestruturar 'params'
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  let messages;
  try {
    messages = (await getRequestConfig({ locale })).messages;
  } catch (error) {
    console.error("Failed to load messages for locale:", locale, error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleSwitcher />
          <RouteSoundEffect />
          <PageTransition>{children}</PageTransition>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}