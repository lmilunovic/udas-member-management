import { screen } from '@testing-library/react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Skeleton } from './components/ui/skeleton';
import { useAuth } from './hooks/useAuth';
import { adminUser, readOnlyUser } from './test/msw-handlers';
import { MockAuthProvider, renderWithProviders } from './test/test-utils';

// Inline PrivateRoute mirroring App.tsx for isolated unit testing
function PrivateRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return (
      <div data-testid="loading-skeleton">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />;
  return <>{children}</>;
}

function TestApp({ adminOnly = false }: { adminOnly?: boolean }) {
  return (
    <Routes>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/" element={<div>Home Page</div>} />
      <Route
        path="/protected"
        element={
          <PrivateRoute adminOnly={adminOnly}>
            <div>Protected Content</div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

describe('PrivateRoute', () => {
  it('renders skeleton while loading', () => {
    renderWithProviders(
      <MockAuthProvider isLoading={true}>
        <TestApp />
      </MockAuthProvider>,
      { route: '/protected' }
    );
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('redirects to /login when user is null', () => {
    renderWithProviders(
      <MockAuthProvider user={null} isLoading={false}>
        <TestApp />
      </MockAuthProvider>,
      { route: '/protected' }
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    renderWithProviders(
      <MockAuthProvider user={adminUser} isLoading={false}>
        <TestApp />
      </MockAuthProvider>,
      { route: '/protected' }
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to / when non-admin user accesses admin-only route', () => {
    renderWithProviders(
      <MockAuthProvider user={readOnlyUser} isLoading={false}>
        <TestApp adminOnly={true} />
      </MockAuthProvider>,
      { route: '/protected' }
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when admin user accesses admin-only route', () => {
    renderWithProviders(
      <MockAuthProvider user={adminUser} isLoading={false}>
        <TestApp adminOnly={true} />
      </MockAuthProvider>,
      { route: '/protected' }
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
