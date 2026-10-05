# Story SG-1.2 — Domínio `core/`: dinheiro, transações, contas e resumo

**Epic:** SG-1 — MVP Sobra Grana (WhatsApp, R$ 19,90/mês)
**Status:** Ready for Review
**Arquitetura:** `docs/sobragrana/ARCHITECTURE.md` §4 (camadas), §6 (ferramentas), §7 (dados), §12 (testes)
**Depende de:** SG-1.1

## Story

**Como** dono do produto,
**quero** as regras de dinheiro, transações, contas a pagar e resumo como funções puras e testadas,
**para que** a IA (SG-1.3), o WhatsApp (SG-1.4) e a CLI usem exatamente a mesma lógica, sem depender de banco nem de rede.

## Acceptance Criteria

1. **AC1 — Pureza:** `src/core/` não importa nada de `infra/`, `channels/`, `agent/`, Supabase nem Next.js. Não faz I/O e não lê o relógio sozinho (a data de "hoje" entra como parâmetro).
2. **AC2 — Dinheiro (`money.ts`):**
   - `parseMoney` entende `32`, `32,50`, `32.50`, `R$ 32,50`, `1.234,56`, `1,234.56`, `32 reais`, `R$1.000`, e devolve **centavos inteiros**.
   - Texto sem valor, zero ou negativo devolve `null`.
   - `formatBRL(3250)` devolve `R$ 32,50`, e `formatBRL(123456)` devolve `R$ 1.234,56`.
3. **AC3 — Categorias (`categories.ts`):** existe uma lista fixa de categorias com rótulo em português. `guessCategory` mapeia palavras comuns para uma categoria, como "mercado", "uber", "farmácia", "luz" e "salário". Sem palavra conhecida, a categoria é `outros`.
4. **AC4 — Transações (`transactions.ts`):**
   - `validateTransaction` recusa valor ≤ 0, valor não inteiro, tipo inválido, categoria fora da lista e data inválida.
   - `sumTransactions` soma por período, tipo e categoria, e ignora registros apagados (`deletedAt`).
   - `lastActiveTransaction` devolve o último registro ainda não apagado. É ele que o "desfazer" usa.
5. **AC5 — Contas (`bills.ts`):**
   - `daysUntilDue` calcula os dias até o vencimento.
   - `nextDueDate` avança 1 mês e ajusta o fim do mês: 31/jan vira 28 ou 29/fev, conforme o ano.
   - `billsDueWithin` lista as contas em aberto que vencem em até N dias, incluindo as atrasadas, em ordem de vencimento.
   - `payBill` marca a conta como paga. Se ela for mensal, devolve também a conta do mês seguinte.
6. **AC6 — Resumo (`summary.ts`):**
   - `buildSummary` calcula no período:
     - total de gastos e de receitas;
     - saldo;
     - gastos por categoria, em ordem decrescente;
     - variação contra o período anterior.
   - `formatSummary` gera um texto curto em português, pronto para o WhatsApp.
7. **AC7 — Datas (`dates.ts`):** as datas são strings `YYYY-MM-DD`. `todayIn(now, timezone)` devolve o dia local; o fuso padrão é `America/Sao_Paulo`.
8. **AC8 — CLI First:** `npm run sg -- money "<texto>"` mostra os centavos e o valor formatado. Texto sem valor sai com código ≠ 0.
9. **AC9 — Qualidade:** testes unitários cobrem os casos acima. `npm test`, `npm run typecheck` e `npm run build` passam.

## Tasks

- [x] T1 — `tsconfig.json`: `allowImportingTsExtensions`, para que o Node rode os `.ts` do core direto nos testes (AC9)
- [x] T2 — `src/core/dates.ts` (AC7)
- [x] T3 — `src/core/money.ts` (AC2)
- [x] T4 — `src/core/categories.ts` (AC3)
- [x] T5 — `src/core/transactions.ts` (AC4)
- [x] T6 — `src/core/bills.ts` (AC5)
- [x] T7 — `src/core/summary.ts` (AC6)
- [x] T8 — Comando `money` na CLI (AC8)
- [x] T9 — Testes, incluindo a checagem de pureza do core, e depois typecheck e build (AC1, AC9)

## Dev Notes

- Tipos com uniões `as const`, sem `enum`: o Node roda os `.ts` removendo só os tipos (*type stripping*), e esse modo não aceita `enum`.
- Dentro de `core/`, os imports são relativos com `.ts` (`./money.ts`). A Constitution permite import relativo dentro do mesmo módulo, e o Node não entende o alias `@/`.
- Limite conhecido: conta mensal no dia 31 passa para 28/fev e segue no dia 28 dali em diante, porque a tabela `bills` não guarda o dia original. Se isso importar, a correção é uma coluna `due_day` (decidir na SG-1.6).
- `"type": "module"` no `package.json`: tira o aviso do Node ao carregar os `.ts` do core. O build do Next continua passando.
- `subscription.ts` (trial/ativo/cancelado) fica para a SG-1.7, porque pertence à cobrança.
- O projeto Supabase ainda não existe. A criação pelo MCP deu timeout duas vezes, e esta story não depende do banco.

## File List

- `apps/sobragrana/tsconfig.json`
- `apps/sobragrana/package.json`
- `apps/sobragrana/src/core/dates.ts`
- `apps/sobragrana/src/core/money.ts`
- `apps/sobragrana/src/core/categories.ts`
- `apps/sobragrana/src/core/transactions.ts`
- `apps/sobragrana/src/core/bills.ts`
- `apps/sobragrana/src/core/summary.ts`
- `apps/sobragrana/scripts/sg.mjs`
- `apps/sobragrana/tests/core-money.test.mjs`
- `apps/sobragrana/tests/core-transactions.test.mjs`
- `apps/sobragrana/tests/core-bills.test.mjs`
- `apps/sobragrana/tests/core-summary.test.mjs`
- `apps/sobragrana/tests/core-purity.test.mjs`
- `apps/sobragrana/tests/cli.test.mjs`
- `apps/sobragrana/README.md`
- `apps/sobragrana/docs/stories/SG-1.2.story.md`

## Change Log

| Data | Versão | Descrição |
|---|---|---|
| 2026-09-28 | 0.1 | Story criada e implementada (domínio core + CLI `money`) |
