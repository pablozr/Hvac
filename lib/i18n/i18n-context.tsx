'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import frTranslations from './translations/fr.json';
import enTranslations from './translations/en.json';

type Locale = 'fr' | 'en';
type Translations = typeof frTranslations;

interface I18nContextType {
  locale: Locale;
  t: (key: string) => string;
  changeLocale: (locale: Locale) => void;
}

const translations = {
  fr: frTranslations,
  en: enTranslations
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    // Check if there's a saved preference in localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'fr' || savedLocale === 'en')) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Return the key if translation is not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
