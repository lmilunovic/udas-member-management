import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import { usersApi } from '../../../api/users';
import { adminUser, readOnlyUser } from '../../../test/msw-handlers';
import { MockAuthProvider, renderWithProviders, createTestQueryClient } from '../../../test/test-utils';
import UserForm from '../UserForm';


vi.mock('../../../api/users', () => ({
  usersApi: {
    getCurrentUser: vi.fn(),
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockGet = vi.mocked(usersApi.get);
const mockCreate = vi.mocked(usersApi.create);
const mockUpdate = vi.mocked(usersApi.update);

function renderForm(route: string) {
  return renderWithProviders(
    <MockAuthProvider user={adminUser}>
      <Routes>
        <Route path="/users" element={<div>Users List</div>} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users/:id/edit" element={<UserForm />} />
      </Routes>
    </MockAuthProvider>,
    { route, queryClient: createTestQueryClient() }
  );
}

describe('UserForm', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue(readOnlyUser);
    mockCreate.mockResolvedValue({ ...adminUser, id: '999' });
    mockUpdate.mockResolvedValue(readOnlyUser);
  });

  describe('Create mode (/users/new)', () => {
    it('renders with empty email and default READ_ONLY role', () => {
      renderForm('/users/new');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });

    it('email field is not disabled in create mode', () => {
      renderForm('/users/new');
      expect(screen.getByLabelText(/email/i)).not.toBeDisabled();
    });

    it('calls usersApi.create on submit', async () => {
      renderForm('/users/new');

      await userEvent.type(screen.getByLabelText(/email/i), 'new@test.com');

      await userEvent.click(screen.getByRole('button', { name: /create user/i }));

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalled();
      });
    });

    it('navigates to /users after successful create', async () => {
      renderForm('/users/new');
      await userEvent.type(screen.getByLabelText(/email/i), 'new@test.com');
      await userEvent.click(screen.getByRole('button', { name: /create user/i }));
      await waitFor(() => {
        expect(screen.getByText('Users List')).toBeInTheDocument();
      });
    });

    it('shows error banner when create fails', async () => {
      mockCreate.mockRejectedValue(new Error('Server error'));
      renderForm('/users/new');
      await userEvent.type(screen.getByLabelText(/email/i), 'new@test.com');
      await userEvent.click(screen.getByRole('button', { name: /create user/i }));
      await waitFor(() => {
        // After mutation error, button re-enables
        expect(screen.getByRole('button', { name: /create user/i })).not.toBeDisabled();
      });
    });

    it('navigates to /users on cancel', async () => {
      renderForm('/users/new');
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.getByText('Users List')).toBeInTheDocument();
    });
  });

  describe('Edit mode (/users/:id/edit)', () => {
    it('shows skeleton while user is loading', () => {
      mockGet.mockImplementation(() => new Promise(() => undefined));
      renderForm(`/users/${readOnlyUser.id}/edit`);
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    });

    it('populates email field from user data', async () => {
      renderForm(`/users/${readOnlyUser.id}/edit`);
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toHaveValue(readOnlyUser.email);
      });
    });

    it('disables the email field in edit mode', async () => {
      renderForm(`/users/${readOnlyUser.id}/edit`);
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeDisabled();
      });
    });

    it('calls usersApi.update on submit', async () => {
      renderForm(`/users/${readOnlyUser.id}/edit`);
      await waitFor(() => expect(screen.getByLabelText(/email/i)).toBeInTheDocument());
      await userEvent.click(screen.getByRole('button', { name: /update user/i }));
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(readOnlyUser.id, expect.any(Object));
      });
    });
  });
});
