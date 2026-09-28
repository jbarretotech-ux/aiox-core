import { deleteAccessCode, saveAccessCode, toggleAccessCode } from '@/app/admin/actions';
import { CopyButton } from '@/app/admin/codigos/copy-button';
import { AdminForm } from '@/components/admin-form';
import { getAccessCodes } from '@/lib/data';
import { SITE_URL } from '@/lib/env';

export default async function AdminCodes() {
  const codes = await getAccessCodes();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Códigos de acesso</h1>
        <p className="text-sm text-mute">
          Crie um código e envie no grupo do WhatsApp. Quem tiver o código consegue criar a conta na área de membros.
        </p>
      </div>

      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Novo código</h2>
        <div className="mt-4">
          <AdminForm action={saveAccessCode} submitLabel="Criar código" resetOnSuccess>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="label" htmlFor="code">Código</label>
                <input id="code" name="code" required placeholder="JOTA2026" className="input font-mono uppercase" />
              </div>
              <div>
                <label className="label" htmlFor="label">Descrição</label>
                <input id="label" name="label" placeholder="Grupo WhatsApp — Turma 1" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="max_uses">Limite de usos</label>
                <input id="max_uses" name="max_uses" type="number" min={0} placeholder="vazio = ilimitado" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="expires_at">Expira em</label>
                <input id="expires_at" name="expires_at" type="date" className="input" />
              </div>
            </div>
          </AdminForm>
        </div>
      </section>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-mute">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Descrição</th>
              <th className="p-3">Usos</th>
              <th className="p-3">Expira</th>
              <th className="p-3">Link de cadastro</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => {
              const link = `${SITE_URL}/cadastro?codigo=${encodeURIComponent(c.code)}`;
              const message = `🔑 Seu acesso à comunidade JOTATECH liberado!\n\n1. Acesse: ${link}\n2. Use o código: ${c.code}\n3. Crie sua senha e comece pela Trilha 1.`;
              return (
                <tr key={c.code} className="border-b border-line/60 last:border-0">
                  <td className="p-3 font-mono font-bold">{c.code}</td>
                  <td className="p-3 text-soft">{c.label ?? '—'}</td>
                  <td className="p-3">{c.uses}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td className="p-3 text-mute">{c.expires_at ? new Date(c.expires_at).toLocaleDateString('pt-BR') : 'Nunca'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <CopyButton text={link} label="Copiar link" />
                      <CopyButton text={message} label="Copiar mensagem" />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <form action={toggleAccessCode}>
                        <input type="hidden" name="code" value={c.code} />
                        <input type="hidden" name="active" value={String(c.active)} />
                        <button className={`rounded px-2 py-1 text-xs font-bold ${c.active ? 'bg-brand/15 text-brand' : 'bg-white/10 text-mute'}`}>
                          {c.active ? 'ATIVO' : 'DESATIVADO'}
                        </button>
                      </form>
                      <form action={deleteAccessCode}>
                        <input type="hidden" name="code" value={c.code} />
                        <button className="rounded px-2 py-1 text-xs text-mute hover:text-danger">Excluir</button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {codes.length === 0 && <p className="p-6 text-center text-mute">Nenhum código criado ainda.</p>}
      </div>
    </div>
  );
}
