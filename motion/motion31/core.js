const RAW = "0.78,1.26,Fala|1.26,1.68,pessoal,|2.36,2.50,aqui|2.50,2.58,é|2.58,2.62,o|2.62,3.18,Jotabe,|3.24,3.32,tudo|3.32,3.56,bem?|4.56,4.68,Tudo|4.68,4.94,certo|4.94,5.20,por|5.20,5.40,aí?|6.46,6.84,Para|6.84,7.14,tudo|7.14,7.36,e|7.36,7.62,presta|7.62,8.12,atenção,|8.30,8.36,porque|8.36,8.44,o|8.44,8.50,que|8.50,8.60,eu|8.60,8.70,vou|8.70,8.80,te|8.80,9.12,mostrar|9.12,9.42,hoje|9.42,9.52,vai|9.52,9.74,mudar|9.74,9.94,o|9.94,10.24,jeito|10.24,10.48,que|10.48,10.68,você|10.68,11.08,trabalha|11.08,11.20,com|11.20,11.64,inteligência|11.64,12.16,artificial.|12.80,12.94,Eu|12.94,13.14,uso|13.14,13.32,o|13.32,13.52,Claude|13.52,14.00,todos|14.00,14.40,os|14.40,14.66,dias|14.66,14.96,para|14.96,15.22,criar|15.22,15.70,sites,|15.88,16.36,automações,|16.66,16.94,vídeos|16.94,17.12,e|17.12,17.64,conteúdo.|18.12,18.24,E|18.24,18.42,sabe|18.42,18.56,que|18.56,18.60,eu|18.60,19.02,descobri|19.02,19.58,que|19.58,19.66,a|19.66,19.84,maioria|19.84,20.08,das|20.08,20.72,pessoas|20.72,21.26,usa|21.26,21.50,só|21.50,22.34,10%|22.34,22.56,do|22.56,22.68,que|22.68,22.76,ele|22.76,23.02,consegue|23.02,23.38,fazer?|23.94,24.08,O|24.08,24.46,segredo|24.46,24.66,está|24.66,24.84,nas|24.84,25.12,skills.|25.68,25.86,Uma|25.86,26.16,skill|26.16,26.30,é|26.30,26.48,como|26.48,26.58,um|26.58,26.98,manual|26.98,27.26,que|27.26,27.68,ensina|27.68,28.36,a|28.36,28.60,fazer|28.60,28.78,uma|28.78,29.26,tarefa|29.26,29.38,do|29.38,29.54,jeito|29.54,29.86,certo.";
// Corte da voz original: só as frases fortes, gancho primeiro. [origem a, origem b] -> novo início
const SEG = [[19.55, 23.42], [6.40, 8.16], [8.26, 12.22], [12.74, 17.72], [23.88, 29.92]];
{ let t = 0; SEG.forEach(s => { s[2] = t; t += s[1] - s[0] + 0.15; }); }
const DUR = 24.6, CTA0 = 21.3;
const W = RAW.split('|').map(s => {
  const [a, b, w] = s.split(','); const g = SEG.find(q => +a >= q[0] - .02 && +a < q[1]);
  return g ? { a: +a - g[0] + g[2], b: +b - g[0] + g[2], w } : { a: 99, b: 99, w };
});
const OR = '#ff6a1a', RED = '#ff3b30', GR = '#8e8a93';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const inn = (t, a, d) => clamp((t - a) / d);
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const spr = x => { x = clamp(x, 0, 3); return x >= 3 ? 1 : 1 - Math.exp(-6.5 * x) * Math.cos(9 * x); };
const lerp = (a, b, k) => a + (b - a) * k;
const A = i => W[i].a;
// palavra: sobe 40px, tira o desfoque. ghost=true mostra o contorno antes de ser falada
function wd(t, i, cls = '', ghost = false, txt) {
  const k = eo(inn(t, A(i) - .04, .26)); const s = (txt ?? W[i].w).replace(/[,.]$/, '');
  if (ghost && k < 1) return `<span class="w gh ${cls}"><b style="opacity:${k};transform:translateY(${(1 - k) * 30}px);filter:blur(${(1 - k) * 8}px)">${s}</b>${s}</span> `;
  return `<span class="w ${cls}" style="opacity:${k};transform:translateY(${(1 - k) * 40}px);filter:blur(${(1 - k) * 10}px)">${s}</span> `;
}
const ws = (t, i, j, map = {}, ghost = false) => { let h = ''; for (let k = i; k <= j; k++) h += wd(t, k, map[k] || '', ghost); return h; };
// cena com câmera que aproxima devagar e saída com desfoque
function scene(t, a, b, html, cam = .035) {
  if (t < a - .05 || t > b + .25) return '';
  const k = 1 - eio(inn(t, b, .25)), p = inn(t, a, b - a);
  const e = eo(inn(t, a, .3));
  return `<div class="scene" style="opacity:${k * e};filter:blur(${(1 - k) * 16 + (1 - e) * 10}px);transform:scale(${(1 + cam * p) * (1 + (1 - k) * .08) * (1.04 - .04 * e)})">${html}</div>`;
}
// cursor "Claude" que segue pontos [t, x, y, clique?]
function cursor(t, keys, big = 1) {
  if (!keys.length || t < keys[0][0] - .3 || t > keys[keys.length - 1][0] + 3) return '';
  let x = keys[0][1], y = keys[0][2];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0] = keys[i], [t1, x1, y1] = keys[i + 1];
    if (t >= t0 && t <= t1) { const k = eio((t - t0) / (t1 - t0)); x = lerp(x0, x1, k); y = lerp(y0, y1, k); }
    if (t > t1) { x = x1; y = y1; }
  }
  const pr = keys.some(k => k[3] && t >= k[0] && t < k[0] + .14) ? .84 : 1;
  const o = clamp((t - keys[0][0] + .3) / .2);
  return `<div class="cur" style="opacity:${o};transform:translate(${x}px,${y}px) scale(${pr * big})"><svg width="64" height="72" viewBox="0 0 24 26"><path d="M2 1 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="${OR}" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg><span>Claude</span></div>`;
}
function bg(t) {
  return `<div class="bg"></div><div class="dots" style="transform:translateY(${-t * 6 % 40}px)"></div><div class="glow" style="opacity:${.55 + .15 * Math.sin(t * .8)};transform:translate(${Math.sin(t * .3) * 60}px,${Math.cos(t * .25) * 40}px)"></div><div class="vig"></div>`;
}
