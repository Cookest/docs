#!/usr/bin/env node

/**
 * Translation coverage checker for Cookest documentation.
 *
 * Usage:
 *   node scripts/check-translations.mjs [--locale <code>] [--json]
 *
 * Without --locale, checks all non-default locales.
 * With --json, outputs machine-readable JSON instead of formatted text.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DOCS_ROOT = join(__dirname, '..', 'content', 'docs');
const MESSAGES_ROOT = join(__dirname, '..', 'messages');
const LOCALES = ['en', 'pt', 'fr', 'de', 'es'];
const DEFAULT_LOCALE = 'en';
const TIERS = { en: 1, pt: 1, fr: 2, de: 2, es: 2 };

// Parse args
const args = process.argv.slice(2);
const localeIdx = args.indexOf('--locale');
const jsonOutput = args.includes('--json');
const targetLocales = localeIdx !== -1
  ? [args[localeIdx + 1]]
  : LOCALES.filter(l => l !== DEFAULT_LOCALE);

// Walk MDX files
function walkMdx(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMdx(fullPath));
    } else if (extname(entry.name) === '.mdx') {
      results.push(fullPath);
    }
  }
  return results;
}

// Count JSON keys recursively
function countKeys(obj) {
  let count = 0;
  for (const val of Object.values(obj)) {
    if (typeof val === 'object' && val !== null) {
      count += countKeys(val);
    } else {
      count++;
    }
  }
  return count;
}

// Get English pages (excluding locale subdirs)
const enFiles = walkMdx(DOCS_ROOT);
const enPages = enFiles
  .map(f => relative(DOCS_ROOT, f).replace(/\.mdx$/, ''))
  .filter(p => !LOCALES.some(l => l !== DEFAULT_LOCALE && p.startsWith(l + '/')));

// Get English UI strings
const enMessages = JSON.parse(readFileSync(join(MESSAGES_ROOT, 'en.json'), 'utf-8'));
const enKeyCount = countKeys(enMessages);

const reports = [];

for (const locale of targetLocales) {
  const locDir = join(DOCS_ROOT, locale);
  const locFiles = walkMdx(locDir);
  const locPages = locFiles.map(f => relative(locDir, f).replace(/\.mdx$/, ''));

  // UI strings
  const msgFile = join(MESSAGES_ROOT, `${locale}.json`);
  let locKeyCount = 0;
  if (existsSync(msgFile)) {
    const locMessages = JSON.parse(readFileSync(msgFile, 'utf-8'));
    locKeyCount = countKeys(locMessages);
  }

  const missingPages = enPages.filter(p => !locPages.includes(p));
  const extraPages = locPages.filter(p => !enPages.includes(p));

  reports.push({
    locale,
    tier: TIERS[locale],
    content: {
      total: enPages.length,
      translated: locPages.length,
      percentage: Math.round((locPages.length / enPages.length) * 1000) / 10,
      missing: missingPages,
      extra: extraPages,
    },
    uiStrings: {
      total: enKeyCount,
      translated: locKeyCount,
      percentage: enKeyCount > 0 ? Math.round((locKeyCount / enKeyCount) * 1000) / 10 : 0,
    },
  });
}

// Output
if (jsonOutput) {
  console.log(JSON.stringify(reports, null, 2));
} else {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║        Cookest Translation Coverage Report       ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log();

  for (const r of reports) {
    const tierLabel = r.tier === 1 ? 'Tier 1 (full parity)' : 'Tier 2 (community)';
    console.log(`── ${r.locale.toUpperCase()} (${tierLabel}) ──`);
    console.log();
    console.log(`  Content pages:  ${r.content.translated}/${r.content.total} (${r.content.percentage}%)`);
    console.log(`  UI strings:     ${r.uiStrings.translated}/${r.uiStrings.total} (${r.uiStrings.percentage}%)`);

    if (r.content.missing.length > 0) {
      console.log();
      console.log(`  Missing pages (${r.content.missing.length}):`);
      for (const p of r.content.missing.slice(0, 10)) {
        console.log(`    ✗ ${p}`);
      }
      if (r.content.missing.length > 10) {
        console.log(`    ... and ${r.content.missing.length - 10} more`);
      }
    }

    if (r.content.extra.length > 0) {
      console.log();
      console.log(`  Extra pages (not in EN):`);
      for (const p of r.content.extra) {
        console.log(`    ? ${p}`);
      }
    }
    console.log();
  }

  // Summary bar
  console.log('── Summary ──');
  console.log();
  for (const r of reports) {
    const bar = '█'.repeat(Math.round(r.content.percentage / 5)) + '░'.repeat(20 - Math.round(r.content.percentage / 5));
    console.log(`  ${r.locale.toUpperCase()} ${bar} ${r.content.percentage}%`);
  }
  console.log();
}
