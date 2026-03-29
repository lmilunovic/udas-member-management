/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

import type { ApplicationUser } from '../api/types';
import { AuthContext } from '../context/AuthContext';
import i18n from '../i18n';

export * from '@testing-library/react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: MemoryRouterProps['initialEntries'];
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/',
    initialEntries,
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  const entries = initialEntries ?? [route];

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={entries}>{children}</MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

interface MockAuthProviderProps {
  children: React.ReactNode;
  user?: ApplicationUser | null;
  isLoading?: boolean;
  login?: () => void;
  logout?: () => void;
}

export function MockAuthProvider({
  children,
  user = null,
  isLoading = false,
  login = vi.fn(),
  logout = vi.fn(),
}: MockAuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

interface RenderWithAuthOptions extends RenderWithProvidersOptions {
  user?: ApplicationUser | null;
  isLoading?: boolean;
  login?: () => void;
  logout?: () => void;
}

export function renderWithAuth(
  ui: React.ReactElement,
  {
    user = null,
    isLoading = false,
    login = vi.fn(),
    logout = vi.fn(),
    route = '/',
    initialEntries,
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: RenderWithAuthOptions = {}
) {
  const entries = initialEntries ?? [route];

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={entries}>
            <MockAuthProvider user={user} isLoading={isLoading} login={login} logout={logout}>
              {children}
            </MockAuthProvider>
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
