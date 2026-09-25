import { cache } from 'react';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { DEMO_CODES, DEMO_COURSES, DEMO_POSTS, DEMO_PROFILE, DEMO_SETTINGS } from '@/lib/demo-data';
import type { AccessCode, Comment, Course, Lesson, Module, Post, Profile, Settings, Viewer } from '@/lib/types';

const AUTHOR_SELECT = 'author:profiles(full_name, avatar_url, role)';

function byPosition<T extends { position: number }>(a: T, b: T): number {
  return a.position - b.position;
}

function normalizeCourse(raw: Course): Course {
  const modules = [...(raw.modules ?? [])].sort(byPosition).map((m) => ({
    ...m,
    lessons: [...(m.lessons ?? [])].sort(byPosition).map((l) => ({ ...l, materials: l.materials ?? [] })),
  }));
  return { ...raw, modules };
}

function logAndThrow(context: string, error: { message: string }): never {
  console.error(`[jotatech] Failed to ${context}`, { error });
  throw new Error(`Failed to ${context}: ${error.message}`);
}

export const getSettings = cache(async (): Promise<Settings> => {
  if (!isSupabaseConfigured()) return DEMO_SETTINGS;
  const supabase = await createClient();
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
  if (error) {
    console.error('[jotatech] Failed to load settings, using defaults', { error });
    return DEMO_SETTINGS;
  }
  return { ...DEMO_SETTINGS, ...(data ?? {}) } as Settings;
});

export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!isSupabaseConfigured()) {
    return { id: DEMO_PROFILE.id, profile: DEMO_PROFILE, isAdmin: true, isDemo: true };
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', auth.user.id).maybeSingle();
  if (!profile) return null;
  const p = profile as Profile;
  return { id: p.id, profile: p, isAdmin: p.role === 'admin' && p.status === 'active', isDemo: false };
});

/** Exige membro logado e ativo. */
export async function requireMember(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect('/entrar');
  if (viewer.profile.status === 'blocked') redirect('/entrar?erro=bloqueado');
  return viewer;
}

/** Exige administrador. */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await requireMember();
  if (!viewer.isAdmin) redirect('/app');
  return viewer;
}

export const getCatalog = cache(async (): Promise<Course[]> => {
  if (!isSupabaseConfigured()) return DEMO_COURSES;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .order('position');
  if (error) logAndThrow('load courses', error);
  return (data as Course[]).map(normalizeCourse);
});

/** Catálogo apenas com conteúdo publicado (visão do aluno, inclusive para admins). */
export async function getPublishedCatalog(): Promise<Course[]> {
  const catalog = await getCatalog();
  return catalog
    .filter((c) => c.published)
    .map((c) => ({
      ...c,
      modules: c.modules
        .filter((m) => m.published)
        .map((m) => ({ ...m, lessons: m.lessons.filter((l) => l.published) })),
    }));
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const catalog = await getPublishedCatalog();
  return catalog.find((c) => c.slug === slug) ?? null;
}

export interface LessonContext {
  course: Course;
  module: Module;
  lesson: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
}

export async function getLessonContext(lessonId: string): Promise<LessonContext | null> {
  const catalog = await getPublishedCatalog();
  for (const course of catalog) {
    const flat = course.modules.flatMap((m) => m.lessons);
    const idx = flat.findIndex((l) => l.id === lessonId);
    if (idx === -1) continue;
    const lesson = flat[idx];
    const module = course.modules.find((m) => m.id === lesson.module_id) as Module;
    return { course, module, lesson, prev: flat[idx - 1] ?? null, next: flat[idx + 1] ?? null };
  }
  return null;
}

export async function getCompletedLessonIds(userId: string): Promise<Set<string>> {
  if (!isSupabaseConfigured()) return new Set(['demo-course-1-m1-l1']);
  const supabase = await createClient();
  const { data, error } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', userId);
  if (error) logAndThrow('load progress', error);
  return new Set((data ?? []).map((r: { lesson_id: string }) => r.lesson_id));
}

export async function getLessonComments(lessonId: string): Promise<Comment[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lesson_comments')
    .select(`id, user_id, body, created_at, ${AUTHOR_SELECT}`)
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: true });
  if (error) logAndThrow('load lesson comments', error);
  return (data ?? []) as unknown as Comment[];
}

export async function getPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return DEMO_POSTS;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(`id, user_id, body, pinned, created_at, ${AUTHOR_SELECT}, comments:post_comments(id, user_id, body, created_at, ${AUTHOR_SELECT})`)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) logAndThrow('load posts', error);
  const posts = (data ?? []) as unknown as Post[];
  return posts.map((p) => ({
    ...p,
    comments: [...(p.comments ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at)),
  }));
}

export async function getMembers(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [DEMO_PROFILE];
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) logAndThrow('load members', error);
  return (data ?? []) as Profile[];
}

export async function getAccessCodes(): Promise<AccessCode[]> {
  if (!isSupabaseConfigured()) return DEMO_CODES;
  const supabase = await createClient();
  const { data, error } = await supabase.from('access_codes').select('*').order('created_at', { ascending: false });
  if (error) logAndThrow('load access codes', error);
  return (data ?? []) as AccessCode[];
}

export interface AdminStats {
  members: number;
  newMembers7d: number;
  courses: number;
  lessons: number;
  completions: number;
  posts: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const catalog = await getCatalog();
  const lessons = catalog.reduce((n, c) => n + c.modules.reduce((k, m) => k + m.lessons.length, 0), 0);
  if (!isSupabaseConfigured()) {
    return { members: 1, newMembers7d: 1, courses: catalog.length, lessons, completions: 1, posts: DEMO_POSTS.length };
  }
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const [members, recent, completions, posts] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('lesson_progress').select('lesson_id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }),
  ]);
  return {
    members: members.count ?? 0,
    newMembers7d: recent.count ?? 0,
    courses: catalog.length,
    lessons,
    completions: completions.count ?? 0,
    posts: posts.count ?? 0,
  };
}
