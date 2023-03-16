import { expect, it } from 'vitest';
import { adder } from './example';

it('adds numbers correctly', async () => {
  const result = adder(1, 2, 3, 4, 5);
  expect(result).toBe(1 + 2 + 3 + 4 + 5);
});

it('throws error when less than 2 numbers', async () => {
  const result = adder(1);
  expect(result).toBe('Error: less than 2 numbers');
});
