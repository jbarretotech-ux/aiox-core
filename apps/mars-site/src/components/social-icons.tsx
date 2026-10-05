import { Github, Mail, Twitter } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SOCIAL_LINKS } from '@/media';

export interface SocialItem {
  label: string;
  href: string;
  Icon: LucideIcon;
}

export const SOCIAL_ITEMS: readonly SocialItem[] = [
  { label: 'Mail', href: SOCIAL_LINKS.mail, Icon: Mail },
  { label: 'Twitter', href: SOCIAL_LINKS.twitter, Icon: Twitter },
  { label: 'Github', href: SOCIAL_LINKS.github, Icon: Github },
];

interface SocialIconsProps {
  className?: string;
}

/** 3 botões quadrados 56x56 com liquid glass. */
export function SocialIcons({ className = '' }: SocialIconsProps) {
  return (
    <div className={className}>
      {SOCIAL_ITEMS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          className="liquid-glass flex h-14 w-14 items-center justify-center rounded-[1rem] text-cream transition-colors hover:bg-white/10"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
