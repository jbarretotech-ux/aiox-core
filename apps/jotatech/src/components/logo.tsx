import Link from 'next/link';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 28, md: 34, lg: 44 } as const;

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="jt-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#19e68c" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#07080c" />
      <rect x="3" y="3" width="58" height="58" rx="14" fill="none" stroke="url(#jt-g)" strokeWidth="3" />
      <path d="M36 16v22a10 10 0 0 1-10 10h-4" fill="none" stroke="url(#jt-g)" strokeWidth="7" strokeLinecap="round" />
      <path d="M26 16h18" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ href = '/', size = 'md' }: LogoProps) {
  const px = SIZES[size];
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="JOTATECH — início">
      <LogoMark size={px} />
      <span className="font-display font-extrabold tracking-wide" style={{ fontSize: px * 0.6 }}>
        JOTA<span className="text-brand">TECH</span>
      </span>
    </Link>
  );
}
