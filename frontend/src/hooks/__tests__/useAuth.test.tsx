import { renderHook } from '@testing-library/react';

import { AuthProvider } from '../../context/AuthContext';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('returns the auth context when inside AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });
    // AuthProvider fetches current user on mount; context should be defined
    expect(result.current).toBeDefined();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('throws when used outside AuthProvider', () => {
    // Suppress console.error from React's error boundary
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    consoleError.mockRestore();
  });
});
