import { renderWithProviders } from '../../../test/test-utils';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('renders in the DOM', () => {
    const { container } = renderWithProviders(<Skeleton data-testid="sk" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts additional className', () => {
    const { container } = renderWithProviders(<Skeleton className="h-8 w-32" />);
    const el = container.firstChild as HTMLElement;
    expect(el.classList.contains('h-8')).toBe(true);
  });
});
