import Link from 'next/link';
import { Logo } from '@/components/logo';
import { WhatsAppIcon } from '@/components/icons';
import { getSettings } from '@/lib/data';

export const revalidate = 60;

const STEPS = [
  { n: '01', title: 'Entre no grupo do WhatsApp', text: 'Clique no botão e entre no grupo oficial da JOTATECH.' },
  { n: '02', title: 'Receba seu acesso', text: 'No grupo você recebe o código para liberar a área de membros.' },
  { n: '03', title: 'Assista e venda', text: 'Siga as aulas, crie seu primeiro site e ofereça para negócios da sua cidade.' },
];

const TRACKS = [
  { title: 'Sites com Claude Code', text: 'Crie sites profissionais pedindo para a IA, sem saber programar.', tag: 'Trilha 1' },
  { title: 'Hospedagem grátis', text: 'Publique na GitHub e na Vercel sem pagar hospedagem.', tag: 'Trilha 2' },
  { title: 'Vender para negócio local', text: 'Prospecção, preço, proposta e fechamento pelo WhatsApp.', tag: 'Trilha 3' },
  { title: 'Tráfego pago', text: 'Anúncios para atrair clientes para você e para eles.', tag: 'Em breve' },
  { title: 'Design que converte', text: 'Cores, fontes e layout que passam confiança.', tag: 'Em breve' },
];

const PRODUCTS = [
  { emoji: '💈', title: 'Site para negócio local', text: 'Barbearia, salão, pizzaria, oficina, clínica, loja do bairro.' },
  { emoji: '🔗', title: 'Link personalizado', text: 'Página de links para o Instagram e o WhatsApp do cliente.' },
  { emoji: '📋', title: 'Cardápio e catálogo digital', text: 'O cliente atualiza o preço e compartilha em segundos.' },
  { emoji: '🚀', title: 'Página de vendas', text: 'Para lançamentos, eventos e promoções.' },
];

const FAQ = [
  {
    q: 'Preciso saber programar?',
    a: 'Não. Você aprende a pedir para a inteligência artificial criar o site e a fazer os ajustes. As aulas mostram cada clique.',
  },
  {
    q: 'Vou precisar pagar hospedagem?',
    a: 'Não. Os sites ficam hospedados de graça na GitHub Pages ou na Vercel. O único custo opcional é o domínio (.com.br) do seu cliente.',
  },
  {
    q: 'Como recebo o acesso à comunidade?',
    a: 'Entrando no grupo do WhatsApp. Lá enviamos o código de acesso para você criar sua conta na área de membros.',
  },
  {
    q: 'Quanto posso cobrar por um site?',
    a: 'Mostramos como montar o preço, oferecer manutenção mensal e transformar clientes em renda recorrente.',
  },
];

export default async function LandingPage() {
  const s = await getSettings();
  const cta = s.whatsapp_group_url;

  return (
    <div className="overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo size="sm" />
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/entrar" className="whitespace-nowrap rounded-lg px-3 py-2 text-soft hover:text-white">
              Já sou membro
            </Link>
            <a href={cta} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden !py-2 sm:inline-flex">
              <WhatsAppIcon className="h-4 w-4" /> Entrar no grupo
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" /> Comunidade aberta · acesso pelo WhatsApp
            </span>
            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              {s.hero_title.split(' ').slice(0, -3).join(' ')}{' '}
              <span className="text-gradient">{s.hero_title.split(' ').slice(-3).join(' ')}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-soft">{s.hero_subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={cta} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-6 !py-4 text-base">
                <WhatsAppIcon className="h-5 w-5" /> Quero entrar no grupo grátis
              </a>
              <a href="#trilhas" className="btn btn-ghost !px-6 !py-4 text-base">
                Ver o que vou aprender
              </a>
            </div>
            <ul className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-center">
              {[
                ['R$ 0', 'de hospedagem'],
                ['0', 'linhas de código'],
                ['100%', 'online'],
              ].map(([big, small]) => (
                <li key={small} className="card px-2 py-3">
                  <div className="font-display text-xl font-extrabold text-brand">{big}</div>
                  <div className="text-xs text-mute">{small}</div>
                </li>
              ))}
            </ul>
          </div>

          <HeroMockup imageUrl={s.hero_image_url} />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-line/60 bg-panel/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-center text-3xl font-bold">Como funciona</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="card p-6">
                <div className="font-display text-3xl font-extrabold text-brand/80">{step.n}</div>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-1 text-soft">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ VAI VENDER */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand">Renda extra</p>
        <h2 className="font-display mt-2 text-center text-3xl font-bold sm:text-4xl">O que você vai aprender a vender</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div key={p.title} className="card p-6 transition hover:border-brand/50">
              <div className="text-3xl">{p.emoji}</div>
              <h3 className="mt-3 font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-soft">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRILHAS */}
      <section id="trilhas" className="relative border-y border-line/60 bg-panel/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-center text-3xl font-bold sm:text-4xl">Trilhas da comunidade</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-soft">
            Novas aulas entram toda semana. Você começa criando sites e evolui para hospedagem, vendas, tráfego e design.
          </p>
          <div className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2">
            {TRACKS.map((t, i) => (
              <div
                key={t.title}
                className="relative flex aspect-[3/4] w-56 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-line p-5"
                style={{
                  background: `linear-gradient(160deg, hsl(${150 + i * 35} 70% 22%), #0b0d14 70%)`,
                }}
              >
                <span className="absolute left-4 top-4 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white/90">
                  {t.tag}
                </span>
                <h3 className="font-display text-xl font-bold leading-tight">{t.title}</h3>
                <p className="mt-2 text-sm text-soft">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTOR */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-20 md:grid-cols-[280px_1fr]">
        <div className="mx-auto aspect-square w-60 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-brand/30 to-brand-2/30">
          {s.author_photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.author_photo_url} alt={s.author_name} className="h-full w-full object-cover" />
          ) : (
            <div className="font-display flex h-full items-center justify-center text-7xl font-extrabold text-white/80">
              {s.author_name.slice(0, 1)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Quem vai te ensinar</p>
          <h2 className="font-display mt-2 text-3xl font-bold">{s.author_name}</h2>
          <p className="mt-4 whitespace-pre-line text-lg text-soft">{s.author_bio}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line/60 bg-panel/40">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="font-display text-center text-3xl font-bold">Perguntas frequentes</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-5 open:border-brand/40">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {f.q}
                  <span className="text-brand transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-brand-2/20" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Seu primeiro cliente pode estar na sua rua.</h2>
          <p className="mt-4 text-lg text-soft">Entre no grupo agora e receba o acesso à comunidade.</p>
          <a href={cta} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 !px-8 !py-4 text-base">
            <WhatsAppIcon className="h-5 w-5" /> Entrar no grupo do WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-mute sm:flex-row">
          <Logo size="sm" />
          <div className="flex gap-4">
            {s.instagram_url && (
              <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </a>
            )}
            {s.youtube_url && (
              <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                YouTube
              </a>
            )}
            <Link href="/entrar" className="hover:text-white">
              Área de membros
            </Link>
          </div>
          <p>© {new Date().getFullYear()} {s.site_name}</p>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a
        href={cta}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Entrar no grupo do WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  );
}

function HeroMockup({ imageUrl }: { imageUrl: string | null }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="Prévia da comunidade JOTATECH" className="w-full rounded-2xl border border-line shadow-2xl" />
    );
  }
  return (
    <div className="relative" aria-hidden="true">
      <div className="card overflow-hidden shadow-2xl shadow-brand/10">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate rounded-md bg-panel-2 px-3 py-1 text-xs text-mute">barbeariadojoao.vercel.app</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="h-28 rounded-xl bg-gradient-to-br from-[#2a1d0f] to-[#0f1118] p-4">
            <div className="h-3 w-28 rounded bg-[#e0a458]" />
            <div className="mt-3 h-2 w-40 rounded bg-white/30" />
            <div className="mt-2 h-2 w-32 rounded bg-white/20" />
            <div className="mt-4 h-6 w-24 rounded-md bg-[#25D366]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-panel-2" />
            ))}
          </div>
        </div>
      </div>
      <div className="card absolute -bottom-6 -left-4 flex items-center gap-3 px-4 py-3 shadow-xl sm:-left-10">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand">✓</span>
        <div>
          <div className="text-sm font-bold">Site publicado</div>
          <div className="text-xs text-mute">Hospedagem: R$ 0,00</div>
        </div>
      </div>
      <div className="card absolute -right-3 -top-5 px-4 py-3 shadow-xl sm:-right-6">
        <div className="text-xs text-mute">Novo pedido</div>
        <div className="font-display font-bold text-brand">Pizzaria do bairro</div>
      </div>
    </div>
  );
}
