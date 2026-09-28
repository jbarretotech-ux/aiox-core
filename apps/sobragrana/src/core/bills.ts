// Contas a pagar: vencimento, recorrência mensal e quem precisa de alerta. Espelha `bills` (§7).

import { addMonths, diffDays, type IsoDate } from './dates.ts';
import type { Cents } from './money.ts';

export const BILL_RECURRENCES = ['none', 'monthly'] as const;
export type BillRecurrence = (typeof BILL_RECURRENCES)[number];

export const BILL_STATUSES = ['open', 'paid'] as const;
export type BillStatus = (typeof BILL_STATUSES)[number];

export interface Bill {
  id: string;
  description: string;
  amountCents?: Cents | null;
  dueOn: IsoDate;
  recurrence: BillRecurrence;
  status: BillStatus;
}

export type NextBill = Omit<Bill, 'id'>;

/** Dias até vencer. 0 = vence hoje; negativo = atrasada. */
export function daysUntilDue(bill: Pick<Bill, 'dueOn'>, today: IsoDate): number {
  return diffDays(today, bill.dueOn);
}

/** Próximo vencimento de uma conta mensal (31/jan → 28 ou 29/fev). */
export function nextDueDate(dueOn: IsoDate, recurrence: BillRecurrence): IsoDate | null {
  if (recurrence === 'none') return null;
  return addMonths(dueOn, 1);
}

/** Contas em aberto que vencem em até `days` dias (inclui atrasadas), da mais urgente para a menos. */
export function billsDueWithin<T extends Bill>(bills: readonly T[], today: IsoDate, days: number): T[] {
  return bills
    .filter((bill) => bill.status === 'open' && daysUntilDue(bill, today) <= days)
    .sort((a, b) => (a.dueOn < b.dueOn ? -1 : a.dueOn > b.dueOn ? 1 : 0));
}

export interface PayResult<T extends Bill> {
  paid: T;
  next: NextBill | null;
}

/** Dá baixa na conta. Se for mensal, devolve a conta do mês seguinte (a ser criada). */
export function payBill<T extends Bill>(bill: T): PayResult<T> {
  if (bill.status === 'paid') throw new Error(`Conta ${bill.id} já está paga`);
  const nextDue = nextDueDate(bill.dueOn, bill.recurrence);
  return {
    paid: { ...bill, status: 'paid' },
    next: nextDue
      ? {
          description: bill.description,
          amountCents: bill.amountCents ?? null,
          dueOn: nextDue,
          recurrence: bill.recurrence,
          status: 'open',
        }
      : null,
  };
}
