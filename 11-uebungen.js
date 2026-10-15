// Vokabelkoje – uebungen
/* ---------- Test ---------- */
function makeTest(s,n,types,dir){
 return shuffle(pool(s).slice()).slice(0,n).map(c=>{const type=types[Math.floor(Math.random()*types.length)];
  const k=dir==='t'?'t':'d',prompt=dir==='t'?c.d:c.t,answer=c[k];const q={type,cid:c.id,prompt,answer};
  if(type==='mc')q.opts=options(s,c,dir);
  if(type==='tf'){const others=s.cards.filter(x=>x.id!==c.id&&x[k]!==answer);const wrong=others.length&&Math.random()<.5;q.shown=wrong?others[Math.floor(Math.random()*others.length)][k]:answer;q.truth=!wrong}
  return q})}
function vTest(){
 const s=getSet(view.id),T=view.T;
 if(!T){const n=pool(s).length;const counts=[5,10,20].filter(x=>x<n);
  app.innerHTML=bar('set',s.title)+`<div class="form"><h1>Test einrichten</h1>
  <label class="fld"><span>Anzahl Fragen</span><select id="ts-n">${counts.map(x=>`<option value="${x}" ${x===10?'selected':''}>${x}</option>`).join('')}<option value="${n}" ${counts.includes(10)?'':'selected'}>Alle (${n})</option></select></label>
  <fieldset><legend>Fragearten</legend>
   <label class="check"><input type="checkbox" id="ts-mc" checked> Multiple Choice</label>
   <label class="check"><input type="checkbox" id="ts-write" checked> Selbst schreiben</label>
   <label class="check"><input type="checkbox" id="ts-tf" checked> Richtig oder falsch</label></fieldset>
  <label class="fld"><span>Antworten auf</span><select id="ts-dir"><option value="t" ${prefs.dir==='t'?'selected':''}>${langName(s.l1)}</option><option value="d" ${prefs.dir==='d'?'selected':''}>${langName(s.l2)}</option></select></label>
  <button class="btn primary wide" data-act="ts-start">Test starten</button></div>`;return}
 const sub=T.submitted, ansLang=T.dir==='t'?s.l1:s.l2;
 const head=sub?`<section class="score"><span class="label">Ergebnis</span><b>${T.score} / ${T.qs.length}</b><span class="muted">${Math.round(T.score/T.qs.length*100)} % richtig${T.score===T.qs.length?' · alles fehlerfrei':''}</span></section>`
  :`<h1>Test · ${T.qs.length} Fragen</h1>`;
 app.innerHTML=bar('set',s.title)+head+`<form id="ts-form" class="stack" autocomplete="off">${T.qs.map((q,i)=>{const a=T.ans[i],st=sub?(T.ok[i]?'ok':'no'):'';
  let inner='';
  if(q.type==='mc')inner=`<p class="label">Frage ${i+1} · Wähle die Antwort</p><div class="tq-prompt row-between" style="flex-wrap:nowrap"><span>${esc(q.prompt)}</span>${sayBtn(q.prompt,ansLang===s.l1?s.l2:s.l1)}</div><div class="stack">${q.opts.map((o,j)=>{let cl='';if(sub){if(o===q.answer)cl='ok';else if(a===j)cl='no'}
   return `<label class="radio ${cl}"><input type="radio" name="q${i}" value="${j}" ${a===j?'checked':''} ${sub?'disabled':''}>${esc(o)}</label>`}).join('')}</div>`;
  if(q.type==='write')inner=`<p class="label">Frage ${i+1} · Auf ${langName(ansLang)} schreiben</p><div class="tq-prompt row-between" style="flex-wrap:nowrap"><span>${esc(q.prompt)}</span>${sayBtn(q.prompt,ansLang===s.l1?s.l2:s.l1)}</div><div class="write"><input type="text" id="tq${i}" name="q${i}" lang="${short(ansLang)}" value="${esc(a||'')}" ${sub?'disabled':''} autocapitalize="off" spellcheck="false" aria-label="Antwort Frage ${i+1}">${sub?'':micBtn('tq'+i,ansLang)}</div>${sub&&!T.ok[i]?`<p>Richtig: <b>${esc(q.answer)}</b></p>`:''}`;
  if(q.type==='tf')inner=`<p class="label">Frage ${i+1} · Stimmt das?</p><div class="tq-prompt row-between" style="flex-wrap:nowrap"><span>${esc(q.prompt)} <span class="muted">=</span> ${esc(q.shown)}</span>${sayBtn(q.prompt,ansLang===s.l1?s.l2:s.l1)}</div><div class="tf">${[['1','Richtig'],['0','Falsch']].map(([v,l])=>{let cl='';if(sub){if((v==='1')===q.truth)cl='ok';else if(a===v)cl='no'}
   return `<label class="radio ${cl}"><input type="radio" name="q${i}" value="${v}" ${a===v?'checked':''} ${sub?'disabled':''}>${l}</label>`}).join('')}</div>${sub&&!q.truth?`<p>Richtig: <b>${esc(q.answer)}</b></p>`:''}`;
  return `<div class="tq ${st}">${inner}</div>`}).join('')}
 ${sub?`<button type="button" class="btn primary wide" data-act="ts-new">Neuer Test</button>${T.score<T.qs.length?`<button type="button" class="btn wide" data-act="ts-wrong">Falsche Begriffe als Karteikarten üben</button>`:''}`:`<button class="btn primary wide">Abgeben</button>`}</form>`;
}
function testSubmit(){const T=view.T,form=$('#ts-form');T.ans=T.qs.map((q,i)=>{if(q.type==='write')return form.elements['q'+i].value;const el=form.querySelector(`input[name=q${i}]:checked`);if(!el)return null;return q.type==='mc'?+el.value:el.value});
 T.ok=T.qs.map((q,i)=>{const a=T.ans[i];if(q.type==='mc')return a!=null&&q.opts[a]===q.answer;if(q.type==='write')return check(a||'',q.answer)>0;return a!=null&&(a==='1')===q.truth});
 T.score=T.ok.filter(Boolean).length;T.submitted=true;logAnswer(T.qs.length);db.fresh=false;save();render();window.scrollTo(0,0)}

/* ---------- Zuordnen ---------- */
const fmt=ms=>(ms/1000).toFixed(1).replace('.',',')+' s';
function startMatch(s){const picks=shuffle(pool(s).slice()).slice(0,6);
 const tiles=shuffle(picks.flatMap(c=>[{cid:c.id,text:c.t,k:'t'},{cid:c.id,text:c.d,k:'d'}]));
 go('match',{id:s.id,M:{tiles,gone:[],sel:null,bad:[],t0:performance.now(),pen:0,done:null,lock:false}})}
const elapsed=M=>performance.now()-M.t0+M.pen;
function vMatch(){
 const s=getSet(view.id),M=view.M;
 if(M.done!=null){const rec=s.best===M.done;
  app.innerHTML=bar('set',s.title)+`<section class="summary"><span class="label">${rec?'Neue Bestzeit':'Geschafft'}</span><div class="clock" style="font-size:3rem">${fmt(M.done)}</div>
  <p class="muted">${M.pen?`Darin ${M.pen/1000} s Strafzeit für falsche Paare. `:''}Bestzeit: ${fmt(s.best)}</p>
  <button class="btn primary wide" data-act="mode" data-m="match">Nochmal spielen</button></section>`;return}
 app.innerHTML=bar('set',s.title)+`<div class="row-between"><h1>Zuordnen</h1><span class="clock" id="mt">${fmt(elapsed(M))}</span></div>
 <p class="muted">Tippe zwei Kacheln an, die zusammengehören. Falsche Paare kosten 1 Sekunde.</p>
 <div class="grid">${M.tiles.map((t,i)=>`<button class="tile ${t.k} ${M.gone.includes(i)?'gone':''} ${M.sel===i?'sel':''} ${M.bad.includes(i)?'bad':''}" data-act="tile" data-i="${i}" ${M.gone.includes(i)?'tabindex="-1" aria-hidden="true"':''}>${esc(t.text)}</button>`).join('')}</div>`;
 if(!timer)timer=setInterval(()=>{const el=$('#mt');if(el&&view.M&&view.M.done==null)el.textContent=fmt(elapsed(view.M))},100);
}
function tile(i){const M=view.M,s=getSet(view.id);if(M.lock||M.gone.includes(i))return;
 if(M.sel==null){M.sel=i;return render()}if(M.sel===i){M.sel=null;return render()}
 const a=M.tiles[M.sel],b=M.tiles[i];
 if(a.cid===b.cid&&a.k!==b.k){M.gone.push(M.sel,i);M.sel=null;
  if(M.gone.length===M.tiles.length){M.done=Math.round(elapsed(M));clearInterval(timer);timer=null;if(!s.best||M.done<s.best){s.best=M.done;s.upd=now()}logAnswer(M.tiles.length/2);db.fresh=false;save()}
  return render()}
 M.bad=[M.sel,i];M.pen+=1000;M.lock=true;render();
 setTimeout(()=>{if(view.M!==M)return;M.bad=[];M.sel=null;M.lock=false;render()},550)}

/* ---------- Stimmen ---------- */
const SAMPLE={en:'Hello and welcome on board. Hoist the sail!',de:'Hallo und willkommen an Bord. Segel setzen!',es:'Hola y bienvenido a bordo. ¡Iza la vela!',fr:'Bonjour et bienvenue à bord. Hissez la voile !',it:'Ciao e benvenuto a bordo. Issa la vela!',nl:'Hallo en welkom aan boord.',pt:'Olá e bem-vindo a bordo.',sv:'Hej och välkommen ombord.',da:'Hej og velkommen om bord.',no:'Hei og velkommen om bord.',pl:'Cześć, witaj na pokładzie.'};
const rateLabel=r=>r<.8?'langsam':r>1.05?'schnell':'normal';
function ttsStatus(lang){const L=lang||activeLang()||'en-GB',list=ranked(L),best=pickVoice(L);
 const row=(ok,txt)=>`<li class="${ok===true?'ok':ok===false?'no':''}"><span aria-hidden="true">${ok===true?'✓':ok===false?'✗':'•'}</span><span>${txt}</span></li>`;
 return `<ul class="diag">${row(hasTTS,hasTTS?'Vorlesen wird von diesem Browser unterstützt':'Dieser Browser bzw. diese Ansicht hat keine Vorlese-Stimme')}
  ${hasTTS?row(list.length>0?true:voices.length?false:null,list.length?`${list.length} ${list.length===1?'Stimme':'Stimmen'} für ${langName(L)}, genutzt wird „${esc(best.name)}“`:voices.length?`Keine Stimme für ${langName(L)} installiert`:'Stimmen werden noch geladen …'):''}
  ${STANDALONE?row(cloudOK()?true:null,cloudOK()?'Gemini-Stimme als Ersatz bereit':'Gemini-Stimme als Ersatz: erst Gemini einrichten'):''}
  ${ttsOk?row(true,'Es wurde schon erfolgreich vorgelesen'):''}${ttsErr?row(false,'Letztes Problem: '+esc(ttsErr)):''}</ul>`}
function vVoices(){const used=[...new Set([activeLang()||'en-GB','de-DE',...db.sets.flatMap(s=>[s.l1,s.l2])])].filter(Boolean),L=activeLang()||used[0];
 app.innerHTML=bar('home','Ton und Stimmen')+`<div class="form"><h1>Ton und Stimmen</h1>
 <section class="panel"><h2>Ton testen</h2><p class="hint">Tippe auf den Knopf. Hörst du nichts: Lautstärke hochdrehen, beim iPhone den Stummschalter an der Seite prüfen und Bluetooth-Kopfhörer kontrollieren.</p>
  <div class="btn-row"><button class="btn primary" data-act="v-test" data-lang="${L}">${ICON.say} ${langName(L)} anhören</button><button class="btn" data-act="v-test" data-lang="de-DE">Deutsch anhören</button></div>
  ${ttsStatus(L)}
  ${!hasTTS?`<p class="note">${esc(noVoiceMsg(L))}</p>`:''}</section>
 <section class="panel"><h2>Online oder offline lernen</h2>
  <p>${!netOnline?'<b>Gerade kein Internet.</b> ':''}Du lernst gerade <b>${learnOffline()?'offline':'online'}</b>.</p>
  <div class="seg" role="radiogroup" aria-label="Lernmodus">${[['auto','Automatisch'],['offline','Offline lernen']].map(([v,n])=>{const on=(prefs.netMode||'auto')===v;return `<button class="seg-btn ${on?'on':''}" role="radio" aria-checked="${on}" data-act="net-set" data-v="${v}">${n}</button>`}).join('')}</div>
  <p class="hint">Online: ${STANDALONE&&cloudOK()?'Gemini-Stimme, ':''}KI-Funktionen${STANDALONE?' und Abgleich':''}. Offline: Lernen, Wachen und Kinderspiel mit der Gerätestimme${STANDALONE&&cloudOK()?' und schon gespeicherten Gemini-Wörtern':''}, keine KI. „Offline lernen“ spart Datenvolumen, z. B. auf dem Boot.</p>
  ${STANDALONE&&cloudOK()?`<div class="stack"><b>Gemini-Stimmen für offline</b><span class="hint">Gespeichert: <span id="pl-count">…</span> Wörter. Vorab laden holt alle Wörter von ${langName(activeLang()||'en-GB')} (höchstens 150), das zählt zum Tageslimit.</span>
   <div class="btn-row">${preload?`<button class="btn" data-act="pl-stop">Stopp (<span id="pl-prog">${preload.n} von ${preload.of}</span>)</button>`:`<button class="btn" data-act="pl-start" ${learnOffline()?'disabled':''}>Wörter vorab laden</button>`}<button class="btn" data-act="pl-clear">Gespeicherte löschen</button></div></div>`:''}</section>
 <section class="panel"><h2>Anhören</h2><p class="hint">Jedes Wort und jeden Satz anhören, auch eigene. Überall in der App gilt: Lautsprecher antippen zum Anhören, zweimal kurz hintereinander für langsam.</p><button class="btn" data-act="listen">Übersetzen &amp; anhören</button></section>
 ${STANDALONE?`<section class="panel"><h2>Welche Stimme?</h2><div class="seg" role="radiogroup" aria-label="Stimme">${[['device','Gerät'],['gemini','Gemini']].map(([v,n])=>{const on=(prefs.ttsEngine||'device')===v;return `<button class="seg-btn ${on?'on':''}" role="radio" aria-checked="${on}" data-act="tts-engine" data-v="${v}" ${v==='gemini'&&!cloudOK()?'disabled':''}>${n}</button>`}).join('')}</div>
  <p class="hint">Gerät: schnell und offline. Gemini: sehr natürlich, braucht Internet und zählt zum Tageslimit. Fehlt auf dem Gerät eine Stimme, springt Gemini automatisch ein.${cloudOK()?'':' Dafür zuerst Gemini einrichten.'}</p>
  ${cloudOK()?`<div class="fld"><span>Stimme der Möwe (Schnack)</span><div class="seg" role="radiogroup" aria-label="Stimme der Möwe">${[['gemini','Gemini'],['device','Gerät']].map(([v,n])=>{const on=(prefs.gullEngine||'gemini')===v;return `<button class="seg-btn ${on?'on':''}" role="radio" aria-checked="${on}" data-act="gull-voice" data-v="${v}">${n}</button>`}).join('')}</div></div>
  <label class="fld"><span>Gemini-Stimme der Möwe</span><select id="gull-voice-n" data-pref="gullVoice">${['Puck','Fenrir','Kore','Charon','Aoede','Leda','Orus','Zephyr'].map(v=>`<option ${((prefs.gullVoice||'Puck')===v)?'selected':''}>${v}</option>`).join('')}</select></label>
  <div class="btn-row"><button class="btn sm" data-act="tts-test">Gemini-Stimme testen</button></div><p class="hint" id="tts-st" aria-live="polite"></p>
  <label class="fld"><span>Gemini-Stimme für Wörter</span><select id="tts-voice" data-pref="ttsVoice">${['Kore','Puck','Charon','Aoede','Leda','Orus','Zephyr','Fenrir'].map(v=>`<option ${((prefs.ttsVoice||'Kore')===v)?'selected':''}>${v}</option>`).join('')}</select></label>`:''}</section>`:''}
 <label class="fld"><span>Sprechtempo: <b id="v-rate-l">${rateLabel(prefs.rate)}</b></span><input type="range" id="v-rate" min="0.6" max="1.2" step="0.05" value="${prefs.rate}"></label>
 ${hasTTS?used.map(l=>{const list=ranked(l),cur=pickVoice(l);return `<div class="fld"><span>${langName(l)}</span><div class="write">
  <select id="v-${l}" data-voice="${l}" ${list.length?'':'disabled'}>${list.length?list.map(v=>`<option value="${esc(v.voiceURI)}" ${cur&&v.voiceURI===cur.voiceURI?'selected':''}>${rankVoice(v,l)>=40?'★ ':''}${esc(v.name)}</option>`).join(''):'<option>Keine Stimme auf diesem Gerät</option>'}</select>
  <button class="btn" data-act="v-test" data-lang="${l}">Anhören</button></div></div>`}).join(''):''}
 <section class="panel"><b>So bekommst du natürlichere Stimmen</b>
  <span><b>iPhone/iPad:</b> Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Sprache wählen und eine Stimme mit „Premium“ oder „Erweitert“ laden.</span>
  <span><b>Android:</b> Einstellungen → Text-in-Sprache → Google-Sprachausgabe → Sprachdaten installieren. Hochwertige Stimmen dort herunterladen.</span>
  <span><b>PC:</b> Im Browser Microsoft Edge gibt es sehr natürliche Stimmen mit „Online (Natural)“ im Namen.</span>
  <span><b>Claude-App:</b> In der Handy-App von Claude gibt es teils keine Stimme. Dann die Vokabelkoje im Browser öffnen.</span>
  <span class="hint">Mit ★ sind die besonders natürlichen markiert. Die App nimmt automatisch die beste, die sie findet.</span></section></div>`;
 const pc=$('#pl-count');if(pc)audioStoreCount().then(n=>{const el=$('#pl-count');if(el)el.textContent=n})}

/* ---------- Anhören: freies Wort oder freier Satz ---------- */
function startListen(){let L=activeLang();if(!L||L==='de-DE')L='en-GB';go('listen',{A:{lang:L,text:'',res:null,err:'',busy:false,hist:(prefs.listenHist||[]).filter(x=>x&&x.t)}})}
function vListen(){const A=view.A,langs=[...new Set([A.lang,...studyLangs(),'en-GB','es-ES','fr-FR','it-IT','sv-SE'])].filter(l=>l&&l!=='de-DE'),canAI=aiOK()&&!learnOffline(),Rr=A.res;
 app.innerHTML=bar('home','Übersetzen')+`<div class="form"><h1>Übersetzen &amp; anhören</h1><p class="muted">Tipp ein Wort oder einen Satz auf Deutsch oder ${langName(A.lang)} ein${canAI?`, oder fotografier etwas mit „Was ist das?“. ${esc(gullName())} übersetzt in beide Richtungen,`:','} und du hörst es dir an, so oft du willst.</p>
 <div class="fld"><span>Sprache</span><div class="chips">${langs.map(l=>`<button class="chip ${A.lang===l?'on':''}" data-act="ls-lang" data-l="${l}" aria-pressed="${A.lang===l}">${langName(l)}</button>`).join('')}</div></div>
 <form class="stack" id="ls-form" autocomplete="off"><textarea id="ls-in" rows="3" placeholder="z. B. Wo kann ich hier anlegen?" aria-label="Wort oder Satz">${esc(A.text)}</textarea>
  <div class="btn-row">${aiOK()?`<button class="btn primary" data-act="ls-tr" ${canAI&&!A.busy?'':'disabled'}>${A.busy?'Übersetzt …':'Übersetzen'}</button>`:''}${aiOK()?`<button class="btn" data-act="ls-cam" ${canAI&&!A.busy?'':'disabled'}>${ICON.cam} Was ist das?</button>`:''}<button class="btn ${aiOK()?'':'primary'}" data-act="ls-play">${ICON.say} Anhören</button><button class="btn" data-act="ls-slow">Langsam</button><button class="btn" type="button" data-act="ls-stop">Stopp</button></div>
  ${aiOK()&&learnOffline()?'<p class="hint">Offline: Übersetzen geht wieder, sobald du online bist. Anhören klappt weiter.</p>':''}${errHtml(A.err)}</form>
 ${Rr?trCard(Rr,A.lang,'ls-add'):''}${photoCards(A)}
 ${A.hist.length?`<section class="stack"><h2>Zuletzt</h2><div class="terms">${A.hist.map(x=>`<div class="term-row listen-row"><span><span lang="${short(x.l)}">${esc(x.t)}</span>${x.de?`<span class="hint" style="display:block">${esc(x.de)}</span>`:''}</span><span class="hint">${langName(x.l)}</span>${sayBtn(x.t,x.l)}</div>`).join('')}</div><button class="linkbtn" data-act="ls-clear">Liste leeren</button></section>`:''}</div>`}
// Übersetzungskarte (Werkzeug und Möwen-Schnack)
function trCard(r,L,act,i){return `<div class="tr-card"><div class="row-between" style="flex-wrap:nowrap"><b lang="${short(L)}">${esc(r.fx)}</b>${sayBtn(r.fx,L)}</div>
 <div class="row-between" style="flex-wrap:nowrap"><span lang="de">${esc(r.de)}</span>${sayBtn(r.de,'de-DE')}</div>
 ${r.note?`<span class="hint">${esc(r.note)}</span>`:''}${r.alts&&r.alts.length?`<span class="hint">Auch: <span lang="${short(L)}">${r.alts.map(esc).join(' · ')}</span></span>`:''}
 <button class="btn sm" data-act="${act}" ${i!=null?`data-i="${i}"`:''} ${r.added?'disabled':''}>${r.added?'✓ im Set':'+ ins Set'}</button></div>`}
function normTr(x,L){if(!x)return null;const fx=String(x.fremd||x.ziel_fremd||x.t||'').trim(),de=String(x.deutsch||x.d||'').trim();if(!fx||!de)return null;
 const k=x.karte||{};return {fx,de,note:String(x.hinweis||'').trim(),alts:(Array.isArray(x.alternativen)?x.alternativen:[]).map(String).filter(Boolean).slice(0,3),card:{t:String(k.t||fx).trim(),d:String(k.d||de).trim()}}}
const TR_SCHEMA=TL=>`{"fremd":"Wort oder Satz auf ${TL}","deutsch":"auf Deutsch","hinweis":"sehr kurzer Hinweis auf Deutsch (z. B. Artikel, Mehrzahl, eher locker/förmlich) oder leer","alternativen":["übliche Redewendung oder Variante auf ${TL}, nur falls sinnvoll"],"karte":{"t":"Lernkarte auf ${TL}: Substantiv mit Artikel, Verb im Infinitiv, sonst wie oben","d":"deutsche Bedeutung"}}`;
async function listenTranslate(){const A=view.A,inp=$('#ls-in');A.text=(inp&&inp.value||'').trim();if(!A.text)return toast('Erst etwas eintippen');if(A.busy)return;
 A.busy=true;A.err='';A.res=null;render();const TL=langName(A.lang);
 try{const r=await ai(`Übersetze für einen deutschsprachigen Lerner (Niveau ${prefs.level}). Erkenne selbst, ob der Text Deutsch oder ${TL} ist, und übersetze in die jeweils andere Sprache.
Bei Sätzen natürlich übersetzen, nicht Wort für Wort. Gibt es eine übliche Redewendung, nenne sie als Alternative.
Text: „${A.text.slice(0,500)}“
Antworte nur mit JSON: ${TR_SCHEMA(TL)}`,{json:true,quick:true,cacheKey:`tr|${A.lang}|${A.text.toLowerCase().slice(0,120)}`});
  const t=normTr(r,A.lang);if(!t)throw new AIError('Das hat nicht geklappt. Versuch es nochmal.');A.res=t;
  A.hist=[{t:t.fx,l:A.lang,de:t.de},...A.hist.filter(x=>!(x.t===t.fx&&x.l===A.lang))].slice(0,12);prefs.listenHist=A.hist;savePrefs();
  if(prefs.auto)speak(t.fx,A.lang)}
 catch(e){A.err=e.message}
 A.busy=false;if(view.A===A)render()}
function listenPlay(slow){const A=view.A,inp=$('#ls-in'),txt=(inp&&inp.value||'').trim();if(!txt&&!A.res){toast('Erst etwas eintippen');return}
 // nach dem Übersetzen die Fassung in der Lernsprache vorlesen
 if(A.res&&txt===A.text){speak(A.res.fx,A.lang,null,slow);return}
 A.text=txt;A.res=null;speak(A.text,A.lang,null,slow);A.hist=[{t:A.text,l:A.lang},...A.hist.filter(x=>!(x.t===A.text&&x.l===A.lang))].slice(0,12);prefs.listenHist=A.hist;savePrefs();render()}
function addTr(r,L){if(!r||r.added)return;const n=addCards(talkSet(L),[{t:r.card.t,d:r.card.d,ex:''}]);r.added=true;save();toast(n?`„${r.card.t}“ ist jetzt in „Gesammelte Wörter“`:'Das Wort ist schon im Set');render()}

/* ---------- Schnack mit der Möwe ---------- */
// Die Möwe spricht mit eigener Gemini-Stimme (wenn eingerichtet), Wörter weiter mit der gewählten Stimme
const gullVoiceOpt=()=>({cloud:STANDALONE&&cloudOK()&&prefs.gullEngine!=='device',voice:prefs.gullVoice||'Puck'});
const gullTalks=()=>prefs.gullTalk!==false;
// Flüster-Korrekturen zählen mit: ab dem zweiten Mal wird aus einem Fehlermuster eine Baustelle
function gullFixNote(L,fx,G){if(!fx.thema)return;const P=prof(L),k=wkey(fx.thema);if(!k)return;P.gfix=P.gfix||{};const o=P.gfix[k]||(P.gfix[k]={topic:fx.thema,n:0});o.n++;o.last=now();
 if(o.n>=2||(P.weak[k]&&!P.weak[k].fixed)){const isNew=!P.weak[k]||P.weak[k].fixed;addWeak(L,[{thema:fx.thema,art:fx.art,erklaerung:fx.warum,beispiel:fx.besser}]);if(isNew){G.newWeak=G.newWeak||[];if(!G.newWeak.includes(fx.thema))G.newWeak.push(fx.thema)}}else save()}
// Lockeres Plaudern in der Lernsprache: kurze Runde, Fehler flüstert die Möwe sofort zu, Übersetzen auf Zuruf.
const GULL_MAX=5;
const gullChatOK=()=>aiOK()&&!learnOffline()&&!!activeLang()&&activeLang()!=='de-DE'&&!(curProf()&&curProf().kid);
const gullChatBtn=()=>gullChatOK()?`<button type="button" class="chip gull-chat" data-act="gull-chat">💬 Schnacken?</button>`:'';
function startGullChat(){const L=activeLang();if(!gullChatOK())return toast(learnOffline()?offlineMsg():'Wähl zuerst eine Lernsprache');adoptLevel(L);
 go('gull',{lang:L,G:{turns:[],busy:false,err:'',mood:'happy',act:''}});gullSend(null)}
function gullRules(L){const TL=langName(L),me=db.me||{},mem=(me.gullMem||[]).slice(-12),f=dailyFocus(L),G=view.G,mine=G.turns.filter(t=>t.role==='user').length;
 return `Du bist ${gullName()}, eine freche, herzliche Möwe aus einem Hafen, und Maskottchen einer Sprachlern-App. Du plauderst mit ${me.name||'dem Lerner'} locker auf ${TL}, wie mit einem Freund am Steg.
Niveau des Lerners: ${prefs.level}. Sprich ausschließlich ${TL}, kurze Sätze (1 bis 3), passend zum Niveau, mit einer Prise Seemanns-Humor. Stell meist eine Frage.
${mem.length?`Das weißt du schon über den Lerner (frag gern nach, aber nicht alles auf einmal): ${mem.join('; ')}.\n`:''}${f?`Bau ganz nebenbei das Thema „${f.w.topic}“ ein, sodass der Lerner es selbst benutzen muss.\n`:''}Die Runde hat ${GULL_MAX} Nachrichten des Lerners, bisher ${mine}. ${mine>=GULL_MAX?'Das war seine letzte Nachricht: verabschiede dich herzlich und seemännisch, keine Frage mehr.':mine===GULL_MAX-1?'Steuere langsam auf einen Abschied zu.':''}
Wenn die letzte Nachricht des Lerners einen Fehler hat, nenne genau einen in „fix“ (sonst null). Kleinigkeiten wie fehlende Akzente ignorieren.
„fix.thema“ ist ein kurzer deutscher Name für das Muster dahinter, z. B. „Vergangenheit“ oder „Artikel und Geschlecht“.${openWeak(L).length?` Nutze denselben Namen, wenn es um eines dieser bekannten Themen geht: ${openWeak(L).slice(0,12).map(w=>w.topic).join('; ')}.`:''}
${mine>=GULL_MAX?'Schätze außerdem in „niveau“ aus ALLEN Nachrichten des Lerners sein aktives Niveau als Zahl von 0 bis 6 (0–1 A1, 1–2 A2, 2–3 B1, 3–4 B2, 4–5 C1, 5–6 C2, z. B. 1.7 = oberes A2), sonst null.':'„niveau“ ist null.'}
Wenn der Lerner fragt, was ein Wort heißt oder wie man etwas sagt (auf Deutsch oder ${TL}), fülle „uebersetzung“ und antworte trotzdem kurz weiter.
Wenn der Lerner etwas Dauerhaftes über sich erzählt (Hobby, Boot, Familie, Wohnort, Beruf), schreib es kurz auf Deutsch in „merken“, sonst leeres Array. Nichts Heikles wie Gesundheit oder Geld merken.
Antworte nur mit JSON: {"reply":"deine Antwort auf ${TL}","de":"deutsche Übersetzung","mood":"happy, think oder cheer","fix":{"du":"falscher Teil","besser":"richtig auf ${TL}","warum":"sehr kurz auf Deutsch","thema":"…","art":"grammatik oder wortschatz"},"niveau":{"grammatik":Zahl oder null,"wortschatz":Zahl oder null},"uebersetzung":${TR_SCHEMA(TL)},"merken":["…"]}`}
async function gullSend(text){const G=view.G,L=view.lang;if(G.busy)return;
 if(text){G.turns.push({role:'user',content:text});logAnswer()}
 G.busy=true;G.err='';render();
 const hist=G.turns.slice(-14).map(t=>({role:t.role,content:t.role==='assistant'?JSON.stringify({reply:t.content}):t.content}));
 if(hist.length&&hist[0].role==='assistant')hist.unshift({role:'user',content:'(Schnack läuft bereits)'});
 try{const r=await ai([{role:'user',content:gullRules(L)+(G.turns.length?'':'\n\nBeginne jetzt mit einer kurzen, freundlichen Begrüßung und einer Frage.')},...hist],{json:true,fresh:true,quick:true});
  const reply=String(r&&r.reply||'').trim();if(!reply)throw new AIError(`${gullName()} hat gerade den Schnabel voll. Versuch es nochmal.`);
  const last=[...G.turns].reverse().find(t=>t.role==='user');
  const fx=r.fix&&r.fix.besser&&last?{du:String(r.fix.du||''),besser:String(r.fix.besser),warum:String(r.fix.warum||''),thema:String(r.fix.thema||'').trim(),art:String(r.fix.art||'grammatik')}:null;if(fx){last.fix=fx;gullFixNote(L,fx,G)}
  const mineNow=G.turns.filter(t=>t.role==='user').length;
  if(mineNow>=GULL_MAX&&!G.measured&&r.niveau){const g=clampLv(r.niveau.grammatik),v=clampLv(r.niveau.wortschatz);if(g!=null||v!=null){addPoint(L,g,v,'gull');G.measured={g,v}}}
  G.turns.push({role:'assistant',content:reply,de:String(r.de||'').trim(),tr:normTr(r.uebersetzung,L)});
  G.mood=['happy','think','cheer'].includes(r.mood)?r.mood:'happy';G.act=fx?'think':'';
  const add=(Array.isArray(r.merken)?r.merken:[]).map(x=>String(x).trim()).filter(x=>x&&x.length<120);
  if(add.length){const me=db.me;const old=me.gullMem||[];me.gullMem=[...old.filter(o=>!add.some(a=>a.toLowerCase()===o.toLowerCase())),...add].slice(-12);me.upd=now();save()}
  if(gullTalks()&&view.G===G)speak(reply,L,null,false,gullVoiceOpt())}
 catch(e){G.err=e.message}
 G.busy=false;if(view.G===G){render();const i=$('#g-in');if(i&&!G.err)i.focus()}}
function vGull(){const G=view.G,L=view.lang,mine=G.turns.filter(t=>t.role==='user').length,last=G.turns[G.turns.length-1],over=mine>=GULL_MAX&&last&&last.role==='assistant';
 let h=bar('home',`Schnack mit ${gullName()}`)+`<section class="gull-chat-head"><div class="gc-gull">${gullSVG(over?'cheer':G.busy?'idle':G.mood,72,G.busy?'think':over?'salute':G.act)}</div><div style="flex:1;min-width:0"><b>${esc(gullName())}</b><span class="hint">plaudert auf ${langName(L)} · ${Math.min(mine,GULL_MAX)} von ${GULL_MAX}</span></div><button class="chip ${gullTalks()?'on':''}" data-act="gull-talk" aria-pressed="${gullTalks()}">${gullTalks()?'🔊 spricht':'🔇 stumm'}</button></section>
 <div class="chat">${G.turns.map((t,i)=>t.role==='user'?`<div class="bub me">${esc(t.content)}</div>${t.fix?`<div class="whisper" role="note"><span aria-hidden="true">🤫</span><span>Psst: <b lang="${short(L)}">${esc(t.fix.besser)}</b>${t.fix.du?` statt <s>${esc(t.fix.du)}</s>`:''}${t.fix.warum?` – ${esc(t.fix.warum)}`:''}</span></div>`:''}`
  :`<div class="bub ai gull-bub" lang="${short(L)}"><div class="bub-head"><span>${esc(t.content)}</span>${sayBtn(t.content,L,true)}</div>${t.de?`<details><summary>Übersetzung</summary><span class="tr">${esc(t.de)}</span></details>`:''}${t.tr?trCard(t.tr,L,'g-add',i):''}</div>`).join('')}
  ${G.busy?'<div class="bub ai thinking">schreibt …</div>':''}</div>
 ${G.err?errHtml(G.err)+((!last||last.role==='user')?'<button class="btn sm" data-act="g-retry">Nochmal versuchen</button>':''):''}
 ${over?`${G.measured||G.newWeak?`<section class="panel gull-sum">${G.measured?`<p>${esc(gullName())} schätzt dich in diesem Schnack auf <b style="color:var(--s-gram)">${lvlName(G.measured.g)}</b> in Grammatik und <b style="color:var(--s-voc)">${lvlName(G.measured.v)}</b> im Wortschatz.</p><p class="hint">Fließt leicht in deine Lernkurve ein, so viel wie ein Etappen-Check.</p>`:''}${G.newWeak&&G.newWeak.length?`<p>Neue Baustelle${G.newWeak.length>1?'n':''}: <b>${G.newWeak.map(esc).join(', ')}</b>. Taucht ab jetzt in deiner Tagesübung auf.</p>`:''}</section>`:''}<div class="btn-row"><button class="btn primary" data-act="gull-chat">Nochmal schnacken</button><button class="btn" data-act="back" data-to="home">Zur Startseite</button></div>`
  :`<form class="write" id="g-form" autocomplete="off"><input id="g-in" lang="${short(L)}" placeholder="Antwort auf ${langName(L)} – oder „Was heißt …?“" aria-label="Deine Nachricht" ${G.busy?'disabled':''}>${micBtn('g-in',L)}<button class="btn primary" ${G.busy?'disabled':''}>Senden</button></form>${dictHint}
  <p class="hint">Tipp: Frag einfach „Was heißt Fender?“ oder „Wie sage ich ‚Ich habe Hunger‘?“</p>`}`;
 app.innerHTML=h;const ch=document.querySelector('.chat');if(ch&&ch.lastElementChild&&ch.lastElementChild.scrollIntoView)ch.lastElementChild.scrollIntoView({block:'nearest'})}

/* ---------- Neues Gerät verbinden ---------- */
// Schlüssel und Token per Link (oder QR-Code) + 6-stelligem Code aufs nächste eigene Gerät übertragen.
// Der Inhalt ist mit dem Code verschlüsselt (AES-GCM, PBKDF2) und steht nur hinter dem # der Adresse – das sieht kein Server.
const PAIR_TTL=30*60*1000;
const b64u={enc:u=>btoa(String.fromCharCode(...u)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),dec:t=>{t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';return Uint8Array.from(atob(t),c=>c.charCodeAt(0))}};
async function pairKey(pin,salt){const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(pin)),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:200000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
const pairOK=()=>STANDALONE&&typeof crypto!=='undefined'&&!!crypto.subtle&&!!(prefs.gemKey||prefs.ghToken);
async function makePair(){const r=n=>crypto.getRandomValues(new Uint8Array(n));const pin=String(100000+(crypto.getRandomValues(new Uint32Array(1))[0]%900000));
 const salt=r(16),iv=r(12),data={v:1,t:Date.now(),k:prefs.gemKey||'',g:prefs.ghToken||'',i:prefs.gistId||'',s:{ttsEngine:prefs.ttsEngine,ttsVoice:prefs.ttsVoice,gullEngine:prefs.gullEngine,gullVoice:prefs.gullVoice,theme:prefs.theme,rate:prefs.rate}};
 const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},await pairKey(pin,salt),new TextEncoder().encode(JSON.stringify(data))));
 const all=new Uint8Array(salt.length+iv.length+ct.length);all.set(salt);all.set(iv,16);all.set(ct,28);
 return {pin,link:location.origin+location.pathname+'#pair='+b64u.enc(all),until:Date.now()+PAIR_TTL}}
async function readPair(token,pin){const all=b64u.dec(token),salt=all.slice(0,16),iv=all.slice(16,28),ct=all.slice(28);
 const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv},await pairKey(pin,salt),ct);return JSON.parse(new TextDecoder().decode(pt))}
let qrLib=null;
function loadQR(){if(window.qrcode)return Promise.resolve(window.qrcode);if(qrLib)return qrLib;
 qrLib=new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';sc.onload=()=>window.qrcode?res(window.qrcode):rej();sc.onerror=()=>{qrLib=null;rej()};document.head.appendChild(sc)});return qrLib}
async function startPair(){if(!pairOK())return toast('Erst Gemini-Schlüssel oder GitHub-Token eintragen');go('pairOut',{P:{busy:true}});
 try{const P=await makePair();view.P={...P,busy:false};render();
  loadQR().then(q=>{if(view.name!=='pairOut'||view.P.link!==P.link)return;const qr=q(0,'L');qr.addData(P.link);qr.make();const el=$('#pair-qr');if(el){el.innerHTML=qr.createSvgTag(4,2);el.hidden=false}}).catch(()=>{})}
 catch(e){view.P={busy:false,err:'Das hat auf diesem Gerät nicht geklappt.'};render()}}
function vPairOut(){const P=view.P;let h=bar('backup','Neues Gerät verbinden')+`<div class="form"><h1>Neues Gerät verbinden</h1>`;
 if(P.busy){app.innerHTML=h+'<p class="thinking">Einen Moment …</p></div>';return}
 if(P.err){app.innerHTML=h+errHtml(P.err)+'</div>';return}
 h+=`<p class="muted">Überträgt deinen ${prefs.gemKey?'Gemini-Schlüssel':''}${prefs.gemKey&&prefs.ghToken?' und ':''}${prefs.ghToken?'GitHub-Token (und damit deinen Lernstand)':''} auf dein anderes Gerät. Dort musst du nichts abtippen.</p>
 <section class="panel pair"><b>1. Auf dem neuen Gerät öffnen</b><div id="pair-qr" class="pair-qr" hidden></div>
  <span class="hint">QR-Code mit der Kamera scannen – oder den Link an dich selbst schicken und dort öffnen.</span>
  <div class="btn-row">${navigator.share?'<button class="btn" data-act="pair-share">Link teilen</button>':''}<button class="btn" data-act="pair-copy">Link kopieren</button></div></section>
 <section class="panel pair"><b>2. Diesen Code dort eingeben</b><div class="pair-pin" aria-label="Code ${P.pin.split('').join(' ')}">${P.pin.slice(0,3)} ${P.pin.slice(3)}</div>
  <span class="hint">Gilt 30 Minuten. Link und Code gehören zusammen – schick sie nie zusammen an andere.</span></section>
 <p class="note">Nur für deine <b>eigenen</b> Geräte. Familienmitglieder richten ihre eigenen Schlüssel ein, sonst vermischen sich die Lernstände.</p></div>`;
 app.innerHTML=h}
// Beim Start: Link mit #pair= erkannt
let pairToken=null;
function checkPairLink(){if(!STANDALONE||typeof location==='undefined')return;const m=/[#&]pair=([A-Za-z0-9_-]+)/.exec(location.hash||'');if(!m)return;pairToken=m[1];
 try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}go('pairIn',{P:{pin:'',err:'',tries:0,busy:false}})}
function vPairIn(){const P=view.P;app.innerHTML=`<div class="form pair-in"><div class="w-gull">${gullSVG('happy',96,'salute')}</div><h1>Gerät verbinden</h1>
 <p class="muted">Gib den 6-stelligen Code ein, der auf deinem anderen Gerät steht.</p>
 <form id="pair-form" class="stack" autocomplete="off"><input id="pair-pin" class="big-input pair-pin-in" inputmode="numeric" pattern="[0-9 ]*" maxlength="7" placeholder="123 456" aria-label="Code" value="${esc(P.pin)}">
 <button class="btn primary wide" ${P.busy?'disabled':''}>${P.busy?'Verbinde …':'Verbinden'}</button></form>${errHtml(P.err)}
 <button class="linkbtn" data-act="pair-cancel">Abbrechen</button></div>`;const i=$('#pair-pin');if(i&&i.focus)i.focus()}
async function pairSubmit(){const P=view.P,inp=$('#pair-pin');const pin=(inp&&inp.value||'').replace(/\D/g,'');P.pin=pin;if(pin.length!==6){P.err='Der Code hat 6 Ziffern.';return render()}
 P.busy=true;P.err='';render();
 try{const d=await readPair(pairToken,pin);if(!d||Date.now()-d.t>PAIR_TTL)throw new Error('alt');
  if(d.k)prefs.gemKey=d.k;if(d.g){prefs.ghToken=d.g;prefs.gistId=d.i||'';prefs.syncErr=''}
  Object.entries(d.s||{}).forEach(([k,v])=>{if(v!=null&&v!=='')prefs[k]=v});savePrefs();applyTheme();pairToken=null;
  toast(d.g?'Verbunden! Dein Lernstand wird geholt …':'Verbunden! Der Gemini-Schlüssel ist eingetragen.');go('home');if(d.g&&canSync()){await sync();if(view.name==='home')render()}}
 catch(e){P.busy=false;P.tries++;if(e&&e.message==='alt'){P.err='Dieser Link ist abgelaufen. Erstell auf dem anderen Gerät einen neuen.';pairToken=null}
  else P.err=P.tries>=5?'Zu viele Versuche. Erstell auf dem anderen Gerät einen neuen Link.':'Der Code passt nicht. Schau nochmal genau hin.';if(P.tries>=5)pairToken=null;render()}}
