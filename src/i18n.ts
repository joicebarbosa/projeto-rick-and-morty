// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['pt', 'en'] as const;
export const defaultLocale = 'pt';
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Garantimos que a locale é válida.
  // Se não for, a função notFound() interrompe a execução.
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    // Carregamento dinâmico otimizado para o App Router
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});