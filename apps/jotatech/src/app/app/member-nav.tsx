'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MemberNavProps {
  isAdmin: boolean;
}

export function MemberNav({ isAdmin }: MemberNavProps) {
  const path = usePathname();
  const items = [
    { href: '/app', label: 'Início', active: path === '/app' || path.startsWith('/app/curso') || path.startsWith('/app/aula') },
    { href: '/app/comunidade', label: 'Comunidade', active: path.startsWith('/app/comunidade') },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', active: false }] : []),
  ];
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-lg px-3 py-2 font-medium transition ${item.active ? 'bg-white/10 text-white' : 'text-mute hover:text-white'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
