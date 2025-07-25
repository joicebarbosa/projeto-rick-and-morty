// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

// Passamos o caminho exato do seu arquivo de configuração i18n.ts
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);