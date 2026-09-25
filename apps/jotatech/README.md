# JOTATECH — Comunidade e área de membros

Plataforma da comunidade JOTATECH: **site de lançamento**, **área de membros estilo Hotmart**, **comunidade (feed)** e **painel administrativo completo**. Tudo roda de graça: **Vercel** (site) + **Supabase** (banco, login e arquivos).

```
Anúncio → Site de lançamento → Grupo do WhatsApp → Código de acesso → Cadastro → Área de membros
```

## O que já vem pronto

| Área | Rota | O que faz |
|------|------|-----------|
| Site de lançamento | `/` | Página de vendas com botão para o grupo do WhatsApp (textos editáveis no admin) |
| Login / cadastro | `/entrar`, `/cadastro` | Cadastro **só com código de acesso** enviado no grupo |
| Área de membros | `/app` | Vitrine de cursos e módulos (estilo Netflix/Hotmart), progresso, "continuar assistindo" |
| Curso | `/app/curso/[slug]` | Módulos e aulas com check de concluído |
| Aula | `/app/aula/[id]` | Player (YouTube, Vimeo, Panda, Bunny, Drive, mp4), materiais, comentários, próxima aula |
| Comunidade | `/app/comunidade` | Feed de posts e respostas, posts fixados, moderação |
| Admin | `/admin` | Painel, cursos/módulos/aulas, upload de capas e vídeos, membros, códigos de acesso, textos do site |

Sem as chaves do Supabase o app abre em **MODO DEMO** (conteúdo de exemplo, sem salvar), para você ver o layout antes de configurar.

## Rodar no computador

```bash
cd apps/jotatech
npm install
npm run dev          # abre em http://localhost:3000
```

## Colocar no ar (≈ 20 minutos)

### 1. Supabase (banco + login) — 8 min
1. Crie um projeto grátis em https://supabase.com
2. Abra **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql` e clique **Run**
3. Em **Authentication → Sign In / Providers → Email**, desligue **Confirm email** (o aluno entra direto após o cadastro). Opcional.
4. Em **Project Settings → API**, copie `Project URL`, `anon public` e `service_role`

### 2. Vercel (site) — 5 min
1. Em https://vercel.com → **Add New → Project** → importe este repositório
2. **Root Directory**: `apps/jotatech`
3. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public
   - `NEXT_PUBLIC_SITE_URL` = o endereço final (ex: `https://jotatech.vercel.app`)
4. **Deploy**
5. No Supabase, em **Authentication → URL Configuration**, coloque o mesmo endereço em **Site URL**

### 3. Virar administrador — 1 min
1. Acesse `/cadastro` e use o código **`JOTA-ADMIN`** (uso único, já criado pelo `schema.sql`)
2. A **primeira conta criada vira admin automaticamente**
3. Entre em `/admin` e crie os códigos para o grupo do WhatsApp

Para promover outra pessoa depois: `npm run jt -- make-admin email@x.com` (precisa da `SUPABASE_SERVICE_ROLE_KEY` em `.env.local`).

> Segurança: o banco só aceita cadastro com código de acesso válido — mesmo quem tentar criar conta direto pela API do Supabase é recusado.

## CLI (administração pelo terminal)

```bash
npm run jt -- status                         # testa a conexão
npm run jt -- stats                          # números da comunidade
npm run jt -- create-code JOTA2026 --label "Grupo turma 1" --max 500
npm run jt -- codes                          # lista códigos
npm run jt -- members ana                    # busca membros
npm run jt -- make-admin email@x.com
npm run jt -- block email@x.com              # bloqueia acesso (unblock para liberar)
```

## Vídeos das aulas

| Opção | Custo | Quando usar |
|-------|-------|-------------|
| YouTube **não listado** | Grátis | Começar agora. Cole o link no campo "Vídeo da aula" |
| Vimeo / Panda Video / Bunny Stream | Pago | Quando quiser proteger contra download e compartilhamento |
| Upload direto (botão "Enviar") | Grátis até 1GB | Vídeos curtos (até 50MB por arquivo no plano grátis) |

## Estrutura

```
apps/jotatech/
├── supabase/schema.sql      # tabelas, segurança (RLS), storage
├── scripts/jt.mjs           # CLI de administração
├── src/app/                 # páginas (landing, auth, app, admin)
├── src/components/          # logo, player, upload, formulários
├── src/lib/                 # dados, supabase, utilitários
└── tests/                   # testes (npm test)
```

## Comandos de qualidade

```bash
npm run typecheck
npm test
npm run build
```
