"""Renderiza quadros. Uso: python frames.py preview t1 t2 ... | python frames.py run <worker> <nworkers> [fps]"""
import sys, os, json
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
mode = sys.argv[1]
with sync_playwright() as p:
    exe = os.environ.get('CHROME')
    b = p.chromium.launch(**({'executable_path': exe} if exe else {}), args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.goto('file://' + HERE + '/index.html'); pg.wait_for_timeout(800)
    if mode == 'preview':
        for t in sys.argv[2:]:
            pg.evaluate(f'render({t})'); pg.wait_for_timeout(150)
            pg.screenshot(path=f'{HERE}/prev_{t}.jpg', type='jpeg', quality=75)
    else:
        w, n = int(sys.argv[2]), int(sys.argv[3]); fps = int(sys.argv[4]) if len(sys.argv) > 4 else 25
        total = pg.evaluate('TL.total'); N = int(total * fps)
        os.makedirs(f'{HERE}/frames', exist_ok=True)
        # pré-carrega todas as imagens
        pg.evaluate("Promise.all([...new Set(TL.beats.map(b=>b.shot))].filter(s=>s!=='CHAT').map(s=>new Promise(r=>{const i=new Image();i.onload=r;i.onerror=r;i.src=s+'.jpg'})))")
        for f in range(w, N, n):
            out = f'{HERE}/frames/f{f:05d}.jpg'
            if os.path.exists(out): continue
            pg.evaluate(f'render({f / fps})')
            pg.screenshot(path=out, type='jpeg', quality=88)
    b.close()
