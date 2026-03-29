import { cn } from '../utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('filters out falsy values', () => {
    expect(cn(undefined, false, null, 0 as unknown as string, 'visible')).toBe('visible');
  });

  it('handles object syntax', () => {
    expect(cn({ hidden: true, visible: false })).toBe('hidden');
  });
});
