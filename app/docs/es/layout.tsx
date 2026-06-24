import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, groupPageTree } from '@/lib/layout.shared';

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={groupPageTree(source.getPageTree('es'), 'es')} {...baseOptions('es')}>
      {children}
    </DocsLayout>
  );
}
