import { saveSettings } from '@/app/admin/actions';
import { AdminForm } from '@/components/admin-form';
import { UploadField } from '@/components/upload-field';
import { getSettings } from '@/lib/data';

function Field({ name, label, value, textarea, placeholder }: { name: string; label: string; value: string; textarea?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      {textarea ? (
        <textarea id={name} name={name} rows={3} defaultValue={value} placeholder={placeholder} className="input" />
      ) : (
        <input id={name} name={name} defaultValue={value} placeholder={placeholder} className="input" />
      )}
    </div>
  );
}

export default async function AdminSettings() {
  const s = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Site e textos</h1>
        <p className="text-sm text-mute">Tudo que aparece no site de lançamento e na área de membros.</p>
      </div>
      <AdminForm action={saveSettings} submitLabel="Salvar configurações" className="space-y-6">
        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Geral</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="site_name" label="Nome do projeto" value={s.site_name} />
            <Field name="tagline" label="Frase curta" value={s.tagline} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="whatsapp_group_url" label="Link do grupo do WhatsApp (botões do site)" value={s.whatsapp_group_url} placeholder="https://chat.whatsapp.com/..." />
            <Field name="support_whatsapp" label="WhatsApp de suporte" value={s.support_whatsapp} placeholder="5511999999999" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="instagram_url" label="Instagram" value={s.instagram_url} placeholder="https://instagram.com/..." />
            <Field name="youtube_url" label="YouTube" value={s.youtube_url} placeholder="https://youtube.com/@..." />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Site de lançamento</h2>
          <Field name="hero_title" label="Título principal" value={s.hero_title} />
          <Field name="hero_subtitle" label="Subtítulo" value={s.hero_subtitle} textarea />
          <UploadField name="hero_image_url" label="Imagem do topo (opcional)" defaultValue={s.hero_image_url} folder="site" />
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Sobre o autor</h2>
          <Field name="author_name" label="Nome" value={s.author_name} />
          <Field name="author_bio" label="Biografia" value={s.author_bio} textarea />
          <UploadField name="author_photo_url" label="Foto" defaultValue={s.author_photo_url} folder="site" />
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Área de membros</h2>
          <Field name="members_welcome" label="Mensagem de boas-vindas" value={s.members_welcome} textarea />
          <UploadField name="members_banner_url" label="Banner da página inicial (1920×800)" defaultValue={s.members_banner_url} folder="site" />
        </section>
      </AdminForm>
    </div>
  );
}
