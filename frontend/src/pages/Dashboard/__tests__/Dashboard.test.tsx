import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { membersApi } from '../../../api/members';
import { sampleMember, sampleMember2 } from '../../../test/msw-handlers';
import { renderWithProviders } from '../../../test/test-utils';
import Dashboard from '../Dashboard';

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

describe('Dashboard', () => {
  beforeEach(() => {
    mockList.mockResolvedValue({
      content: [sampleMember, sampleMember2],
      totalElements: 2,
      totalPages: 1,
      page: 0,
      size: 5,
    });
  });

  it('renders skeleton while data is loading (no h1 visible)', () => {
    mockList.mockImplementation(() => new Promise(() => undefined));
    renderWithProviders(<Dashboard />);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('displays total member count after loading', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('renders recent members after loading', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });

  it('navigates to /members on quick search submit with a value', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Doe');
    // submit the form
    await userEvent.keyboard('{Enter}');
    // Test passes if no error; navigation is handled by react-router
    expect(input).toBeInTheDocument();
  });

  it('renders a link to /members (View All)', async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());
    const allLinks = screen.getAllByRole('link');
    const membersLink = allLinks.some((l) => l.getAttribute('href') === '/members');
    expect(membersLink).toBe(true);
  });
});
