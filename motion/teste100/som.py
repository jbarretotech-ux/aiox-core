# Trilha (batida de coração ~92 bpm + pad) e efeitos sonoros, sintetizados em código (numpy).
# Uso: python3 som.py trilha.wav sfx.wav
import sys, wave
import numpy as np
import cena as C

SR = 48000
N = int(C.DUR * SR)
rng = np.random.default_rng(7)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def thump(f0, dur, amp):
    t = np.arange(int(dur * SR)) / SR
    f = f0 * (1 + 1.5 * np.exp(-t * 30))
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .004, dur / 4)


def trilha():
    out = np.zeros(N); beat = 60 / 92
    for k in range(int(C.DUR / beat) + 1):
        i = int(k * beat * SR)
        for off, amp in ((0, .55), (.17, .35)):  # tum-tum
            s = thump(55, .35, amp); j = i + int(off * SR)
            out[j:j + len(s)] += s[:max(0, N - j)]
    t = np.arange(N) / SR
    pad = sum(np.sin(2 * np.pi * fr * t) for fr in (110, 164.8, 220)) * .045
    pad *= .6 + .4 * np.sin(2 * np.pi * t / 8)
    lp = np.convolve(rng.normal(0, 1, N), np.ones(400) / 400, 'same') * .25  # ar suave
    return out + pad + lp


def whoosh():
    n = int(.4 * SR); x = rng.normal(0, 1, n); t = np.arange(n) / n
    y = np.zeros(n); a = 0.0
    for i in range(n):  # passa-baixa que abre e fecha
        c = .02 + .5 * np.sin(np.pi * t[i]) ** 2; a += c * (x[i] - a); y[i] = a
    return y * np.sin(np.pi * t) ** 1.5 * .6


def pop():
    t = np.arange(int(.12 * SR)) / SR
    return .5 * np.sin(2 * np.pi * (900 - 2500 * t) * t) * np.exp(-t * 40)


def tick():
    t = np.arange(int(.06 * SR)) / SR
    return .45 * np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 90)


def plim():
    t = np.arange(int(.9 * SR)) / SR
    return sum(.22 * np.sin(2 * np.pi * f * t) * np.exp(-t * 5) for f in (1318.5, 1975.5, 2637))


def thud():
    s = thump(70, .5, .9); n = rng.normal(0, 1, len(s)) * env(len(s), .001, .03) * .4
    return s + n


def sfx():
    out = np.zeros(N); lib = {'whoosh': whoosh(), 'pop': pop(), 'tick': tick(), 'plim': plim(), 'thud': thud()}
    for t0, k in C.SFX:
        s = lib[k]; i = int(max(0, t0 - (.12 if k == 'whoosh' else 0)) * SR)
        out[i:i + len(s)] += s[:max(0, N - i)]
    return out


def save(fn, x):
    x = x / max(1e-9, np.abs(x).max()) * .89
    st = np.repeat((x * 32767).astype(np.int16)[:, None], 2, 1)
    with wave.open(fn, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())


if __name__ == '__main__':
    save(sys.argv[1], trilha()); save(sys.argv[2], sfx())
