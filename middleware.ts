// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n';

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  // O matcher deve excluir _next, public, assets, etc.
  matcher: ['/((?!api|_next|.*\\..*).*)']
};