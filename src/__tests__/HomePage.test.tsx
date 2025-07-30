// src/__tests__/HomePage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '@/app/[locale]/page';
import { NextIntlClientProvider } from 'next-intl';
import ptMessages from '@/messages/pt.json';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { createMockRouter } from '../test-utils/createMockRouter';

describe('HomePage', () => {
  const renderWithProviders = () => {
    render(
      <NextIntlClientProvider locale="pt" messages={ptMessages}>
        <RouterContext.Provider value={createMockRouter({ push: jest.fn() })}>
          <HomePage />
        </RouterContext.Provider>
      </NextIntlClientProvider>
    );
  };

  it('renderiza o campo de busca e botão com tradução', () => {
    renderWithProviders();

    const input = screen.getByPlaceholderText(ptMessages.searchPlaceholder);
    const button = screen.getByRole('button', { name: ptMessages.searchButton });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('digita no campo e clica em buscar', () => {
    const mockPush = jest.fn();

    render(
      <NextIntlClientProvider locale="pt" messages={ptMessages}>
        <RouterContext.Provider value={createMockRouter({ push: mockPush })}>
          <HomePage />
        </RouterContext.Provider>
      </NextIntlClientProvider>
    );

    const input = screen.getByPlaceholderText(ptMessages.searchPlaceholder);
    const button = screen.getByRole('button', { name: ptMessages.searchButton });

    fireEvent.change(input, { target: { value: 'Rick' } });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/pt/characters?name=Rick');
  });
});
