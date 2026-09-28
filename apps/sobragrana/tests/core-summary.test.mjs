import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSummary, formatSummary } from '../src/core/summary.ts';

const tx = (id, kind, amountCents, category, occurredOn, extra = {}) => ({
  id, kind, amountCents, category, occurredOn, source: 'text', createdAt: `${occurredOn}T12:00:00Z`, ...extra,
});

const list = [
  // semana atual: 22 a 28/09
  tx('1', 'expense', 10000, 'mercado', '2026-09-22'),
  tx('2', 'expense', 3000, 'transporte', '2026-09-24'),
  tx('3', 'expense', 2500, 'mercado', '2026-09-28'),
  tx('4', 'income', 50000, 'renda_extra', '2026-09-25'),
  tx('5', 'expense', 99999, 'lazer', '2026-09-26', { deletedAt: '2026-09-26T12:01:00Z' }),
  // semana anterior: 15 a 21/09
  tx('6', 'expense', 10000, 'mercado', '2026-09-15'),
];

const week = { from: '2026-09-22', to: '2026-09-28' };

test('buildSummary soma, agrupa, compara e ignora apagados', () => {
  const summary = buildSummary(list, week);
  assert.equal(summary.expenseCents, 15500);
  assert.equal(summary.incomeCents, 50000);
  assert.equal(summary.balanceCents, 34500);
  assert.deepEqual(summary.byCategory, [
    { category: 'mercado', totalCents: 12500 },
    { category: 'transporte', totalCents: 3000 },
  ]);
  assert.equal(summary.previousExpenseCents, 10000);
  assert.equal(summary.expenseChangeCents, 5500);
});

test('formatSummary gera texto curto em português', () => {
  const text = formatSummary(buildSummary(list, week));
  assert.equal(text, [
    'Você gastou R$ 155,00.',
    'R$ 55,00 a mais que no período anterior.',
    'Entrou R$ 500,00. Sobrou R$ 345,00.',
    'Onde mais foi:',
    '• Mercado: R$ 125,00',
    '• Transporte: R$ 30,00',
  ].join('\n'));
});

test('formatSummary sem movimento não inventa comparação', () => {
  const text = formatSummary(buildSummary([], week));
  assert.equal(text, 'Você gastou R$ 0,00.');
});
