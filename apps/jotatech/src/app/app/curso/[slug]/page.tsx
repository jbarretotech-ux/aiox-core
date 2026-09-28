import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cover } from '@/components/cover';
import { CheckIcon, PlayIcon } from '@/components/icons';
import { ProgressBar } from '@/components/progress-bar';
import { getCompletedLessonIds, getCourseBySlug, requireMember } from '@/lib/data';
import { percent } from '@/lib/format';

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const viewer = await requireMember();
  const [course, done] = await Promise.all([getCourseBySlug(slug), getCompletedLessonIds(viewer.id)]);
  if (!course) notFound();

  const lessons = course.modules.flatMap((m) => m.lessons);
  const completed = lessons.filter((l) => done.has(l.id)).length;
  const pct = percent(completed, lessons.length);
  const next = lessons.find((l) => !done.has(l.id)) ?? lessons[0];

  return (
    <div className="pb-16">
      <Cover url={course.banner_url ?? course.cover_url} title={course.title} className="min-h-[300px]">
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        <div className="relative mx-auto flex min-h-[300px] max-w-5xl flex-col justify-end px-4 pb-8">
          <Link href="/app" className="mb-auto mt-6 w-fit text-sm text-soft hover:text-white">← Voltar</Link>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-soft">{course.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {next && (
              <Link href={`/app/aula/${next.id}`} className="btn btn-primary">
                <PlayIcon className="h-4 w-4" /> {completed > 0 ? 'Continuar' : 'Começar'}
              </Link>
            )}
            <div className="w-56">
              <div className="mb-1 text-xs text-mute">{completed}/{lessons.length} aulas concluídas · {pct}%</div>
              <ProgressBar value={pct} />
            </div>
          </div>
        </div>
      </Cover>

      <div className="mx-auto max-w-5xl space-y-4 px-4 pt-6">
        {course.modules.map((m, i) => (
          <details key={m.id} open={i === 0} className="card group overflow-hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">Módulo {i + 1}</div>
                <h2 className="mt-1 text-lg font-bold">{m.title}</h2>
                {m.description && <p className="mt-1 text-sm text-mute">{m.description}</p>}
              </div>
              <span className="text-sm text-mute">
                {m.lessons.filter((l) => done.has(l.id)).length}/{m.lessons.length}
                <span className="ml-3 inline-block transition group-open:rotate-180">▾</span>
              </span>
            </summary>
            <ol className="border-t border-line">
              {m.lessons.map((l, li) => (
                <li key={l.id}>
                  <Link href={`/app/aula/${l.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done.has(l.id) ? 'bg-brand text-ink' : 'border border-line text-mute'
                      }`}
                    >
                      {done.has(l.id) ? <CheckIcon className="h-3.5 w-3.5" /> : li + 1}
                    </span>
                    <span className="flex-1">{l.title}</span>
                    {l.duration_minutes ? <span className="text-xs text-mute">{l.duration_minutes} min</span> : null}
                  </Link>
                </li>
              ))}
              {m.lessons.length === 0 && <li className="px-5 py-4 text-sm text-mute">Aulas em breve.</li>}
            </ol>
          </details>
        ))}
      </div>
    </div>
  );
}
