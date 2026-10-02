import { test } from 'node:test';
import assert from 'node:assert/strict';
import { billsDueWithin, daysUntilDue, nextDueDate, payBill } from '../src/core/bills.ts';

const today = '2026-09-28';

const bills = [
  { id: 'luz', description: 'Luz', amountCents: 18000, dueOn: '2026-10-01', recurrence: 'monthly', status: 'open' },
  { id: 'agua', description: 'Água', amountCents: 9000, dueOn: '2026-09-25', recurrence: 'monthly', status: 'open' },
  { id: 'tv', description: 'TV', amountCents: 5000, dueOn: '2026-10-20', recurrence: 'none', status: 'open' },
  { id: 'net', description: 'Internet', amountCents: 10000, dueOn: '2026-09-29', recurrence: 'monthly', status: 'paid' },
];

test('daysUntilDue: hoje, futuro e atrasada', () => {
  assert.equal(daysUntilDue({ dueOn: today }, today), 0);
  assert.equal(daysUntilDue({ dueOn: '2026-10-01' }, today), 3);
  assert.equal(daysUntilDue({ dueOn: '2026-09-25' }, today), -3);
});

test('nextDueDate avança um mês e ajusta o fim do mês', () => {
  assert.equal(nextDueDate('2026-01-31', 'monthly'), '2026-02-28');
  assert.equal(nextDueDate('2026-03-10', 'monthly'), '2026-04-10');
  assert.equal(nextDueDate('2026-03-10', 'none'), null);
});

test('billsDueWithin lista abertas até N dias, com atrasadas, em ordem', () => {
  assert.deepEqual(billsDueWithin(bills, today, 3).map((b) => b.id), ['agua', 'luz']);
  assert.deepEqual(billsDueWithin(bills, today, 30).map((b) => b.id), ['agua', 'luz', 'tv']);
});

test('payBill dá baixa e gera a próxima quando é mensal', () => {
  const monthly = payBill(bills[0]);
  assert.equal(monthly.paid.status, 'paid');
  assert.deepEqual(monthly.next, {
    description: 'Luz', amountCents: 18000, dueOn: '2026-11-01', recurrence: 'monthly', status: 'open',
  });

  const once = payBill(bills[2]);
  assert.equal(once.paid.status, 'paid');
  assert.equal(once.next, null);

  assert.throws(() => payBill(bills[3]), /já está paga/);
});
