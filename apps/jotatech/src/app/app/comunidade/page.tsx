import type { Metadata } from 'next';
import { addPostComment, createPost, deletePost, deletePostComment, togglePin } from '@/app/app/actions';
import { CommentForm } from '@/app/app/comment-form';
import { Avatar } from '@/components/avatar';
import { getPosts, getSettings, requireMember } from '@/lib/data';
import { timeAgo } from '@/lib/format';
import type { Author } from '@/lib/types';

export const metadata: Metadata = { title: 'Comunidade' };

function AuthorLine({ author, date }: { author: Author | null; date: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold">{author?.full_name ?? 'Membro'}</span>
      {author?.role === 'admin' && <span className="rounded bg-brand/15 px-1.5 text-[10px] font-bold text-brand">EQUIPE</span>}
      <span className="text-xs text-mute">{timeAgo(date)}</span>
    </div>
  );
}

export default async function CommunityPage() {
  const viewer = await requireMember();
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Comunidade</h1>
          <p className="text-sm text-mute">Compartilhe dúvidas, conquistas e os sites que você criou.</p>
        </div>

        <div className="card flex gap-3 p-4">
          <Avatar name={viewer.profile.full_name} url={viewer.profile.avatar_url} size={40} />
          <div className="flex-1">
            <CommentForm action={createPost} hidden={{}} placeholder="Compartilhe algo com a comunidade..." />
          </div>
        </div>

        {posts.map((post) => (
          <article key={post.id} className={`card p-5 ${post.pinned ? 'border-brand/40' : ''}`}>
            {post.pinned && <div className="mb-3 text-xs font-bold uppercase tracking-wider text-brand">📌 Fixado</div>}
            <div className="flex gap-3">
              <Avatar name={post.author?.full_name} url={post.author?.avatar_url} size={40} />
              <div className="min-w-0 flex-1">
                <AuthorLine author={post.author} date={post.created_at} />
                <p className="mt-2 whitespace-pre-line">{post.body}</p>
                <div className="mt-3 flex gap-4 text-xs text-mute">
                  {viewer.isAdmin && (
                    <form action={togglePin}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="pinned" value={String(post.pinned)} />
                      <button className="hover:text-white">{post.pinned ? 'Desafixar' : 'Fixar'}</button>
                    </form>
                  )}
                  {(post.user_id === viewer.id || viewer.isAdmin) && (
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button className="hover:text-danger">Excluir</button>
                    </form>
                  )}
                </div>

                {post.comments.length > 0 && (
                  <ul className="mt-4 space-y-3 border-l border-line pl-4">
                    {post.comments.map((c) => (
                      <li key={c.id} className="flex gap-2.5">
                        <Avatar name={c.author?.full_name} url={c.author?.avatar_url} size={28} />
                        <div className="min-w-0 flex-1">
                          <AuthorLine author={c.author} date={c.created_at} />
                          <p className="mt-0.5 whitespace-pre-line text-sm text-soft">{c.body}</p>
                          {(c.user_id === viewer.id || viewer.isAdmin) && (
                            <form action={deletePostComment}>
                              <input type="hidden" name="id" value={c.id} />
                              <button className="text-[11px] text-mute hover:text-danger">Excluir</button>
                            </form>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4">
                  <CommentForm action={addPostComment} hidden={{ post_id: post.id }} placeholder="Responder..." submitLabel="Responder" rows={1} />
                </div>
              </div>
            </div>
          </article>
        ))}
        {posts.length === 0 && <div className="card p-8 text-center text-mute">Seja o primeiro a publicar!</div>}
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          <h2 className="font-bold">Regras da comunidade</h2>
          <ul className="mt-3 space-y-2 text-sm text-soft">
            <li>✅ Respeito sempre</li>
            <li>✅ Compartilhe o que você aprendeu</li>
            <li>✅ Mostre seus sites e peça feedback</li>
            <li>🚫 Sem spam ou venda de outros cursos</li>
          </ul>
        </div>
        <a href={settings.whatsapp_group_url} target="_blank" rel="noopener noreferrer" className="card block p-5 transition hover:border-brand/50">
          <h2 className="font-bold">Grupo do WhatsApp</h2>
          <p className="mt-1 text-sm text-mute">Avisos de aulas novas e lives.</p>
        </a>
      </aside>
    </div>
  );
}
