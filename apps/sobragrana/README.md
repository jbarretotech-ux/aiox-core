# Sobra Grana

Assessor financeiro de IA no WhatsApp para a classe C/D, a **R$ 19,90/mês**.
Arquitetura: `docs/sobragrana/ARCHITECTURE.md` (na raiz do monorepo).

## Rodar localmente

```bash
cd apps/sobragrana
npm install
cp .env.example .env.local   # preencha Supabase
npm run sg -- status         # confere ambiente e banco
npm run dev                  # http://localhost:3000  ·  /api/health
```

## Banco

As migrations ficam em `supabase/migrations/`. Para aplicar no seu projeto Supabase, use o SQL Editor ou `supabase db push`.

## CLI

```bash
npm run sg -- help
npm run sg -- status
```

## Qualidade

```bash
npm test && npm run typecheck && npm run build
```

## Stories

`docs/stories/` — o epic SG-1 (MVP) começa por `SG-1.1.story.md`.
