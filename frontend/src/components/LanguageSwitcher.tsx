import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  sr: 'SR',
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as SupportedLanguage;

  return (
    <div className="flex items-center gap-0.5 text-sm" role="group" aria-label="Language">
      {SUPPORTED_LANGUAGES.map((lang, index) => (
        <span key={lang} className="flex items-center">
          {index > 0 && <span className="text-muted-foreground/40 mx-0.5 select-none">|</span>}
          <button
            onClick={() => void i18n.changeLanguage(lang)}
            className={cn(
              'px-1.5 py-0.5 rounded transition-colors',
              currentLang === lang
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={currentLang === lang}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        </span>
      ))}
    </div>
  );
}
