import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers'; // Importação necessária

// Defina as locales que você suporta
export const locales = ['pt'] as const;
export type Locale = (typeof locales)[number];

// Exporte a locale padrão
export const defaultLocale = locales[0];

export default getRequestConfig(async () => {
  const localeHeader = headers().get('X-NEXT-INTL-LOCALE');
  const locale = localeHeader || defaultLocale;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale, // É necessário retornar a locale a partir de getRequestConfig
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});