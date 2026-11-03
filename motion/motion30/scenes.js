// Cenas do vídeo (1080x1920). Cada uma usa os tempos reais das palavras da voz do Jota.
const typed = (t, a, s, cps = 22) => s.slice(0, Math.max(0, Math.floor((t - a) * cps)));
const popS = (t, a) => `transform:scale(${spr(inn(t, a, 0.45))});opacity:${clamp((t - a) / 0.08)}`;
const win = (title, body, st = '', cls = '') => `<div class="win ${cls}" style="${st}"><div class="bar"><i></i><i></i><i></i><b>${title}</b></div>${body}</div>`;

function S1(t) {
  return `<div class="col mid">${words(t, 0, 1, { 1: 'hl' }, 'style="font-size:190px"')}
  <div class="tag" style="${popS(t, 1.5)}">● gravado de verdade</div></div>`;
}
function S2(t) {
  return `<div class="col mid">${words(t, 2, 4, {}, 'style="font-size:90px;opacity:.85"')}
  ${words(t, 5, 5, { 5: 'hl' }, 'style="font-size:210px"')}
  <div class="tag" style="${popS(t, 2.95)}">@jotabe.ia</div>
  ${words(t, 6, 7, { 7: 'it' }, 'style="font-size:96px;margin-top:40px"')}</div>`;
}
function S3(t) {
  const d = 900 * (1 - eo(inn(t, 5.0, 0.9)));
  return `<div class="col mid">${words(t, 8, 9, {}, 'style="font-size:150px"')}${words(t, 10, 11, { 10: 'it', 11: 'it' }, 'style="font-size:170px"')}
  <svg width="760" height="90" viewBox="0 0 760 90" style="margin-top:30px"><path d="M10 45 Q 70 0 130 45 T 250 45 T 370 45 T 490 45 T 610 45 T 750 45" fill="none" stroke="${OR}" stroke-width="12" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="${d}"/></svg></div>`;
}
function S4(t) {
  const k = spr(inn(t, 6.46, 0.5)), sh = t > 6.46 && t < 6.9 ? Math.sin(t * 90) * 10 * (1 - inn(t, 6.46, 0.44)) : 0;
  return `<div class="col mid" style="transform:translateX(${sh}px)">
  <div class="stop" style="transform:scale(${k}) rotate(${-8 + 8 * k}deg);opacity:${clamp((t - 6.4) / .06)}"><span>PARA</span></div>
  ${words(t, 12, 13, { 12: 'st0', 13: 'st0' }, 'style="font-size:180px;text-transform:uppercase"')}
  ${words(t, 14, 16, { 16: 'hl' }, 'style="font-size:110px"')}</div>`;
}
function S5(t) {
  const lines = [[17, 21], [22, 24], [25, 28], [29, 31], [32, 34]];
  const cls = { 26: 'it', 33: 'hl', 34: 'hl' };
  let cur = 0; lines.forEach((l, i) => { if (t >= W[l[0]].a - .05) cur = i; });
  const y = -cur * 150 * eo(inn(t, W[lines[cur][0]].a - .1, .35)) - (cur > 0 ? (cur - 1) * 150 * (1 - eo(inn(t, W[lines[cur][0]].a - .1, .35))) : 0);
  const html = lines.map((l, i) => `<div style="opacity:${i === cur ? 1 : .28};transition:none">${words(t, l[0], l[1], cls, 'style="font-size:118px"')}</div>`).join('');
  return `<div class="col" style="position:absolute;top:780px;left:0;right:0;transform:translateY(${y}px)">${html}</div>`;
}
function S6(t) {
  const site = `<div class="sitebody"><div class="hero"></div><div class="ln" style="width:70%"></div><div class="ln" style="width:45%"></div><div class="btn">Ver mais</div></div>`;
  const auto = `<div class="flow"><span>Lead</span><em></em><span>IA</span><em></em><span>WhatsApp</span></div>`;
  const vid = `<div class="player"><div class="play"></div><div class="prog"><i style="width:${30 + 60 * inn(t, 16.7, 1.2)}%"></i></div></div>`;
  const post = `<div class="post"><div class="av"></div><div class="ln" style="width:60%"></div><div class="img"></div><div class="likes">♥ ${Math.floor(120 + 2400 * eo(inn(t, 17.2, .8)))}</div></div>`;
  const cards = [[15.22, 'site.html', site, 'sites'], [15.88, 'automação', auto, 'automações'], [16.66, 'video.mp4', vid, 'vídeos'], [17.12, 'post', post, 'conteúdo']];
  const grid = cards.map(([a, ti, b, lb], i) => `<div class="cell" style="${popS(t, a)}">${win(ti, b)}<div class="lbl ${t >= a ? 'on' : ''}">${lb}</div></div>`).join('');
  return `<div class="col" style="position:absolute;top:250px;left:0;right:0">${words(t, 35, 38, { 38: 'hl' }, 'style="font-size:120px"')}${words(t, 39, 41, { 39: 'it', 40: 'it', 41: 'it' }, 'style="font-size:96px"')}
  <div class="grid">${grid}</div></div>`;
}
function S7(t) {
  const r = rng(7); let dots = '';
  for (let i = 0; i < 100; i++) {
    const a = 19.66 + (i % 10 + Math.floor(i / 10)) * 0.025, lit = i < 10 && t > 21.5;
    const k = spr(inn(t, a, .4)), dim = t > 21.5 && !lit ? .22 : 1;
    dots += `<i style="transform:scale(${k});opacity:${dim};background:${lit ? OR : '#e9e4de'}"></i>`;
    r();
  }
  const g = t > 21.5 && t < 22.4 ? Math.sin(t * 70) * 8 : 0;
  const ten = t >= 21.45 ? `<div class="ten" style="transform:scale(${spr(inn(t, 21.5, .5))})"><span style="transform:translate(${g}px,0);color:#26d0ff">10%</span><span style="transform:translate(${-g}px,0);color:${RED}">10%</span><span>10%</span></div>` : '';
  return `<div class="col" style="position:absolute;top:230px;left:0;right:0">${words(t, 49, 53, { 53: 'it' }, 'style="font-size:80px"')}${words(t, 54, 58, { 58: 'hl' }, 'style="font-size:92px"')}
  <div class="people" style="opacity:${clamp((t - 19.5) / .2)}">${dots}${ten}</div>
  ${words(t, 59, 60, {}, 'style="font-size:96px"')}${words(t, 62, 66, { 66: 'it' }, 'style="font-size:84px"')}</div>`;
}
function S8(t) {
  const o = eo(inn(t, 24.9, .4));
  const files = ['post-viral.md', 'video.md', 'agenda.md'].map((f, i) => `<div class="file" style="opacity:${clamp((t - 25 - i * .12) / .15)};transform:translateY(${(1 - eo(inn(t, 25 + i * .12, .3))) * 40}px)"><s></s>${f}</div>`).join('');
  return `<div class="col mid">${words(t, 67, 70, { 68: 'it' }, 'style="font-size:110px"')}${words(t, 71, 71, { 71: 'hl' }, 'style="font-size:220px"')}
  <div class="folder" style="${popS(t, 24.84)}"><div class="tab"></div><div class="lid" style="transform:rotateX(${-60 * o}deg)"></div><b>skills/</b>${files}</div></div>`;
}
function S9(t) {
  const L = [[26.58, '# skill: post viral'], [27.26, '1. escreve o gancho'], [28.36, '2. cria o vídeo'], [28.78, '3. posta no horário certo']];
  const code = L.map(([a, s], i) => `<div class="cl ${i ? '' : 'h'}"><u>${i + 1}</u>${typed(t, a, s, 28)}${t >= a + s.length / 28 && i ? '<span class="ok">✓</span>' : ''}${t >= a && t < a + s.length / 28 ? '<span class="caret"></span>' : ''}</div>`).join('');
  const chk = t >= 29.55 ? `<div class="bigok" style="transform:scale(${spr(inn(t, 29.55, .45))})">✓</div>` : '';
  return `<div class="col" style="position:absolute;top:200px;left:0;right:0">${words(t, 72, 77, { 77: 'it' }, 'style="font-size:96px"')}
  <div style="${popS(t, 26.5)};margin:40px auto 0;width:900px">${win('SKILL.md', `<div class="code">${code}</div>`)}</div>
  ${words(t, 78, 83, {}, 'style="font-size:78px;margin-top:40px"')}${words(t, 84, 86, { 85: 'it', 86: 'it' }, 'style="font-size:120px"')}${chk}</div>`;
}
function S10(t) {
  const s = typed(t, 30.9, 'JOTABÊ', 9), sent = t >= 31.75;
  return `<div class="col mid"><div class="ask" style="${popS(t, 30.05)}">quer as minhas skills?</div>
  <div class="cta" style="${popS(t, 30.3)}">comenta</div><div class="cta hl2" style="${popS(t, 30.55)}">JOTABÊ</div>
  <div style="${popS(t, 30.8)};width:880px;margin-top:50px">${win('Comentários', `<div class="cbox"><div class="av"></div><div class="in">${sent ? '' : s}<span class="caret"></span></div><div class="send ${sent ? 'on' : ''}">↑</div></div>${sent ? `<div class="cm" style="${popS(t, 31.75)}"><div class="av"></div><b>você</b> JOTABÊ <span style="color:${RED}">♥</span></div>` : ''}`)}</div>
  <div class="dm" style="${popS(t, 32.15)}">DM enviada ✓</div>
  <div class="it" style="font-size:72px;margin-top:30px;${popS(t, 32.4)}">que eu te mando</div></div>`;
}

const CUR = [[0.3, 1200, 1500], [1.3, 860, 1090, 1], [2.3, 900, 1300], [6.2, 820, 1250], [6.5, 700, 760, 1], [12.6, 900, 1700], [15.2, 300, 860, 1], [15.86, 780, 860, 1], [16.64, 300, 1330, 1], [17.1, 780, 1330, 1], [17.9, 900, 1650], [21.4, 560, 1100, 1], [23.8, 900, 1600], [24.8, 720, 1280, 1], [26.4, 900, 1700], [29.5, 820, 1500, 1], [31.6, 900, 1300], [31.72, 905, 1300, 1]];
const SC = [[S1, 0, 2.2], [S2, 2.25, 4.4], [S3, 4.45, 6.3], [S4, 6.35, 8.2], [S5, 8.25, 12.55], [S6, 12.6, 17.85], [S7, 17.9, 23.75], [S8, 23.8, 25.5], [S9, 25.55, 29.95], [S10, 30.0, 34]];

window.seek = async (t) => {
  let h = bg(t);
  for (const [f, a, b] of SC) h += scene(t, a, b, f(t));
  h += cursor(t, CUR);
  document.getElementById('stage').innerHTML = h;
};
