"""Junta as falas (vc/NN.wav) na linha do tempo, com trilha calma e efeitos. Gera voz.wav e audio.wav.
Passo 1: python mix.py durs   -> durs.json (duração de cada fala)
Passo 2: python build_tl.py durs.json
Passo 3: python mix.py mix    -> audio.wav"""
import sys, json, glob, subprocess, numpy as np, soundfile as sf
SR = 44100
def load(p):
    x, sr = sf.read(p, always_2d=False)
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        n = int(len(x) * SR / sr); x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)
    return x
if sys.argv[1] == 'durs':
    fs = sorted(glob.glob('vc/*.wav'))
    json.dump([round(sf.info(f).duration, 3) for f in fs], open('durs.json', 'w')); print(len(fs)); sys.exit()

TL = json.loads(open('timeline.js').read()[len('window.TL='):-1]); ev = json.load(open('events.json'))
N = int(TL['total'] * SR); voz = np.zeros(N); rng = np.random.default_rng(3)
for i, b in enumerate(TL['beats']):
    x = load(f'vc/{i:02d}.wav'); s = int(b['s'] * SR)
    fade = np.minimum(1, np.minimum(np.arange(len(x)), np.arange(len(x))[::-1]) / (SR * .01))
    voz[s:s + len(x)] += (x * fade)[:N - s]
sf.write('voz_raw.wav', voz, SR)
# limpa chiado e nivela a fala
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'voz_raw.wav', '-af',
                'highpass=f=70,afftdn=nf=-25,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5:LRA=9',
                '-ar', str(SR), '-ac', '1', 'voz.wav'], check=True)
voz = load('voz.wav')[:N]; voz = np.pad(voz, (0, N - len(voz)))
t = np.arange(N) / SR
# trilha calma: acordes suaves (sem direitos autorais), bem baixa
chords = [[220, 277.2, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 329.6]]
mus = np.zeros(N); seg = 4.0
for k in range(int(TL['total'] / seg) + 1):
    a = int(k * seg * SR); n = min(N - a, int((seg + 1.5) * SR))
    if n <= 0: break
    tt = np.arange(n) / SR; env = np.minimum(tt / 1.2, 1) * np.exp(-np.maximum(tt - seg, 0) / .5)
    mus[a:a + n] += sum(np.sin(2 * np.pi * f * tt) * .5 + .15 * np.sin(4 * np.pi * f * tt) for f in chords[k % 4]) * env
mus = mus / np.abs(mus).max()
speech = np.convolve(np.abs(voz), np.ones(int(SR * .3)) / (SR * .3), 'same')
duck = 1 - .6 * np.clip(speech / (np.percentile(speech, 90) + 1e-9), 0, 1)
mus *= .07 * duck
# efeitos
def whoosh():
    n = int(SR * .45); x = rng.standard_normal(n)
    x = np.convolve(x, np.ones(6) / 6, 'same') * np.sin(np.linspace(0, np.pi, n)) ** 2; return x * .25
def pop():
    n = int(SR * .1); tt = np.arange(n) / SR; return np.sin(2 * np.pi * (1000 - 5000 * tt) * tt) * np.exp(-tt / .025) * .35
def tick():
    n = int(SR * .5); tt = np.arange(n) / SR; return (np.sin(2 * np.pi * 1318 * tt) + .5 * np.sin(2 * np.pi * 1976 * tt)) * np.exp(-tt / .15) * .18
fx = np.zeros(N)
def put(x, at):
    a = int(at * SR); b = min(N, a + len(x)); fx[a:b] += x[:b - a]
for s in ev['starts'][1:]: put(whoosh(), s - .1)
for s in ev['chapters'][1:]: put(tick(), s)
for s in ev['clicks']: put(pop(), s)
out = voz + mus + fx
out /= max(1, np.abs(out).max() / .95)
sf.write('audio.wav', out, SR); print('ok', round(N / SR, 1))
