import Link from 'next/link';
import { Cover } from '@/components/cover';
import { PlayIcon } from '@/components/icons';
import { ProgressBar } from '@/components/progress-bar';
import { getCompletedLessonIds, getPublishedCatalog, getSettings, requireMember } from '@/lib/data';
import { percent } from '@/lib/format';
import type { Course } from '@/lib/types';

function courseStats(course: Course, done: Set<string>) {
  const lessons = course.modules.flatMap((m) => m.lessons);
  const completed = lessons.filter((l) => done.has(l.id)).length;
  const nextLesson = lessons.find((l) => !done.has(l.id)) ?? lessons[0] ?? null;
  return { total: lessons.length, completed, pct: percent(completed, lessons.length), nextLesson };
}

export default async function MemberHome() {
  const viewer = await requireMember();
  const [settings, catalog, done] = await Promise.all([
    getSettings(),
    getPublishedCatalog(),
    getCompletedLessonIds(viewer.id),
  ]);

  const inProgress = catalog.map((c) => ({ course: c, ...courseStats(c, done) }));
  const current = inProgress.find((c) => c.completed > 0 && c.pct < 100) ?? inProgress[0];
  const firstName = (viewer.profile.full_name ?? '').split(' ')[0];

  return (
    <div className="pb-16">
      {/* BANNER */}
      <Cover
        url={settings.members_banner_url}
        title={settings.site_name}
        seed={150}
        className="min-h-[340px] md:min-h-[420px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />
        <div className="relative mx-auto flex h-full min-h-[340px] max-w-7xl flex-col justify-end px-4 pb-10 md:min-h-[420px]">
          <p className="text-sm font-semibold text-brand">Olá, {firstName || 'aluno'} 👋</p>
          <h1 className="font-display mt-2 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
            {current ? current.course.title : settings.site_name}
          </h1>
          <p className="mt-3 max-w-xl text-soft">{settings.members_welcome}</p>
          {current?.nextLesson && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={`/app/aula/${current.nextLesson.id}`} className="btn btn-primary !px-6">
                <PlayIcon className="h-4 w-4" /> {current.completed > 0 ? 'Continuar assistindo' : 'Começar agora'}
              </Link>
              <div className="w-48">
                <div className="mb-1 text-xs text-mute">
                  {current.completed}/{current.total} aulas · {current.pct}%
                </div>
                <ProgressBar value={current.pct} />
              </div>
            </div>
          )}
        </div>
      </Cover>

      <div className="mx-auto max-w-7xl space-y-12 px-4">
        {catalog.length === 0 && (
          <div className="card mt-10 p-10 text-center text-soft">
            Nenhum curso publicado ainda. {viewer.isAdmin && <Link href="/admin/cursos" className="text-brand underline">Cadastre o primeiro curso</Link>}
          </div>
        )}

        {/* TRILHAS */}
        {catalog.length > 0 && (
          <section>
            <h2 className="font-display mb-4 text-xl font-bold">Minhas trilhas</h2>
            <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
              {inProgress.map(({ course, pct, completed, total }) => (
                <Link key={course.id} href={`/app/curso/${course.slug}`} className="group w-44 shrink-0 snap-start sm:w-52">
                  <Cover url={course.cover_url} title={course.title} className="aspect-[3/4] rounded-xl border border-line transition group-hover:scale-[1.03] group-hover:border-brand/60">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h3 className="font-display text-base font-bold leading-tight">{course.title}</h3>
                      <div className="mt-2 text-[11px] text-soft">{completed}/{total} aulas</div>
                      <ProgressBar value={pct} className="mt-1" />
                    </div>
                  </Cover>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* MÓDULOS POR CURSO */}
        {catalog.map((course) => (
          <section key={course.id}>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="font-display text-xl font-bold">{course.title}</h2>
              <Link href={`/app/curso/${course.slug}`} className="shrink-0 text-sm text-brand hover:underline">Ver tudo</Link>
            </div>
            <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
              {course.modules.map((m, i) => {
                const first = m.lessons[0];
                const doneCount = m.lessons.filter((l) => done.has(l.id)).length;
                const href = first ? `/app/aula/${first.id}` : `/app/curso/${course.slug}`;
                return (
                  <Link key={m.id} href={href} className="group w-60 shrink-0 snap-start sm:w-72">
                    <Cover url={m.cover_url} title={`${course.title}${m.title}`} className="aspect-video rounded-xl border border-line transition group-hover:border-brand/60">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold">
                        Módulo {i + 1}
                      </span>
                      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-ink opacity-0 transition group-hover:opacity-100">
                        <PlayIcon className="h-4 w-4" />
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <h3 className="font-semibold leading-tight">{m.title}</h3>
                        <p className="mt-1 text-xs text-soft">
                          {m.lessons.length} aulas{doneCount > 0 ? ` · ${doneCount} concluídas` : ''}
                        </p>
                      </div>
                    </Cover>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
