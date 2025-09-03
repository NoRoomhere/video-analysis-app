import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ru');

  const availableLanguages = [
    { code: 'uk' as Language, name: 'Українська', flag: '🇺🇦' },
    { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' }
  ];

  // Загрузка языка из localStorage при инициализации
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['uk', 'ru', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Определение языка браузера
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ru') {
        setLanguageState('ru');
      } else if (browserLang === 'en') {
        setLanguageState('en');
      } else {
        setLanguageState('ru');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Функция для получения перевода с поддержкой параметров
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback к русскому языку
        value = keys.reduce((obj: any, key) => obj?.[key], translations.ru);
        break;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Замена параметров в строке
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param]?.toString() || match;
      });
    }

    return value;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 