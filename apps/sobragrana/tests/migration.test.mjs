import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sql = readFileSync(new URL('../supabase/migrations/0001_init.sql', import.meta.url), 'utf8');

const TABLES = [
  'users',
  'subscriptions',
  'messages',
  'transactions',
  'bills',
  'conversation_state',
  'usage_events',
];

test('migration cria as 7 tabelas da arquitetura', () => {
  for (const table of TABLES) {
    assert.match(sql, new RegExp(`create table ${table} \\(`), `faltou a tabela ${table}`);
  }
});

test('RLS ligado em todas as tabelas', () => {
  for (const table of TABLES) {
    assert.match(sql, new RegExp(`alter table ${table} enable row level security;`), `RLS faltando em ${table}`);
  }
});

test('dinheiro em centavos, nunca float/numeric', () => {
  assert.doesNotMatch(sql, /\b(float|real|double precision|numeric|money)\b/i);
  assert.match(sql, /amount_cents integer not null check \(amount_cents > 0\)/);
});

test('wa_message_id é único (idempotência do webhook)', () => {
  assert.match(sql, /wa_message_id text unique/);
});
