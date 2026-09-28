import type { Metadata } from 'next';
import Link from 'next/link';
import { requestPasswordReset } from '@/app/(auth)/actions';
import { AuthForm } from '@/app/(auth)/auth-form';

export const metadata: Metadata = { title: 'Recuperar senha' };

export default function ResetPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Recuperar senha</h1>
      <p className="mt-1 text-sm text-mute">Enviaremos um link para você criar uma nova senha.</p>
      <div className="mt-6">
        <AuthForm action={requestPasswordReset} submitLabel="Enviar link">
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="input" />
          </div>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/entrar" className="font-semibold text-brand hover:underline">Voltar para o login</Link>
      </p>
    </>
  );
}
