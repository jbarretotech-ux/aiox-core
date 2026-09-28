import { UploadField } from '@/components/upload-field';
import type { Course } from '@/lib/types';

export function CourseFields({ course }: { course?: Course }) {
  return (
    <>
      {course && <input type="hidden" name="id" value={course.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="title">Título</label>
          <input id="title" name="title" required defaultValue={course?.title} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="slug">Endereço (slug)</label>
          <input id="slug" name="slug" defaultValue={course?.slug} placeholder="gerado a partir do título" className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="description">Descrição</label>
        <textarea id="description" name="description" rows={3} defaultValue={course?.description} className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <UploadField name="cover_url" label="Capa vertical (3:4) — ex: 600×800" defaultValue={course?.cover_url} folder="courses" />
        <UploadField name="banner_url" label="Banner horizontal (16:9) — ex: 1920×1080" defaultValue={course?.banner_url} folder="courses" />
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <div className="w-32">
          <label className="label" htmlFor="position">Ordem</label>
          <input id="position" name="position" type="number" defaultValue={course?.position ?? 0} className="input" />
        </div>
        <label className="mt-5 flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={course?.published ?? false} className="h-4 w-4 accent-[#19e68c]" />
          Publicado (visível para os alunos)
        </label>
      </div>
    </>
  );
}
