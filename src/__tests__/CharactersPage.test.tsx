import { render, screen, waitFor } from '@testing-library/react';
import CharactersPage from '@/app/[locale]/characters/page';
import messages from '@/messages/pt.json';
import { NextIntlClientProvider } from 'next-intl';

// Mock do `next/navigation` para que os hooks funcionem no ambiente de teste
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => ''), // Retorna uma string vazia para evitar loops
  })),
  usePathname: jest.fn(() => '/pt/characters'),
  useParams: jest.fn(() => ({ locale: 'pt' })),
}));

// Mock do `useTranslations` para não depender de variáveis fora do escopo do mock
jest.mock('next-intl', () => ({
  // Mantém as funcionalidades originais, mas substitui o hook `useTranslations`
  ...jest.requireActual('next-intl'),
  useTranslations: jest.fn(() => (key: string) => {
    // Retorna as traduções de forma direta para o ambiente de teste
    switch (key) {
      case 'searchPlaceholder':
        return 'Buscar personagens...';
      case 'searchButton':
        return 'Buscar';
      case 'noResults':
        // A mensagem de erro precisa ser mais genérica para o teste
        return 'Nenhum resultado encontrado para o personagem "".';
      default:
        // Caso a chave não seja encontrada, retorna a própria chave
        return key;
    }
  }),
}));

// Mock para a função global `fetch` para evitar chamadas de API reais
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          results: [
            {
              id: 1,
              name: 'Rick Sanchez',
              image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            },
          ],
        }),
    })
  ) as jest.Mock;
});

describe('CharactersPage', () => {
  it('renderiza a página sem crashar e exibe os elementos de busca', async () => {
    render(
      <NextIntlClientProvider locale="pt" messages={messages}>
        <CharactersPage />
      </NextIntlClientProvider>
    );

    // Usa `waitFor` para garantir que a renderização assíncrona seja completa
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Buscar personagens...');
      const button = screen.getByRole('button', { name: 'Buscar' });

      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });
});
