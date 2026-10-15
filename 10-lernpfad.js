// Vokabelkoje – lernpfad
/* ---------- Lernpfad ---------- */
const getCourse=id=>(db.courses||[]).find(c=>c.id===id);
const unitOf=(c,uid)=>c&&c.units.find(u=>u.id===uid);
const ETAPPE_FMT=`{"titel":"kurzer Etappenname","kann":"Kann-Satz auf Deutsch: was ich danach kann","grammatik":"genau ein Grammatikthema, auf Deutsch benannt","wortfeld":"Wortfeld auf Deutsch","situation":"kurze Gesprächssituation zum Üben"}`;
const LVNAME={A1:'Einstieg',A2:'Grundlagen',B1:'Mittelstufe',B2:'Gute Mittelstufe',C1:'Fortgeschritten',C2:'Nahezu muttersprachlich'};
const mkUnit=(x,n,status,lvl,chapter)=>{const l=String(lvl||x.lvl||'').toUpperCase().slice(0,2);return {id:uid(),n,kind:'lesson',chapter:String(chapter||'').trim(),title:String(x.titel||'').trim(),kann:String(x.kann||'').trim(),grammar:String(x.grammatik||'').trim(),field:String(x.wortfeld||'').trim(),situation:String(x.situation||'').trim(),lvl:LEVELS.includes(l)?l:'A1',status,setId:null,lesson:null,lessonRead:false,drillOk:false,talked:false,score:null}};
const mkExam=(L,n)=>({id:uid(),n,kind:'exam',chapter:'Abschluss',title:`Stufentest ${L}`,kann:`Ich habe ${L} abgeschlossen.`,grammar:'',field:'',lvl:L,status:'locked',score:null});
const startLevel=c=>c.from==='0'?'A1':c.from;
function nextPlanLevel(c){if(!c.units.length)return startLevel(c);const hi=Math.max(...c.units.map(u=>LEVELS.indexOf(u.lvl)));const nx=hi+1;return nx<=LEVELS.indexOf(c.to)&&nx<LEVELS.length?LEVELS[nx]:null}
const planning={};
function maybeExtend(c){if(!c||planning[c.id])return;const left=c.units.filter(u=>u.status!=='done').length;if(left>3)return;const L=nextPlanLevel(c);if(!L)return;planLevel(c,L)}
function levelPrompt(c,L,first){const TL=langName(c.lang);
 const before=c.units.filter(u=>u.kind!=='exam').map(u=>u.grammar).filter(Boolean);
 return `Plane den kompletten Ordner für Niveau ${L} eines ${TL}-Lernpfads für einen deutschsprachigen Erwachsenen.
Persönliches Ziel: ${c.goal||'im Alltag zurechtkommen'}. Zeit pro Tag: etwa ${c.min} Minuten.${first&&c.from==='0'?' Der Lerner hat keine Vorkenntnisse.':''}
${before.length?`Diese Grammatikthemen wurden schon behandelt, nicht wiederholen: ${before.slice(-60).join('; ')}.\n`:''}${weakHint(c.lang)?`Offene Schwachstellen, die in passenden Etappen nebenbei vorkommen sollen: ${weakHint(c.lang)}.\n`:''}
Decke die wichtigsten Grammatikthemen und den typischen Wortschatz von ${L} nach dem Gemeinsamen Europäischen Referenzrahmen ab, in sinnvoller Lernreihenfolge vom Einfachen zum Schweren.
Plane 10 bis 16 Etappen. Jede Etappe hat wenig Stoff: genau ein Grammatikthema und ein Wortfeld mit 10 bis 12 Wörtern. Die Wortfelder passen zum persönlichen Ziel, decken am Ende aber den ganzen Grundwortschatz von ${L} ab.
Ordne die Etappen in 2 bis 4 Kapitel mit kurzem, anschaulichem Namen.
Antworte nur mit JSON: {${first?'"titel":"kurzer Name des Lernpfads",':''}"kapitel":[{"name":"Kapitelname","etappen":[${ETAPPE_FMT}]}]}`}
function addLevel(c,r,L){
 let groups=Array.isArray(r&&r.kapitel)?r.kapitel.filter(k=>k&&Array.isArray(k.etappen)).map(k=>({name:String(k.name||''),et:k.etappen})):[];
 if(!groups.length&&Array.isArray(r&&r.etappen))groups=[{name:'',et:r.etappen}];
 const list=[];groups.forEach(g=>g.et.filter(x=>x&&x.titel&&x.grammatik).forEach(x=>list.push([x,g.name])));
 if(list.length<4)throw new AIError(`Der Ordner ${L} konnte nicht geplant werden. Versuch es nochmal.`);
 const openNow=c.units.every(u=>u.status==='done');let n=c.units.length;
 list.slice(0,18).forEach(([x,ch],i)=>c.units.push(mkUnit(x,++n,openNow&&i===0?'open':'locked',L,ch)));
 c.units.push(mkExam(L,++n));c.upd=now();save()}
async function planLevel(c,L){planning[c.id]={L,err:''};if(view.name==='course'&&view.id===c.id)render();
 try{const r=await ai(levelPrompt(c,L,false),{json:true,fresh:true});addLevel(c,r,L);delete planning[c.id];toast(`Ordner ${L} ist geplant`)}
 catch(e){planning[c.id]={L,err:e.message||'Planen hat nicht geklappt.'}}
 if((view.name==='course'&&view.id===c.id)||view.name==='home')render()}
function courseCards(){return (db.courses||[]).filter(c=>!activeLang()||c.lang===activeLang()).map(c=>{const cur=c.units.find(u=>u.status==='open');const L=cur?cur.lvl:(c.units.length?c.units[c.units.length-1].lvl:startLevel(c));
 const us=c.units.filter(u=>u.lvl===L),done=us.filter(u=>u.status==='done').length;
 const due=db.sets.filter(s=>s.course===c.id).reduce((n,s)=>n+dueCount(s),0);
 return `<button class="set-row course-row" data-act="course" data-id="${c.id}"><div class="set-top"><span class="cc-ship">${shipSVG(46)}</span><div style="flex:1;min-width:0"><span class="label">${langName(c.lang)} · Ziel ${c.to}</span><div class="set-title">${esc(c.title)}</div><div class="set-meta">${cur?`Weiter mit ${cur.kind==='exam'?esc(cur.title):`Etappe ${cur.n}: ${esc(cur.title)}`}`:planning[c.id]?'KI plant den nächsten Ordner …':'Alle geplanten Etappen geschafft'}</div></div>${due?`<span class="due-chip">${due} fällig</span>`:''}</div>
 <div class="prog"><span>${L} · ${done} / ${us.length}</span><div class="pbar"><i style="width:${us.length?done/us.length*100:0}%"></i></div></div></button>`}).join('')}
function newCourse(){const lang=curLang()||'en-GB',m=measuredLevel(lang);
 go('courseNew',{N:{lang,goal:'',from:m&&m!=='C2'?m:'0',to:'C2',min:'20',busy:false,err:''}})}
function vCourseNew(){const N=view.N;
 app.innerHTML=bar('home','Lernpfad')+`<div class="form"><h1>Neuer Lernpfad<span class="ai-tag">${aiName()}</span></h1>
 <p class="muted">Sag der KI, was du erreichen willst. Sie legt für jedes Niveau einen Ordner an, mit Kapiteln und kleinen Etappen: je ein Grammatikthema und 10 bis 12 Wörter. Jeder Ordner endet mit einem Stufentest. Den nächsten Ordner plant sie automatisch, kurz bevor du dort ankommst.</p>
 <label class="fld"><span>Sprache</span><select id="cn-lang" data-n="lang">${LANGS.filter(l=>l[0]!=='de-DE').map(([c,n])=>`<option value="${c}" ${N.lang===c?'selected':''}>${n}</option>`).join('')}</select></label>
 <label class="fld"><span>Dein Ziel</span><textarea id="cn-goal" data-n="goal" rows="3" placeholder="z. B. Im Mai Segeltörn in Kroatien: im Hafen zurechtkommen, Smalltalk, Essen bestellen">${esc(N.goal)}</textarea></label>
 <div class="two"><label class="fld"><span>Dein Stand jetzt</span><select id="cn-from" data-n="from"><option value="0" ${N.from==='0'?'selected':''}>Ganz von vorn</option>${LEVELS.slice(0,5).map(l=>`<option value="${l}" ${N.from===l?'selected':''}>${l} · ${LVNAME[l]}</option>`).join('')}</select></label>
  <label class="fld"><span>Ziel-Niveau</span><select id="cn-to" data-n="to">${LEVELS.map(l=>`<option value="${l}" ${N.to===l?'selected':''}>${l} · ${LVNAME[l]}</option>`).join('')}</select></label></div>
 <p class="hint">Das Ziel kannst du später jederzeit ändern. Geplant wird immer nur der nächste Ordner, damit die KI deinen Fortschritt und deine Schwachstellen einbeziehen kann.</p>
 <label class="fld"><span>Zeit pro Tag</span><select id="cn-min" data-n="min">${[10,20,30,45].map(m=>`<option value="${m}" ${+N.min===m?'selected':''}>${m} Minuten</option>`).join('')}</select></label>
 <button class="btn primary wide" data-act="cn-go" ${N.busy?'disabled':''}>${N.busy?`KI plant deinen ersten Ordner …`:'Lernpfad erstellen'}</button>${errHtml(N.err)}</div>`}
async function courseCreate(){const N=view.N;
 if(N.from!=='0'&&LEVELS.indexOf(N.to)<LEVELS.indexOf(N.from))return toast('Das Ziel-Niveau sollte nicht unter deinem jetzigen Stand liegen');
 N.busy=true;N.err='';render();const TL=langName(N.lang);
 const c={id:uid(),title:'',lang:N.lang,from:N.from,to:N.to,goal:N.goal.trim(),min:+N.min,created:now(),upd:now(),units:[]};
 try{const L=startLevel(c);const r=await ai(levelPrompt(c,L,true),{json:true,fresh:true});addLevel(c,r,L);
  c.title=String((r&&r.titel)||`${TL} bis ${c.to}`).trim();
  db.courses.push(c);db.fresh=false;setLang(c.lang);save();N.busy=false;if(view.N===N)go('course',{id:c.id});return}
 catch(e){N.err=e.message}
 N.busy=false;if(view.N===N)render()}
const FOLDER='<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.2h8.5A1.5 1.5 0 0 1 21 8.7V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const FLAG='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 21V4M6 4h11l-2.5 4L17 12H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function unitRow(c,u){const lock=u.status==='locked';return `<li><button class="unit-row ${u.status} ${u.kind==='exam'?'exam':''}" data-act="unit" data-id="${c.id}" data-uid="${u.id}" ${lock?'disabled':''} aria-label="${u.kind==='exam'?esc(u.title):`Etappe ${u.n}: ${esc(u.title)}`}${lock?', noch gesperrt':u.status==='done'?', geschafft':''}"><span class="u-n">${u.status==='done'?'✓':u.kind==='exam'?FLAG:u.n}</span><span class="u-body"><b>${esc(u.title)}</b><span class="hint">${u.kind==='exam'?`Gemischte Fragen zum ganzen Ordner. Ab 75 % ist ${u.lvl} geschafft.`:`${esc(u.grammar)} · ${esc(u.field)}`}</span></span>${u.score!=null?`<span class="pill ${u.status==='done'?'m2':''}">${Math.round(u.score*100)} %</span>`:'<span></span>'}</button></li>`}
function vCourse(){const c=getCourse(view.id);if(!c)return go('home');maybeExtend(c);
 const cur=c.units.find(u=>u.status==='open'),allDone=c.units.length&&c.units.every(u=>u.status==='done');
 const s0=LEVELS.indexOf(c.units.length?c.units[0].lvl:startLevel(c)),e0=Math.max(LEVELS.indexOf(c.to),...c.units.map(u=>LEVELS.indexOf(u.lvl)));
 const nextL=nextPlanLevel(c),pl=planning[c.id];view.openLv=view.openLv||{};const mapMode=prefs.cview!=='list';
 const totalDone=c.units.filter(u=>u.status==='done'&&u.kind!=='exam').length;
 let h=bar('home','Lernpfad')+`<section class="set-head"><span class="label">Lernpfad · ${langName(c.lang)} · ${c.min} Min. am Tag</span><h1>${esc(c.title)}</h1>${c.goal?`<p class="muted">Ziel: ${esc(c.goal)}</p>`:''}
 <div class="row-between"><span class="hint">${totalDone} Etappen geschafft${cur?` · aktuell ${cur.lvl}`:''}</span><label class="check">Ziel-Niveau <select id="c-to" style="width:auto;min-height:36px;border:1px solid var(--line);border-radius:8px;padding:4px 8px;background:var(--surface)">${LEVELS.map(l=>`<option ${c.to===l?'selected':''}>${l}</option>`).join('')}</select></label></div>
 <div class="row-between"><div class="chips" role="group" aria-label="Ansicht"><button class="chip ${mapMode?'on':''}" data-act="cview" data-v="map" aria-pressed="${mapMode}">Seekarte</button><button class="chip ${mapMode?'':'on'}" data-act="cview" data-v="list" aria-pressed="${!mapMode}">Ordner</button></div><button class="btn sm" data-act="logbook" data-id="${c.id}">Logbuch</button></div></section>`;
 if(allDone&&!nextL&&!pl)h+=`<div class="fb ok"><strong>Ziel ${c.to} erreicht!</strong><span>${c.to==='C2'?'Mehr geht nicht. Halte dein Niveau mit Gesprächen, Texten und dem Wiederholplan.':'Stark. Willst du weitermachen? Dann setz das Ziel eine Stufe höher, und die KI plant den nächsten Ordner.'}</span>${c.to!=='C2'?`<button class="btn sm primary" data-act="c-raise">Weiter bis ${LEVELS[LEVELS.indexOf(c.to)+1]}</button>`:''}</div>`;
 let folders='',later='';
 for(let i=s0;i<=e0;i++){const L=LEVELS[i],us=c.units.filter(u=>u.lvl===L);
  if(!us.length){const isNext=L===nextL;
   later+=`<div class="folder leer"><div class="f-sum"><span class="f-ico">${FOLDER}</span><span class="f-title"><b>${L} · ${LVNAME[L]}</b><span class="hint">${pl&&pl.L===L?(pl.err?'':`${aiName()} kartiert gerade dieses Seegebiet …`):isNext?'Wird automatisch geplant, wenn du kurz davor bist.':'Noch nicht kartiert.'}</span></span>${isNext&&!pl?'<button class="btn sm" data-act="c-plan">Jetzt planen</button>':'<span></span>'}</div>${pl&&pl.L===L&&pl.err?`<div class="folder-body">${errHtml(pl.err)}<button class="btn sm" data-act="c-plan">Nochmal versuchen</button></div>`:''}</div>`;continue}
  const done=us.filter(u=>u.status==='done').length,state=done===us.length?'geschafft':us.some(u=>u.status==='open')?'aktuell':'kommt';
  const open=view.openLv[L]!=null?view.openLv[L]:state==='aktuell';
  const chapters=[];us.forEach(u=>{const k=u.chapter||'Etappen';let g=chapters.find(x=>x.k===k);if(!g)chapters.push(g={k,us:[]});g.us.push(u)});
  folders+=`<details class="folder ${state}" data-lv="${L}" ${open?'open':''}><summary class="f-sum"><span class="f-ico">${FOLDER}</span><span class="f-title"><b>${L} · ${LVNAME[L]}</b><span class="hint">${done} von ${us.length} · ${({geschafft:'geschafft',aktuell:'hier bist du',kommt:'noch gesperrt'})[state]}</span></span><span class="f-bar"><i style="width:${done/us.length*100}%"></i></span></summary>
  <div class="folder-body">${chapters.map(g=>`<div class="chapter"><span class="label">${esc(g.k)}</span><ol class="units">${g.us.map(u=>unitRow(c,u)).join('')}</ol></div>`).join('')}</div></details>`}
 h+=mapMode?(c.units.length?`<div class="chart-box">${mapSVG(c)}</div>`:'')+(later?`<div class="folders">${later}</div>`:''):`<div class="folders">${folders}${later}</div>`;
 h+=view.confirm?`<div class="confirm"><span>Lernpfad samt Etappen-Wörtern löschen?</span><button class="btn danger sm" data-act="c-del-yes">Löschen</button><button class="btn sm" data-act="c-del-no">Abbrechen</button></div>`:'<div class="danger-zone"><button class="btn danger sm" data-act="c-del">Lernpfad löschen</button></div>';
 app.innerHTML=h}
function startUnit(cid,uidv){const c=getCourse(cid),u=unitOf(c,uidv);if(!u)return go('home');
 if(u.kind==='exam')return go('check',{lang:c.lang,uref:{id:c.id,uid:u.id},K:{stage:'intro',qs:null,ans:[],i:0,busy:false,err:'',fb:null}});
 go('unit',{id:cid,uid:uidv,U:{busy:false,err:''}});if(!u.setId||!getSet(u.setId)||!u.lesson)unitLoad()}
async function unitLoad(){const c=getCourse(view.id),u=unitOf(c,view.uid),U=view.U;if(!u||U.busy)return;U.busy=true;U.err='';render();
 const TL=langName(c.lang);
 const prev=c.units.filter(x=>x.n<u.n&&x.setId).flatMap(x=>(getSet(x.setId)||{cards:[]}).cards.map(k=>k.t)).slice(-150).join(', ');
 try{const r=await ai(`Erstelle die Inhalte für eine Etappe eines ${TL}-Lernpfads für einen deutschsprachigen Erwachsenen (Niveau ${u.lvl}).
Etappe ${u.n}: „${u.title}“. Ziel: ${u.kann}. Grammatik: ${u.grammar}. Wortfeld: ${u.field}. Persönliches Ziel des Lerners: ${c.goal||'Alltag'}.
${prev?`Diese Wörter kennt er schon aus früheren Etappen, nimm sie nicht noch einmal: ${prev}.\n`:''}${weakHint(c.lang)?`Lass diese Schwachstellen in den Beispielsätzen nebenbei vorkommen: ${weakHint(c.lang)}.\n`:''}
Antworte nur mit JSON:
{"regel":"Erklärung des Grammatikthemas auf Deutsch, einfach und konkret, höchstens 6 kurze Sätze","beispiele":["3 bis 5 kurze Beispielsätze auf ${TL}, die die Regel und Wörter aus dem Wortfeld nutzen"],"uebersetzungen":["deutsche Übersetzung zu jedem Beispiel, gleiche Reihenfolge"],"karten":[{"t":"Wort auf ${TL} (Substantiv mit Artikel, Verb im Infinitiv)","d":"deutsche Übersetzung","ex":"kurzer Beispielsatz auf ${TL}"}]}
„karten“: 10 bis 12 häufige, nützliche Wörter oder feste Wendungen zum Wortfeld, passend zum Niveau.`,{json:true,fresh:true});
  const cards=(Array.isArray(r&&r.karten)?r.karten:[]).filter(x=>x&&x.t&&x.d).slice(0,14).map(x=>({...blank(),t:String(x.t).trim(),d:String(x.d).trim(),ex:String(x.ex||'').trim()}));
  if(cards.length<5)throw new AIError('Die Etappe konnte nicht erstellt werden. Versuch es nochmal.');
  let s=u.setId&&getSet(u.setId);
  if(s){s.cards=s.cards.length?s.cards:cards;s.upd=now()}else{s={id:uid(),title:`${u.n}. ${u.title}`,l1:c.lang,l2:'de-DE',best:null,upd:now(),cards,course:c.id,unit:u.id};db.sets.push(s);u.setId=s.id}
  const bs=(Array.isArray(r.beispiele)?r.beispiele:[]).map(String),tr=(Array.isArray(r.uebersetzungen)?r.uebersetzungen:[]).map(String);
  u.lesson={regel:String(r.regel||''),bsp:bs.map((b,i)=>({b,de:tr[i]||''}))};c.upd=now();db.fresh=false;save()}
 catch(e){U.err=e.message}
 U.busy=false;if(view.U===U)render()}
function vUnit(){const c=getCourse(view.id),u=unitOf(c,view.uid),U=view.U;if(!u)return go('home');
 const s=u.setId&&getSet(u.setId),TL=c.lang;
 let h=bar('course',c.title)+`<section class="set-head"><span class="label">Ordner ${u.lvl}${u.chapter?' · '+esc(u.chapter):''} · Etappe ${u.n}</span><h1>${esc(u.title)}</h1>${u.kann?`<p class="muted">${esc(u.kann)}</p>`:''}</section>`;
 if(!s||!u.lesson){h+=U.err?errHtml(U.err)+'<button class="btn" data-act="u-load">Nochmal versuchen</button>':`<p class="thinking">${aiName()} stellt die Etappe zusammen: Grammatik „${esc(u.grammar)}“ und Wörter zum Thema „${esc(u.field)}“ …</p>`;app.innerHTML=h;return}
 const sit=s.cards.filter(k=>k.lv>=1).length,vocDone=s.cards.length>0&&sit/s.cards.length>=.8;
 const step=(n,done,title,body)=>`<li class="step ${done?'done':''}"><span class="u-n" aria-label="${done?'erledigt':'Schritt '+n}">${done?'✓':n}</span><div class="step-body"><b>${title}</b>${body}</div></li>`;
 h+=`<ol class="steps">
 ${step(1,u.lessonRead,'Lektion: '+esc(u.grammar),`<p>${esc(u.lesson.regel)}</p>${u.lesson.bsp.length?`<ul class="ex-list" lang="${short(TL)}">${u.lesson.bsp.map(x=>`<li><span class="row-between" style="flex-wrap:nowrap;align-items:flex-start"><span>${tapText(x.b,TL)}</span>${sayBtn(x.b,TL)}</span>${x.de?`<span class="hint" lang="de">${esc(x.de)}</span>`:''}</li>`).join('')}</ul>`:''}${u.lessonRead?'':'<button class="btn sm primary" data-act="u-read">Verstanden</button>'}`)}
 ${step(2,vocDone,'Wörter: '+esc(u.field),`<p class="hint">${sit} von ${s.cards.length} Wörtern sitzen.</p><div class="btn-row"><button class="btn ${u.lessonRead&&!vocDone?'primary':''}" data-act="u-learn">${vocDone?'Nochmal üben':sit?'Weiterlernen':'Wörter lernen'}</button><button class="btn" data-act="open" data-id="${s.id}">Alle Übungen</button></div>`)}
 ${step(3,u.drillOk,'Grammatik üben',`<p class="hint">Kurze Aufgaben zur Regel aus der Lektion. Ab 80 % ist der Schritt erledigt.</p><button class="btn ${vocDone&&!u.drillOk?'primary':''}" data-act="u-drill">Üben</button>`)}
 ${step(4,u.talked,'Im Gespräch anwenden',`<p class="hint">Rollenspiel: ${esc(u.situation||u.field)}. ${TALK_UNIT} kurze Nachrichten, dann Auswertung. Freiwillig, hilft aber sehr beim Behalten.</p><button class="btn" data-act="u-talk">Gespräch starten</button>`)}
 ${step(5,u.status==='done','Abschluss-Check',`<p class="hint">${u.score!=null?`Letztes Ergebnis: ${Math.round(u.score*100)} %. `:''}10 Fragen zu Grammatik und Wörtern. Ab 80 % ist die nächste Etappe frei.</p><button class="btn ${vocDone&&u.drillOk&&u.status!=='done'?'primary':''}" data-act="u-check">Check starten</button>`)}
 </ol>`;
 const next=c.units.find(x=>x.n===u.n+1);
 if(u.status==='done')h+=next?`<button class="btn primary wide" data-act="unit" data-id="${c.id}" data-uid="${next.id}">Weiter zu Etappe ${next.n}: ${esc(next.title)}</button>`:`<button class="btn primary wide" data-act="course" data-id="${c.id}">Zum Lernpfad</button>`;
 app.innerHTML=h}
function unitCheckPrompt(){const c=getCourse(view.uref.id),u=unitOf(c,view.uref.uid),TL=langName(c.lang);
 if(u.kind==='exam'){const us=c.units.filter(x=>x.lvl===u.lvl&&x.kind!=='exam');
  const words=shuffle(us.flatMap(x=>(getSet(x.setId)||{cards:[]}).cards.map(k=>k.t+' = '+k.d))).slice(0,40);
  return `Erstelle einen Stufentest für das Niveau ${u.lvl} in ${TL}.
Genau 12 Multiple-Choice-Fragen: 6 zur Grammatik aus diesen Themen: ${us.map(x=>x.grammar).join('; ')}. Und 6 zum Wortschatz${words.length?` aus diesen Wörtern: ${words.join('; ')}`:` der Wortfelder: ${us.map(x=>x.field).join('; ')}`}.
Grammatikfragen: ein Satz auf ${TL} mit Lücke ___ und 4 Möglichkeiten. Wortschatzfragen: Bedeutung oder passendes Wort im Satz.
Jede Frage hat genau eine eindeutig richtige Antwort. „thema“ ist ein kurzer deutscher Name des geprüften Themas.
Antworte nur mit einem JSON-Array: [{"lvl":"${u.lvl}","art":"grammatik oder wortschatz","thema":"…","q":"…","opts":["…","…","…","…"],"a":0}]`}
 const s=getSet(u.setId);
 return `Erstelle einen Abschluss-Check für die Etappe „${u.title}“ eines ${TL}-Kurses (Niveau ${u.lvl}).
Genau 10 Multiple-Choice-Fragen: 5 zur Grammatik „${u.grammar}“ (ein Satz auf ${TL} mit einer Lücke ___ und 4 Möglichkeiten) und 5 zu diesen Wörtern (Bedeutung oder passendes Wort im Satz): ${s?s.cards.map(k=>k.t+' = '+k.d).join('; '):u.field}.
Jede Frage hat genau eine eindeutig richtige Antwort. „thema“ ist ein kurzer deutscher Name des geprüften Themas.
Antworte nur mit einem JSON-Array: [{"lvl":"${u.lvl}","art":"grammatik oder wortschatz","thema":"…","q":"…","opts":["…","…","…","…"],"a":0}]`}
function unitCheckFinish(){const K=view.K,c=getCourse(view.uref.id),u=unitOf(c,view.uref.uid),exam=u&&u.kind==='exam';
 const right=K.qs.filter((q,i)=>K.ans[i]===q.a).length;K.right=right;K.pct=right/K.qs.length;
 const seen=new Set();const wrong=K.qs.filter((x,i)=>K.ans[i]!==x.a&&x.thema&&x.art==='g').filter(x=>{const k=wkey(x.thema);if(seen.has(k))return false;seen.add(k);return true}).slice(0,exam?3:2);
 if(wrong.length&&K.pct<.9)addWeak(view.lang,wrong.map(x=>({thema:x.thema,art:'grammatik',beispiel:x.q.replace(/_{2,}/,x.opts[x.a])})));
 K.passed=K.pct>=(exam?.75:.8);
 const idx=u?LEVELS.indexOf(u.lvl):-1,pc=cat=>{const q=K.qs.filter(x=>x.art===cat);return q.length?q.filter(x=>K.ans[K.qs.indexOf(x)]===x.a).length/q.length:K.pct};
 if(exam&&K.passed){addPoint(view.lang,Math.min(idx+.99,idx+pc('g')),Math.min(idx+.99,idx+pc('v')),'test');adoptLevel(view.lang)}
 // Bestandener Etappen-Check = kleiner Messpunkt: so weit bist du innerhalb der Stufe gekommen
 else if(!exam&&K.passed&&idx>=0&&c){const same=c.units.filter(x=>x.kind!=='exam'&&x.lvl===u.lvl),pos=same.indexOf(u),fr=Math.min(.9,(pos+1)/(same.length+1));
  addPoint(view.lang,idx+fr*pc('g'),idx+fr*pc('v'),'unit')}
 if(u){u.score=K.pct;if(K.passed&&u.status!=='done'){u.status='done';u.doneAt=now();const nx=c.units.find(x=>x.n===u.n+1);if(nx&&nx.status==='locked')nx.status='open';K.unlocked=nx||null}c.upd=now()}
 logAnswer(K.qs.length);db.fresh=false;save();K.stage='done';if(c)maybeExtend(c)}

/* ---------- Törn-Karte und Logbuch ---------- */
function smoothPath(pts){if(pts.length<2)return '';let d=`M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
 for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
  d+=` C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)},${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)},${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`}return d}
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,Math.max(1,n-1)).trimEnd()+'…':s};
function lighthouse(x,y){return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><path d="M-5 11 L-3.2 -7 H3.2 L5 11Z" fill="#fff" stroke="#2b3a44" stroke-width="1.5" stroke-linejoin="round"/><path d="M-4.4 5 H4.4 L4.8 8.5 H-4.8Z M-3.6 -2 H3.6 L3.9 1.5 H-3.9Z" fill="#c8372d"/><rect x="-3.6" y="-12.5" width="7.2" height="5.5" fill="#f2c14e" stroke="#2b3a44" stroke-width="1.3"/><path d="M-5 -12.5 L0 -17 L5 -12.5Z" fill="#2b3a44"/></g>`}
function mapSVG(c){const W=360,gap=84,cx=W/2,amp=100;let y=18,cur=null,band=null,last=0;const nodes=[],bands=[];
 c.units.forEach((u,i)=>{if(u.lvl!==cur){if(band){band.y1=last+46;y=band.y1+14}band={L:u.lvl,y0:y,us:[]};bands.push(band);y+=126;cur=u.lvl}
  const x=cx+amp*Math.sin(i*.82);nodes.push({u,x,y});band.us.push(u);last=y;y+=gap});
 if(band)band.y1=last+46;const H=(band?band.y1:40)+14;
 let seed=c.id.split('').reduce((a,ch)=>a*31+ch.charCodeAt(0)>>>0,7);const rnd=()=>(seed=(seed*1103515245+12345)>>>0)/4294967296;
 const curI=nodes.findIndex(n=>n.u.status==='open'),shipI=curI>=0?curI:nodes.length-1;
 let h=`<svg class="seachart" viewBox="0 0 ${W} ${H}" width="100%" role="group" aria-label="Seekarte ${esc(c.title)}">`;
 bands.forEach((b,bi)=>{const done=b.us.filter(u=>u.status==='done').length,state=done===b.us.length?'done':b.us.some(u=>u.status==='open')?'cur':'later';
  h+=`<rect x="6" y="${b.y0}" width="${W-12}" height="${b.y1-b.y0}" rx="18" fill="${bi%2?'var(--sea2)':'var(--sea)'}"/>`;
  for(let k=0;k<7;k++){const wx=20+rnd()*(W-60),wy=b.y0+70+rnd()*Math.max(10,b.y1-b.y0-90);h+=`<path d="M${wx.toFixed(0)} ${wy.toFixed(0)} q5 -4 10 0 t10 0" fill="none" stroke="var(--wave)" stroke-width="1.6" stroke-linecap="round"/>`}
  const isl=bi%2?W-30:30,iy=b.y0+(b.y1-b.y0)*.55;h+=`<ellipse cx="${isl}" cy="${iy.toFixed(0)}" rx="26" ry="15" fill="var(--sand)"/><ellipse cx="${isl+(bi%2?4:-4)}" cy="${(iy-4).toFixed(0)}" rx="15" ry="9" fill="var(--land)"/>`;
  h+=`<rect x="16" y="${b.y0+12}" width="${W-32}" height="36" rx="10" fill="var(--surface)" opacity=".92"/>
  <text class="mlv" x="28" y="${b.y0+35}">${b.L} · ${LVNAME[b.L]}</text><text class="mtx" x="${W-28}" y="${b.y0+35}" text-anchor="end">${state==='done'?'✓ geschafft':`${done} / ${b.us.length}`}</text>`});
 const pts=nodes.map(n=>[n.x,n.y]);const sp=Math.max(0,shipI);
 h+=`<path d="${smoothPath(pts)}" fill="none" stroke="var(--route)" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round" opacity=".7"/>`;
 if(sp>0)h+=`<path d="${smoothPath(pts.slice(0,sp+1))}" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>`;
 nodes.forEach((n,i)=>{const u=n.u,st=u.status,exam=u.kind==='exam',right=n.x<=cx;const lx=right?n.x+28:n.x-28,avail=right?W-14-lx:lx-14,chars=Math.max(6,Math.floor(avail/7.4));
  const act=st!=='locked'?` data-act="unit" data-id="${c.id}" data-uid="${u.id}" role="button" tabindex="0"`:'';
  const label=exam?`Stufentest ${u.lvl}`:`Etappe ${u.n}: ${u.title}`;
  h+=`<g class="hb ${st}${exam?' exam':''}"${act} ${i===curI?'id="cur-node"':''} aria-label="${esc(label)}${st==='locked'?', noch gesperrt':st==='done'?', geschafft':', hier geht es weiter'}">`;
  if(st==='open')h+=`<circle class="pulse" cx="${n.x.toFixed(1)}" cy="${n.y}" r="25" fill="none" stroke="var(--accent)" stroke-width="2"/>`;
  h+=`<circle cx="${n.x.toFixed(1)}" cy="${n.y}" r="${st==='open'?20:st==='done'?18:16}" fill="${st==='done'?'var(--good)':st==='open'?(exam?'var(--signal)':'var(--accent)'):'var(--surface)'}" stroke="${st==='locked'?'var(--line)':'var(--surface)'}" stroke-width="${st==='locked'?2:3}"/>`;
  if(exam)h+=lighthouse(n.x,n.y);
  else h+=st==='done'?`<path d="M${(n.x-6).toFixed(1)} ${n.y} l4 4.5 l8 -9" fill="none" stroke="var(--accent-ink)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
   :`<text x="${n.x.toFixed(1)}" y="${n.y+5}" text-anchor="middle" class="mnum" style="fill:${st==='open'?'var(--accent-ink)':'var(--muted)'}">${u.n}</text>`;
  h+=`<text class="mt ${st}" x="${lx.toFixed(1)}" y="${n.y-2}" text-anchor="${right?'start':'end'}">${esc(cut(exam?`Stufentest ${u.lvl}`:u.title,chars))}</text>
  <text class="ms" x="${lx.toFixed(1)}" y="${n.y+14}" text-anchor="${right?'start':'end'}">${esc(cut(exam?'Leuchtturm: Niveau abschließen':u.grammar,chars+2))}</text></g>`});
 if(nodes.length&&curI>=0&&!slainToday()&&c.lang===activeLang()){const n=nodes[curI],nx=nodes[curI+1],mx=nx?(n.x+nx.x)/2:n.x,my=nx?(n.y+nx.y)/2:n.y+60,ref=nx||n,side=ref.x<=cx?-1:1,mon=monsterNext();
  const px=side>0?Math.min(W-74,mx+30):Math.max(4,mx-104);h+=`<g class="lurk" data-act="watch" role="button" tabindex="0" aria-label="${esc(mon.name)} lauert. Wache starten"><g transform="translate(${px.toFixed(1)},${(my-30).toFixed(1)})"><g class="bob">${monsterSVG(mon.id,70).replace('<svg ','<svg x="0" y="0" ')}<text x="35" y="64" text-anchor="middle" class="ms" style="fill:var(--ink);font-weight:800">${esc(mon.name)}</text></g></g></g>`}
 if(nodes.length){const n=nodes[sp];const sx=n.x-25,sy=n.y-(n.u.status==='open'?20:18)-40;
  h+=`<g class="ship" transform="translate(${sx.toFixed(1)},${sy.toFixed(1)})"><g class="bob">${shipSVG(50).replace('<svg ','<svg x="0" y="0" ')}</g></g>`}
 return h+'</svg>'}
function hookMap(){const n=document.getElementById('cur-node');if(n&&n.scrollIntoView&&!view.scrolled){view.scrolled=true;try{n.scrollIntoView({block:'center'})}catch(e){}}}
function startLog(cid){go('logbook',{id:cid})}
function vLogbook(){const c=getCourse(view.id);if(!c)return go('home');
 const done=c.units.filter(u=>u.status==='done'),since=now()-30*DAY,recent=done.filter(u=>u.doneAt&&u.doneAt>=since);
 const before=done.filter(u=>!u.doneAt||u.doneAt<since).sort((a,b)=>b.n-a.n)[0],latest=done.slice().sort((a,b)=>(b.doneAt||0)-(a.doneAt||0)||b.n-a.n)[0];
 const words=db.sets.filter(s=>s.course===c.id).reduce((n,s)=>n+s.cards.filter(k=>k.lv>=1).length,0);
 let h=bar('course',c.title)+`<section class="set-head"><span class="label">Logbuch · ${esc(c.title)}</span><h1>Das kannst du jetzt</h1></section>
 <section class="today"><div class="row-between">${gullSVG(recent.length?'happy':'idle',56)}<p style="flex:1;min-width:0">${recent.length?`In den letzten 30 Tagen hast du <b>${recent.length} ${recent.length===1?'Hafen':'Häfen'}</b> angelaufen.${before?` Vor einem Monat warst du bei „${esc(before.title)}“, heute bei „${esc(latest.title)}“.`:''}`:`Noch keine Einträge aus den letzten 30 Tagen. Der nächste Hafen wartet schon.`}</p></div>
 <div class="lv-stats"><div class="lv-stat"><b>${done.filter(u=>u.kind!=='exam').length}</b><span>Etappen</span></div><div class="lv-stat"><b>${words}</b><span>Wörter sitzen</span></div><div class="lv-stat"><b>${done.filter(u=>u.kind==='exam').length}</b><span>Stufen</span></div></div></section>`;
 if(!done.length)h+=`<p class="note">Sobald du die erste Etappe abschließt, steht hier, was du damit kannst.</p>`;
 const lv=[...new Set(done.map(u=>u.lvl))];
 lv.forEach(L=>{h+=`<section class="stack"><h2>${L} · ${LVNAME[L]}</h2><ol class="log">${done.filter(u=>u.lvl===L).sort((a,b)=>a.n-b.n).map(u=>`<li class="${u.kind==='exam'?'exam':''}"><span class="hint">${u.doneAt?new Date(u.doneAt).toLocaleDateString('de-DE'):'früher'} · ${u.kind==='exam'?'Stufentest':'Etappe '+u.n}</span><b>${u.kind==='exam'?`${u.lvl} geschafft${u.score!=null?` mit ${Math.round(u.score*100)} %`:''}`:esc(u.kann||u.title)}</b>${u.kind!=='exam'?`<span class="hint">${esc(u.title)} · ${esc(u.grammar)}</span>`:''}</li>`).join('')}</ol></section>`});
 app.innerHTML=h}
