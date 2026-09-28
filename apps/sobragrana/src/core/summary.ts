// Resumo do período (semana/mês) com comparação ao período anterior.

import { categoryLabel, type Category } from './categories.ts';
import { previousRange, type DateRange } from './dates.ts';
import { formatBRL, type Cents } from './money.ts';
import { filterTransactions, sumTransactions, type Transaction } from './transactions.ts';

export interface CategoryTotal {
  category: Category;
  totalCents: Cents;
}

export interface Summary {
  range: DateRange;
  expenseCents: Cents;
  incomeCents: Cents;
  balanceCents: Cents;
  byCategory: CategoryTotal[];
  previousExpenseCents: Cents;
  /** Gastos agora menos gastos no período anterior (positivo = gastou mais). */
  expenseChangeCents: Cents;
}

export function buildSummary(transactions: readonly Transaction[], range: DateRange): Summary {
  const expenses = filterTransactions(transactions, { range, kind: 'expense' });
  const totals = new Map<Category, Cents>();
  for (const tx of expenses) totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amountCents);

  const byCategory = [...totals.entries()]
    .map(([category, totalCents]) => ({ category, totalCents }))
    .sort((a, b) => b.totalCents - a.totalCents);

  const expenseCents = sumTransactions(expenses);
  const incomeCents = sumTransactions(transactions, { range, kind: 'income' });
  const previousExpenseCents = sumTransactions(transactions, { range: previousRange(range), kind: 'expense' });

  return {
    range,
    expenseCents,
    incomeCents,
    balanceCents: incomeCents - expenseCents,
    byCategory,
    previousExpenseCents,
    expenseChangeCents: expenseCents - previousExpenseCents,
  };
}

/** Texto curto para o WhatsApp. `topN` limita as categorias listadas. */
export function formatSummary(summary: Summary, topN = 3): string {
  const lines = [`Você gastou ${formatBRL(summary.expenseCents)}.`];

  if (summary.previousExpenseCents > 0 && summary.expenseChangeCents !== 0) {
    const direction = summary.expenseChangeCents > 0 ? 'a mais' : 'a menos';
    lines.push(`${formatBRL(Math.abs(summary.expenseChangeCents))} ${direction} que no período anterior.`);
  }

  if (summary.incomeCents > 0) {
    lines.push(`Entrou ${formatBRL(summary.incomeCents)}. Sobrou ${formatBRL(summary.balanceCents)}.`);
  }

  const top = summary.byCategory.slice(0, topN);
  if (top.length > 0) {
    lines.push('Onde mais foi:');
    for (const item of top) lines.push(`• ${categoryLabel(item.category)}: ${formatBRL(item.totalCents)}`);
  }

  return lines.join('\n');
}
