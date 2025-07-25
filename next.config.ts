// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

// Passamos o caminho exato do seu arquivo de configuração i18n.ts
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

export default withNextIntl({});
