/** Todos os vídeos/imagens são servidos pela própria Vercel (pasta public/media). */
export const MEDIA = {
  hero: '/media/hero',
  about: '/media/about',
  cta: '/media/cta',
  nft: ['/media/nft-1', '/media/nft-2', '/media/nft-3'],
} as const;

export const SOCIAL_LINKS = {
  mail: 'mailto:contato@jtec.com.br',
  twitter: 'https://x.com/',
  github: 'https://github.com/jbarretotech-ux',
} as const;
