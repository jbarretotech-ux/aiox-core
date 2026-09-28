import { isSupabaseConfigured } from '@/lib/env';

export function DemoBanner() {
  if (isSupabaseConfigured()) return null;
  return (
    <div className="bg-brand-2/20 px-4 py-2 text-center text-xs text-white">
      <strong>MODO DEMO</strong> — conecte o Supabase (veja o README) para ativar login, cadastro e o painel administrativo.
    </div>
  );
}
