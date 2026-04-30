'use client';

import Link from 'next/link';
import { useState } from 'react';

const sections = [
  {
    id: 'backend',
    label: 'Backend',
    tech: 'Rust · Actix-Web 4 · SeaORM · PostgreSQL',
    href: '/docs/backend',
    pages: [
      { label: 'Getting started',  href: '/docs/backend/getting-started' },
      { label: 'Authentication',   href: '/docs/backend/authentication' },
      { label: 'Endpoints',        href: '/docs/backend/endpoints' },
      { label: 'Database schema',  href: '/docs/backend/database' },
      { label: 'Environment',      href: '/docs/backend/environment' },
      { label: 'PDF pipeline',     href: '/docs/backend/pdf-pipeline' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    tech: 'Flutter · Dart · Riverpod · GoRouter',
    href: '/docs/mobile',
    pages: [
      { label: 'Overview',         href: '/docs/mobile/overview' },
      { label: 'Architecture',     href: '/docs/mobile/architecture' },
      { label: 'Screens',          href: '/docs/mobile/screens' },
      { label: 'State management', href: '/docs/mobile/state-management' },
      { label: 'Design system',    href: '/docs/mobile/theme' },
      { label: 'API integration',  href: '/docs/mobile/api-integration' },
    ],
  },
  {
    id: 'etl',
    label: 'ETL',
    tech: 'Python · psycopg2 · USDA FoodData Central',
    href: '/docs/etl',
    pages: [
      { label: 'Pipeline overview', href: '/docs/etl/overview' },
    ],
  },
];

export default function HomePage() {
  const [active, setActive] = useState('backend');
  const section = sections.find(s => s.id === active)!;

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      {/* ── Left panel ── */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col justify-between p-8 border-r"
        style={{ background: 'var(--color-fd-background)', borderColor: 'var(--color-fd-border)' }}
      >
        <div>
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: 'var(--color-fd-primary)' }}
          >
            PAP · 2025
          </span>

          <h1
            className="mt-3 leading-snug"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.85rem',
              fontWeight: 700,
              color: 'var(--color-fd-foreground)',
            }}
          >
            Cookest<br />Docs
          </h1>

          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--color-fd-muted-foreground)' }}>
            Backend API, Flutter app, and data pipeline.
          </p>

          <div className="mt-8">
            <p
              className="text-[10px] font-semibold tracking-[0.15em] uppercase mb-2"
              style={{ color: 'var(--color-fd-muted-foreground)' }}
            >
              Also here
            </p>
            {[
              { label: 'Architecture', href: '/docs/architecture/overview' },
              { label: 'User guide',   href: '/docs/user-guide/overview' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between py-2.5 text-sm border-b"
                style={{ borderColor: 'var(--color-fd-muted)', color: 'var(--color-fd-foreground)' }}
              >
                <span className="group-hover:underline underline-offset-2">{link.label}</span>
                <span
                  className="text-xs opacity-30 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-fd-primary)' }}
                >
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="h-px mb-4" style={{ background: 'var(--color-fd-border)' }} />
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/docs"
              className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-fd-primary)' }}
            >
              EN
            </Link>
            <span style={{ color: 'var(--color-fd-muted-foreground)', opacity: 0.35 }}>·</span>
            <Link
              href="/docs/pt"
              className="transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-fd-primary)' }}
            >
              PT
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Right panel ── */}
      <div
        className="flex-1 flex flex-col p-8"
        style={{ background: 'var(--color-fd-card)' }}
      >
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-7">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              style={{
                background: active === s.id ? 'var(--color-fd-foreground)' : 'transparent',
                color: active === s.id ? '#ffffff' : 'var(--color-fd-muted-foreground)',
              }}
            >
              {s.label}
              <span
                className="text-xs rounded px-1.5 py-0.5 font-normal tabular-nums"
                style={{
                  background: active === s.id ? 'rgba(255,255,255,0.15)' : 'var(--color-fd-muted)',
                  color:      active === s.id ? 'rgba(255,255,255,0.75)' : 'var(--color-fd-muted-foreground)',
                }}
              >
                {s.pages.length}
              </span>
            </button>
          ))}
        </div>

        {/* Tech label */}
        <div className="mb-4">
          <p className="text-xs font-mono mb-2" style={{ color: 'var(--color-fd-primary)' }}>
            {section.tech}
          </p>
          <div className="h-px" style={{ background: 'var(--color-fd-border)' }} />
        </div>

        {/* Page list */}
        <div className="flex-1 min-h-0" key={active}>
          {section.pages.map((page, i) => (
            <Link
              key={page.href}
              href={page.href}
              className="group flex items-center justify-between py-3.5 border-b"
              style={{ borderColor: 'var(--color-fd-muted)' }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="text-xs font-mono w-5 text-right flex-shrink-0"
                  style={{ color: 'var(--color-fd-muted-foreground)', opacity: 0.4 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-sm group-hover:underline underline-offset-2"
                  style={{ color: 'var(--color-fd-foreground)' }}
                >
                  {page.label}
                </span>
              </div>
              <span
                className="text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                style={{ color: 'var(--color-fd-primary)' }}
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Footer row */}
        <div className="pt-6 flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--color-fd-muted-foreground)' }}>
            {section.pages.length} {section.pages.length === 1 ? 'page' : 'pages'} in this section
          </span>
          <Link
            href={section.href}
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-fd-primary)', color: 'var(--color-fd-primary-foreground)' }}
          >
            Browse {section.label} <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
