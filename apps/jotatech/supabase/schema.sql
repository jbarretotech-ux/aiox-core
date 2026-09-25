-- =====================================================================
-- JOTATECH — Schema do banco (Supabase / Postgres)
-- Como usar: Supabase > SQL Editor > New query > cole este arquivo > Run.
-- É idempotente: pode rodar de novo sem quebrar nada.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- PERFIS (1 por usuário do Supabase Auth)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  whatsapp text,
  role text not null default 'member' check (role in ('member', 'admin')),
  status text not null default 'active' check (status in ('active', 'blocked')),
  access_code text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'active'
  );
$$;

-- Cria o perfil quando alguém se cadastra. O cadastro SÓ é aceito com um código
-- de acesso válido (enviado no grupo do WhatsApp); o uso do código é contado aqui.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(new.raw_user_meta_data ->> 'access_code', '')));
  v_ok boolean;
begin
  update public.access_codes set uses = uses + 1
   where upper(code) = v_code and active
     and (expires_at is null or expires_at > now())
     and (max_uses is null or uses < max_uses)
  returning true into v_ok;
  if not coalesce(v_ok, false) then
    raise exception 'JOTATECH_INVALID_ACCESS_CODE';
  end if;

  -- A primeira conta criada vira administradora automaticamente
  insert into public.profiles (id, email, full_name, whatsapp, access_code, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'whatsapp',
    v_code,
    case when exists (select 1 from public.profiles where role = 'admin') then 'member' else 'admin' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- CONFIGURAÇÕES DO SITE (linha única, editável no /admin)
-- ---------------------------------------------------------------------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'JOTATECH',
  tagline text not null default 'Crie sites com IA e transforme em renda extra',
  whatsapp_group_url text not null default 'https://chat.whatsapp.com/SEU-GRUPO',
  support_whatsapp text not null default '',
  hero_title text not null default 'Aprenda a criar e vender sites sem pagar hospedagem',
  hero_subtitle text not null default 'Com o Claude Code você cria sites profissionais para negócios locais e hospeda de graça na GitHub e na Vercel. Entre na comunidade e comece hoje.',
  hero_image_url text,
  members_welcome text not null default 'Bem-vindo(a) à comunidade JOTATECH! Comece pela trilha 1.',
  members_banner_url text,
  instagram_url text not null default '',
  youtube_url text not null default '',
  author_name text not null default 'Jota',
  author_bio text not null default 'Criador da JOTATECH. Ensino pessoas comuns a criarem sites com inteligência artificial e transformarem isso em renda extra atendendo negócios da própria cidade.',
  author_photo_url text,
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;
-- colunas adicionadas depois (para quem já rodou uma versão anterior)
alter table public.settings add column if not exists author_name text not null default 'Jota';
alter table public.settings add column if not exists author_bio text not null default '';
alter table public.settings add column if not exists author_photo_url text;

-- ---------------------------------------------------------------------
-- CÓDIGOS DE ACESSO (enviados no grupo de WhatsApp)
-- ---------------------------------------------------------------------
create table if not exists public.access_codes (
  code text primary key,
  label text,
  max_uses int,                        -- null = ilimitado
  uses int not null default 0,
  expires_at timestamptz,              -- null = não expira
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.check_access_code(p_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.access_codes
    where upper(code) = upper(trim(p_code))
      and active
      and (expires_at is null or expires_at > now())
      and (max_uses is null or uses < max_uses)
  );
$$;

drop function if exists public.redeem_access_code(text);

grant execute on function public.check_access_code(text) to anon, authenticated;

-- Funções de trigger não devem ser chamáveis pela API
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- CURSOS > MÓDULOS > AULAS
-- ---------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  cover_url text,          -- capa vertical (estilo Netflix/Hotmart)
  banner_url text,         -- banner horizontal
  position int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  description text not null default '',
  cover_url text,
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  description text not null default '',
  video_url text,          -- YouTube, Vimeo, Panda, Bunny ou arquivo .mp4
  duration_minutes int,
  materials jsonb not null default '[]'::jsonb,  -- [{ "label": "...", "url": "..." }]
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists modules_course_idx on public.modules (course_id, position);
create index if not exists lessons_module_idx on public.lessons (module_id, position);

-- ---------------------------------------------------------------------
-- PROGRESSO E COMENTÁRIOS NAS AULAS
-- ---------------------------------------------------------------------
create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.lesson_comments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- COMUNIDADE (feed de posts)
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- RLS (segurança por linha)
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.access_codes enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_comments enable row level security;
alter table public.posts enable row level security;
alter table public.post_comments enable row level security;

-- profiles
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select
  using (auth.uid() is not null);
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- Membro comum não consegue se promover a admin nem se desbloquear
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and auth.uid() is not null then
    new.role := old.role;
    new.status := old.status;
    new.email := old.email;
  end if;
  return new;
end;
$$;

revoke execute on function public.protect_profile_fields() from public, anon, authenticated;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();
drop policy if exists "profiles admin all" on public.profiles;
create policy "profiles admin all" on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- settings: leitura pública (landing), escrita só admin
drop policy if exists "settings read" on public.settings;
create policy "settings read" on public.settings for select using (true);
drop policy if exists "settings admin" on public.settings;
create policy "settings admin" on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

-- access_codes: só admin (validação pública via função check_access_code)
drop policy if exists "codes admin" on public.access_codes;
create policy "codes admin" on public.access_codes for all
  using (public.is_admin()) with check (public.is_admin());

-- conteúdo: membros ativos veem o que está publicado; admin vê e edita tudo
drop policy if exists "courses read" on public.courses;
create policy "courses read" on public.courses for select
  using ((published and public.is_active_member()) or public.is_admin());
drop policy if exists "courses admin" on public.courses;
create policy "courses admin" on public.courses for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "modules read" on public.modules;
create policy "modules read" on public.modules for select
  using ((published and public.is_active_member()) or public.is_admin());
drop policy if exists "modules admin" on public.modules;
create policy "modules admin" on public.modules for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "lessons read" on public.lessons;
create policy "lessons read" on public.lessons for select
  using ((published and public.is_active_member()) or public.is_admin());
drop policy if exists "lessons admin" on public.lessons;
create policy "lessons admin" on public.lessons for all
  using (public.is_admin()) with check (public.is_admin());

-- progresso: cada um mexe no seu; admin lê tudo
drop policy if exists "progress own" on public.lesson_progress;
create policy "progress own" on public.lesson_progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid() and public.is_active_member());
drop policy if exists "progress admin read" on public.lesson_progress;
create policy "progress admin read" on public.lesson_progress for select
  using (public.is_admin());

-- comentários de aula e comunidade
drop policy if exists "lesson comments read" on public.lesson_comments;
create policy "lesson comments read" on public.lesson_comments for select
  using (public.is_active_member());
drop policy if exists "lesson comments insert" on public.lesson_comments;
create policy "lesson comments insert" on public.lesson_comments for insert
  with check (user_id = auth.uid() and public.is_active_member());
drop policy if exists "lesson comments delete" on public.lesson_comments;
create policy "lesson comments delete" on public.lesson_comments for delete
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "posts read" on public.posts;
create policy "posts read" on public.posts for select
  using (public.is_active_member());
drop policy if exists "posts insert" on public.posts;
create policy "posts insert" on public.posts for insert
  with check (user_id = auth.uid() and public.is_active_member() and (not pinned or public.is_admin()));
drop policy if exists "posts delete" on public.posts;
create policy "posts delete" on public.posts for delete
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "posts admin update" on public.posts;
create policy "posts admin update" on public.posts for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "post comments read" on public.post_comments;
create policy "post comments read" on public.post_comments for select
  using (public.is_active_member());
drop policy if exists "post comments insert" on public.post_comments;
create policy "post comments insert" on public.post_comments for insert
  with check (user_id = auth.uid() and public.is_active_member());
drop policy if exists "post comments delete" on public.post_comments;
create policy "post comments delete" on public.post_comments for delete
  using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- STORAGE: bucket público "media" (capas, banners, materiais, vídeos curtos)
-- Plano grátis do Supabase aceita arquivos de até 50MB. Para aulas longas,
-- use YouTube (não listado), Vimeo, Panda Video ou Bunny Stream e cole o link.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select
  using (bucket_id = 'media');
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------
-- PRIMEIRO ACESSO: código de uso único para a conta do administrador.
-- A PRIMEIRA conta criada vira admin automaticamente.
insert into public.access_codes (code, label, max_uses)
values ('JOTA-ADMIN', 'Conta do administrador (uso único)', 1)
on conflict (code) do nothing;

-- Para promover outra pessoa a admin depois (trocando o e-mail):
--   update public.profiles set role = 'admin' where email = 'seu@email.com';
-- ou use a CLI:  npm run jt -- make-admin seu@email.com
-- ---------------------------------------------------------------------
