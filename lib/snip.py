def steps(a, b, c, icons, free):
    return f'''<section class="sc" id="s_st"><div class="k">de graça · rapidinho</div><div class="steps">
 <div class="st" id="st1"><div class="n ic">{{{{{icons[0]}}}}}</div><div class="t">{a}</div></div>
 <div class="st" id="st2"><div class="n ic">{{{{{icons[1]}}}}}</div><div class="t">{b}</div></div>
 <div class="st ok" id="st3"><div class="n ic">{{{{check-large}}}}</div><div class="t">{c}</div></div></div>
 <div><span class="free" id="free">{free}</span></div></section>'''


def cta(word, emoji, size=200, l1="Quer o", l2="passo a passo?"):
    return f'''<section class="sc" id="cta"><div class="cta"><span class="line"><span>{l1}</span></span><span class="line"><span>{l2}</span></span></div>
 <div><div class="box" id="box" style="font-size:{size}px">{word}</div></div><div class="cm" id="cm"><div class="av"></div><div><div class="u">você · agora</div><div class="t">{word} {emoji}</div></div></div></section>'''


CTACSS = '''.cta{font-weight:900;font-size:118px;line-height:.95;letter-spacing:-.045em}
.box{margin-top:50px;display:inline-block;background:var(--or);color:var(--bg);font-weight:900;letter-spacing:-.06em;padding:6px 56px 26px;border-radius:40px;line-height:1}
.cm{margin-top:56px;display:flex;gap:26px;align-items:center;background:var(--card);border:2px solid var(--line);border-radius:30px;padding:30px 34px;width:760px}
.av{width:92px;height:92px;border-radius:50%;background:linear-gradient(135deg,var(--or),#ffcf6a);flex:none}
.cm .u{font:800 30px JB;color:var(--mut)}.cm .t{font-weight:800;font-size:50px}
.big{font-weight:900;font-size:215px;letter-spacing:-.06em;line-height:.85;color:var(--or);white-space:nowrap}
.unit{font-weight:800;font-size:72px;letter-spacing:-.03em;margin-top:18px}
'''
