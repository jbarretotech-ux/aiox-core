'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/app/actions';
import { SubmitButton } from '@/components/submit-button';
import type { Profile } from '@/lib/types';

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, null);
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="full_name">Nome</label>
        <input id="full_name" name="full_name" defaultValue={profile.full_name ?? ''} required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="whatsapp">WhatsApp</label>
        <input id="whatsapp" name="whatsapp" defaultValue={profile.whatsapp ?? ''} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="avatar_url">Foto (link da imagem)</label>
        <input id="avatar_url" name="avatar_url" type="url" defaultValue={profile.avatar_url ?? ''} placeholder="https://..." className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Nova senha (deixe em branco para manter)</label>
        <input id="password" name="password" type="password" autoComplete="new-password" className="input" />
      </div>
      {state?.message && <p className={`text-sm ${state.ok ? 'text-brand' : 'text-danger'}`}>{state.message}</p>}
      <SubmitButton>Salvar</SubmitButton>
    </form>
  );
}
