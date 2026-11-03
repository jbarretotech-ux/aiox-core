// Motor: tudo calculado a partir do tempo t (seek). Nada de timers.
const RAW = "0.78,1.26,Fala|1.26,1.68,pessoal,|2.36,2.50,aqui|2.50,2.58,é|2.58,2.62,o|2.62,3.18,Jotabe,|3.24,3.32,tudo|3.32,3.56,bem?|4.56,4.68,Tudo|4.68,4.94,certo|4.94,5.20,por|5.20,5.40,aí?|6.46,6.84,Para|6.84,7.14,tudo|7.14,7.36,e|7.36,7.62,presta|7.62,8.12,atenção,|8.30,8.36,porque|8.36,8.44,o|8.44,8.50,que|8.50,8.60,eu|8.60,8.70,vou|8.70,8.80,te|8.80,9.12,mostrar|9.12,9.42,hoje|9.42,9.52,vai|9.52,9.74,mudar|9.74,9.94,o|9.94,10.24,jeito|10.24,10.48,que|10.48,10.68,você|10.68,11.08,trabalha|11.08,11.20,com|11.20,11.64,inteligência|11.64,12.16,artificial.|12.80,12.94,Eu|12.94,13.14,uso|13.14,13.32,o|13.32,13.52,Claude|13.52,14.00,todos|14.00,14.40,os|14.40,14.66,dias|14.66,14.96,para|14.96,15.22,criar|15.22,15.70,sites,|15.88,16.36,automações,|16.66,16.94,vídeos|16.94,17.12,e|17.12,17.64,conteúdo.|18.12,18.24,E|18.24,18.42,sabe|18.42,18.56,que|18.56,18.60,eu|18.60,19.02,descobri|19.02,19.58,que|19.58,19.66,a|19.66,19.84,maioria|19.84,20.08,das|20.08,20.72,pessoas|20.72,21.26,usa|21.26,21.50,só|21.50,22.34,10%|22.34,22.56,do|22.56,22.68,que|22.68,22.76,ele|22.76,23.02,consegue|23.02,23.38,fazer?|23.94,24.08,O|24.08,24.46,segredo|24.46,24.66,está|24.66,24.84,nas|24.84,25.12,skills.|25.68,25.86,Uma|25.86,26.16,skill|26.16,26.30,é|26.30,26.48,como|26.48,26.58,um|26.58,26.98,manual|26.98,27.26,que|27.26,27.68,ensina|27.68,28.36,a|28.36,28.60,fazer|28.60,28.78,uma|28.78,29.26,tarefa|29.26,29.38,do|29.38,29.54,jeito|29.54,29.86,certo.";
const W = RAW.split('|').map(s => { const [a, b, w] = s.split(','); return { a: +a, b: +b, w }; });
const DUR = 33.0;
const OR = '#ff6a1a', RED = '#ff3b30', VIO = '#8b7cff';

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const inn = (t, a, d) => clamp((t - a) / d);
const eo = x => 1 - Math.pow(1 - clamp(x), 3);
const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const spr = x => { x = clamp(x, 0, 3); return x >= 3 ? 1 : 1 - Math.exp(-6.5 * x) * Math.cos(9 * x); }; // mola com leve overshoot
const lerp = (a, b, k) => a + (b - a) * k;
function rng(s) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// palavra que entra: sobe, perde o desfoque e ganha opacidade
function wstyle(t, a) {
  const k = eo(inn(t, a - 0.05, 0.28));
  return `opacity:${k};transform:translateY(${(1 - k) * 38}px);filter:blur(${(1 - k) * 10}px)`;
}
// liga palavras i..j com classes por índice: {i:'hl'|'it'|'st'|'or'}
function words(t, i, j, cls = {}, extra = '') {
  let h = '';
  for (let k = i; k <= j; k++) {
    const c = cls[k] || '';
    const txt = W[k].w.replace(/[,.]$/, c === 'keep' ? W[k].w.slice(-1) : '');
    h += `<span class="w ${c}" style="${wstyle(t, W[k].a)}">${txt}</span> `;
  }
  return `<div class="line" ${extra}>${h}</div>`;
}
// cena: mostra entre a e b com entrada/saída suave
function scene(t, a, b, html, out = 0.22) {
  if (t < a - 0.3 || t > b + out) return '';
  const k = 1 - eio(inn(t, b, out));
  return `<div class="scene" style="opacity:${k};filter:blur(${(1 - k) * 14}px);transform:scale(${1 + (1 - k) * 0.06})">${html}</div>`;
}
// cursor laranja com etiqueta "Claude" seguindo pontos [t,x,y]
function cursor(t, keys) {
  if (!keys.length || t < keys[0][0] - 0.2) return '';
  let x = keys[0][1], y = keys[0][2];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0] = keys[i], [t1, x1, y1] = keys[i + 1];
    if (t >= t0 && t <= t1) { const k = eio((t - t0) / (t1 - t0)); x = lerp(x0, x1, k); y = lerp(y0, y1, k); }
    if (t > t1) { x = x1; y = y1; }
  }
  const press = keys.some(k => k[3] && t >= k[0] && t < k[0] + 0.12) ? 0.86 : 1;
  return `<div class="cur" style="transform:translate(${x}px,${y}px) scale(${press})"><svg width="54" height="60" viewBox="0 0 24 26"><path d="M2 1 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg><span>Claude</span></div>`;
}
// fundo: preto, brilho laranja que respira, pontinhos
function bg(t) {
  const g = 0.55 + 0.12 * Math.sin(t * 0.9);
  const hue = t > 18 ? `rgba(139,124,255,${0.10 * clamp((t - 18) / 2)})` : 'transparent';
  return `<div class="bg" style="background:radial-gradient(60% 40% at 50% ${48 + 4 * Math.sin(t * .4)}%, rgba(255,106,26,${0.22 * g}), transparent 70%),radial-gradient(50% 35% at 70% 70%, ${hue}, transparent 70%),#0b0909"></div><div class="dots"></div>`;
}
