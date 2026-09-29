import { About } from '@/sections/about';
import { Collection } from '@/sections/collection';
import { Cta } from '@/sections/cta';
import { Hero } from '@/sections/hero';

export default function App() {
  return (
    <main className="relative bg-background font-grotesk uppercase text-cream">
      <Hero />
      <About />
      <Collection />
      <Cta />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 bg-cover bg-center opacity-60 mix-blend-lighten"
        style={{ backgroundImage: 'url(/texture.png)' }}
      />
    </main>
  );
}
