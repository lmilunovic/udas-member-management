import { act, renderHook, waitFor } from '@testing-library/react';

import { usersApi } from '../../api/users';
import { useAuth } from '../../hooks/useAuth';
import { adminUser } from '../../test/msw-handlers';
import { AuthProvider } from '../AuthContext';

// Mock the API module to avoid axios/MSW interception issues in jsdom
vi.mock('../../api/users', () => ({
  usersApi: {
    getCurrentUser: vi.fn(),
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockGetCurrentUser = vi.mocked(usersApi.getCurrentUser);

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    mockGetCurrentUser.mockResolvedValue(adminUser);
  });

  it('starts in loading state and resolves with user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toMatchObject({
      id: adminUser.id,
      email: adminUser.email,
      role: 'ADMIN',
    });
  });

  it('sets user to null when getCurrentUser rejects', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('Unauthorized'));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it('sets window.location.href when login is called', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.login());
    expect(window.location.href).toBe('/oauth2/authorization/google');
  });

  it('sets window.location.href when logout is called', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.logout());
    expect(window.location.href).toBe('/api/v1/auth/logout');
  });
});
