// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['pt', 'en'] as const;
export const defaultLocale = 'pt';
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is always a valid string from locales
  const selectedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  if (!locales.includes(selectedLocale)) notFound();

  return {
    locale: selectedLocale,
    messages: (await import(`./messages/${selectedLocale}.json`)).default,
  };
});