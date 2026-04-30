'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  type Locale,
  locales,
  localeList,
  detectLocaleFromPath,
  switchLocalePath,
} from '@/lib/i18n';

/**
 * Language selector dropdown that lives in the top nav.
 * Shows the current locale flag + code and allows switching between all supported languages.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = detectLocaleFromPath(pathname);
  const current = locales[currentLocale];

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-[#7A9A65] px-3 py-1 text-xs font-semibold text-[#7A9A65] transition-colors hover:bg-[#7A9A65] hover:text-white"
        aria-label={current.label}
      >
        {current.flag} {current.code.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-[#7A9A65]/20 bg-white shadow-lg dark:bg-zinc-900">
          {localeList.map((code) => {
            const loc = locales[code];
            const isActive = code === currentLocale;
            return (
              <Link
                key={code}
                href={switchLocalePath(pathname, code)}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  isActive
                    ? 'bg-[#7A9A65]/10 font-semibold text-[#7A9A65]'
                    : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.label}</span>
                {loc.tier === 2 && (
                  <span className="ml-auto rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    β
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
