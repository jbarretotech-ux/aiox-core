import Link from 'next/link';
import { saveCourse } from '@/app/admin/actions';
import { CourseFields } from '@/app/admin/cursos/course-fields';
import { AdminForm } from '@/components/admin-form';
import { Cover } from '@/components/cover';
import { getCatalog } from '@/lib/data';

export default async function AdminCourses() {
  const catalog = await getCatalog();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Cursos e aulas</h1>
        <p className="text-sm text-mute">Clique em um curso para gerenciar módulos e aulas.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {['Crie o curso (abaixo)', 'Abra o curso e crie um módulo', 'No módulo, clique em “Criar aula”', 'Suba o vídeo e pronto'].map((step, i) => (
          <div key={step} className="card flex items-center gap-3 p-3 text-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-ink">{i + 1}</span>
            {step}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {catalog.map((c) => {
          const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
          return (
            <Link key={c.id} href={`/admin/cursos/${c.id}`} className="card flex gap-4 p-3 transition hover:border-brand/50">
              <Cover url={c.cover_url} title={c.title} className="aspect-[3/4] w-20 shrink-0 rounded-lg" />
              <div className="min-w-0 py-1">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${c.published ? 'bg-brand/15 text-brand' : 'bg-white/10 text-mute'}`}>
                  {c.published ? 'PUBLICADO' : 'RASCUNHO'}
                </span>
                <h2 className="mt-1.5 font-bold leading-tight">{c.title}</h2>
                <p className="mt-1 text-xs text-mute">{c.modules.length} módulos · {lessons} aulas</p>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Novo curso</h2>
        <div className="mt-4">
          <AdminForm action={saveCourse} submitLabel="Criar curso">
            <CourseFields />
          </AdminForm>
        </div>
      </section>
    </div>
  );
}
