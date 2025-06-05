import { calculatePasswordStrength } from '../password';

describe('calculatePasswordStrength', () => {
  it('returns weak for short passwords', () => {
    expect(calculatePasswordStrength('abc')).toBe('weak');
  });

  it('returns fair for basic long passwords with mixed case', () => {
    expect(calculatePasswordStrength('Abcdefgh')).toBe('fair');
  });

  it('returns good for passwords meeting four criteria', () => {
    expect(calculatePasswordStrength('Abcdefg1')).toBe('good');
  });

  it('returns strong for passwords meeting all criteria', () => {
    expect(calculatePasswordStrength('Abcdef1!')).toBe('strong');
  });

  it('returns strong for complex passwords', () => {
    expect(calculatePasswordStrength('Abcdef1!x')).toBe('strong');
  });
});
