import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import { getAdminStats, getMembers, getSettings } from '@/lib/data';
import { timeAgo } from '@/lib/format';

export default async function AdminDashboard() {
  const [stats, members, settings] = await Promise.all([getAdminStats(), getMembers(), getSettings()]);
  const cards = [
    { label: 'Membros', value: stats.members, sub: `+${stats.newMembers7d} nos últimos 7 dias` },
    { label: 'Cursos', value: stats.courses, sub: `${stats.lessons} aulas no total` },
    { label: 'Aulas concluídas', value: stats.completions, sub: 'soma de todos os alunos' },
    { label: 'Posts na comunidade', value: stats.posts, sub: 'feed da comunidade' },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Painel</h1>
        <p className="text-sm text-mute">Visão geral da {settings.site_name}.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="text-sm text-mute">{c.label}</div>
            <div className="font-display mt-1 text-3xl font-extrabold">{c.value}</div>
            <div className="mt-1 text-xs text-soft">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: '/admin/cursos', title: 'Subir nova aula', text: 'Cadastre cursos, módulos e aulas.' },
          { href: '/admin/codigos', title: 'Gerar código de acesso', text: 'Para enviar no grupo do WhatsApp.' },
          { href: '/admin/configuracoes', title: 'Editar site de lançamento', text: 'Textos, link do grupo, imagens.' },
        ].map((q) => (
          <Link key={q.href} href={q.href} className="card p-5 transition hover:border-brand/50">
            <div className="font-bold text-brand">{q.title} →</div>
            <p className="mt-1 text-sm text-soft">{q.text}</p>
          </Link>
        ))}
      </div>

      <section className="card">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h2 className="font-bold">Novos membros</h2>
          <Link href="/admin/membros" className="text-sm text-brand hover:underline">Ver todos</Link>
        </div>
        <ul>
          {members.slice(0, 8).map((m) => (
            <li key={m.id} className="flex items-center gap-3 border-b border-line/60 px-4 py-3 last:border-0">
              <Avatar name={m.full_name} url={m.avatar_url} size={32} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{m.full_name}</div>
                <div className="truncate text-xs text-mute">{m.email}</div>
              </div>
              <span className="text-xs text-mute">{timeAgo(m.created_at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
