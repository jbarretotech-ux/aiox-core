import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminNav } from '@/app/admin/admin-nav';
import { DemoBanner } from '@/components/demo-banner';
import { Logo } from '@/components/logo';
import { requireAdmin } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-dvh">
      <DemoBanner />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-4 lg:h-fit">
          <div className="flex items-center justify-between lg:block">
            <Logo href="/admin" size="sm" />
            <span className="rounded bg-brand-2/20 px-2 py-0.5 text-[10px] font-bold uppercase text-white lg:mt-2 lg:inline-block">Admin</span>
          </div>
          <div className="mt-4">
            <AdminNav />
          </div>
          <Link href="/app" className="btn btn-ghost mt-4 hidden w-full text-sm lg:flex">Ver área de membros →</Link>
        </aside>
        <main className="min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
}
