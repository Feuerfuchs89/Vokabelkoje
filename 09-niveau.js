// Vokabelkoje – niveau
/* ---------- Niveau-Karte mit Welle ---------- */
let chartPts=null;
const fmtDay=t=>new Date(t).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});
function levelCard(){const lang=activeLang();if(!lang)return '';const L=[];
 const g=curLevel(lang,'g'),v=curLevel(lang,'v'),weak=openWeak(lang).slice(0,3);const P=prof(lang);
 const chips=L.length>1?`<div class="chips">${L.map(l=>`<button class="chip ${l===lang?'on':''}" data-act="plang" data-l="${l}">${langName(l)}</button>`).join('')}</div>`:'';
 let h=`<section class="today" aria-label="Dein Niveau"><div class="lv-top"><div><span class="label">Dein Niveau in ${langName(lang)}</span>`;
 if(!P.pts.length){
  h+=`</div>${chips}</div><p>Mach einen kurzen Einstufungstest. Danach siehst du hier deine Lernkurve von A1 bis C2, und die KI erkennt, woran du arbeiten solltest.</p>
  <button class="btn primary" data-act="check" data-l="${lang}">Einstufungstest starten (ca. 5 Minuten)</button>
  <p class="hint">Den Test brauchst du nur einmal. Danach wächst die Kurve von selbst mit: durch Gesprächsauswertungen, Stufentests, bestandene Etappen-Checks und volle Schnack-Runden mit der Möwe.</p></section>`;return h}
 h+=`<div class="lv-stats" style="margin-top:6px"><div class="lv-stat"><b>${lvlName(g)}</b><span><i class="sw g"></i>Grammatik</span></div><div class="lv-stat"><b>${lvlName(v)}</b><span><i class="sw v"></i>Wortschatz</span></div></div></div>${chips}</div>
 ${chartSVG(lang)}
 <div class="row-between"><div class="legend"><span><i class="sw g"></i>Grammatik</span><span><i class="sw v"></i>Wortschatz</span></div><button class="linkbtn" data-act="check" data-l="${lang}">Neuer Einstufungstest</button></div>
 <details class="chart-table"><summary class="hint" style="cursor:pointer">Messwerte als Tabelle</summary><table><thead><tr><th>Datum</th><th>Quelle</th><th>Grammatik</th><th>Wortschatz</th></tr></thead><tbody>${P.pts.slice().reverse().slice(0,30).map(p=>`<tr><td>${fmtDay(p.t)}</td><td>${({test:'Test',talk:'Gespräch',unit:'Etappen-Check',gull:'Schnack'})[p.src]||'Messung'}</td><td>${p.g==null?'–':lvlName(p.g)+' ('+p.g.toFixed(1).replace('.',',')+')'}</td><td>${p.v==null?'–':lvlName(p.v)+' ('+p.v.toFixed(1).replace('.',',')+')'}</td></tr>`).join('')}</tbody></table></details>
 <div class="stack" style="gap:0"><span class="label">Deine Baustellen</span><div class="weak-list">${weak.length?weak.map(w=>`<div class="weak-row"><b>${esc(w.topic)}<span class="cat ${w.cat||'g'}">${w.cat==='v'?'Wortschatz':'Grammatik'}</span></b><span class="hint">${w.n}× aufgefallen${w.ok?` · ${w.ok}× gut geübt`:''}</span><button class="btn sm" data-act="drill" data-l="${lang}" data-k="${esc(w.k)}">Üben</button></div>`).join(''):`<p class="hint" style="padding-top:8px">Gerade keine offenen Baustellen. Führ ein Gespräch, dann findet die KI neue.</p>`}</div></div>
 </section>`;return h}
function chartSVG(lang){
 const narrow=(window.innerWidth||800)<560;
 const W=narrow?360:600,H=narrow?230:240,pl=30,pr=narrow?94:96,pt=8,pb=26,iw=W-pl-pr,ih=H-pt-pb;
 // Pro Tag nur der letzte (geglättete) Stand: mehrere Messungen an einem Tag drängen sich sonst am Rand
 const perDay=a=>{const m=new Map();a.forEach(p=>m.set(dayKey(p.t),p));return [...m.values()]};
 const sg=perDay(series(lang,'g')),sv=perDay(series(lang,'v')),all=[...sg,...sv];
 let t0=Math.min(...all.map(p=>p.t)),t1=Math.max(...all.map(p=>p.t));if(t1-t0<DAY){t0-=DAY;t1+=DAY}
 const top=Math.min(6,Math.max(3,Math.ceil(Math.max(...all.map(p=>Math.max(p.y,p.raw)))+.01)+1));
 const X=t=>pl+(t-t0)/(t1-t0)*iw,Y=y=>pt+ih-y/top*ih;
 const bands=LEVELS.slice(0,top).map((L,i)=>`<rect x="${pl}" y="${Y(i+1)}" width="${iw}" height="${ih/top}" fill="${i%2?'transparent':'var(--band)'}"/><text class="lvl" x="${pl-7}" y="${Y(i+.5)+4}" text-anchor="end">${L}</text>`).join('');
 const lines=Array.from({length:top+1},(_,i)=>i).map(i=>`<line x1="${pl}" x2="${pl+iw}" y1="${Y(i)}" y2="${Y(i)}" stroke="var(--line)" stroke-width="1"/>`).join('');
 // Monotone Kurve (Fritsch-Carlson): geht nie rückwärts und schießt nicht über die Messpunkte hinaus
 const curve=pts=>{const n=pts.length;if(n<2)return '';const dx=[],sl=[],m=[];
  for(let i=0;i<n-1;i++){dx[i]=Math.max(.001,pts[i+1][0]-pts[i][0]);sl[i]=(pts[i+1][1]-pts[i][1])/dx[i]}
  m[0]=sl[0];m[n-1]=sl[n-2];for(let i=1;i<n-1;i++)m[i]=sl[i-1]*sl[i]<=0?0:(sl[i-1]+sl[i])/2;
  for(let i=0;i<n-1;i++){if(sl[i]===0){m[i]=0;m[i+1]=0;continue}const a=m[i]/sl[i],b=m[i+1]/sl[i],h=a*a+b*b;if(h>9){const k=3/Math.sqrt(h);m[i]=k*a*sl[i];m[i+1]=k*b*sl[i]}}
  let d=`M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for(let i=0;i<n-1;i++){const [x0,y0]=pts[i],[x1,y1]=pts[i+1],h=dx[i]/3;d+=` C${(x0+h).toFixed(1)},${(y0+m[i]*h).toFixed(1)} ${(x1-h).toFixed(1)},${(y1-m[i+1]*h).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`}
  return d};
 const draw=(s,col,name)=>{if(!s.length)return '';const pts=s.map(p=>[X(p.t),Y(p.y)]);const d=curve(pts);const last=pts[pts.length-1];
  return `${d?`<path d="${d}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`:''}
  ${pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5" fill="${col}" stroke="var(--surface)" stroke-width="2"/>`).join('')}
  <text class="tick" x="${(last[0]+10).toFixed(1)}" y="${(last[1]+4).toFixed(1)}" style="fill:var(--ink)" data-name="${name}">${name} ${lvlName(s[s.length-1].y)}</text>`};
 // Endbeschriftungen nicht überlappen lassen
 let lg=draw(sg,'var(--s-gram)','Grammatik'),lv=draw(sv,'var(--s-voc)','Wortschatz');
 if(sg.length&&sv.length){const yg=Y(sg[sg.length-1].y),yv=Y(sv[sv.length-1].y);if(Math.abs(yg-yv)<14){const off=(14-Math.abs(yg-yv))/2,up=yg<=yv;
  lg=lg.replace(/<text class="tick" x="([\d.]+)" y="([\d.]+)"([^>]*data-name="Grammatik")/,(m,x,y,r)=>`<text class="tick" x="${x}" y="${(+y+(up?-off:off)).toFixed(1)}"${r}`);
  lv=lv.replace(/<text class="tick" x="([\d.]+)" y="([\d.]+)"([^>]*data-name="Wortschatz")/,(m,x,y,r)=>`<text class="tick" x="${x}" y="${(+y+(up?off:-off)).toFixed(1)}"${r}`)}}
 const ticks=`<text class="tick" x="${pl}" y="${H-6}">${fmtDay(t0)}</text><text class="tick" x="${pl+iw}" y="${H-6}" text-anchor="end">${fmtDay(t1)}</text>`;
 chartPts={lang,X,Y,sg,sv,pl,iw,pt,ih,W,H};
 const one=sg.length<2&&sv.length<2;
 return `<div class="chart-wrap" id="lv-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Lernkurve ${langName(lang)}: Grammatik ${lvlName(curLevel(lang,'g'))}, Wortschatz ${lvlName(curLevel(lang,'v'))}">
  ${bands}${lines}${lg}${lv}${ticks}<line id="lv-x" x1="0" x2="0" y1="${pt}" y2="${pt+ih}" stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3" visibility="hidden"/>
  <rect id="lv-hit" x="${pl}" y="${pt}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip" id="lv-tip" hidden></div></div>
  ${one?`<p class="hint">${prof(lang).pts.length>1?'Mehrere Messungen an einem Tag zählen als ein Punkt. Ab dem nächsten Tag mit Messung wird daraus eine Welle.':'Ab der zweiten Messung wird daraus eine Welle.'}</p>`:''}${top<6?`<p class="hint">Gezeigt bis ${LEVELS[top-1]}. Darüber folgen ${LEVELS.slice(top).join(', ')}.</p>`:''}`}
function hookChart(){const wrap=$('#lv-chart');if(!wrap||!chartPts||!wrap.querySelector)return;const svg=wrap.querySelector('svg'),hit=wrap.querySelector('#lv-hit'),tip=wrap.querySelector('#lv-tip'),xl=wrap.querySelector('#lv-x');if(!hit)return;
 const C=chartPts,ts=[...new Set([...C.sg,...C.sv].map(p=>p.t))].sort((a,b)=>a-b);
 const at=(s,t)=>{let r=null;s.forEach(p=>{if(p.t<=t)r=p});return r};
 const move=e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*C.W;let best=ts[0];ts.forEach(t=>{if(Math.abs(C.X(t)-x)<Math.abs(C.X(best)-x))best=t});
  const g=at(C.sg,best),v=at(C.sv,best),px=C.X(best);xl.setAttribute('x1',px);xl.setAttribute('x2',px);xl.setAttribute('visibility','visible');
  tip.innerHTML=`<b>${fmtDay(best)}</b><br>Grammatik: ${g?lvlName(g.y):'–'}<br>Wortschatz: ${v?lvlName(v.y):'–'}`;tip.hidden=false;
  const pct=Math.min(85,Math.max(15,px/C.W*100));tip.style.left=pct+'%'};
 const leave=()=>{tip.hidden=true;xl.setAttribute('visibility','hidden')};
 hit.addEventListener('pointermove',move);hit.addEventListener('pointerdown',move);hit.addEventListener('pointerleave',leave)}

/* ---------- Einstufungstest ---------- */
function startCheck(lang){go('check',{lang,K:{stage:'intro',qs:null,ans:[],i:0,busy:false,err:'',fb:null}})}
async function checkLoad(){const K=view.K,TL=langName(view.lang);K.busy=true;K.err='';render();
 try{const r=await ai(view.uref?unitCheckPrompt():`Erstelle einen Einstufungstest für ${TL} für einen deutschsprachigen Erwachsenen.
Genau 20 Multiple-Choice-Fragen: für jede Stufe A1, A2, B1, B2 und C1 je 2 Grammatikfragen und 2 Wortschatzfragen, von leicht nach schwer sortiert.
Grammatikfrage: ein Satz auf ${TL} mit einer Lücke ___ und 4 Antwortmöglichkeiten. Wortschatzfrage: passendes Wort im Satz oder Bedeutung eines Wortes, 4 Möglichkeiten.
Jede Frage hat genau eine eindeutig richtige Antwort. Die Antwortmöglichkeiten sollen plausibel klingen. Satz und Antworten auf ${TL}.
„thema“ ist ein kurzer deutscher Name des geprüften Themas, z. B. „Vergangenheit unregelmäßiger Verben“ oder „Wortschatz Reisen“.
Antworte nur mit einem JSON-Array: [{"lvl":"A1","art":"grammatik","thema":"…","q":"…","opts":["…","…","…","…"],"a":0}]`,{json:true,fresh:true,cacheKey:view.uref?`check|${view.uref.id}|${view.uref.uid}`:`place|${view.lang}`});
  let qs=(Array.isArray(r)?r:(r&&(r.fragen||r.questions))||[]).filter(q=>q&&q.q&&Array.isArray(q.opts)&&q.opts.length>=3&&LEVELS.includes(String(q.lvl||'').toUpperCase().slice(0,2))&&+q.a>=0&&+q.a<q.opts.length);
  qs=qs.map(q=>{const right=String(q.opts[+q.a]);const opts=shuffle([...new Set(q.opts.map(String))]);return {lvl:String(q.lvl).toUpperCase().slice(0,2),art:/wort/i.test(q.art||'')?'v':'g',thema:String(q.thema||'').trim(),q:String(q.q),opts,a:opts.indexOf(right)}}).filter(q=>q.a>=0);
  qs.sort((x,y)=>LEVELS.indexOf(x.lvl)-LEVELS.indexOf(y.lvl));
  if(qs.length<(view.uref?6:10))throw new AIError('Der Test konnte nicht erstellt werden. Versuch es nochmal.');
  K.qs=qs;K.stage='run';K.i=0;K.ans=[]}
 catch(e){K.err=e.message}
 K.busy=false;if(view.K===K)render()}
function scoreCat(qs,ans,cat){let s=0;LEVELS.slice(0,5).forEach(L=>{const q=qs.filter(x=>x.lvl===L&&x.art===cat);if(!q.length)return;const p=q.filter(x=>ans[qs.indexOf(x)]===x.a).length/q.length;s+=Math.max(0,(p-.25)/.75)});return s}
function checkFinish(){if(view.uref)return unitCheckFinish();const K=view.K,qs=K.qs,lang=view.lang;
 K.g=scoreCat(qs,K.ans,'g');K.v=scoreCat(qs,K.ans,'v');addPoint(lang,K.g,K.v,'test');
 const seen=new Set();K.weak=qs.filter((x,i)=>K.ans[i]!==x.a&&x.thema&&LEVELS.indexOf(x.lvl)<=Math.floor(x.art==='g'?K.g:K.v)+1)
  .filter(x=>{const k=wkey(x.thema);if(seen.has(k))return false;seen.add(k);return true}).slice(0,4);
 addWeak(lang,K.weak.map(x=>({thema:x.thema,art:x.art==='v'?'wortschatz':'grammatik',beispiel:x.q.replace(/_{2,}/,x.opts[x.a])})));
 adoptLevel(lang);logAnswer(qs.length);db.fresh=false;save();K.stage='done'}
function vCheck(){const K=view.K,lang=view.lang,TL=langName(lang),U=view.uref,UU=U&&unitOf(getCourse(U.id),U.uid),EX=UU&&UU.kind==='exam';let h=bar(U?(EX?'course':'unit'):'home',U?(EX?UU.title:'Abschluss-Check'):'Einstufungstest');
 if(U&&K.stage==='intro'){const u=UU;h+=EX?`<div class="form"><h1>${esc(u.title)}<span class="ai-tag">${aiName()}</span></h1><p>12 gemischte Fragen zu Grammatik und Wörtern aus dem ganzen Ordner ${u.lvl}. Ab 75 % hast du ${u.lvl} geschafft, der nächste Ordner öffnet sich, und das Ergebnis fließt in deine Lernkurve ein.</p>`:`<div class="form"><h1>Abschluss-Check<span class="ai-tag">${aiName()}</span></h1><p>10 Fragen zu „${esc(u?u.grammar:'')}“ und den Wörtern dieser Etappe. Ab 8 richtigen Antworten ist die nächste Etappe frei.</p>
  <button class="btn primary wide" data-act="ck-go" ${K.busy?'disabled':''}>${K.busy?'KI stellt den Check zusammen …':'Check starten'}</button>${errHtml(K.err)}</div>`}
 else if(U&&K.stage==='done'){h+=`<section class="summary"><span class="label">Abschluss-Check</span><div class="clock" style="font-size:3rem">${K.right} / ${K.qs.length}</div>
  <p class="muted">${EX?(K.passed?`Glückwunsch, ${UU.lvl} ist geschafft!${K.unlocked?` Weiter geht es mit ${K.unlocked.lvl}.`:''}`:'Noch nicht ganz. Wiederhol die Etappen mit niedrigem Ergebnis und deine Baustellen, dann versuch es nochmal.'):K.passed?(K.unlocked?`Bestanden! ${K.unlocked.kind==='exam'?'Jetzt wartet der Stufentest.':`Etappe ${K.unlocked.n} „${esc(K.unlocked.title)}“ ist jetzt frei.`}`:'Bestanden!'):'Noch nicht ganz. Wiederhol die Wörter und die Grammatik und versuch es dann nochmal.'}</p>
  ${K.passed&&K.unlocked?`<button class="btn primary wide" data-act="unit" data-id="${U.id}" data-uid="${K.unlocked.id}">${K.unlocked.kind==='exam'?esc(K.unlocked.title)+' starten':`Weiter zu Etappe ${K.unlocked.n}`}</button>`:''}
  <button class="btn wide ${K.passed&&K.unlocked?'':'primary'}" data-act="back" data-to="${EX?'course':'unit'}">${EX?'Zum Lernpfad':'Zurück zur Etappe'}</button></section>`}
 else if(K.stage==='intro'){h+=`<div class="form"><h1>Einstufungstest ${TL}<span class="ai-tag">${aiName()}</span></h1>
  <p>20 Fragen zu Grammatik und Wortschatz, von A1 bis C1. Rate nicht wild. Wenn du etwas nicht weißt, tipp auf „Weiß ich nicht“. So wird das Ergebnis genauer.</p>
  <button class="btn primary wide" data-act="ck-go" ${K.busy?'disabled':''}>${K.busy?'KI stellt den Test zusammen …':'Test starten'}</button>${errHtml(K.err)}</div>`}
 else if(K.stage==='run'){const q=K.qs[K.i];
  h+=`<div class="prog"><span>${K.i+1} / ${K.qs.length}</span><div class="pbar"><i style="width:${K.i/K.qs.length*100}%"></i></div></div>
  <section class="q"><div class="row-between"><span class="label">${q.art==='g'?'Grammatik':'Wortschatz'}</span></div>
  <div class="q-prompt"><div lang="${short(lang)}">${esc(q.q)}</div></div>
  <div class="opts">${q.opts.map((o,j)=>{let cl='';if(K.fb!=null){if(j===q.a)cl='ok';else if(j===K.fb)cl='no'}return `<button class="opt ${cl}" data-act="ck-opt" data-j="${j}" ${K.fb!=null?'disabled':''}><span class="n">${j+1}</span><span lang="${short(lang)}">${esc(o)}</span></button>`}).join('')}</div>
  <button class="linkbtn" data-act="ck-opt" data-j="-1" ${K.fb!=null?'disabled':''}>Weiß ich nicht</button></section>`}
 else{h+=`<section class="summary"><span class="label">Dein Ergebnis in ${TL}</span>
  <div class="big-nums"><div><b style="color:var(--s-gram)">${lvlName(K.g)}</b><span>Grammatik</span></div><div><b style="color:var(--s-voc)">${lvlName(K.v)}</b><span>Wortschatz</span></div></div>
  <p class="muted">${K.ans.filter((a,i)=>a===K.qs[i].a).length} von ${K.qs.length} richtig. Das Ergebnis fließt in deine Lernkurve ein.</p></section>
  ${K.weak.length?`<section class="stack"><h2>Daran solltest du arbeiten</h2><div class="weak-list">${K.weak.map(x=>`<div class="weak-row"><b>${esc(x.thema)}<span class="cat ${x.art}">${x.art==='v'?'Wortschatz':'Grammatik'}</span></b><span class="hint">${x.lvl}</span><button class="btn sm" data-act="drill" data-l="${lang}" data-k="${esc(wkey(x.thema))}">Üben</button></div>`).join('')}</div></section>`:''}
  <button class="btn primary wide" data-act="back" data-to="home">Zur Startseite</button>`}
 app.innerHTML=h}

/* ---------- Gezieltes Training ---------- */
function startDrill(lang,k){if(!prof(lang).weak[k])return toast('Dieses Thema gibt es nicht mehr');go('drill',{lang,D:{k,stage:'load',data:null,i:0,res:null,ok:0,err:''}});drillLoad()}
function startDrillTopic(lang,topic,uref){go('drill',{lang,uref,D:{k:null,topic,stage:'load',data:null,i:0,res:null,ok:0,err:''}});drillLoad()}
async function drillLoad(){const D=view.D,lang=view.lang,w=(D.k&&prof(lang).weak[D.k])||{topic:D.topic||''},TL=langName(lang);D.stage='load';D.err='';render();
 adoptLevel(lang);
 try{const r=await ai(`Erstelle eine kurze Übungseinheit für einen deutschsprachigen Lerner (Niveau ${prefs.level}) in ${TL} zum Thema „${w.topic}“.${w.desc?` Beobachtetes Problem: ${w.desc}`:''}${w.ex?` Richtiges Beispiel: ${w.ex}`:''}
Antworte nur mit JSON:
{"regel":"Erklärung der Regel auf Deutsch, höchstens 4 kurze Sätze","beispiele":["2 bis 3 Beispielsätze auf ${TL}"],"aufgaben":[…]}
Genau 8 Aufgaben, gemischt aus zwei Typen und von leicht nach schwer:
{"typ":"mc","frage":"Satz auf ${TL} mit ___","opts":["…","…","…","…"],"a":Index der richtigen Antwort,"erkl":"kurze Erklärung auf Deutsch"}
{"typ":"luecke","frage":"Satz auf ${TL} mit einer oder mehreren Lücken ___","hinweis":"Grundformen in Klammern oder deutscher Hinweis, bei mehreren Lücken in derselben Reihenfolge","loesungen":[["alle richtigen Formen für Lücke 1"],["alle richtigen Formen für Lücke 2, nur falls es sie gibt"]],"erkl":"kurze Erklärung auf Deutsch"}
„loesungen“ enthält für jede Lücke ___ genau eine Liste, in der Reihenfolge der Lücken im Satz.`,{json:true,fresh:true,cacheKey:`drill|${lang}|${wkey(w.topic||'')}|${prefs.level}`});
  const tasks=(Array.isArray(r&&r.aufgaben)?r.aufgaben:[]).map(t=>{if(!t||!t.frage)return null;
   if(t.typ==='mc'&&Array.isArray(t.opts)&&+t.a>=0&&+t.a<t.opts.length){const right=String(t.opts[+t.a]);const opts=shuffle([...new Set(t.opts.map(String))]);return {typ:'mc',frage:String(t.frage),opts,a:opts.indexOf(right),erkl:String(t.erkl||'')}}
   const gaps=gapSolutions(String(t.frage),t.loesungen!=null?t.loesungen:(t.loesung||t.antwort));if(!gaps)return null;
   return {typ:'luecke',frage:String(t.frage),hinweis:String(t.hinweis||''),gaps,sol:gaps[0],erkl:String(t.erkl||'')}}).filter(Boolean);
  if(tasks.length<3)throw new AIError('Die Übung konnte nicht erstellt werden. Versuch es nochmal.');
  D.data={regel:String(r.regel||''),beispiele:(Array.isArray(r.beispiele)?r.beispiele:[]).map(String),tasks};D.stage='rule';D.i=0;D.ok=0;D.res=null}
 catch(e){D.err=e.message}
 if(view.D===D)render()}
const fillGap=(f,a)=>/_{2,}/.test(f)?f.replace(/_{2,}/,a):f;
// Mehrere Lücken: jede Lücke bekommt ihre eigene Liste richtiger Formen
const gapCount=f=>(String(f).match(/_{2,}/g)||[]).length;
function gapSolutions(frage,raw){const n=Math.max(1,gapCount(frage));const S=x=>(Array.isArray(x)?x:[x]).filter(v=>v!=null&&String(v).trim()).map(v=>String(v).trim());
 let list=Array.isArray(raw)?raw:[raw];
 if(list.some(Array.isArray)){const g=list.map(S).filter(a=>a.length);return g.length===n?g:n===1&&g.length?[g.flat()]:null}
 const flat=S(list);if(!flat.length)return null;if(n===1)return [flat];
 if(flat.length===n)return flat.map(x=>[x]);
 if(flat.length===1){const parts=flat[0].split(/\s*(?:\/|;|,|\.\.\.|…|\|)\s*/).filter(Boolean);if(parts.length===n)return parts.map(x=>[x])}
 return null}
const fillAll=(f,answers)=>{let i=0;return String(f).replace(/_{2,}/g,m=>answers[i]!=null?answers[i++]:m)};
function gapSentence(t,D){const parts=String(t.frage).split(/_{2,}/),r=D.res;let h='';
 parts.forEach((p,j)=>{h+=esc(p);if(j>=parts.length-1)return;const g=(D.gres||[])[j];
  if(g)h+=g.ok?`<span class="gap ok">${esc(g.input)}</span>`:`<span class="gap no"><s>${esc(g.input)}</s> ${esc(t.gaps[j][0])}</span>`;
  else if(!r&&j===(D.g||0))h+=`<span class="gap cur" aria-label="Lücke ${j+1}">${t.gaps.length>1?j+1:'?'}</span>`;
  else h+='<span class="gap">___</span>'});
 return h}
function vDrill(){const D=view.D,lang=view.lang,w=(D.k&&prof(lang).weak[D.k])||{topic:D.topic||''},TL=lang;let h=bar(view.uref?'unit':'home','Training');
 h+=`<h1>${esc(w.topic)}</h1>`;
 if(D.stage==='load'){h+=D.err?errHtml(D.err)+'<button class="btn" data-act="dr-reload">Nochmal versuchen</button>':`<p class="thinking">${aiName()} stellt deine Übung zusammen …</p>`}
 else if(D.stage==='rule'){const d=D.data;h+=`<section class="rule"><span class="label">So geht's</span><p>${esc(d.regel)}</p>${d.beispiele.length?`<ul lang="${short(TL)}">${d.beispiele.map(b=>`<li>${esc(b)} ${sayBtn(b,TL)}</li>`).join('')}</ul>`:''}</section>
  <button class="btn primary wide" data-act="dr-start">${d.tasks.length} Aufgaben starten</button>`}
 else if(D.stage==='task'){const t=D.data.tasks[D.i],r=D.res;const answer=t.typ==='mc'?t.opts[t.a]:t.sol[0];const fullSent=t.typ==='luecke'?fillAll(t.frage,t.gaps.map(g=>g[0])):fillGap(t.frage,answer);
  h+=`<div class="prog"><span>${D.i+1} / ${D.data.tasks.length}</span><div class="pbar"><i style="width:${D.i/D.data.tasks.length*100}%"></i></div></div>
  <section class="q"><div class="q-prompt"><div lang="${short(TL)}">${t.typ==='luecke'?gapSentence(t,D):esc(t.frage)}</div></div>${t.hinweis?`<p class="hint">Hinweis: ${esc(t.hinweis)}</p>`:''}`;
  if(t.typ==='mc')h+=`<div class="opts">${t.opts.map((o,j)=>{let cl='';if(r){if(j===t.a)cl='ok';else if(j===r.pick)cl='no'}return `<button class="opt ${cl}" data-act="dr-opt" data-j="${j}" ${r?'disabled':''}><span class="n">${j+1}</span><span>${esc(o)}</span></button>`}).join('')}</div>`;
  else{const multi=t.gaps.length>1,gi=D.g||0;h+=`${multi&&!r?`<p class="label">Lücke ${gi+1} von ${t.gaps.length}</p>`:''}${r&&multi?'':`<form class="write" id="dr-form" autocomplete="off"><input id="dr-in" lang="${short(TL)}" value="${esc(r?r.input:'')}" ${r?'disabled':''} autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${multi?`Lücke ${gi+1} ausfüllen`:'Lücke ausfüllen'}" aria-label="${multi?`Lücke ${gi+1} von ${t.gaps.length}`:'Deine Antwort'}">${r?'':micBtn('dr-in',TL)}<button class="btn primary" ${r?'disabled':''}>${multi&&gi<t.gaps.length-1?'Bestätigen':'Prüfen'}</button></form>`}`}
  if(r){const full=fullSent;h+=`<div class="fb ${r.ok?'ok':'no'}"><div class="row-between"><strong>${r.ok?'Richtig':'Noch nicht'}</strong>${sayBtn(full,TL)}</div><span class="ans" lang="${short(TL)}">${esc(full)}</span>${t.erkl?`<span>${esc(t.erkl)}</span>`:''}</div>
   <div class="row-between">${!r.ok&&t.typ==='luecke'&&r.input?'<button class="linkbtn" data-act="dr-override">Ich lag doch richtig</button>':'<span></span>'}<button class="btn primary" id="dr-next" data-act="dr-next">Weiter</button></div>`}
  h+=`</section>`}
 else{const n=D.data.tasks.length,pct=D.ok/n;h+=`<section class="summary"><span class="label">Ergebnis</span><div class="clock" style="font-size:3rem">${D.ok} / ${n}</div>
  <p class="muted">${!D.k?(pct>=.8?'Gut gemacht. Der Schritt „Grammatik üben“ ist erledigt.':'Bleib dran. Mit neuen Aufgaben übst du das Thema noch einmal.'):D.fixedNow?'Stark! Das Thema gilt jetzt als gefestigt und verschwindet aus deinen Baustellen. Taucht der Fehler im Gespräch wieder auf, kommt es zurück.':pct>=.8?'Gut gemacht. Noch eine gute Runde, dann gilt das Thema als gefestigt.':'Bleib dran. Mit neuen Aufgaben übst du das Thema noch einmal.'}</p>
  <div class="stack">${view.focus?`<p class="hint" style="text-align:center">Heutiger Schwerpunkt: ${(db.focus&&db.focus[view.lang]&&db.focus[view.lang].rounds)||1}× geübt. Mehr geht immer, muss aber nicht.</p>`:''}<button class="btn ${view.uref&&pct>=.8?'':'primary'} wide" data-act="dr-reload">${view.focus?'Weiter am Schwerpunkt':'Neue Aufgaben zum Thema'}</button>${view.focus&&openWeak(view.lang).filter(w=>w.k!==D.k).length?'<button class="btn wide" data-act="focus-next">Nächste Baustelle</button>':''}${view.focus?'<button class="btn wide" data-act="back" data-to="home">Fertig für heute</button>':view.uref?`<button class="btn wide ${pct>=.8?'primary':''}" data-act="back" data-to="unit">Zurück zur Etappe</button>`:'<button class="btn wide" data-act="back" data-to="home">Zur Startseite</button>'}</div></section>`}
 app.innerHTML=h;
 if(D.stage==='task'){if(D.res){const b=$('#dr-next');if(b)b.focus()}else if(D.data.tasks[D.i].typ==='luecke'){const i=$('#dr-in');if(i)i.focus()}}}
function drillAnswer(res){const D=view.D;if(D.res)return;D.res=res;if(res.ok)D.ok++;logAnswer();
 if(prefs.auto){const t=D.data.tasks[D.i];speak(t.typ==='luecke'&&t.gaps?fillAll(t.frage,t.gaps.map(g=>g[0])):fillGap(t.frage,t.typ==='mc'?t.opts[t.a]:t.sol[0]),view.lang)}render()}
function drillNext(){const D=view.D;D.i++;D.res=null;D.g=0;D.gres=[];
 if(D.i>=D.data.tasks.length&&view.uref&&D.ok/D.data.tasks.length>=.8){const c=getCourse(view.uref.id),u=unitOf(c,view.uref.uid);if(u){u.drillOk=true;c.upd=now()}}
 if(D.i>=D.data.tasks.length){const w=D.k&&prof(view.lang).weak[D.k];if(view.focus&&db.focus&&db.focus[view.lang]&&db.focus[view.lang].k===D.k)db.focus[view.lang].rounds=(db.focus[view.lang].rounds||0)+1;if(w){w.tries=(w.tries||0)+1;w.tried=now();if(D.ok/D.data.tasks.length>=.8){w.ok=(w.ok||0)+1;if(w.ok>=2&&!w.fixed){w.fixed=true;D.fixedNow=true}}w.last=now()}save();D.stage='done'}
 render()}
