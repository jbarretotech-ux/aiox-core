'use server';

import { redirect } from 'next/navigation';
import { SITE_URL, isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/lib/types';

const DEMO_MSG = 'Modo demo: configure o Supabase para ativar login e cadastro. Use o botão "Ver demo".';

function safeNext(value: FormDataEntryValue | null): string {
  const v = typeof value === 'string' ? value : '';
  return v.startsWith('/') && !v.startsWith('//') ? v : '/app';
}

export async function signIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { ok: false, message: DEMO_MSG };
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { ok: false, message: 'Preencha e-mail e senha.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      ok: false,
      message: error.message.includes('confirm')
        ? 'Confirme seu e-mail antes de entrar (veja sua caixa de entrada).'
        : 'E-mail ou senha incorretos.',
    };
  }
  redirect(safeNext(formData.get('volta')));
}

export async function signUp(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { ok: false, message: DEMO_MSG };
  const fullName = String(formData.get('full_name') ?? '').trim();
  const whatsapp = String(formData.get('whatsapp') ?? '').replace(/\D/g, '');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const code = String(formData.get('code') ?? '').trim().toUpperCase();

  if (fullName.length < 2) return { ok: false, message: 'Informe seu nome.' };
  if (!email.includes('@')) return { ok: false, message: 'Informe um e-mail válido.' };
  if (password.length < 6) return { ok: false, message: 'A senha precisa ter pelo menos 6 caracteres.' };
  if (!code) return { ok: false, message: 'Informe o código de acesso que você recebeu no grupo do WhatsApp.' };

  const supabase = await createClient();
  const { data: valid, error: checkError } = await supabase.rpc('check_access_code', { p_code: code });
  if (checkError) {
    console.error('[jotatech] Failed to check access code', { error: checkError });
    return { ok: false, message: 'Não foi possível validar o código agora. Tente novamente.' };
  }
  if (!valid) return { ok: false, message: 'Código de acesso inválido ou expirado. Peça o código atualizado no grupo.' };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, whatsapp, access_code: code },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/app`,
    },
  });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('registered')) return { ok: false, message: 'Este e-mail já tem conta. Faça login.' };
    // O banco recusa o cadastro (trigger handle_new_user) quando o código é inválido ou esgotou.
    if (msg.includes('database error')) {
      return { ok: false, message: 'Código de acesso inválido ou esgotado. Peça o código atualizado no grupo.' };
    }
    console.error('[jotatech] Failed to sign up', { error });
    return { ok: false, message: `Não foi possível criar sua conta: ${error.message}` };
  }

  if (!data.session) {
    return { ok: true, message: 'Conta criada! Confirme seu e-mail pelo link que enviamos e depois faça login.' };
  }
  redirect('/app');
}

export async function requestPasswordReset(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { ok: false, message: DEMO_MSG };
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email.includes('@')) return { ok: false, message: 'Informe um e-mail válido.' };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/auth/callback?next=/app/perfil` });
  return { ok: true, message: 'Se o e-mail estiver cadastrado, você vai receber um link para criar uma nova senha.' };
}
