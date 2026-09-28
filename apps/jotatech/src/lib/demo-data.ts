import type { AccessCode, Course, Lesson, Module, Post, Profile, Settings } from '@/lib/types';

/**
 * Conteúdo usado quando o Supabase ainda não foi configurado (MODO DEMO).
 * Serve para visualizar o layout antes de conectar o banco.
 */
export const DEMO_SETTINGS: Settings = {
  site_name: 'JOTATECH',
  tagline: 'Crie sites com IA e transforme em renda extra',
  whatsapp_group_url: 'https://chat.whatsapp.com/SEU-GRUPO',
  support_whatsapp: '',
  hero_title: 'Aprenda a criar e vender sites sem pagar hospedagem',
  hero_subtitle:
    'Com o Claude Code você cria sites profissionais para negócios locais e hospeda de graça na GitHub e na Vercel. Entre na comunidade e comece hoje.',
  hero_image_url: null,
  members_welcome: 'Bem-vindo(a) à comunidade JOTATECH! Comece pela trilha 1.',
  members_banner_url: null,
  instagram_url: '',
  youtube_url: '',
  author_name: 'Jota',
  author_bio:
    'Criador da JOTATECH. Ensino pessoas comuns a criarem sites com inteligência artificial e transformarem isso em renda extra atendendo negócios da própria cidade.',
  author_photo_url: null,
};

export const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  email: 'demo@jotatech.com',
  full_name: 'Visitante Demo',
  avatar_url: null,
  whatsapp: null,
  role: 'admin',
  status: 'active',
  access_code: 'DEMO',
  created_at: '2026-09-01T12:00:00.000Z',
};

interface ModuleSeed {
  title: string;
  lessons: string[];
}

interface CourseSeed {
  slug: string;
  title: string;
  description: string;
  modules: ModuleSeed[];
}

const SEED: CourseSeed[] = [
  {
    slug: 'sites-que-vendem',
    title: 'Sites que Vendem com Claude Code',
    description: 'Do zero ao primeiro site profissional feito com IA, sem saber programar.',
    modules: [
      { title: 'Boas-vindas', lessons: ['Como funciona a comunidade', 'O mapa da renda extra com sites', 'Instalando o Claude Code'] },
      { title: 'Seu primeiro site', lessons: ['Escrevendo o pedido perfeito para a IA', 'Site de barbearia em 20 minutos', 'Ajustando cores, fotos e textos'] },
      { title: 'Link personalizado (link na bio)', lessons: ['O que é e por que vende', 'Criando seu link na bio', 'Colocando no Instagram e no WhatsApp'] },
    ],
  },
  {
    slug: 'hospedagem-gratis',
    title: 'Hospedagem Grátis: GitHub e Vercel',
    description: 'Coloque seus sites no ar sem pagar hospedagem nem plano.',
    modules: [
      { title: 'GitHub Pages', lessons: ['Criando sua conta no GitHub', 'Publicando o site no GitHub Pages'] },
      { title: 'Vercel', lessons: ['Conectando o GitHub na Vercel', 'Domínio próprio do cliente'] },
    ],
  },
  {
    slug: 'vender-para-negocio-local',
    title: 'Como Vender Sites para Negócios Locais',
    description: 'Prospecção, preço, proposta e fechamento pelo WhatsApp.',
    modules: [
      { title: 'Encontrando clientes', lessons: ['Onde estão os clientes', 'Abordagem no WhatsApp que funciona'] },
      { title: 'Preço e fechamento', lessons: ['Quanto cobrar por um site', 'Proposta e contrato simples', 'Manutenção mensal: renda recorrente'] },
    ],
  },
  {
    slug: 'trafego-pago',
    title: 'Tráfego Pago para Iniciantes',
    description: 'Anúncios no Instagram e Google para você e para seus clientes.',
    modules: [{ title: 'Primeiros anúncios', lessons: ['Gerenciador de anúncios', 'Sua primeira campanha'] }],
  },
  {
    slug: 'design-que-converte',
    title: 'Design que Converte',
    description: 'Cores, fontes e layout que fazem o cliente confiar e comprar.',
    modules: [{ title: 'Fundamentos', lessons: ['Cores e fontes', 'Layout de página que vende'] }],
  },
];

function buildDemoCourses(): Course[] {
  return SEED.map((c, ci) => {
    const courseId = `demo-course-${ci + 1}`;
    const modules: Module[] = c.modules.map((m, mi) => {
      const moduleId = `${courseId}-m${mi + 1}`;
      const lessons: Lesson[] = m.lessons.map((title, li) => ({
        id: `${moduleId}-l${li + 1}`,
        module_id: moduleId,
        title,
        description: 'Aula de demonstração. Configure o Supabase e cadastre suas aulas no painel administrativo.',
        video_url: null,
        duration_minutes: 8 + ((ci + mi + li) % 5) * 3,
        materials: [],
        position: li,
        published: true,
      }));
      return { id: moduleId, course_id: courseId, title: m.title, description: '', cover_url: null, position: mi, published: true, lessons };
    });
    return {
      id: courseId,
      slug: c.slug,
      title: c.title,
      description: c.description,
      cover_url: null,
      banner_url: null,
      position: ci,
      published: true,
      modules,
    };
  });
}

export const DEMO_COURSES: Course[] = buildDemoCourses();

export const DEMO_POSTS: Post[] = [
  {
    id: 'demo-post-1',
    user_id: 'demo-user',
    body: 'Sejam bem-vindos à comunidade JOTATECH! Apresente-se aqui: seu nome, sua cidade e qual negócio local você quer atender primeiro.',
    created_at: '2026-09-20T12:00:00.000Z',
    pinned: true,
    author: { full_name: 'Jota', avatar_url: null, role: 'admin' },
    comments: [
      {
        id: 'demo-c-1',
        user_id: 'demo-2',
        body: 'Sou a Ana, de Recife. Quero começar com salões de beleza!',
        created_at: '2026-09-20T13:10:00.000Z',
        author: { full_name: 'Ana', avatar_url: null, role: 'member' },
      },
    ],
  },
  {
    id: 'demo-post-2',
    user_id: 'demo-3',
    body: 'Fechei meu primeiro site: uma pizzaria do bairro. R$ 400 + R$ 50 por mês de manutenção.',
    created_at: '2026-09-22T18:30:00.000Z',
    pinned: false,
    author: { full_name: 'Carlos', avatar_url: null, role: 'member' },
    comments: [],
  },
];

export const DEMO_CODES: AccessCode[] = [
  {
    code: 'JOTA2026',
    label: 'Grupo WhatsApp — Turma 1',
    max_uses: null,
    uses: 42,
    expires_at: null,
    active: true,
    created_at: '2026-09-01T12:00:00.000Z',
  },
];
