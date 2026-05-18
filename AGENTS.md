# Cookest Documentation Site — Agent Instructions

You are working on the **Cookest documentation site**, a Fumadocs Next.js project.

## Quick Reference

| Attribute | Value |
|-----------|-------|
| Framework | Next.js 16 + Fumadocs |
| Content | MDX pages in `content/docs/` |
| i18n | `en`, `pt`, `fr`, `de`, `es` |

## Core Rules

1. Read the relevant docs pages before writing.
2. Keep documentation in sync with code and repo changes.
3. Use Conventional Commits: `<type>(<scope>): <description>`.
4. Keep each commit to one logical change.
5. Never add AI co-author trailers.
6. Update translations when English docs change.

## Docs Standards

- Use the docs site as the source of truth for repository behavior.
- If backend behavior changes, update the backend docs in the same change.
- If endpoint paths or env vars change, update the corresponding pages immediately.
- Keep `meta.json` and locale pages aligned.

## Key Files

- `content/docs/contributing/best-practices.mdx`
- `content/docs/contributing/translations.mdx`
- `content/docs/ai/instructions.mdx`
- `content/docs/ai/quick-setup.mdx`
- `content/docs/ai/mcp-server.mdx`


---

## Session Protocols

### Startup (every session — non-negotiable)

1. `vault_read("Agents/context.md")` — live project memory
2. `vault_read("Errors/error-log.md")` — past mistakes to avoid repeating
3. `vault_read("Learnings/learning-log.md")` — past discoveries to reuse
4. `get_project_context()` — live system snapshot
5. If working with TS packages: `query-docs` via Context7 (IDs in `vault/Learnings/library-ids.md`)

### Context7 — Use Before Any Library Code

```
query-docs({ libraryId: "/vercel/next.js", query: "your question" })
query-docs({ libraryId: "/fuma-nama/fumadocs", query: "your question" })
query-docs({ libraryId: "/modelcontextprotocol/typescript-sdk", query: "your question" })
```

### Shutdown (every session — non-negotiable)

1. `vault_append("Changes/changelog.md", entry)` — **append**, never overwrite
2. `vault_write("Sessions/YYYY-MM-DD-topic.md", content)` — session log
3. New MCP tools? Update `agents/docs-agent.md` + `vault/Agents/context.md`
4. New pattern or bug fix? `vault_append("Learnings/learning-log.md", ...)` or `vault_append("Errors/error-log.md", ...)`

### Coding Reference

- Patterns to follow: `vault/Patterns/code-patterns.md`
- Best practices: `vault/Patterns/coding-guidelines.md`
- What NOT to do: `vault/Patterns/anti-patterns.md`
