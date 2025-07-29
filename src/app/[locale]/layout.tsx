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

// ✅ Componente client-only para efeitos
function ClientEffectsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteSoundEffect />
      <LocaleSwitcher />
      {children}
    </>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) notFound();

  let messages;
  try {
    messages = (await getRequestConfig({ locale })).messages;
  } catch (error) {
    console.error('Erro ao carregar mensagens:', locale, error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientEffectsWrapper>
            <PageTransition>{children}</PageTransition>
          </ClientEffectsWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
