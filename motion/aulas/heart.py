import numpy as np,sys,wave
sr=48000;D=float(sys.argv[1]);bpm=float(sys.argv[2]);n=int(sr*D);out=np.zeros(n)
def thump(f0,dur,amp):
    t=np.arange(int(sr*dur))/sr;f=f0*(1+1.5*np.exp(-t*30));ph=2*np.pi*np.cumsum(f)/sr
    return amp*np.sin(ph)*np.exp(-t*9)*(1-np.exp(-t*400))
beat=60/bpm;t=0.0
while t<D:
    for off,f0,amp in ((0,58,0.9),(0.17,52,0.6)):
        s=thump(f0,0.45,amp);i=int((t+off)*sr)
        if i<n: out[i:i+len(s)]+=s[:n-i]
    t+=beat
chords=[[220,261.6,329.6],[174.6,220,261.6],[196,261.6,329.6],[196,246.9,293.7]]
tt=np.arange(n)/sr;bar=beat*4;pad=np.zeros(n)
for k in range(int(D/bar)+1):
    a,b=int(k*bar*sr),min(n,int((k+1)*bar*sr));seg=tt[a:b]-k*bar
    env=np.minimum(1,seg/0.4)*np.minimum(1,(bar-seg)/0.4)
    for f in chords[k%4]:
        pad[a:b]+=0.07*env*(np.sin(2*np.pi*f*tt[a:b])+0.3*np.sin(2*np.pi*2*f*tt[a:b]))
ph=(tt%beat)/beat;pad*=0.6+0.4*np.minimum(1,ph*4)
out=out+pad;out/=np.abs(out).max()*1.1
w=wave.open(sys.argv[3],'w');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
