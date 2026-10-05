import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CORE_DIR = new URL('../src/core/', import.meta.url).pathname;

test('core/ só importa arquivos do próprio core (sem infra, rede, banco ou Next)', () => {
  for (const file of readdirSync(CORE_DIR).filter((f) => f.endsWith('.ts'))) {
    const source = readFileSync(join(CORE_DIR, file), 'utf8');
    const imports = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
    for (const specifier of imports) {
      assert.match(specifier, /^\.\/[a-z-]+\.ts$/, `${file} importa ${specifier}`);
    }
    assert.doesNotMatch(source, /\bfetch\(|process\.env|Date\.now\(|new Date\(\)/, `${file} faz I/O ou lê o relógio`);
  }
});
