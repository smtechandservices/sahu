'use client';

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from 'react';
import { setCookie, getCookie } from '../lib/cookies';
import { VALUE_HI } from '../lib/valueLabels';

const LANGS = ['en', 'hi'];
const DEFAULT_LANG = 'en';

// The chosen language lives in the `lang` cookie; this tiny store lets React re-render when it changes.
const listeners = new Set();

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  const saved = getCookie('lang');
  return LANGS.includes(saved) ? saved : DEFAULT_LANG;
};

// Server render always uses the default; the client switches after hydration
const getServerSnapshot = () => DEFAULT_LANG;

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (en) => en,
  tv: (value) => value,
  locale: 'en-IN',
});

export function LanguageProvider({ children }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setCookie('lang', next, 365);
    listeners.forEach((listener) => listener());
  }, []);

  // t('English text', 'हिन्दी पाठ') — falls back to English when no Hindi is given.
  const t = useCallback((en, hi) => (lang === 'hi' && hi != null ? hi : en), [lang]);

  // tv('Pending') — display label for a fixed backend value (see lib/valueLabels.js).
  const tv = useCallback((value) => t(value, VALUE_HI[value]), [t]);

  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tv, locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

// For server components, which can't call hooks: <T en="Home" hi="होम" />
export function T({ en, hi }) {
  const { t } = useLanguage();
  return t(en, hi);
}

export function LanguageToggle({ className = '' }) {
  const { lang, setLang, t } = useLanguage();
  const option = (value, label) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      aria-pressed={lang === value}
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
        lang === value ? 'bg-[#5C3D2E] text-white shadow' : 'text-[#5C3D2E] hover:bg-[#e8d9ce]'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label={t('Language', 'भाषा')} className={`inline-flex items-center bg-[#F5EDE4] rounded-full p-1 gap-1 shrink-0 ${className}`}>
      {option('hi', 'हिन्दी')}
      {option('en', 'English')}
    </div>
  );
}
