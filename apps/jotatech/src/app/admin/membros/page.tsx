import { updateMember } from '@/app/admin/actions';
import { Avatar } from '@/components/avatar';
import { getMembers, requireAdmin } from '@/lib/data';

export default async function AdminMembers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const viewer = await requireAdmin();
  const all = await getMembers();
  const term = q.trim().toLowerCase();
  const members = term
    ? all.filter((m) => [m.full_name, m.email, m.whatsapp, m.access_code].some((v) => v?.toLowerCase().includes(term)))
    : all;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Membros</h1>
          <p className="text-sm text-mute">{all.length} cadastrados · {all.filter((m) => m.status === 'active').length} ativos</p>
        </div>
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Buscar nome, e-mail, WhatsApp..." className="input w-64" />
          <button className="btn btn-ghost">Buscar</button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-mute">
            <tr>
              <th className="p-3">Membro</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3">Código</th>
              <th className="p-3">Entrou em</th>
              <th className="p-3">Papel</th>
              <th className="p-3">Acesso</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const self = m.id === viewer.id;
              return (
                <tr key={m.id} className="border-b border-line/60 last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.full_name} url={m.avatar_url} size={32} />
                      <div className="min-w-0">
                        <div className="font-semibold">{m.full_name}</div>
                        <div className="text-xs text-mute">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {m.whatsapp ? (
                      <a href={`https://wa.me/${m.whatsapp.length <= 11 ? `55${m.whatsapp}` : m.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                        {m.whatsapp}
                      </a>
                    ) : (
                      <span className="text-mute">—</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-xs">{m.access_code ?? '—'}</td>
                  <td className="p-3 text-mute">{new Date(m.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="p-3">
                    <form action={updateMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="role" value={m.role === 'admin' ? 'member' : 'admin'} />
                      <button disabled={self} className={`rounded px-2 py-1 text-xs font-bold ${m.role === 'admin' ? 'bg-brand-2/25 text-white' : 'bg-white/10 text-soft'} disabled:opacity-60`} title={self ? 'Você não pode alterar seu próprio papel' : 'Clique para alternar'}>
                        {m.role === 'admin' ? 'ADMIN' : 'ALUNO'}
                      </button>
                    </form>
                  </td>
                  <td className="p-3">
                    <form action={updateMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="status" value={m.status === 'active' ? 'blocked' : 'active'} />
                      <button disabled={self} className={`rounded px-2 py-1 text-xs font-bold ${m.status === 'active' ? 'bg-brand/15 text-brand' : 'bg-danger/15 text-danger'} disabled:opacity-60`}>
                        {m.status === 'active' ? 'ATIVO' : 'BLOQUEADO'}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {members.length === 0 && <p className="p-6 text-center text-mute">Nenhum membro encontrado.</p>}
      </div>
    </div>
  );
}
