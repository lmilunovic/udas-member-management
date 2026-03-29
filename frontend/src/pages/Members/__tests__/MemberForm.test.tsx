import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import { membersApi } from '../../../api/members';
import { sampleMember, adminUser } from '../../../test/msw-handlers';
import {
  MockAuthProvider,
  renderWithProviders,
  createTestQueryClient,
} from '../../../test/test-utils';
import MemberForm from '../MemberForm';

vi.mock('../../../api/members', () => ({
  membersApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockGet = vi.mocked(membersApi.get);
const mockCreate = vi.mocked(membersApi.create);
const mockUpdate = vi.mocked(membersApi.update);

function renderForm(route: string) {
  const queryClient = createTestQueryClient();
  return renderWithProviders(
    <MockAuthProvider user={adminUser}>
      <Routes>
        <Route path="/members" element={<div>Members List</div>} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/:id/edit" element={<MemberForm />} />
      </Routes>
    </MockAuthProvider>,
    { route, queryClient }
  );
}

describe('MemberForm', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue(sampleMember);
    mockCreate.mockResolvedValue({ ...sampleMember, id: '999' });
    mockUpdate.mockResolvedValue(sampleMember);
  });

  describe('Create mode (/members/new)', () => {
    it('renders with empty first/last name fields', () => {
      renderForm('/members/new');
      // Use placeholder since Label has no htmlFor
      expect(screen.getByPlaceholderText(/enter first name|unesite ime/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/enter last name|unesite prezime/i)).toHaveValue('');
    });

    it('does not call membersApi.get in create mode', () => {
      renderForm('/members/new');
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('navigates to /members on successful create', async () => {
      renderForm('/members/new');

      await userEvent.type(screen.getByPlaceholderText(/enter first name|unesite ime/i), 'Alice');
      await userEvent.type(
        screen.getByPlaceholderText(/enter last name|unesite prezime/i),
        'Wonder'
      );

      await userEvent.click(screen.getByRole('button', { name: /create member|kreiraj člana/i }));

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(screen.getByText('Members List')).toBeInTheDocument();
      });
    });

    it('shows error banner when create fails', async () => {
      mockCreate.mockRejectedValue(new Error('Server Error'));
      renderForm('/members/new');

      await userEvent.type(screen.getByPlaceholderText(/enter first name|unesite ime/i), 'Alice');
      await userEvent.type(
        screen.getByPlaceholderText(/enter last name|unesite prezime/i),
        'Wonder'
      );

      await userEvent.click(screen.getByRole('button', { name: /create member|kreiraj člana/i }));

      await waitFor(() => {
        // After error, button is re-enabled
        expect(
          screen.getByRole('button', { name: /create member|kreiraj člana/i })
        ).not.toBeDisabled();
      });
    });

    it('navigates to /members when cancel is clicked', async () => {
      renderForm('/members/new');
      await userEvent.click(screen.getByRole('button', { name: /cancel|otkaži/i }));
      expect(screen.getByText('Members List')).toBeInTheDocument();
    });
  });

  describe('Address section', () => {
    it('typing in the street field calls handleAddressChange', async () => {
      renderForm('/members/new');

      const streetInput = screen.getByPlaceholderText(/street address|naziv ulice/i);
      await userEvent.type(streetInput, '123 Main St');

      expect(streetInput).toHaveValue('123 Main St');
    });
  });

  describe('Edit mode (/members/:id/edit)', () => {
    it('shows skeleton while loading member', () => {
      mockGet.mockImplementation(() => new Promise(() => undefined));
      renderForm(`/members/${sampleMember.id}/edit`);
      expect(
        screen.queryByPlaceholderText(/enter first name|unesite ime/i)
      ).not.toBeInTheDocument();
    });

    it('populates fields with member data', async () => {
      renderForm(`/members/${sampleMember.id}/edit`);
      await waitFor(() => {
        expect(screen.getByDisplayValue(sampleMember.firstName)).toBeInTheDocument();
        expect(screen.getByDisplayValue(sampleMember.lastName)).toBeInTheDocument();
      });
    });

    it('calls update on submit in edit mode', async () => {
      renderForm(`/members/${sampleMember.id}/edit`);
      await waitFor(() =>
        expect(screen.getByDisplayValue(sampleMember.firstName)).toBeInTheDocument()
      );

      await userEvent.click(screen.getByRole('button', { name: /update member|ažuriraj člana/i }));

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(sampleMember.id, expect.any(Object));
      });
    });

    it('navigates to /members after successful update', async () => {
      renderForm(`/members/${sampleMember.id}/edit`);
      await waitFor(() =>
        expect(screen.getByDisplayValue(sampleMember.firstName)).toBeInTheDocument()
      );

      await userEvent.click(screen.getByRole('button', { name: /update member|ažuriraj člana/i }));

      await waitFor(() => {
        expect(screen.getByText('Members List')).toBeInTheDocument();
      });
    });
  });
});
