# Render quadro a quadro: python3 render.py stills 1,3,7  |  python3 render.py full out.mp4 [a b]
import sys, subprocess, http.server, threading, functools, os
from playwright.sync_api import sync_playwright
FPS, DUR = 30, 33.0
root = os.path.dirname(os.path.abspath(__file__))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', int(os.environ.get('PORT','8791'))), functools.partial(http.server.SimpleHTTPRequestHandler, directory=root))
srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=srv.serve_forever, daemon=True).start()
mode = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--font-render-hinting=none', '--force-color-profile=srgb'])
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.goto('http://127.0.0.1:'+os.environ.get('PORT','8791')+'/index.html'); pg.wait_for_function('window.ready === true')
    stage = pg.locator('#stage')
    def shot(t, path=None):
        pg.evaluate(f'seek({t})'); pg.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
        return stage.screenshot(path=path, type='png' if path else 'jpeg', quality=None if path else 95)
    if mode == 'stills':
        for s in sys.argv[2].split(','): shot(float(s), f'{root}/still_{s}.png')
    else:
        out = sys.argv[2]; a = float(sys.argv[3]) if len(sys.argv) > 3 else 0; z = float(sys.argv[4]) if len(sys.argv) > 4 else DUR
        ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
        n0, n1 = int(a * FPS), int(z * FPS)
        for i in range(n0, n1): ff.stdin.write(shot(i / FPS))
        ff.stdin.close(); ff.wait()
    b.close()
srv.shutdown()
