interface CoverProps {
  url: string | null;
  title: string;
  seed?: number;
  className?: string;
  children?: React.ReactNode;
}

/** Capa com imagem ou, sem imagem, um gradiente gerado a partir do título. */
export function Cover({ url, title, seed, className = '', children }: CoverProps) {
  const hue = seed ?? [...title].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 360;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={
        url
          ? undefined
          : { background: `linear-gradient(160deg, hsl(${hue} 70% 30%), hsl(${(hue + 60) % 360} 60% 12%) 60%, #0b0d14)` }
      }
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      {children}
    </div>
  );
}
