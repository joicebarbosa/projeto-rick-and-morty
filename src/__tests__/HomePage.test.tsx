import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'use-intl';
import HomePage from '@/app/[locale]/page';
// Importa o arquivo de mensagens com a nova estrutura aninhada
import messages from '@/messages/pt.json';

// Mock do Next.js navigation para simular o ambiente de roteamento
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => '/pt'),
  useParams: jest.fn(() => ({ locale: 'pt' })),
}));

// Mock da API fetch para evitar chamadas de rede reais nos testes
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [
        {
          id: 1,
          name: "Rick Sanchez",
          status: "Alive",
          species: "Human",
          gender: "Male",
          origin: { name: "Earth (C-137)" },
          location: { name: "Citadel of Ricks" },
          image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
          episode: ["https://rickandmortyapi.com/api/episode/1"],
        },
      ],
    }),
  })
) as jest.Mock;

describe('HomePage', () => {
  it('renders a heading', async () => {
    render(
      // Fornece o arquivo de mensagens completo para o IntlProvider
      <IntlProvider locale="pt" messages={messages}>
        <HomePage params={{ locale: 'pt' }} />
      </IntlProvider>
    );

    // Agora, o teste busca a tradução do título na estrutura aninhada `homePage.title`
    const heading = await screen.findByRole('heading', {
      name: /Projeto Rick and Morty/i,
    });
    
    expect(heading).toBeInTheDocument();
  });
});