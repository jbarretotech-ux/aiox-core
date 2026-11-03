# Render do vídeo 1080x1920 em código puro (Pillow + ffmpeg). Sem IA de vídeo.
# Uso: python3 render.py <pasta_expressoes> <envelope.txt> saida.mp4 [quadro_unico]
import sys, math, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cena as C

W, H, FPS = 1080, 1920, 30
CREAM = (243, 236, 224); INK = (27, 20, 16); ORANGE = (255, 106, 26); RED = (226, 38, 38)
GRAY = (176, 166, 152); WHITE = (255, 255, 255); DARK = (24, 22, 26)
P = '/usr/share/fonts/truetype/google-fonts/Poppins-'
MAP = {'SemiBold': 'Medium', 'ExtraBold': 'Bold'}
f = lambda w, s: ImageFont.truetype(P + MAP.get(w, w) + '.ttf', s)
F_T, F_CAP, F_SM, F_MID, F_BIG = f('Bold', 92), f('Bold', 76), f('SemiBold', 34), f('Bold', 46), f('ExtraBold', 170)
CARD = (70, 380, 1010, 1190)  # x0, y0, x1, y1 da foto


def ease(x):
    x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3


def back(x):  # pulo com passadinha (pop)
    x = max(0.0, min(1.0, x)); c = 1.9; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


def load_expr(folder):
    cw, ch = CARD[2] - CARD[0], CARD[3] - CARD[1]
    out = {}
    for _, n in C.EXPR:
        if n in out:
            continue
        im = Image.open(f'{folder}/e_{n}.png').convert('RGB')
        s = max(cw * 1.14 / im.width, ch * 1.14 / im.height)
        im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
        out[n] = im.filter(ImageFilter.UnsharpMask(2, 80, 2))
    return out


def background():
    bg = Image.new('RGB', (W, H), CREAM); d = ImageDraw.Draw(bg)
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(236, 228, 214))
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(236, 228, 214))
    # prédios em traço (rodapé)
    x, i = 0, 0
    hs = [120, 200, 150, 260, 180, 230, 140, 300, 170, 220, 130, 250, 190]
    while x < W:
        w = 70 + (i * 37) % 60; h = hs[i % len(hs)]
        d.rectangle([x, 1790 - h, x + w, 1790], outline=(214, 202, 184), width=3)
        for wy in range(1790 - h + 20, 1780, 34):
            d.line([(x + 14, wy), (x + w - 14, wy)], fill=(226, 216, 200), width=3)
        x += w + 10; i += 1
    d.line([(0, 1790), (W, 1790)], fill=(214, 202, 184), width=3)
    d.rounded_rectangle([60, 60, 300, 118], 29, fill=DARK)
    d.ellipse([82, 79, 102, 99], fill=ORANGE)
    d.text((114, 66), 'Jotabe IA', font=F_SM, fill=WHITE)
    t = '@jotabe.ia'; d.text(((W - d.textlength(t, font=F_MID)) / 2, 1820), t, font=F_MID, fill=INK)
    return bg


def title(d, t):
    y = 150
    for i, (ln, col) in enumerate(zip(C.TITLE, (INK, ORANGE))):
        k = ease((t - i * .12) / .35)
        tw = d.textlength(ln, font=F_T)
        d.text(((W - tw) / 2, y + i * 104 + (1 - k) * 30), ln, font=F_T, fill=col if k > .05 else CREAM)


def current(lst, t):
    cur = lst[0]
    for item in lst:
        if t >= item[0]:
            cur = item
    return cur


def card(fr, ex, env, t, fi):
    x0, y0, x1, y1 = CARD; cw, ch = x1 - x0, y1 - y0
    st, name = current(C.EXPR, t)
    im = ex[name]; age = t - st
    zoom = 1.0 + 0.04 * min(age / 3, 1) + 0.018 * env[min(fi, len(env) - 1)]
    pop = 1 + 0.10 * (1 - ease(age / .22))
    s = zoom * pop / 1.14
    iw, ih = int(im.width * s), int(im.height * s)
    big = im.resize((iw, ih), Image.BILINEAR)
    bob = int(6 * math.sin(t * 2.1))
    crop = big.crop(((iw - cw) // 2, (ih - ch) // 2 - bob, (iw - cw) // 2 + cw, (ih - ch) // 2 - bob + ch))
    sh = Image.new('L', (cw + 80, ch + 80), 0); ImageDraw.Draw(sh).rounded_rectangle([40, 52, cw + 40, ch + 52], 46, fill=110)
    fr.paste((120, 70, 30), (x0 - 40, y0 - 40), sh.filter(ImageFilter.GaussianBlur(22)))
    m = Image.new('L', (cw, ch), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, cw, ch], 40, fill=255)
    fr.paste(crop, (x0, y0), m)
    if age < .16:  # flash de corte
        fl = Image.new('RGB', (cw, ch), WHITE)
        fr.paste(fl, (x0, y0), m.point(lambda v: int(v * .55 * (1 - age / .16))))
    ImageDraw.Draw(fr).rounded_rectangle([x0, y0, x1, y1], 40, outline=ORANGE, width=8)


def stamp(fr, text, cx, cy, t0, t, col=RED, font=None, rot=-8):
    font = font or f('ExtraBold', 110)
    k = back((t - t0) / .28)
    if k <= 0.01:
        return
    d0 = ImageDraw.Draw(Image.new('RGB', (1, 1)))
    tw = int(d0.textlength(text, font=font)); th = font.size + 40
    lay = Image.new('RGBA', (tw + 80, th + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.rounded_rectangle([6, 6, tw + 74, th + 34], 26, fill=col + (255,), outline=WHITE + (255,), width=8)
    d.text((40, 6), text, font=font, fill=WHITE)
    lay = lay.rotate(rot, expand=True, resample=Image.BICUBIC)
    lay = lay.resize((max(1, int(lay.width * k)), max(1, int(lay.height * k))), Image.BILINEAR)
    fr.paste(lay, (int(cx - lay.width / 2), int(cy - lay.height / 2)), lay)


def lower(fr, d, t):
    a, b = C.LOWER
    if not a <= t < b:
        return
    k = ease((t - a) / .3) * (1 - ease((t - b + .3) / .3))
    x = CARD[0] + 30 - int((1 - k) * 420); y = CARD[3] - 150
    d.rectangle([x, y, x + 400, y + 112], fill=ORANGE)
    d.text((x + 24, y + 6), 'Jotabe', font=f('Bold', 50), fill=WHITE)
    d.text((x + 24, y + 64), 'criador do @jotabe.ia', font=f('SemiBold', 28), fill=WHITE)


def chips(fr, d, t):
    if not C.CHIPS[0][0] - .05 <= t < C.CHIPS_END:
        return
    out = ease((t - C.CHIPS_END + .25) / .25)
    x = CARD[0] + 26; y = CARD[3] - 120
    for t0, txt in C.CHIPS:
        k = back((t - t0) / .25)
        if k <= 0.01:
            continue
        w = int(d.textlength(txt, font=f('Bold', 36))) + 74
        yy = y + int(out * 200)
        d.rounded_rectangle([x, yy, x + w, yy + 76], 38, fill=WHITE, outline=ORANGE, width=4)
        d.ellipse([x + 16, yy + 24, x + 44, yy + 52], fill=ORANGE)
        d.text((x + 56, yy + 12), txt, font=f('Bold', 36), fill=INK)
        x += w + 14


def ten(fr, d, t):
    a, b = C.TEN
    if not a <= t < b:
        return
    stamp(fr, '10%', 760, 600, a, t, RED, F_BIG, rot=-10)
    k = ease((t - a - .3) / .6)
    x0, y = CARD[0] + 40, CARD[3] - 110; wbar = 820
    d.rounded_rectangle([x0, y, x0 + wbar, y + 64], 32, fill=(60, 50, 44))
    d.rounded_rectangle([x0, y, x0 + max(64, int(wbar * .10 * k)), y + 64], 32, fill=RED)
    d.text((x0 + 120, y + 8), 'o que a maioria usa', font=f('Bold', 36), fill=WHITE)


def manual(fr, d, t):
    a, b, items, ticks = C.MANUAL
    if not a <= t < b:
        return
    k = ease((t - a) / .35); x0 = CARD[0] + 70 + int((1 - k) * 900); y0 = CARD[1] + 150
    win = [x0, y0, x0 + 760, y0 + 470]
    d.rounded_rectangle(win, 26, fill=DARK, outline=(70, 66, 74), width=3)
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse([x0 + 26 + i * 34, y0 + 24, x0 + 48 + i * 34, y0 + 46], fill=c)
    d.text((x0 + 140, y0 + 16), 'skill.md', font=f('SemiBold', 30), fill=(200, 196, 206))
    d.text((x0 + 36, y0 + 78), 'Manual da tarefa', font=f('Bold', 46), fill=ORANGE)
    for i, (txt, tk) in enumerate(zip(items, ticks)):
        yy = y0 + 170 + i * 96; on = t >= tk; kk = back((t - tk) / .25)
        d.rounded_rectangle([x0 + 36, yy, x0 + 96, yy + 60], 14, fill=ORANGE if on else (60, 56, 64))
        if on:
            s = kk
            d.line([(x0 + 50, yy + 31), (x0 + 50 + 12 * s, yy + 31 + 12 * s), (x0 + 50 + 34 * s, yy + 31 - 14 * s)], fill=WHITE, width=8)
        d.text((x0 + 120, yy + 4), txt, font=f('Bold', 40), fill=WHITE if on else (150, 146, 156))


def skills(fr, t):
    a, b = C.SKILLS
    if a <= t < b:
        stamp(fr, 'SKILLS', W / 2, 760, a, t, ORANGE, f('ExtraBold', 140), rot=-6)


def cta(fr, d, t):
    if t < C.CTA:
        return
    k = ease((t - C.CTA) / .35)
    y = CARD[1] + 60 + int((1 - k) * 60)
    d.rounded_rectangle([CARD[0] + 40, y, CARD[0] + 640, y + 120], 30, fill=WHITE)
    d.ellipse([CARD[0] + 62, y + 24, CARD[0] + 134, y + 96], fill=(120, 110, 220))
    d.text((CARD[0] + 152, y + 10), 'você', font=f('SemiBold', 28), fill=GRAY)
    d.text((CARD[0] + 152, y + 44), 'JOTABÊ', font=f('Bold', 50), fill=INK)
    stamp(fr, 'Comenta JOTABÊ', W / 2, CARD[3] - 60, C.CTA + .15, t, ORANGE, f('ExtraBold', 84), rot=0)
    if t >= C.DM_AT:
        kk = back((t - C.DM_AT) / .25); w = int(380 * kk)
        if w > 20:
            x = W - CARD[0] - 40 - w
            d.rounded_rectangle([x, y + 150, x + w, y + 230], 40, fill=(39, 170, 80))
            if kk > .7:
                d.text((x + 30, y + 160), 'DM enviada', font=f('Bold', 40), fill=WHITE)
                cx = x + w - 70; d.line([(cx, y + 192), (cx + 12, y + 204), (cx + 36, y + 176)], fill=WHITE, width=8)


def phrases():
    out, cur = [], []
    for i, wd in enumerate(C.WORDS):
        cur.append(i)
        if wd[2][-1] in '.,?!' or len(cur) == 4:
            out.append(cur); cur = []
    if cur:
        out.append(cur)
    return out


PH = phrases()


def caption(d, t):
    grp = None
    for g in PH:
        if C.WORDS[g[0]][0] - .12 <= t:
            grp = g
    if grp is None or t > C.WORDS[grp[-1]][1] + .5 or t >= C.CTA:
        return
    words = [C.WORDS[i] for i in grp]
    sp = 22; widths = [d.textlength(w[2], font=F_CAP) for w in words]
    total = sum(widths) + sp * (len(words) - 1)
    lines = [list(range(len(words)))]
    if total > W - 120:
        half = len(words) // 2; lines = [list(range(half)), list(range(half, len(words)))]
    for li, ln in enumerate(lines):
        lw = sum(widths[j] for j in ln) + sp * (len(ln) - 1); x = (W - lw) / 2; y = 1265 + li * 100
        for j in ln:
            a, b, w = words[j]
            nxt = words[j + 1][0] if j + 1 < len(words) else b + .3
            if a <= t < min(b + .08, nxt):
                d.rounded_rectangle([x - 14, y + 6, x + widths[j] + 14, y + 96], 20, fill=ORANGE); col = WHITE
            else:
                col = INK if t >= a else GRAY
            d.text((x, y), w, font=F_CAP, fill=col); x += widths[j] + sp


def frame(bg, ex, env, fi):
    t = fi / FPS
    fr = bg.copy(); d = ImageDraw.Draw(fr)
    title(d, t)
    card(fr, ex, env, t, fi)
    d = ImageDraw.Draw(fr)
    lower(fr, d, t); chips(fr, d, t); ten(fr, d, t); manual(fr, d, t)
    if C.STAMP1[0] <= t < C.STAMP1[1]:
        stamp(fr, C.STAMP1[2], W / 2, CARD[1] + 120, C.STAMP1[0], t)
    skills(fr, t); cta(fr, d, t); caption(d, t)
    return fr


def main():
    folder, envf, out = sys.argv[1:4]
    env = [int(c) / 9 for c in open(envf).read().strip()]
    bg, ex = background(), load_expr(folder)
    n = int(C.DUR * FPS)
    if len(sys.argv) > 4:  # quadros de teste: lista de segundos
        for s in sys.argv[4].split(','):
            frame(bg, ex, env, int(float(s) * FPS)).save(f'{out}_{s}.png')
        return
    ff = subprocess.Popen(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                           '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', out],
                          stdin=subprocess.PIPE)
    for i in range(n):
        ff.stdin.write(frame(bg, ex, env, i).tobytes())
    ff.stdin.close(); ff.wait()


if __name__ == '__main__':
    main()
