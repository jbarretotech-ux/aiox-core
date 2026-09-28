'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/env';
import { getViewer } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/lib/types';

const DEMO: ActionResult = { ok: false, message: 'Modo demo: conecte o Supabase para salvar.' };

async function memberClient() {
  const viewer = await getViewer();
  if (!viewer || viewer.profile.status !== 'active') redirect('/entrar');
  return { viewer, supabase: await createClient() };
}

function fail(context: string, error: { message: string }): ActionResult {
  console.error(`[jotatech] Failed to ${context}`, { error });
  return { ok: false, message: `Não foi possível ${context}. Tente novamente.` };
}

export async function toggleLessonComplete(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const lessonId = String(formData.get('lesson_id'));
  const completed = formData.get('completed') === 'true';
  const { viewer, supabase } = await memberClient();
  if (completed) {
    await supabase.from('lesson_progress').delete().eq('user_id', viewer.id).eq('lesson_id', lessonId);
  } else {
    await supabase.from('lesson_progress').upsert({ user_id: viewer.id, lesson_id: lessonId });
  }
  revalidatePath('/app', 'layout');
  const nextId = String(formData.get('next_id') ?? '');
  if (!completed && nextId) redirect(`/app/aula/${nextId}`);
}

export async function addLessonComment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const lessonId = String(formData.get('lesson_id'));
  const body = String(formData.get('body') ?? '').trim();
  if (!body) return { ok: false, message: 'Escreva seu comentário.' };
  const { viewer, supabase } = await memberClient();
  const { error } = await supabase.from('lesson_comments').insert({ lesson_id: lessonId, user_id: viewer.id, body });
  if (error) return fail('publicar o comentário', error);
  revalidatePath(`/app/aula/${lessonId}`);
  return { ok: true };
}

export async function deleteLessonComment(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase } = await memberClient();
  await supabase.from('lesson_comments').delete().eq('id', String(formData.get('id')));
  revalidatePath(`/app/aula/${String(formData.get('lesson_id'))}`);
}

export async function createPost(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const body = String(formData.get('body') ?? '').trim();
  if (!body) return { ok: false, message: 'Escreva algo para publicar.' };
  const { viewer, supabase } = await memberClient();
  const { error } = await supabase.from('posts').insert({ user_id: viewer.id, body });
  if (error) return fail('publicar', error);
  revalidatePath('/app/comunidade');
  return { ok: true };
}

export async function addPostComment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const postId = String(formData.get('post_id'));
  const body = String(formData.get('body') ?? '').trim();
  if (!body) return { ok: false, message: 'Escreva sua resposta.' };
  const { viewer, supabase } = await memberClient();
  const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: viewer.id, body });
  if (error) return fail('responder', error);
  revalidatePath('/app/comunidade');
  return { ok: true };
}

export async function deletePost(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase } = await memberClient();
  await supabase.from('posts').delete().eq('id', String(formData.get('id')));
  revalidatePath('/app/comunidade');
}

export async function deletePostComment(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { supabase } = await memberClient();
  await supabase.from('post_comments').delete().eq('id', String(formData.get('id')));
  revalidatePath('/app/comunidade');
}

export async function togglePin(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { viewer, supabase } = await memberClient();
  if (!viewer.isAdmin) return;
  await supabase.from('posts').update({ pinned: formData.get('pinned') !== 'true' }).eq('id', String(formData.get('id')));
  revalidatePath('/app/comunidade');
}

export async function updateProfile(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return DEMO;
  const { viewer, supabase } = await memberClient();
  const fullName = String(formData.get('full_name') ?? '').trim();
  const whatsapp = String(formData.get('whatsapp') ?? '').replace(/\D/g, '');
  const avatarUrl = String(formData.get('avatar_url') ?? '').trim() || null;
  const password = String(formData.get('password') ?? '');
  if (fullName.length < 2) return { ok: false, message: 'Informe seu nome.' };
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, whatsapp, avatar_url: avatarUrl })
    .eq('id', viewer.id);
  if (error) return fail('salvar o perfil', error);
  if (password) {
    if (password.length < 6) return { ok: false, message: 'A nova senha precisa ter pelo menos 6 caracteres.' };
    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError) return fail('trocar a senha', pwError);
  }
  revalidatePath('/app', 'layout');
  return { ok: true, message: 'Perfil atualizado!' };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect('/entrar');
}
