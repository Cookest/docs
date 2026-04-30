import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defaultLocale, localeList } from './i18n';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  i18n: {
    defaultLanguage: defaultLocale,
    languages: localeList,
    // 'dir' parser: files under content/docs/<locale>/... are assigned that locale,
    // all other files are assigned the default locale.
    parser: 'dir',
    // No silent fallback — if a translated page is missing, show 404 rather than EN.
    fallbackLanguage: null,
  },
  // Keep translated pages at /docs/<locale>/... (not /<locale>/docs/...).
  url(slugs, locale) {
    const base = docsRoute; // '/docs'
    if (locale && locale !== defaultLocale) return `${base}/${locale}/${slugs.join('/')}`;
    return `${base}/${slugs.join('/')}`;
  },
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  // Include locale prefix in the path so EN and PT images have distinct URLs.
  const localePart = page.locale && page.locale !== 'en' ? [page.locale] : [];
  const segments = [...localePart, ...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const localePart = page.locale && page.locale !== 'en' ? [page.locale] : [];
  const segments = [...localePart, ...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
