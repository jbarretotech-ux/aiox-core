import { BgVideo } from '@/components/bg-video';
import { SOCIAL_ITEMS } from '@/components/social-icons';
import { MEDIA } from '@/media';

export function Cta() {
  return (
    <section id="contato" className="relative overflow-hidden">
      <BgVideo src={MEDIA.cta} className="block h-auto w-full" />

      <div id="resultados" className="absolute inset-0 flex items-center justify-end px-5 sm:px-8 lg:pl-[15%] lg:pr-[20%]">
        <div className="relative">
          <span className="pointer-events-none absolute -left-2 -top-5 -rotate-2 font-condiment text-[17px] normal-case text-neon mix-blend-exclusion sm:-top-9 sm:text-[28px] md:-top-12 md:text-[44px] lg:-left-10 lg:-top-[4.5rem] lg:text-[68px]">
            Próximo nível
          </span>
          <h2 className="font-grotesk text-[16px] uppercase leading-[1.1] sm:text-[28px] md:text-[40px] lg:text-[60px]">
            <span className="mb-4 block sm:mb-6 md:mb-8 lg:mb-12">Fale com a Mars.</span>
            <span className="block">Automatize processos.</span>
            <span className="block">Venda todos os dias.</span>
            <span className="block">Cresça com IA.</span>
          </h2>
        </div>
      </div>

      <div className="liquid-glass absolute bottom-[12%] left-[8%] flex flex-col rounded-[0.5rem] sm:bottom-[15%] sm:rounded-[0.75rem] md:bottom-[18%] md:rounded-[1rem] lg:bottom-[20%] lg:rounded-[1.25rem]">
        {SOCIAL_ITEMS.map(({ label, href, Icon }, index) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className={`flex h-[8vw] w-[14vw] items-center justify-center text-cream transition-colors hover:bg-white/10 sm:h-[4.5rem] sm:w-[14.375rem] md:h-[3.5rem] md:w-[10.78125rem] lg:h-[5.5rem] lg:w-[16.77rem] ${
              index < SOCIAL_ITEMS.length - 1 ? 'border-b border-white/10' : ''
            }`}
          >
            <Icon className="h-3 w-3 sm:h-5 sm:w-5" />
          </a>
        ))}
      </div>
    </section>
  );
}
