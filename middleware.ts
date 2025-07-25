// middleware.ts
import createMiddleware from 'next-intl/middleware';
// O caminho de importação é relativo à localização do arquivo middleware.ts.
// Se ele está na raiz e o i18n.ts está dentro de src, o caminho é './src/i18n'.
import { locales, defaultLocale } from './src/i18n';

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  matcher: ['/', '/(pt|en)/:path*']
};