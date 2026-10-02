import type { ReactNode } from 'react';

export const metadata = {
  title: 'Sobra Grana',
  description: 'Seu assessor financeiro no WhatsApp por R$ 19,90/mês.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
