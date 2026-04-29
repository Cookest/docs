# Cookest Docs

Full project documentation for **Cookest** — an AI-assisted meal planning and kitchen management platform. Built with [Fumadocs](https://fumadocs.dev) on Next.js.

Available in **English** and **Portuguese (PT)**. Use the language toggle in the top navigation to switch.

---

## Running locally

```bash
bun run dev
# Open http://localhost:3000/docs
```

> **macOS 26 Tahoe (arm64) note:** `bun i` is configured to skip esbuild's postinstall script (see `bunfig.toml`). If you need to regenerate `.source/` type files after adding MDX content, run `bun run generate` manually.

---

## Documentation structure

| Section | Description |
|---|---|
| **Architecture** | System overview, data flow, tech stack |
| **Backend** | Rust/Actix-Web API — auth, endpoints, data models |
| **Mobile** | Flutter app — theming, screens, navigation |
| **User guide** | How to use Cookest as an end user |
| **ETL pipeline** | PDF scraping pipeline for supermarket promotions |

---

## Content layout

```
content/docs/               — English content
  meta.json                 — sidebar order and titles
  architecture/
  backend/
  mobile/
  user-guide/
  etl-pipeline/

content/docs/pt/            — Portuguese content (mirrors EN structure)
  meta.json
  architecture/
  backend/
  mobile/
  user-guide/
  etl-pipeline/
```

---

## Adding or editing documentation

1. Edit or create `.mdx` files under `content/docs/` (EN) or `content/docs/pt/` (PT).
2. Update the relevant `meta.json` to add the page to the sidebar.
3. If you added new files, run `bun run generate` to update `.source/` types.
4. Run `bun run dev` to preview.

See [`lib/source.ts`](lib/source.ts) for i18n loader configuration and [`lib/layout.shared.tsx`](lib/layout.shared.tsx) for shared nav options.

---

## Related repositories

| Folder | Description |
|---|---|
| `../api/` | Rust + Actix-Web backend API |
| `../UI/` | Flutter mobile app |
| `../etl/` | Python ETL pipeline for price scraping |

