# Story SG-1.1 — Esqueleto do app, banco e CLI `status`

**Epic:** SG-1 — MVP Sobra Grana (WhatsApp, R$ 19,90/mês)
**Status:** Ready for Review
**Arquitetura:** `docs/sobragrana/ARCHITECTURE.md` (v0.1, decisões D2–D6 aceitas: "usar as sugestões")

## Story

**Como** dono do produto,
**quero** o esqueleto do app com banco versionado e uma CLI de diagnóstico,
**para que** as próximas stories tenham onde plugar domínio, IA e WhatsApp, e para que tudo seja verificável pelo terminal (CLI First).

## Acceptance Criteria

1. **AC1:** Existe o app Next.js em `apps/sobragrana` com os scripts `dev`, `build`, `start`, `typecheck`, `test` e `sg` (CLI).
2. **AC2:** `supabase/migrations/0001_init.sql` cria as 7 tabelas da arquitetura (§7): `users`, `subscriptions`, `messages`, `transactions`, `bills`, `conversation_state`, `usage_events`. Regras:
   - dinheiro em centavos (`integer`);
   - `check` nos campos de status/tipo;
   - `wa_message_id` único;
   - **RLS ligado em todas as tabelas**.
3. **AC3:** A migration aplica sem erro num Postgres limpo.
4. **AC4:** `npm run sg -- status` confere:
   - a presença das variáveis de ambiente obrigatórias, **sem imprimir os valores**;
   - a conexão com o Supabase, quando configurado.
   Sai com código ≠ 0 se algo obrigatório faltar.
5. **AC5:** `npm run sg -- help` lista os comandos. Comando desconhecido sai com erro e mostra a ajuda.
6. **AC6:** `GET /api/health` responde `{ ok: true, service: 'sobragrana' }`.
7. **AC7:** `.env.example` documenta todas as variáveis (sem valores reais). `.gitignore` do app ignora `.env*` (exceto o exemplo), `.next/` e `node_modules/`.
8. **AC8:** Testes automatizados cobrem:
   - o parser de `.env`;
   - o parser de argumentos da CLI;
   - a checagem de variáveis;
   - a presença de RLS e das tabelas na migration.
   `npm test`, `npm run typecheck` e `npm run build` passam.

## Tasks

- [x] T1 — Liberar `apps/sobragrana/` no `.gitignore` raiz (mesmo padrão do jotatech) (AC1)
- [x] T2 — `package.json`, `tsconfig.json`, `next.config.ts`, layout e página inicial (AC1)
- [x] T3 — Migration `0001_init.sql` com as 7 tabelas + RLS (AC2)
- [x] T4 — Aplicar a migration num Postgres 16 local (AC3)
- [x] T5 — Lib da CLI (`scripts/lib/cli.mjs`): env, args, checagem (AC4, AC5)
- [x] T6 — CLI `scripts/sg.mjs` com `help` e `status` (AC4, AC5)
- [x] T7 — Rota `GET /api/health` (AC6)
- [x] T8 — `.env.example`, `.gitignore`, `README.md` (AC7)
- [x] T9 — Testes + typecheck + build (AC8)

## Dev Notes

- Stack igual ao `apps/jotatech`: Next.js 16, React 19, `@supabase/supabase-js`, testes com `node --test`.
- O domínio (`src/core/`) começa na SG-1.2. Esta story não tem regra de negócio.
- Modelo de IA (D2): `claude-haiku-4-5` via `LLM_MODEL`. Só a variável fica documentada; o uso começa na SG-1.3.
- Vive neste monorepo porque não foi possível criar o repositório separado (D5): o GitHub negou permissão à integração. A mudança para o repositório próprio fica para depois.

## File List

- `.gitignore` (raiz) — libera `apps/sobragrana/` e `apps/sobragrana/supabase/`
- `apps/sobragrana/package.json`
- `apps/sobragrana/package-lock.json`
- `apps/sobragrana/tsconfig.json`
- `apps/sobragrana/next.config.ts`
- `apps/sobragrana/.gitignore`
- `apps/sobragrana/.env.example`
- `apps/sobragrana/README.md`
- `apps/sobragrana/src/app/layout.tsx`
- `apps/sobragrana/src/app/page.tsx`
- `apps/sobragrana/src/app/api/health/route.ts`
- `apps/sobragrana/supabase/migrations/0001_init.sql`
- `apps/sobragrana/scripts/sg.mjs`
- `apps/sobragrana/scripts/lib/cli.mjs`
- `apps/sobragrana/tests/cli.test.mjs`
- `apps/sobragrana/tests/migration.test.mjs`
- `apps/sobragrana/docs/stories/SG-1.1.story.md`

## Change Log

| Data | Versão | Descrição |
|---|---|---|
| 2026-09-25 | 0.1 | Story criada e implementada (esqueleto, migration, CLI status, health) |
| 2026-09-25 | 0.2 | Renomeado para Sobra Grana: `apps/sobragrana`, stories SG-*, CLI `npm run sg` |
