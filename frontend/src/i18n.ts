import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enLayout from './locales/en/layout.json';
import enLogin from './locales/en/login.json';
import enMembers from './locales/en/members.json';
import enUsers from './locales/en/users.json';
import srCommon from './locales/sr/common.json';
import srDashboard from './locales/sr/dashboard.json';
import srLayout from './locales/sr/layout.json';
import srLogin from './locales/sr/login.json';
import srMembers from './locales/sr/members.json';
import srUsers from './locales/sr/users.json';

export const SUPPORTED_LANGUAGES = ['en', 'sr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const INTL_LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-US',
  sr: 'sr-Latn-RS',
};

export function getIntlLocale(language: string): string {
  return INTL_LOCALE_MAP[language as SupportedLanguage] ?? 'en-US';
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        layout: enLayout,
        dashboard: enDashboard,
        members: enMembers,
        users: enUsers,
        login: enLogin,
      },
      sr: {
        common: srCommon,
        layout: srLayout,
        dashboard: srDashboard,
        members: srMembers,
        users: srUsers,
        login: srLogin,
      },
    },
    defaultNS: 'common',
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'sr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18n-language',
    },
  });

export default i18n;
