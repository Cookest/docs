import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { BookOpen, Cpu, Wrench } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { type Locale, defaultLocale, localePrefix } from '@/lib/i18n';
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

export function groupPageTree(tree: PageTree.Root, locale: Locale = defaultLocale): PageTree.Root {
  const children = tree.children;
  
  const introNodes: PageTree.Node[] = [];
  const devNodes: PageTree.Node[] = [];
  const hostNodes: PageTree.Node[] = [];
  
  let introIndexPage: PageTree.Item | undefined;
  
  const introFolders = ['user-guide', 'contributing'];
  const devFolders = ['architecture', 'backend', 'mobile', 'ui-components', 'etl', 'cucl', 'ai'];
  const hostFolders = ['self-hosting'];
  
  for (const node of children) {
    if (node.type === 'page') {
      introNodes.push(node);
      const isRootDocsPage = node.url === `/docs` || node.url === `/docs/pt` || node.url === `/docs/de` || node.url === `/docs/es` || node.url === `/docs/fr`;
      if (isRootDocsPage) {
        introIndexPage = node;
      }
    } else if (node.type === 'folder') {
      const segment = getFolderSegment(node);
      node.root = false; // Disable individual folder level root tab
      
      if (introFolders.includes(segment)) {
        introNodes.push(node);
      } else if (devFolders.includes(segment)) {
        devNodes.push(node);
      } else if (hostFolders.includes(segment)) {
        hostNodes.push(node);
      } else {
        introNodes.push(node);
      }
    } else {
      introNodes.push(node);
    }
  }
  
  if (!introIndexPage) {
    introIndexPage = introNodes.find(n => n.type === 'page') as PageTree.Item | undefined;
  }
  
  const virtualIntroFolder = {
    type: 'folder',
    name: locale === 'pt' ? 'Introdução / Quickstart' : 'Introduction & Guides',
    root: true,
    index: introIndexPage,
    children: introNodes.filter(n => n !== introIndexPage),
    icon: <BookOpen size={16} />,
    description: locale === 'pt' ? 'Aprenda sobre o Cookest e como usá-lo' : 'Learn about Cookest and how to use it',
  } as unknown as PageTree.Folder;
  
  const selfHostingFolderNode = hostNodes.find(n => n.type === 'folder') as PageTree.Folder | undefined;
  const virtualHostFolder = {
    type: 'folder',
    name: locale === 'pt' ? 'Auto-Alojamento' : 'Self-Hosting',
    root: true,
    index: selfHostingFolderNode?.index,
    children: selfHostingFolderNode ? selfHostingFolderNode.children : hostNodes,
    icon: <Wrench size={16} />,
    description: locale === 'pt' ? 'Aloje o Cookest no seu próprio servidor' : 'Deploy Cookest on your own server',
  } as unknown as PageTree.Folder;
  
  const devFolderNode = devNodes.find(n => n.type === 'folder') as PageTree.Folder | undefined;
  const virtualDevFolder = {
    type: 'folder',
    name: locale === 'pt' ? 'Arquitetura e Código' : 'Architecture & Code',
    root: true,
    index: devFolderNode?.index,
    children: devNodes,
    icon: <Cpu size={16} />,
    description: locale === 'pt' ? 'Design do sistema e referência do código' : 'System design and codebase reference',
  } as unknown as PageTree.Folder;
  
  // Only include folders that actually have children or index
  const finalChildren: PageTree.Node[] = [];
  
  if (virtualIntroFolder.children.length > 0 || virtualIntroFolder.index) {
    finalChildren.push(virtualIntroFolder);
  }
  if (virtualDevFolder.children.length > 0) {
    finalChildren.push(virtualDevFolder);
  }
  if (virtualHostFolder.children.length > 0) {
    finalChildren.push(virtualHostFolder);
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
    links: [
      {
        type: 'custom',
        secondary: true,
        children: <LanguageSwitcher />,
      },
    ],
  };
}
