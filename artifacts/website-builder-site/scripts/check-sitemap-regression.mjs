#!/usr/bin/env node
/**
 * Focused regression check for generated sitemap freshness signals.
 *
 * The production build writes dist/public/sitemap.xml. Verify that the same
 * checker used by the build rejects both a missing and malformed <lastmod>
 * entry, rather than only checking the source-controlled sitemap.
 */

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = fileURLToPath(new URL('.', import.meta.url));
const generatedSitemapPath = join(scriptDir, '..', 'dist', 'public', 'sitemap.xml');
const checkScriptPath = join(scriptDir, 'check-sitemap.mjs');

if (!existsSync(generatedSitemapPath)) {
  console.error(`Generated sitemap is missing at ${generatedSitemapPath}; run the production build first.`);
  process.exit(1);
}

const sitemap = readFileSync(generatedSitemapPath, 'utf8');
const firstLastmod = sitemap.match(/<lastmod>[^<]*<\/lastmod>/);
if (!firstLastmod) {
  console.error('Generated sitemap has no <lastmod> entry to test.');
  process.exit(1);
}

const fixtureDir = mkdtempSync(join(tmpdir(), 'gulfcdd-sitemap-'));
try {
  const cases = [
    ['missing-lastmod', sitemap.replace(firstLastmod[0], '')],
    ['malformed-lastmod', sitemap.replace(firstLastmod[0], '<lastmod>not-a-date</lastmod>')],
  ];

  for (const [name, fixture] of cases) {
    const fixturePath = join(fixtureDir, `${name}.xml`);
    writeFileSync(fixturePath, fixture, 'utf8');
    const result = spawnSync(
      process.execPath,
      [checkScriptPath, '--sitemap', fixturePath],
      { encoding: 'utf8' },
    );

    if (result.status === 0) {
      console.error(`Sitemap checker accepted the ${name} fixture.`);
      process.exitCode = 1;
    } else {
      console.log(`  ✓  ${name} fixture is rejected`);
    }
  }
} finally {
  rmSync(fixtureDir, { recursive: true, force: true });
}

if (process.exitCode) process.exit(process.exitCode);
