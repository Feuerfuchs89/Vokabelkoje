// Vokabelkoje – sicherung
/* ---------- Sicherung und Abgleich ---------- */
function vBackup(){
 const counts=`${db.sets.length} Sets mit ${db.sets.reduce((n,s)=>n+s.cards.length,0)} Karten`;
 app.innerHTML=bar('home','Einstellungen')+`<div class="form"><h1>Einstellungen</h1>
 ${mePanel()}
 ${aiPanel()}
 <section class="panel"><h2>Sicherungsdatei</h2>
  <p>Speichert alle ${counts} inklusive Lernstand in einer Datei. Beim Laden wird sie mit dem Stand hier zusammengeführt, es geht nichts verloren.</p>
  <div class="btn-row"><button class="btn primary" data-act="bk-save">Sicherung speichern</button><button class="btn" data-act="bk-load">Sicherung laden</button></div>
  ${view.dump?`<p class="hint">Speichern als Datei ging hier nicht. Kopiere den Text und bewahre ihn auf. Zum Laden kannst du ihn als .json-Datei speichern.</p><textarea class="export" id="dump" readonly>${esc(view.dump)}</textarea>`:''}
 </section>
 ${STANDALONE?syncPanel():`<p class="note">Automatischer Abgleich zwischen Handy und PC geht in der GitHub-Version der App. Dort meldest du dich einmal mit einem GitHub-Schlüssel an.</p>`}
 <section class="panel"><h2>Aussehen</h2><div class="seg" role="radiogroup" aria-label="Farbmodus">${[['auto','Automatisch'],['light','Hell'],['dark','Dunkel']].map(([v,n])=>{const on=(prefs.theme||'auto')===v;return `<button class="seg-btn ${on?'on':''}" role="radio" aria-checked="${on}" data-act="theme-set" data-v="${v}">${n}</button>`}).join('')}</div><p class="hint">„Automatisch“ folgt der Einstellung deines Geräts. Schnell umschalten geht auch oben mit Sonne und Mond.</p></section>
 <section class="panel"><h2>Tagesziel</h2><label class="fld"><span>Antworten pro Tag</span><select id="goal">${[10,20,30,50,80].map(g=>`<option value="${g}" ${g===goalVal()?'selected':''}>${g}</option>`).join('')}</select></label></section>
 </div>`;
 if(view.dump){const t=$('#dump');t.focus();t.select()}
}
function mePanel(){const me=db.me||{};return `<section class="panel"><div class="row-between"><h2>Deine Möwe</h2>${gullSVG('idle',48)}</div>
 <form class="stack" id="me-form" autocomplete="off"><div class="two"><label class="fld"><span>Name der Möwe</span><input id="me-gull" maxlength="20" value="${esc(me.gull||'')}" placeholder="z. B. Fiete"></label><label class="fld"><span>So nennt sie dich</span><input id="me-name" maxlength="24" value="${esc(me.name||'')}" placeholder="freiwillig"></label></div><button class="btn">Speichern</button></form></section>
 ${STANDALONE?`<section class="panel"><h2>Tägliche Erinnerung</h2><p>Die App erstellt einen täglichen Kalendertermin „Eine Wache mit ${esc(gullName())}“. Öffne die Datei auf deinem Handy, dann übernimmt dein Kalender die Erinnerung.</p>
 <div class="write"><input type="time" id="rem-time" value="${esc(prefs.remTime||'19:00')}" aria-label="Uhrzeit"><button class="btn primary" data-act="ics">Erinnerung erstellen</button></div></section>`:''}`}
function nameGull(n){n=String(n||'').trim().slice(0,20);if(!n)return;const y=$('#gull-you');const yn=y&&typeof y.value==='string'&&y.value.trim()?y.value.trim().slice(0,24):(db.me&&db.me.name)||'';db.me={...(db.me||{}),gull:n,name:yn,upd:now()};const cp=curProf();if(cp&&yn&&!cp.name){cp.name=yn;cp.upd=now();saveProfs()}save();render();toast(`${n} ist an Bord!`)}
function aiPanel(){
 if(!STANDALONE)return `<section class="panel"><h2>KI-Funktionen</h2><p>Karten erzeugen, Text lesen und Gespräch üben laufen hier über Claude. Du musst nichts einrichten. Beim ersten Mal fragt Claude, ob die App die KI nutzen darf.</p><p class="hint">In der GitHub-Version nutzt die App stattdessen Gemini von Google.</p></section>`;
 if(prefs.gemKey)return `<section class="panel"><h2>KI (Gemini)</h2><p><span class="ok-text">Eingerichtet.</span> Gilt für Karten erzeugen, Text lesen und Gespräch üben.</p>
  <label class="fld"><span>Modell (leer lassen für automatisch)</span><input id="gem-model" data-pref="gemModel" value="${esc(prefs.gemModel)}" placeholder="${GEM_MODELS[0]}" autocapitalize="off" spellcheck="false"></label>
  <div class="btn-row"><button class="btn" data-act="gem-test">Verbindung testen</button><button class="btn danger" data-act="gem-off">Schlüssel entfernen</button></div>
  <p class="hint">Kostenlose Stufe mit Tageslimit. Google darf Eingaben aus der kostenlosen Stufe zur Verbesserung seiner Dienste nutzen. Gib also nichts Privates ein.</p></section>`;
 return `<section class="panel" id="gem-setup"><h2>KI (Gemini) einrichten</h2><p>Für Karten erzeugen, Text lesen und Gespräch üben. Kostenlos, du brauchst nur ein Google-Konto.</p>
  <ol><li>Öffne <a href="https://aistudio.google.com/" target="_blank" rel="noopener">aistudio.google.com</a> und melde dich mit deinem Google-Konto an.</li><li>Tippe auf „Get API key“ und dann auf „Create API key“.</li><li>Kopiere den Schlüssel und füg ihn hier ein. Das machst du auf jedem Gerät einmal.</li></ol>
  <form class="write" id="gem-form" autocomplete="off"><input id="gem-key" type="password" placeholder="AIza…" aria-label="Gemini-Schlüssel" autocapitalize="off" spellcheck="false"><button class="btn primary">Speichern</button></form>
  <p class="hint">Der Schlüssel bleibt nur in diesem Browser. In der kostenlosen Stufe darf Google deine Eingaben zur Verbesserung seiner Dienste nutzen. Gib also nichts Privates ein.</p></section>`}
function syncPanel(){
 if(prefs.ghToken)return `<section class="panel"><h2>Abgleich über GitHub</h2>
  <p>${prefs.syncErr?`<span class="bad-text">Letzter Versuch fehlgeschlagen: ${esc(prefs.syncErr)}</span>`:`<span class="ok-text">Verbunden.</span> Zuletzt abgeglichen: ${prefs.lastSync?ago(prefs.lastSync):'noch nie'}.`}</p>
  <p class="hint">Deine Sets liegen in einem geheimen Gist namens „vokabelkoje.json“ in deinem GitHub-Konto. Jede Änderung wird nach ein paar Sekunden hochgeladen, beim Öffnen holt die App den neuesten Stand.</p>
  <div class="btn-row"><button class="btn primary" data-act="sync-now">Jetzt abgleichen</button><button class="btn danger" data-act="sync-off">Abgleich trennen</button></div></section>`;
 return `<section class="panel"><h2>Abgleich über GitHub</h2>
  <p>Damit hast du auf Handy und PC denselben Stand. Einmal pro Gerät einrichten:</p>
  <ol><li>Auf github.com: Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic).</li>
  <li>Name z. B. „Vokabelkoje“, Ablauf nach Wunsch, <b>nur den Haken bei „gist“</b> setzen.</li>
  <li>Token erzeugen, kopieren und hier einfügen. Auf jedem Gerät denselben Token verwenden.</li></ol>
  <form class="write" id="gh-form" autocomplete="off"><input id="gh-token" type="password" placeholder="ghp_…" aria-label="GitHub-Token"><button class="btn primary">Verbinden</button></form>
  <p class="hint">Der Token wird nur in diesem Browser gespeichert und darf ausschließlich Gists lesen und schreiben.</p></section>`;
}
function allProfilesPayload(){const out={v:3,profiles:profs.list,data:{}};profs.list.filter(p=>!p.deleted).forEach(p=>{if(p.id===profs.active)out.data[p.id]=payload();else{try{const r=localStorage.getItem(dataKey(p.id));if(r)out.data[p.id]=JSON.parse(r)}catch(e){}}});return out}
async function saveBackup(){prefs.lastBackup=now();savePrefs();
 const data=JSON.stringify(allProfilesPayload());const name=`vokabelkoje-sicherung-${dayKey()}.json`;
 if(!STANDALONE){let dl=null;try{dl=window.claude&&await window.claude.use('downloads')}catch(e){}
  if(dl){try{await dl.save({filename:name,data});toast('Sicherung gespeichert')}catch(e){if(e&&e.code==='declined')return;view.dump=data;render()}return}
  view.dump=data;render();return}
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();
 setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);toast('Sicherung gespeichert')}
function applyMerged(remote){const m=merge(db,migrate(remote));db.sets=m.sets;db.deleted=m.deleted;db.log=m.log;db.logD=m.logD;db.focus=m.focus;db.prof=m.prof;db.courses=m.courses;db.me=m.me;db.watch=m.watch;db.slain=m.slain;db.kid=m.kid}
$('#file-in').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 try{const d=JSON.parse(await f.text());
  if(d&&d.profiles&&d.data){mergeProfs(d.profiles);Object.entries(d.data).forEach(([id,pd])=>{if(!pd||!Array.isArray(pd.sets))return;
    if(id===profs.active){if(db.fresh)db=migrate({...pd,fresh:false});else applyMerged(pd);db.fresh=false;save()}
    else{const loc=load(id);const m=loc?merge(loc,migrate(pd)):null;const out=loc?{...loc,...m}:migrate(pd);try{localStorage.setItem(dataKey(id),JSON.stringify(out))}catch(e){}}});
   render();toast(`Sicherung geladen: ${Object.keys(d.data).length} ${Object.keys(d.data).length===1?'Profil':'Profile'}`);return}
  if(!d||!Array.isArray(d.sets))throw 0;
  if(db.fresh){db=migrate({...d,fresh:false})}else applyMerged(d);db.fresh=false;save();render();toast(`Sicherung geladen: ${db.sets.length} Sets`)}
 catch(err){toast('Diese Datei ist keine Vokabelkoje-Sicherung')}});

$('#cam-in').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(f&&view.name==='listen')photoWhat(f)});
$('#img-in').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f||view.name!=='edit')return;
 view.draft.aiImg=await shrink(f);view.draft.aiOpen=true;render();toast('Foto ausgewählt. Tippe auf „Karten erzeugen“.')});
const PROG=['m','lv','due','star','u'];
function mergeSet(x,y){const [n,o]=(x.upd||0)>=(y.upd||0)?[x,y]:[y,x];const om=new Map(o.cards.map(c=>[c.id,c]));
 const cards=n.cards.map(c=>{const d=om.get(c.id);if(d&&(d.u||0)>(c.u||0)){const r={...c};PROG.forEach(k=>r[k]=d[k]);return r}return c});
 const bests=[x.best,y.best].filter(Boolean);return {...n,cards,best:bests.length?Math.min(...bests):null}}
function merge(a,b){const deleted={...(b.deleted||{})};Object.entries(a.deleted||{}).forEach(([k,v])=>deleted[k]=Math.max(v,deleted[k]||0));
 const m=new Map();[...(a.sets||[]),...(b.sets||[])].forEach(s=>m.set(s.id,m.has(s.id)?mergeSet(m.get(s.id),s):s));
 const sets=[...m.values()].filter(s=>!(deleted[s.id]>=(s.upd||0)));
 const logD={},cut=dayKey(Date.now()-90*864e5);
 [a.logD||{},b.logD||{}].forEach(L=>Object.entries(L).forEach(([k,devs])=>{if(k<cut)return;const o=logD[k]||(logD[k]={});Object.entries(devs||{}).forEach(([d,n])=>o[d]=Math.max(n||0,o[d]||0))}));
 const log={...(b.log||{})};Object.entries(a.log||{}).forEach(([k,v])=>log[k]=Math.max(v,log[k]||0));
 Object.entries(logD).forEach(([k,devs])=>{const sum=Object.values(devs).reduce((x,y)=>x+y,0);log[k]=Math.max(log[k]||0,sum)});
 const cm=new Map();[...(a.courses||[]),...(b.courses||[])].forEach(c=>{const o=cm.get(c.id);cm.set(c.id,o?mergeCourse(o,c):c)});
 const courses=[...cm.values()].filter(c=>!(deleted[c.id]>=(c.upd||0)));
 const ma=a.me||{},mb=b.me||{};
 return {sets,deleted,log,logD,focus:(()=>{const f={...(b.focus||{})};Object.entries(a.focus||{}).forEach(([l,x])=>{const o=f[l];f[l]=!o||x.day>o.day||x.day===o.day&&(x.rounds||0)>=(o.rounds||0)?x:o});return f})(),prof:mergeProf(a.prof,b.prof),courses,me:(ma.upd||0)>=(mb.upd||0)?{gull:'',name:'',upd:0,...ma}:{gull:'',name:'',upd:0,...mb},watch:{...(b.watch||{}),...(a.watch||{})},kid:(()=>{const c={...((b.kid||{}).c||{})};Object.entries((a.kid||{}).c||{}).forEach(([k,v])=>c[k]=Math.max(v,c[k]||0));return {c}})(),slain:(()=>{const mm=new Map();[...(a.slain||[]),...(b.slain||[])].forEach(x=>mm.set(x.t+'|'+x.m,x));return [...mm.values()].sort((x,y)=>x.t-y.t)})()}}
// Lernpfade feldweise zusammenführen: Was auf einem Gerät geschafft wurde, bleibt geschafft
const U_RANK={locked:0,open:1,done:2};
function mergeUnit(x,y){const n=(y.upd||0)>(x.upd||0)?{...x,...y}:{...y,...x};
 n.status=(U_RANK[x.status]||0)>=(U_RANK[y.status]||0)?x.status:y.status;
 ['lessonRead','talked','drillOk','checkOk'].forEach(f=>{if(x[f]||y[f])n[f]=true});
 if(x.score!=null||y.score!=null)n.score=Math.max(x.score||0,y.score||0);
 const da=[x.doneAt,y.doneAt].filter(Boolean);if(da.length)n.doneAt=Math.min(...da);
 n.lesson=x.lesson||y.lesson;n.setId=x.setId||y.setId;return n}
function mergeCourse(a,b){if(a===b)return a;const ua=a.units||[],ub=b.units||[];
 const base=ua.length!==ub.length?(ua.length>ub.length?a:b):((a.upd||0)>=(b.upd||0)?a:b),other=base===a?b:a;
 const om=new Map((other.units||[]).map(u=>[u.id,u]));
 const units=(base.units||[]).map(u=>om.has(u.id)?mergeUnit(u,om.get(u.id)):u);const have=new Set(units.map(u=>u.id));
 (other.units||[]).forEach(u=>{if(!have.has(u.id))units.push(u)});
 const top=(a.upd||0)>=(b.upd||0)?a:b;return {...top,units,upd:Math.max(a.upd||0,b.upd||0)}}
function mergeProf(a={},b={}){const out={};
 new Set([...Object.keys(a||{}),...Object.keys(b||{})]).forEach(l=>{const A=(a||{})[l]||{pts:[],weak:{}},B=(b||{})[l]||{pts:[],weak:{}};
  const m=new Map();[...(A.pts||[]),...(B.pts||[])].forEach(p=>m.set(p.t+'|'+p.src,p));
  const weak={...(B.weak||{})};Object.entries(A.weak||{}).forEach(([k,w])=>{const o=weak[k];
   weak[k]=!o?w:{...((w.last||0)>=(o.last||0)?w:o),n:Math.max(w.n||0,o.n||0),ok:Math.max(w.ok||0,o.ok||0),tries:Math.max(w.tries||0,o.tries||0),tried:Math.max(w.tried||0,o.tried||0)}});
  const gfix={...(B.gfix||{})};Object.entries(A.gfix||{}).forEach(([k,g])=>{const o=gfix[k];gfix[k]=!o?g:{...g,n:Math.max(g.n||0,o.n||0)}});
  out[l]={pts:[...m.values()].sort((x,y)=>x.t-y.t).slice(-200),weak,gfix}});
 return out}

/* GitHub-Gist */
const FILE='vokabelkoje.json',PFILE='vokabelkoje-profile.json';
const syncFile=()=>profs.active==='main'?FILE:`vokabelkoje-${profs.active}.json`;
function mergeProfs(list){(list||[]).forEach(r=>{const l=profs.list.find(x=>x.id===r.id);if(!l)profs.list.push(r);else if((r.upd||0)>(l.upd||0))Object.assign(l,r)});if(!curProf())profs.active=profs.list.find(p=>!p.deleted).id;saveProfs()}
async function gh(path,opt={}){const r=await fetch('https://api.github.com'+path,{...opt,headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+prefs.ghToken,...(opt.body?{'Content-Type':'application/json'}:{})}});
 if(r.status===401)throw new Error('Token ungültig oder abgelaufen');if(r.status===403||r.status===404)throw new Error('Token hat keine Gist-Berechtigung');if(!r.ok)throw new Error('GitHub antwortet nicht ('+r.status+')');return r.json()}
async function findGist(){if(prefs.gistId)return prefs.gistId;
 for(let page=1;page<=5;page++){const list=await gh(`/gists?per_page=100&page=${page}`);const g=list.find(g=>g.files&&(g.files[FILE]||g.files[PFILE]));if(g){prefs.gistId=g.id;savePrefs();return g.id}if(list.length<100)break}
 const g=await gh('/gists',{method:'POST',body:JSON.stringify({description:'Vokabelkoje – Daten',public:false,files:{[syncFile()]:{content:JSON.stringify(payload())},[PFILE]:{content:JSON.stringify(profs.list)}}})});prefs.gistId=g.id;savePrefs();return g.id}
// Hintergrund-Abgleich darf keine halb ausgefüllten Felder oder den geführten Start überschreiben
function busyTyping(){if(view.name==='home'&&!(db.me&&db.me.onb))return true;const a=document.activeElement;return !!(a&&app.contains(a)&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))}
let syncing=false,syncAgain=false;
async function sync(){if(!canSync()||learnOffline())return;if(syncing){syncAgain=true;return}syncing=true;clearTimeout(syncTimer);
 try{const id=await findGist();let g;try{g=await gh('/gists/'+id)}catch(e){if(/Gist-Berechtigung/.test(e.message)){prefs.gistId='';savePrefs()}throw e}
  const pf=g.files&&g.files[PFILE];if(pf){try{mergeProfs(JSON.parse(pf.truncated?await (await fetch(pf.raw_url)).text():pf.content))}catch(e){}}
  const f=g.files&&g.files[syncFile()];
  if(f){const txt=f.truncated?await (await fetch(f.raw_url)).text():f.content;let remote=null;try{remote=JSON.parse(txt)}catch(e){}
   if(remote&&Array.isArray(remote.sets)){if(db.fresh&&remote.sets.length){db=migrate({...remote,fresh:false})}else applyMerged(remote);save(true)}}
  dirty=false;
  await gh('/gists/'+id,{method:'PATCH',body:JSON.stringify({files:{[syncFile()]:{content:JSON.stringify(payload())},[PFILE]:{content:JSON.stringify(profs.list)}}})});
  prefs.lastSync=now();prefs.syncErr='';savePrefs();
  if(['home','set','backup'].includes(view.name)&&!view.confirm&&!busyTyping())render();
 }catch(e){prefs.syncErr=e.message||'Keine Verbindung';savePrefs();if(['home','backup'].includes(view.name)&&!busyTyping())render()}
 finally{syncing=false;if(syncAgain){syncAgain=false;setTimeout(sync,1500)}}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&dirty&&canSync())sync();else if(document.visibilityState==='visible'&&canSync()&&now()-prefs.lastSync>6e4)sync()});
