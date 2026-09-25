import Link from 'next/link';
import { notFound } from 'next/navigation';
import { addLessonComment, deleteLessonComment, toggleLessonComplete } from '@/app/app/actions';
import { CommentForm } from '@/app/app/comment-form';
import { Avatar } from '@/components/avatar';
import { CheckIcon, PlayIcon } from '@/components/icons';
import { ProgressBar } from '@/components/progress-bar';
import { SubmitButton } from '@/components/submit-button';
import { VideoPlayer } from '@/components/video-player';
import { getCompletedLessonIds, getLessonComments, getLessonContext, requireMember } from '@/lib/data';
import { percent, timeAgo } from '@/lib/format';

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requireMember();
  const ctx = await getLessonContext(id);
  if (!ctx) notFound();
  const [done, comments] = await Promise.all([getCompletedLessonIds(viewer.id), getLessonComments(id)]);
  const { course, lesson, prev, next } = ctx;
  const isDone = done.has(lesson.id);
  const all = course.modules.flatMap((m) => m.lessons);
  const pct = percent(all.filter((l) => done.has(l.id)).length, all.length);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0">
        <Link href={`/app/curso/${course.slug}`} className="text-sm text-mute hover:text-white">← {course.title}</Link>
        <div className="mt-3">
          <VideoPlayer url={lesson.video_url} title={lesson.title} />
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">{ctx.module.title}</p>
            <h1 className="font-display mt-1 text-2xl font-bold">{lesson.title}</h1>
          </div>
          <form action={toggleLessonComplete} className="shrink-0">
            <input type="hidden" name="lesson_id" value={lesson.id} />
            <input type="hidden" name="completed" value={String(isDone)} />
            <input type="hidden" name="next_id" value={next?.id ?? ''} />
            <SubmitButton className={isDone ? 'btn btn-ghost' : 'btn btn-primary'} pendingText="Salvando...">
              <CheckIcon className="h-4 w-4" /> {isDone ? 'Aula concluída' : 'Concluir aula'}
            </SubmitButton>
          </form>
        </div>

        <div className="mt-4 flex gap-3">
          {prev && <Link href={`/app/aula/${prev.id}`} className="btn btn-ghost !py-2 text-sm">← Anterior</Link>}
          {next && <Link href={`/app/aula/${next.id}`} className="btn btn-ghost !py-2 text-sm">Próxima →</Link>}
        </div>

        {lesson.description && <p className="mt-6 whitespace-pre-line text-soft">{lesson.description}</p>}

        {lesson.materials.length > 0 && (
          <div className="card mt-6 p-5">
            <h2 className="font-bold">Materiais da aula</h2>
            <ul className="mt-3 space-y-2">
              {lesson.materials.map((m) => (
                <li key={m.url}>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">↗ {m.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">Dúvidas e comentários ({comments.length})</h2>
          <div className="mt-3">
            <CommentForm action={addLessonComment} hidden={{ lesson_id: lesson.id }} placeholder="Escreva sua dúvida ou comentário sobre esta aula..." />
          </div>
          <ul className="mt-6 space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <Avatar name={c.author?.full_name} url={c.author?.avatar_url} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{c.author?.full_name ?? 'Membro'}</span>
                    {c.author?.role === 'admin' && <span className="rounded bg-brand/15 px-1.5 text-[10px] font-bold text-brand">EQUIPE</span>}
                    <span className="text-xs text-mute">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-soft">{c.body}</p>
                  {(c.user_id === viewer.id || viewer.isAdmin) && (
                    <form action={deleteLessonComment}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="lesson_id" value={lesson.id} />
                      <button className="mt-1 text-xs text-mute hover:text-danger">Excluir</button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* LISTA DE AULAS */}
      <aside className="lg:sticky lg:top-20 lg:h-[calc(100dvh-6rem)]">
        <div className="card flex h-full flex-col overflow-hidden">
          <div className="border-b border-line p-4">
            <h2 className="font-bold">{course.title}</h2>
            <div className="mt-2 text-xs text-mute">{pct}% concluído</div>
            <ProgressBar value={pct} className="mt-1" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {course.modules.map((m, mi) => (
              <div key={m.id}>
                <div className="bg-panel-2/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-mute">
                  {mi + 1}. {m.title}
                </div>
                <ol>
                  {m.lessons.map((l) => {
                    const active = l.id === lesson.id;
                    return (
                      <li key={l.id}>
                        <Link
                          href={`/app/aula/${l.id}`}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition ${active ? 'bg-brand/10 text-white' : 'text-soft hover:bg-white/5'}`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                              done.has(l.id) ? 'bg-brand text-ink' : active ? 'border border-brand text-brand' : 'border border-line text-mute'
                            }`}
                          >
                            {done.has(l.id) ? <CheckIcon className="h-3 w-3" /> : <PlayIcon className="h-2.5 w-2.5" />}
                          </span>
                          <span className="flex-1 leading-snug">{l.title}</span>
                          {l.duration_minutes ? <span className="text-[11px] text-mute">{l.duration_minutes}min</span> : null}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
