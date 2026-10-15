// Vokabelkoje – aktionen
/* ---------- Aktionen ---------- */
function startMode(m){const s=getSet(view.id);
 if(m==='flash')startFlash(s);else if(m==='learn')startLearn(s);else if(m==='test')go('test',{id:s.id,T:null});else if(m==='match')startMatch(s);else if(m==='hands')startHands(s);else if(m==='reader')startReader(s);else if(m==='talk')startTalk(s);else if(m==='dict')startDict(s);else if(m==='pron')startPron(s)}
function curCard(){if(view.name==='q'&&view.Q.cur)return card(getSet(view.Q.cur.sid),view.Q.cur.cid);if(view.name==='flash')return card(getSet(view.id),view.f.order[view.f.i]);return null}
function toggleStar(c){if(!c)return;c.star=!c.star;touch(c);save();render()}
function expectedFor(target){if(target==='q-in'&&view.Q&&view.Q.cur){const s=getSet(view.Q.cur.sid);return dirOf(s,card(s,view.Q.cur.cid)).answer}
 if(/^tq\d+$/.test(target)&&view.T){const q=view.T.qs[+target.slice(2)];return q&&q.answer}
 if(target==='dr-in'&&view.D&&view.D.data){const t=view.D.data.tasks[view.D.i];if(!t)return null;const g=t.gaps?t.gaps[view.D.g||0]:t.sol;return g&&g.join(' / ')}return null}
const acts={
 back:b=>{const to=b.dataset.to;
  if(to==='unit'){let ref=view.uref;if(!ref){const s=getSet(view.id);if(s&&s.course)ref={id:s.course,uid:s.unit}}
   if(ref){const u=unitOf(getCourse(ref.id),ref.uid);if(u&&u.kind==='exam')return go('course',{id:ref.id});return startUnit(ref.id,ref.uid)}return go('home')}
  if(to==='course')return go('course',{id:view.uref?view.uref.id:view.id});
  go(to,{id:view.id})},
 open:b=>go('set',{id:b.dataset.id}),
 new:()=>go('edit',{id:null,draft:{title:'',l1:activeLang()&&activeLang()!=='de-DE'?activeLang():'en-GB',l2:'de-DE',aiOpen:aiOK(),cards:[blank(),blank(),blank()]}}),
 edit:()=>{const s=getSet(view.id);go('edit',{id:s.id,draft:JSON.parse(JSON.stringify(s))})},
 mode:b=>startMode(b.dataset.m),
 'review-all':()=>startReview(allDue(),'home'),
 'review-set':()=>{const s=getSet(view.id);startReview(pool(s).filter(isDue).map(c=>({sid:s.id,cid:c.id})),'set',s.id)},
 'star-only':()=>{starOnly[view.id]=!starOnly[view.id];render()},
 star:b=>toggleStar(card(getSet(view.id),b.dataset.cid)),
 'cur-star':()=>toggleStar(curCard()),
 say:b=>b.dataset.gull?speak(b.dataset.text,b.dataset.lang,null,false,gullVoiceOpt()):sayTap(b.dataset.text,b.dataset.lang),
 addrow:()=>{view.draft.cards.push(blank());render();const c=view.draft.cards.at(-1);$('#r'+c.id+'t').focus()},
 delrow:b=>{view.draft.cards.splice(+b.dataset.i,1);render()},
 import:()=>{const add=parse($('#f-import').value);if(!add.length)return toast('Keine Zeilen gefunden');const d=view.draft;d.cards=d.cards.filter(c=>c.t.trim()||c.d.trim()).concat(add);render();toast(add.length+' Karten übernommen')},
 saveset:()=>{const d=view.draft;const cards=d.cards.map(c=>({...c,t:c.t.trim(),d:c.d.trim(),ex:(c.ex||'').trim()})).filter(c=>c.t||c.d);
  if(!cards.length)return toast('Leg mindestens eine Karte an');
  const title=d.title.trim()||'Ohne Titel';
  if(view.id){const s=getSet(view.id);Object.assign(s,{title,l1:d.l1,l2:d.l2,cards,upd:now()})}else{d.id=uid();db.sets.unshift({id:d.id,title,l1:d.l1,l2:d.l2,best:null,upd:now(),cards})}
  db.fresh=false;save();go('set',{id:view.id||d.id});toast('Gespeichert')},
 copy:()=>{const txt=exportText(getSet(view.id));
  try{navigator.clipboard.writeText(txt).then(()=>toast('Liste kopiert')).catch(()=>{view.exportText=true;render()})}catch(e){view.exportText=true;render()}},
 reset:()=>{const s=getSet(view.id);s.cards.forEach(c=>{c.m=0;c.lv=0;c.due=0;touch(c)});save();render();toast('Fortschritt zurückgesetzt')},
 del:()=>{view.confirm=true;render()}, 'del-no':()=>{view.confirm=false;render()},
 'del-yes':()=>{db.deleted[view.id]=now();db.sets=db.sets.filter(s=>s.id!==view.id);db.fresh=false;save();go('home');toast('Set gelöscht')},
 know:()=>judge(true), dont:()=>judge(false),
 'fl-shuffle':()=>{const f=view.f;startFlash(getSet(view.id),f.base,{termFirst:f.termFirst,shuffled:!f.shuffled});toast(!f.shuffled?'Gemischt, Runde neu gestartet':'In Reihenfolge, Runde neu gestartet')},
 'fl-side':()=>{const f=view.f;f.termFirst=!f.termFirst;f.flipped=false;render()},
 'fl-again':b=>{const f=view.f,s=getSet(view.id);startFlash(s,b.dataset.w==='unk'?f.unk.slice():null,{termFirst:f.termFirst,shuffled:f.shuffled})},
 'fl-say':b=>{const s=getSet(view.id),f=view.f,c=card(s,f.order[f.i]);if(!c)return;const out=$('#fl-said');
  listen(s.l1,{btn:b,onFinal:alts=>{const hit=alts.find(a=>check(a,c.t)>0);out.textContent=hit?`Gut ausgesprochen. Verstanden: „${hit}“`:`Verstanden: „${alts[0]}“. Gesucht: „${c.t}“`;out.className='said '+(hit?'ok':'no')},
   onInterim:t=>{out.textContent='Höre zu: '+t;out.className='said'}})},
 'q-opt':b=>answerMc(+b.dataset.i),
 'q-next':()=>qNext(),
 'q-idk':()=>qAnswer({ok:false,idk:true,input:''}),
 'q-override':()=>{const Q=view.Q;if(Q.res.addedFail)Q.failed.delete(qKey(Q.cur));Q.res={...Q.res,ok:true,hint:false};qNext()},
 'q-dir':()=>{prefs.dir=prefs.dir==='t'?'d':'t';savePrefs();const Q=view.Q;if(!Q.res){Q.cur=null}render()},
 'q-edit':()=>{view.Q.editing=true;render()},
 'q-edit-cancel':()=>{view.Q.editing=false;render()},
 'learn-reset':()=>startLearn(getSet(view.id),true),
 'ts-start':()=>{const s=getSet(view.id);const types=['mc','write','tf'].filter(t=>$('#ts-'+t).checked);if(!types.length)return toast('Wähle mindestens eine Frageart');
  const dir=$('#ts-dir').value;prefs.dir=dir;savePrefs();view.T={qs:makeTest(s,+$('#ts-n').value,types,dir),dir,ans:[],submitted:false};render();window.scrollTo(0,0)},
 'ts-new':()=>go('test',{id:view.id,T:null}),
 'ts-wrong':()=>{const T=view.T,s=getSet(view.id);startFlash(s,[...new Set(T.qs.filter((q,i)=>!T.ok[i]).map(q=>q.cid))])},
 tile:b=>tile(+b.dataset.i),
 mic:b=>{const inp=document.getElementById(b.dataset.target);if(!inp)return;const want=expectedFor(b.dataset.target);
  listen(b.dataset.lang,{btn:b,onFinal:alts=>{let pick=alts[0];if(want){const J=speechJudge(alts,want);pick=J.exact?J.said:J.ok?J.form:alts[0]}inp.value=pick;
   if(/^(q|c|dr)-in$/.test(b.dataset.target)){const f=document.getElementById(b.dataset.target.replace('-in','-form'));if(f)f.requestSubmit()}},onInterim:t=>{inp.value=t}})},
 'hf-go':()=>{keepAwake();view.H.misses=0;hfAsk()},
 'hf-pause':()=>hfPause(),
 'hf-skip':()=>{const H=view.H;const running=H.state!=='ready'&&H.state!=='paused';stopListen();stopSpeak();
  if(H.items.length>1)H.items.push(H.items.shift());if(running)hfAsk();else render()},
 'hf-dir':()=>{prefs.dir=prefs.dir==='t'?'d':'t';savePrefs();render()},
 voices:()=>{loadVoices();go('voices')},
 'v-test':b=>{const l=b.dataset.lang;speak(SAMPLE[short(l)]||langName(l),l,()=>{if(view.name==='voices')render()})},
 auto:()=>{prefs.auto=!prefs.auto;savePrefs();if(!prefs.auto)stopSpeak();
  if(view.f)view.f.spoken=null;if(view.Q){view.Q.spoken=null;view.Q.speaking=false}render();toast(prefs.auto?'Wird automatisch vorgelesen':'Automatisches Vorlesen aus')},
 settings:()=>go('backup'),
 watch:()=>startWatch(),
 tab:b=>{lastTab=b.dataset.t;view.tab=b.dataset.t;view.scrolled=false;render();window.scrollTo(0,0)},
 install:()=>doInstall(),
 'install-later':()=>{prefs.installHide=now();prefs.justPaired=0;savePrefs();render()},
 'pair-here':()=>{view.P.here=true;render()},
 'pair-copylink':async()=>{try{await navigator.clipboard.writeText(pairUrl());toast('Link kopiert')}catch(e){toast('Kopieren ging nicht')}},
 'ios-ok':()=>{prefs.iosHintAt=now();savePrefs();render()},
 'bk-later':()=>{prefs.backupSnooze=now()-11*DAY;savePrefs();render()},
 'w-pick':b=>{const i=document.getElementById('w-gull');if(i&&'value' in i)i.value=b.dataset.n;view.W.gull=b.dataset.n},
 'w-lang':b=>{setLang(b.dataset.l);render()},
 'w-next':()=>{if((curProf()||{}).kid){finishWelcome();return}view.W.step=3;render()},
 'w-back':()=>{view.W.step=Math.max(1,view.W.step-1);render()},
 'w-course':()=>finishWelcome(()=>newCourse()),
 'w-sets':()=>finishWelcome(()=>{lastTab='sets';acts.new()}),
 'w-look':()=>finishWelcome(),
 'kid-play':()=>startKid(),
 'kid-home':()=>{stopSpeak();go('home')},
 'kid-say':()=>kidSay(),
 'kid-pick':b=>kidPick(b.dataset.id),
 'gull-tap':()=>{clearInterval(gullTimer);gullAct();gullTimer=setInterval(()=>gullAct(),16000)},
 trophies:()=>go('trophies'),
 profiles:()=>go('profiles',{P:{}}),
 'prof-go':b=>switchProfile(b.dataset.id),
 'prof-add':()=>{view.P={adding:true};render()},
 'prof-edit':b=>{view.P={edit:b.dataset.id};render()},
 'prof-cancel':()=>{view.P={};render()},
 'av-dice':()=>{readProfForm();view.P.av=randomAvatar();render()},
 'av-none':()=>{readProfForm();view.P.av=null;render()},
 'av-preset':b=>{readProfForm();const {n,...x}=AV_PRESETS[+b.dataset.i];view.P.av={...x,kid:!!x.kid,fr:!!x.fr};render()},
 'prof-del':()=>{view.P.confirm=true;render()},'prof-del-no':()=>{view.P.confirm=false;render()},
 'prof-del-yes':()=>{const id=view.P.edit;const p=profs.list.find(x=>x.id===id);p.deleted=true;p.upd=now();try{localStorage.removeItem(dataKey(id))}catch(e){}
  const next=profs.list.find(x=>!x.deleted);saveProfs();toast('Profil gelöscht');if(id===profs.active){profs.active=next.id;saveProfs();db=load(next.id)||migrate({sets:[],fresh:true});go('home')}else{view.P={};render()}},
 'act-lang':b=>{setLang(b.dataset.l);render()},
 'lang-new':()=>go('langPick'),
 'lang-pick':b=>{const L=b.dataset.l;setLang(L);if(langEmpty(L)){lastTab='sets';qsErr=''}go('home');toast(`${langName(L)} ist jetzt deine Lernsprache`)},
 'gull-pick':b=>nameGull(b.dataset.n),
 cview:b=>{prefs.cview=b.dataset.v;savePrefs();view.scrolled=false;render()},
 logbook:b=>startLog(b.dataset.id||view.id),
 'ics':()=>{const t=($('#rem-time')||{}).value||prefs.remTime||'19:00';prefs.remTime=t;savePrefs();const data=icsReminder(t);
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'text/calendar'}));a.download='vokabelkoje-wache.ics';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
  toast('Öffne die Datei, um die tägliche Erinnerung in deinen Kalender zu übernehmen')},
 'course-new':()=>newCourse(),
 'cn-go':()=>courseCreate(),
 course:b=>go('course',{id:b.dataset.id}),
 unit:b=>startUnit(b.dataset.id,b.dataset.uid),
 'u-load':()=>unitLoad(),
 'u-read':()=>{const c=getCourse(view.id),u=unitOf(c,view.uid);u.lessonRead=true;c.upd=now();save();render()},
 'u-learn':()=>{const u=unitOf(getCourse(view.id),view.uid);const s=getSet(u.setId);if(!s)return;
  if(s.cards.some(k=>k.lv<1))startLearn(s);else startFlash(s)},
 'u-drill':()=>{const c=getCourse(view.id),u=unitOf(c,view.uid);startDrillTopic(c.lang,u.grammar,{id:c.id,uid:u.id})},
 'u-talk':()=>{const u=unitOf(getCourse(view.id),view.uid);const s=getSet(u.setId);if(!s)return;startTalk(s,true);view.C.custom=u.situation||u.field;view.C.stage='chat';talkSend(null)},
 'u-check':()=>{const c=getCourse(view.id),u=unitOf(c,view.uid);go('check',{lang:c.lang,uref:{id:c.id,uid:u.id},K:{stage:'intro',qs:null,ans:[],i:0,busy:false,err:'',fb:null}})},
 'c-plan':()=>{const c=getCourse(view.id);delete planning[c.id];const L=nextPlanLevel(c);if(L)planLevel(c,L)},
 'c-raise':()=>{const c=getCourse(view.id);c.to=LEVELS[Math.min(5,LEVELS.indexOf(c.to)+1)];c.upd=now();save();render()},
 'c-del':()=>{view.confirm=true;render()},'c-del-no':()=>{view.confirm=false;render()},
 'c-del-yes':()=>{const id=view.id,t=now();db.deleted[id]=t;db.sets.filter(s=>s.course===id).forEach(s=>db.deleted[s.id]=t);
  db.sets=db.sets.filter(s=>s.course!==id);db.courses=db.courses.filter(c=>c.id!==id);save();go('home');toast('Lernpfad gelöscht')},
 plang:b=>{prefs.plang=b.dataset.l;savePrefs();render()},
 check:b=>startCheck(b.dataset.l),
 'ck-go':()=>checkLoad(),
 'ck-opt':b=>{const K=view.K;if(K.fb!=null)return;const j=+b.dataset.j;K.ans[K.i]=j;K.fb=j;render();
  setTimeout(()=>{if(view.K!==K)return;K.fb=null;K.i++;if(K.i>=K.qs.length)checkFinish();render();window.scrollTo(0,0)},j===K.qs[K.i].a?450:1100)},
 drill:b=>startDrill(b.dataset.l,b.dataset.k),
 'dr-reload':()=>drillLoad(),
 'dr-start':()=>{view.D.stage='task';view.D.i=0;view.D.ok=0;view.D.res=null;view.D.g=0;view.D.gres=[];render()},
 'dr-opt':b=>{const D=view.D,t=D.data.tasks[D.i],j=+b.dataset.j;drillAnswer({ok:j===t.a,pick:j})},
 'dr-next':()=>drillNext(),
 'dr-help':()=>{const D=view.D;if(!D||D.res)return;const t=D.data.tasks[D.i];if(!t||t.typ!=='luecke')return;D.help=D.help||{lv:0};helpStep(D.help,t.gaps[D.g||0][0])},
 'q-help':()=>{const Q=view.Q;if(!Q||Q.res||!Q.cur)return;const s=getSet(Q.cur.sid),c=card(s,Q.cur.cid);if(!c)return;Q.help=Q.help||{lv:0};helpStep(Q.help,dirOf(s,c).answer)},
 tw:b=>lupeOpen(b.dataset.k,b.dataset.i,b),
 'lupe-close':()=>lupeClose(),
 'lupe-retry':()=>lupeLookup(true),
 'lupe-add':()=>lupeAdd(),
 'learn-more':()=>startLearn(getSet(view.id)),
 'dr-override':()=>{const D=view.D;if(D.res&&!D.res.ok){D.res.ok=true;D.ok++;(D.gres||[]).forEach(g=>g.ok=true)}drillNext()},
 'ai-photo':()=>$('#img-in').click(),
 'ai-photo-x':()=>{view.draft.aiImg=null;render()},
 'ai-gen':()=>aiGenerate(),
 'ai-ex':()=>aiExamples(),
 'gem-test':async()=>{toast('Teste Gemini …');try{await ai('Antworte nur mit dem Wort OK.');toast('Gemini funktioniert')}catch(e){toast(e.message==='NOKEY'?'Kein Schlüssel eingetragen':e.message)}},
 'gem-off':()=>{prefs.gemKey='';savePrefs();render();toast('Gemini-Schlüssel entfernt')},
 'rd-show':()=>{const t=$('#rd-in').value.trim();if(!t)return toast('Füg zuerst einen Text ein');const s=getSet(view.id);s.txt=t.slice(0,20000);s.upd=now();save();Object.assign(view.R,{edit:false,sel:null,info:{}});render()},
 'rd-edit':()=>{view.R.edit=true;view.R.sel=null;stopSpeak();render()},
 'rd-gen':()=>readerGen(),
 'rd-say':()=>{const s=getSet(view.id);speak(s.txt,targetLang(s))},
 'rd-stop':()=>{stopSpeak();},
 'rd-sent':()=>{const R=view.R,s=getSet(view.id),w=R.toks&&R.toks[R.sel],inf=w&&R.info[w.toLowerCase()];if(inf&&inf.sent)sayTap(inf.sent,targetLang(s))},
 listen:()=>startListen(),
 'ls-lang':b=>{const A=view.A,inp=$('#ls-in');if(inp)A.text=inp.value;A.lang=b.dataset.l;A.res=null;A.err='';render()},
 'ls-tr':()=>listenTranslate(),'ls-cam':()=>{const i=$('#cam-in');if(i&&i.click)i.click()},
 'ph-add':b=>{const A=view.A,x=A.items&&A.items[+b.dataset.i];if(!x||x.added)return;const n=addCards(talkSet(A.lang),[{t:x.t,d:x.d,ex:x.ex}],true);x.added=true;save();toast(n?`„${x.t}“ ist jetzt in „Gesammelte Wörter“`:'Das Wort ist schon im Set');render()},
 'dc-say':()=>dictSay(false),'dc-slow':()=>dictSay(true),'dc-skip':()=>dictCheck(''),'dc-next':()=>{const X=view.X;X.i++;X.res=null;render();if(X.i<X.items.length)setTimeout(()=>dictSay(false),200)},
 'pr-rec':()=>pronRec(),'pr-next':()=>{const X=view.X;stopListen();X.i++;X.res=null;X.listening=false;render()},
 yarn:()=>startYarn(activeLang()),'yarn-new':()=>yarnGen(),'ls-add':()=>addTr(view.A.res,view.A.lang),
 'pair':()=>startPair(),'pair-cancel':()=>{pairToken=null;go('home')},
 'pair-copy':async()=>{try{await navigator.clipboard.writeText(view.P.link);toast('Link kopiert')}catch(e){toast('Kopieren ging nicht – nimm „Teilen“')}},
 'pair-share':async()=>{try{await navigator.share({title:'Vokabelkoje verbinden',text:'Link für mein anderes Gerät (Code steht auf dem Handy):',url:view.P.link})}catch(e){}},
 'gull-chat':()=>startGullChat(),'gull-talk':()=>{prefs.gullTalk=!gullTalks();savePrefs();if(!prefs.gullTalk)stopSpeak();render()},
 'gull-voice':b=>{prefs.gullEngine=b.dataset.v;savePrefs();render();speak(`Ahoi! Ich bin ${gullName()}.`,'de-DE',null,false,gullVoiceOpt())},
 'tts-test':async()=>{const st=$('#tts-st');if(st)st.textContent='Teste …';try{await cloudAudio('Ahoi! Die Gemini-Stimme funktioniert.','de-DE',{voice:prefs.gullVoice||'Puck'});if($('#tts-st'))$('#tts-st').textContent='✓ Gemini-Stimme klappt ('+(prefs.ttsModel||'')+')';speak('Ahoi! Die Gemini-Stimme funktioniert.','de-DE',null,false,{cloud:true,voice:prefs.gullVoice||'Puck'})}catch(e){if($('#tts-st'))$('#tts-st').textContent='✗ '+e.message}},'g-retry':()=>gullSend(null),'g-add':b=>{const t=view.G.turns[+b.dataset.i];if(t)addTr(t.tr,view.lang)},
 'ls-play':()=>listenPlay(false),'ls-slow':()=>listenPlay(true),'ls-stop':()=>stopSpeak(),
 'ls-clear':()=>{view.A.hist=[];prefs.listenHist=[];savePrefs();render()},
 'tts-engine':b=>{prefs.ttsEngine=b.dataset.v;savePrefs();render();speak(SAMPLE[short(activeLang()||'en-GB')]||'Hallo',activeLang()||'en-GB')},
 w:b=>readerTap(+b.dataset.i),
 'rd-retry':()=>readerTap(view.R.sel,true),
 'rd-close':()=>{view.R.sel=null;render()},
 'rd-add':()=>{const R=view.R,s=getSet(view.id),w=R.toks[R.sel],inf=R.info[w.toLowerCase()];if(!inf||!inf.d)return;
  const n=addCards(s,[{t:inf.t,d:inf.d,ex:inf.sent}]);R.sel=null;render();toast(n?`„${inf.t}“ ist jetzt im Set`:'Das Wort ist schon im Set')},
 'net-mode':()=>{if(!netOnline)return toast('Kein Internet: Du lernst offline. Lernen, Wachen und gespeicherte Stimmen laufen weiter.');
  prefs.netMode=prefs.netMode==='offline'?'auto':'offline';savePrefs();render();
  toast(prefs.netMode==='offline'?'Offline lernen: keine KI, kein Abgleich, nur Gerätestimme und gespeicherte Gemini-Wörter. Spart Datenvolumen.':'Online lernen: KI, Abgleich und Gemini-Stimme sind an');if(prefs.netMode!=='offline'&&canSync())sync()},
 'net-set':b=>{prefs.netMode=b.dataset.v;savePrefs();render();if(prefs.netMode!=='offline'&&canSync())sync()},
 'pl-start':()=>preloadAudio(),'pl-stop':()=>{if(preload)preload=null},
 'pl-clear':async()=>{await audioStoreClear();toast('Gespeicherte Stimmen gelöscht');render()},
 'qs-ai':b=>starterAI(b.dataset.l),
 'qs-pack':b=>{const s=starterPack(b.dataset.l);toast(`Startpaket für ${langName(b.dataset.l)} angelegt`);go('set',{id:s.id})},
 'free-talk':()=>startFreeTalk(activeLang()),
 'focus-go':()=>startFocus(activeLang()),'focus-next':()=>focusNext(view.lang||activeLang()),
 'theme-toggle':()=>{setTheme(isDark()?'light':'dark');render()},
 'theme-set':b=>{setTheme(b.dataset.v);render()},
 'tk-scn':b=>{view.C.scn=b.dataset.v;view.C.custom='';render()},
 'tk-start':()=>{const C=view.C;const ci=$('#tk-custom');if(ci)C.custom=ci.value;C.stage='chat';C.turns=[];talkSend(null)},
 'tk-retry':()=>talkSend(null),
 'tk-end':()=>talkReview(),
 'tk-back':()=>{const C=view.C;C.stage='chat';if(talkMine(C)>=C.max)C.max=talkMine(C)+4;render()},
 'tk-new':()=>{stopSpeak();const C=view.C,s=getSet(view.id);if(C.unit){const cu=C.custom;startTalk(s,true);view.C.custom=cu;view.C.stage='chat';talkSend(null)}else startTalk(s)},
 'tk-add':()=>{const C=view.C,s=getSet(view.id);const n=addCards(s,[...C.picks].map(i=>C.review.woerter[i]));C.picks=new Set();render();toast(n?`${n} ${n===1?'Wort':'Wörter'} ins Set übernommen`:'Die Wörter sind schon im Set')},
 backup:()=>go('backup'),
 'bk-save':()=>saveBackup(),
 'bk-load':()=>$('#file-in').click(),
 'sync-now':()=>{toast('Gleiche ab …');sync()},
 'sync-off':()=>{prefs.ghToken='';prefs.gistId='';prefs.syncErr='';prefs.lastSync=0;savePrefs();render();toast('Abgleich getrennt')}
};
app.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const f=acts[b.dataset.act];if(f){e.preventDefault();f(b,e)}});
app.addEventListener('input',e=>{const el=e.target;
 if(view.name==='voices'){if(el.id==='v-rate'){prefs.rate=+el.value;$('#v-rate-l').textContent=rateLabel(prefs.rate)}else if(el.dataset.voice){prefs.voices=prefs.voices||{};prefs.voices[el.dataset.voice]=el.value}savePrefs()}
 if(view.name==='backup'&&el.id==='goal'){db.me={...db.me,goal:+el.value,upd:now()};save()}
 if(el.dataset.pref){prefs[el.dataset.pref]=el.value;savePrefs()}
 if(view.name==='courseNew'&&el.dataset.n){view.N[el.dataset.n]=el.value}
 if(view.name==='course'&&el.id==='c-to'){const c=getCourse(view.id);c.to=el.value;c.upd=now();save();render()}
 if(view.name==='talk'){if(el.dataset.c)view.C[el.dataset.c]=el.value;
  if(el.dataset.pick!=null){const i=+el.dataset.pick;el.checked?view.C.picks.add(i):view.C.picks.delete(i);render()}}
 if(view.name==='edit'){const d=view.draft;if(el.dataset.k)d[el.dataset.k]=el.type==='checkbox'?el.checked:el.value;else if(el.dataset.f)d.cards[+el.dataset.i][el.dataset.f]=el.value}});
app.addEventListener('toggle',e=>{const d=e.target;if(view.name==='course'&&d&&d.dataset&&d.dataset.lv){view.openLv=view.openLv||{};view.openLv[d.dataset.lv]=d.open}},true);
app.addEventListener('submit',e=>{e.preventDefault();const id=e.target.id;
 if(id==='q-form'&&!view.Q.res){const s=getSet(view.Q.cur.sid),c=card(s,view.Q.cur.cid),v=$('#q-in').value;if(!v.trim())return;const r=check(v,dirOf(s,c).answer),helped=(view.Q.help&&view.Q.help.lv)===2;qAnswer(helped?{ok:false,helped:true,input:v}:{ok:r>0,hint:r===1,input:v})}
 if(id==='q-edit'){const Q=view.Q,s=getSet(Q.cur.sid),c=card(s,Q.cur.cid);const t=$('#qe-t').value.trim(),d=$('#qe-d').value.trim();if(!t||!d)return toast('Begriff und Definition dürfen nicht leer sein');
  const oldAns=dirOf(s,c).answer;c.t=t;c.d=d;c.ex=$('#qe-x').value.trim();s.upd=now();save();Q.editing=false;
  if(Q.type==='mc'){const newAns=dirOf(s,c).answer;Q.opts=Q.opts.map(o=>o===oldAns?newAns:o)}
  render();toast('Karte gespeichert')}
 if(id==='ts-form'&&view.T&&!view.T.submitted)testSubmit();
 if(id==='dr-form'&&view.D&&!view.D.res){const D=view.D,v=$('#dr-in').value;if(!v.trim())return;const t=D.data.tasks[D.i],gs=t.gaps||[t.sol],gi=D.g||0;
  D.gres=D.gres||[];const helped=(D.help&&D.help.lv)===2;D.gres[gi]={input:v.trim(),ok:!helped&&gs[gi].some(s=>check(v,s)>0),helped};D.help={lv:0};
  if(gi<gs.length-1){D.g=gi+1;render();const i=$('#dr-in');if(i)i.focus();return}
  drillAnswer({ok:D.gres.every(g=>g.ok),helped:D.gres.some(g=>g.helped),input:D.gres.map(g=>g.input).join(' … '),gaps:D.gres})}
 if(id==='gull-form'){const v=$('#gull-name').value.trim();if(!v)return toast('Gib deiner Möwe einen Namen');nameGull(v)}
 if(id==='me-form'){const g=$('#me-gull').value.trim(),y=$('#me-name').value.trim();if(!g)return toast('Die Möwe braucht einen Namen');db.me={...db.me,gull:g.slice(0,20),name:y.slice(0,24),upd:now()};const cp=curProf();if(cp&&y){cp.name=y.slice(0,24);cp.upd=now();saveProfs()}save();render();toast('Gespeichert')}
 if(id==='prof-form')saveProfForm();
 if(id==='w-form'){const g=($('#w-gull').value||view.W.gull||'').trim().slice(0,20);if(!g)return toast('Gib deiner Möwe einen Namen');const y=($('#w-you').value||'').trim().slice(0,24);
  db.me={...db.me,gull:g,name:y||db.me.name||'',upd:now()};const cp=curProf();if(cp&&y&&!cp.name){cp.name=y;cp.upd=now();saveProfs()}save();view.W.step=2;view.W.gull=g;view.W.you=y;
  if(!activeLang()&&cp&&cp.kid)setLang('en-GB');render()}
 if(id==='dc-form'&&view.X&&!view.X.res){const v=$('#dc-in').value;if(v.trim())dictCheck(v)}
 if(id==='pair-form'){pairSubmit();return}
 if(id==='g-form'){const v=$('#g-in').value.trim();if(v&&view.G&&!view.G.busy)gullSend(v)}
 if(id==='ls-form')listenTranslate();
 if(id==='c-form'){const v=$('#c-in').value.trim();if(v&&!view.C.busy)talkSend(v)}
 if(id==='gem-form'){const k=$('#gem-key').value.trim();if(!k)return;prefs.gemKey=k;savePrefs();render();acts['gem-test']()}
 if(id==='gh-form'){const t=$('#gh-token').value.trim();if(!t)return;prefs.ghToken=t;prefs.gistId='';prefs.syncErr='';savePrefs();toast('Verbinde mit GitHub …');sync().then(()=>{if(!prefs.syncErr)toast('Abgleich eingerichtet')})}});
app.addEventListener('keydown',e=>{if(view.name==='edit'&&e.key==='Enter'&&e.target.matches('.edit-row input')){e.preventDefault();const i=+e.target.dataset.i,f=e.target.dataset.f;
 if(f==='t')e.target.parentNode.querySelector('.d-in').focus();else if(f==='d')e.target.parentNode.querySelector('.ex-in').focus();else if(i===view.draft.cards.length-1)acts.addrow();else document.querySelectorAll('.edit-row .t-in')[i+1].focus()}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.getAttribute&&e.target.getAttribute('role')==='button'&&e.target.dataset&&e.target.dataset.act){e.preventDefault();const f=acts[e.target.dataset.act];if(f)f(e.target,e);return}
 if(e.target.matches('input,textarea,select'))return;
 if(view.name==='flash'&&view.f.i<view.f.order.length){if(e.key===' '){e.preventDefault();flip()}else if(e.key==='ArrowRight')judge(true);else if(e.key==='ArrowLeft')judge(false)}
 if(view.name==='q'&&view.Q.cur&&!view.Q.res&&view.Q.type==='mc'){const n=+e.key;if(n>=1&&n<=view.Q.opts.length)answerMc(n-1)}});

render();
if(canSync())setTimeout(sync,800);
watchUpdates();
checkPairLink();
