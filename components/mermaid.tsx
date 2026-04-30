'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '_');
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const { default: mermaid } = await import('mermaid');

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
      });

      try {
        const { svg } = await mermaid.render(`mermaid${id}`, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, id, resolvedTheme]);

  if (error) {
    return (
      <pre className="p-4 rounded-lg border border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300 overflow-x-auto text-sm">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center [&>svg]:max-w-full"
    />
  );
}
