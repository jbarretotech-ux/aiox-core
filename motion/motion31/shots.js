// Cenas. Tempos vêm das palavras da voz original (W[i].a já no tempo novo).
function SA(t) { // GANCHO 0-3.9: "a maioria das pessoas usa só 10% do que ele consegue fazer?"
  const t10 = A(61), out = eo(inn(t, t10 - .08, .25));
  const blk = `<div class="blk L" style="top:330px;opacity:${1 - out};transform:translateY(${-out * 180}px) scale(${1 - out * .1});filter:blur(${out * 14}px)">
    <div class="hx">${ws(t, 55, 56, {}, true)}</div><div class="hx">${ws(t, 57, 57, {}, true)}</div><div class="hx">${ws(t, 58, 58, {}, true)}</div>
    <div class="subH">${ws(t, 59, 60, { 60: 'hl' })}</div></div>`;
  if (t < t10 - .08) return blk;
  const k = spr(inn(t, t10, .55)), g = t < t10 + .45 ? Math.sin(t * 80) * 16 * (1 - inn(t, t10, .45)) : 0;
  const sh = t < t10 + .3 ? Math.sin(t * 95) * 14 * (1 - inn(t, t10, .3)) : 0;
  return `${blk}<div class="ten" style="transform:translateX(${sh}px) scale(${2.2 - 1.2 * k})"><span style="color:#26d0ff;transform:translate(${g}px,${-g / 3}px)">10%</span><span style="color:${RED};transform:translate(${-g}px,${g / 3}px)">10%</span><span>10%</span></div>
  <div class="blk C" style="top:1240px"><div class="sub2">${ws(t, 62, 63)}${wd(t, 64, 'hl')}${ws(t, 65, 66)}</div></div>
  ${cursor(t, [[A(64) - .35, 1150, 1700], [A(64) + .1, 420, 1330, 1], [3.9, 430, 1345]])}`;
}
function SB(t) { // "Para tudo e presta atenção"
  const a = A(12), sh = t > a && t < a + .35 ? Math.sin(t * 90) * 12 * (1 - inn(t, a, .35)) : 0;
  const nk = eo(inn(t, 4.0, .45));
  return `<div class="notif" style="transform:translateY(${(1 - nk) * -260}px);opacity:${nk}"><i>✳</i><div><small>Jotabê IA · agora</small><b>🛑 Para tudo!</b></div></div>
  <div class="blk L" style="top:700px;transform:translateX(${sh}px)"><div class="hx">${ws(t, 12, 13, {}, true)}</div>
  <div class="sub" style="margin-top:30px">${ws(t, 14, 15)}</div><div class="hx2">${wd(t, 16, 'hl')}</div></div>`;
}
function SC(t) { // "porque o que eu vou te mostrar hoje vai mudar o jeito que você trabalha com IA"
  return `<div class="blk C" style="top:250px"><div class="sub">${ws(t, 17, 24)}</div>
  <div class="mid">${ws(t, 25, 28, { 28: 'it' })}</div><div class="sub">${ws(t, 29, 32)}</div><div class="mid sm">${ws(t, 33, 34, { 33: 'hl', 34: 'hl' })}</div></div>
  <div class="place" style="top:1060px">${chatCard(t, A(25) - .1)}</div>
  ${cursor(t, [[A(26), 1150, 1800], [A(26) + .5, 800, 1520, 1], [9.9, 820, 1560]])}`;
}
function SD(t) { // "Eu uso o Claude todos os dias"
  const a = A(38), k = eo(inn(t, a - .25, .5));
  return `<div class="blk C" style="top:470px"><div class="sub">${ws(t, 35, 37)}</div></div>
  <div class="bigcur" style="opacity:${k};transform:translate(${lerp(900, 250, k)}px,${lerp(1200, 600, k)}px) scale(${t > a + .2 && t < a + .34 ? .9 : 1})"><svg width="150" height="168" viewBox="0 0 24 26"><path d="M2 1 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="#fff" stroke="#111" stroke-width="1" stroke-linejoin="round"/></svg><span style="${pop(t, a, .5)}">Claude</span></div>
  <div class="blk C" style="top:930px"><div class="mid">${ws(t, 39, 41, { 41: 'it' })}</div></div>
  <div class="place" style="top:1180px">${calCard(t, A(39))}</div>`;
}
function SE(t) { // "para criar sites, automações, vídeos e conteúdo"
  const ids = [44, 45, 46, 48]; let cur = 0; ids.forEach((i, n) => { if (t >= A(i) - .05) cur = n; });
  const w = ids[cur], kw = spr(inn(t, A(w), .45));
  const word = `<div class="swap" style="transform:scale(${.7 + .3 * kw});opacity:${clamp((t - A(w) + .05) / .1)}"><span class="${w === 48 ? 'it' : ''}">${W[w].w.replace(/[,.]$/, '')}</span></div>`;
  const cards = ids.map((i, n) => {
    const k = eo(inn(t, A(i) - .1, .5)), on = n === cur;
    return `<div class="cell ${on ? 'on' : ''}" style="opacity:${clamp((t - A(i) + .1) / .12)};transform:translateZ(${(1 - k) * 500}px) translateY(${(1 - k) * -120}px)">${mini(n, t)}</div>`;
  }).join('');
  const p = inn(t, 12.4, 2.7);
  return `<div class="blk C" style="top:250px"><div class="sub">${ws(t, 42, 43)}</div></div>${word}
  <div class="iso" style="transform:translate(-50%,0) perspective(2200px) rotateX(${50 - 6 * p}deg) rotateZ(${-30 + 8 * p}deg) scale(${.95 + .08 * p})">${cards}</div>`;
}
function SF(t) { // "O segredo está nas skills"
  const a = A(71), s = typed(t, a, 'skills', 16), k = eo(inn(t, a - .1, .3));
  const chips = ['post-viral.md', 'video.md', 'vendas.md'].map((f, i) => `<div class="chip" style="${pop(t, a + .45 + i * .14, .45)}"><s></s>${f}</div>`).join('');
  return `<div class="blk C" style="top:560px"><div class="sub">${ws(t, 67, 70, { 68: 'it' })}</div></div>
  <div class="brace" style="opacity:${k};transform:scale(${.85 + .15 * k})"><i>{</i><span>${s}</span>${caret(t)}<i>}</i></div>
  <div class="chips">${chips}</div>`;
}
function SG(t) { // "Uma skill é como um manual que ensina a fazer uma tarefa do jeito certo"
  const L = [[A(77), '# skill: post viral', 1], [A(79), '1. escreve o gancho'], [A(81), '2. cria o vídeo'], [A(83), '3. posta no horário certo']];
  return `<div class="blk C" style="top:210px"><div class="sub">${ws(t, 72, 76)}</div><div class="mid big">${wd(t, 77, 'it')}</div></div>
  <div class="place" style="top:640px">${codeCard(t, L, A(86) + .1)}</div>
  <div class="blk C" style="top:1390px"><div class="sub">${ws(t, 78, 83)}</div><div class="mid">${ws(t, 84, 86, { 85: 'it', 86: 'it' })}</div></div>`;
}
function SH(t) { // CTA: comenta JOTABÊ
  const a = CTA0, s = typed(t, a + 1.0, 'JOTABÊ', 9), sent = t >= a + 1.75;
  const box = `<div class="cbox"><div class="av"></div><div class="in">${sent ? '<span class="ph2">Adicione um comentário…</span>' : s + caret(t)}</div><div class="send ${s.length > 5 ? 'on' : ''}">↑</div></div>
  ${sent ? `<div class="cm" style="${pop(t, a + 1.75, .4)}"><div class="av"></div><div><b>você</b> JOTABÊ</div><span class="hr" style="${pop(t, a + 2.0, .4)}">♥</span></div>` : ''}`;
  return `<div class="blk C" style="top:380px"><div class="sub" style="${pop(t, a, .45)}">quer as minhas skills?</div>
  <div class="cta" style="${pop(t, a + .25, .5)}">Comenta</div><div class="cta2" style="${pop(t, a + .5, .55)}"><span class="hl">JOTABÊ</span></div></div>
  <div class="place" style="top:1130px"><div style="${tilt(t, a + .7, 12, -3)};width:900px">${win('Comentários', box)}</div></div>
  <div class="dm" style="${pop(t, a + 2.2, .5)}">✓ DM enviada</div>
  ${cursor(t, [[a + .9, 1150, 1750], [a + 1.6, 905, 1300, 1], [24.6, 930, 1340]])}`;
}
const SC_ = [[SA, -1, 3.92], [SB, 4.0, 5.86], [SC, 5.93, 9.98], [SD, 10.04, 12.4], [SE, 12.42, 15.1], [SF, 15.13, 16.88], [SG, 16.92, 21.25], [SH, 21.3, 25]];
window.seek = (t) => {
  let h = bg(t);
  for (const [f, a, b] of SC_) h += scene(t, a, b, f(t));
  document.getElementById('stage').innerHTML = h;
};
