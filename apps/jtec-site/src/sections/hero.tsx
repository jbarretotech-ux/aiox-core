import { BgVideo } from '@/components/bg-video';
import { SocialIcons } from '@/components/social-icons';
import { MEDIA } from '@/media';

const NAV_LINKS = ['Homepage', 'Gallery', 'Buy NFT', 'FAQ', 'Contact'] as const;

export function Hero() {
  return (
    <section id="homepage" className="relative min-h-screen overflow-hidden rounded-b-[32px]">
      <BgVideo src={MEDIA.hero} className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative mx-auto flex min-h-screen max-w-[1831px] flex-col px-5 pb-16 pt-6 sm:px-8 md:px-12 lg:px-16 lg:pt-10">
        <header className="relative flex items-center justify-between lg:justify-start">
          <a href="#homepage" className="font-grotesk text-[16px] uppercase tracking-wide">
            JTEC
          </a>

          <nav className="liquid-glass absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-[28px] px-[52px] py-[24px] lg:block">
            <ul className="flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="font-grotesk text-[13px] uppercase transition-colors hover:text-neon"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <SocialIcons className="absolute right-5 top-28 hidden flex-col gap-3 sm:right-8 md:right-12 lg:right-16 lg:flex" />

        <div className="flex flex-1 flex-col justify-center pt-16 lg:pt-0">
          <div className="relative w-fit lg:ml-32 lg:max-w-[780px]">
            <h1 className="font-grotesk text-[40px] uppercase leading-[1.05] sm:text-[60px] sm:leading-[1] md:text-[75px] lg:text-[90px]">
              Beyond earth
              <br />
              and ( its ) familiar boundaries
            </h1>
            <span className="pointer-events-none absolute -bottom-6 right-0 -rotate-1 font-condiment text-[24px] normal-case text-neon opacity-90 mix-blend-exclusion sm:-bottom-8 sm:text-[32px] md:text-[40px] lg:-right-10 lg:text-[48px]">
              Nft collection
            </span>
          </div>

          <SocialIcons className="mt-16 flex justify-center gap-3 lg:hidden" />
        </div>
      </div>
    </section>
  );
}
