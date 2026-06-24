import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { BookOpen, Cpu, Server, Smartphone, Wrench, RefreshCw, Layers, Library, Bot, HelpCircle } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { type Locale, defaultLocale } from '@/lib/i18n';
import * as PageTree from 'fumadocs-core/page-tree';

function getFolderSegment(node: PageTree.Folder): string {
  let url = node.index?.url;
  if (!url) {
    const findFirstPageUrl = (nodes: PageTree.Node[]): string | undefined => {
      for (const n of nodes) {
        if (n.type === 'page') return n.url;
        if (n.type === 'folder') {
          const childUrl = findFirstPageUrl(n.children);
          if (childUrl) return childUrl;
        }
      }
      return undefined;
    };
    url = findFirstPageUrl(node.children);
  }
  
  if (!url) return '';
  const segments = url.split('/').filter(Boolean);
  const ignored = ['docs', 'pt', 'es', 'fr', 'de'];
  const folderSegments = segments.filter(seg => !ignored.includes(seg));
  return folderSegments[0] || '';
}

function getTabConfig(segment: string, locale: Locale) {
  const configs: Record<string, { icon: React.ReactNode; description: Record<string, string> }> = {
    'intro': {
      icon: <BookOpen size={16} />,
      description: {
        en: 'Learn about Cookest',
        pt: 'Aprenda sobre o Cookest',
        de: 'Erfahren Sie mehr über Cookest',
        es: 'Aprenda sobre Cookest',
        fr: 'En savoir plus sur Cookest',
      }
    },
    'user-guide': {
      icon: <BookOpen size={16} />,
      description: {
        en: 'How to use Cookest as an end-user',
        pt: 'Como usar o Cookest como utilizador final',
        de: 'Wie man Cookest als Endnutzer benutzt',
        es: 'Cómo usar Cookest como usuario final',
        fr: 'Comment utiliser Cookest en tant qu\'utilisateur final',
      }
    },
    'architecture': {
      icon: <Cpu size={16} />,
      description: {
        en: 'Tech stack and system relationships',
        pt: 'Tecnologias e relações entre componentes',
        de: 'Tech-Stack und Systembeziehungen',
        es: 'Pila tecnológica y relaciones del sistema',
        fr: 'Technologies et relations système',
      }
    },
    'backend': {
      icon: <Server size={16} />,
      description: {
        en: 'Rust Actix-Web API & DB schemas',
        pt: 'Endpoints em Rust Actix-Web e BD',
        de: 'Rust Actix-Web API & DB-Schemas',
        es: 'API Rust Actix-Web y esquemas de BD',
        fr: 'API Rust Actix-Web et schémas de BD',
      }
    },
    'mobile': {
      icon: <Smartphone size={16} />,
      description: {
        en: 'Flutter mobile application client',
        pt: 'Cliente móvel em Flutter',
        de: 'Flutter mobile Anwendungs-Client',
        es: 'Cliente de aplicación móvil Flutter',
        fr: 'Client d\'application mobile Flutter',
      }
    },
    'self-hosting': {
      icon: <Wrench size={16} />,
      description: {
        en: 'Deploy Cookest on your own server',
        pt: 'Implemente o Cookest no seu próprio servidor',
        de: 'Implementieren Sie Cookest auf Ihrem Server',
        es: 'Implemente Cookest en su propio servidor',
        fr: 'Déploiement de Cookest sur votre propre serveur',
      }
    },
    'etl': {
      icon: <RefreshCw size={16} />,
      description: {
        en: 'Supermarket promotions scraper',
        pt: 'Scraper de promoções em Python',
        de: 'Supermarkt-Aktionen-Scraper',
        es: 'Scraper de promociones de supermercado',
        fr: 'Scraper de promotions de supermarché',
      }
    },
    'cucl': {
      icon: <Layers size={16} />,
      description: {
        en: 'Shared React + Tailwind 4 components',
        pt: 'Componentes partilhados React + Tailwind 4',
        de: 'Gemeinsame React + Tailwind 4 Komponenten',
        es: 'Componentes compartidos React + Tailwind 4',
        fr: 'Composants partagés React + Tailwind 4',
      }
    },
    'ui-components': {
      icon: <Library size={16} />,
      description: {
        en: 'Shared Flutter & React styles',
        pt: 'Estilos partilhados Flutter e React',
        de: 'Gemeinsame Flutter- und React-Stile',
        es: 'Estilos compartidos de Flutter y React',
        fr: 'Styles Flutter et React partagés',
      }
    },
    'ai': {
      icon: <Bot size={16} />,
      description: {
        en: 'Local LLMs, MCP server, and agents',
        pt: 'LLMs locais, servidor MCP e agentes',
        de: 'Lokale LLMs, MCP-Server und Agenten',
        es: 'LLMs locales, servidor MCP y agentes',
        fr: 'LLMs locaux, serveur MCP et agents',
      }
    },
    'contributing': {
      icon: <HelpCircle size={16} />,
      description: {
        en: 'Documentation guidelines and i18n',
        pt: 'Regras de documentação e tradução',
        de: 'Dokumentationsrichtlinien und i18n',
        es: 'Pautas de documentación e i18n',
        fr: 'Directives de documentation et i18n',
      }
    }
  };
  
  return configs[segment] ? {
    icon: configs[segment].icon,
    description: configs[segment].description[locale] || configs[segment].description['en']
  } : null;
}

export function groupPageTree(tree: PageTree.Root, locale: Locale = defaultLocale): PageTree.Root {
  const children = tree.children;
  
  const finalChildren: PageTree.Node[] = [];
  let introIndexPage: PageTree.Item | undefined;
  
  for (const node of children) {
    if (node.type === 'page') {
      const isRootDocsPage = node.url === `/docs` || node.url === `/docs/pt` || node.url === `/docs/de` || node.url === `/docs/es` || node.url === `/docs/fr`;
      if (isRootDocsPage) {
        introIndexPage = node;
      }
    }
  }
  
  const virtualIntroFolder = {
    type: 'folder',
    name: locale === 'pt' ? 'Introdução' : 
          locale === 'es' ? 'Introducción' : 
          locale === 'fr' ? 'Introduction' : 
          locale === 'de' ? 'Einführung' : 'Introduction',
    root: true,
    index: introIndexPage,
    children: introIndexPage ? [introIndexPage] : [],
    icon: <BookOpen size={16} />,
    description: locale === 'pt' ? 'Aprenda sobre o Cookest' : 'Learn about Cookest',
  } as unknown as PageTree.Folder;
  
  finalChildren.push(virtualIntroFolder);
  
  for (const node of children) {
    if (node.type === 'folder') {
      node.root = true; // Ensure they act as root tabs
      finalChildren.push(node);
    }
  }
  
  return {
    name: tree.name,
    children: finalChildren,
  };
}

export function baseOptions(locale: Locale = defaultLocale): Omit<DocsLayoutProps, 'tree'> {
  return {
    nav: {
      title: (
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1C3A2A', fontSize: '1.1rem' }}>
          Cookest
        </span>
      ),
    },
    tabs: {
      transform(tab, node) {
        const segment = getFolderSegment(node as PageTree.Folder);
        const isIntro = node.name === 'Introduction' || node.name === 'Introdução' || node.name === 'Introducción' || node.name === 'Introduction' || node.name === 'Einführung';
        const key = isIntro ? 'intro' : segment;
        
        const config = getTabConfig(key, locale);
        if (config) {
          tab.icon = config.icon;
          tab.description = config.description;
        }
        return tab;
      }
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
