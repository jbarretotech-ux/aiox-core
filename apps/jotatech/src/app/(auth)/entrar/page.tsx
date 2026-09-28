import type { Metadata } from 'next';
import Link from 'next/link';
import { signIn } from '@/app/(auth)/actions';
import { AuthForm } from '@/app/(auth)/auth-form';
import { isSupabaseConfigured } from '@/lib/env';

export const metadata: Metadata = { title: 'Entrar' };

const ERRORS: Record<string, string> = {
  bloqueado: 'Seu acesso está bloqueado. Fale com o suporte no grupo do WhatsApp.',
  link: 'O link expirou ou é inválido. Tente novamente.',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ volta?: string; erro?: string }> }) {
  const { volta, erro } = await searchParams;
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Entrar na comunidade</h1>
      <p className="mt-1 text-sm text-mute">Acesse suas aulas e a comunidade JOTATECH.</p>
      {erro && ERRORS[erro] && <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{ERRORS[erro]}</p>}
      <div className="mt-6">
        <AuthForm action={signIn} submitLabel="Entrar">
          <input type="hidden" name="volta" value={volta ?? '/app'} />
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="input" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label" htmlFor="password">Senha</label>
              <Link href="/recuperar-senha" className="mb-1 text-xs text-brand hover:underline">Esqueci a senha</Link>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
          </div>
        </AuthForm>
      </div>
      {!isSupabaseConfigured() && (
        <Link href="/app" className="btn btn-ghost mt-3 w-full">Ver demo da área de membros</Link>
      )}
      <p className="mt-6 text-center text-sm text-mute">
        Recebeu o código no grupo?{' '}
        <Link href="/cadastro" className="font-semibold text-brand hover:underline">Criar minha conta</Link>
      </p>
    </>
  );
}
