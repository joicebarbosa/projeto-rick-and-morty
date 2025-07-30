import { render, screen } from '@testing-library/react';
import CharactersPage from '../app/[locale]/characters/page';

test('renderiza a página de personagens sem crashar', () => {
  render(<CharactersPage />);
  expect(screen.getByPlaceholderText(/Buscar personagem/i)).toBeInTheDocument();
});
