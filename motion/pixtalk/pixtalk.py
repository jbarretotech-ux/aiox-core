# Jotabe pixel art falando: anima o sprite (boca pelo volume da voz, piscada, respiração)
# e monta o vídeo 1080x1920 no estilo da referência. 100% código: Python + Pillow + ffmpeg.
# Uso: python3 pixtalk.py sprite.png voz.(mp3|wav|ogg|m4a) saida.mp4 "Título" "linha azul" [capitulo]
import sys, json, math, random, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
CREAM = (243, 236, 224); INK = (24, 18, 14); BLUE = (40, 92, 230); ORANGE = (255, 106, 26)
# pontos do rosto no sprite A (72x110, 3/4 virado pra direita)
MOUTH = dict(cx=43, y=49, w=[0, 4, 6, 6], h=[0, 1, 2, 3])
EYES = [(35, 40, 34), (42, 46, 33)]  # x0, x1, linha do olho
LIP = (110, 48, 40); INSIDE = (52, 20, 18); TEETH = (238, 230, 220); TONGUE = (170, 70, 70)


def font(size, bold=True):
    for p in ['/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
              '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf']:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            pass
    return ImageFont.load_default()


def mono(size):
    for p in ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf']:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            pass
    return font(size)


def load_audio(path):
    raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0


def mouth_track(pcm, n):
    """Volume por quadro -> abertura da boca 0..3, com leve antecipação (a boca abre um tiquinho antes do som)."""
    hop = 16000 // FPS
    rms = np.array([np.sqrt(np.mean(pcm[i * hop:(i + 1) * hop] ** 2) + 1e-9) for i in range(n)])
    db = 20 * np.log10(rms + 1e-6)
    top = np.percentile(db, 95); floor = top - 28
    lv = np.clip((db - floor) / (top - floor), 0, 1)
    lv = np.maximum(lv, np.concatenate([lv[1:], [0]]))  # antecipa 1 quadro
    out = np.zeros(n, int)
    for i, v in enumerate(lv):
        out[i] = 0 if v < .22 else 1 if v < .45 else 2 if v < .7 else 3
    for i in range(1, n - 1):  # evita tremedeira de 1 quadro
        if out[i - 1] == out[i + 1] != out[i]:
            out[i] = out[i - 1]
    return out, lv


def draw_mouth(sp, k):
    if k == 0:
        return sp
    im = sp.copy(); px = im.load()
    w, h = MOUTH['w'][k], MOUTH['h'][k]; x0 = MOUTH['cx'] - w // 2; y0 = MOUTH['y']
    for y in range(y0, y0 + h + 1):
        for x in range(x0, x0 + w + 1):
            edge = y in (y0, y0 + h) or x in (x0, x0 + w)
            corner = (x in (x0, x0 + w)) and (y in (y0, y0 + h))
            if corner:
                continue
            c = LIP if edge else INSIDE
            if not edge and k == 3 and y == y0 + 1:
                c = TEETH
            if not edge and k >= 2 and y == y0 + h - 1 and x in (x0 + w // 2, x0 + w // 2 + 1):
                c = TONGUE
            px[x, y] = c + (255,)
    return im


def draw_blink(sp, amount):
    """amount 1 = meio fechado, 2 = fechado: pinta pálpebra com o tom de pele de cima do olho."""
    im = sp.copy(); px = im.load()
    for x0, x1, ey in EYES:
        for x in range(x0, x1 + 1):
            skin = px[x, ey - 3]
            px[x, ey - 1] = skin
            if amount == 2:
                px[x, ey] = (40, 26, 22, 255)
    return im


def blink_track(n):
    rnd = random.Random(3); b = np.zeros(n, int); t = int(FPS * 1.2)
    while t < n - 4:
        b[t] = 1; b[t + 1] = 2; b[t + 2] = 2; b[t + 3] = 1
        t += int(FPS * rnd.uniform(2.4, 4.2))
    return b


def words_track(audio_path):
    """Legenda palavra por palavra, se houver faster-whisper; senão, nada."""
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        return []
    m = WhisperModel('small', compute_type='int8')
    segs, _ = m.transcribe(audio_path, language='pt', word_timestamps=True)
    return [(w.start, w.end, w.word.strip()) for s in segs for w in s.words]


def wrap(d, text, f, maxw):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=f) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def main():
    sprite, audio, out = sys.argv[1:4]
    title = sys.argv[4] if len(sys.argv) > 4 else 'Olá, eu sou o Jotabe'
    line2 = sys.argv[5] if len(sys.argv) > 5 else 'e vim te mostrar uma coisa nova'
    chap = sys.argv[6] if len(sys.argv) > 6 else '$ 01/15'
    fix = {'JTB': 'Jotabe', 'Jotabê': 'Jotabe', 'Jotatec': 'Jotabe', 'Jotatech': 'Jotabe', 'cloud': 'Claude', 'Cloud': 'Claude'}
    sp = Image.open(sprite).convert('RGBA')
    pcm = load_audio(audio); dur = len(pcm) / 16000
    tail = 1.6  # chamada final
    n = int((dur + tail) * FPS)
    mouth, lv = mouth_track(np.concatenate([pcm, np.zeros(int(tail * 16000) + 1600, np.float32)]), n)
    blink = blink_track(n)
    words = words_track(audio)
    words = [(a, b, fix.get(w.strip(',.!?'), w)) for a, b, w in words]
    S = 12; cw, ch = sp.width * S, sp.height * S
    fT, f2, fC, fW, fCTA = font(84), font(64), mono(40), font(70), font(92)
    base = Image.new('RGB', (W, H), CREAM); d = ImageDraw.Draw(base)
    # grade sutil de "papel"
    for y in range(0, H, 48):
        d.line([(0, y), (W, y)], fill=(236, 228, 214))
    d.rounded_rectangle([60, 90, 60 + d.textlength(chap, font=fC) + 44, 160], 14, fill=INK)
    d.text((82, 100), chap, font=fC, fill=(255, 214, 120))
    y = 210
    for ln in wrap(d, title, fT, W - 120):
        d.text((60, y), ln, font=fT, fill=INK); y += 98
    for ln in wrap(d, line2, f2, W - 120):
        d.text((60, y), ln, font=f2, fill=BLUE); y += 76
    d.rectangle([60, y + 14, 260, y + 26], fill=ORANGE)
    ff = subprocess.Popen(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                           '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', audio, '-af', f'apad=pad_dur={tail}',
                           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p',
                           '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    talk_e = 0.0
    for i in range(n):
        t = i / FPS
        fr = base.copy(); dd = ImageDraw.Draw(fr)
        im = draw_mouth(sp, mouth[i])
        if blink[i]:
            im = draw_blink(im, blink[i])
        talk_e = .85 * talk_e + .15 * lv[i]
        breathe = math.sin(t * 2 * math.pi / 3.2)
        bob = -round(talk_e * 1.6 + (1 if breathe > .5 else 0))  # pixels do sprite
        nod = 1 if (talk_e > .35 and math.sin(t * 7) > .6) else 0
        big = im.resize((cw, ch), Image.NEAREST)
        x = (W - cw) // 2 + 40 + nod * S; yb = H - ch + 60 + bob * S
        fr.paste(big, (x, yb), big)
        cur = [w for w in words if w[0] - .05 <= t < w[1] + .15]
        if cur and t < dur:
            wtxt = cur[-1][2].upper()
            tw = dd.textlength(wtxt, font=fW); bx = (W - tw) / 2
            dd.rounded_rectangle([bx - 30, 700, bx + tw + 30, 800], 18, fill=INK)
            dd.text((bx, 708), wtxt, font=fW, fill=(255, 214, 120))
        if t >= dur:  # chamada final
            k = min(1, (t - dur) / .25)
            msg = 'Comenta VÍDEO'; tw = dd.textlength(msg, font=fCTA)
            yy = int(720 - 40 * (1 - k))
            dd.rounded_rectangle([(W - tw) / 2 - 40, yy, (W + tw) / 2 + 40, yy + 130], 26, fill=ORANGE)
            dd.text(((W - tw) / 2, yy + 14), msg, font=fCTA, fill=(255, 255, 255))
        ff.stdin.write(fr.tobytes())
    ff.stdin.close(); ff.wait()
    json.dump({'dur': dur, 'frames': n, 'words': len(words)}, sys.stdout); print()


if __name__ == '__main__':
    main()
