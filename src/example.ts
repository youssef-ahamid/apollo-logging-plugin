import { z } from 'zod';

const zNumbers = z.array(z.number()).min(2);

export function adder(...numbers: number[]) {
  const validationResult = zNumbers.safeParse(numbers);
  if (!validationResult.success) return 'Error: less than 2 numbers';
  return numbers.reduce((acc, num) => acc + num, 0);
}
