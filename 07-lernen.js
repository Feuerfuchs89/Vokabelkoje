// Vokabelkoje – lernen
/* ---------- Set ---------- */
function vSet(){
 const s=getSet(view.id);if(!s)return go('home');const P=pool(s),n=P.length,d=dueCount(s),starN=s.cards.filter(c=>c.star).length;
 if(starOnly[s.id]&&!starN)starOnly[s.id]=false;
 const mode=(m,t,txt,min,wide)=>`<button class="mode ${wide?'wide':''}" data-act="mode" data-m="${m}" ${n<min?'disabled':''}>${ICON[m]}<b>${t}</b><span>${n<min?`Braucht mindestens ${min} Karten`:txt}</span></button>`;
 app.innerHTML=bar(s.course?'unit':'home')+`
 <section class="set-head"><h1>${esc(s.title)}</h1><p class="muted">${s.cards.length} Begriffe · ${langName(s.l1)} ↔ ${langName(s.l2)}</p>${faecher(s)}
 ${d?`<button class="btn primary wide" data-act="review-set">${d} ${d===1?'Begriff':'Begriffe'} fällig: jetzt wiederholen</button>`:''}</section>
 ${starN?`<div class="tools" style="justify-content:flex-start"><button class="chip ${starOnly[s.id]?'on':''}" data-act="star-only" aria-pressed="${!!starOnly[s.id]}">Nur markierte üben (${starN})</button></div>`:''}
 <nav class="modes" aria-label="Übungsarten">
  ${mode('learn','Lernen','Erst ankreuzen, dann schreiben. Danach kommt das Wort in den Wiederholplan.',1)}
  ${mode('flash','Karteikarten','Umdrehen und selbst einschätzen',1)}
  ${mode('test','Test','Gemischte Fragen mit Auswertung',2)}
  ${mode('match','Zuordnen',`Paare finden gegen die Uhr${s.best?` · Bestzeit ${fmt(s.best)}`:''}`,2)}
  ${aiOK()?mode('reader','Text lesen','Text einfügen oder erzeugen, Wörter antippen und übernehmen.',0):''}
  ${aiOK()?mode('talk','Gespräch üben',`Rollenspiel mit ${aiName()} in ${langName(targetLang(s))}, danach Auswertung.`,0):''}
  ${mode('dict','Hördiktat','Die App liest vor, du schreibst auf, was du hörst.',1)}
  ${MIC_OK?mode('pron','Aussprache','Laut sprechen, die App zeigt, welche Wörter sie verstanden hat.',1):''}
  ${MIC_OK&&hasTTS?mode('hands','Freihändig','Die App fragt, du antwortest laut. Ohne aufs Handy zu schauen.',1,true):''}
 </nav>
 ${STANDALONE&&aiOK()&&!prefs.gemKey?`<p class="note">Für „Text lesen“, „Gespräch üben“ und KI-Karten richte einmal kostenlos Gemini ein. <button class="linkbtn" data-act="settings">Jetzt einrichten</button></p>`:''}
 <section class="stack"><div class="list-head"><h2>Begriffe</h2><button class="btn sm" data-act="edit">Bearbeiten</button></div>
 <div class="terms">${s.cards.map(c=>`<div class="term-row">${starBtn(c)}<div class="tr-t">${sayBtn(c.t,s.l1)}<span>${esc(c.t)}</span></div><div class="tr-d">${esc(c.d)}</div>${pill(c)}${c.ex?`<div class="tr-ex">${esc(c.ex)}</div>`:''}</div>`).join('')||'<div class="term-row"><span class="muted" style="grid-column:1/-1">Noch keine Karten.</span></div>'}</div></section>
 ${view.exportText?`<textarea class="export" id="export" readonly>${esc(exportText(s))}</textarea>`:''}
 ${view.confirm?`<div class="confirm"><span>Set „${esc(s.title)}“ wirklich löschen?</span><button class="btn danger sm" data-act="del-yes">Löschen</button><button class="btn sm" data-act="del-no">Abbrechen</button></div>`:
 `<div class="danger-zone"><button class="btn sm" data-act="copy">Liste kopieren</button><button class="btn sm" data-act="reset">Fortschritt zurücksetzen</button><button class="btn danger sm" data-act="del">Set löschen</button></div>`}`;
 if(view.exportText){const t=$('#export');t.focus();t.select()}
}
const exportText=s=>s.cards.map(c=>[c.t,c.d,c.ex].filter((x,i)=>i<2||x).join('\t')).join('\n');

/* ---------- Bearbeiten ---------- */
const blank=()=>({id:uid(),t:'',d:'',ex:'',star:false,m:0,lv:0,due:0,u:0});
const langOpts=v=>LANGS.map(([c,n])=>`<option value="${c}" ${c===v?'selected':''}>${n}</option>`).join('');
function vEdit(){
 const d=view.draft;
 app.innerHTML=bar(view.id?'set':'home',view.id?'Set bearbeiten':'Neues Set')+`
 <div class="form">
  <h1>${view.id?'Set bearbeiten':'Neues Set'}</h1>
  <label class="fld"><span>Titel</span><input id="f-title" data-k="title" value="${esc(d.title)}" placeholder="z. B. Englisch Unit 3"></label>
  <div class="two"><label class="fld"><span>Begriff</span><select id="f-l1" data-k="l1">${langOpts(d.l1)}</select></label><label class="fld"><span>Definition</span><select id="f-l2" data-k="l2">${langOpts(d.l2)}</select></label></div>
  ${aiOK()?'':'<!--'}<details class="import" id="ai-box" ${d.aiOpen?'open':''}><summary>Mit KI erstellen<span class="ai-tag">${aiName()}</span></summary>
   <p class="hint">Füg einen Text oder eine Wortliste ein, nenn ein Thema wie „Wörter rund ums Segeln“ oder fotografiere eine Buchseite. Die Karten landen unten in der Liste, du prüfst sie und speicherst.</p>
   <textarea id="ai-src" data-k="aiSrc" rows="5" placeholder="Text, Wortliste oder Thema">${esc(d.aiSrc||'')}</textarea>
   <div class="row-between"><label class="check"><input type="checkbox" id="ai-ex" data-k="aiEx" ${d.aiEx!==false?'checked':''}> mit Beispielsätzen</label>
    <label class="check">Höchstens <select id="ai-n" data-k="aiN" style="width:auto;min-height:36px;border:1px solid var(--line);border-radius:8px;padding:4px 8px;background:var(--surface)">${[10,20,30,50].map(n=>`<option ${+(d.aiN||20)===n?'selected':''}>${n}</option>`).join('')}</select> Karten</label></div>
   ${d.aiImg?`<p class="hint">Foto ausgewählt. <button class="linkbtn" data-act="ai-photo-x">Entfernen</button></p>`:''}
   <div class="btn-row"><button class="btn" data-act="ai-photo">${d.aiImg?'Anderes Foto':'Foto einer Seite'}</button><button class="btn primary" data-act="ai-gen" ${d.aiBusy?'disabled':''}>${d.aiBusy?'KI arbeitet …':'Karten erzeugen'}</button></div>
   ${errHtml(d.aiErr)}
  </details>${aiOK()?'':'-->'}
  <details class="import"><summary>Liste einfügen</summary><p class="hint">Eine Karte pro Zeile: Begriff, Definition und optional ein Beispielsatz. Trenne mit Tab, Semikolon, „ - “ oder „=“. Exporte aus Quizlet passen direkt.</p><textarea id="f-import" rows="6" placeholder="bow;der Bug;The bow cuts through the waves.&#10;stern;das Heck"></textarea><button class="btn" data-act="import">Karten übernehmen</button></details>
  <ol class="edit-rows">${d.cards.map((c,i)=>`<li class="edit-row"><span class="num">${i+1}</span><input id="r${c.id}t" class="t-in" data-i="${i}" data-f="t" value="${esc(c.t)}" placeholder="${langName(d.l1)}" aria-label="Begriff ${i+1}"><input id="r${c.id}d" class="d-in" data-i="${i}" data-f="d" value="${esc(c.d)}" placeholder="${langName(d.l2)}" aria-label="Definition ${i+1}"><button class="del" data-act="delrow" data-i="${i}" aria-label="Karte ${i+1} entfernen">×</button><input id="r${c.id}x" class="ex-in" data-i="${i}" data-f="ex" value="${esc(c.ex)}" placeholder="Beispielsatz (optional)" aria-label="Beispielsatz ${i+1}"></li>`).join('')}</ol>
  <button class="btn ghost wide" data-act="addrow">+ Karte hinzufügen</button>
  ${aiOK()&&d.cards.some(c=>c.t.trim()&&!(c.ex||'').trim())?`<button class="btn ghost wide" data-act="ai-ex" ${d.exBusy?'disabled':''}>${d.exBusy?'KI schreibt Beispielsätze …':'Fehlende Beispielsätze mit KI ergänzen'}</button>`:''}
  <div class="savebar"><button class="btn primary wide" data-act="saveset">Speichern</button></div>
 </div>`;
}
function parse(txt){return txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>{let p;
 if(l.includes('\t'))p=l.split('\t');else if(l.includes(';'))p=l.split(';');else if(l.includes(' - '))p=l.split(' - ');else if(l.includes('='))p=l.split('=');else p=[l,''];
 return {...blank(),t:(p[0]||'').trim(),d:(p[1]||'').trim(),ex:p.slice(2).join(' ').trim()}})}

/* ---------- Karteikarten ---------- */
function startFlash(s,ids,keep){const order=ids||pool(s).map(c=>c.id);const p=keep||{termFirst:true,shuffled:false};
 go('flash',{id:s.id,f:{order:p.shuffled?shuffle(order.slice()):order.slice(),base:order.slice(),i:0,flipped:false,known:0,unk:[],termFirst:p.termFirst,shuffled:p.shuffled}})}
function vFlash(){
 const s=getSet(view.id),f=view.f;
 if(f.i>=f.order.length){
  app.innerHTML=bar('set',s.title)+`<section class="summary"><h1>Runde geschafft</h1>
  <div class="big-nums"><div><b class="g">${f.known}</b><span>kann ich</span></div><div><b class="r">${f.unk.length}</b><span>noch nicht</span></div></div>
  <div class="stack">${f.unk.length?`<button class="btn primary wide" data-act="fl-again" data-w="unk">${f.unk.length} unsichere wiederholen</button>`:''}
  <button class="btn wide ${f.unk.length?'':'primary'}" data-act="fl-again" data-w="all">Alle nochmal</button>
  <button class="btn ghost wide" data-act="mode" data-m="learn">Weiter mit Lernen</button></div></section>`;return}
 const c=card(s,f.order[f.i]);if(!c){f.i++;return render()}
 const fr=f.termFirst?{x:c.t,l:s.l1}:{x:c.d,l:s.l2}, bk=f.termFirst?{x:c.d,l:s.l2}:{x:c.t,l:s.l1};
 app.innerHTML=bar('set',s.title)+`
 <div class="prog"><span>${f.i+1} / ${f.order.length}</span><div class="pbar"><i style="width:${f.i/f.order.length*100}%"></i></div></div>
 <div class="fc ${f.flipped?'flipped':''}" id="fc" tabindex="0" role="button" aria-label="Karte umdrehen">
  <div class="fc-in">
   <div class="face front"><div class="face-head"><span class="label">${langName(fr.l)}</span>${sayBtn(fr.x,fr.l)}</div><div class="face-text">${esc(fr.x)}</div><div class="face-foot">Tippen zum Umdrehen · wischen zum Einschätzen</div></div>
   <div class="face back"><div class="face-head"><span class="label">${langName(bk.l)}</span>${sayBtn(bk.x,bk.l)}</div><div class="face-text">${esc(bk.x)}</div><div class="face-foot ${c.ex?'ex':''}">${esc(c.ex||fr.x)}</div></div>
  </div></div>
 <div class="judge"><button class="btn no" data-act="dont"><kbd>←</kbd> Noch nicht</button><button class="btn yes" data-act="know">Kann ich <kbd>→</kbd></button></div>
 <div class="tools"><button class="chip ${c.star?'on':''}" data-act="cur-star">${c.star?'Markiert':'Markieren'}</button><button class="chip ${f.shuffled?'on':''}" data-act="fl-shuffle" aria-pressed="${f.shuffled}">Gemischt</button><button class="chip" data-act="fl-side">Vorne: ${langName(fr.l)}</button>${autoChip()}${MIC_OK?`<button class="chip" data-act="fl-say">Nachsprechen (${langName(s.l1)})</button>`:''}</div>
 <p class="said" id="fl-said" aria-live="polite"></p>`;
 f.cur={fr,bk};
 if(prefs.auto&&f.spoken!==f.i+':'+f.termFirst){f.spoken=f.i+':'+f.termFirst;const side=f.flipped?bk:fr;speak(side.x,side.l)}
 const el=$('#fc');let x0=null,dx=0;
 el.addEventListener('pointerdown',e=>{if(e.target.closest('.say'))return;x0=e.clientX;dx=0;el.classList.add('dragging');try{el.setPointerCapture(e.pointerId)}catch(_){}});
 el.addEventListener('pointermove',e=>{if(x0==null)return;dx=e.clientX-x0;el.style.transform=`translateX(${dx}px) rotate(${dx/30}deg)`;el.dataset.swipe=dx>70?'yes':dx<-70?'no':''});
 const reset=()=>{x0=null;el.classList.remove('dragging');el.style.transform='';el.dataset.swipe=''};
 el.addEventListener('pointerup',()=>{if(x0==null)return;const d=dx;reset();if(d>70)judge(true);else if(d<-70)judge(false);else if(Math.abs(d)<8)flip()});
 el.addEventListener('pointercancel',reset);
 el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();flip()}});
}
function flip(){const f=view.f;f.flipped=!f.flipped;$('#fc').classList.toggle('flipped',f.flipped);
 if(prefs.auto&&f.cur){const side=f.flipped?f.cur.bk:f.cur.fr;speak(side.x,side.l)}}
function judge(ok){const s=getSet(view.id),f=view.f,c=card(s,f.order[f.i]);if(!c)return;
 if(ok){if(c.lv<1)c.m=Math.max(c.m||0,1);f.known++}else{if(c.lv<1)c.m=0;f.unk.push(c.id)}
 touch(c);logAnswer();db.fresh=false;save();f.i++;f.flipped=false;render()}

/* ---------- Lernen und Wiederholen ---------- */
const LEARN_CHUNK=10; // neue Begriffe pro Lernrunde – lieber öfter kleine Portionen
function startLearn(s,reset){
 if(reset){s.cards.forEach(c=>{c.m=0;c.lv=0;c.due=0;touch(c)});save()}
 const items=shuffle(pool(s).filter(c=>c.lv<1).map(c=>({sid:s.id,cid:c.id}))).slice(0,LEARN_CHUNK);
 go('q',{back:'set',id:s.id,Q:{kind:'learn',items,session:items.slice(),failed:new Set(),done:0,cur:null}})}
function startReview(items,back,id){
 go('q',{back,id,Q:{kind:'review',items:shuffle(items.slice()),session:items.slice(),failed:new Set(),done:0,cur:null}})}
const qKey=it=>it.sid+':'+it.cid;
function vQ(){
 const Q=view.Q,learn=Q.kind==='learn';
 const backTitle=view.back==='set'?(getSet(view.id)||{}).title:'';
 if(!Q.items.length){
  if(learn){
   app.innerHTML=bar(view.back,backTitle)+`<section class="summary"><h1>${Q.session.length?`Alle ${Q.session.length} Begriffe sitzen`:'Hier gibt es nichts Neues'}</h1>
   <p class="muted">${Q.session.length?'Jeder Begriff ist jetzt im Wiederholplan und kommt morgen das erste Mal wieder.':'Alle Karten sind schon im Wiederholplan. Fällige Begriffe übst du mit „Wiederholen“.'}</p>
   ${(()=>{const s=getSet(view.id),rest=s?pool(s).filter(c=>c.lv<1).length:0;return rest&&Q.session.length?`<p class="muted">Im Set warten noch ${rest} neue Begriffe. Gönn dir ruhig erst eine Pause – kleine Portionen bleiben besser hängen.</p>`:''})()}
   <div class="stack">${(()=>{const s=getSet(view.id),rest=s?pool(s).filter(c=>c.lv<1).length:0;return rest&&Q.session.length?`<button class="btn primary wide" data-act="learn-more">Nächste ${Math.min(rest,LEARN_CHUNK)} lernen</button><button class="btn wide" data-act="mode" data-m="test">Jetzt testen</button>`:'<button class="btn primary wide" data-act="mode" data-m="test">Jetzt testen</button>'})()}<button class="btn wide" data-act="learn-reset">Alles von vorn lernen</button></div></section>`;
  }else if(Q.kind==='watch'){vWatchDone(Q)}else{
   const dues=Q.session.map(it=>card(getSet(it.sid),it.cid)).filter(Boolean).map(c=>c.due);
   const next=allDue().length?0:Math.min(...db.sets.flatMap(s=>s.cards.filter(c=>c.lv>=1).map(c=>c.due)),Infinity);
   app.innerHTML=bar(view.back,backTitle)+`<section class="summary"><h1>Wiederholung geschafft</h1>
   <div class="big-nums"><div><b class="g">${Q.done}</b><span>wiederholt</span></div><div><b class="r">${Q.failed.size}</b><span>mit Fehler</span></div></div>
   <p class="muted">${Q.failed.size?'Begriffe mit Fehler fangen wieder in Fach 1 an und kommen morgen nochmal. ':''}${next&&next<Infinity?`Nächste Wiederholung: ${relDay(next)}.`:''}</p>
   <button class="btn primary wide" data-act="back" data-to="${view.back}">Fertig</button></section>`;
  }
  return}
 if(!Q.cur){const it=Q.items[0],s=getSet(it.sid),c=card(s,it.cid);if(!c){Q.items.shift();return render()}
  Q.cur=it;Q.type=(learn||(Q.kind==='watch'&&it.isNew))&&(c.m||0)===0&&s.cards.length>=2?'mc':'write';Q.opts=Q.type==='mc'?options(s,c,prefs.dir):null;Q.res=null;Q.editing=false;Q.speaking=false;Q.help={lv:0}}
 const s=getSet(Q.cur.sid),c=card(s,Q.cur.cid),{prompt,answer,askLang,ansLang}=dirOf(s,c);
 const prog=learn?Q.session.filter(it=>{const x=card(getSet(it.sid),it.cid);return x&&x.lv>=1}).length:Q.done;
 const r=Q.res;
 let body='';
 if(Q.type==='mc'){
  body=`<p class="label">Wähle die richtige Antwort</p><div class="opts">${Q.opts.map((o,i)=>{let cl='';if(r){if(o===answer)cl='ok';else if(i===r.pick)cl='no'}
   return `<button class="opt ${cl}" data-act="q-opt" data-i="${i}" ${r?'disabled':''}><span class="n">${i+1}</span><span>${esc(o)}</span></button>`}).join('')}</div>`;
 }else{
  body=`<p class="label">Schreib es auf ${langName(ansLang)}</p><form class="write" id="q-form" autocomplete="off"><input id="q-in" lang="${short(ansLang)}" value="${esc(r?r.input:'')}" ${r?'disabled':''} autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Deine Antwort" placeholder="Antwort eingeben">${r?'':micBtn('q-in',ansLang)}<button class="btn primary" ${r?'disabled':''}>Prüfen</button></form>
  ${r?'':`${helpHtml(Q.help||{},'q-help',ansLang)}<div class="row-between"><button class="linkbtn" data-act="q-idk">Weiß ich nicht</button></div>${dictHint}`}`;
 }
 let fb='';
 if(r){
  const ex=c.ex?`<span class="ex">${esc(c.ex)}</span>`:'';
  fb=r.helped?`<div class="fb no"><div class="row-between"><strong>Mit Lösungshilfe</strong>${sayBtn(answer,ansLang)}</div><span>Richtig ist: <span class="ans">${esc(answer)}</span></span><span class="muted">Zählt nicht als gewusst – der Begriff kommt bald wieder.</span>${ex}</div>`:r.ok?`<div class="fb ok"><div class="row-between"><strong>${r.hint?'Fast genau richtig':'Richtig'}</strong>${sayBtn(answer,ansLang)}</div><span>Antwort: <span class="ans">${esc(answer)}</span></span>${ex}</div>`
   :`<div class="fb no"><div class="row-between"><strong>${r.idk?'Kein Problem, merk dir:':'Noch nicht'}</strong>${sayBtn(answer,ansLang)}</div><span>Richtig ist: <span class="ans">${esc(answer)}</span></span>${r.input&&!r.idk?`<span class="muted">Deine Antwort: ${esc(r.input)}</span>`:''}${ex}</div>`;
  if(Q.editing){
   fb+=`<form class="inline-edit" id="q-edit" autocomplete="off"><span class="label">Karte korrigieren</span>
   <input id="qe-t" value="${esc(c.t)}" aria-label="Begriff (${langName(s.l1)})" placeholder="${langName(s.l1)}">
   <input id="qe-d" value="${esc(c.d)}" aria-label="Definition (${langName(s.l2)})" placeholder="${langName(s.l2)}">
   <input id="qe-x" value="${esc(c.ex)}" aria-label="Beispielsatz" placeholder="Beispielsatz (optional)">
   <div class="btn-row"><button class="btn primary sm">Speichern</button><button type="button" class="btn sm" data-act="q-edit-cancel">Abbrechen</button></div></form>`;
  }
  fb+=`<div class="row-between"><span style="display:flex;gap:14px;flex-wrap:wrap">${!r.ok&&Q.type==='write'&&r.input&&!r.idk?`<button class="linkbtn" data-act="q-override">Ich lag doch richtig</button>`:''}${Q.editing?'':`<button class="linkbtn" data-act="q-edit">Karte korrigieren</button>`}</span><button class="btn primary" id="q-next" data-act="q-next" ${Q.speaking?'disabled':''}>${Q.speaking?'Wird vorgelesen …':'Weiter'}</button></div>`}
 app.innerHTML=bar(view.back,backTitle||(Q.kind==='watch'?'Wache':'Wiederholen'))+(Q.kind==='watch'?battleHead(Q):'')+`
 <div class="prog" ${Q.kind==='watch'?'hidden':''}><span>${prog} / ${Q.session.length} ${learn?'sitzen':Q.kind==='watch'?'geschafft':'wiederholt'}</span><div class="pbar"><i style="width:${Q.session.length?prog/Q.session.length*100:0}%"></i></div></div>
 <section class="q"><div class="row-between"><span class="label">${learn?'':esc(s.title)+' · '}${langName(askLang)} · ${Q.type==='mc'?'Ankreuzen':'Schreiben'}</span><span style="display:flex;gap:6px;align-items:center">${pill(c)}${starBtn(c,'cur-star')}</span></div>
 <div class="q-prompt"><div>${esc(prompt)}</div>${sayBtn(prompt,askLang)}</div>${body}${fb}</section>
 <div class="tools"><button class="chip" data-act="q-dir">Antwort auf ${langName(ansLang)}</button>${autoChip()}</div>`;
 if(prefs.auto&&!r&&Q.spoken!==qKey(Q.cur)+prefs.dir+Q.items.length){Q.spoken=qKey(Q.cur)+prefs.dir+Q.items.length;speak(prompt,askLang)}
 if(r){if(Q.editing)$('#qe-t').focus();else if(!Q.speaking)$('#q-next').focus()}
 else if(Q.type==='write')$('#q-in').focus();
}
function qAnswer(res){const Q=view.Q,s=getSet(Q.cur.sid),c=card(s,Q.cur.cid);Q.res=res;logAnswer();if(Q.kind==='watch')Q.anim=res.ok?'hit':'miss';
 if((Q.kind==='review'||(Q.kind==='watch'&&!Q.cur.isNew))&&!res.ok&&!Q.failed.has(qKey(Q.cur))){Q.failed.add(qKey(Q.cur));res.addedFail=true}
 Q.speaking=prefs.auto&&(hasTTS||cloudOK());render();
 if(Q.speaking){const{answer,ansLang}=dirOf(s,c);speak(answer,ansLang,()=>{if(view.Q!==Q||Q.res!==res)return;Q.speaking=false;const b=$('#q-next');if(b){b.disabled=false;b.textContent='Weiter';if(!Q.editing)b.focus()}})}}
function qNext(){const Q=view.Q;if(!Q.res)return;const it=Q.items.shift(),c=card(getSet(it.sid),it.cid);
 if(c){const lm=Q.kind==='learn'||(Q.kind==='watch'&&it.isNew);const again=lm?gradeLearn(c,Q.res.ok):gradeReview(c,Q.res.ok,Q.failed.has(qKey(it)));
  if(again)Q.items.splice(Math.min(Q.res.ok?3:2,Q.items.length),0,it);else if(Q.kind!=='learn')Q.done++}
 db.fresh=false;save();Q.cur=null;Q.res=null;Q.speaking=false;render()}
function answerMc(i){const Q=view.Q;if(Q.res||Q.type!=='mc')return;const s=getSet(Q.cur.sid),c=card(s,Q.cur.cid);qAnswer({ok:Q.opts[i]===dirOf(s,c).answer,pick:i})}

/* ---------- Freihändig ---------- */
function startHands(s){const p=pool(s);let items=shuffle(p.filter(isDue)).concat(shuffle(p.filter(c=>c.lv<1)));
 if(!items.length)items=shuffle(p.slice());
 go('hands',{id:s.id,H:{items:items.map(c=>c.id),state:'ready',heard:'',msg:'',ok:0,no:0,misses:0,failed:new Set(),stopped:false,lastOk:null}})}
const HF_STATUS={ready:'Bereit. Tippe auf Starten.',speak:'Ich lese vor …',listen:'Sprich jetzt',paused:'Pausiert'};
function vHands(){const s=getSet(view.id),H=view.H;
 if(!H.items.length){app.innerHTML=bar('set',s.title)+`<section class="summary"><h1>Runde geschafft</h1>
  <div class="big-nums"><div><b class="g">${H.ok}</b><span>richtig</span></div><div><b class="r">${H.no}</b><span>falsch</span></div></div>
  <button class="btn primary wide" data-act="mode" data-m="hands">Nochmal</button></section>`;return}
 const c=card(s,H.items[0]);if(!c){H.items.shift();return render()}
 const{prompt,askLang,ansLang}=dirOf(s,c),running=H.state==='speak'||H.state==='listen'||H.state==='feedback';
 app.innerHTML=bar('set',s.title)+`<section class="hands st-${H.state} ${H.state==='feedback'?(H.lastOk?'ok':'no'):''}">
  <div class="hf-ring">${H.state==='listen'?ICON.bigmic:ICON.bigsay}</div>
  <p class="label">${langName(askLang)} → ${langName(ansLang)}</p>
  <div class="hf-prompt">${esc(prompt)}</div>
  <p class="hf-status" id="hf-status">${esc(H.state==='feedback'?H.msg:H.msg||HF_STATUS[H.state])}</p>
  <p class="hf-heard" id="hf-heard">${H.heard?'„'+esc(H.heard)+'“':''}</p></section>
 <div class="judge">${running?`<button class="btn" data-act="hf-pause">Pause</button>`:`<button class="btn primary" data-act="hf-go">${H.state==='ready'?'Starten':'Fortsetzen'}</button>`}<button class="btn" data-act="hf-skip">Überspringen</button></div>
 <div class="tools"><button class="chip" data-act="hf-dir" ${running?'disabled':''}>Antwort auf ${langName(ansLang)}</button></div>
 <p class="hint" style="text-align:center">${H.items.length} übrig · ${H.ok} richtig · ${H.no} falsch. Sag „weiß nicht“, wenn du es nicht weißt. Der Bildschirm bleibt dabei an.</p>`;
}
function hfSet(){const H=view.H,st=$('#hf-status'),hd=$('#hf-heard');if(st)st.textContent=H.msg||HF_STATUS[H.state]||'';if(hd)hd.textContent=H.heard?'„'+H.heard+'“':'';
 const sec=document.querySelector('.hands');if(sec)sec.className='hands st-'+H.state}
function hfAsk(){const H=view.H;if(!H||H.stopped)return;if(!H.items.length){releaseWake();return render()}
 const s=getSet(view.id),c=card(s,H.items[0]);if(!c){H.items.shift();return hfAsk()}
 H.state='speak';H.heard='';H.msg='';H.retried=false;render();
 const{prompt,askLang}=dirOf(s,c);hfPrefetch();
 speak(prompt,askLang,()=>{if(H.stopped||H.state!=='speak')return;setTimeout(()=>{if(!H.stopped&&H.state==='speak')hfListen()},250)},false,hfVoice())}
// Freihändig: Gemini-Stimme, wenn eingerichtet (wie bei der Möwe). Die nächsten Karten werden vorab geholt, damit es ohne Pause weitergeht.
const hfVoice=()=>({cloud:cloudOK()&&prefs.hfEngine!=='device'});
const HF_PHRASES=['Richtig.','Leider nicht. Richtig ist','Die Antwort ist','Nicht ganz verstanden. Nochmal, bitte.'];
let hfFetching=false;
async function hfPrefetch(){const H=view.H;if(hfFetching||!H||!hfVoice().cloud||learnOffline())return;hfFetching=true;
 try{const s=getSet(view.id),todo=[];H.items.slice(0,3).forEach(id=>{const c=card(s,id);if(!c)return;const d=dirOf(s,c);todo.push([d.prompt,d.askLang],[d.answer,d.ansLang])});
  HF_PHRASES.forEach(t=>todo.push([t,'de-DE']));
  for(const [t,l] of todo){if(view.H!==H||H.stopped)break;const tx=speechText(t,l);if(!tx)continue;try{await cloudAudio(tx,l)}catch(e){if(e&&/limit/i.test(e.message||''))break}}}
 finally{hfFetching=false}}
function hfListen(){const H=view.H,s=getSet(view.id),c=card(s,H.items[0]),{ansLang}=dirOf(s,c);
 H.state='listen';H.msg='';render();
 listen(ansLang,{quiet:true,
  onInterim:t=>{if(H.stopped)return;H.heard=t;hfSet()},
  onFinal:alts=>{if(H.stopped||H.state!=='listen')return;hfJudge(alts)},
  onNone:fatal=>{if(H.stopped||H.state!=='listen')return;
   if(fatal){H.state='paused';H.msg='Mikrofon nicht verfügbar. Prüfe die Browser-Erlaubnis.';render();return}
   H.misses++;if(H.misses>=2){H.misses=0;H.state='paused';H.msg='Nichts gehört. Pausiert.';render()}else hfAsk()}})}
function hfJudge(alts){const H=view.H,s=getSet(view.id),c=card(s,H.items[0]),{answer,ansLang}=dirOf(s,c);
 H.misses=0;const J=speechJudge(alts,answer),idk=!J.ok&&alts.some(isIdk),ok=J.ok;
 // knapp daneben: vermutlich verhört – einmal nachfragen statt falsch werten
 if(!ok&&!idk&&J.close&&!H.retried){H.retried=true;H.heard=J.said;H.state='speak';H.msg='Nicht ganz verstanden – nochmal, bitte.';render();
  speak('Nicht ganz verstanden. Nochmal, bitte.','de-DE',()=>{if(H.stopped||H.state!=='speak')return;setTimeout(()=>{if(!H.stopped&&H.state==='speak')hfListen()},250)},false,hfVoice());return}
 H.heard=ok?J.said:alts[0];H.state='feedback';H.lastOk=ok;logAnswer();
 let again;if(c.lv>=1){if(!ok)H.failed.add(c.id);again=gradeReview(c,ok,H.failed.has(c.id))}else again=gradeLearn(c,ok);
 H.items.shift();if(again)H.items.splice(Math.min(ok?3:2,H.items.length),0,c.id);
 ok?H.ok++:H.no++;db.fresh=false;save();
 H.msg=ok?(J.exact?'Richtig':`Richtig (verstanden: „${J.said}“)`):`Richtig ist: ${answer}`;render();
 const next=()=>{if(H.stopped||H.state!=='feedback')return;setTimeout(()=>{if(!H.stopped&&H.state==='feedback')hfAsk()},400)};
 if(ok)speak('Richtig.','de-DE',next,false,hfVoice());
 else speak(idk?'Die Antwort ist':'Leider nicht. Richtig ist','de-DE',()=>{if(H.stopped||H.state!=='feedback')return;speak(answer,ansLang,next,false,hfVoice())},false,hfVoice())}
function hfPause(){const H=view.H;H.state='paused';H.msg='';stopListen();stopSpeak();releaseWake();render()}
