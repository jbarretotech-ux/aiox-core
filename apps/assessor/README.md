# Assessor Popular (codinome)

Assessor financeiro de IA no WhatsApp para a classe C/D, a **R$ 19,90/mês**.
Arquitetura: `docs/assessor/ARCHITECTURE.md` (na raiz do monorepo).

## Rodar localmente

```bash
cd apps/assessor
npm install
cp .env.example .env.local   # preencha Supabase
npm run as -- status         # confere ambiente e banco
npm run dev                  # http://localhost:3000  ·  /api/health
```

## Banco

As migrations ficam em `supabase/migrations/`. Para aplicar no seu projeto Supabase, use o SQL Editor ou `supabase db push`.

## CLI

```bash
npm run as -- help
npm run as -- status
```

## Qualidade

```bash
npm test && npm run typecheck && npm run build
```

## Stories

`docs/stories/` — o epic AS-1 (MVP) começa por `AS-1.1.story.md`.
