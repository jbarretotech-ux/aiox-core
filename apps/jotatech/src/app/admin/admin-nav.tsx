'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: 'Painel', icon: '📊' },
  { href: '/admin/cursos', label: 'Cursos e aulas', icon: '🎬' },
  { href: '/admin/membros', label: 'Membros', icon: '👥' },
  { href: '/admin/codigos', label: 'Códigos de acesso', icon: '🔑' },
  { href: '/admin/configuracoes', label: 'Site e textos', icon: '⚙️' },
  { href: '/app/comunidade', label: 'Moderar comunidade', icon: '💬' },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {ITEMS.map((item) => {
        const active = item.href === '/admin' ? path === '/admin' : path.startsWith(item.href) || (item.href === '/admin/cursos' && path.startsWith('/admin/aulas'));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? 'bg-brand/10 text-brand' : 'text-soft hover:bg-white/5 hover:text-white'
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
