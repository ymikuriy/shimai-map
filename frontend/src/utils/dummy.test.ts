import { describe, it, expect } from 'vitest';
import { add } from './dummy';

describe('dummy test', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
});
