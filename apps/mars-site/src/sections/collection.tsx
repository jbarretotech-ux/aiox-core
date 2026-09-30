import { BgVideo } from '@/components/bg-video';
import { MEDIA } from '@/media';

const CARDS = [
  { src: MEDIA.nft[0], label: 'Automação com IA', title: 'Atendimento 24h' },
  { src: MEDIA.nft[1], label: 'Marketing', title: 'Tráfego que vende' },
  { src: MEDIA.nft[2], label: 'Tecnologia', title: 'Sites e sistemas' },
] as const;

interface ServiceCardProps {
  src: string;
  label: string;
  title: string;
}

function ServiceCard({ src, label, title }: ServiceCardProps) {
  return (
    <article className="liquid-glass rounded-[32px] p-[18px] transition-colors hover:bg-white/10">
      <div className="relative overflow-hidden rounded-[24px] pb-[100%]">
        <BgVideo src={src} className="absolute inset-0 h-full w-full object-cover" />

        <div className="liquid-glass absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[20px] px-5 py-4">
          <div className="flex flex-col gap-1">
            <span className="font-grotesk text-[11px] uppercase text-cream/70">{label}:</span>
            <span className="font-grotesk text-[16px] uppercase">{title}</span>
          </div>
          <a
            href="#contato"
            aria-label={`Quero ${title.toLowerCase()}`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] shadow-lg shadow-purple-500/50 transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Collection() {
  return (
    <section id="servicos" className="bg-background">
      <div className="mx-auto max-w-[1831px] px-5 py-16 sm:px-8 md:px-12 md:py-20 lg:px-16 lg:py-24">
        <div className="mb-12 flex flex-col gap-10 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="font-grotesk text-[32px] uppercase leading-[1.05] sm:text-[44px] md:text-[52px] lg:text-[60px]">
            Soluções que
            <br />
            <span className="ml-12 inline-flex items-baseline gap-3 md:ml-24 lg:ml-32">
              <span className="font-condiment normal-case text-neon">vendem</span>
              <span>por você</span>
            </span>
          </h2>

          <a href="#contato" className="group inline-flex w-fit flex-col">
            <span className="flex items-center gap-3 font-grotesk uppercase leading-none">
              <span className="text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px]">Quero</span>
              <span className="flex flex-col text-[20px] leading-[1] sm:text-[26px] md:text-[30px] lg:text-[36px]">
                <span>Vender</span>
                <span>Mais</span>
              </span>
            </span>
            <span className="mt-2 block h-[6px] w-full bg-neon transition-opacity group-hover:opacity-80 md:h-[8px] lg:h-[10px]" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <ServiceCard key={card.src} src={card.src} label={card.label} title={card.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
