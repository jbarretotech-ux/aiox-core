'use client';

import { useRef, useState } from 'react';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/client';

interface VideoUploaderProps {
  name: string;
  defaultValue?: string | null;
}

type Mode = 'upload' | 'link';

/** Limite por arquivo do plano grátis do Supabase Storage. */
const MAX_MB = 50;

/**
 * Área de envio do vídeo da aula: arrastar/selecionar arquivo (com barra de progresso)
 * ou colar link do YouTube/Vimeo/Panda. Ao terminar o envio, salva a aula sozinho.
 */
export function VideoUploader({ name, defaultValue }: VideoUploaderProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [mode, setMode] = useState<Mode>('upload');
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const enabled = isSupabaseConfigured();

  function saveForm() {
    // Espera o React aplicar o novo valor no input antes de enviar o formulário
    setTimeout(() => hiddenRef.current?.form?.requestSubmit(), 50);
  }

  async function upload(file: File) {
    if (!file.type.startsWith('video/')) {
      setStatus({ ok: false, text: 'Esse arquivo não é um vídeo. Use MP4, MOV ou WEBM.' });
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      const mb = Math.round(file.size / 1024 / 1024);
      setStatus({
        ok: false,
        text: `Vídeo com ${mb}MB — o plano grátis aceita até ${MAX_MB}MB por arquivo. Para aulas longas, suba no YouTube como "Não listado" e cole o link na aba "Colar link".`,
      });
      return;
    }

    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('sessão expirada, faça login de novo');

      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
      const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      setStatus(null);
      setProgress(0);

      // XHR (em vez do SDK) para mostrar a porcentagem do envio
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/media/${path}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.setRequestHeader('cache-control', 'max-age=31536000');
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            let message = `erro ${xhr.status}`;
            try {
              message = (JSON.parse(xhr.responseText) as { message?: string }).message ?? message;
            } catch {
              // resposta sem JSON
            }
            reject(new Error(message));
          }
        };
        xhr.onerror = () => reject(new Error('falha de conexão'));
        xhr.send(file);
      });

      const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
      setValue(url);
      setProgress(null);
      setStatus({ ok: true, text: 'Vídeo enviado! Salvando a aula...' });
      saveForm();
    } catch (error) {
      console.error('[jotatech] Failed to upload lesson video', { error });
      setProgress(null);
      setStatus({ ok: false, text: `Não foi possível enviar: ${error instanceof Error ? error.message : 'erro desconhecido'}` });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const uploading = progress !== null;

  return (
    <div className="min-w-0 rounded-2xl border border-brand/30 bg-brand/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">🎬 Vídeo da aula</h2>
        <div className="flex rounded-lg bg-panel-2 p-1 text-sm">
          {(
            [
              ['upload', 'Enviar do computador'],
              ['link', 'Colar link (YouTube, Vimeo…)'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`rounded-md px-3 py-1.5 font-semibold transition ${mode === key ? 'bg-brand text-ink' : 'text-soft hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <input ref={hiddenRef} type="hidden" name={name} value={value} />

      {mode === 'upload' ? (
        <div
          role="button"
          tabIndex={0}
          aria-disabled={!enabled || uploading}
          onClick={() => enabled && !uploading && fileRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && enabled && !uploading) fileRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && enabled && !uploading) void upload(file);
          }}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragging ? 'border-brand bg-brand/10' : 'border-line hover:border-brand/60 hover:bg-white/5'
          } ${!enabled || uploading ? 'cursor-not-allowed opacity-80' : ''}`}
        >
          {uploading ? (
            <div className="w-full max-w-sm">
              <p className="font-semibold">Enviando vídeo... {progress}%</p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-mute">Não feche esta página até terminar.</p>
            </div>
          ) : (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-ink">⬆</span>
              <p className="mt-3 text-lg font-bold">Clique aqui ou arraste o vídeo da aula</p>
              <p className="mt-1 text-sm text-mute">MP4, MOV ou WEBM · até {MAX_MB}MB por vídeo (plano grátis)</p>
              {!enabled && <p className="mt-2 text-xs text-danger">Disponível após conectar o Supabase.</p>}
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://youtu.be/... ou https://vimeo.com/..."
            className="input"
          />
          <p className="text-xs text-mute">
            Aula longa? Suba no YouTube como <strong>Não listado</strong> (grátis e sem limite de tamanho), copie o link e cole
            aqui. Depois clique em <strong>Salvar aula</strong>.
          </p>
        </div>
      )}

      {status && <p className={`mt-3 text-sm ${status.ok ? 'text-brand' : 'text-danger'}`}>{status.text}</p>}
      {value && !uploading && (
        <p className="mt-3 break-all text-xs text-mute">
          Vídeo atual: <span className="text-soft">{value}</span>
        </p>
      )}
    </div>
  );
}
