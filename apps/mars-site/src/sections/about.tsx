import { BgVideo } from '@/components/bg-video';
import { MEDIA } from '@/media';

const INTRO = 'A digital object fixed beyond time and place. An exploration of distance, form, and silence in space';

function FadedCopy() {
  return (
    <div className="max-w-[266px] space-y-4 font-mono text-[14px] uppercase text-[#010828] opacity-10 md:text-[16px] lg:text-cream">
      <p>{INTRO}</p>
      <p>{INTRO}</p>
    </div>
  );
}

export function About() {
  return (
    <section id="gallery" className="relative min-h-screen overflow-hidden">
      <BgVideo src={MEDIA.about} className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative mx-auto flex min-h-screen max-w-[1831px] flex-col justify-between gap-16 px-5 py-16 sm:px-8 md:px-12 md:py-20 lg:px-16 lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="relative w-fit">
            <h2 className="font-grotesk text-[32px] uppercase leading-[1.05] sm:text-[44px] md:text-[52px] lg:text-[60px]">
              Hello!
              <br />
              I&apos;m Mars
            </h2>
            <span className="pointer-events-none absolute -bottom-7 -right-16 -rotate-2 font-condiment text-[36px] normal-case text-neon mix-blend-exclusion sm:-right-20 sm:text-[48px] md:text-[58px] lg:-bottom-9 lg:-right-24 lg:text-[68px]">
              Mars
            </span>
          </div>

          <p className="max-w-[266px] font-mono text-[14px] uppercase text-cream md:text-[16px]">{INTRO}</p>
        </div>

        <div className="flex flex-row justify-between">
          <FadedCopy />
          <div className="hidden lg:block">
            <FadedCopy />
          </div>
        </div>
      </div>
    </section>
  );
}
