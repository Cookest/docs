#!/usr/bin/env node

/**
 * Analyze documentation impact from code changes.
 *
 * Usage:
 *   node scripts/analyze-docs-impact.js --repo Cookest/api --files '["src/handlers/auth.rs"]'
 *
 * Reads docs-mapping.json and outputs which documentation pages are affected.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse args
const args = process.argv.slice(2);
const repoIdx = args.indexOf('--repo');
const filesIdx = args.indexOf('--files');

if (repoIdx === -1 || filesIdx === -1) {
  console.error('Usage: node analyze-docs-impact.js --repo <owner/repo> --files <json-array>');
  process.exit(1);
}

const repo = args[repoIdx + 1];
const files = JSON.parse(args[filesIdx + 1]);

// Load mapping
const mappingPath = join(__dirname, 'docs-mapping.json');
const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));

const repoMapping = mapping[repo];
if (!repoMapping) {
  console.log(`No mapping found for ${repo}`);
  // Output for GitHub Actions
  console.log('::set-output name=has_impact::false');
  process.exit(0);
}

// Find affected pages
const affectedPages = new Set();

for (const file of files) {
  for (const [pattern, pages] of Object.entries(repoMapping)) {
    if (file.startsWith(pattern) || file === pattern) {
      for (const page of pages) {
        affectedPages.add(page);
      }
    }
  }
}

if (affectedPages.size === 0) {
  console.log('No documentation impact detected.');
  console.log('::set-output name=has_impact::false');
  process.exit(0);
}

// Output results
const pageList = [...affectedPages].sort();
const markdown = pageList.map(p => `- [ ] \`${p}\``).join('\n');

console.log('Documentation pages potentially affected:');
console.log(markdown);

// GitHub Actions outputs
// Using the new GITHUB_OUTPUT method
const outputFile = process.env.GITHUB_OUTPUT;
if (outputFile) {
  const { appendFileSync } = await import('fs');
  appendFileSync(outputFile, `has_impact=true\n`);
  appendFileSync(outputFile, `affected_pages<<EOF\n${markdown}\nEOF\n`);
} else {
  // Fallback for local runs
  console.log(`\n::set-output name=has_impact::true`);
  console.log(`::set-output name=affected_pages::${markdown.replace(/\n/g, '%0A')}`);
}
