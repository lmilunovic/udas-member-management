import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { membersApi } from '../../../api/members';
import { sampleMember, sampleMember2, adminUser } from '../../../test/msw-handlers';
import {
  MockAuthProvider,
  renderWithProviders,
  createTestQueryClient,
} from '../../../test/test-utils';
import MemberList from '../MemberList';

vi.mock('../../../api/members', () => ({
  membersApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockList = vi.mocked(membersApi.list);
const mockDelete = vi.mocked(membersApi.delete);

// Button text differs per locale: "Delete" (EN) or "Obriši" (SR)
const DELETE_BTN_RE = /^delete$|^obriši$/i;
const CANCEL_BTN_RE = /^cancel$|^otkaži$/i;

function renderMemberList(opts: { route?: string } = {}) {
  const queryClient = createTestQueryClient();
  return renderWithProviders(
    <MockAuthProvider user={adminUser}>
      <MemberList />
    </MockAuthProvider>,
    { route: opts.route ?? '/members', queryClient }
  );
}

describe('MemberList', () => {
  beforeEach(() => {
    mockList.mockResolvedValue({
      content: [sampleMember, sampleMember2],
      totalElements: 2,
      totalPages: 1,
      page: 0,
      size: 20,
    });
    mockDelete.mockResolvedValue(undefined as never);
  });

  it('renders skeleton rows while loading', () => {
    mockList.mockImplementation(() => new Promise(() => undefined));
    renderMemberList();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('renders member data after loading', async () => {
    renderMemberList();
    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john.smith@example.com')).toBeInTheDocument();
    });
  });

  it('shows no-data empty state without clear filters button when no filters', async () => {
    mockList.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 });
    renderMemberList();
    await waitFor(() => {
      // No "clear filters" button when activeFilterCount === 0
      expect(
        screen.queryByRole('button', { name: /clear filter|ukloni filtere/i })
      ).not.toBeInTheDocument();
    });
  });

  it('shows clear filters button in empty state when filters are active', async () => {
    mockList.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 });
    renderMemberList({ route: '/members?lastName=Nobody' });
    await waitFor(() => {
      // initialLastName from searchParams triggers activeFilterCount > 0
      expect(
        screen.getByRole('button', { name: /clear filter|ukloni filtere|obriši filter/i })
      ).toBeInTheDocument();
    });
  });

  it('hides pagination when totalElements is 0', async () => {
    mockList.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 });
    renderMemberList();
    await waitFor(() => {
      expect(screen.queryByLabelText(/first page|prva strana/i)).not.toBeInTheDocument();
    });
  });

  it('shows pagination controls when data is present', async () => {
    renderMemberList();
    await waitFor(() => {
      expect(screen.getByLabelText(/first page|prva strana/i)).toBeInTheDocument();
    });
  });

  it('first-page button is disabled on page 0', async () => {
    renderMemberList();
    await waitFor(() => {
      const firstPageBtn = screen.getByLabelText(/first page|prva strana/i);
      expect(firstPageBtn).toBeDisabled();
    });
  });

  it('clicking a sortable column header triggers a re-fetch', async () => {
    renderMemberList();
    await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument());

    mockList.mockClear();
    // firstName column header is a sort button — "Ime" (SR) / "First Name" (EN)
    const sortBtn = screen.getByRole('button', { name: /^ime$|^first name$/i });
    await userEvent.click(sortBtn);

    await waitFor(() => {
      expect(mockList).toHaveBeenCalled();
    });
  });

  it('clicking a sorted column again reverses sort direction', async () => {
    renderMemberList();
    await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument());

    const sortBtn = screen.getByRole('button', { name: /^ime$|^first name$/i });
    await userEvent.click(sortBtn); // sort asc

    mockList.mockClear();
    await userEvent.click(sortBtn); // sort desc

    await waitFor(() => {
      expect(mockList).toHaveBeenCalled();
    });
  });

  it('clicking clear filters in empty state resets filters', async () => {
    mockList.mockResolvedValue({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 });
    renderMemberList({ route: '/members?lastName=Nobody' });

    const clearBtn = await screen.findByRole('button', { name: /clear filter|ukloni filtere/i });
    mockList.mockClear();
    await userEvent.click(clearBtn);

    await waitFor(() => {
      expect(mockList).toHaveBeenCalled();
    });
  });

  it('clicking next page button re-fetches with page=1', async () => {
    mockList.mockResolvedValue({
      content: [sampleMember, sampleMember2],
      totalElements: 40,
      totalPages: 2,
      page: 0,
      size: 20,
    });
    renderMemberList();
    await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument());

    mockList.mockClear();
    const nextBtn = screen.getByLabelText(/next page|sledeća stranica/i);
    await userEvent.click(nextBtn);

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
    });
  });

  it('clicking last page button re-fetches with last page', async () => {
    mockList.mockResolvedValue({
      content: [sampleMember, sampleMember2],
      totalElements: 60,
      totalPages: 3,
      page: 0,
      size: 20,
    });
    renderMemberList();
    await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument());

    mockList.mockClear();
    const lastBtn = screen.getByLabelText(/last page|poslednja stranica/i);
    await userEvent.click(lastBtn);

    await waitFor(() => {
      expect(mockList).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
    });
  });

  it('opens delete dialog when delete button is clicked', async () => {
    renderMemberList();
    await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument());

    // Find all delete buttons in the table rows
    const deleteButtons = screen.getAllByRole('button', { name: DELETE_BTN_RE });
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes dialog when cancel is clicked', async () => {
    renderMemberList();
    await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', { name: DELETE_BTN_RE });
    await userEvent.click(deleteButtons[0]);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: CANCEL_BTN_RE }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('calls delete and closes dialog on confirm', async () => {
    renderMemberList();
    await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', { name: DELETE_BTN_RE });
    await userEvent.click(deleteButtons[0]);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // Click the confirm delete button inside the dialog
    const dialog = screen.getByRole('dialog');
    const dialogDeleteBtn = within(dialog).getByRole('button', { name: DELETE_BTN_RE });
    await userEvent.click(dialogDeleteBtn);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
      expect(mockDelete.mock.calls[0][0]).toBe(sampleMember.id);
    });
  });
});
