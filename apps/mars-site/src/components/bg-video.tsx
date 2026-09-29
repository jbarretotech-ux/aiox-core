interface BgVideoProps {
  /** Caminho sem extensão: usa `${src}.mp4` e `${src}.jpg` como poster. */
  src: string;
  className?: string;
}

export function BgVideo({ src, className = '' }: BgVideoProps) {
  return (
    <video
      className={className}
      src={`${src}.mp4`}
      poster={`${src}.jpg`}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
