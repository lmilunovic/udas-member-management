import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import { adminUser } from '../../../test/msw-handlers';
import { MockAuthProvider, renderWithProviders } from '../../../test/test-utils';
import Login from '../Login';

function LoginWithRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

describe('Login', () => {
  it('redirects to / when user is already authenticated', () => {
    renderWithProviders(
      <MockAuthProvider user={adminUser}>
        <LoginWithRoutes />
      </MockAuthProvider>,
      { route: '/login' }
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders the Google sign-in button when unauthenticated', () => {
    renderWithProviders(
      <MockAuthProvider user={null}>
        <Login />
      </MockAuthProvider>
    );
    // The login button contains the Google icon SVG and translated text
    const buttons = screen.getAllByRole('button');
    // There are EN/SR buttons + the Google button; find the Google one
    const googleButton = buttons.find((b) => b.querySelector('svg'));
    expect(googleButton).toBeDefined();
  });

  it('calls login when the Google button is clicked', async () => {
    const login = vi.fn();
    renderWithProviders(
      <MockAuthProvider user={null} login={login}>
        <Login />
      </MockAuthProvider>
    );
    const buttons = screen.getAllByRole('button');
    const googleButton = buttons.find((b) => b.querySelector('svg'))!;
    await userEvent.click(googleButton);
    expect(login).toHaveBeenCalledOnce();
  });

  it('renders the LanguageSwitcher', () => {
    renderWithProviders(
      <MockAuthProvider user={null}>
        <Login />
      </MockAuthProvider>
    );
    expect(screen.getByRole('group', { name: /language/i })).toBeInTheDocument();
  });
});
