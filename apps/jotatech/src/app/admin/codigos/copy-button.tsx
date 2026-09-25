'use client';

import { useState } from 'react';

export function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="rounded bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? 'Copiado!' : label}
    </button>
  );
}
