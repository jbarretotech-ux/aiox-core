"""Monta timeline.js (window.TL) a partir do roteiro + tempos das palavras.
Uso: python build_tl.py [durs.json]   (durs.json = duração real de cada fala; sem ele, estima)"""
import json, os, sys
R = json.load(open('roteiro.json'))['beats']
durs = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else None
GAP, GAP_CH, LEAD = .55, 1.0, .8
t, beats = LEAD, []
for i, b in enumerate(R):
    wj = f'base/{i:02d}.json'
    words = json.load(open(wj)) if os.path.exists(wj) else None
    if words is None:  # estimativa: 2.4 palavras/s
        ws = b['t'].split(); words = [[w, k / 2.4, .35] for k, w in enumerate(ws)]
    d = durs[i] if durs else words[-1][1] + words[-1][2] + .2
    if i and b['n'] != R[i - 1]['n']: t += GAP_CH - GAP
    beats.append({**{k: b[k] for k in ('ch', 'n', 'shot', 'box')}, 'click': b.get('click'),
                  's': round(t, 3), 'd': round(d, 3), 'words': [[w[0], round(t + w[1], 3), round(w[2], 3)] for w in words]})
    t += d + GAP
total = round(t + 1.5, 2)
open('timeline.js', 'w').write('window.TL=' + json.dumps({'total': total, 'beats': beats}, ensure_ascii=False) + ';')
json.dump({'total': total, 'starts': [b['s'] for b in beats], 'chapters': [b['s'] for i, b in enumerate(beats) if i == 0 or b['n'] != beats[i - 1]['n']],
           'clicks': [b['s'] + 1.3 for b in beats if b.get('click')]}, open('events.json', 'w'))
print('total', total)
