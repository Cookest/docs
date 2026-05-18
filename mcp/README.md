# Cookest Docs MCP Server

MCP (Model Context Protocol) server that gives AI agents programmatic access to Cookest documentation and live project data via VS Code Copilot Chat.

## Tools

### Documentation

| Tool | Params | Description |
|------|--------|-------------|
| `search_docs` | `query`, `locale?`, `limit?` | Full-text search across all MDX documentation pages |
| `get_page` | `path`, `locale?` | Read a specific page (e.g. `"backend/authentication"`) |
| `list_sections` | `locale?` | List all sections and their pages |
| `check_translations` | `locale` | Report translation coverage vs. English source |

### Live Project Data

| Tool | Params | Description |
|------|--------|-------------|
| `list_endpoints` | `filter?`, `tier?`, `method?` | Query the 52-endpoint API manifest (`api/API_ROUTES.json`) |
| `get_design_tokens` | `type?` | Return design tokens — `colors`, `typography`, `spacing`, `effects`, or `all` |
| `get_project_context` | — | Full project snapshot: repos, DB tables, routes summary, env vars |

Supported locales: `en` (default), `pt`, `fr`, `de`, `es`.

## Setup

```bash
bun install
```

The server runs over stdio and is wired into VS Code via `.vscode/settings.json` — no manual startup needed.

## Configuration

All paths default to sensible relative values. Override via environment variables in `.vscode/settings.json`:

| Env var | Default | Points to |
|---------|---------|-----------|
| `DOCS_ROOT` | `docs/content/docs` | MDX documentation pages |
| `MESSAGES_ROOT` | `docs/messages` | i18n message files |
| `TOKENS_DIR` | `cookest-ui-components-library/tokens` | Design token JSON sources |
| `API_ROUTES_FILE` | `api/API_ROUTES.json` | API route manifest |

## Development

```bash
# Run directly (no compile step)
bun dev

# Type-check
bunx tsc --noEmit

# Build to dist/
bun run build
```

## Implementation Notes

- Written in TypeScript (ES modules, `"type": "module"`)
- Uses `@modelcontextprotocol/sdk` v1.x with **Zod schemas** for all tool parameter definitions (breaking change in SDK v1.29.0 — plain JSON Schema objects are no longer accepted)
- `API_ROUTES.json` is the source of truth for `list_endpoints`; keep it in sync when adding routes in `api/src/handlers/`
- Design tokens are read directly from `cookest-ui-components-library/tokens/*.json` at request time — no rebuild needed to pick up token changes
