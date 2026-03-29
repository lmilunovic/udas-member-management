import { screen, within } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';

import { adminUser, readOnlyUser } from '../../test/msw-handlers';
import { MockAuthProvider, renderWithProviders } from '../../test/test-utils';
import Layout from '../Layout/Layout';

function LayoutWrapper() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login Page</div>} />
      <Route element={<Layout />}>
        <Route path="/" element={<div data-testid="outlet-content">Outlet Dashboard</div>} />
        <Route path="/members" element={<div data-testid="outlet-content">Outlet Members</div>} />
        <Route path="/users" element={<div data-testid="outlet-content">Outlet Users</div>} />
      </Route>
    </Routes>
  );
}

describe('Layout', () => {
  it('renders skeleton while loading', () => {
    renderWithProviders(
      <MockAuthProvider isLoading={true}>
        <LayoutWrapper />
      </MockAuthProvider>,
      { route: '/' }
    );
    // LayoutSkeleton renders, no nav
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is null', () => {
    renderWithProviders(
      <MockAuthProvider user={null} isLoading={false}>
        <LayoutWrapper />
      </MockAuthProvider>,
      { route: '/' }
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('does not show Users nav link for non-admin users', () => {
    renderWithProviders(
      <MockAuthProvider user={readOnlyUser} isLoading={false}>
        <LayoutWrapper />
      </MockAuthProvider>,
      { route: '/' }
    );
    const nav = screen.getByRole('navigation');
    expect(within(nav).queryByRole('link', { name: /users/i })).not.toBeInTheDocument();
  });

  it('shows Users nav link for admin users', () => {
    renderWithProviders(
      <MockAuthProvider user={adminUser} isLoading={false}>
        <LayoutWrapper />
      </MockAuthProvider>,
      { route: '/' }
    );
    const nav = screen.getByRole('navigation');
    expect(within(nav).getByRole('link', { name: /users/i })).toBeInTheDocument();
  });

  it('renders the outlet content', () => {
    renderWithProviders(
      <MockAuthProvider user={adminUser} isLoading={false}>
        <LayoutWrapper />
      </MockAuthProvider>,
      { route: '/' }
    );
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  it('renders the user initials trigger button', () => {
    renderWithProviders(
      <MockAuthProvider user={adminUser} isLoading={false}>
        <LayoutWrapper />
      </MockAuthProvider>,
      { route: '/' }
    );
    // getInitials('Admin User') => 'AU'
    const initials = adminUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    expect(screen.getByText(initials)).toBeInTheDocument();
  });
});
