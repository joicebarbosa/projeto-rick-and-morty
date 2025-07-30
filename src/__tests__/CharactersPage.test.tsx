import { render, screen } from '@testing-library/react';
import CharactersPage from '@/app/[locale]/characters/page';
import { NextIntlClientProvider } from 'next-intl';
import ptMessages from '@/messages/pt.json';

// Use o require() dentro do jest.mock() para evitar o erro de escopo
jest.mock('next/navigation', () => require('../__mocks__/next-navigation'));

describe('CharactersPage', () => {
  it('deve renderizar a página de personagens sem crashar', () => {
    render(
      <NextIntlClientProvider locale="pt" messages={ptMessages}>
        <CharactersPage />
      </NextIntlClientProvider>
    );
    // Verifique se o placeholder está presente para confirmar a renderização
    expect(screen.getByPlaceholderText(/Buscar personagem/i)).toBeInTheDocument();
  });
});