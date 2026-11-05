// Tutorial Skyus: tudo desenhado por render(t). Dados em timeline.js (window.TL).
const $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => { x = cl(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const W = 1014, H = 1040, VW = 1090, VH = 828;
const URL = { '00_site': 'skyus.com.br', '01_resumo': 'skyus.com.br/dashboard', '02_planej': 'skyus.com.br/dashboard/planejamento',
  '03_planej_posts': 'skyus.com.br/dashboard/planejamento', '04_novo_post': 'skyus.com.br/dashboard/planejamento',
  '05_fila': 'skyus.com.br/dashboard/fila', '06_marcas': 'skyus.com.br/dashboard/configuracoes', '07_conexoes': 'skyus.com.br/dashboard/configuracoes',
  '08_claude': 'skyus.com.br/dashboard/configuracoes', '09_analitica': 'skyus.com.br/dashboard/analitica', '10_smartlinks': 'skyus.com.br/dashboard/smartlinks',
  '11_planos_uso': 'skyus.com.br/dashboard/planos', '12_anuncios': 'skyus.com.br/dashboard/anuncios', '13_caixa': 'skyus.com.br/dashboard/caixa-de-entrada',
  '14_reporting': 'skyus.com.br/dashboard/reporting', '15_siteseo': 'skyus.com.br/dashboard/site-seo', '16_hashtag': 'skyus.com.br/dashboard/hashtag-tracker',
  '17_planos': 'skyus.com.br/dashboard/planos', 'CHAT': 'claude.ai' };
const SUB = { '00': 'Do zero ao primeiro post agendado pela IA.', '01': 'A tela que mostra tudo de uma vez.', '02': 'Cada perfil ou negócio que você cuida.',
  '03': 'Sem conexão, o Skyus não publica sozinho.', '04': 'A sua semana inteira num lugar só.', '05': 'O caminho manual, passo a passo.',
  '06': 'Endereço, token e pronto.', '07': 'Você pede, a IA agenda.', '08': 'Tudo em dia? Aqui você confere.', '09': 'O que está funcionando.',
  '10': 'O seu link da bio.', '11': 'Visitas do site e buscas do Google.', '12': 'As mensagens num lugar só.', '13': 'Nasce pausado, sem susto.',
  '14': 'Relatório em PDF e hashtags salvas.', '15': 'Do grátis ao sob medida.', '16': 'Os 5 passos pra começar hoje.' };
const B = TL.beats, CHN = [...new Set(B.map(b => b.n))];
CHN.forEach(() => $('chaps').appendChild(document.createElement('i')));

function camFor(b) {
  if (b.shot === 'CHAT') return { s: .796, x: 0, y: 0 };
  const [x0, y0, x1, y1] = b.box, bw = x1 - x0, bh = y1 - y0;
  let s = Math.min(VW / bw, VH / bh) * .9; s = cl(s, Math.min(VW / W, VH / H), 2.1);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  let tx = VW / 2 - cx * s, ty = VH / 2 - cy * s;
  const iw = W * s, ih = H * s;
  tx = iw <= VW ? (VW - iw) / 2 : cl(tx, VW - iw, 0);
  ty = ih <= VH ? (VH - ih) / 2 : cl(ty, VH - ih, 0);
  return { s, x: tx, y: ty };
}
B.forEach(b => b.cam = camFor(b));
const lerp = (a, b, k) => a + (b - a) * k;

// legendas: grupos de até 7 palavras por beat
const GR = [];
B.forEach(b => { for (let i = 0; i < b.words.length; i += 7) GR.push(b.words.slice(i, i + 7)); });

let lastA = '', lastB = '';
function setImg(el, shot, cur) { if (shot !== 'CHAT' && el.dataset.s !== shot) { el.src = shot + '.jpg'; el.dataset.s = shot; } }

function render(t) {
  let i = B.findIndex((b, k) => t >= b.s && (k === B.length - 1 || t < B[k + 1].s)); if (i < 0) i = 0;
  const b = B[i], p = B[i - 1] || b, k = ease((t - b.s) / .9);
  // painel da esquerda
  $('num').textContent = b.n; $('title').textContent = b.ch; $('sub').textContent = SUB[b.n] || '';
  const chIn = ease((t - B.find(x => x.n === b.n).s) / .6);
  $('title').style.opacity = chIn; $('title').style.transform = `translateY(${(1 - chIn) * 30}px)`;
  $('num').style.opacity = chIn; $('sub').style.opacity = ease((t - B.find(x => x.n === b.n).s - .3) / .6);
  [...$('chaps').children].forEach((d, j) => d.className = CHN[j] === b.n ? 'on' : (CHN.indexOf(b.n) > j ? 'done' : ''));
  $('url').textContent = URL[b.shot] || 'skyus.com.br';
  // câmera
  const c = { s: lerp(p.cam.s, b.cam.s, k), x: lerp(p.cam.x, b.cam.x, k), y: lerp(p.cam.y, b.cam.y, k) };
  $('cam').style.transform = `translate(${c.x}px,${c.y}px) scale(${c.s})`;
  setImg($('imA'), p.shot); setImg($('imB'), b.shot);
  const xf = p.shot === b.shot ? 1 : ease((t - b.s) / .5);
  $('imA').style.opacity = p.shot === 'CHAT' ? 0 : 1; $('imB').style.opacity = b.shot === 'CHAT' ? 0 : xf;
  // chat
  const chatOn = b.shot === 'CHAT' ? ease((t - b.s) / .5) * (p.shot === 'CHAT' ? 0 : 1) + (p.shot === 'CHAT' && b.shot === 'CHAT' ? 1 : 0)
    : (p.shot === 'CHAT' ? 1 - ease((t - b.s) / .5) : 0);
  $('chat').style.opacity = cl(chatOn); $('chat').style.display = chatOn > 0 ? 'block' : 'none';
  const cb = B.filter(x => x.shot === 'CHAT');
  if (cb.length) {
    const show = (id, at) => { const e = $(id), q = ease((t - at) / .4); e.style.opacity = q; e.style.transform = `translateY(${(1 - q) * 20}px)`; };
    show('m1', cb[0].s + .4); show('m2', cb[0].s + Math.min(6, cb[0].d * .55)); show('m3', (cb[1] || cb[0]).s + .5); show('m4', (cb[1] || cb[0]).s + 3.5);
  }
  // destaque e clique
  const [x0, y0, x1, y1] = b.box, big = (x1 - x0) * (y1 - y0) > .7 * W * H || b.shot === 'CHAT';
  const hk = big ? 0 : ease((t - b.s - .9) / .4);
  Object.assign($('hl').style, { left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px', opacity: hk * .9 });
  $('hl').style.borderWidth = (4 / c.s) + 'px';
  if (b.click && b.shot !== 'CHAT') {
    const ck = ease((t - b.s - 1.3) / .3), ph = ((t - b.s - 1.3) % 1.2) / 1.2;
    Object.assign($('click').style, { left: b.click[0] + 'px', top: b.click[1] + 'px', opacity: ck, transform: `scale(${(1 / c.s) * (t - b.s - 1.3 < .25 ? .7 : 1)})` });
    Object.assign($('ring').style, { left: b.click[0] + 'px', top: b.click[1] + 'px', opacity: ck * (1 - ph), transform: `scale(${(1 + ph * 1.8) / c.s})` });
  } else { $('click').style.opacity = 0; $('ring').style.opacity = 0; }
  // legenda karaokê
  let g = null, cw = null;
  for (const gr of GR) { if (gr[0][1] <= t + .05) g = gr; }
  if (g) { for (const w of g) if (w[1] <= t + .05) cw = w; }
  const lastW = g && g[g.length - 1], ended = !g || t > lastW[1] + lastW[2] + .6;
  $('cap').innerHTML = ended ? '' : g.map(w => `<span class="${w === cw ? 'on' : ''}">${w[0]}</span>`).join(' ');
  $('prog').style.width = (t / TL.total * 100) + '%';
}
window.render = render;
render(0);
