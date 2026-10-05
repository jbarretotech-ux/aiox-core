// Lista fixa de categorias. A IA escolhe uma delas; nada fora da lista entra no banco.

export const CATEGORIES = {
  mercado: 'Mercado',
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  moradia: 'Moradia',
  contas: 'Contas da casa',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  vestuario: 'Roupas',
  dividas: 'Dívidas',
  salario: 'Salário',
  renda_extra: 'Renda extra',
  outros: 'Outros',
} as const;

export type Category = keyof typeof CATEGORIES;

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && Object.hasOwn(CATEGORIES, value);
}

export function categoryLabel(category: Category): string {
  return CATEGORIES[category];
}

// Ordem importa: a primeira categoria com palavra encontrada vence.
const KEYWORDS: ReadonlyArray<readonly [Category, readonly string[]]> = [
  ['salario', ['salario', 'pagamento do mes', 'holerite']],
  ['renda_extra', ['freela', 'bico', 'renda extra', 'pix recebido', 'vendi']],
  ['mercado', ['mercado', 'supermercado', 'atacadao', 'assai', 'feira', 'acougue', 'hortifruti']],
  ['alimentacao', ['lanche', 'padaria', 'pao', 'restaurante', 'ifood', 'pizza', 'marmita', 'almoco', 'jantar', 'cafe', 'acai']],
  ['transporte', ['uber', 'onibus', 'metro', 'gasolina', 'combustivel', 'etanol', 'passagem', 'estacionamento', 'moto']],
  ['contas', ['luz', 'energia', 'agua', 'gas', 'internet', 'celular', 'telefone', 'recarga']],
  ['moradia', ['aluguel', 'condominio', 'iptu', 'reforma']],
  ['saude', ['farmacia', 'remedio', 'medico', 'consulta', 'dentista', 'exame', 'plano de saude']],
  ['educacao', ['escola', 'faculdade', 'curso', 'material escolar', 'livro']],
  ['lazer', ['cinema', 'bar', 'cerveja', 'show', 'netflix', 'streaming', 'passeio', 'viagem']],
  ['vestuario', ['roupa', 'tenis', 'sapato', 'camisa', 'calca']],
  ['dividas', ['fatura', 'cartao', 'emprestimo', 'parcela', 'boleto atrasado', 'juros']],
];

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Palpite de categoria pelo texto livre. Sem palavra conhecida → 'outros'. */
export function guessCategory(text: string): Category {
  const normalized = normalize(text);
  for (const [category, words] of KEYWORDS) {
    const hit = words.some((word) => new RegExp(`(^|[^a-z0-9])${escapeRegExp(word)}($|[^a-z0-9])`).test(normalized));
    if (hit) return category;
  }
  return 'outros';
}
