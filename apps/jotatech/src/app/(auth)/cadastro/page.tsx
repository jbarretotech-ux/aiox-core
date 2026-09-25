import type { Metadata } from 'next';
import Link from 'next/link';
import { signUp } from '@/app/(auth)/actions';
import { AuthForm } from '@/app/(auth)/auth-form';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = { title: 'Criar conta' };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ codigo?: string }> }) {
  const { codigo } = await searchParams;
  const settings = await getSettings();
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Criar minha conta</h1>
      <p className="mt-1 text-sm text-mute">Use o código de acesso que você recebeu no grupo do WhatsApp.</p>
      <div className="mt-6">
        <AuthForm action={signUp} submitLabel="Criar conta e acessar">
          <div>
            <label className="label" htmlFor="code">Código de acesso</label>
            <input id="code" name="code" required defaultValue={codigo ?? ''} placeholder="EX: JOTA2026" className="input font-mono uppercase tracking-widest" />
          </div>
          <div>
            <label className="label" htmlFor="full_name">Nome completo</label>
            <input id="full_name" name="full_name" autoComplete="name" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="whatsapp">WhatsApp</label>
            <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">Senha (mínimo 6 caracteres)</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required className="input" />
          </div>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm text-mute">
        Ainda não tem o código?{' '}
        <a href={settings.whatsapp_group_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">
          Entre no grupo
        </a>
        {' · '}
        <Link href="/entrar" className="font-semibold text-brand hover:underline">Já tenho conta</Link>
      </p>
    </>
  );
}
