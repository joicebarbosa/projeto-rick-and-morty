module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(next-intl)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|svg|mp3|wav)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
};