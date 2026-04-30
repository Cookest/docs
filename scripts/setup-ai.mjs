#!/usr/bin/env node

/**
 * Cookest AI Setup — One-click configuration for MCP server and AI agent tools.
 *
 * Usage:
 *   bun scripts/setup-ai.mjs            # Interactive setup
 *   bun scripts/setup-ai.mjs --vscode   # Configure VS Code only
 *   bun scripts/setup-ai.mjs --claude   # Configure Claude Desktop only
 *   bun scripts/setup-ai.mjs --agents   # Install AGENTS.md in all repos only
 *   bun scripts/setup-ai.mjs --all      # Configure everything non-interactively
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = resolve(__dirname, "..");
const PROJECT_ROOT = resolve(DOCS_ROOT, "..");
const MCP_DIR = join(DOCS_ROOT, "mcp");
const MCP_ENTRY = join(MCP_DIR, "src", "index.ts");

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const args = process.argv.slice(2);
const flags = {
  vscode: args.includes("--vscode"),
  claude: args.includes("--claude"),
  agents: args.includes("--agents"),
  all: args.includes("--all"),
};
const interactive = !flags.vscode && !flags.claude && !flags.agents && !flags.all;

// ─── Helpers ───────────────────────────────────────────────────────────

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function log(msg) { console.log(msg); }
function success(msg) { log(`${GREEN}✓${RESET} ${msg}`); }
function info(msg) { log(`${CYAN}ℹ${RESET} ${msg}`); }
function warn(msg) { log(`${YELLOW}⚠${RESET} ${msg}`); }
function header(msg) { log(`\n${BOLD}${msg}${RESET}\n`); }

// ─── MCP Server Install ───────────────────────────────────────────────

function installMcpDeps() {
  header("📦 Installing MCP server dependencies...");
  if (!existsSync(join(MCP_DIR, "node_modules"))) {
    try {
      execSync("npm install --quiet", { cwd: MCP_DIR, stdio: "inherit" });
      success("MCP dependencies installed");
    } catch {
      try {
        execSync("bun install", { cwd: MCP_DIR, stdio: "inherit" });
        success("MCP dependencies installed (bun)");
      } catch (e) {
        warn("Could not install MCP dependencies. Run manually: cd docs/mcp && npm install");
      }
    }
  } else {
    success("MCP dependencies already installed");
  }
}

// ─── VS Code Setup ────────────────────────────────────────────────────

function setupVSCode() {
  header("🔧 Configuring VS Code...");

  const vscodeDirs = [
    join(PROJECT_ROOT, ".vscode"),
    join(DOCS_ROOT, ".vscode"),
  ];

  // Try project root first, then docs
  const targetDir = existsSync(join(PROJECT_ROOT, ".vscode"))
    ? join(PROJECT_ROOT, ".vscode")
    : vscodeDirs[0];

  mkdirSync(targetDir, { recursive: true });

  const settingsPath = join(targetDir, "settings.json");
  let settings = {};

  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
    } catch {
      settings = {};
    }
  }

  // Add MCP server configuration
  if (!settings["github.copilot.chat.mcpServers"]) {
    settings["github.copilot.chat.mcpServers"] = {};
  }

  settings["github.copilot.chat.mcpServers"]["cookest-docs"] = {
    command: "npx",
    args: ["tsx", join(MCP_DIR, "src", "index.ts")],
    env: {
      DOCS_ROOT: join(DOCS_ROOT, "content", "docs"),
      MESSAGES_ROOT: join(DOCS_ROOT, "messages"),
    },
  };

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  success(`VS Code MCP configured at ${settingsPath}`);
  info("Restart VS Code or reload the window to activate");
}

// ─── Claude Desktop Setup ──────────────────────────────────────────────

function setupClaude() {
  header("🔧 Configuring Claude Desktop...");

  const platform = process.platform;
  let configPath;

  if (platform === "darwin") {
    configPath = join(process.env.HOME, "Library", "Application Support", "Claude", "claude_desktop_config.json");
  } else if (platform === "win32") {
    configPath = join(process.env.APPDATA, "Claude", "claude_desktop_config.json");
  } else {
    configPath = join(process.env.HOME, ".config", "claude", "claude_desktop_config.json");
  }

  let config = { mcpServers: {} };

  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, "utf-8"));
      if (!config.mcpServers) config.mcpServers = {};
    } catch {
      config = { mcpServers: {} };
    }
  } else {
    mkdirSync(dirname(configPath), { recursive: true });
  }

  config.mcpServers["cookest-docs"] = {
    command: "npx",
    args: ["tsx", join(MCP_DIR, "src", "index.ts")],
    env: {
      DOCS_ROOT: join(DOCS_ROOT, "content", "docs"),
      MESSAGES_ROOT: join(DOCS_ROOT, "messages"),
    },
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
  success(`Claude Desktop MCP configured at ${configPath}`);
  info("Restart Claude Desktop to activate");
}

// ─── AGENTS.md Setup ───────────────────────────────────────────────────

function setupAgents() {
  header("📋 Checking AGENTS.md files...");

  const repos = [
    { name: "api", dir: join(PROJECT_ROOT, "api") },
    { name: "UI", dir: join(PROJECT_ROOT, "UI") },
    { name: "web", dir: join(PROJECT_ROOT, "web") },
    { name: "etl", dir: join(PROJECT_ROOT, "etl") },
  ];

  for (const repo of repos) {
    const agentsPath = join(repo.dir, "AGENTS.md");
    if (!existsSync(repo.dir)) {
      warn(`${repo.name}/ not found — skipping`);
      continue;
    }
    if (existsSync(agentsPath)) {
      success(`${repo.name}/AGENTS.md already exists`);
    } else {
      warn(`${repo.name}/AGENTS.md missing — check the docs site for the template`);
    }
  }
}

// ─── Summary ───────────────────────────────────────────────────────────

function printSummary() {
  header("🎉 Setup complete!");
  log(`${DIM}Your AI tools now have access to the Cookest documentation.${RESET}`);
  log("");
  log("Available MCP tools:");
  log(`  ${CYAN}search_docs${RESET}         — Search across all documentation`);
  log(`  ${CYAN}get_page${RESET}            — Read a specific doc page`);
  log(`  ${CYAN}list_sections${RESET}       — Browse documentation structure`);
  log(`  ${CYAN}check_translations${RESET}  — View translation coverage`);
  log("");
  log("Available MCP resources:");
  log(`  ${CYAN}docs://pages${RESET}              — All pages with metadata`);
  log(`  ${CYAN}docs://structure${RESET}           — Repository ecosystem map`);
  log(`  ${CYAN}docs://translations/{locale}${RESET} — UI translation strings`);
  log(`  ${CYAN}docs://page/{locale}/{path}${RESET}  — Specific page content`);
  log("");
  log(`${DIM}Full documentation: /docs/ai/mcp-server${RESET}`);
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main() {
  log("");
  log(`${BOLD}${GREEN}🍳 Cookest AI Setup${RESET}`);
  log(`${DIM}One-click configuration for MCP server and AI agent tools${RESET}`);

  installMcpDeps();

  if (flags.all || flags.vscode || (interactive && (await ask("\nSet up VS Code / GitHub Copilot? (Y/n) ")) !== "n")) {
    setupVSCode();
  }

  if (flags.all || flags.claude || (interactive && (await ask("Set up Claude Desktop? (Y/n) ")) !== "n")) {
    setupClaude();
  }

  if (flags.all || flags.agents || (interactive && (await ask("Check AGENTS.md files? (Y/n) ")) !== "n")) {
    setupAgents();
  }

  printSummary();
}

main().catch(console.error);
