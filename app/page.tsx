"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // COLEI TODO SEU SCRIPT ORIGINAL AQUI DENTRO, SEM MUDAR NADA
    // @ts-ignore
    const $ = (id: string) => document.getElementById(id);
    const S: any = { pro: false, credits: 3, style: 0, fmt: 0, blob: null, mime: '', busy: false };
    const STY = [{ n: 'Moderno', s: 'Azul e ciano', c: ['#1b2cff', '#00c2a8'], t: '#fff' }, { n: 'Promoção', s: 'Vermelho e amarelo', c: ['#e5173f', '#ffb800'], t: '#fff' }, { n: 'Elegante', s: 'Preto e dourado', c: ['#0a0a0a', '#8a6a1f'], t: '#f5d98a' }];
    const FMT = [{ n: 'Vertical', s: '9:16 Stories', w: 540, h: 960, free: 1 }, { n: 'Quadrado', s: '1:1 Feed', w: 720, h: 720 }, { n: 'Horizontal', s: '16:9 YouTube', w: 960, h: 540 }];
    const cv = $('cv') as HTMLCanvasElement, cx = cv.getContext('2d')!, vid = $('vid') as HTMLVideoElement;
    let expDays = 30;
    const statusEl = () => { const el = $('status'); if (el) el.innerHTML = S.pro ? `Pro · <b>${S.credits}</b> créditos` : `Teste · <b>${S.credits}</b> de 3` };
    
    function build() {
      const stylesEl = $('styles'); if(stylesEl) stylesEl.innerHTML = STY.map((x: any, i: number) => `<button class="opt" aria-pressed="${i == S.style}" data-s="${i}">${x.n}<small>${x.s}</small></button>`).join('');
      const fmtsEl = $('fmts'); if(fmtsEl) fmtsEl.innerHTML = FMT.map((x: any, i: number) => { const lk = !(x as any).free && !S.pro; return `<button class="opt" aria-pressed="${i == S.fmt}" data-f="${i}">${x.n} ${lk ? '<span class="lock">🔒</span>' : ''}<small>${x.s}</small></button>` }).join('');
      document.querySelectorAll('[data-s]').forEach(b => (b as any).onclick = () => { S.style = +(b as any).dataset.s; build(); draw(2.5) });
      document.querySelectorAll('[data-f]').forEach(b => (b as any).onclick = () => { const f: any = FMT[+(b as any).dataset.f]; if (!f.free && !S.pro) { ask('Esse tamanho é do Pro', 'Assine para liberar'); return } S.fmt = +(b as any).dataset.f; build(); draw(2.5) });
      statusEl(); size();
    }
    function size() { const f: any = FMT[S.fmt]; cv.width = f.w; cv.height = f.h }
    function wrap(t: string, x: number, y: number, maxw: number, lh: number) { const words = t.split(' '); let l = '', ls: string[] = []; words.forEach(w => { const tt = l ? l + ' ' + w : w; if (cx.measureText(tt).width > maxw && l) { ls.push(l); l = w } else l = tt }); ls.push(l); ls.forEach((s, i) => cx.fillText(s, x, y + i * lh - (ls.length - 1) * lh / 2)) }
    function draw(t: number) {
      size(); const W = cv.width, H = cv.height, st: any = STY[S.style], u = Math.min(W, H) / 540;
      const g = cx.createLinearGradient(0, 0, W * Math.cos(t / 2) * .6 + W * .4, H); g.addColorStop(0, st.c[0]); g.addColorStop(1, st.c[1]); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.globalAlpha = .15; cx.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { cx.beginPath(); cx.arc(W * (.15 + .18 * i), H * (.5 + .35 * Math.sin(t + i * 1.7)), 40 * u + i * 14 * u, 0, 7); cx.fill() } cx.globalAlpha = 1;
      const sc = t < 2 ? 0 : t < 4 ? 1 : 2, lt = t - sc * 2, a = Math.min(1, lt * 3, (2 - lt) * 3), off = (1 - Math.min(1, lt * 3)) * 40 * u;
      cx.globalAlpha = Math.max(0, a); cx.fillStyle = st.t; cx.textAlign = 'center'; cx.textBaseline = 'middle';
      const nm = ($('nome') as any)?.value, of = ($('oferta') as any)?.value, pr = ($('preco') as any)?.value, ct = ($('cta') as any)?.value;
      if (sc == 0) { if ((window as any).pic) (window as any).pic(); cx.font = `800 ${58 * u}px Sora,sans-serif`; wrap(nm, W / 2, (window as any).PH ? H * .82 + off : H / 2 + off, W * .84, 66 * u) }
      if (sc == 1) { if ((window as any).cover) (window as any).cover(.3 * a); cx.globalAlpha = Math.max(0, a); cx.font = `800 ${44 * u}px Sora,sans-serif`; wrap(of, W / 2, H * .4 + off, W * .82, 54 * u); cx.font = `400 ${25 * u}px Sora,sans-serif`; wrap(($('desc') as any).value.slice(0, 110), W / 2, H * .64 + off, W * .78, 34 * u) }
      if (sc == 2) { cx.font = `800 ${60 * u}px Sora,sans-serif`; wrap(pr, W / 2, H * .42 + off, W * .84, 68 * u); const bw = Math.min(W * .8, 420 * u), bh = 64 * u, by = H * .62; cx.fillStyle = st.t; cx.beginPath(); (cx as any).roundRect(W / 2 - bw / 2, by, bw, bh, bh / 2); cx.fill(); cx.fillStyle = st.c[0]; cx.font = `800 ${24 * u}px Sora,sans-serif`; cx.fillText(ct, W / 2, by + bh / 2) }
      cx.globalAlpha = 1;
      if (!S.pro) { cx.fillStyle = 'rgba(255,255,255,.75)'; cx.font = `600 ${16 * u}px Sora,sans-serif`; cx.fillText('Feito com ClipVenda', W / 2, H - 24 * u) }
    }
    function ask(t: string, p: string) { ($('dt') as any).textContent = t; ($('dp') as any).textContent = p; (dlg as any).showModal() }
    const dlg = $('dlg') as any; ($('dok') as any).onclick = () => { dlg.close(); $('planos')?.scrollIntoView({ behavior: 'smooth' }) };
    (window as any).subscribe = () => { S.pro = true; S.credits = 40; expDays = 30; const m = $('msg'); if(m) m.textContent = 'Assinatura ativa! 40 créditos.'; build(); draw(2.5) };
    (window as any).reset = () => { S.pro = false; S.credits = 3; S.fmt = 0; S.blob = null; const dl = $('dl'); if(dl) dl.style.display = 'none'; vid.style.display = 'none'; cv.style.display = ''; build(); draw(2.5) };

    const genBtn = $('gen') as any;
    if(genBtn) genBtn.onclick = async () => {
      if (S.busy) return; if (S.credits < 1) { ask('Seus créditos acabaram', 'Assine o Pro'); return }
      const fotoInput = document.getElementById('file') as any;
      if (fotoInput && (window as any).lastFile) {
        S.busy = true; genBtn.disabled = true;
        const msgEl = $('msg'); if(msgEl) msgEl.textContent = 'Gerando sua propaganda com movimento real... pode levar 30s, não feche.';
        const progEl = $('prog'); if(progEl) progEl.style.width = '30%';
        try {
          const fd = new FormData(); fd.append("file", (window as any).lastFile); fd.append("nome", ($('nome') as any).value); fd.append("descricao", ($('desc') as any).value + " " + ($('acao') as any).value);
          const res = await fetch("/api/videos", { method: "POST", body: fd }); const data = await res.json(); if (!res.ok) throw new Error(data.error || 'erro');
          vid.src = data.url; vid.style.display = 'block'; cv.style.display = 'none'; S.blob = {}; S.credits--; S.busy = false; genBtn.disabled = false;
          if(progEl) progEl.style.width = '100%'; finish(); statusEl(); return;
        } catch (e: any) { const msgEl = $('msg'); if(msgEl) msgEl.textContent = 'Erro no vídeo real: ' + e.message + ' - usando animação rápida'; S.busy = false; genBtn.disabled = false; }
      }
      if (!(window as any).MediaRecorder || !cv.captureStream) { const msgEl = $('msg'); if(msgEl) msgEl.textContent = 'Seu navegador não grava vídeo.'; return }
      S.busy = true; genBtn.disabled = true; const dl = $('dl'); if(dl) dl.style.display = 'none'; vid.style.display = 'none'; cv.style.display = ''; const msgEl = $('msg'); if(msgEl) msgEl.textContent = 'Criando seu vídeo…';
      const mimes = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm']; S.mime = mimes.find(m => (window as any).MediaRecorder.isTypeSupported(m)) || '';
      const rec = new (window as any).MediaRecorder(cv.captureStream(30), S.mime ? { mimeType: S.mime, videoBitsPerSecond: 4e6 } : {}), ch: any[] = [];
      rec.ondataavailable = (e: any) => e.data.size && ch.push(e.data);
      rec.onstop = () => { S.blob = new Blob(ch, { type: rec.mimeType }); S.mime = rec.mimeType; S.credits--; S.busy = false; genBtn.disabled = false; vid.src = URL.createObjectURL(S.blob); vid.style.display = 'block'; cv.style.display = 'none'; finish(); statusEl() };
      const t0 = performance.now(); rec.start();
      (function loop() { const t = (performance.now() - t0) / 1000; draw(Math.min(t, 5.99)); const progEl = $('prog'); if(progEl) progEl.style.width = Math.min(100, t / 6 * 100) + '%'; if (t < 6) requestAnimationFrame(loop); else rec.stop() })();
    };

    function finish() {
      const msgEl = $('msg'); if(msgEl) msgEl.textContent = 'Pronto! Confira o vídeo e baixe abaixo.';
      const mp4 = S.mime.includes('mp4'), ext = mp4 ? 'mp4' : 'webm';
      const dfmt = $('dfmt') as any; if(dfmt) dfmt.innerHTML = `<option value="${ext}">Vídeo ${ext.toUpperCase()}</option><option value="png">Imagem de capa PNG</option>`;
      const dl = $('dl'); if(dl) dl.style.display = 'block';
    }
    const dbtn = $('dbtn') as any;
    if(dbtn) dbtn.onclick = () => {
      const v = ($('dfmt') as any).value, a = document.createElement('a'), base = 'clipvenda-' + ($('nome') as any).value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (v == 'png') { draw(2.5); a.href = cv.toDataURL('image/png'); a.download = base + '.png'; cv.style.display = ''; } else { a.href = vid.src; a.download = base + '.' + v }
      document.body.appendChild(a); a.click(); a.remove();
    };
    build(); draw(2.5); ['nome', 'oferta', 'preco', 'cta', 'desc', 'acao'].forEach(i => { const el = $(i) as any; if(el) el.oninput = () => { if (!S.busy && cv.style.display != 'none') draw(2.5) } });

    // CHAT E FOTO
    const chat = $('chat'), cin = $('cin') as any, fi = $('file') as any, pv = $('prev') as any;
    (window as any).PH = null;
    (window as any).pic = function () { const im = (window as any).PH; if (!im) return; const W = cv.width, H = cv.height, bw = W * .74, bh = H * .52, r = Math.min(bw / im.width, bh / im.height), w = im.width * r, h = im.height * r, x = (W - w) / 2, y = H * .08 + (bh - h) / 2; cx.save(); cx.beginPath(); (cx as any).roundRect(x, y, w, h, 24); cx.clip(); cx.drawImage(im, x, y, w, h); cx.restore() };
    (window as any).cover = function (al: number) { const im = (window as any).PH; if (!im) return; const W = cv.width, H = cv.height, r = Math.max(W / im.width, H / im.height), w = im.width * r, h = im.height * r; cx.save(); cx.globalAlpha = al; cx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); cx.restore() };
    function msg(t: string, c: string, img?: string) { if(!chat) return; const d = document.createElement('div'); d.className = 'm ' + c; if (img) { const i = document.createElement('img'); i.src = img; d.appendChild(i) } d.appendChild(document.createTextNode(t)); chat.appendChild(d); chat.scrollTop = chat.scrollHeight; return d }
    const att = $('att') as any; if(att) att.onclick = () => fi.click();
    if(fi) fi.onchange = () => { const f = fi.files[0]; if (!f) return; (window as any).lastFile = f; const im = new Image(); const purl = URL.createObjectURL(f); im.onload = () => { (window as any).PH = im; if(pv) { pv.innerHTML = ''; const t = document.createElement('img'); t.src = purl; const s = document.createElement('span'); s.textContent = 'Foto anexada'; const x = document.createElement('button'); x.className = 'ghost'; x.type = 'button'; x.textContent = 'Remover'; x.onclick = () => { (window as any).lastFile = null; (window as any).PH = null; pv.innerHTML = ''; draw(2.5) }; pv.append(t, s, x); } draw(0.5) }; im.src = purl };
    async function send() {
      const t = cin?.value?.trim(); if (!chat || !cin) return;
      let busy = false; // local
      if (busy || (!t && !(window as any).lastFile)) return;
      const csend = $('csend') as any; if(csend) csend.disabled = true;
      const blob = (window as any).lastFile, purl = ''; // purl not needed
      msg(t || 'Segue a foto.', 'u', purl); cin.value = '';
      const w = msg('Lendo...', 'a');
      try {
        let imagemBase64 = null;
        if (blob) { imagemBase64 = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); }); }
        const cur = JSON.stringify({ nome: ($('nome') as any)?.value, oferta: ($('oferta') as any)?.value, preco: ($('preco') as any)?.value, cta: ($('cta') as any)?.value, desc: ($('desc') as any)?.value });
        const ins = 'Responda SOMENTE JSON: {"resposta":"mensagem curta","nome":"nome","oferta":"oferta","preco":"preço","cta":"cta","desc":"desc","acao":"acao","roteiro":"roteiro","estilo":"Moderno"} Estado: ' + cur;
        const resp = await fetch('/api/gerar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: ins + '\nMensagem:' + t, imagem: imagemBase64 }) });
        const jj = await resp.json(); if (!resp.ok) throw new Error(jj.erro || 'erro');
        let rrr = jj.texto || ''; const mmm = rrr.match(/\{[\s\S]*\}/); if (mmm) rrr = mmm[0]; rrr = rrr.replace(/```json|```/g, '').trim();
        const r = JSON.parse(rrr);
        const set = (id: string, v: string, m: number) => { const el = $(id) as any; if (typeof v == 'string' && v.trim() && el) el.value = v.trim().slice(0, m) };
        set('nome', r.nome, 40); set('oferta', r.oferta, 60); set('preco', r.preco, 24); set('cta', r.cta, 30); set('desc', r.desc, 300); set('acao', r.acao, 300); set('roteiro', r.roteiro, 300);
        draw(2.5); if(w) w.textContent = (r.resposta || 'Pronto!') + '\nClique em Gerar vídeo.'
      } catch (e: any) { if(w) w.textContent = 'Erro: ' + e.message }
      if(csend) csend.disabled = false;
    }
    const csendBtn = $('csend') as any; if(csendBtn) csendBtn.onclick = send;
    if(cin) cin.onkeydown = (e: any) => { if (e.key == 'Enter' && !e.shiftKey) { e.preventDefault(); send() } };

  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&display=swap" rel="stylesheet" />
      <style>{`
:root{--bg:#f3f6ff;--panel:#fff;--ink:#0c1433;--mut:#5a6591;--line:#d9e0f7;--ac:#4a4dff;--ac2:#00c2a8;--warn:#ff7a45;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
*{box-sizing:border-box}html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Sora,system-ui,sans-serif;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:44px 44px;background-attachment:fixed}
.w{max-width:1040px;margin:0 auto;padding:0 18px}
header{display:flex;justify-content:space-between;align-items:center;padding:16px 0;gap:10px;flex-wrap:wrap}
.logo{font-weight:800;font-size:20px}.logo i{font-style:normal;color:var(--ac)}
.pill{background:var(--panel);border:1px solid var(--line);border-radius:99px;padding:6px 14px;font-size:14px}
.pill b{color:var(--ac)}
h1{font-size:clamp(30px,6vw,52px);line-height:1.08;margin:28px 0 12px;font-weight:800;max-width:15ch}
.lead{color:var(--mut);max-width:52ch;margin:0 0 20px}
button,.btn{font:inherit;font-weight:600;border:0;border-radius:12px;padding:13px 20px;cursor:pointer;background:var(--ac);color:#fff;text-decoration:none;display:inline-block}
button.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
button:disabled{opacity:.5;cursor:not-allowed}
.app{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;margin:26px 0}
@media(max-width:800px){.app{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:20px}
.step{display:flex;gap:12px;margin-bottom:22px}
.n{flex:none;width:30px;height:30px;border-radius:50%;background:var(--ac);color:#fff;display:grid;place-items:center;font-weight:800;font-size:14px}
.step h3{margin:2px 0 2px;font-size:17px}.hint{color:var(--mut);font-size:14px;margin:0 0 10px}
label{display:block;font-size:14px;font-weight:600;margin:10px 0 4px}
input,textarea,select{width:100%;font:inherit;padding:11px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}
.opts{display:flex;gap:8px;flex-wrap:wrap}
.opt{flex:1 1 90px;border:2px solid var(--line);border-radius:12px;padding:10px;text-align:center;cursor:pointer;background:var(--bg);color:var(--ink);font-weight:600;font-size:14px}
.opt small{display:block;color:var(--mut);font-weight:400;font-size:12px}
.opt[aria-pressed=true]{border-color:var(--ac);box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 25%,transparent)}
.lock{color:var(--warn)}
.stage{display:flex;justify-content:center;background:#05081a;border-radius:12px;padding:12px;min-height:260px;align-items:center}
canvas,video{max-width:100%;max-height:420px;border-radius:8px;background:#000}
video{display:none}
.bar{height:8px;background:var(--line);border-radius:9px;overflow:hidden;margin-top:12px}.bar div{height:100%;width:0;background:var(--ac2);transition:width .2s}
.msg{font-size:14px;color:var(--mut);margin:10px 0 0;min-height:22px}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin:12px 0 40px}
.plan h3{margin:0}.price{font-size:32px;font-weight:800;margin:6px 0}.price small{font-size:14px;color:var(--mut);font-weight:400}
.plan ul{padding-left:18px;color:var(--mut);margin:12px 0}
.plan.pro{border:2px solid var(--ac)}
dialog{border:1px solid var(--line);border-radius:16px;background:var(--panel);color:var(--ink);max-width:420px}
dialog::backdrop{background:rgba(5,8,26,.6)}
footer{color:var(--mut);font-size:13px;padding:20px 0 40px}
:root:root:root{color-scheme:dark;--bg:#050816;--panel:rgba(14,20,52,.66);--ink:#eaf0ff;--mut:#9aa8d8;--line:rgba(125,145,255,.24);--ac:#6b7bff;--ac2:#22e1ff}
body{background-image:radial-gradient(60% 45% at 12% 0%,rgba(107,123,255,.38),transparent 70%),radial-gradient(45% 35% at 92% 8%,rgba(34,225,255,.24),transparent 70%),linear-gradient(rgba(125,145,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(125,145,255,.07) 1px,transparent 1px);background-size:auto,auto,40px 40px,40px 40px}
.logo{font-size:22px;letter-spacing:-.02em}.logo i{background:linear-gradient(120deg,#8a98ff,#22e1ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.pill{background:var(--panel);backdrop-filter:blur(12px);border-color:var(--line);display:flex;align-items:center;gap:8px}
.pill::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--ac2);box-shadow:0 0 10px var(--ac2)}
h1{background:linear-gradient(120deg,#fff 10%,#a9b6ff 55%,#22e1ff);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:-.03em;max-width:17ch}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.chips span{font-size:13px;color:var(--mut);border:1px solid var(--line);background:var(--panel);border-radius:99px;padding:5px 12px}
button,.btn{background:linear-gradient(135deg,#6b7bff,#22b8ff);box-shadow:0 10px 30px -10px rgba(70,130,255,.9),inset 0 1px 0 rgba(255,255,255,.35);transition:transform .15s,box-shadow .15s}
button:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 34px -8px rgba(70,150,255,1),inset 0 1px 0 rgba(255,255,255,.35)}
button.ghost{background:transparent;box-shadow:none;border:1px solid var(--line)}
#gen{width:100%;padding:16px;font-size:17px}
.card{backdrop-filter:blur(16px);border-radius:22px;box-shadow:0 30px 70px -40px rgba(107,123,255,.8),inset 0 1px 0 rgba(255,255,255,.07)}
.n{background:linear-gradient(135deg,#6b7bff,#22e1ff);color:#04102b;box-shadow:0 0 18px rgba(34,225,255,.5)}
input,textarea,select{background:rgba(4,8,24,.7);border-color:var(--line)}
input:focus,select:focus{border-color:var(--ac2)}
.opt{background:rgba(4,8,24,.55);transition:border-color .15s}
.opt[aria-pressed=true]{border-color:var(--ac2);box-shadow:0 0 0 3px rgba(34,225,255,.18),0 0 24px -6px rgba(34,225,255,.7)}
.stage{background:radial-gradient(circle at 50% 40%,#101a4a,#03050f 70%);border:1px solid var(--line);box-shadow:inset 0 0 40px rgba(107,123,255,.18)}
.bar{height:10px;background:rgba(4,8,24,.8)}.bar div{background:linear-gradient(90deg,#6b7bff,#22e1ff);box-shadow:0 0 14px #22e1ff}
h2{font-size:clamp(24px,4vw,34px);letter-spacing:-.02em;margin:36px 0 4px}
.price{background:linear-gradient(120deg,#fff,#9fb0ff);-webkit-background-clip:text;background-clip:text;color:transparent}
.plan.pro{position:relative;border:1px solid transparent;background:linear-gradient(#0b1236,#0b1236) padding-box,linear-gradient(135deg,#6b7bff,#22e1ff) border-box;bo
