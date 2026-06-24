import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { LanguageSwitcher } from '@/components/language-switcher';
import { type Locale, defaultLocale } from '@/lib/i18n';

export function baseOptions(locale: Locale = defaultLocale): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#FFFFFF', fontSize: '1.4rem' }}>
          Cookest
        </span>
      ),
    },
    links: [
      {
        type: 'custom',
        secondary: true,
        children: <LanguageSwitcher />,
      },
    ],
  };
}
