import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { BookOpen, Cpu, Server, Smartphone, Wrench, RefreshCw, Layers, Library, Bot, HelpCircle } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { type Locale, defaultLocale, localePrefix, t } from '@/lib/i18n';
import { SidebarTabsDropdown } from 'fumadocs-ui/components/sidebar/tabs/dropdown';

export function baseOptions(locale: Locale = defaultLocale): Omit<DocsLayoutProps, 'tree'> {
  const prefix = localePrefix(locale);
  
  const toggleOptions = locale === 'pt' ? [
    {
      title: 'Guia do Utilizador',
      description: 'Como usar o Cookest como utilizador final',
      url: `/docs/pt/user-guide/overview`,
      icon: <BookOpen size={16} />,
    },
    {
      title: 'Arquitetura do Sistema',
      description: 'Tecnologias e relações entre componentes',
      url: `/docs/pt/architecture/overview`,
      icon: <Cpu size={16} />,
    },
    {
      title: 'API do Backend',
      description: 'Endpoints em Rust Actix-Web e BD',
      url: `/docs/pt/backend/getting-started`,
      icon: <Server size={16} />,
    },
    {
      title: 'Aplicação Móvel',
      description: 'Cliente móvel em Flutter',
      url: `/docs/pt/mobile/overview`,
      icon: <Smartphone size={16} />,
    },
    {
      title: 'Auto-Alojamento',
      description: 'Implemente o Cookest no seu próprio servidor',
      url: `/docs/pt/self-hosting`,
      icon: <Wrench size={16} />,
    },
    {
      title: 'Pipeline ETL',
      description: 'Scraper de promoções em Python',
      url: `/docs/pt/etl/overview`,
      icon: <RefreshCw size={16} />,
    },
    {
      title: 'Biblioteca CUCL',
      description: 'Componentes partilhados React + Tailwind 4',
      url: `/docs/pt/cucl/overview`,
      icon: <Layers size={16} />,
    },
    {
      title: 'Componentes UI',
      description: 'Estilos partilhados Flutter e React',
      url: `/docs/ui-components/overview`,
      icon: <Library size={16} />,
    },
    {
      title: 'IA e Automação',
      description: 'LLMs locais, servidor MCP e agentes',
      url: `/docs/pt/ai/overview`,
      icon: <Bot size={16} />,
    },
    {
      title: 'Contribuição',
      description: 'Regras de documentação e tradução',
      url: `/docs/pt/contributing/guide`,
      icon: <HelpCircle size={16} />,
    },
  ] : [
    {
      title: 'User Guide',
      description: 'How to use Cookest as an end-user',
      url: `/docs${prefix}/user-guide/overview`,
      icon: <BookOpen size={16} />,
    },
    {
      title: 'System Architecture',
      description: 'Tech stack and system relationships',
      url: `/docs${prefix}/architecture/overview`,
      icon: <Cpu size={16} />,
    },
    {
      title: 'Backend API',
      description: 'Rust Actix-Web API & DB schemas',
      url: `/docs${prefix}/backend/getting-started`,
      icon: <Server size={16} />,
    },
    {
      title: 'Mobile App',
      description: 'Flutter mobile application client',
      url: `/docs${prefix}/mobile/overview`,
      icon: <Smartphone size={16} />,
    },
    {
      title: 'Self-Hosting',
      description: 'Deploy Cookest on your own server',
      url: `/docs${prefix}/self-hosting`,
      icon: <Wrench size={16} />,
    },
    {
      title: 'ETL Pipeline',
      description: 'Supermarket promotions scraper',
      url: `/docs${prefix}/etl/overview`,
      icon: <RefreshCw size={16} />,
    },
    {
      title: 'CUCL Component Library',
      description: 'Shared React + Tailwind 4 components',
      url: `/docs${prefix}/cucl/overview`,
      icon: <Layers size={16} />,
    },
    {
      title: 'UI Components',
      description: 'Shared Flutter & React styles',
      url: `/docs/ui-components/overview`,
      icon: <Library size={16} />,
    },
    {
      title: 'AI & Automation',
      description: 'Local LLMs, MCP server, and agents',
      url: `/docs${prefix}/ai/overview`,
      icon: <Bot size={16} />,
    },
    {
      title: 'Contributing',
      description: 'Documentation guidelines and i18n',
      url: `/docs${prefix}/contributing/guide`,
      icon: <HelpCircle size={16} />,
    },
  ];

  return {
    nav: {
      title: (
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1C3A2A', fontSize: '1.1rem' }}>
          Cookest
        </span>
      ),
    },
    tabs: false,
    sidebar: {
      banner: (
        <SidebarTabsDropdown
          options={toggleOptions}
        />
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
