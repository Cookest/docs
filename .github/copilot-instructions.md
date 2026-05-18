You are working on the **Cookest Documentation Site** (Next.js, Fumadocs, TypeScript, MDX).

## Mandatory Startup — Run Before Anything Else

Call these MCP tools at the start of every session, in order:

1. `vault_read("Agents/context.md")` — live project memory
2. `vault_read("Errors/error-log.md")` — past mistakes to avoid
3. `vault_read("Learnings/learning-log.md")` — past discoveries
4. `get_project_context()` — live system snapshot

Do not skip. These 4 calls take seconds and prevent hours of repeated mistakes.

## Mandatory — Use Context7 Before Writing Library Code

Before writing code that uses any TS/React package, call Context7:

```
query-docs({ libraryId: "/vercel/next.js", query: "your question" })
query-docs({ libraryId: "/fuma-nama/fumadocs", query: "your question" })
query-docs({ libraryId: "/colinhacks/zod", query: "your question" })
query-docs({ libraryId: "/modelcontextprotocol/typescript-sdk", query: "your question" })
```

Pre-resolved IDs for all libraries: `vault/Learnings/library-ids.md`

## Docs / TypeScript Rules (enforced)

1. Every English MDX page needs a Portuguese counterpart in `content/docs/pt/`.
2. Frontmatter: `title` and `description` required on every page.
3. Use Fumadocs components (`<Callout>`, `<Tabs>`, `<Card>`) — no raw HTML tables.
4. MCP tool schemas: always use Zod (`z.string().describe(...)`) — never plain JSON Schema.
5. Server Components by default — only `'use client'` when event handlers or browser APIs required.
6. No `any` in TypeScript — use `unknown` + type guards.
7. `list_endpoints()` to get current API surface — do not hardcode route paths.
8. `get_design_tokens()` to get current token values — do not hardcode colours.
9. Check `vault/Patterns/code-patterns.md` for TS/MDX patterns before inventing new ones.
10. Check `vault/Patterns/coding-guidelines.md` for full TS best practices.
11. Check `vault/Patterns/anti-patterns.md` for things that caused bugs in this codebase.

## Mandatory Shutdown — Run at End of Every Session

1. `vault_append("Changes/changelog.md", "## [YYYY-MM-DD] ...\nWhat was done and why")` — append only
2. `vault_write("Sessions/YYYY-MM-DD-topic.md", fullSessionLog)` — session log
3. If new MCP tools were added: update `agents/docs-agent.md` + `vault/Agents/context.md`
4. If a pattern was discovered or a bug was fixed: `vault_append("Learnings/learning-log.md", ...)` or `vault_append("Errors/error-log.md", ...)`

## Project Context

@AGENTS.md
