'use client';

import { useActionState, useEffect, useRef } from 'react';
import { SubmitButton } from '@/components/submit-button';
import type { ActionResult } from '@/lib/types';

interface AdminFormProps {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  className?: string;
}

export function AdminForm({ action, children, submitLabel = 'Salvar', resetOnSuccess = false, className = 'space-y-4' }: AdminFormProps) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        {state?.message && <span className={`text-sm ${state.ok ? 'text-brand' : 'text-danger'}`}>{state.message}</span>}
      </div>
    </form>
  );
}
