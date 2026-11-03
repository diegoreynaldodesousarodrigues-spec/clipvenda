// @ts-nocheck
"use client";
import { useEffect } from "react";
export default function Page(){
useEffect(()=>{
const $=(id)=>document.getElementById(id);
const S={pro:false,credits:3,style:0,fmt:0,blob:null,mime:'',busy:false};
const STY=[{n:'Moderno',s:'Azul e ciano',c:['#1b2cff','#00c2a8'],t:'#fff'},{n:'Promoção',s:'Vermelho e amarelo',c:['#e5173f','#ffb800'],t:'#fff'},{n:'Elegante',s:'Preto e dourado',c:['#0a0a0a','#8a6a1f'],t:'#f5d98a'}];
const FMT=[{n:'Vertical',s:'9:16 Stories',w:540,h:960,free:1},{n:'Quadrado',s:'1:1 Feed',w:720,h:720},{n:'Horizontal',s:'16:9 YouTube',w:960,h:540}];
const cv=$('cv'); const cx=cv?.getContext('2d'); const vid=$('vid'); if(!cv||!cx) return;
const statusEl=()=>{const el=$('status'); if(el) el.innerHTML=S.pro?`Pro · <b>${S.credits}</b> créditos`:`Teste · <b>${S.credits}</b> de 3`};
function build(){const se=$('styles'); if(se) se.innerHTML=STY.map((x,i)=>`<button class="opt" aria-pressed="${i==S.style}" data-s="${i}">${x.n}<small>${x.s}</small></button>`).join(''); const fe=$('fmts'); if(fe) fe.innerHTML=FMT.map((x,i)=>{const lk=!x.free&&!S.pro; return `<button class="opt" aria-pressed="${i==S.fmt}" data-f="${i}">${x.n} ${lk?'<span class="lock">🔒</span>':''}<small>${x.s}</small></button>`}).join(''); document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{S.style=+b.dataset.s; build(); draw(2.5)}); document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=FMT[+b.dataset.f]; if(!f.free&&!S.pro){ask('Esse tamanho é do Pro','Assine para liberar'); return} S.fmt=+b.dataset.f; build(); draw(2.5)}); statusEl(); size();}
function size(){const f=FMT[S.fmt]; cv.width=f.w; cv.height=f.h}
function wrap(t,x,y,maxw,lh){const words=t.split(' '); let l='',ls=[]; words.forEach(w=>{const tt=l?l+' '+w:w; if(cx.measureText(tt).width>maxw&&l){ls.push(l); l=w}else l=tt}); ls.push(l); ls.forEach((s,i)=>cx.fillText(s,x,y+i*lh-(ls.length-1)*lh/2))}
function draw(t){size(); const W=cv.width,H=cv.height,st=STY[S.style],u=Math.min(W,H)/540; const g=cx.createLinearGradient(0,0,W*Math.cos(t/2)*.6+W*.4,H); g.addColorStop(0,st.c[0]); g.addColorStop(1,st.c[1]); cx.fillStyle=g; cx.fillRect(0,0,W,H); cx.globalAlpha=.15; cx.fillStyle='#fff'; for(let i=0;i<5;i++){cx.beginPath(); cx.arc(W*(.15+.18*i),H*(.5+.35*Math.sin(t+i*1.7)),40*u+i*14*u,0,7); cx.fill()} cx.globalAlpha=1; const sc=t<2?0:t<4?1:2,lt=t-sc*2,a=Math.min(1,lt*3,(2-lt)*3),off=(1-Math.min(1,lt*3))*40*u; cx.globalAlpha=Math.max(0,a); cx.fillStyle=st.t; cx.textAlign='center'; cx.textBaseline='middle'; const nm=$('nome')?.value,of=$('oferta')?.value,pr=$('preco')?.value,ct=$('cta')?.value; if(sc==0){if(window.pic) window.pic(); cx.font=`800 ${58*u}px Sora,sans-serif`; wrap(nm,W/2,window.PH?H*.82+off:H/2+off,W*.84,66*u)} if(sc==1){if(window.cover) window.cover(.3*a); cx.globalAlpha=Math.max(0,a); cx.font=`800 ${44*u}px Sora,sans-serif`; wrap(of,W/2,H*.4+off,W*.82,54*u); cx.font=`400 ${25*u}px Sora,sans-serif`; wrap($('desc').value.slice(0,110),W/2,H*.64+off,W*.78,34*u)} if(sc==2){cx.font=`800 ${60*u}px Sora,sans-serif`; wrap(pr,W/2,H*.42+off,W*.84,68*u); const bw=Math.min(W*.8,420*u),bh=64*u,by=H*.62; cx.fillStyle=st.t; cx.beginPath(); cx.roundRect(W/2-bw/2,by,bw,bh,bh/2); cx.fill(); cx.fillStyle=st.c[0]; cx.font=`800 ${24*u}px Sora,sans-serif`; cx.fillText(ct,W/2,by+bh/2)} cx.globalAlpha=1; if(!S.pro){cx.fillStyle='rgba(255,255,255,.75)'; cx.font=`600 ${16*u}px Sora,sans-serif`; cx.fillText('Feito com ClipVenda',W/2,H-24*u)}}
function ask(t,p){$('dt').textContent=t; $('dp').textContent=p; $('dlg').showModal()}
const dlg=$('dlg'); $('dok').onclick=()=>{dlg.close(); $('planos')?.scrollIntoView({behavior:'smooth'})};
window.subscribe=()=>{S.pro=true; S.credits=40; const m=$('msg'); if(m) m.textContent='Assinatura ativa! 40 créditos.'; build(); draw(2.5)};
const genBtn=$('gen');
if(genBtn) genBtn.onclick=async()=>{
if(S.busy) return; if(S.credits<1){ask('Seus créditos acabaram','Assine o Pro'); return}
if(window.lastFile){
S.busy=true; genBtn.disabled=true; $('msg').textContent='Gerando com movimento real... pode levar 30s'; $('prog').style.width='30%';
try{const fd=new FormData(); fd.append("file",window.lastFile); fd.append("nome",$('nome').value); fd.append("descricao",$('desc').value+" "+$('acao').value); const res=await fetch("/api/videos",{method:"POST",body:fd}); const data=await res.json(); if(!res.ok) throw new Error(data.error||'erro'); vid.src=data.url; vid.style.display='block'; cv.style.display='none'; S.blob={}; S.credits--; S.busy=false; genBtn.disabled=false; $('prog').style.width='100%'; finish(); statusEl(); return;}catch(e){$('msg').textContent='Erro: '+e.message+' - usando animação rápida'; S.busy=false; genBtn.disabled=false;}
}
S.busy=true; genBtn.disabled=true; $('dl').style.display='none'; vid.style.display='none'; cv.style.display=''; $('msg').textContent='Criando seu vídeo…';
const mimes=['video/mp4;codecs=avc1','video/webm;codecs=vp9','video/webm']; S.mime=mimes.find(m=>window.MediaRecorder.isTypeSupported(m))||''; const rec=new window.MediaRecorder(cv.captureStream(30),S.mime?{mimeType:S.mime,videoBitsPerSecond:4e6}:{}),ch=[]; rec.ondataavailable=e=>e.data.size&&ch.push(e.data); rec.onstop=()=>{S.blob=new Blob(ch,{type:rec.mimeType}); S.mime=rec.mimeType; S.credits--; S.busy=false; genBtn.disabled=false; vid.src=URL.createObjectURL(S.blob); vid.style.display='block'; cv.style.display='none'; finish(); statusEl()}; const t0=performance.now(); rec.start(); (function loop(){const t=(performance.now()-t0)/1000; draw(Math.min(t,5.99)); $('prog').style.width=Math.min(100,t/6*100)+'%'; if(t<6) requestAnimationFrame(loop); else rec.stop()})();};
function finish(){$('msg').textContent='Pronto! Confira o vídeo e baixe abaixo.'; const mp4=S.mime.includes('mp4'),ext=mp4?'mp4':'webm'; $('dfmt').innerHTML=`<option value="${ext}">Vídeo ${ext.toUpperCase()}</option><option value="png">Imagem PNG</option>`; $('dl').style.display='block';}
$('dbtn').onclick=()=>{const v=$('dfmt').value,a=document.createElement('a'),base='clipvenda-'+$('nome').value.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-'); if(v=='png'){draw(2.5); a.href=cv.toDataURL('image/png'); a.download=base+'.png'; cv.style.display='';}else{a.href=vid.src; a.download=base+'.'+v} document.body.appendChild(a); a.click(); a.remove();};
build(); draw(2.5); ['nome','oferta','preco','cta','desc','acao'].forEach(i=>{const el=$(i); if(el) el.oninput=()=>{if(!S.busy&&cv.style.display!='none') draw(2.5)}});
const chat=$('chat'),cin=$('cin'),fi=$('file'),pv=$('prev'); window.PH=null;
window.pic=function(){const im=window.PH; if(!im) return; const W=cv.width,H=cv.height,bw=W*.74,bh=H*.52,r=Math.min(bw/im.width,bh/im.height),w=im.width*r,h=im.height*r,x=(W-w)/2,y=H*.08+(bh-h)/2; cx.save(); cx.beginPath(); cx.roundRect(x,y,w,h,24); cx.clip(); cx.drawImage(im,x,y,w,h); cx.restore()};
window.cover=function(al){const im=window.PH; if(!im) return; const W=cv.width,H=cv.height,r=Math.max(W/im.width,H/im.height),w=im.width*r,h=im.height*r; cx.save(); cx.globalAlpha=al; cx.drawImage(im,(W-w)/2,(H-h)/2,w,h); cx.restore()};
function msg(t,c){if(!chat) return; const d=document.createElement('div'); d.className='m '+c; d.appendChild(document.createTextNode(t)); chat.appendChild(d); chat.scrollTop=chat.scrollHeight; return d}
$('att').onclick=()=>fi.click();
fi.onchange=()=>{const f=fi.files[0]; if(!f) return; window.lastFile=f; const im=new Image(); const purl=URL.createObjectURL(f); im.onload=()=>{window.PH=im; if(pv){pv.innerHTML=''; const t=document.createElement('img'); t.src=purl; const s=document.createElement('span'); s.textContent='Foto anexada'; const x=document.createElement('button'); x.className='ghost'; x.type='button'; x.textContent='Remover'; x.onclick=()=>{window.lastFile=null; window.PH=null; pv.innerHTML=''; draw(2.5)}; pv.append(t,s,x);} draw(0.5)}; im.src=purl};
async function send(){const t=cin?.value?.trim(); if(!chat||!cin) return; if((!t&&!window.lastFile)) return; $('csend').disabled=true; msg(t||'Segue a foto.','u'); cin.value=''; const w=msg('Lendo...','a'); try{let imagemBase64=null; if(window.lastFile){imagemBase64=await new Promise(res=>{const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(window.lastFile);});} const cur=JSON.stringify({nome:$('nome')?.value,oferta:$('oferta')?.value,preco:$('preco')?.value,cta:$('cta')?.value,desc:$('desc')?.value}); const ins='Responda SOMENTE JSON: {"resposta":"mensagem curta","nome":"nome","oferta":"oferta","preco":"preço","cta":"cta","desc":"desc","acao":"acao","roteiro":"roteiro","estilo":"Moderno"} Estado: '+cur; const resp=await fetch('/api/gerar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:ins+'\nMensagem:'+t,imagem:imagemBase64})}); const jj=await resp.json(); if(!resp.ok) throw new Error(jj.erro||'erro'); let rrr=jj.texto||''; const mmm=rrr.match(/\{[\s\S]*\}/); if(mmm) rrr=mmm[0]; rrr=rrr.replace(/```json|```/g,'').trim(); const r=JSON.parse(rrr); const set=(id,v,m)=>{const el=$(id); if(typeof v=='string'&&v.trim()&&el) el.value=v.trim().slice(0,m)}; set('nome',r.nome,40); set('oferta',r.oferta,60); set('preco',r.preco,24); set('cta',r.cta,30); set('desc',r.desc,300); set('acao',r.acao,300); set('roteiro',r.roteiro,300); draw(2.5); if(w) w.textContent=(r.resposta||'Pronto!')+'\nClique em Gerar vídeo.'}catch(e){if(w) w.textContent='Erro: '+e.message} $('csend').disabled=false;}
$('csend').onclick=send; cin.onkeydown=e=>{if(e.key=='Enter'&&!e.shiftKey){e.preventDefault(); send()}};
},[]);
return(<><style>{`
:root{--bg:#f3f6ff;--panel:#fff;--ink:#0c1433;--mut:#5a6591;--line:#d9e0f7;--ac:#4a4dff;--ac2:#00c2a8}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Sora,system-ui,sans-serif}
.w{max-width:1040px;margin:0 auto;padding:0 18px}
header{display:flex;justify-content:space-between;align-items:center;padding:16px 0}
.logo{font-weight:800;font-size:22px}.logo i{font-style:normal;color:var(--ac)}
.pill{background:var(--panel);border:1px solid var(--line);border-radius:99px;padding:6px 14px;font-size:14px}
h1{font-size:clamp(28px,5vw,48px);line-height:1.1;margin:24px 0 12px;font-weight:800}
.lead{color:var(--mut);max-width:50ch}
button,.btn{font:inherit;font-weight:600;border:0;border-radius:12px;padding:12px 18px;cursor:pointer;background:var(--ac);color:#fff}
button.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.app{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;margin:24px 0}
@media(max-width:800px){.app{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px}
.step{display:flex;gap:12px;margin-bottom:20px}.n{width:28px;height:28px;border-radius:50%;background:var(--ac);color:#fff;display:grid;place-items:center;font-weight:800;font-size:14px;flex:none}
label{display:block;font-size:13px;font-weight:600;margin:8px 0 4px}
input,textarea,select{width:100%;font:inherit;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg)}
.opts{display:flex;gap:8px;flex-wrap:wrap}.opt{flex:1 1 90px;border:2px solid var(--line);border-radius:12px;padding:10px;text-align:center;cursor:pointer;background:var(--bg);font-weight:600;font-size:14px}
.opt small{display:block;color:var(--mut);font-weight:400;font-size:12px}
.opt[aria-pressed=true]{border-color:var(--ac)}
.stage{display:flex;justify-content:center;background:#05081a;border-radius:12px;padding:12px;min-height:260px;align-items:center}
canvas,video{max-width:100%;max-height:420px;border-radius:8px;background:#000}
video{display:none}.bar{height:8px;background:var(--line);border-radius:9px;overflow:hidden;margin-top:12px}.bar div{height:100%;width:0;background:var(--ac2);transition:width .2s}
.msg{font-size:14px;color:var(--mut);margin:8px 0 0;min-height:20px}
.m{padding:8px 12px;border-radius:12px;margin:6px 0;max-width:90%}.m.u{background:var(--ac);color:#fff;margin-left:auto}.m.a{background:var(--panel);border:1px solid var(--line)}
#chat{max-height:220px;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:8px;margin:8px 0;background:var(--panel)}
#prev{display:flex;gap:8px;align-items:center;margin:8px 0}#prev img{width:48px;height:48px;object-fit:cover;border-radius:8px}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:12px 0 40px}
.price{font-size:28px;font-weight:800}footer{color:var(--mut);font-size:12px;padding:20px 0}
`}</style>
<div className="w">
<header><div className="logo"><i>Clip</i>Venda</div><div id="status" className="pill">Teste · <b>3</b> de 3</div></header>
<h1>Transforme foto e texto em vídeo de venda</h1><p className="lead">Anexe a foto do produto, fale com a IA e gere o vídeo pronto pra Stories, Feed ou YouTube.</p>
<div className="app">
<div className="card">
<div className="step"><div className="n">1</div><div style={{width:'100%'}}><h3>Converse com a IA</h3><div id="chat"></div><div id="prev"></div><div style={{display:'flex',gap:'8px'}}><button id="att" className="ghost" type="button">Foto</button><input id="file" type="file" accept="image/*" style={{display:'none'}} /><input id="cin" placeholder="Ex: tenis vermelho tamanho 42..." style={{flex:1}} /><button id="csend" type="button">Enviar</button></div></div></div>
<div className="step"><div className="n">2</div><div style={{width:'100%'}}><h3>Dados da oferta</h3><label>Nome</label><input id="nome" defaultValue="Meu Produto" /><label>Oferta</label><input id="oferta" defaultValue="Oferta Imperdivel!" /><label>Preco</label><input id="preco" defaultValue="R$ 97,90" /><label>CTA</label><input id="cta" defaultValue="Compre Agora" /><label>Descricao</label><textarea id="desc" defaultValue="Produto de alta qualidade"></textarea><label>Acao</label><textarea id="acao" defaultValue="Mostrar produto girando"></textarea><input id="roteiro" type="hidden" /></div></div>
<div className="step"><div className="n">3</div><div><h3>Estilo e Formato</h3><label>Estilo</label><div id="styles" className="opts"></div><label>Formato</label><div id="fmts" className="opts"></div></div></div>
<button id="gen" type="button">Gerar video</button><div className="bar"><div id="prog"></div></div><div id="msg" className="msg">Pronto para gerar.</div>
</div>
<div className="card"><div className="stage"><canvas id="cv"></canvas><video id="vid" controls playsInline></video></div><div id="dl" style={{display:'none',marginTop:'12px'}}><label>Baixar como</label><select id="dfmt"></select><button id="dbtn" type="button" style={{width:'100%',marginTop:'8px'}}>Baixar</button></div></div>
</div>
<h2 id="planos">Planos</h2><div className="plans"><div className="card"><h3>Teste</h3><div className="price">R$0</div><ul><li>3 videos</li><li>Marca dagua</li></ul></div><div className="card"><h3>Pro</h3><div className="price">R$29/mes</div><ul><li>40 videos/mes</li><li>Sem marca</li><li>Video com movimento real</li></ul><button type="button" onClick={()=>window.subscribe()}>Assinar Pro</button></div></div>
<footer>ClipVenda 2026</footer><dialog id="dlg"><h3 id="dt"></h3><p id="dp"></p><button id="dok" type="button">OK</button></dialog>
</div>
</>);
}
