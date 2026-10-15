// Vokabelkoje – ki-werkzeuge
/* ---------- KI-Karten ---------- */
async function aiGenerate(){const d=view.draft;const src=(d.aiSrc||'').trim();
 if(!src&&!d.aiImg)return toast('Füg einen Text oder ein Thema ein, oder wähle ein Foto');
 d.aiBusy=true;d.aiErr='';d.aiOpen=true;render();
 const L1=langName(d.l1),L2=langName(d.l2),EXL=langName(d.l1!=='de-DE'?d.l1:d.l2),n=+(d.aiN||20),ex=d.aiEx!==false;
 const existing=d.cards.filter(c=>c.t.trim()).map(c=>c.t.trim()).slice(0,150).join(', ');
 const prompt=`Du erstellst Vokabelkarten für einen deutschsprachigen Lerner (Niveau ${prefs.level}).
Seite „t“ ist auf ${L1}, Seite „d“ ist auf ${L2}.
${src?`Quelle:\n"""\n${src.slice(0,12000)}\n"""`:''}${d.aiImg?'\nDie Quelle ist das beigefügte Foto, zum Beispiel eine Buchseite oder Vokabelliste.':''}
Wenn die Quelle eine Wortliste ist, übernimm genau diese Wörter. Wenn es ein Text oder Foto ist, wähle die wichtigsten und nützlichsten Wörter daraus. Wenn es nur ein Thema ist, wähle häufige, passende Wörter.
Höchstens ${n} Karten. Substantive mit Artikel, Verben im Infinitiv. Keine Dopplungen${existing?`, und lass diese schon vorhandenen Begriffe weg: ${existing}`:''}.
${ex?`„ex“ ist ein kurzer, natürlicher Beispielsatz auf ${EXL}, der das Wort enthält.`:'„ex“ bleibt ein leerer String.'}
Antworte nur mit einem JSON-Array: [{"t":"…","d":"…","ex":"…"}]`;
 try{const r=await ai(prompt,{json:true,image:d.aiImg});
  const list=(Array.isArray(r)?r:(r&&Array.isArray(r.cards)?r.cards:[])).filter(x=>x&&x.t&&x.d).slice(0,n);
  if(!list.length)throw new AIError('Die KI hat keine Karten gefunden. Versuch es mit mehr Text oder einem klareren Thema.');
  d.cards=d.cards.filter(c=>c.t.trim()||c.d.trim()).concat(list.map(x=>({...blank(),t:String(x.t).trim(),d:String(x.d).trim(),ex:ex?String(x.ex||'').trim():''})));
  if(!d.title.trim()&&src&&src.length<60&&!src.includes('\n'))d.title=src;
  d.aiSrc='';d.aiImg=null;d.aiOpen=false;toast(`${list.length} Karten hinzugefügt. Prüf sie kurz und speichere.`)}
 catch(e){d.aiErr=e.message}
 d.aiBusy=false;if(view.draft===d)render()}
async function aiExamples(){const d=view.draft;
 const todo=d.cards.map((c,i)=>({c,i})).filter(x=>x.c.t.trim()&&!(x.c.ex||'').trim()).slice(0,60);if(!todo.length)return;
 d.exBusy=true;d.aiErr='';render();
 const EXL=langName(d.l1!=='de-DE'?d.l1:d.l2);
 try{const r=await ai(`Schreib für jede Vokabel einen kurzen, natürlichen Beispielsatz auf ${EXL} (Niveau ${prefs.level}), der das Wort enthält.
Antworte nur mit einem JSON-Array: [{"i":Nummer,"ex":"Satz"}]

`+todo.map(x=>`${x.i}: ${x.c.t} = ${x.c.d}`).join('\n'),{json:true});
  let n=0;(Array.isArray(r)?r:[]).forEach(o=>{const c=d.cards[+o.i];if(c&&o.ex&&!(c.ex||'').trim()){c.ex=String(o.ex).trim();n++}});
  toast(n?`${n} Beispielsätze ergänzt. Speichern nicht vergessen.`:'Keine Beispielsätze bekommen. Versuch es nochmal.')}
 catch(e){d.aiErr=e.message;d.aiOpen=true}
 d.exBusy=false;if(view.draft===d)render()}

/* ---------- Lese-Lupe ---------- */
const WORD_RE=/([\p{L}\p{M}][\p{L}\p{M}'’\-]*)/u;
/* ---------- Wort-Lupe überall: Wort antippen → Übersetzung passend zum Satz → ins Set ---------- */
let LUPE=null,lupeEl=null;const LUPEC={};
// Fremdsprachigen Text antippbar machen. o.ctx: ganzer Satz als Zusammenhang (wenn text nur ein Stück ist)
function tapText(text,lang,o={}){text=String(text==null?'':text);if(!lang||lang==='de-DE'||!aiOK()||!text.trim())return esc(text);
 const k=TAPS.push({text,lang,ctx:o.ctx||'',ex:o.ex||''})-1;
 return text.split(WORD_RE).map((t,i)=>i%2?`<span class="tw" data-act="tw" data-k="${k}" data-i="${i}">${esc(t)}</span>`:esc(t)).join('')}
const tapHint=()=>aiOK()?'<p class="tap-hint">Wörter im Text antippen: nachschlagen und sammeln.</p>':'';
function lupeBox(){if(!lupeEl){lupeEl=document.createElement('div');lupeEl.id='lupe-box';document.body.appendChild(lupeEl);
  lupeEl.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act]');if(!b||b.disabled)return;const f=acts[b.dataset.act];if(f){e.preventDefault();f(b,e)}})}
 return lupeEl}
function lupeClose(){LUPE=null;if(lupeEl)lupeEl.innerHTML='';try{document.body.classList.remove('lupe-open')}catch(e){}try{document.querySelectorAll('.tw.sel').forEach(x=>x.classList.remove('sel'))}catch(e){}}
function lupeSets(lang){return db.sets.filter(s=>!s.course&&targetLang(s)===lang)}
function lupeRender(){const L=LUPE,box=lupeBox();try{document.body.classList.toggle('lupe-open',!!L)}catch(e){}if(!L){box.innerHTML='';return}
 const inf=L.info,word=inf?inf.t:L.w,sets=lupeSets(L.lang),pref=(prefs.lupeSet||{})[L.lang],talk=sets.find(s=>s.talk);
 const cur=sets.some(s=>s.id===pref)?pref:talk?talk.id:'__talk';
 const opts=(talk?[]:[`<option value="__talk" ${cur==='__talk'?'selected':''}>Gesammelte Wörter (neu)</option>`]).concat(sets.map(s=>`<option value="${s.id}" ${s.id===cur?'selected':''}>${esc(s.title)}</option>`)).join('');
 box.innerHTML=`<section class="lupe" role="dialog" aria-label="Wort nachschlagen" aria-live="polite"><div class="row-between"><span class="lk-word" lang="${short(L.lang)}">${esc(word)}</span><span style="display:flex;gap:6px;align-items:center">${sayBtn(word,L.lang)}<button class="del" data-act="lupe-close" aria-label="Schließen">×</button></span></div>
 ${L.busy?'<p class="thinking">Schlage nach …</p>':L.err?errHtml(L.err)+'<button class="btn sm" data-act="lupe-retry">Nochmal</button>':inf?`<p><b>${esc(inf.d)}</b></p>${inf.note?`<p class="hint">${esc(inf.note)}</p>`:''}${L.sent&&L.sent.toLowerCase()!==L.w.toLowerCase()?`<p class="hint lupe-sent" lang="${short(L.lang)}">„${esc(L.sent.length>140?L.sent.slice(0,140)+' …':L.sent)}“</p>`:''}
 ${L.added?`<p class="good-text">${L.added.n?`✓ Gespeichert in „${esc(L.added.title)}“`:`Steht schon in „${esc(L.added.title)}“`}</p>`:`<div class="lupe-add"><select id="lupe-set" aria-label="In welches Set?">${opts}</select><button class="btn primary sm" data-act="lupe-add">+ ins Set</button></div>`}`:''}</section>`}
function lupeOpen(k,i,el){const T=TAPS[+k];if(!T)return;const toks=T.text.split(WORD_RE),w=toks[+i];if(!w)return;
 const sent=(T.ctx||sentenceAt(toks,+i)).replace(/\s+/g,' ').trim();
 try{document.querySelectorAll('.tw.sel').forEach(x=>x.classList.remove('sel'));if(el&&el.classList)el.classList.add('sel')}catch(e){}
 LUPE={w,sent,ex:(T.ex||sent).replace(/\s+/g,' ').trim(),lang:T.lang,key:T.lang+'|'+w.toLowerCase()+'|'+sent.toLowerCase().slice(0,240),info:null,busy:false,err:'',added:null};
 try{speak(w,T.lang)}catch(e){}
 lupeLookup()}
async function lupeLookup(force){const L=LUPE;if(!L)return;if(LUPEC[L.key]&&!force){L.info=LUPEC[L.key];return lupeRender()}
 L.busy=true;L.err='';lupeRender();const TL=langName(L.lang);
 try{const r=await ai(`Ein deutschsprachiger Lerner liest einen Text auf ${TL} und tippt auf das Wort „${L.w}“.
Satz: „${L.sent.slice(0,600)}“
Antworte nur mit JSON: {"t":"Grundform auf ${TL} (Substantiv mit Artikel, Verb im Infinitiv)","d":"Übersetzung auf Deutsch, passend zu diesem Satz","note":"sehr kurzer Hinweis auf Deutsch zur Form im Satz, z. B. Vergangenheit oder Mehrzahl, sonst leer"}`,{json:true,quick:true,cacheKey:`tw|${L.key}`});
  const info={t:String((r&&r.t)||L.w).trim(),d:String((r&&r.d)||'').trim(),note:String((r&&r.note)||'').trim()};
  if(!info.d)throw new Error('Keine Übersetzung bekommen.');LUPEC[L.key]=info;L.info=info}
 catch(e){L.err=e.message||'Nachschlagen hat nicht geklappt.'}
 L.busy=false;if(LUPE===L)lupeRender()}
function lupeAdd(){const L=LUPE;if(!L||!L.info||L.added)return;const sel=lupeEl&&lupeEl.querySelector('#lupe-set');const id=sel&&sel.value;
 let s=id&&id!=='__talk'?getSet(id):null;if(!s||targetLang(s)!==L.lang)s=talkSet(L.lang);
 prefs.lupeSet={...(prefs.lupeSet||{}),[L.lang]:s.id};savePrefs();
 const S=L.ex||L.sent||'',ex=S&&S.length<=160&&!/_{2,}/.test(S)&&S.toLowerCase()!==L.w.toLowerCase()?S:'';
 const n=addCards(s,[{t:L.info.t,d:L.info.d,ex}],true);L.added={title:s.title,n};save();lupeRender();if(view.name==='home')render()}
// Heute gesammelte Wörter (Startseite)
function gotCard(){const L=activeLang();if(!L||L==='de-DE')return '';const t0=new Date();t0.setHours(0,0,0,0);
 const by=db.sets.filter(s=>targetLang(s)===L).map(s=>({s,n:s.cards.filter(c=>(c.got||0)>=+t0).length})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
 const n=by.reduce((a,x)=>a+x.n,0);if(!n)return '';const top=by[0].s;
 return `<section class="note row-between" style="gap:10px"><span>📥 Heute ${n} ${n===1?'Wort':'Wörter'} gesammelt${by.length===1?` in „${esc(top.title)}“`:''}. Sie kommen nach und nach in deine Wachen.</span><button class="btn sm" data-act="open" data-id="${top.id}">Ansehen</button></section>`}
function knownSet(s){const k=targetLang(s)===s.l1?'t':'d';const out=new Set();
 s.cards.forEach(c=>{const v=plain(norm(c[k]).replace(ART,''));out.add(v);v.split(' ').forEach(p=>{if(p.length>3)out.add(p)})});return out}
function sentenceAt(toks,i){let a=i,b=i;const end=/[.!?…\n]/;while(a>0&&!end.test(toks[a-1]))a--;while(b<toks.length-1&&!end.test(toks[b]))b++;return toks.slice(a,b+1).join('').trim()}
function startReader(s){adoptLevel(targetLang(s));go('reader',{id:s.id,R:{edit:!s.txt,sel:null,info:{},busy:false,err:'',topic:''}})}
function vReader(){const s=getSet(view.id),R=view.R,TL=targetLang(s),editing=!R.yarn&&(R.edit||!s.txt);
 if(R.yarn&&(R.busy||!s.txt)){app.innerHTML=bar('home','Seemannsgarn')+`<section class="yarn-head"><div class="gc-gull">${gullSVG('idle',72,'think')}</div><div><h1>Seemannsgarn</h1><span class="hint">${esc(gullName())} spinnt eine Geschichte aus deinen Wörtern …</span></div></section>${R.err?errHtml(R.err)+'<button class="btn" data-act="yarn-new">Nochmal versuchen</button>':'<p class="thinking">Einen Moment, die Möwe holt Luft …</p>'}`;return}
 let h=R.yarn?bar('home','Seemannsgarn')+`<section class="yarn-head"><div class="gc-gull">${gullSVG('happy',72,'')}</div><div><h1>${esc(s.yarnTitle||'Seemannsgarn')}</h1><span class="hint">erzählt von ${esc(gullName())} · Wörter antippen zum Nachschlagen</span></div></section><div class="btn-row"><button class="btn sm" data-act="yarn-new" ${learnOffline()?'disabled':''}>Neues Garn spinnen</button></div>`
  :bar('set',s.title)+`<div class="row-between"><h1>Text lesen</h1>${!editing?`<button class="btn sm" data-act="rd-edit">Anderer Text</button>`:''}</div>`;
 if(editing){h+=`<div class="form">
  <label class="fld"><span>Text auf ${langName(TL)}</span><textarea id="rd-in" rows="8" lang="${short(TL)}" placeholder="Füg hier einen Artikel, einen Liedtext oder eine Nachricht ein.">${esc(s.txt||'')}</textarea></label>
  <button class="btn primary" data-act="rd-show">Text anzeigen</button>
  <section class="panel"><h2>Oder Übungstext erzeugen<span class="ai-tag">${aiName()}</span></h2><p class="hint">Die KI schreibt einen kurzen Text mit Wörtern aus diesem Set.</p>
   <div class="two"><label class="fld"><span>Thema (optional)</span><input id="rd-topic" value="${esc(R.topic||'')}" placeholder="z. B. Segeltörn an der Ostsee"></label>${levelSel()}</div>
   <button class="btn" data-act="rd-gen" ${R.busy?'disabled':''}>${R.busy?'KI schreibt …':'Text erzeugen'}</button>${errHtml(R.err)}</section></div>`}
 else{const toks=R.toks=s.txt.split(WORD_RE),known=knownSet(s);
  h+=`<div class="tools" style="justify-content:flex-start"><button class="chip" data-act="rd-say">Ganzen Text vorlesen</button><button class="chip" data-act="rd-stop">Stopp</button></div>
  <p class="hint">Tippe auf ein Wort für die Übersetzung. Grün unterstrichen sind Wörter aus deinem Set.</p>
  <div class="reader" lang="${short(TL)}">${toks.map((t,i)=>i%2?`<span class="w${known.has(plain(norm(t)))?' known':''}${R.sel===i?' sel':''}" data-act="w" data-i="${i}">${esc(t)}</span>`:esc(t)).join('')}</div>`;
  if(R.sel!=null&&toks[R.sel]){const w=toks[R.sel],inf=R.info[w.toLowerCase()]||{};
   h+=`<section class="lookup" aria-live="polite"><div class="row-between"><span class="lk-word">${esc(inf.t||w)}</span><span style="display:flex;gap:6px;align-items:center">${sayBtn(inf.t||w,TL)}<button class="del" data-act="rd-close" aria-label="Schließen">×</button></span></div>
   ${inf.busy?'<p class="thinking">Schlage nach …</p>':inf.err!=null?errHtml(inf.err)+'<button class="btn sm" data-act="rd-retry">Nochmal</button>':`<p><b>${esc(inf.d)}</b></p>${inf.note?`<p class="hint">${esc(inf.note)}</p>`:''}<div class="btn-row"><button class="btn primary sm" data-act="rd-add">Ins Set übernehmen</button>${inf.sent?`<button class="btn sm" data-act="rd-sent">${ICON.say} Satz anhören</button>`:''}</div>`}</section>`}}
 app.innerHTML=h}
async function readerTap(i,force){const R=view.R,s=getSet(view.id),toks=R.toks,w=toks&&toks[i];if(!w)return;
 R.sel=i;const key=w.toLowerCase();if(!force)speak(w,targetLang(s));
 if(R.info[key]&&!force&&R.info[key].err==null)return render();
 const sent=sentenceAt(toks,i);R.info[key]={busy:true};render();
 const TL=langName(targetLang(s)),NL=langName(nativeLang(s));
 try{const r=await ai(`Ein deutschsprachiger Lerner liest einen Text auf ${TL} und tippt auf das Wort „${w}“.
Satz: „${sent.slice(0,600)}“
Antworte nur mit JSON: {"t":"Grundform auf ${TL} (Substantiv mit Artikel, Verb im Infinitiv)","d":"Übersetzung auf ${NL}, passend zu diesem Satz","note":"sehr kurzer Hinweis auf Deutsch zur Form im Satz, z. B. Vergangenheit oder Mehrzahl, sonst leer"}`,{json:true,quick:true});
  R.info[key]={t:String(r.t||w).trim(),d:String(r.d||'').trim(),note:String(r.note||'').trim(),sent}}
 catch(e){R.info[key]={err:e.message||'Nachschlagen hat nicht geklappt.'}}
 if(view.R===R)render()}
async function readerGen(){const R=view.R,s=getSet(view.id);const tp=$('#rd-topic');if(tp)R.topic=tp.value.trim();
 R.busy=true;R.err='';render();
 const terms=shuffle(s.cards.map(c=>targetLang(s)===s.l1?c.t:c.d)).slice(0,25).join(', ');
 try{const t=await ai(`Schreib einen kurzen, zusammenhängenden Text (120 bis 180 Wörter) auf ${langName(targetLang(s))} für einen Lerner auf Niveau ${prefs.level} (GER). ${R.topic?`Thema: ${R.topic}.`:'Wähle ein alltagsnahes Thema, das zu den Wörtern passt.'}
Verwende möglichst viele dieser Wörter, gern auch gebeugt: ${terms}.
${weakHint(targetLang(s))?`Der Lerner übt gerade diese Themen. Lass sie mehrfach im Text vorkommen: ${weakHint(targetLang(s))}.\n`:''}Gib nur den Text aus, ohne Überschrift, ohne Übersetzung, ohne Markdown.`,{fresh:true});
  s.txt=t.trim().replace(/^[*#"„\s]+|["“*\s]+$/g,'');s.upd=now();save();R.edit=false;R.sel=null;R.info={}}
 catch(e){R.err=e.message}
 R.busy=false;if(view.R===R)render()}

/* ---------- Was ist das? (Foto) ---------- */
// Foto aufnehmen, die KI benennt bis zu 3 Dinge darauf in der Lernsprache
async function photoWhat(file){const A=view.A;if(!A||!file)return;A.busy=true;A.err='';A.res=null;A.photo=null;A.items=null;render();
 try{const img=await shrink(file);try{A.photo=URL.createObjectURL(img)}catch(e){}render();const TL=langName(A.lang);
  const r=await ai(`Auf dem Foto: Benenne die 1 bis 3 wichtigsten, deutlich sichtbaren Dinge auf ${TL} für einen deutschsprachigen Lerner (Niveau ${prefs.level}).
Antworte nur mit einem JSON-Array: [{"t":"Wort auf ${TL} (Substantiv mit Artikel)","d":"deutsches Wort mit Artikel","ex":"sehr einfacher Satz auf ${TL} mit dem Wort, passend zum Foto"}]
Wenn nichts Erkennbares drauf ist, antworte mit [].`,{json:true,image:img,quick:true});
  const list=(Array.isArray(r)?r:[]).filter(x=>x&&x.t&&x.d).slice(0,3).map(x=>({t:String(x.t).trim(),d:String(x.d).trim(),ex:String(x.ex||'').trim()}));
  if(!list.length)throw new AIError('Darauf konnte ich nichts erkennen. Probier ein Foto mit einem deutlichen Gegenstand.');
  A.items=list;A.hist=[...list.map(x=>({t:x.t,l:A.lang,de:x.d})),...A.hist].slice(0,12);prefs.listenHist=A.hist;savePrefs();if(prefs.auto)speak(list[0].t,A.lang)}
 catch(e){A.err=e.message}
 A.busy=false;if(view.A===A)render()}
function photoCards(A){if(!A.photo&&!A.items)return '';return `<section class="photo-res">${A.photo?`<img src="${A.photo}" alt="Dein Foto">`:''}<div class="stack">${(A.items||[]).map((x,i)=>`<div class="tr-card"><div class="row-between" style="flex-wrap:nowrap"><b lang="${short(A.lang)}">${esc(x.t)}</b>${sayBtn(x.t,A.lang)}</div><span>${esc(x.d)}</span>${x.ex?`<div class="row-between" style="flex-wrap:nowrap"><span class="hint" lang="${short(A.lang)}">${esc(x.ex)}</span>${sayBtn(x.ex,A.lang)}</div>`:''}<button class="btn sm" data-act="ph-add" data-i="${i}" ${x.added?'disabled':''}>${x.added?'✓ im Set':'+ ins Set'}</button></div>`).join('')}${A.busy&&!A.items?'<p class="thinking">Ich schau mir das an …</p>':''}</div></section>`}

/* ---------- Hördiktat und Aussprache ---------- */
// Gemeinsamer Wortvergleich: welche Wörter des Zielsatzes wurden getroffen?
const dWords=t=>plain(norm(t)).split(/\s+/).filter(Boolean);
function wordMatch(target,said){const T=String(target).split(/\s+/).filter(Boolean),tw=T.map(w=>plain(norm(w))),sw=dWords(said);
 const n=tw.length,m=sw.length,L=Array.from({length:n+1},()=>new Array(m+1).fill(0));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)L[i][j]=tw[i]&&tw[i]===sw[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
 const ok=new Array(n).fill(false);let i=0,j=0;while(i<n&&j<m){if(tw[i]&&tw[i]===sw[j]){ok[i]=true;i++;j++}else if(L[i+1][j]>=L[i][j+1])i++;else j++}
 tw.forEach((w,k)=>{if(!w)ok[k]=true});const hit=ok.filter(Boolean).length;return {words:T.map((w,k)=>({w,ok:ok[k]})),score:n?hit/n:0}}
const wordLine=(M,L,ctx)=>`<p class="wm" lang="${short(L)}">${M.words.map(x=>`<span class="${x.ok?'ok':'no'}">${ctx?tapText(x.w,L,{ctx}):esc(x.w)}</span>`).join(' ')}</p>`;
function practiceItems(s,max,short_){const L=targetLang(s),fwd=L===s.l1;
 const it=s.cards.map(c=>{const term=fwd?c.t:c.d,de=fwd?c.d:c.t,ex=(c.ex||'').trim();const useEx=ex&&!short_&&ex.length<=120;return {text:useEx?ex:term,de:useEx?'':de,cid:c.id}}).filter(x=>x.text&&x.text.length<=(short_?60:140));
 return shuffle(it).slice(0,max)}
function startDict(s){const items=practiceItems(s,10,false);if(!items.length)return toast('Dieses Set hat noch keine Karten');go('dict',{id:s.id,X:{items,i:0,res:null,ok:0}});setTimeout(()=>dictSay(false),250)}
function dictSay(slow){const X=view.X;if(!X||!X.items[X.i])return;speak(X.items[X.i].text,targetLang(getSet(view.id)),null,slow)}
function vDict(){const s=getSet(view.id),X=view.X,L=targetLang(s);let h=bar('set','Hördiktat');
 if(X.i>=X.items.length){h+=`<section class="summary"><span class="label">Ergebnis</span><div class="clock" style="font-size:3rem">${X.ok} / ${X.items.length}</div><p class="muted">${X.ok/X.items.length>=.8?'Starke Ohren!':'Hören braucht Übung. Mit jeder Runde wird es leichter.'}</p><div class="stack"><button class="btn primary wide" data-act="mode" data-m="dict">Neue Runde</button><button class="btn wide" data-act="back" data-to="set">Zum Set</button></div></section>`;app.innerHTML=h;return}
 const it=X.items[X.i],r=X.res;
 h+=`<div class="prog"><span>${X.i+1} / ${X.items.length}</span><div class="pbar"><i style="width:${X.i/X.items.length*100}%"></i></div></div>
 <section class="q"><p class="label">Hör zu und schreib auf, was du hörst</p>${voiceProblem(L)?`<p class="note">${esc(voiceProblem(L))}</p>`:''}
 <div class="btn-row"><button class="btn primary" data-act="dc-say">${ICON.say} Nochmal hören</button><button class="btn" data-act="dc-slow">Langsam</button></div>
 ${r?'':`<form class="write" id="dc-form" autocomplete="off"><input id="dc-in" lang="${short(L)}" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Was hast du gehört?" aria-label="Was hast du gehört?"><button class="btn primary">Prüfen</button></form><button class="linkbtn" data-act="dc-skip">Weiß ich nicht</button>`}
 ${r?`<div class="fb ${r.ok?'ok':'no'}"><strong>${r.ok?'Richtig gehört':Math.round(r.M.score*100)+' % getroffen'}</strong>${wordLine(r.M,L,it.text)}${r.input?`<span class="hint">Du: ${esc(r.input)}</span>`:''}${it.de?`<span class="hint">${esc(it.de)}</span>`:''}</div><div class="row-between"><span></span><button class="btn primary" id="dc-next" data-act="dc-next">Weiter</button></div>`:''}</section>`;
 app.innerHTML=h;if(!r){const i=$('#dc-in');if(i&&i.focus)i.focus()}else{const b=$('#dc-next');if(b&&b.focus)b.focus()}}
function dictCheck(input){const X=view.X,it=X.items[X.i];const M=wordMatch(it.text,input||'');const ok=M.score>=.999||(M.score>=.85&&dWords(it.text).length>=5);X.res={M,ok,input};if(ok)X.ok++;logAnswer();render()}
function startPron(s){if(!MIC_OK)return toast('Spracherkennung gibt es in diesem Browser nicht');const items=practiceItems(s,10,true);if(!items.length)return toast('Dieses Set hat noch keine Karten');go('pron',{id:s.id,X:{items,i:0,res:null,ok:0,tries:0}})}
function vPron(){const s=getSet(view.id),X=view.X,L=targetLang(s);let h=bar('set','Aussprache');
 if(X.i>=X.items.length){h+=`<section class="summary"><span class="label">Ergebnis</span><div class="clock" style="font-size:3rem">${X.ok} / ${X.items.length}</div><p class="muted">${X.ok/X.items.length>=.8?'Klingt richtig gut!':'Hör dir die Wörter öfter an und sprich sie langsam nach.'}</p><div class="stack"><button class="btn primary wide" data-act="mode" data-m="pron">Neue Runde</button><button class="btn wide" data-act="back" data-to="set">Zum Set</button></div></section>`;app.innerHTML=h;return}
 const it=X.items[X.i],r=X.res;
 h+=`<div class="prog"><span>${X.i+1} / ${X.items.length}</span><div class="pbar"><i style="width:${X.i/X.items.length*100}%"></i></div></div>
 <section class="q"><p class="label">Sprich das laut aus</p><div class="q-prompt"><div lang="${short(L)}">${r?wordLine(r.M,L):esc(it.text)}</div>${sayBtn(it.text,L)}</div>${it.de?`<p class="hint">${esc(it.de)}</p>`:''}
 <div class="pron-mic"><button class="btn primary big-mic ${X.listening?'listening':''}" data-act="pr-rec" aria-label="Jetzt sprechen">${ICON.mic}<span>${X.listening?'Ich höre zu …':r?'Nochmal sprechen':'Sprechen'}</span></button></div>
 ${r?`<div class="fb ${r.ok?'ok':'no'}"><strong>${r.ok?'Sehr gut verstanden':Math.round(r.M.score*100)+' % verstanden'}</strong><span class="hint">Verstanden: „${esc(r.heard)}“</span>${r.ok?'':'<span class="hint">Hör dir die Aussprache an und versuch es nochmal. Rot markierte Wörter hat die Erkennung nicht verstanden.</span>'}</div>
 <div class="row-between"><span></span><button class="btn ${r.ok?'primary':''}" data-act="pr-next">Weiter</button></div>`:''}</section>
 <p class="hint">Die Erkennung ist nicht perfekt, gerade bei Eigennamen. Sie zeigt dir aber gut, welche Wörter noch undeutlich klingen.</p>`;
 app.innerHTML=h}
function pronRec(){const X=view.X,s=getSet(view.id),it=X.items[X.i];if(!it)return;X.listening=true;render();
 listen(targetLang(s),{quiet:true,onFinal:alts=>{const best=alts.map(a=>({a,M:wordMatch(it.text,a)})).sort((x,y)=>y.M.score-x.M.score)[0];const ok=best.M.score>=.8;
   const first=!X.res;X.res={M:best.M,ok,heard:best.a};if(ok&&(first||!X.res.counted)){X.ok++;X.res.counted=true}X.tries++;logAnswer();X.listening=false;render()},
  onNone:()=>{X.listening=false;render()}})}

/* ---------- Seemannsgarn ---------- */
// Die Möwe spinnt eine kurze Geschichte aus deinen gelernten Wörtern, zum Mitlesen, Anhören und Nachschlagen
function startYarn(L){if(!L||L==='de-DE')return;const s=talkSet(L);go('reader',{id:s.id,R:{yarn:true,edit:false,sel:null,info:{},busy:false,err:'',topic:''}});if(!s.txt)yarnGen()}
async function yarnGen(){const R=view.R,s=getSet(view.id),L=targetLang(s),TL=langName(L);R.busy=true;R.err='';render();
 const learned=db.sets.filter(x=>targetLang(x)===L).flatMap(x=>x.cards.filter(c=>c.lv>=1).map(c=>L===x.l1?c.t:c.d));
 const pool=learned.length>=12?learned:db.sets.filter(x=>targetLang(x)===L).flatMap(x=>x.cards.map(c=>L===x.l1?c.t:c.d));
 const words=shuffle([...new Set(pool)]).slice(0,30);
 try{const r=await ai(`Du bist ${gullName()}, eine Möwe, die gern Seemannsgarn spinnt. Erzähl auf ${TL} eine kurze, lustige Geschichte aus dem Hafen oder von einer Seefahrt (100 bis 160 Wörter) für einen Lerner auf Niveau ${prefs.level}.
${words.length?`Benutze möglichst viele dieser Wörter, die der Lerner schon kann: ${words.join(', ')}. Andere Wörter nur, wenn sie sehr einfach sind.\n`:''}${weakHint(L)?`Lass diese Themen mehrfach vorkommen: ${weakHint(L)}.\n`:''}Kurze Sätze, ein überraschendes Ende. Antworte nur mit JSON: {"titel":"kurzer Titel auf ${TL}","text":"die Geschichte"}`,{json:true,fresh:true,cacheKey:`yarn|${L}`});
  const t=String(r&&r.text||'').trim();if(t.length<40)throw new AIError('Die Möwe hat den Faden verloren. Versuch es nochmal.');
  s.txt=t;s.yarnTitle=String(r.titel||'').trim();s.upd=now();save();R.sel=null;R.info={};if(prefs.auto&&view.R===R){}}
 catch(e){R.err=e.message}
 R.busy=false;if(view.R===R)render()}

/* ---------- Gesprächstrainer ---------- */
const SCENES=['Smalltalk am Steg','Ein Boot mieten','Im Restaurant bestellen','Nach dem Weg fragen','Einkaufen auf dem Markt','Beim Arzt'];
const TALK_MAX=10,TALK_UNIT=6;
function talkSet(L){let s=db.sets.find(x=>x.talk&&x.l1===L);if(s&&s.title==='Aus Gesprächen'){s.title='Gesammelte Wörter';s.upd=now()}if(!s){s={id:uid(),title:'Gesammelte Wörter',l1:L,l2:'de-DE',talk:true,best:null,upd:now(),cards:[]};db.sets.push(s);save()}return s}
function startFreeTalk(L){if(!L)return;startTalk(talkSet(L))}
function freeTalkCard(){const L=activeLang();if(!L||L==='de-DE'||!aiOK())return '';const off=learnOffline();
 return `<section class="panel talk-card"><div class="row-between" style="flex-wrap:nowrap;gap:12px"><div><h2>Freies Gespräch</h2><p class="hint">Rollenspiel auf ${langName(L)}: Smalltalk am Steg, Boot mieten, Restaurant, Arzt … oder deine eigene Situation. Mit Auswertung am Ende.</p></div><span class="talk-ico" aria-hidden="true">💬</span></div>
  <button class="btn ${off?'':'primary'}" data-act="free-talk" ${off?'disabled':''}>Gespräch starten</button>${off?'<p class="hint">Offline: geht wieder, sobald du online bist.</p>':''}</section>`}
function startTalk(s,unit){adoptLevel(targetLang(s));go('talk',{id:s.id,C:{stage:'setup',scn:SCENES[0],custom:'',turns:[],busy:false,err:'',review:null,picks:new Set(),unit:!!unit,max:unit?TALK_UNIT:TALK_MAX}})}
const talkMine=C=>(C.turns||[]).filter(t=>t.role==='user').length;
// Gespräch ist zu Ende, sobald der Lerner sein Kontingent geschrieben und die KI sich verabschiedet hat
const talkOver=C=>!!C.max&&talkMine(C)>=C.max&&C.turns.length&&C.turns[C.turns.length-1].role==='assistant';
function talkRules(s,C){const TL=langName(targetLang(s));const L0=targetLang(s),pool=s.talk?db.sets.filter(x=>targetLang(x)===L0).flatMap(x=>x.cards.map(c=>L0===x.l1?c.t:c.d)):s.cards.map(c=>L0===s.l1?c.t:c.d);const terms=shuffle(pool).slice(0,30).join(', ');
 return `Du bist Gesprächspartner in einem Sprach-Rollenspiel. Sprich ausschließlich ${TL}.
Situation: ${C.custom.trim()||C.scn}. Du spielst die passende Gegenrolle, der Lerner spielt sich selbst.
Niveau des Lerners: ${prefs.level} (GER). Passe Wortschatz und Satzlänge daran an.
Antworte kurz mit 1 bis 3 Sätzen und stell meist eine Frage, damit das Gespräch weitergeht.
Das Gespräch ist auf ${C.max||TALK_MAX} Nachrichten des Lerners angelegt, bisher hat er ${talkMine(C)} geschrieben. ${talkMine(C)>=(C.max||TALK_MAX)?'WICHTIG: Das war seine letzte Nachricht. Beende das Gespräch jetzt freundlich und natürlich in deiner Rolle, zum Beispiel mit einer Verabschiedung. Stelle KEINE Frage mehr.':talkMine(C)===(C.max||TALK_MAX)-1?'Steuere jetzt auf einen natürlichen Abschluss zu.':''}
Korrigiere Fehler nicht im Gespräch, das passiert später in einer Auswertung. Wenn der Lerner Deutsch schreibt oder nicht weiterweiß, antworte trotzdem auf ${TL}, aber einfacher.
Baue nach Möglichkeit Wörter ein, die der Lerner gerade übt: ${terms}.
${weakHint(targetLang(s))?`Der Lerner hat Schwierigkeiten mit: ${weakHint(targetLang(s))}. Lenke das Gespräch unauffällig so, dass er genau diese Strukturen und Wörter selbst benutzen muss, zum Beispiel durch passende Fragen.\n`:''}Antworte auf jede Nachricht nur mit JSON in dieser Form: {"reply":"deine Antwort auf ${TL}","de":"deutsche Übersetzung deiner Antwort"}`}
async function talkSend(text){const C=view.C,s=getSet(view.id);if(C.busy)return;
 if(text){C.turns.push({role:'user',content:text});C.saved=false}
 C.busy=true;C.err='';render();
 const hist=C.turns.slice(-20).map(t=>({role:t.role,content:t.role==='assistant'?JSON.stringify({reply:t.content,de:t.de}):t.content}));
 if(hist.length&&hist[0].role==='assistant')hist.unshift({role:'user',content:'(Gespräch läuft bereits)'});
 const input=[{role:'user',content:talkRules(s,C)+(C.turns.length?'':'\n\nBeginne jetzt das Gespräch mit deiner ersten Nachricht.')},...hist];
 try{const r=await ai(input,{json:true,fresh:true,quick:true});const reply=String((r&&(r.reply||r.antwort))||'').trim();
  if(!reply)throw new AIError('Die KI hat nichts geantwortet. Versuch es nochmal.');
  C.turns.push({role:'assistant',content:reply,de:String(r.de||'').trim()});
  if(prefs.auto&&view.C===C)speak(reply,targetLang(s))}
 catch(e){C.err=e.message}
 C.busy=false;if(view.C===C){render();const inp=$('#c-in');if(inp&&!C.err)inp.focus()}}
async function talkReview(){const C=view.C,s=getSet(view.id),TL=langName(targetLang(s));
 C.stage='review';C.busy=true;C.err='';C.review=null;render();
 const transcript=C.turns.map(t=>(t.role==='user'?'Lerner: ':'Partner: ')+t.content).join('\n');
 const have=s.cards.map(c=>targetLang(s)===s.l1?c.t:c.d).slice(0,200).join(', ');
 try{const r=await ai(`Hier ist ein Rollenspiel-Gespräch auf ${TL}. Der Lerner (Niveau ${prefs.level}) ist „Lerner“, die KI ist „Partner“.

${transcript.slice(-12000)}

Gib dem Lerner Rückmeldung auf Deutsch. Antworte nur mit JSON:
{"lob":"ein Satz, was gut war","fehler":[{"du":"Satz des Lerners","besser":"korrigierte, natürliche Version auf ${TL}","warum":"kurze Erklärung auf Deutsch"}],"woerter":[{"t":"Wort auf ${TL} (Substantiv mit Artikel, Verb im Infinitiv)","d":"deutsche Übersetzung","ex":"Beispielsatz auf ${TL}"}],"niveau":{"grammatik":Zahl oder null,"wortschatz":Zahl oder null},"schwaechen":[{"thema":"kurzer deutscher Themenname","art":"grammatik oder wortschatz","erklaerung":"1 bis 2 Sätze auf Deutsch, was der Lerner falsch macht","beispiel":"richtiger Beispielsatz auf ${TL}"}]}
„fehler“: nur echte Fehler des Lerners, höchstens 8, sonst leeres Array.
„woerter“: 3 bis 8 nützliche Wörter aus dem Gespräch, die nicht schon in dieser Liste stehen: ${have}
„niveau“: schätze nur aus den Sätzen des Lerners sein aktives Niveau als Zahl von 0 bis 6. 0 bis 1 = A1, 1 bis 2 = A2, 2 bis 3 = B1, 3 bis 4 = B2, 4 bis 5 = C1, 5 bis 6 = C2. Beispiel: 1.7 heißt oberes A2. Wenn der Lerner zu wenig geschrieben hat, setze null.
„schwaechen“: höchstens 3 wiederkehrende Muster hinter den Fehlern, z. B. „Zeitformen der Vergangenheit“ oder „Artikel und Geschlecht“. Keine Einzelfälle. ${weakHint(targetLang(s))?`Nutze denselben Themennamen, wenn es um eines dieser bekannten Themen geht: ${Object.values(prof(targetLang(s)).weak).map(w=>w.topic).slice(0,20).join('; ')}.`:''}`,{json:true,fresh:true});
  const nv=r.niveau||{},sw=(Array.isArray(r.schwaechen)?r.schwaechen:[]).filter(x=>x&&x.thema).slice(0,3);
  const enough=C.turns.filter(t=>t.role==='user').length>=3;
  C.review={lob:String(r.lob||''),fehler:(Array.isArray(r.fehler)?r.fehler:[]).filter(f=>f&&f.besser),woerter:(Array.isArray(r.woerter)?r.woerter:[]).filter(w=>w&&w.t&&w.d),
   g:enough?clampLv(nv.grammatik):null,v:enough?clampLv(nv.wortschatz):null,sw,enough};
  if(!C.saved){C.saved=true;const lang=targetLang(s);addPoint(lang,C.review.g,C.review.v,'talk');addWeak(lang,sw)}
  if(s.course){const c=getCourse(s.course),u=unitOf(c,s.unit);if(u&&!u.talked){u.talked=true;c.upd=now();save()}}
  C.picks=new Set(C.review.woerter.map((_,i)=>i))}
 catch(e){C.err=e.message}
 C.busy=false;if(view.C===C)render()}
function vTalk(){const s=getSet(view.id),C=view.C,TL=targetLang(s);let h=bar(s.talk?'home':'set',s.talk?'Freies Gespräch':s.title);
 if(C.stage==='setup'){
  h+=`<div class="form"><h1>Gespräch üben<span class="ai-tag">${aiName()}</span></h1><p class="muted">Du sprichst ${langName(TL)}, die KI spielt die Gegenrolle. Nach ${C.max} Nachrichten verabschiedet sich die KI, dann bekommst du eine Auswertung mit deinen Fehlern und neuen Wörtern.</p>
  <div class="fld"><span>Situation</span><div class="chips">${SCENES.map(x=>`<button class="chip ${!C.custom.trim()&&C.scn===x?'on':''}" data-act="tk-scn" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>
  <label class="fld"><span>Oder eigene Situation</span><input id="tk-custom" data-c="custom" value="${esc(C.custom)}" placeholder="z. B. beim Hafenmeister anmelden"></label>
  ${levelSel()}
  <button class="btn primary wide" data-act="tk-start">Gespräch starten</button></div>`;
  app.innerHTML=h;return}
 if(C.stage==='chat'){const mine=C.turns.some(t=>t.role==='user'),last=C.turns[C.turns.length-1];
  const n=Math.min(talkMine(C),C.max);
  h+=`<div class="row-between"><h1>${esc(C.custom.trim()||C.scn)}</h1><span class="pill">${esc(prefs.level)}</span></div>
  <div class="talk-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${C.max}" aria-valuenow="${n}" aria-label="Deine Nachrichten"><span>Deine Nachrichten: ${n} von ${C.max}</span><div class="dots">${Array.from({length:C.max},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div></div>
  <div class="chat">${C.turns.map(t=>t.role==='user'?`<div class="bub me">${esc(t.content)}</div>`:`<div class="bub ai" lang="${short(TL)}"><div class="bub-head"><span>${tapText(t.content,TL)}</span>${sayBtn(t.content,TL)}</div>${t.de?`<details><summary>Übersetzung</summary><span class="tr">${esc(t.de)}</span></details>`:''}</div>`).join('')}
  ${C.busy?'<div class="bub ai thinking">schreibt …</div>':''}</div>${C.turns.length<3?tapHint():''}
  ${talkOver(C)&&!C.busy?`<div class="talk-done"><div class="w-gull">${gullSVG('cheer',72,'')}</div><div><b>Gespräch geschafft!</b><span class="hint">${C.max} Nachrichten auf ${langName(TL)}. Jetzt schauen wir, was gut lief.</span></div></div>
  <div class="btn-row"><button class="btn primary wide" data-act="tk-end">Zur Auswertung</button></div>`:`
  ${C.err?errHtml(C.err)+((!last||last.role==='user')?'<button class="btn sm" data-act="tk-retry">Nochmal versuchen</button>':''):''}
  <form class="write" id="c-form" autocomplete="off"><input id="c-in" lang="${short(TL)}" placeholder="Antwort auf ${langName(TL)}" aria-label="Deine Antwort" ${C.busy?'disabled':''}>${micBtn('c-in',TL)}<button class="btn primary" ${C.busy?'disabled':''}>Senden</button></form>
  ${dictHint}`}
  <div class="tools">${autoChip()}${talkOver(C)?'':`<button class="chip" data-act="tk-end" ${mine&&!C.busy?'':'disabled'}>Früher beenden und auswerten</button>`}${C.unit?'':'<button class="chip" data-act="tk-new">Neue Situation</button>'}</div>`;
  app.innerHTML=h;const ch=document.querySelector('.chat'),dn=document.querySelector('.talk-done');const tg=dn||(ch&&ch.lastElementChild);if(tg&&tg.scrollIntoView)tg.scrollIntoView({block:'nearest'});return}
 const R=C.review;h+=`<h1>Auswertung</h1>`;
 if(C.busy)h+=`<p class="thinking">Die KI wertet dein Gespräch aus …</p>`;
 else if(!R)h+=errHtml(C.err)+`<button class="btn" data-act="tk-end">Nochmal versuchen</button>`;
 else{h+=`${R.lob?`<div class="fb ok"><strong>Das war gut</strong><span>${esc(R.lob)}</span></div>`:''}
  ${R.g!=null||R.v!=null?`<section class="panel"><span class="label">So wirkt dein ${langName(TL)} in diesem Gespräch</span><div class="lv-stats"><div class="lv-stat"><b style="color:var(--s-gram)">${lvlName(R.g)}</b><span>Grammatik</span></div><div class="lv-stat"><b style="color:var(--s-voc)">${lvlName(R.v)}</b><span>Wortschatz</span></div></div><p class="hint">Fließt in deine Lernkurve auf der Startseite ein.</p></section>`:R.enough?'':'<p class="hint">Für eine Niveau-Einschätzung schreib beim nächsten Mal mindestens drei Nachrichten.</p>'}
  ${R.sw.length?`<section class="stack"><h2>Erkannte Baustellen</h2><div class="weak-list">${R.sw.map(x=>`<div class="weak-row"><b>${esc(x.thema)}<span class="cat ${/wort/i.test(x.art||'')?'v':'g'}">${/wort/i.test(x.art||'')?'Wortschatz':'Grammatik'}</span></b>${x.erklaerung?`<span class="hint">${esc(x.erklaerung)}</span>`:''}<button class="btn sm" data-act="drill" data-l="${TL}" data-k="${esc(wkey(x.thema))}">Üben</button></div>`).join('')}</div></section>`:''}
  <section class="stack"><h2>Verbesserungen</h2>${R.fehler.length?R.fehler.map(f=>`<div class="fix">${f.du?`<span><s>${esc(f.du)}</s></span>`:''}<span class="row-between"><b>${esc(f.besser)}</b>${sayBtn(f.besser,TL)}</span>${f.warum?`<span class="hint">${esc(f.warum)}</span>`:''}</div>`).join(''):'<p class="muted">Keine Fehler gefunden. Stark!</p>'}</section>
  ${R.woerter.length?`<section class="stack"><h2>Neue Wörter</h2><div class="terms">${R.woerter.map((w,i)=>`<label class="pick-row"><input type="checkbox" id="pick${i}" data-pick="${i}" ${C.picks.has(i)?'checked':''}><span class="tr-t">${esc(w.t)}</span><span class="tr-d">${esc(w.d)}</span></label>`).join('')}</div>
   <button class="btn primary" data-act="tk-add" ${C.picks.size?'':'disabled'}>${C.picks.size} ${C.picks.size===1?'Wort':'Wörter'} ins Set übernehmen</button></section>`:''}`}
 h+=C.unit?`<div class="btn-row"><button class="btn primary" data-act="back" data-to="unit" ${C.busy?'disabled':''}>Zurück zur Etappe</button><button class="btn" data-act="tk-new" ${C.busy?'disabled':''}>Neues Gespräch</button></div>`
  :`<div class="btn-row"><button class="btn" data-act="tk-back" ${C.busy?'disabled':''}>Weiter sprechen</button><button class="btn" data-act="tk-new">Neue Situation</button></div>`;
 app.innerHTML=h}
