// Regras de gastos e receitas. Espelha a tabela `transactions` (§7), sem I/O.

import { isCategory, type Category } from './categories.ts';
import { isIsoDate, isWithin, type DateRange, type IsoDate } from './dates.ts';
import type { Cents } from './money.ts';

export const TRANSACTION_KINDS = ['expense', 'income'] as const;
export type TransactionKind = (typeof TRANSACTION_KINDS)[number];

export const TRANSACTION_SOURCES = ['text', 'audio', 'image', 'cli'] as const;
export type TransactionSource = (typeof TRANSACTION_SOURCES)[number];

export interface NewTransaction {
  kind: TransactionKind;
  amountCents: Cents;
  category: Category;
  description?: string;
  occurredOn: IsoDate;
  source: TransactionSource;
}

export interface Transaction extends NewTransaction {
  id: string;
  createdAt: string;
  deletedAt?: string | null;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

const MAX_DESCRIPTION = 140;

export function validateTransaction(input: Record<string, unknown>): ValidationResult<NewTransaction> {
  const errors: string[] = [];
  const { kind, amountCents, category, description, occurredOn, source } = input;

  if (!TRANSACTION_KINDS.includes(kind as TransactionKind)) errors.push('kind deve ser expense ou income');
  if (!Number.isSafeInteger(amountCents) || (amountCents as number) <= 0) errors.push('amountCents deve ser inteiro > 0');
  if (!isCategory(category)) errors.push('category fora da lista');
  if (!isIsoDate(occurredOn)) errors.push('occurredOn deve ser YYYY-MM-DD');
  if (!TRANSACTION_SOURCES.includes(source as TransactionSource)) errors.push('source inválida');
  if (description !== undefined && typeof description !== 'string') errors.push('description deve ser texto');

  if (errors.length > 0) return { ok: false, errors };

  const trimmed = typeof description === 'string' ? description.trim().slice(0, MAX_DESCRIPTION) : '';
  return {
    ok: true,
    value: {
      kind: kind as TransactionKind,
      amountCents: amountCents as Cents,
      category: category as Category,
      ...(trimmed ? { description: trimmed } : {}),
      occurredOn: occurredOn as IsoDate,
      source: source as TransactionSource,
    },
  };
}

export function isActive(tx: Pick<Transaction, 'deletedAt'>): boolean {
  return !tx.deletedAt;
}

export interface TransactionFilter {
  range?: DateRange;
  kind?: TransactionKind;
  category?: Category;
}

export function filterTransactions<T extends Transaction>(list: readonly T[], filter: TransactionFilter = {}): T[] {
  return list.filter((tx) => isActive(tx)
    && (!filter.range || isWithin(tx.occurredOn, filter.range))
    && (!filter.kind || tx.kind === filter.kind)
    && (!filter.category || tx.category === filter.category));
}

export function sumTransactions(list: readonly Transaction[], filter: TransactionFilter = {}): Cents {
  return filterTransactions(list, filter).reduce((total, tx) => total + tx.amountCents, 0);
}

/** Último registro não apagado (por createdAt). É o alvo do "desfazer". */
export function lastActiveTransaction<T extends Transaction>(list: readonly T[]): T | null {
  let last: T | null = null;
  for (const tx of list) {
    if (isActive(tx) && (!last || tx.createdAt > last.createdAt)) last = tx;
  }
  return last;
}
