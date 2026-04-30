import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree('de')} {...baseOptions('de')}>
      {children}
    </DocsLayout>
  );
}
