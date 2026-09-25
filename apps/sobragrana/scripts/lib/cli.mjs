/**
 * Funções puras da CLI do Assessor (testáveis sem rede).
 */

/** Variáveis obrigatórias por fase. `status` falha se alguma de `core` faltar. */
export const REQUIRED_ENV = {
  core: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
  llm: ['ANTHROPIC_API_KEY', 'LLM_MODEL'],
  whatsapp: [
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_APP_SECRET',
    'WHATSAPP_VERIFY_TOKEN',
  ],
  stt: ['STT_API_KEY'],
  billing: ['ASAAS_API_KEY', 'ASAAS_WEBHOOK_TOKEN'],
};

/** Lê o conteúdo de um arquivo .env e devolve um objeto chave → valor. */
export function parseEnv(content) {
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    const quoted = value.match(/^(['"])(.*)\1$/);
    if (quoted) {
      value = quoted[2];
    } else {
      value = value.replace(/\s+#.*$/, '');
    }
    env[match[1]] = value;
  }
  return env;
}

/** Separa comando, argumentos posicionais e flags (--nome valor | --flag). */
export function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  const positional = [];
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg.startsWith('--')) {
      const name = arg.slice(2);
      const next = rest[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[name] = next;
        i++;
      } else {
        flags[name] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { command, positional, flags };
}

/** Confere quais variáveis de cada grupo estão presentes. Nunca devolve valores. */
export function checkEnv(env, groups = REQUIRED_ENV) {
  const result = {};
  for (const [group, keys] of Object.entries(groups)) {
    const missing = keys.filter((key) => !env[key] || !String(env[key]).trim());
    result[group] = { ok: missing.length === 0, missing };
  }
  return result;
}
