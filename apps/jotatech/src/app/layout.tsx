import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { SITE_URL } from '@/lib/env';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['600', '700', '800'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'JOTATECH — Crie sites com IA e ganhe renda extra', template: '%s | JOTATECH' },
  description:
    'Comunidade para aprender a criar sites com Claude Code, hospedar de graça na GitHub e Vercel e vender para negócios locais.',
  openGraph: {
    title: 'JOTATECH — Crie sites com IA e ganhe renda extra',
    description: 'Aprenda a criar e vender sites para negócios locais sem pagar hospedagem.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
