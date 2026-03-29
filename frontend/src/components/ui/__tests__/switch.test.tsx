import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../test/test-utils';
import { Switch } from '../switch';

describe('Switch', () => {
  it('renders with checked state', () => {
    renderWithProviders(<Switch checked={true} onCheckedChange={vi.fn()} aria-label="toggle" />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('renders with unchecked state', () => {
    renderWithProviders(<Switch checked={false} onCheckedChange={vi.fn()} aria-label="toggle" />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('calls onCheckedChange when clicked', async () => {
    const onCheckedChange = vi.fn();
    renderWithProviders(
      <Switch checked={false} onCheckedChange={onCheckedChange} aria-label="toggle" />
    );
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
