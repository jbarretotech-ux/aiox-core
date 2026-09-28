'use client';

import { useRef, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/client';

interface UploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
  folder?: string;
  hint?: string;
  placeholder?: string;
}

const MAX_MB = 50;

/**
 * Campo de URL com botão de upload para o Supabase Storage (bucket "media").
 * O admin pode colar um link (YouTube, Vimeo, imagem externa) ou enviar um arquivo.
 */
export function UploadField({ name, label, defaultValue, accept = 'image/*', folder = 'uploads', hint, placeholder = 'https://...' }: UploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const enabled = isSupabaseConfigured();
  const isImage = accept.startsWith('image');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      setStatus(`Arquivo maior que ${MAX_MB}MB. Para vídeos longos use YouTube (não listado), Vimeo ou Panda Video e cole o link.`);
      return;
    }
    setBusy(true);
    setStatus('Enviando...');
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '31536000', upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      setValue(data.publicUrl);
      setStatus('Arquivo enviado! Clique em Salvar.');
    } catch (error) {
      console.error('[jotatech] Failed to upload file', { error });
      setStatus(`Falha no upload: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <div className="flex gap-2">
        <input id={name} name={name} value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} className="input" />
        <button
          type="button"
          className="btn btn-ghost shrink-0 !px-3 text-sm"
          disabled={!enabled || busy}
          onClick={() => fileRef.current?.click()}
          title={enabled ? 'Enviar arquivo' : 'Disponível após conectar o Supabase'}
        >
          {busy ? '...' : 'Enviar'}
        </button>
        <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={onFile} />
      </div>
      {hint && <p className="mt-1 text-xs text-mute">{hint}</p>}
      {status && <p className="mt-1 text-xs text-soft">{status}</p>}
      {isImage && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-24 rounded-lg border border-line object-cover" />
      )}
    </div>
  );
}
