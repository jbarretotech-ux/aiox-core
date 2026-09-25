import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkEnv, parseArgs, parseEnv, REQUIRED_ENV } from '../scripts/lib/cli.mjs';

test('parseEnv lê chaves, ignora comentários e remove aspas', () => {
  const env = parseEnv([
    '# comentário',
    '',
    'A=1',
    'B="com espaço"',
    "C='simples'",
    'export D=exportado',
    'E=valor # comentário no fim',
    'linha inválida',
  ].join('\n'));
  assert.deepEqual(env, { A: '1', B: 'com espaço', C: 'simples', D: 'exportado', E: 'valor' });
});

test('parseEnv mantém # dentro de aspas', () => {
  assert.equal(parseEnv('K="a#b"').K, 'a#b');
});

test('parseArgs separa comando, posicionais e flags', () => {
  const parsed = parseArgs(['chat', '+5511999990000', 'gastei 20', '--month', '2026-10', '--verbose']);
  assert.equal(parsed.command, 'chat');
  assert.deepEqual(parsed.positional, ['+5511999990000', 'gastei 20']);
  assert.deepEqual(parsed.flags, { month: '2026-10', verbose: true });
});

test('parseArgs sem argumentos vira help', () => {
  assert.equal(parseArgs([]).command, 'help');
});

test('checkEnv aponta o que falta e nunca devolve valores', () => {
  const report = checkEnv({ NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SERVICE_ROLE_KEY: '  ' });
  assert.equal(report.core.ok, false);
  assert.deepEqual(report.core.missing, ['SUPABASE_SERVICE_ROLE_KEY']);
  assert.ok(!JSON.stringify(report).includes('x.supabase.co'));
});

test('checkEnv ok quando todas as variáveis do grupo existem', () => {
  const env = Object.fromEntries(REQUIRED_ENV.core.map((key) => [key, 'v']));
  assert.equal(checkEnv(env).core.ok, true);
});
