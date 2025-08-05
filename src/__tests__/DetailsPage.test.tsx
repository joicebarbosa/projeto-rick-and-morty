// src/__tests__/DetailsPage.test.tsx
import { render, screen } from '@testing-library/react';
import CharacterDetailPage from '@/app/[locale]/characters/[id]/page';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/pt.json';

// Mock do roteamento
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useParams: () => ({ locale: 'pt', id: '1' }),
  usePathname: () => '/pt/characters/1',
}));

// Mock da requisição GraphQL
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            character: {
              id: '1',
              name: 'Rick Sanchez',
              status: 'Alive',
              species: 'Human',
              type: 'Scientist',
              gender: 'Male',
              image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
              origin: {
                id: '10',
                name: 'Earth (C-137)',
                type: 'Planet',
                dimension: 'Dimension C-137',
              },
              location: {
                id: '20',
                name: 'Citadel of Ricks',
                type: 'Space station',
                dimension: 'Unknown',
              },
            },
          },
        }),
    })
  ) as jest.Mock;
});

describe('CharacterDetailPage', () => {
  it('renderiza detalhes do personagem sem erro', async () => {
    render(
      <NextIntlClientProvider locale="pt" messages={messages}>
        <CharacterDetailPage />
      </NextIntlClientProvider>
    );

    // Espera pelo nome do personagem
    const name = await screen.findByRole('heading', { name: /Rick Sanchez/i });
    expect(name).toBeInTheDocument();

    // Espera por espécie
    expect(screen.getByText(/Human/i)).toBeInTheDocument();

    // Espera pelo botão de fechar
    expect(screen.getByRole('button', { name: /Fechar/i })).toBeInTheDocument();
  });
});

