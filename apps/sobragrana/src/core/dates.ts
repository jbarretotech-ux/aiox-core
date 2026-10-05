// Datas do domínio: sempre strings 'YYYY-MM-DD' (dia local do usuário), sem hora.

export type IsoDate = string;

export const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

export function isIsoDate(value: unknown): value is IsoDate {
  if (typeof value !== 'string') return false;
  const match = ISO_DATE_RE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return date.getUTCFullYear() === Number(y)
    && date.getUTCMonth() === Number(m) - 1
    && date.getUTCDate() === Number(d);
}

function toUtcMs(date: IsoDate): number {
  if (!isIsoDate(date)) throw new Error(`Data inválida: ${date}`);
  const [y, m, d] = date.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUtcMs(ms: number): IsoDate {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Dia local de `now` no fuso informado. Quem chama passa o relógio (o core não lê a hora sozinho). */
export function todayIn(now: Date, timezone: string = DEFAULT_TIMEZONE): IsoDate {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return fromUtcMs(toUtcMs(date) + days * DAY_MS);
}

/** Dias de `from` até `to` (negativo se `to` já passou). */
export function diffDays(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Soma meses mantendo o dia, limitado ao último dia do mês (31/jan + 1 → 28 ou 29/fev). */
export function addMonths(date: IsoDate, months: number): IsoDate {
  if (!isIsoDate(date)) throw new Error(`Data inválida: ${date}`);
  const [y, m, d] = date.split('-').map(Number);
  const total = y * 12 + (m - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  const day = Math.min(d, daysInMonth(year, month));
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export interface DateRange {
  from: IsoDate;
  to: IsoDate;
}

export function isWithin(date: IsoDate, range: DateRange): boolean {
  return date >= range.from && date <= range.to;
}

/** Últimos 7 dias terminando em `today` (inclusive). */
export function lastSevenDays(today: IsoDate): DateRange {
  return { from: addDays(today, -6), to: today };
}

/** Do dia 1 do mês de `today` até `today`. */
export function monthToDate(today: IsoDate): DateRange {
  return { from: `${today.slice(0, 8)}01`, to: today };
}

/** Período de mesmo tamanho imediatamente anterior. */
export function previousRange(range: DateRange): DateRange {
  const length = diffDays(range.from, range.to) + 1;
  return { from: addDays(range.from, -length), to: addDays(range.from, -1) };
}
