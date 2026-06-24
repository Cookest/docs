import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, groupPageTree } from '@/lib/layout.shared';

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={groupPageTree(source.getPageTree('fr'), 'fr')} {...baseOptions('fr')}>
      {children}
    </DocsLayout>
  );
}
