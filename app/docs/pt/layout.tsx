import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, groupPageTree } from '@/lib/layout.shared';

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={groupPageTree(source.getPageTree('pt'), 'pt')} {...baseOptions('pt')}>
      {children}
    </DocsLayout>
  );
}
