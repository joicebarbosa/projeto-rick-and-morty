// src/__mocks__/next-navigation.ts

export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
});

export const useSearchParams = () => ({
  get: jest.fn(),
});

export const useParams = () => ({
  locale: 'pt', // Simula o idioma da URL
});