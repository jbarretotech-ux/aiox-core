import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteLesson, saveLesson } from '@/app/admin/actions';
import { AdminForm } from '@/components/admin-form';
import { UploadField } from '@/components/upload-field';
import { VideoPlayer } from '@/components/video-player';
import { getCatalog } from '@/lib/data';
import { materialsToText } from '@/lib/format';

export default async function AdminLessonEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const course = catalog.find((c) => c.modules.some((m) => m.lessons.some((l) => l.id === id)));
  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === id);
  if (!course || !lesson) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/cursos/${course.id}`} className="text-sm text-mute hover:text-white">← {course.title}</Link>
        <h1 className="font-display mt-1 text-2xl font-bold">Editar aula</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="card p-6">
          <AdminForm action={saveLesson}>
            <input type="hidden" name="id" value={lesson.id} />
            <div>
              <label className="label" htmlFor="title">Título</label>
              <input id="title" name="title" required defaultValue={lesson.title} className="input" />
            </div>
            <UploadField
              name="video_url"
              label="Vídeo da aula"
              defaultValue={lesson.video_url}
              accept="video/*"
              folder="videos"
              placeholder="https://youtu.be/... ou link do Vimeo / Panda / Bunny"
              hint="Recomendado: YouTube (não listado), Vimeo, Panda Video ou Bunny Stream — é só colar o link. Upload direto aceita até 50MB (plano grátis do Supabase)."
            />
            <div>
              <label className="label" htmlFor="description">Descrição / resumo da aula</label>
              <textarea id="description" name="description" rows={5} defaultValue={lesson.description} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="materials">Materiais (um por linha: Nome | link)</label>
              <textarea
                id="materials"
                name="materials"
                rows={3}
                defaultValue={materialsToText(lesson.materials)}
                placeholder={'Prompt da aula | https://docs.google.com/...\nModelo de proposta | https://...'}
                className="input font-mono text-sm"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="module_id">Módulo</label>
                <select id="module_id" name="module_id" defaultValue={lesson.module_id} className="input">
                  {course.modules.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="position">Ordem</label>
                <input id="position" name="position" type="number" defaultValue={lesson.position} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="duration_minutes">Duração (min)</label>
                <input id="duration_minutes" name="duration_minutes" type="number" min={0} defaultValue={lesson.duration_minutes ?? ''} className="input" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={lesson.published} className="h-4 w-4 accent-[#19e68c]" />
              Publicada (visível para os alunos)
            </label>
          </AdminForm>
        </section>

        <aside className="space-y-4">
          <div className="card p-4">
            <h2 className="mb-3 text-sm font-bold">Pré-visualização</h2>
            <VideoPlayer url={lesson.video_url} title={lesson.title} />
            <p className="mt-2 text-xs text-mute">Salve para atualizar a prévia.</p>
          </div>
          <form action={deleteLesson} className="card p-4">
            <input type="hidden" name="id" value={lesson.id} />
            <input type="hidden" name="course_id" value={course.id} />
            <button className="btn btn-danger w-full text-sm">Excluir aula</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
