// Vokabelkoje – startseite
/* ---------- Startseite ---------- */
/* ---------- Datenschutz: Hinweise und Sicherung ---------- */
const isIOS=()=>{try{return /iPad|iPhone|iPod/.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}catch(e){return false}};
const isInstalled=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}};
// In-App-Browser (WhatsApp, Gmail-WebView, Instagram …): dort lässt sich nichts installieren, und gespeicherte Daten bleiben dort hängen
const UA=()=>{try{return navigator.userAgent||''}catch(e){return ''}};
const isAndroid=()=>/Android/i.test(UA());
const isSamsung=()=>/SamsungBrowser/i.test(UA());
function inAppBrowser(){const u=UA();if(!u)return false;
 if(/FBAN|FBAV|FB_IAB|Instagram|Line\/|Telegram|WhatsApp|Snapchat|LinkedInApp|MicroMessenger|GSA\/|Pinterest/i.test(u))return true;
 if(isAndroid()&&/;\s*wv\)/.test(u))return true;
 if(isIOS()&&!/Safari\//.test(u))return true;return false}
// Android: Link gezielt in einem Browser öffnen (Intent-Link, der #-Teil mit dem Schlüsselpaket bleibt erhalten)
function intentLink(url,pkg){const u=new URL(url);return `intent://${u.host}${u.pathname}${u.search}${u.hash}#Intent;scheme=${u.protocol.replace(':','')};${pkg?`package=${pkg};`:'action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;'}S.browser_fallback_url=${encodeURIComponent(url)};end`}
let installEvt=null;
if(typeof addEventListener==='function'){addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;try{if(view&&view.name==='home')render()}catch(x){}});
 addEventListener('appinstalled',()=>{installEvt=null;prefs.installHide=now();savePrefs();toast('Installiert! Du findest die Vokabelkoje jetzt auf dem Startbildschirm.')})}
async function doInstall(){const e=installEvt;if(!e)return;installEvt=null;try{e.prompt();const r=await e.userChoice;if(r&&r.outcome==='accepted'){prefs.installHide=now();savePrefs()}}catch(x){}render()}
function installSteps(){if(isIOS())return 'In Safari unten auf „Teilen“ tippen, dann „Zum Home-Bildschirm“.';
 if(isSamsung())return 'Unten auf das Menü ≡ tippen, dann „Seite hinzufügen zu“ → „Startbildschirm“.';
 return 'Oben rechts auf ⋮ tippen, dann „App installieren“ oder „Zum Startbildschirm hinzufügen“.'}
function installCard(){if(!STANDALONE||isInstalled()||inAppBrowser()||isIOS())return '';
 if(now()-(prefs.installHide||0)<30*DAY)return '';
 if(installEvt)return `<div class="banner" role="note"><b>Vokabelkoje als App</b><span>Leg sie auf den Startbildschirm – dann startet sie wie eine richtige App, ohne Browserleiste.</span><div class="btn-row"><button class="btn sm primary" data-act="install">Auf den Startbildschirm</button><button class="btn sm" data-act="install-later">Später</button></div></div>`;
 if(prefs.justPaired&&now()-prefs.justPaired<2*DAY)return `<div class="banner" role="note"><b>Verbunden – jetzt noch auf den Startbildschirm</b><span>${installSteps()}</span><button class="btn sm" data-act="install-later">Erledigt</button></div>`;
 return ''}
function hasLearnData(){return db.sets.some(s=>s.cards.some(c=>c.lv>=1||c.m>0))||(db.courses||[]).length>0||slainList().length>0}
function safetyBanner(){let h=installCard();
 if(STANDALONE&&isIOS()&&!isInstalled()&&now()-(prefs.iosHintAt||0)>7*DAY)
  h+=`<div class="banner warn" role="note"><b>Wichtig fürs iPhone</b><span>Leg die App auf den Home-Bildschirm: unten auf „Teilen“ tippen, dann „Zum Home-Bildschirm“. Sonst kann Safari deine Daten nach 7 Tagen ohne Besuch löschen.</span><button class="btn sm" data-act="ios-ok">Verstanden</button></div>`;
 const last=Math.max(prefs.lastBackup||0,canSync()?prefs.lastSync||0:0);
 if(!canSync()&&hasLearnData()&&now()-Math.max(last,prefs.firstUse||0,prefs.backupSnooze||0)>14*DAY)
  h+=`<div class="banner" role="note"><b>Zeit für eine Sicherung</b><span>${last?`Letzte Sicherung ${ago(last)}.`:'Du hast noch keine Sicherung.'} Deine Daten liegen nur in diesem Browser.</span><div class="btn-row"><button class="btn sm primary" data-act="bk-save">Sicherung speichern</button>${STANDALONE?'<button class="btn sm" data-act="backup">Abgleich einrichten</button>':''}<button class="btn sm" data-act="bk-later">Später</button></div></div>`;
 return h}
if(!prefs.firstUse){prefs.firstUse=now();savePrefs()}
if(STANDALONE){try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist().catch(()=>{})}catch(e){}}

/* ---------- Startseite mit Leiste ---------- */
let lastTab='today';
const TAB_ICON={
 today:'<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="5" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5V21M7 11h10M4 14c0 4 3.6 7 8 7s8-3 8-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 map:'<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/></svg>',
 sets:'<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="7" y="3" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="9" width="14" height="11" rx="2" fill="var(--surface)" stroke="currentColor" stroke-width="2"/></svg>'};
function tabbar(t){const p=curProf()||{};const it=(k,lbl,ic)=>`<button class="tab ${t===k?'on':''}" data-act="tab" data-t="${k}" ${t===k?'aria-current="page"':''}>${ic}<span>${lbl}</span></button>`;
 return `<nav class="tabbar" aria-label="Hauptbereiche">${it('today','Heute',TAB_ICON.today)}${it('map','Seekarte',TAB_ICON.map)}${it('sets','Sets',TAB_ICON.sets)}${it('me','Profil',`<span class="tab-av">${avatar(p)}</span>`)}</nav>`}
const themeBtn=()=>`<button class="theme-btn" data-act="theme-toggle" aria-label="${isDark()?'Hellen Modus einschalten':'Dunkelmodus einschalten'}" title="${isDark()?'Hell':'Dunkel'}">${isDark()?'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/></g></svg>':'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z" fill="currentColor"/></svg>'}</button>`;
const topbar=()=>`<header class="hero"><div class="row-between" style="align-items:center"><div class="brand small">Vokabel<span>koje</span></div><div class="top-right">${netBtn()}${themeBtn()}<button class="prof-btn" data-act="profiles" aria-label="Profil wechseln, aktiv: ${esc((curProf()||{}).name||'Profil')}">${avatar(curProf())}<span>${esc((curProf()||{}).name||'Profil')}</span></button></div></div></header>`;
function vHome(){
 if(!(db.me&&db.me.onb))return vWelcome();
 if((curProf()||{}).kid)return vKidHome();
 const t=view.tab||lastTab||'today';lastTab=t;view.tab=t;const L=activeLang();
 let h=topbar();
 if(t==='today'){
  h+=`${langBar()}${safetyBanner()}${deck()}${weekTeaser()}${crewTeaser()}${gotCard()}${focusCard()}${freeTalkCard()}
  ${langEmpty(L)?`<div class="note stack"><span>Für ${langName(L)} gibt es noch nichts.</span><div class="btn-row">${aiOK()?'<button class="btn sm primary" data-act="course-new">Lernpfad von null an</button>':''}<button class="btn sm" data-act="new">Eigenes Set anlegen</button></div></div>`:''}
  ${aiOK()?levelCard():''}`}
 else if(t==='map'){const c=activeCourse();
  h+=`${quickStart(L)}<section class="sets"><div class="list-head"><h2>Lernpfade${L?' · '+langName(L):''}</h2>${aiOK()&&(db.courses||[]).some(x=>x.lang===L)?'<button class="btn sm" data-act="course-new">Neuer Lernpfad</button>':''}</div>
  ${courseCards()||(!aiOK()?'<p class="note">Lernpfade brauchen KI-Funktionen. Für dieses Profil sind sie ausgeschaltet.</p>':`<div class="note stack"><span>Von null an lernen, ganz ohne eigenes Material: Sag der KI, was du erreichen willst. Sie plant kleine Etappen mit je einem Grammatikthema und 10 bis 12 Wörtern, die du nacheinander freischaltest.</span><button class="btn primary" data-act="course-new">Lernpfad erstellen</button></div>`)}</section>
  ${c?`<section class="stack"><div class="list-head"><h2>Seekarte · ${esc(c.title)}</h2><button class="btn sm" data-act="course" data-id="${c.id}">Ganze Ansicht</button></div><div class="chart-box">${mapSVG(c)}</div></section>`:''}`}
 else if(t==='sets'){
  h+=`${db.fresh?`<p class="note">Zwei Beispielsets sind schon drin. Du kannst sie bearbeiten, löschen oder einfach ein neues Set anlegen.</p>`:''}
  ${quickStart(L)}<section class="sets"><h2>Eigene Sets${L?' · '+langName(L):''}</h2>${db.sets.filter(s=>!s.course&&inLang(s)&&!(s.talk&&!s.cards.length)).map(s=>{const d=dueCount(s);return `<button class="set-row" data-act="open" data-id="${s.id}"><div class="set-top"><div><div class="set-title">${esc(s.title)}</div><div class="set-meta">${s.cards.length} Begriffe · ${langName(s.l1)} ↔ ${langName(s.l2)}</div></div>${d?`<span class="due-chip">${d} fällig</span>`:''}</div>${faecher(s)}</button>`}).join('')||'<p class="note">Noch keine eigenen Sets in dieser Sprache.</p>'}</section>
  <button class="btn primary wide" data-act="new">Neues Set anlegen</button>
  ${topicPackForm(L)}
  <section class="stack"><h2>Werkzeugkiste</h2><div class="modes">
  <button class="mode" data-act="listen">${ICON.say}<b>Übersetzen &amp; anhören</b><span>Wort, Satz oder Foto: übersetzen, anhören, ins Set legen.</span></button>
  ${aiOK()&&L&&L!=='de-DE'?`<button class="mode" data-act="yarn" ${learnOffline()?'disabled':''}>${ICON.reader||ICON.say}<b>Seemannsgarn</b><span>${esc(gullName())} erzählt eine Geschichte aus deinen Wörtern.</span></button>`:''}</div>
  <p class="hint">Hördiktat und Aussprache findest du in jedem Set.</p></section>`}
 else{const p=curProf()||{},sl=slainList().length;
  h+=`<section class="today"><div class="row-between" style="justify-content:flex-start;gap:14px">${avatar(p,true)}<div class="u-body"><b style="font-size:1.2rem">${esc(p.name||'Ohne Namen')}</b><span class="hint">Möwe: ${esc(gullName())} · ${streak()} Tage auf Kurs</span></div></div>
  <div class="btn-row"><button class="btn" data-act="profiles">Profile verwalten</button><button class="btn" data-act="trophies">Trophäen (${sl})</button></div>
  <div class="btn-row"><button class="btn" data-act="week">Wochenrückblick</button><button class="btn" data-act="crew">Crew-Wettbewerb</button></div></section>
  ${(db.courses||[]).some(c=>c.lang===activeLang())?`<section class="stack"><h2>Logbücher</h2>${db.courses.filter(c=>c.lang===activeLang()).map(c=>`<button class="set-row" data-act="logbook" data-id="${c.id}"><div class="set-title">${esc(c.title)}</div><div class="set-meta">${langName(c.lang)} · ${c.units.filter(u=>u.status==='done').length} Häfen angelaufen</div></button>`).join('')}</section>`:''}
  ${safetyBanner()}
  <div class="btn-row"><button class="btn" data-act="voices">Ton und Stimmen</button><button class="btn" data-act="backup">Einstellungen und Sicherung</button></div>
  <p class="hint sync-line">${canSync()?(prefs.syncErr?`<span class="bad-text">Abgleich fehlgeschlagen: ${esc(prefs.syncErr)}</span>`:`Mit GitHub abgeglichen ${prefs.lastSync?ago(prefs.lastSync):'noch nicht'}.`):'Deine Daten liegen nur in diesem Browser. Leg ab und zu eine Sicherung an.'}</p>`}
 app.innerHTML=h+tabbar(t)}

/* ---------- Geführter Start ---------- */
function vWelcome(){const W=view.W||(view.W={step:1});const p=curProf()||{},me=db.me||{};
 let h=`<section class="welcome"><div class="w-steps" aria-label="Schritt ${W.step} von 3">${[1,2,3].map(i=>`<i class="${i<=W.step?'on':''}"></i>`).join('')}</div>`;
 if(W.step===1){h+=`<div class="w-gull">${gullSVG('happy',120,'')}</div><h1>Ahoi! Ich bin deine Möwe.</h1><p class="muted">Ich begleite dich auf deinem Törn durch die Sprachen. Wie soll ich heißen?</p>
  <form class="stack" id="w-form" autocomplete="off"><input id="w-gull" maxlength="20" value="${esc(W.gull||me.gull||'')}" placeholder="z. B. Fiete" aria-label="Name der Möwe" class="big-input">
  <div class="chips">${['Fiete','Mia','Krächz','Luv','Smutje','Hilda'].map(n=>`<button type="button" class="chip" data-act="w-pick" data-n="${n}">${n}</button>`).join('')}</div>
  <label class="fld"><span>Und wie soll ich dich nennen?</span><input id="w-you" maxlength="24" value="${esc(W.you||me.name||p.name||'')}" placeholder="dein Name"></label>
  <button class="btn primary wide">Weiter</button></form>`}
 else if(W.step===2){const kid=!!p.kid,langs=kid?LANGS.filter(l=>KID_LANGS.includes(short(l[0]))):LANGS.filter(l=>l[0]!=='de-DE');const a=activeLang();
  h+=`<div class="w-gull">${gullSVG('idle',96,'spy')}</div><h1>Welche Sprache willst du lernen?</h1><p class="muted">Du kannst jederzeit weitere Sprachen dazunehmen.</p>
  <div class="chips big">${langs.map(([c,n])=>`<button class="chip ${a===c?'on':''}" data-act="w-lang" data-l="${c}" aria-pressed="${a===c}">${n}</button>`).join('')}</div>
  <div class="btn-row"><button class="btn" data-act="w-back">Zurück</button><button class="btn primary" data-act="w-next" ${a?'':'disabled'}>Weiter</button></div>`}
 else{const L=activeLang();
  h+=`<div class="w-gull">${gullSVG('cheer',110,'')}</div><h1>Wie möchtest du starten?</h1>
  <div class="stack">${aiOK()?`<button class="mode wide" data-act="w-course">${ICON.learn}<b>Von null an mit Lernpfad</b><span>Die KI plant kleine Etappen für ${langName(L)}, passend zu deinem Ziel.</span></button>`:''}
  <button class="mode wide" data-act="w-sets">${ICON.flash}<b>Mit eigenen Wörtern</b><span>Du legst Sets an, z. B. aus dem Kurs oder Schulbuch${aiOK()?', gern mit KI-Hilfe':''}.</span></button>
  <button class="mode wide" data-act="w-look">${ICON.match}<b>Erst mal umschauen</b><span>Zur Startseite. Alles andere geht später auch.</span></button></div>
  <button class="btn" data-act="w-back">Zurück</button>`}
 app.innerHTML=h+'</section>'}
function finishWelcome(then){db.me={...db.me,onb:true,upd:now()};save();view={name:'home'};then?then():render()}

/* ---------- Kindermodus: Bilder und Ton ---------- */
const KID_LANGS=['en','es','fr','it','sv','nl','da','no','pt','hr','pl'];
const KID_CATS=[{id:'tiere',name:'Tiere'},{id:'essen',name:'Essen'},{id:'farben',name:'Farben'},{id:'draussen',name:'Draußen'}];
//            id         cat        bild  de          en           es           fr          it           sv          nl         da         no         pt          hr            pl
const KID_RAW=`dog|tiere|🐶|Hund|dog|perro|chien|cane|hund|hond|hund|hund|cão|pas|pies
cat|tiere|🐱|Katze|cat|gato|chat|gatto|katt|kat|kat|katt|gato|mačka|kot
cow|tiere|🐮|Kuh|cow|vaca|vache|mucca|ko|koe|ko|ku|vaca|krava|krowa
horse|tiere|🐴|Pferd|horse|caballo|cheval|cavallo|häst|paard|hest|hest|cavalo|konj|koń
fish|tiere|🐟|Fisch|fish|pez|poisson|pesce|fisk|vis|fisk|fisk|peixe|riba|ryba
bird|tiere|🐦|Vogel|bird|pájaro|oiseau|uccello|fågel|vogel|fugl|fugl|pássaro|ptica|ptak
pig|tiere|🐷|Schwein|pig|cerdo|cochon|maiale|gris|varken|gris|gris|porco|svinja|świnia
sheep|tiere|🐑|Schaf|sheep|oveja|mouton|pecora|får|schaap|får|sau|ovelha|ovca|owca
duck|tiere|🦆|Ente|duck|pato|canard|anatra|anka|eend|and|and|pato|patka|kaczka
mouse|tiere|🐭|Maus|mouse|ratón|souris|topo|mus|muis|mus|mus|rato|miš|mysz
apple|essen|🍎|Apfel|apple|manzana|pomme|mela|äpple|appel|æble|eple|maçã|jabuka|jabłko
banana|essen|🍌|Banane|banana|plátano|banane|banana|banan|banaan|banan|banan|banana|banana|banan
bread|essen|🍞|Brot|bread|pan|pain|pane|bröd|brood|brød|brød|pão|kruh|chleb
milk|essen|🥛|Milch|milk|leche|lait|latte|mjölk|melk|mælk|melk|leite|mlijeko|mleko
cheese|essen|🧀|Käse|cheese|queso|fromage|formaggio|ost|kaas|ost|ost|queijo|sir|ser
egg|essen|🥚|Ei|egg|huevo|œuf|uovo|ägg|ei|æg|egg|ovo|jaje|jajko
carrot|essen|🥕|Karotte|carrot|zanahoria|carotte|carota|morot|wortel|gulerod|gulrot|cenoura|mrkva|marchewka
strawberry|essen|🍓|Erdbeere|strawberry|fresa|fraise|fragola|jordgubbe|aardbei|jordbær|jordbær|morango|jagoda|truskawka
red|farben|#e53935|rot|red|rojo|rouge|rosso|röd|rood|rød|rød|vermelho|crvena|czerwony
blue|farben|#1e6fd9|blau|blue|azul|bleu|blu|blå|blauw|blå|blå|azul|plava|niebieski
green|farben|#2e9d4f|grün|green|verde|vert|verde|grön|groen|grøn|grønn|verde|zelena|zielony
yellow|farben|#fdd835|gelb|yellow|amarillo|jaune|giallo|gul|geel|gul|gul|amarelo|žuta|żółty
black|farben|#222222|schwarz|black|negro|noir|nero|svart|zwart|sort|svart|preto|crna|czarny
white|farben|#ffffff|weiß|white|blanco|blanc|bianco|vit|wit|hvid|hvit|branco|bijela|biały
orange|farben|#fb8c00|orange|orange|naranja|orange|arancione|orange|oranje|orange|oransje|laranja|narančasta|pomarańczowy
sun|draussen|☀️|Sonne|sun|sol|soleil|sole|sol|zon|sol|sol|sol|sunce|słońce
moon|draussen|🌙|Mond|moon|luna|lune|luna|måne|maan|måne|måne|lua|mjesec|księżyc
tree|draussen|🌳|Baum|tree|árbol|arbre|albero|träd|boom|træ|tre|árvore|drvo|drzewo
flower|draussen|🌸|Blume|flower|flor|fleur|fiore|blomma|bloem|blomst|blomst|flor|cvijet|kwiat
boat|draussen|⛵|Boot|boat|barco|bateau|barca|båt|boot|båd|båt|barco|brod|łódź
car|draussen|🚗|Auto|car|coche|voiture|macchina|bil|auto|bil|bil|carro|auto|samochód
ball|draussen|⚽|Ball|ball|pelota|ballon|palla|boll|bal|bold|ball|bola|lopta|piłka
house|draussen|🏠|Haus|house|casa|maison|casa|hus|huis|hus|hus|casa|kuća|dom`;
const KID_WORDS=KID_RAW.split('\n').map(l=>{const p=l.split('|');const w={id:p[0],cat:p[1],pic:p[2],de:p[3],t:{}};KID_LANGS.forEach((k,i)=>w.t[k]=p[4+i]);return w});
const kidLang=()=>{const a=activeLang();return a&&KID_LANGS.includes(short(a))?a:'en-GB'};
const kidStars=()=>Object.values((db.kid||{}).c||{}).reduce((a,b)=>a+b,0);
function kidPic(w,big){return w.pic.startsWith('#')?`<span class="kid-color" style="background:${w.pic}"></span>`:`<span class="kid-emoji" aria-hidden="true">${w.pic}</span>`}
function vKidHome(){const p=curProf()||{},L=kidLang(),stars=kidStars(),mon=monsterNext(),unl=Math.min(KID_CATS.length,1+Math.floor(stars/24));
 app.innerHTML=`<section class="kid-home">
 <div class="row-between"><button class="prof-btn" data-act="profiles" aria-label="Profil wechseln">${avatar(p)}<span>${esc(p.name||'')}</span></button><div class="top-right">${netBtn()}${themeBtn()}<span class="kid-stars" aria-label="${stars} Sterne">★ ${stars}</span></div></div>
 <div class="gull-row kid"><button class="gull-host" id="gull-host" data-size="130" data-act="gull-tap" aria-label="Möwe antippen">${gullSVG('happy',130)}</button><div class="bubble" id="gull-say"><span class="gull-name">${esc(gullName())}</span><p>Hallo ${esc(p.name||'')}! Spielst du mit mir?</p></div></div>
 <button class="kid-play" data-act="kid-play"><span class="kp-mon">${monsterSVG(mon.id,96)}</span><span>Spielen</span></button>
 <div class="chips big kid-langs">${KID_LANGS.map(k=>{const c=(LANGS.find(l=>short(l[0])===k)||[])[0];return c?`<button class="chip ${c===L?'on':''}" data-act="act-lang" data-l="${c}" aria-pressed="${c===L}">${langName(c)}</button>`:''}).join('')}</div>
 <div class="kid-cats">${KID_CATS.map((c,i)=>`<span class="kid-cat ${i<unl?'on':''}">${i<unl?KID_WORDS.find(w=>w.cat===c.id).pic.startsWith('#')?'🎨':KID_WORDS.find(w=>w.cat===c.id).pic:'🔒'}<small>${c.name}</small></span>`).join('')}</div>
 ${slainList().length?`<div class="kid-trophies">${slainList().slice(-8).map(x=>`<span>${monsterSVG(x.m,56)}</span>`).join('')}</div>`:''}
 </section>`}
function kidPool(){const stars=kidStars(),unl=KID_CATS.slice(0,Math.min(KID_CATS.length,1+Math.floor(stars/24))).map(c=>c.id);return KID_WORDS.filter(w=>unl.includes(w.cat))}
function startKid(){const pool=kidPool(),c=(db.kid=db.kid||{c:{}}).c;
 const order=shuffle(pool.slice()).sort((a,b)=>(c[a.id]||0)-(c[b.id]||0)).slice(0,8);
 const K={items:order.map(w=>w.id),i:0,ok:0,done:0,monster:monsterNext().id,wrong:[],state:'ask',opts:null};kidPrep(K);go('kid',{K});kidSay()}
function kidPrep(K){const w=KID_WORDS.find(x=>x.id===K.items[K.i]);const same=KID_WORDS.filter(x=>x.cat===w.cat&&x.id!==w.id);
 K.opts=shuffle([w,...shuffle(same).slice(0,3)]).map(x=>x.id);K.wrong=[];K.state='ask'}
function kidAsk(){const K=view.K;if(!K)return;kidPrep(K);render();kidSay()}
function kidSay(){const K=view.K;if(!K)return;const w=KID_WORDS.find(x=>x.id===K.items[K.i]),L=kidLang();speak('Wo ist','de-DE',()=>{if(view.K===K)speak(w.t[short(L)],L)})}
// Hört das Kind etwas? Sonst zeigt das Spiel das Wort groß zum Vorlesen
function kidHears(L){const dev=hasTTS&&!noDeviceVoice(L)&&!/keine Stimme|nicht angefangen|language|voice|synthesis/.test(ttsErr||'');return dev||(cloudOK()&&!learnOffline())}
function vKid(){const K=view.K;if(!K||(!K.opts&&K.state!=='won'))return go('home');const L=kidLang(),tot=K.items.length;
 if(K.state==='won'){app.innerHTML=`<section class="kid-home"><div class="victory"><span class="defeated">${monsterSVG(K.monster,130)}</span>${gullSVG('cheer',130)}</div>
  <div class="kid-stars big" aria-label="${K.ok} Sterne">${'★'.repeat(K.ok)}</div>
  <button class="kid-play" data-act="kid-play"><span>Nochmal</span></button><button class="btn wide" data-act="kid-home">Fertig</button></section>`;return}
 const w=KID_WORDS.find(x=>x.id===K.items[K.i]);
 app.innerHTML=`<section class="kid-game"><div class="kid-top"><button class="btn sm" data-act="kid-home" aria-label="Spiel beenden">✕</button><div class="hp big" aria-hidden="true">${Array.from({length:tot},(_,i)=>`<i class="${i>=K.done?'on':''}"></i>`).join('')}</div><span class="kid-mon ${K.anim||''}">${monsterSVG(K.monster,84)}</span></div>
 <button class="kid-say" data-act="kid-say" aria-label="Nochmal hören">${ICON.bigsay}</button>${kidHears(L)?'':`<div class="kid-word" lang="${short(L)}"><span>Wo ist</span><b>${esc(w.t[short(L)])}</b><span class="hint">Kein Ton? Lies das Wort vor.</span></div>`}
 <div class="kid-grid">${K.opts.map(id=>{const x=KID_WORDS.find(y=>y.id===id);const st=K.state==='right'&&id===w.id?'ok':K.wrong.includes(id)?'no':'';return `<button class="kid-tile ${st}" data-act="kid-pick" data-id="${id}" aria-label="${esc(x.de)}" ${K.state==='right'||K.wrong.includes(id)?'disabled':''}>${kidPic(x)}</button>`}).join('')}</div>
 </section>`;K.anim=''}
function kidPick(id){const K=view.K;if(!K||K.state!=='ask')return;const w=KID_WORDS.find(x=>x.id===K.items[K.i]),L=kidLang();
 if(id===w.id){K.state='right';K.done++;if(!K.wrong.length)K.ok++;db.kid=db.kid||{c:{}};db.kid.c[w.id]=(db.kid.c[w.id]||0)+1;logAnswer();save();K.anim='hit';render();
  speak(w.t[short(L)],L,()=>{if(view.K!==K)return;setTimeout(()=>{if(view.K!==K)return;K.i++;if(K.i>=K.items.length){K.state='won';watchDone(K);render();speak('Super gemacht!','de-DE')}else kidAsk()},500)})}
 else{K.wrong.push(id);K.anim='miss';render();speak('Nochmal!','de-DE',()=>{if(view.K===K)speak(w.t[short(L)],L)})}}

/* ---------- Schnellstart für neue Sprachen ---------- */
// 15 Grundlagen ohne KI (offline). Reihenfolge: de|en|es|fr|it|sv|nl|da|no|pt|pl|hr
const STARTER_RAW=`Hallo|Hello|Hola|Salut|Ciao|Hej|Hallo|Hej|Hei|Olá|Cześć|Bok
Tschüss|Goodbye|Adiós|Au revoir|Arrivederci|Hej då|Tot ziens|Farvel|Ha det|Adeus|Do widzenia|Doviđenja
Guten Morgen|Good morning|Buenos días|Bonjour|Buongiorno|God morgon|Goedemorgen|Godmorgen|God morgen|Bom dia|Dzień dobry|Dobro jutro
Danke|Thank you|Gracias|Merci|Grazie|Tack|Dank je|Tak|Takk|Obrigado|Dziękuję|Hvala
Bitte (als Bitte)|Please|Por favor|S'il vous plaît|Per favore|Snälla|Alsjeblieft|Vær så venlig|Vær så snill|Por favor|Proszę|Molim
Ja|Yes|Sí|Oui|Sì|Ja|Ja|Ja|Ja|Sim|Tak|Da
Nein|No|No|Non|No|Nej|Nee|Nej|Nei|Não|Nie|Ne
Entschuldigung|Excuse me|Perdón|Excusez-moi|Scusi|Ursäkta|Pardon|Undskyld|Unnskyld|Desculpe|Przepraszam|Oprostite
Wie geht es dir?|How are you?|¿Cómo estás?|Comment ça va ?|Come stai?|Hur mår du?|Hoe gaat het?|Hvordan har du det?|Hvordan har du det?|Como estás?|Jak się masz?|Kako si?
Wie heißt du?|What's your name?|¿Cómo te llamas?|Comment tu t'appelles ?|Come ti chiami?|Vad heter du?|Hoe heet je?|Hvad hedder du?|Hva heter du?|Como te chamas?|Jak masz na imię?|Kako se zoveš?
Ich verstehe nicht.|I don't understand.|No entiendo.|Je ne comprends pas.|Non capisco.|Jag förstår inte.|Ik begrijp het niet.|Jeg forstår ikke.|Jeg forstår ikke.|Não percebo.|Nie rozumiem.|Ne razumijem.
Wo ist die Toilette?|Where is the toilet?|¿Dónde está el baño?|Où sont les toilettes ?|Dov'è il bagno?|Var är toaletten?|Waar is het toilet?|Hvor er toilettet?|Hvor er toalettet?|Onde fica a casa de banho?|Gdzie jest toaleta?|Gdje je WC?
Was kostet das?|How much is it?|¿Cuánto cuesta?|Combien ça coûte ?|Quanto costa?|Vad kostar det?|Hoeveel kost het?|Hvad koster det?|Hva koster det?|Quanto custa?|Ile to kosztuje?|Koliko košta?
das Wasser|water|el agua|l'eau|l'acqua|vatten|het water|vand|vann|a água|woda|voda
Hilfe!|Help!|¡Ayuda!|Au secours !|Aiuto!|Hjälp!|Help!|Hjælp!|Hjelp!|Socorro!|Pomocy!|Upomoć!`;
const STARTER_COLS=['de','en','es','fr','it','sv','nl','da','no','pt','pl','hr'];
const STARTER=STARTER_RAW.split('\n').map(r=>{const c=r.split('|');return Object.fromEntries(STARTER_COLS.map((l,i)=>[l,c[i]]))});
const hasStarter=L=>!!L&&STARTER_COLS.includes(short(L))&&short(L)!=='de';
// Neue Sprache = noch kein Set und kein Lernpfad in dieser Sprache
const langEmpty=L=>!!L&&L!=='de-DE'&&!db.sets.some(s=>targetLang(s)===L&&!(s.talk&&!s.cards.length))&&!(db.courses||[]).some(c=>c.lang===L);
let qsBusy=false,qsErr='';
function quickStart(L){if(!langEmpty(L))return '';const off=learnOffline(),canAI=aiOK();
 return `<section class="panel quick"><h2>Schnellstart für ${langName(L)}</h2><p class="hint">Noch nichts da? Leg mit den wichtigsten Grundlagen los, ohne gleich einen ganzen Plan von A1 bis C2 zu machen. Ein Lernpfad geht später jederzeit.</p>
  <div class="btn-row">${canAI?`<button class="btn primary" data-act="qs-ai" data-l="${L}" ${qsBusy||off?'disabled':''}>${qsBusy?'KI erzeugt …':'15 Grundlagen mit KI erzeugen'}</button>`:''}${hasStarter(L)?`<button class="btn ${canAI&&!off?'':'primary'}" data-act="qs-pack" data-l="${L}">Startpaket ohne KI</button>`:''}</div>
  ${canAI&&off?'<p class="hint">Offline: Die KI-Variante geht wieder, sobald du online bist.</p>':''}${!canAI&&!hasStarter(L)?'<p class="hint">Leg ein eigenes Set an, z. B. mit Wörtern aus deinem Kurs.</p>':''}${errHtml(qsErr)}</section>`}
function makeStarterSet(L,cards,title){const s={id:uid(),title,l1:L,l2:'de-DE',best:null,upd:now(),cards:cards.map(x=>({...blank(),t:x.t,d:x.d,ex:x.ex||''}))};db.sets.unshift(s);save();return s}
function starterPack(L){const k=short(L);return makeStarterSet(L,STARTER.map(r=>({t:r[k],d:r.de})),'Erste Schritte')}
async function starterAI(L){if(qsBusy)return;qsBusy=true;qsErr='';render();const TL=langName(L);
 try{const r=await ai(`Ein deutschsprachiger Erwachsener fängt gerade erst mit ${TL} an (absolute Anfänger, A1).
Wähle die 15 nützlichsten Wörter und kurzen Sätze für die ersten Tage: Begrüßen, Danke/Bitte, sich vorstellen, nachfragen, Zahlen 1 bis 3, das Wichtigste unterwegs.
Antworte nur mit einem JSON-Array: [{"t":"Wort oder kurzer Satz auf ${TL} (Substantive mit Artikel)","d":"deutsche Bedeutung","ex":"sehr einfacher Beispielsatz auf ${TL}"}]`,{json:true,quick:true,cacheKey:`starter|${L}`});
  const list=(Array.isArray(r)?r:Array.isArray(r&&r.karten)?r.karten:[]).filter(x=>x&&x.t&&x.d).slice(0,20).map(x=>({t:String(x.t).trim(),d:String(x.d).trim(),ex:String(x.ex||'').trim()}));
  if(list.length<5)throw new AIError('Die KI hat zu wenig geliefert. Versuch es nochmal.');
  qsBusy=false;const s=makeStarterSet(L,list,'Erste Schritte');toast(`${list.length} Grundlagen für ${TL} angelegt`);go('set',{id:s.id})}
 catch(e){qsBusy=false;qsErr=e.message;render()}}

/* ---------- Wochenzahlen ---------- */
function weekStart(t=now()){const d=new Date(dayStart(t)),wd=(d.getDay()+6)%7;return dayStart(d.getTime()-wd*DAY+12*36e5)}
const curWeek=()=>dayKey(weekStart());
function statsOf(d,from,to=now()){d=d||{};let answers=0;for(let i=0;i<8;i++){const t=dayStart(from+i*DAY+12*36e5);if(t>to)break;answers+=(d.log||{})[dayKey(t)]||0}
 const watches=(d.slain||[]).filter(x=>x.t>=from&&x.t<to).length;let words=0,got=0;
 (d.sets||[]).forEach(s=>(s.cards||[]).forEach(c=>{if(c.ls>=from&&c.ls<to)words++;if(c.got>=from&&c.got<to)got++}));
 return {answers,watches,words,got,pts:answers+watches*30+words*5}}
const wobList=L=>{const r=[];db.sets.filter(s=>!L||targetLang(s)===L).forEach(s=>s.cards.forEach(c=>{if(isWob(c)&&c.lv>=1)r.push({s,c})}));return r.sort((a,b)=>(b.c.wob||0)-(a.c.wob||0))};
const termOf=(s,c)=>targetLang(s)===s.l1?c.t:c.d;

/* ---------- Wochenrückblick der Möwe ---------- */
function weekTeaser(){const wd=new Date().getDay();if(!(wd===0||wd===1)||prefs.weekSeen===curWeek())return '';
 return `<section class="note row-between" style="gap:10px"><span>📋 ${esc(gullName())} hat deinen Wochenrückblick fertig.</span><span class="btn-row"><button class="btn sm primary" data-act="week">Ansehen</button><button class="btn sm" data-act="week-hide" aria-label="Ausblenden">×</button></span></section>`}
function vWeek(){prefs.weekSeen=curWeek();savePrefs();const L=activeLang(),t0=dayStart()-6*DAY,cur=statsOf(db,t0),prev=statsOf(db,t0-7*DAY,t0),si=streakInfo(),wob=wobList(L).slice(0,3);
 const trend=prev.answers?Math.round((cur.answers-prev.answers)/prev.answers*100):null;
 const say=cur.answers===0?'Diese Woche lag das Schiff im Hafen. Morgen legen wir wieder ab, ja?':trend!=null&&trend>=15?'Kräh! Mehr als letzte Woche – du bist gut im Wind.':trend!=null&&trend<=-30?'Etwas ruhiger diese Woche. Schon drei Mini-Wachen am Tag halten den Kurs.':'Gleichmäßig wie die Gezeiten. Genau so bleibt’s hängen.';
 app.innerHTML=bar('home','Wochenrückblick')+`<section class="summary"><div class="victory">${gullSVG(cur.answers?'cheer':'idle',96)}</div><h1>Deine letzten 7 Tage</h1><p class="muted">${esc(gullName())}: „${say}“</p>
 <div class="big-nums"><div><b class="g">${cur.answers}</b><span>Antworten${trend!=null?` <small class="${trend>=0?'g':'r'}">${trend>=0?'▲':'▼'} ${Math.abs(trend)} %</small>`:''}</span></div><div><b style="color:var(--signal)">${cur.watches}</b><span>Wachen</span></div><div><b>${cur.words}</b><span>neue Wörter sitzen</span></div>${cur.got?`<div><b>${cur.got}</b><span>gesammelt</span></div>`:''}</div>
 <p class="hint">${si.n} ${si.n===1?'Tag':'Tage'} auf Kurs.</p></section>
 <section class="panel"><h2>Die hartnäckigsten Wörter</h2>${wob.length?`<ul class="wob-list">${wob.map(({s,c})=>`<li><b lang="${short(targetLang(s))}">${esc(termOf(s,c))}</b> <span class="muted">${esc(targetLang(s)===s.l1?c.d:c.t)}</span></li>`).join('')}</ul>
  <div class="btn-row">${gullChatOK()?`<button class="btn primary" data-act="week-chat">Schnack mit ${esc(gullName())} über diese Wörter</button>`:''}<button class="btn" data-act="week-mini">Mini-Wache damit</button></div>`
  :'<p class="muted">Keine Wackelkandidaten – alles sitzt sicher. Stark!</p>'}</section>
 <button class="btn wide" data-act="crew">Zum Crew-Wettbewerb</button>`}

/* ---------- Themenpakete ---------- */
const TP={busy:false,err:''};
function topicPackForm(L){if(!aiOK()||!L||L==='de-DE')return '';
 return `<form class="panel" id="tp-form" autocomplete="off"><h2>Wörter zu einem Thema</h2><p class="hint">Die KI macht dir ein Set mit Beispielsätzen auf deinem Niveau. Wörter, die du schon hast, lässt sie weg.</p>
 <div class="write"><input id="tp-topic" maxlength="60" placeholder="z. B. Segeln, Hafen, Physio" aria-label="Thema" ${TP.busy?'disabled':''}><select id="tp-n" aria-label="Anzahl">${[10,15,25].map(n=>`<option ${n===15?'selected':''}>${n}</option>`).join('')}</select><button class="btn primary" ${TP.busy||learnOffline()?'disabled':''}>${TP.busy?'Erstelle …':'Los'}</button></div>
 <div class="chips">${['Segeln','Im Hafen','Beim Physio','Mit Kindern','Im Garten','Wetter'].map(t=>`<button type="button" class="chip" data-act="tp-pick" data-t="${t}" ${TP.busy?'disabled':''}>${t}</button>`).join('')}</div>${TP.err?errHtml(TP.err):''}</form>`}
async function topicPack(topic,n){const L=activeLang();topic=String(topic||'').trim();if(!topic)return toast('Gib ein Thema ein');if(TP.busy||!L)return;
 adoptLevel(L);TP.busy=true;TP.err='';render();const TL=langName(L);
 const have=[...new Set(db.sets.filter(s=>targetLang(s)===L).flatMap(s=>s.cards.map(c=>termOf(s,c))))].slice(0,200).join(', ');
 try{const r=await ai(`Erstelle ${n} Vokabelkarten auf ${TL} zum Thema „${topic}“ für einen deutschsprachigen Erwachsenen (Niveau ${prefs.level}).
Nimm häufige, im Alltag wirklich nützliche Wörter und feste Wendungen zu diesem Thema. Substantive mit Artikel, Verben im Infinitiv.${have?` Diese Wörter kennt er schon, lass sie weg: ${have}.`:''}
„ex“ ist ein kurzer, natürlicher Beispielsatz auf ${TL}, der das Wort genau so enthält.
Antworte nur mit JSON: [{"t":"Wort auf ${TL}","d":"deutsche Übersetzung","ex":"Beispielsatz auf ${TL}"}]`,{json:true,fresh:true});
  const list=(Array.isArray(r)?r:(r&&Array.isArray(r.cards)?r.cards:[])).filter(x=>x&&x.t&&x.d).slice(0,n);
  if(list.length<3)throw new AIError('Zu dem Thema kam nichts Brauchbares zurück. Versuch es etwas genauer.');
  const s={id:uid(),title:topic.slice(0,1).toUpperCase()+topic.slice(1),l1:L,l2:'de-DE',best:null,upd:now(),cards:list.map(x=>({...blank(),t:String(x.t).trim(),d:String(x.d).trim(),ex:String(x.ex||'').trim(),got:now()}))};
  db.sets.push(s);db.fresh=false;save();TP.busy=false;toast(`${s.cards.length} Wörter zu „${s.title}“ – viel Spaß!`);go('set',{id:s.id});return}
 catch(e){TP.err=e.message||'Das hat nicht geklappt.'}
 TP.busy=false;if(view.name==='home')render()}

/* ---------- Crew-Wettbewerb ---------- */
// Wer zählt: andere Profile auf diesem Konto (aus dem eigenen Gist) und Freunde/Familie mit eigenem Konto per Crew-Code
const CREW_FILE='vokabelkoje-crew.json',crewRemote={};
function crewFromGist(g){const out=prefs.crewProf||{},wk=curWeek(),from=weekStart();
 Object.entries(g.files||{}).forEach(([name,f])=>{const m=/^vokabelkoje(?:-(.+))?\.json$/.exec(name);if(!m||name===PFILE||name===syncFile()||!f||f.truncated||!f.content)return;
  try{const d=JSON.parse(f.content);out[m[1]||'main']={week:wk,stats:statsOf(d,from),t:now()}}catch(e){}});
 prefs.crewProf=out;savePrefs()}
function crewMembers(){const wk=curWeek(),from=weekStart(),me=curProf()||{},list=[{id:'me',me:true,name:me.name||(db.me&&db.me.name)||'Ich',color:me.color||0,stats:statsOf(db,from)}];
 profs.list.filter(p=>!p.deleted&&p.id!==profs.active&&!p.kid).forEach(p=>{const loc=load(p.id),a=loc?statsOf(loc,from):null,g=(prefs.crewProf||{})[p.id],b=g&&g.week===wk?g.stats:null;if(!a&&!b)return;
  const st={};['answers','watches','words','got','pts'].forEach(k=>st[k]=Math.max((a||{})[k]||0,(b||{})[k]||0));list.push({id:p.id,name:p.name||'Profil',color:p.color||0,stats:st})});
 (db.crew.codes||[]).forEach(x=>{const r=crewRemote[x.id];list.push({id:x.id,remote:true,name:(r&&r.name)||x.name||'Crew',color:(r&&r.color)||0,stats:r&&r.week===wk?r.stats:{answers:0,watches:0,words:0,got:0,pts:0},err:r&&r.err,busy:r&&r.busy})});
 return list.sort((a,b)=>b.stats.pts-a.stats.pts)}
function crewTeaser(){const m=crewMembers();if(m.length<2)return '';const i=m.findIndex(x=>x.me);
 return `<button class="set-row crew-row" data-act="crew"><div class="set-top"><span class="crew-ico" aria-hidden="true">⚓</span><div style="flex:1;min-width:0"><div class="set-title">Crew-Woche: Platz ${i+1} von ${m.length}</div><div class="set-meta">${i===0?'Du führst – halt den Kurs!':`${esc(m[0].name)} führt mit ${m[0].stats.pts} Punkten`}</div></div></div></button>`}
async function crewFetch(force){const ids=(db.crew.codes||[]).map(x=>x.id);let did=0;
 await Promise.all(ids.map(async id=>{const r=crewRemote[id]||(crewRemote[id]={});if(r.busy||(!force&&r.t&&now()-r.t<5*60*1000))return;r.busy=true;did++;
  try{const res=await fetch('https://api.github.com/gists/'+encodeURIComponent(id),{headers:{'Accept':'application/vnd.github+json',...(prefs.ghToken?{'Authorization':'Bearer '+prefs.ghToken}:{})}});
   if(!res.ok)throw new Error(res.status===404?'Code nicht gefunden':'GitHub antwortet nicht');const g=await res.json(),f=g.files&&g.files[CREW_FILE];if(!f)throw new Error('Kein Crew-Code');
   const d=JSON.parse(f.content);Object.assign(r,{name:String(d.name||'Crew').slice(0,24),color:+d.color||0,week:d.week,stats:d.stats||{},err:'',t:now()});
   const x=db.crew.codes.find(c=>c.id===id);if(x&&x.name!==r.name){x.name=r.name;db.crew.upd=now();save(true)}}
  catch(e){r.err=e.message||'Nicht erreichbar';r.t=now()}r.busy=false}));
 if(did&&(view.name==='crew'||view.name==='home'))render()}
let crewPubBusy=false;
async function crewPublish(){if(!db.crew||!db.crew.share||!canSync()||learnOffline()||crewPubBusy)return;const me=curProf()||{};
 const body={v:1,name:me.name||(db.me&&db.me.name)||'Crew',color:me.color||0,week:curWeek(),stats:statsOf(db,weekStart()),t:now()},sig=JSON.stringify([body.name,body.week,body.stats]);
 if(prefs.crewSig===sig+db.crew.gist&&db.crew.gist)return;crewPubBusy=true;
 try{const files={[CREW_FILE]:{content:JSON.stringify(body)}};
  if(db.crew.gist){try{await gh('/gists/'+db.crew.gist,{method:'PATCH',body:JSON.stringify({files})})}catch(e){if(/Berechtigung|404/.test(e.message)){db.crew.gist=''}else throw e}}
  if(!db.crew.gist){const g=await gh('/gists',{method:'POST',body:JSON.stringify({description:'Vokabelkoje – Crew-Wochenstand',public:false,files})});db.crew.gist=g.id;db.crew.upd=now();save(true)}
  prefs.crewSig=sig+db.crew.gist;savePrefs()}catch(e){}
 crewPubBusy=false;if(view.name==='crew')render()}
function vCrew(){const C=view.C||(view.C={});const m=crewMembers(),wd=(new Date().getDay()+6)%7,left=6-wd;
 const lead=m[0],me=m.find(x=>x.me),say=m.length<2?'Allein auf See ist’s still. Hol dir eine Crew dazu!':lead.me?(lead.stats.pts?'Du stehst ganz vorn am Bug. Halt den Kurs!':'Noch hat keiner abgelegt. Mach den ersten Zug!'):`${lead.name} liegt vorn. ${me.stats.pts+30>=lead.stats.pts?'Eine Wache, und du ziehst vorbei!':'Mit ein paar Mini-Wachen holst du auf.'}`;
 let h=bar('home','Crew-Wettbewerb')+`<section class="gull-row" style="margin:6px 0 4px">${gullSVG(m.length>1?'cheer':'idle',70)}<div class="bubble"><span class="gull-name">${esc(gullName())}</span><p>${esc(say)}</p></div></section>
 <section class="panel"><div class="row-between"><h2>Diese Woche</h2><span class="hint">${left?`noch ${left} ${left===1?'Tag':'Tage'}`:'letzter Tag'}</span></div>
 <ol class="crew-list">${m.map((x,i)=>`<li class="${x.me?'me':''}"><span class="crew-rank">${i===0&&x.stats.pts?'👑':i+1}</span>${avatar({name:x.name,color:x.color})}<div class="u-body"><b>${esc(x.name)}${x.me?' (du)':''}</b><span class="hint">${x.busy?'lädt …':x.err?esc(x.err):`${x.stats.watches} ${x.stats.watches===1?'Wache':'Wachen'} · ${x.stats.words} ${x.stats.words===1?'neues Wort':'neue Wörter'} · ${x.stats.answers} ${x.stats.answers===1?'Antwort':'Antworten'}`}</span></div><b class="crew-pts">${x.stats.pts}</b>${x.remote?`<button class="del" data-act="crew-del" data-id="${esc(x.id)}" aria-label="${esc(x.name)} entfernen">×</button>`:''}</li>`).join('')}</ol>
 <p class="hint">Punkte: Wache 30 · neues Wort, das sitzt, 5 · jede Antwort 1. Jeden Montag geht es von vorn los.</p></section>`;
 h+=`<section class="panel"><h2>Crew zusammenstellen</h2><p class="hint">Andere Profile auf deinem Konto sind automatisch dabei. Wer ein eigenes Konto hat (eigener GitHub-Token), tauscht mit dir einen Crew-Code aus.</p>
 ${canSync()?`<label class="check"><input type="checkbox" id="crew-share" ${db.crew.share?'checked':''}> Meine Wochenzahlen teilen (nur Name und Punkte, keine Wörter oder Schlüssel)</label>
  ${db.crew.share?db.crew.gist?`<div class="fld"><span>Dein Crew-Code</span><div class="write"><input readonly value="${esc(db.crew.gist)}" aria-label="Dein Crew-Code" id="crew-code"><button class="btn" data-act="crew-copy">Kopieren</button></div></div>`:'<p class="thinking">Crew-Code wird erstellt …</p>':''}`
  :'<p class="note">Zum Teilen brauchst du die Sicherung mit GitHub-Token (Einstellungen). Codes anderer kannst du trotzdem eintragen.</p>'}
 <form class="write" id="crew-form" autocomplete="off"><input id="crew-add" placeholder="Crew-Code eines anderen" aria-label="Crew-Code eintragen" spellcheck="false" autocapitalize="off"><button class="btn primary">Dazu</button></form>${C.err?errHtml(C.err):''}</section>`;
 app.innerHTML=h;crewFetch()}
