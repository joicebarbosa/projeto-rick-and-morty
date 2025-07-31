// app/[locale]/layout.tsx
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import i18n from '@/i18n';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Rick and Morty',
};

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const config = await i18n({ locale: params.locale }).catch(() => null);

  if (!config) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={config.messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
