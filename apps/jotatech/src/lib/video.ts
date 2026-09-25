export type VideoSource =
  | { kind: 'iframe'; src: string }
  | { kind: 'file'; src: string }
  | { kind: 'none' };

/**
 * Converte o link colado no admin em algo que o player entende.
 * Suporta YouTube, Vimeo, Panda Video, Bunny Stream, Google Drive e arquivos diretos (.mp4/.webm).
 */
export function resolveVideo(url: string | null | undefined): VideoSource {
  if (!url || !url.trim()) return { kind: 'none' };
  const raw = url.trim();
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { kind: 'none' };
  }
  const host = parsed.hostname.replace(/^www\./, '');

  if (host === 'youtu.be') {
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}?rel=0&modestbranding=1` };
  }
  if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    const id =
      parsed.searchParams.get('v') ??
      parsed.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ??
      null;
    if (id) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` };
  }
  if (host === 'vimeo.com') {
    const [id, hash] = parsed.pathname.split('/').filter(Boolean);
    if (id && /^\d+$/.test(id)) {
      return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}` };
    }
  }
  if (host === 'player.vimeo.com') return { kind: 'iframe', src: raw };
  if (host === 'drive.google.com') {
    const id = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
    if (id) return { kind: 'iframe', src: `https://drive.google.com/file/d/${id}/preview` };
  }
  if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(parsed.pathname)) return { kind: 'file', src: raw };
  // Panda Video, Bunny Stream e outros players já vêm como link de embed
  return { kind: 'iframe', src: raw };
}
