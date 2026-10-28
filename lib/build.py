import sys,os,re,json
d=sys.argv[1]; cfg=json.load(open(f'{d}/cfg.json'))
base=open(os.path.join(os.path.dirname(__file__),'base.css')).read()
tail=open(os.path.join(os.path.dirname(__file__),'tail.js')).read()
fonts='''@font-face{font-family:"Inter Display";font-weight:900;src:url(../reel3/fonts/InterDisplay-Black.otf)}
@font-face{font-family:"Inter Display";font-weight:800;src:url(../reel3/fonts/InterDisplay-ExtraBold.otf)}
@font-face{font-family:"Inter Display";font-weight:700;src:url(../reel3/fonts/InterDisplay-Bold.otf)}
@font-face{font-family:"Inter Display";font-weight:500;src:url(../reel3/fonts/InterDisplay-Medium.otf)}
@font-face{font-family:JB;src:url(../reel3/node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2)}
@font-face{font-family:JB;font-weight:800;src:url(../reel3/node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-800-normal.woff2)}
'''
base=re.sub(r'@font-face[^\n]*\n','',base)
html=f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>{fonts}{base}{open(f"{d}/extra.css").read()}</style></head><body>
<div id="stage"><div class="glow" id="glow"></div><div class="grid"></div>
<div class="top"><span>{cfg["label"]}</span><span id="clock">00:00</span></div><div class="prog"><i id="bar"></i></div>
{open(f"{d}/body.html").read()}
<div id="cap"></div><div class="foot"><span>@jotabe.ia</span><span>salva pra <b>não perder</b></span></div>
<div class="flash" id="flash"></div><div class="grain"></div></div>
<script src="../reel3/node_modules/gsap/dist/gsap.min.js"></script><script src="words.js"></script>
<script>
const D={cfg["D"]}; window.END={cfg["END"]}; const tl=gsap.timeline({{paused:true}}), E="expo.out";
function inLines(sel,t){{tl.from(sel+" .line>span",{{yPercent:110,duration:.6,ease:E,stagger:.08}},t)}}
function show(id,t){{tl.set(id,{{opacity:1}},t)}}
function hide(id,t){{tl.to(id,{{opacity:0,y:-60,duration:.3,ease:"power2.in"}},t)}}
function flash(t,c){{tl.set("#flash",{{background:c||"#ff6a1a"}},t);tl.fromTo("#flash",{{opacity:0}},{{opacity:.5,duration:.06,yoyo:true,repeat:1,ease:"none"}},t)}}
function kick(id,t){{tl.from(id+" .k",{{opacity:0,x:-40,duration:.4,ease:E}},t)}}
function shake(t,a){{tl.fromTo("#stage",{{x:0}},{{x:a||10,duration:.04,yoyo:true,repeat:5,ease:"none"}},t)}}
function steps(t,a,b,c){{tl.from("#free",{{scale:0,opacity:0,duration:.35,ease:"back.out(2)"}},t+.1);tl.from("#st1",{{x:-90,opacity:0,duration:.3,ease:E}},a);tl.from("#st2",{{x:-90,opacity:0,duration:.3,ease:E}},b);tl.from("#st3",{{x:-90,opacity:0,scale:.9,duration:.35,ease:"back.out(2)"}},c);shake(c+.05)}}
function cta(t,b){{flash(t);show("#cta",t);inLines("#cta",t+.05);tl.from("#box",{{scale:0,rotation:-8,duration:.55,ease:"back.out(1.8)"}},b);tl.to("#box",{{scale:1.06,duration:.4,yoyo:true,repeat:3,ease:"sine.inOut"}},b+.6);tl.from("#cm",{{y:120,opacity:0,duration:.6,ease:E}},b+.9)}}
tl.to("#glow",{{x:120,y:-200,scale:1.15,duration:D,ease:"sine.inOut"}},0);
{open(f"{d}/anim.js").read()}
tl.set({{}},{{}},D);
{tail}
</script></body></html>'''
ic='/tmp/claude-0/coolicons/icons/svg/duotone/regular/'
def rep(m):
    f=ic+m.group(1)+'.svg'
    if not os.path.exists(f): print('MISSING',m.group(1)); return ''
    return open(f).read().replace('\n','')
open(f'{d}/index.html','w').write(re.sub(r'\{\{([a-z0-9-]+)\}\}',rep,html))
times=cfg["prev"]
r=open('/tmp/claude-0/aiox/reel4/render.js').read().replace('D = 26.2',f'D = {cfg["D"]}').replace('[1.2, 2.4, 5.4, 9.0, 11.6, 15.5, 21.6, 24.8]',json.dumps(times))
open(f'{d}/render.js','w').write(r)
w=[[round(float(x.split(':',1)[0])/cfg.get("tempo",1),3),x.split(':',1)[1]] for x in cfg["words"].split(' ')]
open(f'{d}/words.js','w').write('window.W='+json.dumps(w,ensure_ascii=False)+';')
print('built',d)
