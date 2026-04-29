import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  // Last segment is 'content.md'; before it may be a locale prefix.
  const rawSlug = slug?.slice(0, -1);
  const locale = rawSlug?.[0] === 'pt' ? 'pt' : 'en';
  const cleanSlug = locale === 'pt' ? rawSlug?.slice(1) : rawSlug;
  const page = source.getPage(cleanSlug, locale);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageMarkdownUrl(page).segments,
  }));
}
