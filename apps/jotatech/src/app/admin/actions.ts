'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/env';
import { getViewer } from '@/lib/data';
import { parseMaterials, slugify } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/lib/types';

const DEMO: ActionResult = { ok: false, message: 'Modo demo: conecte o Supabase para salvar alterações.' };

async function adminClient() {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) redirect('/entrar');
  return createClient();
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

function strOrNull(fd: FormData, key: string): string | null {
  return str(fd, key) || null;
}

function int(fd: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === 'on' || fd.get(key) === 'true';
}

function fail(context: string, error: { message: string }): ActionResult {
  console.error(`[jotatech] Failed to ${context}`, { error });
  return { ok: false, message: `Erro ao ${context}: ${error.message}` };
}

function revalidateContent() {
  revalidatePath('/app', 'layout');
  revalidatePath('/admin', 'layout');
}

// ---------------------------------------------------------------- CURSOS
export async function saveCourse(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const supabase = await adminClient();
  const id = str(fd, 'id');
  const title = str(fd, 'title');
  if (!title) return { ok: false, message: 'Informe o título.' };
  const row = {
    title,
    slug: slugify(str(fd, 'slug') || title),
    description: str(fd, 'description'),
    cover_url: strOrNull(fd, 'cover_url'),
    banner_url: strOrNull(fd, 'banner_url'),
    position: int(fd, 'position'),
    published: bool(fd, 'published'),
  };
  if (id) {
    const { error } = await supabase.from('courses').update(row).eq('id', id);
    if (error) return fail('salvar o curso', error);
    revalidateContent();
    return { ok: true, message: 'Curso salvo!' };
  }
  const { data, error } = await supabase.from('courses').insert(row).select('id').single();
  if (error) return fail('criar o curso', error);
  revalidateContent();
  redirect(`/admin/cursos/${data.id}`);
}

export async function deleteCourse(fd: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await adminClient();
  await supabase.from('courses').delete().eq('id', str(fd, 'id'));
  revalidateContent();
  redirect('/admin/cursos');
}

// ---------------------------------------------------------------- MÓDULOS
export async function saveModule(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const supabase = await adminClient();
  const id = str(fd, 'id');
  const title = str(fd, 'title');
  if (!title) return { ok: false, message: 'Informe o título do módulo.' };
  const row = {
    course_id: str(fd, 'course_id'),
    title,
    description: str(fd, 'description'),
    cover_url: strOrNull(fd, 'cover_url'),
    position: int(fd, 'position'),
    published: id ? bool(fd, 'published') : true,
  };
  const { error } = id
    ? await supabase.from('modules').update(row).eq('id', id)
    : await supabase.from('modules').insert(row);
  if (error) return fail('salvar o módulo', error);
  revalidateContent();
  return { ok: true, message: id ? 'Módulo salvo!' : 'Módulo criado!' };
}

export async function deleteModule(fd: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await adminClient();
  await supabase.from('modules').delete().eq('id', str(fd, 'id'));
  revalidateContent();
}

// ---------------------------------------------------------------- AULAS
export async function createLesson(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const supabase = await adminClient();
  const title = str(fd, 'title');
  if (!title) return { ok: false, message: 'Informe o título da aula.' };
  const { data, error } = await supabase
    .from('lessons')
    .insert({ module_id: str(fd, 'module_id'), title, position: int(fd, 'position'), published: true })
    .select('id')
    .single();
  if (error) return fail('criar a aula', error);
  revalidateContent();
  redirect(`/admin/aulas/${data.id}`);
}

export async function saveLesson(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const supabase = await adminClient();
  const title = str(fd, 'title');
  if (!title) return { ok: false, message: 'Informe o título da aula.' };
  const duration = int(fd, 'duration_minutes', -1);
  const { error } = await supabase
    .from('lessons')
    .update({
      module_id: str(fd, 'module_id'),
      title,
      description: str(fd, 'description'),
      video_url: strOrNull(fd, 'video_url'),
      duration_minutes: duration >= 0 ? duration : null,
      materials: parseMaterials(str(fd, 'materials')),
      position: int(fd, 'position'),
      published: bool(fd, 'published'),
    })
    .eq('id', str(fd, 'id'));
  if (error) return fail('salvar a aula', error);
  revalidateContent();
  return { ok: true, message: 'Aula salva!' };
}

export async function deleteLesson(fd: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await adminClient();
  await supabase.from('lessons').delete().eq('id', str(fd, 'id'));
  revalidateContent();
  redirect(`/admin/cursos/${str(fd, 'course_id')}`);
}

// ---------------------------------------------------------------- MEMBROS
export async function updateMember(fd: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await adminClient();
  const patch: Record<string, string> = {};
  const role = str(fd, 'role');
  const status = str(fd, 'status');
  if (role === 'admin' || role === 'member') patch.role = role;
  if (status === 'active' || status === 'blocked') patch.status = status;
  await supabase.from('profiles').update(patch).eq('id', str(fd, 'id'));
  revalidatePath('/admin/membros');
}

// ---------------------------------------------------------------- CÓDIGOS
export async function saveAccessCode(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const supabase = await adminClient();
  const code = str(fd, 'code').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (code.length < 4) return { ok: false, message: 'O código precisa ter pelo menos 4 letras/números.' };
  const maxUses = int(fd, 'max_uses', 0);
  const expires = str(fd, 'expires_at');
  const { error } = await supabase.from('access_codes').insert({
    code,
    label: strOrNull(fd, 'label'),
    max_uses: maxUses > 0 ? maxUses : null,
    expires_at: expires ? new Date(`${expires}T23:59:59`).toISOString() : null,
  });
  if (error) return fail('criar o código', error);
  revalidatePath('/admin/codigos');
  return { ok: true, message: `Código ${code} criado!` };
}

export async function toggleAccessCode(fd: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await adminClient();
  await supabase.from('access_codes').update({ active: fd.get('active') !== 'true' }).eq('code', str(fd, 'code'));
  revalidatePath('/admin/codigos');
}

export async function deleteAccessCode(fd: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = await adminClient();
  await supabase.from('access_codes').delete().eq('code', str(fd, 'code'));
  revalidatePath('/admin/codigos');
}

// ---------------------------------------------------------------- CONFIGURAÇÕES
const SETTINGS_FIELDS = [
  'site_name',
  'tagline',
  'whatsapp_group_url',
  'support_whatsapp',
  'hero_title',
  'hero_subtitle',
  'hero_image_url',
  'members_welcome',
  'members_banner_url',
  'instagram_url',
  'youtube_url',
  'author_name',
  'author_bio',
  'author_photo_url',
] as const;

const NULLABLE = new Set(['hero_image_url', 'members_banner_url', 'author_photo_url']);

export async function saveSettings(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const supabase = await adminClient();
  const row: Record<string, string | null> = { updated_at: new Date().toISOString() };
  for (const key of SETTINGS_FIELDS) row[key] = NULLABLE.has(key) ? strOrNull(fd, key) : str(fd, key);
  const { error } = await supabase.from('settings').update(row).eq('id', 1);
  if (error) return fail('salvar as configurações', error);
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Configurações salvas! O site já foi atualizado.' };
}
