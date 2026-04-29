import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-screen px-6 py-20" style={{ background: '#F8F8F6' }}>
      {/* Hero */}
      <div className="max-w-2xl w-full text-center mb-16">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ background: '#E8F0E4', color: '#7A9A65' }}>
          School Project · PAP
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1C3A2A' }}>
          Cookest<br />Documentation
        </h1>
        <p className="text-lg mb-10" style={{ color: '#6B7280', lineHeight: '1.7' }}>
          AI-assisted meal planning and kitchen management platform.<br />
          Full reference for the backend API, Flutter mobile app, and ETL pipeline.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/docs"
            className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#7A9A65' }}>
            Get Started
          </Link>
          <Link href="/docs/backend/endpoints"
            className="px-6 py-3 rounded-xl text-sm font-medium transition-colors border"
            style={{ color: '#1C3A2A', borderColor: '#D1D5DB', background: '#ffffff' }}>
            API Reference
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {[
          {
            icon: '⚙️',
            title: 'Rust API',
            desc: 'Actix-Web 4, SeaORM, PostgreSQL, JWT auth, Stripe, Ollama AI — full endpoint reference and architecture.',
            href: '/docs/backend',
          },
          {
            icon: '📱',
            title: 'Flutter App',
            desc: 'Mobile UI with Riverpod state management, GoRouter navigation, and the Cookest brand design system.',
            href: '/docs/mobile',
          },
          {
            icon: '🔄',
            title: 'ETL Pipeline',
            desc: 'Python pipeline for scraping and processing food/nutrition data that powers the recipe database.',
            href: '/docs/etl',
          },
        ].map((card) => (
          <Link key={card.title} href={card.href}
            className="rounded-2xl p-6 border transition-shadow hover:shadow-lg"
            style={{ background: '#ffffff', borderColor: '#E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,0.035)' }}>
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="font-semibold mb-2" style={{ color: '#1C3A2A', fontFamily: "'Playfair Display', serif" }}>{card.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Language switcher hint */}
      <div className="mt-16 text-sm" style={{ color: '#9CA3AF' }}>
        Available in{' '}
        <Link href="/docs" className="underline" style={{ color: '#7A9A65' }}>English</Link>
        {' '}and{' '}
        <Link href="/docs/pt" className="underline" style={{ color: '#7A9A65' }}>Português</Link>
      </div>
    </main>
  );
}
