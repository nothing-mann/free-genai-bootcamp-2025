import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import npTranslation from './locales/np/translation.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en',
    resources: {
      en: {
        translation: enTranslation,
      },
      np: {
        translation: npTranslation,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
