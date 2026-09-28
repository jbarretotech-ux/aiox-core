import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import { DemoBanner } from '@/components/demo-banner';
import { Logo } from '@/components/logo';
import { MemberNav } from '@/app/app/member-nav';
import { requireMember } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireMember();
  return (
    <div className="min-h-dvh">
      <DemoBanner />
      <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-4">
            <Logo href="/app" size="sm" />
            <div className="hidden sm:block">
              <MemberNav isAdmin={viewer.isAdmin} />
            </div>
          </div>
          <Link href="/app/perfil" className="flex items-center gap-2 rounded-full py-1 pl-3 pr-1 hover:bg-white/5">
            <span className="hidden text-sm text-soft md:inline">{viewer.profile.full_name}</span>
            <Avatar name={viewer.profile.full_name} url={viewer.profile.avatar_url} size={32} />
          </Link>
        </div>
        <div className="border-t border-line/60 px-2 py-1 sm:hidden">
          <MemberNav isAdmin={viewer.isAdmin} />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
