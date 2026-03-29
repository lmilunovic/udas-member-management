import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../../test/test-utils';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders children', () => {
    renderWithProviders(<Badge>ADMIN</Badge>);
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it.each(['default', 'secondary', 'destructive', 'outline', 'accent'] as const)(
    'renders with variant "%s" without throwing',
    (variant) => {
      expect(() => renderWithProviders(<Badge variant={variant}>label</Badge>)).not.toThrow();
    }
  );
});
