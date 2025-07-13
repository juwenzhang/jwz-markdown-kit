import { Token } from '../types/TokenType';

export const parser = (tokens: Token[]): Token => {
  return {
    type: 'document',
    children: tokens
  };
};
