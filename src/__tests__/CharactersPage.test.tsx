import { render, screen } from '@testing-library/react';
import CharactersPage from '@/app/[locale]/characters/page';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/pt.json';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/pt/characters'),
  useParams: jest.fn(() => ({ locale: 'pt' })),
}));

describe('CharactersPage', () => {
  it('renderiza a página sem crashar', () => {
    render(
      <NextIntlClientProvider locale="pt" messages={messages}>
        <CharactersPage />
      </NextIntlClientProvider>
    );

    expect(screen.getByPlaceholderText(/Buscar personagem/i)).toBeInTheDocument();
  });
});
