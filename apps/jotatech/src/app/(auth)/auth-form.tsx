'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import type { ActionResult } from '@/lib/types';

interface AuthFormProps {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  children: React.ReactNode;
}

export function AuthForm({ action, submitLabel, children }: AuthFormProps) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className="space-y-4">
      {children}
      {state?.message && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${state.ok ? 'bg-brand/10 text-brand' : 'bg-danger/10 text-danger'}`}
        >
          {state.message}
        </p>
      )}
      <SubmitButton className="btn btn-primary w-full" pendingText="Aguarde...">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
