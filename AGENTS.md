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

