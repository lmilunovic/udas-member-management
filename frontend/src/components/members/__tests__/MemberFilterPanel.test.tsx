import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../test/test-utils';
import { MemberFilterPanel } from '../MemberFilterPanel';

const defaultFilters = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  country: '',
};

describe('MemberFilterPanel', () => {
  it('starts collapsed — toggle button shows expand icon', () => {
    renderWithProviders(
      <MemberFilterPanel
        filters={defaultFilters}
        activeFilterCount={0}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
  });

  it('expands when the toggle button is clicked', async () => {
    renderWithProviders(
      <MemberFilterPanel
        filters={defaultFilters}
        activeFilterCount={0}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /expand/i }));
    expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument();
  });

  it('does not show Clear All when activeFilterCount is 0', () => {
    renderWithProviders(
      <MemberFilterPanel
        filters={defaultFilters}
        activeFilterCount={0}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: /clear all|ukloni sve/i })).not.toBeInTheDocument();
  });

  it('shows count badge and Clear All button when activeFilterCount > 0', () => {
    renderWithProviders(
      <MemberFilterPanel
        filters={{ ...defaultFilters, firstName: 'Alice' }}
        activeFilterCount={1}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /clear all|ukloni sve/i })).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls onReset when Clear All is clicked', async () => {
    const onReset = vi.fn();
    renderWithProviders(
      <MemberFilterPanel
        filters={{ ...defaultFilters, firstName: 'Alice' }}
        activeFilterCount={1}
        onFilterChange={vi.fn()}
        onReset={onReset}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /clear all|ukloni sve/i }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('DebouncedInput fires onChange after 300ms delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onFilterChange = vi.fn();

    renderWithProviders(
      <MemberFilterPanel
        filters={defaultFilters}
        activeFilterCount={0}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />
    );

    // Expand the panel using real timer click
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /expand/i }));
    });

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];

    await act(async () => {
      await userEvent.type(firstInput, 'A');
    });

    // Not yet called (within 300ms debounce)
    expect(onFilterChange).not.toHaveBeenCalled();

    // Advance timers past debounce threshold
    act(() => {
      vi.advanceTimersByTime(350);
    });

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalled();
    });

    vi.useRealTimers();
  });

  it('DebouncedInput syncs local value when external filter is reset', async () => {
    const onFilterChange = vi.fn();
    const { rerender } = renderWithProviders(
      <MemberFilterPanel
        filters={{ ...defaultFilters, firstName: 'Alice' }}
        activeFilterCount={1}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />
    );

    // Expand
    await userEvent.click(screen.getByRole('button', { name: /expand/i }));

    // Inputs should show 'Alice' for firstName
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('Alice');

    // Simulate external reset (parent clears filters)
    rerender(
      <MemberFilterPanel
        filters={defaultFilters}
        activeFilterCount={0}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('');
    });
  });
});
