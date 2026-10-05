// Dinheiro sempre em centavos inteiros. Nunca float no banco nem nas regras.

export type Cents = number;

// Primeiro número do texto, com separadores de milhar/decimal em qualquer formato.
const NUMBER_RE = /\d[\d.,]*/;

/**
 * Lê um valor em reais escrito do jeito que as pessoas escrevem:
 * "32", "32,50", "32.50", "R$ 32,50", "1.234,56", "1,234.56", "32 reais".
 * Devolve centavos, ou null se não houver valor positivo.
 */
export function parseMoney(input: string): Cents | null {
  const match = NUMBER_RE.exec(input);
  if (!match) return null;
  const raw = match[0].replace(/[.,]+$/, '');

  const lastComma = raw.lastIndexOf(',');
  const lastDot = raw.lastIndexOf('.');
  const lastSep = Math.max(lastComma, lastDot);

  let integerPart = raw;
  let decimalPart = '';
  if (lastSep !== -1) {
    const tail = raw.slice(lastSep + 1);
    const sepCount = (raw.match(/[.,]/g) ?? []).length;
    const bothSeparators = lastComma !== -1 && lastDot !== -1;
    // Separador decimal: é o último e tem 1–2 dígitos depois,
    // ou há os dois tipos de separador (o último é o decimal).
    const isDecimal = tail.length <= 2 && (bothSeparators || sepCount === 1);
    if (isDecimal) {
      integerPart = raw.slice(0, lastSep);
      decimalPart = tail;
    }
  }

  const integerDigits = integerPart.replace(/[.,]/g, '');
  if (!/^\d+$/.test(integerDigits) || !/^\d{0,2}$/.test(decimalPart)) return null;

  const cents = Number(integerDigits) * 100 + Number(decimalPart.padEnd(2, '0'));
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

/** 3250 → "R$ 32,50"; 123456 → "R$ 1.234,56"; negativos com "-". */
export function formatBRL(cents: Cents): string {
  if (!Number.isInteger(cents)) throw new Error(`Centavos devem ser inteiros: ${cents}`);
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const reais = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const centavos = String(abs % 100).padStart(2, '0');
  return `${sign}R$ ${reais},${centavos}`;
}
