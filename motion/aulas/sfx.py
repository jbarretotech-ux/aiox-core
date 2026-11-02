import numpy as np,json,sys,wave
sr=48000;D=float(sys.argv[2]);ev=json.load(open(sys.argv[1]))
out=np.zeros(int(sr*(D+1)))
rng=np.random.default_rng(7)
def t(d):return np.arange(int(sr*d))/sr
def whoosh():
    d=0.38;x=rng.standard_normal(len(t(d)))
    a=np.convolve(x,np.ones(6)/6,'same');b=x-np.convolve(x,np.ones(40)/40,'same')
    env=np.sin(np.pi*t(d)/d)**2;mix=(a*(1-t(d)/d)+b*(t(d)/d))*env
    return 0.35*mix/np.abs(mix).max()
def pop():
    tt=t(0.14);f=500+900*np.exp(-tt*40);ph=2*np.pi*np.cumsum(f)/sr
    return 0.5*np.sin(ph)*np.exp(-tt*28)
def click():
    tt=t(0.025);return 0.18*rng.standard_normal(len(tt))*np.exp(-tt*350)
def ding():
    tt=t(0.7);return 0.28*(np.sin(2*np.pi*1320*tt)+0.5*np.sin(2*np.pi*1980*tt))*np.exp(-tt*6)
def tick():
    tt=t(0.04);return 0.25*np.sin(2*np.pi*2200*tt)*np.exp(-tt*120)
def boom():
    tt=t(0.5);f=120*np.exp(-tt*4)+40;ph=2*np.pi*np.cumsum(f)/sr
    return 0.7*np.sin(ph)*np.exp(-tt*7)
def scribble():
    tt=t(0.45);x=rng.standard_normal(len(tt));x=x-np.convolve(x,np.ones(8)/8,'same')
    return 0.15*x*(0.6+0.4*np.sin(2*np.pi*14*tt))*np.exp(-tt*2)
S=dict(whoosh=whoosh,pop=pop,click=click,ding=ding,tick=tick,boom=boom,scribble=scribble)
for e in ev:
    if e[1] in('type','ticks'):
        k=e[0]
        while k<e[2]:
            s=click() if e[1]=='type' else tick();i=int(k*sr);out[i:i+len(s)]+=s;k+=0.07 if e[1]=='type' else 0.08
        continue
    s=S[e[1]]();i=int(e[0]*sr);out[i:i+len(s)]+=s[:len(out)-i]
out=np.clip(out,-1,1);w=wave.open(sys.argv[3],'w');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
