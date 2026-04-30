import en from '@/messages/en.json';
import pt from '@/messages/pt.json';
import fr from '@/messages/fr.json';
import de from '@/messages/de.json';
import es from '@/messages/es.json';

// ---------------------------------------------------------------------------
// Locale registry — single source of truth for all locale-sensitive code.
// To add a new language: add it here + create messages/<code>.json +
// content/docs/<code>/ folder + route in app/docs/<code>/.
// ---------------------------------------------------------------------------

export type Locale = 'en' | 'pt' | 'fr' | 'de' | 'es';

export interface LocaleConfig {
  code: Locale;
  label: string;
  flag: string;
  /** Orama search language name (https://docs.orama.com/docs/orama-js/supported-languages) */
  searchLanguage: string;
  /** Tier 1 = full parity, Tier 2 = partial / community-translated */
  tier: 1 | 2;
}

export const locales: Record<Locale, LocaleConfig> = {
  en: { code: 'en', label: 'English',    flag: '🇬🇧', searchLanguage: 'english',    tier: 1 },
  pt: { code: 'pt', label: 'Português',  flag: '🇵🇹', searchLanguage: 'portuguese', tier: 1 },
  fr: { code: 'fr', label: 'Français',   flag: '🇫🇷', searchLanguage: 'french',     tier: 2 },
  de: { code: 'de', label: 'Deutsch',    flag: '🇩🇪', searchLanguage: 'german',     tier: 2 },
  es: { code: 'es', label: 'Español',    flag: '🇪🇸', searchLanguage: 'spanish',    tier: 2 },
};

export const defaultLocale: Locale = 'en';
export const localeList = Object.keys(locales) as Locale[];

// ---------------------------------------------------------------------------
// JSON translation messages — keyed by locale.
// ---------------------------------------------------------------------------

type Messages = typeof en;
const messages: Record<Locale, Messages> = { en, pt, fr, de, es };

/**
 * Dot-notation path through the Messages object.
 * e.g. "nav.docs" | "common.editOnGithub" | "sections.backend"
 */
type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? { [K in keyof T]: K extends string ? (T[K] extends object ? Join<K, Paths<T[K]>> : K) : never }[keyof T]
  : never;

type NestedPaths<T> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object
        ? K | Join<K, NestedPaths<T[K]>>
        : K
      : never
    }[keyof T]
  : never;

export type TranslationKey = Paths<Messages>;

/**
 * Get a translated string by dot-notation key.
 *
 * ```ts
 * t('en', 'nav.docs')        // "Docs"
 * t('pt', 'nav.docs')        // "Documentação"
 * t('fr', 'common.nextPage') // "Suivant"
 * ```
 */
export function t(locale: Locale, key: TranslationKey): string {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = messages[locale] ?? messages[defaultLocale];
  for (const part of parts) {
    value = value?.[part];
  }
  if (typeof value === 'string') return value;
  // Fallback to English if key is missing in target locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fallback: any = messages[defaultLocale];
  for (const part of parts) {
    fallback = fallback?.[part];
  }
  return typeof fallback === 'string' ? fallback : key;
}

// ---------------------------------------------------------------------------
// URL helpers — locale-aware path generation.
// ---------------------------------------------------------------------------

/** Returns the URL prefix for a locale within docs routes. */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

/**
 * Detect the current locale from a pathname.
 * e.g. "/docs/pt/backend" → "pt", "/docs/backend" → "en"
 */
export function detectLocaleFromPath(pathname: string): Locale {
  for (const code of localeList) {
    if (code === defaultLocale) continue;
    if (new RegExp(`^/docs/${code}(/|$)`).test(pathname)) return code;
  }
  return defaultLocale;
}

/**
 * Convert a docs pathname from one locale to another.
 * e.g. switchLocalePath("/docs/pt/backend", "fr") → "/docs/fr/backend"
 *      switchLocalePath("/docs/backend", "pt")    → "/docs/pt/backend"
 *      switchLocalePath("/docs/fr/backend", "en") → "/docs/backend"
 */
export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  // Strip any existing locale prefix
  let stripped = pathname;
  for (const code of localeList) {
    if (code === defaultLocale) continue;
    stripped = stripped.replace(new RegExp(`^/docs/${code}(/|$)`), '/docs$1');
  }
  // Add target locale prefix
  if (targetLocale === defaultLocale) return stripped;
  return stripped.replace(/^\/docs(\/|$)/, `/docs/${targetLocale}$1`);
}
