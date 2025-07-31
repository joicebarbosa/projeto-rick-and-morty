import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import HomePage from '@/app/[locale]/page';
import messages from '@/messages/pt.json';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => '/pt'),
  useParams: jest.fn(() => ({ locale: 'pt' })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        info: { count: 1, pages: 1 },
        results: [
          {
            id: 1,
            name: 'Rick Sanchez',
            status: 'Alive',
            species: 'Human',
            gender: 'Male',
            origin: { name: 'Earth (C-137)' },
            location: { name: 'Citadel of Ricks' },
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            episode: ['https://rickandmortyapi.com/api/episode/1'],
          },
        ],
      }),
  })
) as jest.Mock;

describe('HomePage', () => {
  it('renders a heading', async () => {
    render(
      <NextIntlClientProvider locale="pt" messages={messages}>
        <HomePage />
      </NextIntlClientProvider>
    );

    const heading = await screen.findByRole('heading', {
      name: /Projeto Rick and Morty/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
