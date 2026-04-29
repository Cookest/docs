import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  i18n: {
    defaultLanguage: 'en',
    languages: ['en', 'pt'],
    // 'dir' parser: files under content/docs/pt/... are assigned locale='pt',
    // all other files are assigned the default locale 'en'.
    parser: 'dir',
    // No silent fallback — if a PT page is missing, show 404 rather than EN.
    fallbackLanguage: null,
  },
  // Keep PT pages at /docs/pt/... (not /pt/docs/...) to preserve existing URLs.
  url(slugs, locale) {
    const base = docsRoute; // '/docs'
    if (locale === 'pt') return `${base}/pt/${slugs.join('/')}`;
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
