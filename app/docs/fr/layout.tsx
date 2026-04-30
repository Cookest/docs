import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree('fr')} {...baseOptions('fr')}>
      {children}
    </DocsLayout>
  );
}
