import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from '../../i18n';
import { renderWithProviders } from '../../test/test-utils';
import { LanguageSwitcher } from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('renders EN and SR buttons', () => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SR/i })).toBeInTheDocument();
  });

  it('marks the current language as pressed', async () => {
    await i18n.changeLanguage('en');
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'SR' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls changeLanguage when the inactive language is clicked', async () => {
    await i18n.changeLanguage('en');
    const spy = vi.spyOn(i18n, 'changeLanguage');
    renderWithProviders(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button', { name: 'SR' }));
    expect(spy).toHaveBeenCalledWith('sr');
    spy.mockRestore();
  });
});
