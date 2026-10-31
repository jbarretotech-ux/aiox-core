const {chromium}=require('playwright');const fs=require('fs');
const [,,html,out,D,only]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+__dirname+'/'+html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
fs.mkdirSync(out,{recursive:true});
const ts=only?only.split(',').map(Number):[...Array(Math.round(D*30)).keys()].map(i=>i/30);
let i=0;for(const t of ts){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${out}/${only?'p'+t:String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:only?70:90});i++}
await b.close();console.log('ok',i)})();
