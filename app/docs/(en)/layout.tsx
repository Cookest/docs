import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree('en')} {...baseOptions('en')}>
      {children}
    </DocsLayout>
  );
}
