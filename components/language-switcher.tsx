'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Language toggle button that lives in the top nav.
 * Shows "PT" when viewing English docs and "EN" when viewing Portuguese.
 * Preserves the equivalent page path when switching.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();

  // Determine current locale and the target URL.
  // PT pages are always under /docs/pt/...
  const isPT = /^\/docs\/pt(\/|$)/.test(pathname);

  const targetHref = isPT
    ? pathname.replace(/^\/docs\/pt/, '/docs')         // PT → EN
    : pathname.replace(/^\/docs/, '/docs/pt');          // EN → PT

  return (
    <Link
      href={targetHref}
      className="flex items-center gap-1.5 rounded-full border border-[#7A9A65] px-3 py-1 text-xs font-semibold text-[#7A9A65] transition-colors hover:bg-[#7A9A65] hover:text-white"
      title={isPT ? 'Switch to English' : 'Ver em Português'}
    >
      {isPT ? '🇬🇧 EN' : '🇵🇹 PT'}
    </Link>
  );
}
