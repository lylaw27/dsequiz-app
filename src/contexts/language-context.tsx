import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import zh from '../locales/zh.json';
import en from '../locales/en.json';

type Language = 'zh' | 'en';

type TranslationValue = string | Record<string, any>;
type Translations = Record<string, TranslationValue>;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = '@app_language';

// Translation dictionary
const translations: Record<Language, Translations> = {
  zh: zh as Translations,
  en: en as Translations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage === 'zh' || savedLanguage === 'en') {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
      // Fallback to default language
      setLanguage('zh');
    }
  };

  const toggleLanguage = async () => {
    const newLanguage: Language = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage); // Update immediately for better UX
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
      // Revert on error
      setLanguage(language);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    // Navigate through nested keys
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // If translation not found, return the key
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(`{${paramKey}}`, String(paramValue));
      }, value);
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
