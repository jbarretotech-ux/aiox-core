#!/usr/bin/env node
/**
 * JOTATECH CLI — administra a comunidade pelo terminal.
 *
 * Uso:  npm run jt -- <comando> [args]
 *
 *   status                          Testa a conexão com o Supabase
 *   stats                           Números da comunidade
 *   make-admin <email>              Transforma um membro em administrador
 *   block <email> | unblock <email> Bloqueia / libera o acesso de um membro
 *   members [busca]                 Lista membros
 *   codes                           Lista códigos de acesso
 *   create-code <CODIGO> [--label "Turma 1"] [--max 100] [--expires 2026-12-31]
 *   disable-code <CODIGO>           Desativa um código
 *
 * Lê NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY de .env.local (ou do ambiente).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function flag(args, name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

function check(context, error) {
  if (error) fail(`Failed to ${context}: ${error.message}`);
}

loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const [command, ...args] = process.argv.slice(2);

if (!command || command === 'help' || command === '--help') {
  const src = readFileSync(new URL(import.meta.url), 'utf8');
  console.log(src.split('*/')[0].replace(/^#!.*\n\/\*\*?/, '').replace(/^ \* ?/gm, ''));
  process.exit(0);
}
if (!url || !key) fail('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local');

const db = createClient(url, key, { auth: { persistSession: false } });

async function setProfile(email, patch, okMsg) {
  if (!email) fail('Informe o e-mail.');
  const { data, error } = await db.from('profiles').update(patch).eq('email', email.toLowerCase()).select('email');
  check('update profile', error);
  if (!data?.length) fail(`Nenhum membro com e-mail ${email}. A pessoa precisa criar a conta primeiro.`);
  console.log(`✔ ${okMsg}: ${email}`);
}

const commands = {
  async status() {
    const { error } = await db.from('settings').select('site_name').eq('id', 1).single();
    check('reach Supabase (rodou o supabase/schema.sql?)', error);
    console.log(`✔ Conectado a ${url}`);
  },
  async stats() {
    const count = async (table) => {
      const { count: n, error } = await db.from(table).select('*', { count: 'exact', head: true });
      check(`count ${table}`, error);
      return n ?? 0;
    };
    const rows = {
      membros: await count('profiles'),
      cursos: await count('courses'),
      módulos: await count('modules'),
      aulas: await count('lessons'),
      'aulas concluídas': await count('lesson_progress'),
      posts: await count('posts'),
    };
    console.table(rows);
  },
  'make-admin': (a) => setProfile(a[0], { role: 'admin' }, 'Agora é admin'),
  block: (a) => setProfile(a[0], { status: 'blocked' }, 'Bloqueado'),
  unblock: (a) => setProfile(a[0], { status: 'active' }, 'Liberado'),
  async members(a) {
    let q = db.from('profiles').select('full_name, email, whatsapp, role, status, access_code, created_at').order('created_at', { ascending: false }).limit(200);
    if (a[0]) q = q.or(`full_name.ilike.%${a[0]}%,email.ilike.%${a[0]}%`);
    const { data, error } = await q;
    check('list members', error);
    console.table(data.map((m) => ({ ...m, created_at: m.created_at.slice(0, 10) })));
  },
  async codes() {
    const { data, error } = await db.from('access_codes').select('code, label, uses, max_uses, expires_at, active').order('created_at', { ascending: false });
    check('list codes', error);
    console.table(data);
  },
  async 'create-code'(a) {
    const code = (a[0] ?? '').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (code.length < 4) fail('Informe um código com pelo menos 4 caracteres. Ex: npm run jt -- create-code JOTA2026');
    const max = Number.parseInt(flag(a, 'max') ?? '', 10);
    const expires = flag(a, 'expires');
    const { error } = await db.from('access_codes').insert({
      code,
      label: flag(a, 'label') ?? null,
      max_uses: Number.isFinite(max) && max > 0 ? max : null,
      expires_at: expires ? new Date(`${expires}T23:59:59`).toISOString() : null,
    });
    check('create code', error);
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    console.log(`✔ Código ${code} criado.\n  Link para o grupo: ${site}/cadastro?codigo=${code}`);
  },
  async 'disable-code'(a) {
    const { error } = await db.from('access_codes').update({ active: false }).eq('code', (a[0] ?? '').toUpperCase());
    check('disable code', error);
    console.log(`✔ Código ${a[0]} desativado.`);
  },
};

const run = commands[command];
if (!run) fail(`Comando desconhecido: ${command}. Rode "npm run jt -- help".`);
await run(args);
