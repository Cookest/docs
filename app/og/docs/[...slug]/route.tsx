import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';
import { type Locale, defaultLocale, localeList } from '@/lib/i18n';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  // Last segment is always 'image.png'; before it may be a locale prefix.
  const rawSlug = slug.slice(0, -1);
  const locale: Locale = (localeList.includes(rawSlug[0] as Locale) && rawSlug[0] !== defaultLocale)
    ? rawSlug[0] as Locale
    : defaultLocale;
  const cleanSlug = locale !== defaultLocale ? rawSlug.slice(1) : rawSlug;
  const page = source.getPage(cleanSlug, locale);
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
