import { BgVideo } from '@/components/bg-video';
import { SocialIcons } from '@/components/social-icons';
import { MEDIA } from '@/media';

const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Contato', href: '#contato' },
] as const;

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden rounded-b-[32px]">
      <BgVideo src={MEDIA.hero} className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative mx-auto flex min-h-screen max-w-[1831px] flex-col px-5 pb-16 pt-6 sm:px-8 md:px-12 lg:px-16 lg:pt-10">
        <header className="relative flex items-center justify-between lg:justify-start">
          <a href="#inicio" aria-label="MARS — página inicial" className="block shrink-0">
            <img src="/mars-logo.png" alt="MARS" width={1498} height={300} className="h-6 w-auto sm:h-7 lg:h-8" />
          </a>

          <nav className="liquid-glass absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-[28px] px-[52px] py-[24px] lg:block">
            <ul className="flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-grotesk text-[13px] uppercase transition-colors hover:text-neon"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <SocialIcons className="absolute right-5 top-28 hidden flex-col gap-3 sm:right-8 md:right-12 lg:right-16 lg:flex" />

        <div className="flex flex-1 flex-col justify-center pt-16 lg:pt-0">
          <div className="relative w-fit lg:ml-32 lg:max-w-[960px]">
            <h1 className="font-grotesk text-[40px] uppercase leading-[1.05] sm:text-[60px] sm:leading-[1] md:text-[75px] lg:text-[90px]">
              Automatize tudo
              <br />
              e ( venda ) muito mais
            </h1>
            <span className="pointer-events-none absolute -bottom-6 right-0 -rotate-1 font-condiment text-[24px] normal-case text-neon opacity-90 mix-blend-exclusion sm:-bottom-10 sm:text-[32px] md:text-[40px] lg:-bottom-14 lg:-right-10 lg:text-[48px]">
              Agência de IA
            </span>
          </div>

          <SocialIcons className="mt-16 flex justify-center gap-3 lg:hidden" />
        </div>
      </div>
    </section>
  );
}
