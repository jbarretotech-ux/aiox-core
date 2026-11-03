// Peças de interface (janelas estilo Mac), todas em px de 1080x1920.
const win = (title, body, st = '', cls = '') => `<div class="win ${cls}" style="${st}"><div class="bar"><i></i><i></i><i></i><b>${title}</b></div>${body}</div>`;
const typed = (t, a, s, cps = 24) => s.slice(0, Math.max(0, Math.floor((t - a) * cps)));
const pop = (t, a, d = .5) => `transform:scale(${spr(inn(t, a, d))});opacity:${clamp((t - a) / .08)}`;
// entra de baixo, inclinado em 3D, e assenta
function tilt(t, a, rx = 22, rz = -7, ry = 0, extra = '') {
  const k = eo(inn(t, a, .7));
  return `opacity:${clamp((t - a) / .15)};transform:perspective(1600px) translateY(${(1 - k) * 260}px) rotateX(${rx + (1 - k) * 25}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${.9 + .1 * k});filter:blur(${(1 - k) * 12}px)${extra}`;
}
const caret = (t) => `<span class="caret" style="opacity:${Math.floor(t * 2.4) % 2 ? 0 : 1}"></span>`;

function chatCard(t, a) {
  const q = 'cria um site pra minha loja';
  const r = 'Pronto! Site no ar ✓';
  const q1 = a + .35, r1 = q1 + q.length / 30 + .35;
  const body = `<div class="chat">
    <div class="msg me" style="${pop(t, q1, .35)}">${typed(t, q1, q, 30)}</div>
    ${t > r1 ? `<div class="msg ai" style="${pop(t, r1, .4)}"><em>✳</em>${typed(t, r1 + .1, r, 22)}</div>` : ''}
    <div class="inbox">Pergunte qualquer coisa…<span class="sendb">↑</span></div></div>`;
  return win('Claude', body, tilt(t, a, 20, -6) + ';width:820px');
}

function calCard(t, a) {
  const d = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const cells = d.map((x, i) => {
    const on = t > a + .15 + i * .09;
    return `<div class="day ${on ? 'on' : ''}"><small>${x}</small><span style="${on ? pop(t, a + .15 + i * .09, .35) : 'opacity:0'}">✓</span></div>`;
  }).join('');
  return win('Calendário · todos os dias', `<div class="cal">${cells}</div>`, tilt(t, a, 18, 5) + ';width:860px');
}

// mini-cartões da colagem (site, automação, vídeo, post)
function mini(kind, t) {
  if (kind === 0) return win('meusite.com', `<div class="site"><div class="nav"><b>◆ minha loja</b><span>Sobre · Contato</span></div><h4>Feito com<br>Claude.</h4><div class="orb"></div><div class="bt">Comprar →</div></div>`);
  if (kind === 1) return win('automação', `<div class="flow"><span>📩 Lead</span><em></em><span class="o">✳ Claude</span><em></em><span>💬 WhatsApp</span></div>`);
  if (kind === 2) return win('video.mp4', `<div class="player"><div class="vt">MOTION</div><div class="dot"></div><div class="prog"><i style="width:${20 + 70 * inn(t, 13.9, 1.4)}%"></i></div></div>`);
  return win('post · instagram', `<div class="post"><div class="ph"><div class="av"></div><b>jotabe.ia</b></div><div class="img"><span>5 skills<br>do Claude</span></div><div class="likes">♥ ${Math.floor(240 + 4800 * eo(inn(t, 14.4, .9))).toLocaleString('pt-BR')} curtidas</div></div>`);
}

function codeCard(t, L, done) {
  const rows = L.map(([a, s, h], i) => {
    const end = a + s.length / 30, on = t >= a;
    return `<div class="cl ${h ? 'h' : ''}"><u>${i + 1}</u><span>${on ? typed(t, a, s, 30) : ''}</span>${t >= a && t < end + .05 ? caret(t) : ''}${!h && t >= end ? `<b class="ok" style="${pop(t, end, .35)}">✓</b>` : ''}</div>`;
  }).join('');
  const big = t >= done ? `<div class="bigok" style="${pop(t, done, .5)}">✓</div>` : '';
  return `<div class="codewrap" style="${tilt(t, L[0][0] - .5, 14, 0, -16)}">${win('SKILL.md', `<div class="code">${rows}</div>`, 'width:880px')}${big}</div>`;
}
