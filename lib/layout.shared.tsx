import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, Code2, Smartphone, Repeat2 } from 'lucide-react';

export function baseOptions(): BaseLayoutProps {
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
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
      {
        icon: <Code2 size={16} />,
        text: 'API',
        url: '/docs/backend/endpoints',
        active: 'nested-url',
      },
      {
        icon: <Smartphone size={16} />,
        text: 'Mobile',
        url: '/docs/mobile',
        active: 'nested-url',
      },
      {
        icon: <Repeat2 size={16} />,
        text: 'Português',
        url: '/docs/pt',
        active: 'nested-url',
      },
    ],
  };
}
