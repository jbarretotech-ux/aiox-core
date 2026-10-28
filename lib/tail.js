const CH=[];let cur=[];
W.forEach((w,i)=>{cur.push(i);if(/[.!?:,]$/.test(w[1])||cur.length===3){CH.push(cur);cur=[]}});if(cur.length)CH.push(cur);
const cap=document.getElementById("cap"), END=window.END;
function caption(t){
 let ci=-1;for(let k=0;k<CH.length;k++){if(W[CH[k][0]][0]<=t+0.02)ci=k}
 if(ci<0||t>END){cap.innerHTML="";return}
 const last=CH[ci][CH[ci].length-1];const ns=ci+1<CH.length?W[CH[ci+1][0]][0]:END;
 if(t>W[last][0]+0.9&&t<ns){cap.innerHTML="";return}
 cap.innerHTML=CH[ci].map(i=>`<span class="${W[i][0]<=t+0.02&&(i+1>=W.length||W[i+1][0]>t)?'on':''}">${W[i][1]}</span>`).join("");
}
window.DUR=D;
window.seek=t=>{tl.seek(t,false);caption(t);document.getElementById("bar").style.width=(t/D*100)+"%";document.getElementById("clock").textContent="00:"+String(Math.floor(t)).padStart(2,"0")};
window.seek(0);
