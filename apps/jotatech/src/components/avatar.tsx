import { initials } from '@/lib/format';

interface AvatarProps {
  name: string | null | undefined;
  url?: string | null;
  size?: number;
}

export function Avatar({ name, url, size = 36 }: AvatarProps) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={name ?? ''} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand/70 to-brand-2/70 font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  );
}
