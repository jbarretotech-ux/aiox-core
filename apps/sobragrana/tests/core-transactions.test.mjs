import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lastActiveTransaction, sumTransactions, validateTransaction } from '../src/core/transactions.ts';

const valid = {
  kind: 'expense',
  amountCents: 3250,
  category: 'mercado',
  description: '  mercado do bairro  ',
  occurredOn: '2026-09-28',
  source: 'text',
};

test('validateTransaction aceita e limpa um registro válido', () => {
  const result = validateTransaction(valid);
  assert.equal(result.ok, true);
  assert.equal(result.value.description, 'mercado do bairro');
});

test('validateTransaction recusa campos inválidos', () => {
  const bad = [
    { amountCents: 0 },
    { amountCents: -10 },
    { amountCents: 32.5 },
    { kind: 'transfer' },
    { category: 'cassino' },
    { occurredOn: '28/09/2026' },
    { source: 'email' },
  ];
  for (const patch of bad) {
    const result = validateTransaction({ ...valid, ...patch });
    assert.equal(result.ok, false, JSON.stringify(patch));
    assert.ok(result.errors.length > 0);
  }
});

const list = [
  { id: '1', kind: 'expense', amountCents: 1000, category: 'mercado', occurredOn: '2026-09-01', source: 'text', createdAt: '2026-09-01T10:00:00Z' },
  { id: '2', kind: 'expense', amountCents: 2000, category: 'transporte', occurredOn: '2026-09-10', source: 'text', createdAt: '2026-09-10T10:00:00Z' },
  { id: '3', kind: 'income', amountCents: 150000, category: 'salario', occurredOn: '2026-09-05', source: 'text', createdAt: '2026-09-05T10:00:00Z' },
  { id: '4', kind: 'expense', amountCents: 9999, category: 'mercado', occurredOn: '2026-09-11', source: 'text', createdAt: '2026-09-11T10:00:00Z', deletedAt: '2026-09-11T10:01:00Z' },
  { id: '5', kind: 'expense', amountCents: 500, category: 'mercado', occurredOn: '2026-08-31', source: 'text', createdAt: '2026-08-31T10:00:00Z' },
];

test('sumTransactions filtra por período, tipo e categoria e ignora apagados', () => {
  const september = { from: '2026-09-01', to: '2026-09-30' };
  assert.equal(sumTransactions(list, { range: september, kind: 'expense' }), 3000);
  assert.equal(sumTransactions(list, { range: september, kind: 'expense', category: 'mercado' }), 1000);
  assert.equal(sumTransactions(list, { kind: 'income' }), 150000);
  assert.equal(sumTransactions(list, { category: 'mercado' }), 1500);
});

test('lastActiveTransaction pula o que já foi apagado', () => {
  assert.equal(lastActiveTransaction(list)?.id, '2');
  assert.equal(lastActiveTransaction([]), null);
});
