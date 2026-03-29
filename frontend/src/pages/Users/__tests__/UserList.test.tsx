import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { usersApi } from '../../../api/users';
import { adminUser, readOnlyUser } from '../../../test/msw-handlers';
import { MockAuthProvider, renderWithProviders, createTestQueryClient } from '../../../test/test-utils';
import UserList from '../UserList';


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

const mockList = vi.mocked(usersApi.list);
const mockDelete = vi.mocked(usersApi.delete);

const DELETE_BTN_RE = /^delete$|^obriši$/i;

function renderUserList() {
  return renderWithProviders(
    <MockAuthProvider user={adminUser}>
      <UserList />
    </MockAuthProvider>,
    { queryClient: createTestQueryClient() }
  );
}

describe('UserList', () => {
  beforeEach(() => {
    mockList.mockResolvedValue({
      content: [adminUser, readOnlyUser],
      totalElements: 2,
      totalPages: 1,
      page: 0,
      size: 20,
    });
    mockDelete.mockResolvedValue(undefined as never);
  });

  it('renders skeleton while loading', () => {
    mockList.mockImplementation(() => new Promise(() => undefined));
    renderUserList();
    expect(screen.queryByText(adminUser.name)).not.toBeInTheDocument();
  });

  it('renders user rows after loading', async () => {
    renderUserList();
    await waitFor(() => {
      expect(screen.getByText(adminUser.name)).toBeInTheDocument();
      expect(screen.getByText(readOnlyUser.email)).toBeInTheDocument();
    });
  });

  it('shows empty state when no users are returned', async () => {
    mockList.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 });
    renderUserList();
    await waitFor(() => {
      expect(
        screen.getByText(/no users found|nema pronađenih korisnika/i)
      ).toBeInTheDocument();
    });
  });

  it('shows ADMIN role badge', async () => {
    renderUserList();
    await waitFor(() => {
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
    });
  });

  it('shows READ_ONLY role badge', async () => {
    renderUserList();
    await waitFor(() => {
      expect(screen.getByText('READ_ONLY')).toBeInTheDocument();
    });
  });

  it('opens delete dialog when delete button is clicked', async () => {
    renderUserList();
    await waitFor(() => expect(screen.getByText(adminUser.name)).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', { name: DELETE_BTN_RE });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('calls usersApi.delete on confirm', async () => {
    renderUserList();
    await waitFor(() => expect(screen.getByText(adminUser.name)).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', { name: DELETE_BTN_RE });
    await userEvent.click(deleteButtons[0]);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    const dialog = screen.getByRole('dialog');
    const confirmBtn = within(dialog).getByRole('button', { name: DELETE_BTN_RE });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
      expect(mockDelete.mock.calls[0][0]).toBe(adminUser.id);
    });
  });
});
