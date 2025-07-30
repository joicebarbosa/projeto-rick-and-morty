import { render, screen } from '@testing-library/react';
import HomePage from '@/app/[locale]/page';
import { NextIntlClientProvider } from 'next-intl';
import ptMessages from '@/messages/pt.json';

// Use o require() dentro do jest.mock() para evitar o erro de escopo
jest.mock('next/navigation', () => require('../__mocks__/next-navigation'));

describe('HomePage', () => {
  it('deve renderizar o título principal', () => {
    render(
      <NextIntlClientProvider locale="pt" messages={ptMessages}>
        <HomePage />
      </NextIntlClientProvider>
    );
    // O teste irá buscar o texto dentro de uma tag de cabeçalho
    expect(screen.getByRole('heading', { name: 'Projeto Rick and Morty' })).toBeInTheDocument();
  });
});