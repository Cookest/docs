import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, groupPageTree } from '@/lib/layout.shared';

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={groupPageTree(source.getPageTree('de'), 'de')} {...baseOptions('de')}>
      {children}
    </DocsLayout>
  );
}
