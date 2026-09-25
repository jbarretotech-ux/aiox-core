import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createLesson, deleteCourse, deleteModule, saveCourse, saveModule } from '@/app/admin/actions';
import { CourseFields } from '@/app/admin/cursos/course-fields';
import { AdminForm } from '@/components/admin-form';
import { UploadField } from '@/components/upload-field';
import { getCatalog } from '@/lib/data';
import type { Module } from '@/lib/types';

function ModuleFields({ courseId, module, nextPosition }: { courseId: string; module?: Module; nextPosition: number }) {
  return (
    <>
      <input type="hidden" name="course_id" value={courseId} />
      {module && <input type="hidden" name="id" value={module.id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
        <div>
          <label className="label">Título do módulo</label>
          <input name="title" required defaultValue={module?.title} className="input" />
        </div>
        <div>
          <label className="label">Ordem</label>
          <input name="position" type="number" defaultValue={module?.position ?? nextPosition} className="input" />
        </div>
      </div>
      <div>
        <label className="label">Descrição (opcional)</label>
        <input name="description" defaultValue={module?.description} className="input" />
      </div>
      <UploadField name="cover_url" label="Capa do módulo (16:9)" defaultValue={module?.cover_url} folder="modules" />
      {module && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={module.published} className="h-4 w-4 accent-[#19e68c]" />
          Publicado
        </label>
      )}
    </>
  );
}

export default async function AdminCourseEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const course = catalog.find((c) => c.id === id);
  if (!course) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/cursos" className="text-sm text-mute hover:text-white">← Cursos</Link>
        <h1 className="font-display mt-1 text-2xl font-bold">{course.title}</h1>
      </div>

      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Dados do curso</h2>
        <div className="mt-4">
          <AdminForm action={saveCourse}>
            <CourseFields course={course} />
          </AdminForm>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold">Módulos e aulas</h2>
        {course.modules.length === 0 && (
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm text-soft">
            <strong className="text-white">Próximo passo:</strong> crie um módulo logo abaixo (ex: &quot;Boas-vindas&quot;). Depois,
            dentro do módulo, adicione a aula e suba o vídeo.
          </div>
        )}
        {course.modules.map((m, i) => (
          <div key={m.id} className="card overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-line p-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">Módulo {i + 1}</div>
                <div className="font-bold">
                  {m.title} {!m.published && <span className="ml-1 text-xs font-normal text-mute">(oculto)</span>}
                </div>
              </div>
              <form action={deleteModule}>
                <input type="hidden" name="id" value={m.id} />
                <button className="btn btn-danger !px-3 !py-1.5 text-xs">Excluir módulo</button>
              </form>
            </div>

            <ol>
              {m.lessons.map((l, li) => (
                <li key={l.id} className="flex items-center gap-3 border-b border-line/60 px-4 py-2.5 text-sm">
                  <span className="w-6 text-mute">{li + 1}.</span>
                  <span className="flex-1">
                    {l.title}
                    {!l.video_url && <span className="ml-2 rounded bg-white/10 px-1.5 text-[10px] text-mute">sem vídeo</span>}
                    {!l.published && <span className="ml-2 rounded bg-white/10 px-1.5 text-[10px] text-mute">oculta</span>}
                  </span>
                  <Link href={`/admin/aulas/${l.id}`} className="rounded-md bg-brand/15 px-2.5 py-1 text-xs font-bold text-brand hover:bg-brand/25">
                    {l.video_url ? 'Editar aula' : '🎬 Subir vídeo'}
                  </Link>
                </li>
              ))}
            </ol>

            <div className="grid gap-6 p-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-bold">+ Adicionar aula neste módulo</h3>
                <p className="mb-2 text-xs text-mute">Digite o título e clique em Criar aula. Na tela seguinte você sobe o vídeo.</p>
                <AdminForm action={createLesson} submitLabel="Criar aula e subir vídeo →" className="space-y-3">
                  <input type="hidden" name="module_id" value={m.id} />
                  <input type="hidden" name="position" value={m.lessons.length} />
                  <input name="title" required placeholder="Título da aula" className="input" />
                </AdminForm>
              </div>
              <details>
                <summary className="cursor-pointer text-sm font-bold">Editar módulo</summary>
                <div className="mt-3">
                  <AdminForm action={saveModule} className="space-y-3">
                    <ModuleFields courseId={course.id} module={m} nextPosition={i} />
                  </AdminForm>
                </div>
              </details>
            </div>
          </div>
        ))}

        <div className="card border-dashed p-6">
          <h3 className="font-bold">+ Novo módulo</h3>
          <div className="mt-4">
            <AdminForm action={saveModule} submitLabel="Criar módulo" resetOnSuccess>
              <ModuleFields courseId={course.id} nextPosition={course.modules.length} />
            </AdminForm>
          </div>
        </div>
      </section>

      <section className="card border-danger/30 p-6">
        <h2 className="font-bold text-danger">Zona de perigo</h2>
        <p className="mt-1 text-sm text-mute">Excluir o curso apaga todos os módulos, aulas e o progresso dos alunos nele.</p>
        <form action={deleteCourse} className="mt-4">
          <input type="hidden" name="id" value={course.id} />
          <button className="btn btn-danger text-sm">Excluir curso</button>
        </form>
      </section>
    </div>
  );
}
