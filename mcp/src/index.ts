import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readdir, readFile } from "fs/promises";
import { join, relative, extname } from "path";
import { existsSync } from "fs";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DOCS_ROOT = process.env.DOCS_ROOT || join(import.meta.dirname, "..", "..", "content", "docs");
const MESSAGES_ROOT = process.env.MESSAGES_ROOT || join(import.meta.dirname, "..", "..", "messages");
const TOKENS_DIR = process.env.TOKENS_DIR || join(import.meta.dirname, "..", "..", "..", "cookest-ui-components-library", "tokens");
const API_ROUTES_FILE = process.env.API_ROUTES_FILE || join(import.meta.dirname, "..", "..", "..", "api", "API_ROUTES.json");

const LOCALES = ["en", "pt", "fr", "de", "es"] as const;
type Locale = (typeof LOCALES)[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function walkMdx(dir: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await walkMdx(fullPath)));
      } else if (extname(entry.name) === ".mdx") {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist — fine for optional locale dirs
  }
  return results;
}

function extractFrontmatter(content: string): { title?: string; description?: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { body: content };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) meta[key.trim()] = rest.join(":").trim();
  }
  return { title: meta.title, description: meta.description, body: match[2] };
}

function simpleSearch(content: string, query: string): number {
  const lower = content.toLowerCase();
  const terms = query.toLowerCase().split(/\s+/);
  return terms.reduce((score, term) => {
    const idx = lower.indexOf(term);
    return idx >= 0 ? score + 1 : score;
  }, 0);
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "cookest-docs",
  version: "0.1.0",
});

// --- Resources ---

server.resource("pages", "docs://pages", async (uri) => {
  const pages: Array<{ locale: string; path: string; title?: string; description?: string }> = [];

  for (const locale of LOCALES) {
    const dir = locale === "en" ? DOCS_ROOT : join(DOCS_ROOT, locale);
    const files = await walkMdx(dir);
    for (const file of files) {
      const rel = relative(locale === "en" ? DOCS_ROOT : dir, file).replace(/\.mdx$/, "");
      // Skip locale subdirectories when scanning English root
      if (locale === "en" && LOCALES.some((l) => l !== "en" && rel.startsWith(l + "/"))) continue;
      const content = await readFile(file, "utf-8");
      const { title, description } = extractFrontmatter(content);
      pages.push({ locale, path: rel, title, description });
    }
  }

  return { contents: [{ uri: uri.href, text: JSON.stringify(pages, null, 2), mimeType: "application/json" }] };
});

server.resource("structure", "docs://structure", async (uri) => {
  const structure = {
    repositories: [
      { name: "api", language: "Rust", framework: "Actix-Web 4", purpose: "Backend REST API" },
      { name: "UI", language: "Dart", framework: "Flutter 3", purpose: "Mobile app (iOS/Android)" },
      { name: "web", language: "TypeScript", framework: "Next.js 16", purpose: "Landing page" },
      { name: "docs", language: "TypeScript", framework: "Next.js + Fumadocs", purpose: "Documentation site" },
      { name: "etl", language: "Python", framework: "psycopg2", purpose: "Data pipeline" },
      { name: "dataset", language: "CSV", framework: "N/A", purpose: "Recipe dataset (MM-Food-100K)" },
    ],
    locales: LOCALES,
    localeTiers: { tier1: ["en", "pt"], tier2: ["fr", "de", "es"] },
  };
  return { contents: [{ uri: uri.href, text: JSON.stringify(structure, null, 2), mimeType: "application/json" }] };
});

server.resource(
  "translations",
  new ResourceTemplate("docs://translations/{locale}", { list: undefined }),
  async (uri, { locale }) => {
    const filePath = join(MESSAGES_ROOT, `${locale}.json`);
    if (!existsSync(filePath)) {
      return { contents: [{ uri: uri.href, text: `{"error": "Locale '${locale}' not found"}`, mimeType: "application/json" }] };
    }
    const content = await readFile(filePath, "utf-8");
    return { contents: [{ uri: uri.href, text: content, mimeType: "application/json" }] };
  }
);

server.resource(
  "page",
  new ResourceTemplate("docs://page/{locale}/{+path}", { list: undefined }),
  async (uri, { locale, path }) => {
    const dir = locale === "en" ? DOCS_ROOT : join(DOCS_ROOT, locale as string);
    const filePath = join(dir, `${path}.mdx`);
    if (!existsSync(filePath)) {
      return { contents: [{ uri: uri.href, text: `Page not found: ${locale}/${path}`, mimeType: "text/plain" }] };
    }
    const content = await readFile(filePath, "utf-8");
    return { contents: [{ uri: uri.href, text: content, mimeType: "text/markdown" }] };
  }
);

// --- Tools ---

server.tool(
  "search_docs",
  "Full-text search across all documentation pages",
  {
    query: z.string().describe("Search query"),
    locale: z.string().optional().describe("Filter by locale (optional)"),
    limit: z.number().optional().describe("Max results (default: 10)"),
  },
  async ({ query, locale, limit }) => {
    const maxResults = limit ?? 10;
    const targetLocales = locale ? [locale as Locale] : [...LOCALES];
    const results: Array<{ locale: string; path: string; title?: string; score: number; excerpt: string }> = [];

    for (const loc of targetLocales) {
      const dir = loc === "en" ? DOCS_ROOT : join(DOCS_ROOT, loc);
      const files = await walkMdx(dir);
      for (const file of files) {
        const rel = relative(loc === "en" ? DOCS_ROOT : dir, file).replace(/\.mdx$/, "");
        if (loc === "en" && LOCALES.some((l) => l !== "en" && rel.startsWith(l + "/"))) continue;
        const content = await readFile(file, "utf-8");
        const score = simpleSearch(content, query);
        if (score > 0) {
          const { title } = extractFrontmatter(content);
          const lowerContent = content.toLowerCase();
          const firstTerm = query.toLowerCase().split(/\s+/)[0];
          const idx = lowerContent.indexOf(firstTerm);
          const start = Math.max(0, idx - 50);
          const excerpt = content.substring(start, start + 200).replace(/\n/g, " ");
          results.push({ locale: loc, path: rel, title, score, excerpt });
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, maxResults);

    return { content: [{ type: "text", text: JSON.stringify(topResults, null, 2) }] };
  }
);

server.tool(
  "get_page",
  "Retrieve a specific documentation page by path",
  {
    path: z.string().describe("Page path (e.g., 'backend/authentication')"),
    locale: z.string().optional().describe("Locale (default: 'en')"),
  },
  async ({ path, locale }) => {
    const loc = (locale as Locale | undefined) ?? "en";
    const dir = loc === "en" ? DOCS_ROOT : join(DOCS_ROOT, loc);
    const filePath = join(dir, `${path}.mdx`);
    if (!existsSync(filePath)) {
      return { content: [{ type: "text", text: `Page not found: ${loc}/${path}` }], isError: true };
    }
    const content = await readFile(filePath, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }
);

server.tool(
  "list_sections",
  "List all documentation sections and their pages",
  {
    locale: z.string().optional().describe("Locale (default: 'en')"),
  },
  async ({ locale }) => {
    const loc = (locale as Locale | undefined) ?? "en";
    const dir = loc === "en" ? DOCS_ROOT : join(DOCS_ROOT, loc);
    const sections: Record<string, string[]> = {};

    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !LOCALES.includes(entry.name as Locale)) {
          const sectionFiles = await walkMdx(join(dir, entry.name));
          sections[entry.name] = sectionFiles.map((f) => relative(join(dir, entry.name), f).replace(/\.mdx$/, ""));
        }
      }
    } catch {
      return { content: [{ type: "text", text: `Locale directory not found: ${loc}` }], isError: true };
    }

    return { content: [{ type: "text", text: JSON.stringify(sections, null, 2) }] };
  }
);

server.tool(
  "check_translations",
  "Check translation coverage for a locale",
  {
    locale: z.string().describe("Target locale to check"),
  },
  async ({ locale }) => {
    const loc = locale as Locale;
    if (loc === "en") {
      return { content: [{ type: "text", text: "English is the source locale — nothing to check." }] };
    }

    // Get all English pages
    const enFiles = await walkMdx(DOCS_ROOT);
    const enPages = enFiles
      .map((f) => relative(DOCS_ROOT, f).replace(/\.mdx$/, ""))
      .filter((p) => !LOCALES.some((l) => l !== "en" && p.startsWith(l + "/")));

    // Get translated pages
    const locDir = join(DOCS_ROOT, loc);
    const locFiles = await walkMdx(locDir);
    const locPages = locFiles.map((f) => relative(locDir, f).replace(/\.mdx$/, ""));

    // Check UI strings
    const enMessages = JSON.parse(await readFile(join(MESSAGES_ROOT, "en.json"), "utf-8"));
    const locMessagesPath = join(MESSAGES_ROOT, `${loc}.json`);
    let uiStringsCoverage = { total: 0, translated: 0 };

    if (existsSync(locMessagesPath)) {
      const locMessages = JSON.parse(await readFile(locMessagesPath, "utf-8"));
      const countKeys = (obj: Record<string, unknown>): number => {
        let count = 0;
        for (const val of Object.values(obj)) {
          if (typeof val === "object" && val) count += countKeys(val as Record<string, unknown>);
          else count++;
        }
        return count;
      };
      uiStringsCoverage = { total: countKeys(enMessages), translated: countKeys(locMessages) };
    }

    const missingPages = enPages.filter((p) => !locPages.includes(p));
    const tier = ["en", "pt"].includes(loc) ? 1 : 2;

    const report = {
      locale: loc,
      tier,
      coverage: {
        pages: {
          total: enPages.length,
          translated: locPages.length,
          percentage: Math.round((locPages.length / enPages.length) * 1000) / 10,
        },
        uiStrings: {
          ...uiStringsCoverage,
          percentage: uiStringsCoverage.total > 0
            ? Math.round((uiStringsCoverage.translated / uiStringsCoverage.total) * 1000) / 10
            : 0,
        },
      },
      missingPages,
    };

    return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
  }
);

// ---------------------------------------------------------------------------
// New tools: list_endpoints, get_design_tokens, get_project_context
// ---------------------------------------------------------------------------

server.tool(
  "list_endpoints",
  "List all Cookest API endpoints. Filter by method, auth tier (free/pro/admin), or path substring.",
  {
    filter: z.string().optional().describe("Optional substring to filter by path or description"),
    tier: z.string().optional().describe("Filter by auth tier: 'public', 'free', 'pro', 'admin'"),
    method: z.string().optional().describe("Filter by HTTP method: GET, POST, PUT, PATCH, DELETE"),
  },
  async ({ filter, tier, method }) => {
    if (!existsSync(API_ROUTES_FILE)) {
      return { content: [{ type: "text", text: "API_ROUTES.json not found. Expected at: " + API_ROUTES_FILE }], isError: true };
    }
    const raw = await readFile(API_ROUTES_FILE, "utf-8");
    const routes = JSON.parse(raw) as {
      version: string;
      public: Array<{ method: string; path: string; description: string; auth?: boolean; tier?: string; note?: string }>;
      protected: Array<{ method: string; path: string; description: string; tier: string }>;
      admin: Array<{ method: string; path: string; description: string; auth: string }>;
    };

    type RouteEntry = { method: string; path: string; description: string; scope: string; tier: string };
    let all: RouteEntry[] = [
      ...routes.public.map((r) => ({ ...r, scope: "public", tier: "public" })),
      ...routes.protected.map((r) => ({ ...r, scope: "protected" })),
      ...routes.admin.map((r) => ({ ...r, scope: "admin", tier: "admin" })),
    ];

    if (tier) {
      const t = (tier as string).toLowerCase();
      all = all.filter((r) => r.tier?.toLowerCase() === t || r.scope.toLowerCase() === t);
    }
    if (method) {
      all = all.filter((r) => r.method.toUpperCase() === (method as string).toUpperCase());
    }
    if (filter) {
      const q = (filter as string).toLowerCase();
      all = all.filter((r) => r.path.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }

    const formatted = all.map((r) =>
      `${r.method.padEnd(7)} ${r.path.padEnd(55)} [${r.tier ?? r.scope}] ${r.description}`
    ).join("\n");

    return { content: [{ type: "text", text: `${all.length} endpoints found:\n\n${formatted}` }] };
  }
);

server.tool(
  "get_design_tokens",
  "Return Cookest design tokens (colors, typography, spacing, effects) from the component library source.",
  {
    type: z.string().optional().describe("Token type: 'colors', 'typography', 'spacing', 'effects', or 'all'"),
  },
  async ({ type }) => {
    const tokenFiles: Record<string, string> = {
      colors: join(TOKENS_DIR, "colors.json"),
      typography: join(TOKENS_DIR, "typography.json"),
      spacing: join(TOKENS_DIR, "spacing.json"),
      effects: join(TOKENS_DIR, "effects.json"),
    };

    const target = (type as string | undefined)?.toLowerCase() ?? "all";

    if (target === "all") {
      const result: Record<string, unknown> = {};
      for (const [name, filePath] of Object.entries(tokenFiles)) {
        if (existsSync(filePath)) {
          result[name] = JSON.parse(await readFile(filePath, "utf-8"));
        }
      }
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }

    const filePath = tokenFiles[target];
    if (!filePath) {
      return { content: [{ type: "text", text: `Unknown token type: ${target}. Use: colors, typography, spacing, effects, all` }], isError: true };
    }
    if (!existsSync(filePath)) {
      return { content: [{ type: "text", text: `Token file not found: ${filePath}` }], isError: true };
    }

    const content = await readFile(filePath, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }
);

server.tool(
  "get_project_context",
  "Return a complete structured summary of the Cookest project: repositories, API surface, design tokens snapshot, and database tables.",
  {},
  async () => {
    const context: Record<string, unknown> = {
      project: "Cookest",
      repositories: [
        { name: "UI", language: "Dart", framework: "Flutter 3 + Riverpod", purpose: "Mobile app (iOS/Android)" },
        { name: "api", language: "Rust 1.78+", framework: "Actix-Web 4 + SeaORM", purpose: "REST API + PostgreSQL" },
        { name: "web", language: "TypeScript", framework: "Next.js 16 + TailwindCSS 4", purpose: "Landing page (5 languages)" },
        { name: "docs", language: "TypeScript", framework: "Next.js + Fumadocs", purpose: "Developer documentation" },
        { name: "etl", language: "Python 3.12+", framework: "asyncio + psycopg2", purpose: "Recipe data pipeline" },
        { name: "cookest-ui-components-library", language: "TypeScript", framework: "React + Storybook", purpose: "Design system + tokens" },
        { name: "cookest-ui-showcase", language: "TypeScript", framework: "Next.js", purpose: "Component showcase" },
        { name: "cookest-ad", language: "TypeScript", framework: "Remotion", purpose: "Video ad rendering" },
      ],
      docsUrl: "https://cookest-docs.vercel.app/docs",
      database: {
        tables: [
          "users", "ingredients", "ingredient_nutrients", "portion_sizes",
          "recipes", "recipe_ingredients", "recipe_steps", "recipe_images", "recipe_nutrition", "recipe_ratings",
          "inventory_items", "meal_plans", "meal_plan_slots",
          "shopping_list_items", "chat_sessions", "chat_messages",
          "user_favorites", "user_preferences", "user_push_tokens", "cooking_history",
          "stores", "store_promotions", "store_promotion_candidates", "pdf_processing_jobs",
          "stripe_processed_events"
        ],
      },
      subscriptionTiers: ["free", "pro", "family"],
      locales: { tier1: ["en", "pt"], tier2: ["fr", "de", "es"] },
      designTokensSummary: {
        brandColor: "#7A9A65",
        headingFont: "Playfair Display",
        bodyFont: "Inter",
        theme: "Material 3 light + dark",
      },
    };

    // Inject live API route counts if available
    if (existsSync(API_ROUTES_FILE)) {
      const routes = JSON.parse(await readFile(API_ROUTES_FILE, "utf-8"));
      context.apiEndpoints = {
        public: routes.public?.length ?? 0,
        protected: routes.protected?.length ?? 0,
        admin: routes.admin?.length ?? 0,
        total: (routes.public?.length ?? 0) + (routes.protected?.length ?? 0) + (routes.admin?.length ?? 0),
      };
    }

    return { content: [{ type: "text", text: JSON.stringify(context, null, 2) }] };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cookest Docs MCP server running on stdio");
}

main().catch(console.error);
