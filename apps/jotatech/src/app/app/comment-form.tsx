'use client';

import { useActionState, useEffect, useRef } from 'react';
import { SubmitButton } from '@/components/submit-button';
import type { ActionResult } from '@/lib/types';

interface CommentFormProps {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  hidden: Record<string, string>;
  placeholder: string;
  submitLabel?: string;
  rows?: number;
}

export function CommentForm({ action, hidden, placeholder, submitLabel = 'Publicar', rows = 3 }: CommentFormProps) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={formAction} className="space-y-2">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <textarea name="body" rows={rows} required placeholder={placeholder} className="input resize-y" />
      <div className="flex items-center justify-between gap-3">
        <span className={`text-sm ${state?.ok ? 'text-brand' : 'text-danger'}`}>{state?.message}</span>
        <SubmitButton className="btn btn-primary !py-2" pendingText="Enviando...">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
