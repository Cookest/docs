import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, groupPageTree } from '@/lib/layout.shared';

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={groupPageTree(source.getPageTree('en'), 'en')} {...baseOptions('en')}>
      {children}
    </DocsLayout>
  );
}
