import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatBRL, parseMoney } from '../src/core/money.ts';
import { guessCategory, isCategory } from '../src/core/categories.ts';
import { addMonths, isIsoDate, lastSevenDays, monthToDate, previousRange, todayIn } from '../src/core/dates.ts';

test('parseMoney entende os jeitos comuns de escrever valor', () => {
  const cases = {
    '32': 3200,
    '32,50': 3250,
    '32.50': 3250,
    '32,5': 3250,
    'R$ 32,50': 3250,
    'R$1.000': 100000,
    '1.234,56': 123456,
    '1,234.56': 123456,
    '1.234.567': 123456700,
    '32 reais': 3200,
    'gastei 32,50 no mercado': 3250,
    'paguei 12. no pão': 1200,
  };
  for (const [input, expected] of Object.entries(cases)) {
    assert.equal(parseMoney(input), expected, input);
  }
});

test('parseMoney devolve null sem valor positivo', () => {
  for (const input of ['', 'oi', 'zero reais', '0', '0,00', 'R$ ,']) {
    assert.equal(parseMoney(input), null, input);
  }
});

test('formatBRL formata centavos em reais', () => {
  assert.equal(formatBRL(3250), 'R$ 32,50');
  assert.equal(formatBRL(123456), 'R$ 1.234,56');
  assert.equal(formatBRL(5), 'R$ 0,05');
  assert.equal(formatBRL(-1990), '-R$ 19,90');
  assert.throws(() => formatBRL(1.5));
});

test('guessCategory acerta palavras comuns e cai em outros', () => {
  assert.equal(guessCategory('gastei 32 no Mercado'), 'mercado');
  assert.equal(guessCategory('uber pro trabalho'), 'transporte');
  assert.equal(guessCategory('Farmácia'), 'saude');
  assert.equal(guessCategory('conta de luz'), 'contas');
  assert.equal(guessCategory('caiu o salário'), 'salario');
  assert.equal(guessCategory('pão na padaria'), 'alimentacao');
  assert.equal(guessCategory('gastei 99 na farmácia'), 'saude');
  assert.equal(guessCategory('presente da tia'), 'outros');
  // "bar" não pode casar dentro de "barbeiro"
  assert.equal(guessCategory('barbeiro'), 'outros');
  assert.equal(isCategory('mercado'), true);
  assert.equal(isCategory('toString'), false);
});

test('datas: validação, fuso e períodos', () => {
  assert.equal(isIsoDate('2026-02-29'), false);
  assert.equal(isIsoDate('2028-02-29'), true);
  // 02:00 UTC ainda é o dia anterior em São Paulo (UTC-3)
  assert.equal(todayIn(new Date('2026-09-28T02:00:00Z')), '2026-09-27');
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2028-01-31', 1), '2028-02-29');
  assert.equal(addMonths('2026-12-15', 1), '2027-01-15');
  assert.deepEqual(lastSevenDays('2026-09-28'), { from: '2026-09-22', to: '2026-09-28' });
  assert.deepEqual(monthToDate('2026-09-28'), { from: '2026-09-01', to: '2026-09-28' });
  assert.deepEqual(previousRange({ from: '2026-09-22', to: '2026-09-28' }), { from: '2026-09-15', to: '2026-09-21' });
});
