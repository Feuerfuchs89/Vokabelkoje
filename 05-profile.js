// Vokabelkoje – profile
/* ---------- Profile und aktive Sprache ---------- */
const PCOL=['#1f63a8','#c4562a','#2b8455','#8a4fb8','#c23a6b','#7a6a1f'];
function curProf(){return profs.list.find(p=>p.id===profs.active&&!p.deleted)||profs.list.find(p=>!p.deleted)}
const aiOK=()=>{const p=curProf();return !p||p.ai!==false};
const avatar=(p,big)=>p&&p.av?`<span class="avatar img${big?' big':''}" style="background:${PCOL[(p&&p.color)||0]}" aria-hidden="true">${avatarSVG(p.av,big?44:30,PCOL[(p&&p.color)||0])}</span>`:`<span class="avatar${big?' big':''}" style="background:${PCOL[(p&&p.color)||0]}" aria-hidden="true">${esc(((p&&p.name)||'?').trim().charAt(0).toUpperCase()||'?')}</span>`;
function switchProfile(id){if(id===profs.active)return go('home');save(true);profs.active=id;saveProfs();
 const p=curProf();db=load(id)||migrate({sets:[],fresh:true});if(!db.me.name&&p&&p.name)db.me.name=p.name;starOnly={};go('home');if(canSync())setTimeout(sync,300)}
function vProfiles(){const P=view.P||(view.P={});const cur=curProf();
 let h=bar('home','Profile')+`<div class="form"><h1>Lernprofile</h1><p class="muted">Jedes Profil hat eigene Sprachen, Lernpfade, Möwe, Serie und Fortschritt. Praktisch, wenn mehrere in der Familie lernen.</p>
 <div class="stack">${profs.list.filter(p=>!p.deleted).map(p=>`<div class="prof-row ${p.id===cur.id?'on':''}">${avatar(p,true)}<div class="u-body"><b>${esc(p.name||'Ohne Namen')}</b><span class="hint">${p.id===cur.id?'Aktiv · ':''}${p.kid?'Kindermodus · ':''}KI ${p.ai===false?'aus':'an'}</span></div>
  ${p.id===cur.id?`<button class="btn sm" data-act="prof-edit" data-id="${p.id}">Bearbeiten</button>`:`<button class="btn sm primary" data-act="prof-go" data-id="${p.id}">Wechseln</button>`}</div>`).join('')}</div>`;
 const ed=P.edit?profs.list.find(p=>p.id===P.edit):null;
 if(P.adding||ed){const p0=ed||{name:'',color:profs.list.length%PCOL.length,ai:true};const p={...p0,...(P.draft||{})};if(P.av===undefined)P.av=ed?(ed.av||null):randomAvatar();
  const avSame=x=>P.av&&['skin','hair','hc','beard','head','shirt','mouth','acc'].every(k=>(P.av[k]||'')===(x[k]||''))&&!!P.av.kid===!!x.kid;
  h+=`<form class="panel" id="prof-form" autocomplete="off"><h2>${ed?'Profil bearbeiten':'Neues Profil'}</h2>
  <label class="fld"><span>Name</span><input id="pf-name" maxlength="24" value="${esc(p.name)}" placeholder="z. B. Lena"></label>
  <div class="fld"><span>Profilbild</span><div class="av-pick"><span class="av-preview">${P.av?avatarSVG(P.av,76,PCOL[+p.color||0]):avatar({...p,av:null},true)}</span><div class="stack" style="gap:6px"><button type="button" class="btn sm" data-act="av-dice">Würfeln</button><button type="button" class="linkbtn" data-act="av-none">Nur Anfangsbuchstabe</button></div></div>
  <div class="av-grid" role="group" aria-label="Wikinger-Vorschläge">${AV_PRESETS.map((x,i)=>`<button type="button" class="av-opt ${avSame(x)?'on':''}" data-act="av-preset" data-i="${i}" aria-pressed="${avSame(x)}">${avatarSVG(x,54)}<span lang="de">${x.n.replace(/^Wikinger/,'Wikinger&shy;')}</span></button>`).join('')}</div></div>
  <div class="fld"><span>Farbe</span><div class="chips">${PCOL.map((c,i)=>`<label class="swatch"><input type="radio" name="pf-col" value="${i}" ${(+p.color||0)===i?'checked':''}><span style="background:${c}"></span></label>`).join('')}</div></div>
  <label class="check"><input type="checkbox" id="pf-kid" ${p.kid?'checked':''}> Kindermodus: Spielen mit Bildern und Ton, ohne Lesen</label>
  <label class="check"><input type="checkbox" id="pf-ai" ${p.ai!==false?'checked':''}> KI-Funktionen erlauben</label>
  <p class="hint">KI-Funktionen sind Lernpfade, Gespräche, Texte, Einstufung und KI-Karten. Für Kinderprofile kannst du sie ausschalten. Karteikarten, Wachen und eigene Sets gehen immer.</p>
  <div class="btn-row"><button class="btn primary">${ed?'Speichern':'Profil anlegen'}</button><button type="button" class="btn" data-act="prof-cancel">Abbrechen</button></div>
  ${ed&&profs.list.filter(x=>!x.deleted).length>1?(P.confirm?`<div class="confirm"><span>Profil „${esc(ed.name)}“ mit allen Daten löschen?</span><button type="button" class="btn danger sm" data-act="prof-del-yes">Löschen</button><button type="button" class="btn sm" data-act="prof-del-no">Abbrechen</button></div>`:'<button type="button" class="btn danger sm" data-act="prof-del">Profil löschen</button>'):''}</form>`}
 else h+=`<button class="btn wide" data-act="prof-add">+ Neues Profil</button>`;
 app.innerHTML=h+'</div>'}
function readProfForm(){const P=view.P,n=$('#pf-name'),c=document.querySelector('input[name=pf-col]:checked'),ai=$('#pf-ai'),kd=$('#pf-kid');P.draft={name:n?n.value:'',color:c?+c.value:0,ai:ai?ai.checked:true,kid:kd?!!kd.checked:false}}
function saveProfForm(){const P=view.P,name=$('#pf-name').value.trim().slice(0,24);if(!name)return toast('Gib dem Profil einen Namen');
 const col=+((document.querySelector('input[name=pf-col]:checked')||{}).value||0),ai=$('#pf-ai').checked,kid=!!($('#pf-kid')||{}).checked;
 if(P.edit){const p=profs.list.find(x=>x.id===P.edit);Object.assign(p,{name,color:col,ai,kid,av:P.av||null,upd:now()});saveProfs();if(p.id===profs.active){db.me={...db.me,name,upd:now()};save()}view.P={};render();toast('Gespeichert');return}
 const p={id:uid(),name,color:col,ai,kid,av:P.av||null,upd:now()};profs.list.push(p);saveProfs();toast(`Profil ${name} angelegt`);switchProfile(p.id)}
function activeLang(){const m=db.me&&db.me.lang;if(m)return m;const L=studyLangs();return L[0]||null}
const curLang=activeLang;
const inLang=s=>{const a=activeLang();return !a||targetLang(s)===a};
function setLang(l){db.me={...(db.me||{}),lang:l,upd:now()};save()}
const goalVal=()=>(db.me&&db.me.goal)||prefs.goal||20;
function langBar(){const a=activeLang(),L=[...new Set([...(a?[a]:[]),...studyLangs()])];
 return `<div class="lang-bar"><span class="label">Heute lerne ich</span><div class="chips" role="group" aria-label="Sprache wählen">${L.map(l=>`<button class="chip ${l===a?'on':''}" data-act="act-lang" data-l="${l}" aria-pressed="${l===a}">${langName(l)}</button>`).join('')}<button class="chip add" data-act="lang-new">+ Sprache</button></div></div>`}
function vLangPick(){const have=new Set(studyLangs());
 app.innerHTML=bar('home','Sprache')+`<div class="form"><h1>Welche Sprache möchtest du lernen?</h1><div class="chips">${LANGS.filter(l=>l[0]!=='de-DE').map(([c,n])=>`<button class="chip ${have.has(c)?'on':''}" data-act="lang-pick" data-l="${c}">${n}</button>`).join('')}</div>
 <p class="hint">Danach kannst du einen Lernpfad von null an starten oder eigene Sets anlegen.</p></div>`}

/* ---------- Kampf gegen Seeungeheuer ---------- */
function battleHead(Q){const m=monById(Q.monster),tot=Q.session.length,it=Q.cur,cc=it&&card(getSet(it.sid),it.cid);const pend=Q.res&&Q.res.ok&&cc&&(!it.isNew||(cc.m||0)+1>=2)?1:0;const left=Math.max(0,tot-Q.done-pend);const anim=Q.anim||'';Q.anim='';
 return `<section class="battle ${anim}" aria-label="${esc(m.name)}: noch ${left} von ${tot} Lebenspunkten"><div class="mon">${monsterSVG(m.id,112)}</div>
 <div class="b-info"><b>${esc(m.name)}</b><div class="hp" aria-hidden="true">${Array.from({length:tot},(_,i)=>`<i class="${i<left?'on':''}"></i>`).join('')}</div><span class="hint">${anim==='hit'?'Treffer!':anim==='miss'?`${esc(m.name)} weicht aus. Das Wort kommt gleich nochmal.`:esc(m.lore)}</span></div></section>`}
function vTrophies(){const sl=slainList(),cnt={};sl.forEach(x=>cnt[x.m]=(cnt[x.m]||0)+1);
 app.innerHTML=bar('home','Trophäen')+`<section class="set-head"><span class="label">Trophäen</span><h1>Besiegte Seeungeheuer</h1><p class="muted">${sl.length?`Insgesamt ${sl.length} ${sl.length===1?'Wache':'Wachen'} gewonnen. Jede Wache bringt ein neues Ungeheuer.`:'Noch keins besiegt. Halte deine erste Wache!'}</p></section>
 <div class="trophies">${MONSTERS.map(m=>`<figure class="trophy ${cnt[m.id]?'':'unseen'}">${monsterSVG(m.id,120)}<figcaption><b>${cnt[m.id]?esc(m.name):'???'}</b><span class="hint">${cnt[m.id]?`${cnt[m.id]}× besiegt`:'noch nicht begegnet'}</span>${cnt[m.id]?`<span class="hint lore">${esc(m.lore)}</span>`:''}</figcaption></figure>`).join('')}</div>
 <button class="btn primary wide" data-act="watch">${slainToday()?'Noch eine Wache':'Zur Wache'}: ${esc(monsterNext().name)} wartet</button>`}
