import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // Um caminho de URL que é prefixado com um dos locais suportados.
  // Por exemplo, /pt, /en
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  // Ignora arquivos no /public, /api e Next.js internals
  // Os caminhos `/api|/_next/|` são padrões
  // Você pode adicionar mais arquivos, como `/images|`, se necessário
  matcher: ['/((?!api|_next|images|favicon.ico).*)'],
};
