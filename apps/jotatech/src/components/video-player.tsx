import { LockIcon } from '@/components/icons';
import { resolveVideo } from '@/lib/video';

interface VideoPlayerProps {
  url: string | null;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const source = resolveVideo(url);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black">
      {source.kind === 'iframe' && (
        <iframe
          src={source.src}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
      {source.kind === 'file' && (
        <video src={source.src} controls controlsList="nodownload" className="absolute inset-0 h-full w-full" preload="metadata">
          <track kind="captions" />
        </video>
      )}
      {source.kind === 'none' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-panel-2 to-ink text-center">
          <LockIcon className="h-8 w-8 text-mute" />
          <p className="font-semibold">Vídeo em breve</p>
          <p className="max-w-xs text-sm text-mute">Esta aula ainda não tem vídeo cadastrado.</p>
        </div>
      )}
    </div>
  );
}
