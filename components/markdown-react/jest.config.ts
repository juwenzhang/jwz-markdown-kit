import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'markdown-react',
      rootDir: './components/markdown-react',
      testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
      transform: {
        '^.+\\.(ts|tsx)$': '@swc/jest',
      },
      testEnvironment: 'jsdom',
    },
  ],
};

export default config;
