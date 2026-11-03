# Roteiro do vídeo "Você usa só 10% do Claude?" — tempos da voz original do Jota (30 s).
# Tudo aqui é dado: o render.py lê e desenha. Mudou a fala? Muda só este arquivo.

RAW = ("0.78,1.26,Fala|1.26,1.68,pessoal,|2.36,2.50,aqui|2.50,2.58,é|2.58,2.62,o|2.62,3.18,Jotabe,|3.24,3.32,tudo|"
       "3.32,3.56,bem?|4.56,4.68,Tudo|4.68,4.94,certo|4.94,5.20,por|5.20,5.40,aí?|6.46,6.84,Para|6.84,7.14,tudo|"
       "7.14,7.36,e|7.36,7.62,presta|7.62,8.12,atenção,|8.30,8.36,porque|8.36,8.44,o|8.44,8.50,que|8.50,8.60,eu|"
       "8.60,8.70,vou|8.70,8.80,te|8.80,9.12,mostrar|9.12,9.42,hoje|9.42,9.52,vai|9.52,9.74,mudar|9.74,9.94,o|"
       "9.94,10.24,jeito|10.24,10.48,que|10.48,10.68,você|10.68,11.08,trabalha|11.08,11.20,com|11.20,11.64,inteligência|"
       "11.64,12.16,artificial.|12.80,12.94,Eu|12.94,13.14,uso|13.14,13.32,o|13.32,13.52,Claude|13.52,14.00,todos|"
       "14.00,14.40,os|14.40,14.66,dias|14.66,14.96,para|14.96,15.22,criar|15.22,15.70,sites,|15.88,16.36,automações,|"
       "16.66,16.94,vídeos|16.94,17.12,e|17.12,17.64,conteúdo.|18.12,18.24,E|18.24,18.42,sabe|18.42,18.56,que|"
       "18.56,18.60,eu|18.60,19.02,descobri|19.02,19.58,que|19.58,19.66,a|19.66,19.84,maioria|19.84,20.08,das|"
       "20.08,20.72,pessoas|20.72,21.26,usa|21.26,21.50,só|21.50,22.34,10%|22.34,22.56,do|22.56,22.68,que|"
       "22.68,22.76,ele|22.76,23.02,consegue|23.02,23.38,fazer?|23.94,24.08,O|24.08,24.46,segredo|24.46,24.66,está|"
       "24.66,24.84,nas|24.84,25.12,skills.|25.68,25.86,Uma|25.86,26.16,skill|26.16,26.30,é|26.30,26.48,como|"
       "26.48,26.58,um|26.58,26.98,manual|26.98,27.26,que|27.26,27.68,ensina|27.68,28.36,a|28.36,28.60,fazer|"
       "28.60,28.78,uma|28.78,29.26,tarefa|29.26,29.38,do|29.38,29.54,jeito|29.54,29.86,certo.")
WORDS = [(float(a), float(b), w) for a, b, w in (x.split(',', 2) for x in RAW.split('|'))]

DUR = 33.0  # 30 s de voz + 3 s de chamada final

# expressão do Jota (recorte aprovado) a partir de cada segundo
EXPR = [(0.0, 'sorriso_forte'), (2.30, 'falando'), (4.50, 'sorriso_leve'), (6.40, 'surpreso'), (8.25, 'apontando'),
        (10.20, 'determinado'), (12.75, 'falando'), (15.10, 'sorriso_leve'), (18.05, 'pensativo'), (19.60, 'desconfiado'),
        (21.20, 'serio'), (23.90, 'sorriso_leve'), (24.80, 'piscando'), (25.60, 'falando'), (28.50, 'sorriso_forte'),
        (30.05, 'apontando'), (31.6, 'rindo')]

TITLE = ('Você usa só 10%', 'do Claude?')
LOWER = (2.36, 5.5)                       # tarja "Jotabe / criador do @jotabe.ia"
STAMP1 = (6.46, 8.25, 'PARA TUDO!')       # carimbo vermelho
CHIPS = [(15.22, 'Sites'), (15.88, 'Automações'), (16.66, 'Vídeos'), (17.12, 'Conteúdo')]
CHIPS_END = 17.95
TEN = (21.40, 23.85)                      # selo 10% + barra
SKILLS = (24.80, 25.65)                   # palavra SKILLS gigante
MANUAL = (25.75, 30.0, ['Passo a passo pronto', 'Faz do jeito certo', 'Toda vez, igualzinho'], [26.6, 28.6, 29.5])
CTA = 30.0                                # Comenta JOTABÊ + DM enviada
DM_AT = 31.4

# efeitos sonoros (tempo, tipo)
SFX = ([(t, 'whoosh') for t, _ in EXPR[1:]] + [(STAMP1[0], 'thud'), (TEN[0], 'thud')]
       + [(t, 'pop') for t, _ in CHIPS] + [(SKILLS[0], 'plim'), (MANUAL[0], 'whoosh')]
       + [(t, 'tick') for t in MANUAL[3]] + [(CTA + .1, 'pop'), (DM_AT, 'plim')])
