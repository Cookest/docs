import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  const { tabs, ...homeOptions } = baseOptions() as any;
  return <HomeLayout {...homeOptions}>{children}</HomeLayout>;
}
