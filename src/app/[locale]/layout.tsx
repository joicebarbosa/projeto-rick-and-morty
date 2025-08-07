import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import i18n from '@/i18n'; // sua função está correta
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Rick and Morty',
};

interface Props {
  children: ReactNode;
  params: { locale: string };
}

// Esta função pode ser async sem problemas — se usada corretamente
export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  // Carrega as mensagens com base no locale
  const config = await i18n({ locale }).catch(() => null);

  if (!config) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={config.messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
