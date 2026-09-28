import type { Metadata } from 'next';
import { signOut } from '@/app/app/actions';
import { ProfileForm } from '@/app/app/perfil/profile-form';
import { Avatar } from '@/components/avatar';
import { requireMember } from '@/lib/data';

export const metadata: Metadata = { title: 'Meu perfil' };

export default async function ProfilePage() {
  const viewer = await requireMember();
  const p = viewer.profile;
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="flex items-center gap-4">
        <Avatar name={p.full_name} url={p.avatar_url} size={64} />
        <div>
          <h1 className="font-display text-2xl font-bold">{p.full_name}</h1>
          <p className="text-sm text-mute">{p.email}</p>
        </div>
      </div>
      <div className="card mt-8 p-6">
        <ProfileForm profile={p} />
      </div>
      <form action={signOut} className="mt-6">
        <button className="btn btn-danger w-full">Sair da conta</button>
      </form>
    </div>
  );
}
