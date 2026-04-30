import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, Code2, Smartphone } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { type Locale, defaultLocale, localePrefix, t } from '@/lib/i18n';

export function baseOptions(locale: Locale = defaultLocale): BaseLayoutProps {
  const prefix = localePrefix(locale);
  return {
    nav: {
      title: (
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1C3A2A', fontSize: '1.1rem' }}>
          Cookest
        </span>
      ),
    },
    links: [
      {
        icon: <BookOpen size={16} />,
        text: t(locale, 'nav.docs'),
        url: `/docs${prefix}`,
        active: 'nested-url',
      },
      {
        icon: <Code2 size={16} />,
        text: t(locale, 'nav.api'),
        url: `/docs${prefix}/backend/endpoints`,
        active: 'nested-url',
      },
      {
        icon: <Smartphone size={16} />,
        text: t(locale, 'nav.mobile'),
        url: `/docs${prefix}/mobile`,
        active: 'nested-url',
      },
      {
        type: 'custom',
        secondary: true,
        children: <LanguageSwitcher />,
      },
    ],
  };
}
