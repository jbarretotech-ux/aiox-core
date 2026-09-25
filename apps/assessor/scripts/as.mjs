#!/usr/bin/env node
/**
 * Assessor CLI — opera o produto pelo terminal (CLI First).
 *
 * Uso:  npm run as -- <comando> [args]
 *
 *   help      Mostra esta ajuda
 *   status    Confere variáveis de ambiente e a conexão com o Supabase
 *
 * Lê .env.local e .env (sem sobrescrever o ambiente).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkEnv, parseArgs, parseEnv } from './lib/cli.mjs';

const HELP = `Assessor CLI

Uso: npm run as -- <comando> [args]

Comandos:
  help      Mostra esta ajuda
  status    Confere variáveis de ambiente e a conexão com o Supabase
`;

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    const parsed = parseEnv(readFileSync(path, 'utf8'));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

async function checkSupabase() {
  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
  const { error } = await client.from('users').select('id', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
}

async function status() {
  const report = checkEnv(process.env);
  let failed = false;

  for (const [group, { ok, missing }] of Object.entries(report)) {
    const required = group === 'core';
    if (ok) {
      console.log(`✔ ${group}: variáveis ok`);
    } else {
      console.log(`${required ? '✖' : '•'} ${group}: faltando ${missing.join(', ')}${required ? '' : ' (opcional por enquanto)'}`);
      if (required) failed = true;
    }
  }

  if (report.core.ok) {
    try {
      await checkSupabase();
      console.log('✔ supabase: conectado (tabela users acessível)');
    } catch (error) {
      console.log(`✖ supabase: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
      failed = true;
    }
  }

  process.exitCode = failed ? 1 : 0;
}

async function main() {
  loadEnv();
  const { command } = parseArgs(process.argv.slice(2));

  switch (command) {
    case 'help':
    case '--help':
    case '-h':
      console.log(HELP);
      return;
    case 'status':
      await status();
      return;
    default:
      console.error(`✖ Comando desconhecido: ${command}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`✖ ${error instanceof Error ? error.message : 'erro desconhecido'}`);
  process.exitCode = 1;
});
