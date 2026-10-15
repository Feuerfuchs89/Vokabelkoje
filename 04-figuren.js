// Vokabelkoje – figuren
/* ---------- Motivation: Möwe, Wache, Serie ---------- */
/* ---------- Möwe (flächiger Maskottchen-Stil, mit Aktionen) ---------- */
function gullSVG(mood,size,act){size=size||88;act=act||'';const up=mood==='happy'||mood==='cheer';const closed=mood==='happy'||act==='sleep'||act==='fish';
 const wingUp=`<path d="M24 56 C14 54 6 46 3 34 C12 34 22 40 27 48Z" fill="#a9bac6"/><path d="M3 34 C4 40 7 44 11 46 C11 41 8 36 3 34Z" fill="#34434e"/><circle cx="6.5" cy="38.5" r="1.3" fill="#fff"/>`;
 const wingDown=`<path d="M26 38 C14 44 11 62 15 78 C22 80 28 74 30 64Z" fill="#a9bac6"/><path d="M15 78 C17 86 24 86 28 80 C24 80 19 79 15 78Z" fill="#34434e"/><circle cx="20" cy="81" r="1.3" fill="#fff"/>`;
 const wingSalute=`<path d="M26 54 C18 46 18 30 26 22 C30 28 31 40 30 50Z" fill="#a9bac6"/><path d="M26 22 C23 25 22 29 23 32 C26 30 27 26 26 22Z" fill="#34434e"/>`;
 const leftUp=up||act==='knot',rightUp=up||['spy','whistle','sword','anchor','knot'].includes(act);
 const rightWing=act==='salute'?wingSalute:rightUp?wingUp:wingDown;
 const look=act==='think'?-3.5:act==='sword'?2.5:0,lookX=act==='sword'?2:0;
 const eye=(cx,px)=>`<circle cx="${cx}" cy="42" r="12" fill="#fff"/><circle cx="${px+lookX}" cy="${44+look}" r="8" fill="#f2d66b"/><circle cx="${px+lookX+.5}" cy="${44.5+look}" r="5.4" fill="#1d2a33"/><circle cx="${px+lookX+2.5}" cy="${42+look}" r="2.1" fill="#fff"/>`;
 const eyeL=act==='spy'?`<circle cx="37" cy="42" r="12" fill="#fff"/><path d="M29 44 q8 -6 16 0" fill="none" stroke="#1d2a33" stroke-width="4" stroke-linecap="round"/>`:eye(37,39);
 const eyes=closed?`<path d="M29 44 q8 ${act==='sleep'?'5':'-9'} 16 0 M55 44 q8 ${act==='sleep'?'5':'-9'} 16 0" fill="none" stroke="#1d2a33" stroke-width="4.5" stroke-linecap="round"/>`
  :`<g class="eyes">${eyeL}${eye(63,61)}</g>`;
 const brows=act==='sword'?'<path d="M28 30 l14 5 M72 30 l-14 5" stroke="#34434e" stroke-width="3" stroke-linecap="round"/>':'';
 const extra={
  whistle:`<path d="M54 66 C60 70 68 70 74 66" fill="none" stroke="#9aa7b1" stroke-width="3.2" stroke-linecap="round"/><circle cx="77" cy="66" r="5" fill="#c2ccd3" stroke="#7d8a94" stroke-width="1.4"/><circle cx="78.5" cy="64.5" r="1.4" fill="#fff"/><path d="M76 71 C74 78 70 82 64 84" fill="none" stroke="#c9a24a" stroke-width="1.6" stroke-dasharray="2 2"/><g class="notes"><text x="80" y="40" font-size="13" fill="#1f63a8" font-weight="700">♪</text><text x="88" y="28" font-size="11" fill="#1f63a8" font-weight="700">♫</text></g>`,
  spy:`<g transform="rotate(-14 63 42)"><rect x="56" y="35" width="40" height="13" rx="3" fill="#c9a24a"/><rect x="56" y="34" width="7" height="15" rx="2" fill="#8a6a2a"/><rect x="74" y="35.5" width="3" height="12" fill="#8a6a2a"/><rect x="90" y="33" width="8" height="17" rx="2" fill="#8a6a2a"/><ellipse cx="98" cy="41.5" rx="1.6" ry="6.5" fill="#bfe3f5"/></g>`,
  think:`<g class="dots"><circle cx="80" cy="22" r="3" fill="#fff" stroke="#a9bac6" stroke-width="1.2"/><circle cx="88" cy="13" r="4.2" fill="#fff" stroke="#a9bac6" stroke-width="1.2"/></g>`,
  sword:`<g transform="translate(80 50)"><g class="swd"><rect x="-2.5" y="-36" width="5" height="34" rx="2.5" fill="#d9b77a"/><path d="M-2.5 -36 L0 -41 L2.5 -36Z" fill="#d9b77a"/><rect x="-8" y="-3" width="16" height="4" rx="2" fill="#8a5a34"/><rect x="-1.6" y="1" width="3.2" height="9" rx="1.4" fill="#6d4c2f"/></g></g>
   <g class="crab" transform="translate(91 88)"><path d="M-6 -2 l-5 -5 M-7 1 l-6 -1 M6 -2 l5 -5 M7 1 l6 -1" stroke="#c0392b" stroke-width="1.6" stroke-linecap="round"/><ellipse rx="8" ry="5.5" fill="#e0533d"/><circle cx="-11" cy="-9" r="3.6" fill="#e0533d"/><circle cx="11" cy="-9" r="3.6" fill="#e0533d"/><path d="M-11 -11 l-1 -3 M11 -11 l1 -3" stroke="#fff" stroke-width="1.4"/><path d="M-2.5 -5 v-4 M2.5 -5 v-4" stroke="#c0392b" stroke-width="1.4"/><circle cx="-2.5" cy="-9.5" r="1.8" fill="#fff"/><circle cx="2.5" cy="-9.5" r="1.8" fill="#fff"/><circle cx="-2.2" cy="-9.4" r=".9" fill="#1d2a33"/><circle cx="2.8" cy="-9.4" r=".9" fill="#1d2a33"/></g>`,
  anchor:`<path d="M72 50 C78 58 82 62 84 66" fill="none" stroke="#c9a24a" stroke-width="2" stroke-dasharray="3 2"/><g class="anc" transform="translate(86 78)"><circle cy="-11" r="3" fill="none" stroke="#4a5560" stroke-width="2.4"/><path d="M0 -8 V8 M-6 -3 H6 M-9 3 C-8 10 8 10 9 3" fill="none" stroke="#4a5560" stroke-width="3" stroke-linecap="round"/></g>`,
  knot:`<path d="M30 74 C36 62 50 86 56 74 C62 62 52 60 46 70 C40 80 64 86 70 74" fill="none" stroke="#c9a24a" stroke-width="3.2" stroke-linecap="round"/>`,
  fish:`<g transform="translate(58 69)"><ellipse rx="10" ry="4.4" fill="#8fb3c9"/><path d="M8 0 L15 -5 L15 5Z" fill="#6f97b0"/><circle cx="-6" cy="-1" r="1.2" fill="#1d2a33"/><path d="M-1 -4 q3 4 0 8" stroke="#6f97b0" stroke-width="1.2" fill="none"/></g>`,
  sleep:`<path d="M30 26 C32 12 56 6 68 16 C74 10 82 9 88 13 C82 15 77 20 72 27 Z" fill="#c8372d"/><path d="M30 26 C44 20 58 20 72 27" fill="none" stroke="#fff" stroke-width="4"/><circle cx="89" cy="13" r="4.5" fill="#fff"/><g class="notes"><text x="74" y="44" font-size="10" fill="#1f63a8" font-weight="800">z</text><text x="82" y="36" font-size="13" fill="#1f63a8" font-weight="800">Z</text></g>`,
  salute:''}[act]||'';
 return `<svg class="gull ${mood||'idle'}${act?' act-'+act:''}" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true" overflow="visible">
 <circle cx="50" cy="52" r="48" fill="var(--sea)"/>
 <ellipse cx="50" cy="95" rx="22" ry="3.5" fill="#1d2a33" opacity=".12"/>
 <path d="M34 86 l6 -4 l6 4 q-6 4 -12 0Z M54 86 l6 -4 l6 4 q-6 4 -12 0Z" fill="#ff8a2a"/>
 <rect x="38" y="78" width="4.5" height="8" rx="2" fill="#ff8a2a"/><rect x="57.5" y="78" width="4.5" height="8" rx="2" fill="#ff8a2a"/>
 <g class="body">
 <path d="M50 16 C71 16 82 33 82 54 C82 74 69 86 50 86 C31 86 18 74 18 54 C18 33 29 16 50 16Z" fill="#f8fafb"/>
 <ellipse cx="50" cy="70" rx="22" ry="13" fill="#edf2f5"/>
 <g class="wl">${leftUp?wingUp:wingDown}</g><g class="wr"><g transform="matrix(-1 0 0 1 100 0)">${rightWing}</g></g>
 ${eyes}${brows}
 <path d="M38 55 Q50 50 62 55 Q60 61 54 64 L50 72 L46 64 Q40 61 38 55Z" fill="#ffc21f"/><path d="M42 61 Q50 64 58 61 Q56 65 53 66 L50 72 L47 66 Q44 65 42 61Z" fill="#f2a10f"/><circle cx="52.6" cy="66" r="2" fill="#e04848"/>
 ${up?'<ellipse cx="28" cy="57" rx="4.5" ry="2.8" fill="#ffb7a8" opacity=".75"/><ellipse cx="72" cy="57" rx="4.5" ry="2.8" fill="#ffb7a8" opacity=".75"/>':''}
 ${extra}
 </g></svg>`}
const GULL_WORD={'en':'gull','es':'gaviota','fr':'mouette','it':'gabbiano','nl':'meeuw','pt':'gaivota','sv':'mås','da':'måge','no':'måke','pl':'mewa','cs':'racek','tr':'martı','hr':'galeb','hu':'sirály','fi':'lokki','uk':'чайка','ru':'чайка','el':'γλάρος','ja':'カモメ','zh':'海鸥','ko':'갈매기','la':'larus'};
const GULL_ACTS=['whistle','spy','salute','think','flap','sword','anchor','knot','fish'];
function gullQuip(act){const me=db.me||{},you=me.name?esc(me.name):'Matrose',L=activeLang(),w=L&&GULL_WORD[short(L)];const r=a=>a[Math.floor(Math.random()*a.length)];
 const mon=monsterNext().name;
 return ({
  whistle:r([`Alle Mann an Deck!`,`Pfeif auf Ausreden, ${you}!`,`Das ist das Signal zum Lernen. Glaube ich.`]),
  spy:r([`Ich sehe … ${esc(mon)} am Horizont!`,`Land in Sicht? Nein, nur die nächste Etappe.`,`Da hinten wartet C2. Noch ein Stück.`,`Ich sehe ein Fischbrötchen. Eindeutig.`]),
  salute:r([`Aye aye, Käpt'n ${you}!`,`Melde gehorsamst: Schiff klar.`,`Zu Befehl! Leinen los, Gehirn an.`]),
  think:r([w?`Auf ${langName(L)} heiße ich übrigens „${esc(w)}“.`:`Was heißt eigentlich „Fischbrötchen“ auf Altnordisch?`,`Hmm … Wikinger hatten keinen Kompass. Du hast mich.`,`Ob ${esc(mon)} wohl auch Vokabeln lernt?`,`Warum ist das Meer salzig? Weil es keine Vokabeln mag?`]),
  flap:r([`Kräh! Wer zuerst kommt, kriegt den Fisch.`,`Steife Brise heute! Gut für den Kopf.`,`Ein Seemann lernt bei jedem Wetter.`]),
  sword:r([`En garde, Krabbe!`,`Sie kneift! Unfair!`,`Ein Wikinger übt jeden Tag. Mit Schwert oder mit Wörtern.`]),
  anchor:r([`Anker lichten! Puh, ist der schwer.`,`Wer rastet, der rostet. Auch Anker.`,`Hau ruck! … Hilfst du mal?`]),
  knot:r([`Palstek, Webeleinstek, Achtknoten …`,`Ein guter Knoten hält. Ein gutes Wort auch.`,`Hoppla, das ist ein Knoten im Flügel.`]),
  fish:r([`Mmpf! … Fischbrötchen-Pause.`,`Den hab ich nicht geklaut, nur ausgeliehen.`,`Hmmpf mmpf! (Mit vollem Schnabel spricht man nicht.)`]),
  sleep:r([`Zzz … nur noch ein Wort … zzz`,`Schnarch … Jörmungandr … schnarch …`,`Gute Nacht, ${you}. Morgen geht's weiter.`])})[act]||''}
let gullTimer=null,gullBack=null;
function stopGull(){clearInterval(gullTimer);clearTimeout(gullBack);gullTimer=gullBack=null}
function gullDefault(){const k=dayKey();return {mood:db.watch&&db.watch[k]?'happy':'idle',msg:gullMsg()}}
function gullAct(force){const host=document.getElementById('gull-host'),bub=document.getElementById('gull-say');if(!host||!bub||(host.isConnected===false))return;
 const h=new Date().getHours(),night=h>=21||h<6;const acts=night?[...GULL_ACTS,'sleep','sleep','sleep']:GULL_ACTS;
 let a=force||acts[Math.floor(Math.random()*acts.length)];if(a===gullAct.last&&!force)a=GULL_ACTS[(GULL_ACTS.indexOf(a)+1)%GULL_ACTS.length];gullAct.last=a;
 host.innerHTML=gullSVG(a==='flap'?'cheer':'idle',host.dataset.size?+host.dataset.size:88,a==='flap'?'':a);
 bub.innerHTML=`<span class="gull-name">${esc(gullName())}</span><p>${gullQuip(a)}</p>${document.querySelector('.kid-home')?'':gullChatBtn()}`;bub.classList.remove('pop','think');void bub.offsetWidth;bub.classList.add('pop');if(a==='think'||a==='sleep')bub.classList.add('think');
 clearTimeout(gullBack);gullBack=setTimeout(()=>{if(host.isConnected===false)return;const d=gullDefault();host.innerHTML=gullSVG(d.mood,host.dataset.size?+host.dataset.size:88);bub.innerHTML=`<span class="gull-name">${esc(gullName())}</span><p>${d.msg}</p>`;bub.classList.remove('think')},7000)}
function hookGull(){stopGull();if(!document.getElementById('gull-host'))return;let rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
 if(rm)return;gullBack=setTimeout(()=>gullAct(),5000);gullTimer=setInterval(()=>gullAct(),16000)}

/* ---------- Wikinger-Avatare ---------- */
let avN=0;
const AV={skin:['#f7d9bf','#efc49d','#d9a074','#b97a4f','#8d5a3b','#5e3a24'],hair:['#e8c26a','#c4562f','#7a4a2a','#2b2522','#c9c6c0','#d98c5f'],shirt:['#2f5d8a','#8c2f2f','#3f6b3b','#6b4e8a','#8a6a2a','#4a4f57'],eye:['#3d7fb8','#4f8a5b','#6b4a2e','#3d7fb8','#4a3426','#2b1f18']};
const AV_HAIR=['short','long','braids','bun','bald'],AV_BEARD=['none','short','long','braided'],AV_HEAD=['none','helm','band','hood','circlet'];
const AV_PRESETS=[
 {n:'Schildmaid',skin:1,hair:'braids',hc:2,beard:'none',head:'helm',shirt:1,f:true},
 {n:'Jarl',skin:0,hair:'long',hc:4,beard:'long',head:'circlet',shirt:3},
 {n:'Skaldin',skin:2,hair:'bun',hc:0,beard:'none',head:'circlet',shirt:0,f:true},
 {n:'Bootsbauer',skin:1,hair:'short',hc:1,beard:'short',head:'band',shirt:2},
 {n:'Seherin',skin:3,hair:'long',hc:3,beard:'none',head:'hood',shirt:5,f:true},
 {n:'Steuermann',skin:4,hair:'bald',hc:3,beard:'braided',head:'none',shirt:4},
 {n:'Wikingerjunge',skin:0,hair:'short',hc:0,beard:'none',head:'helm',shirt:0,kid:true},
 {n:'Wikingermädchen',skin:2,hair:'braids',hc:3,beard:'none',head:'band',shirt:2,kid:true,fr:true,f:true},
 {n:'Nordlicht-Kind',skin:5,hair:'bun',hc:3,beard:'none',head:'hood',shirt:3,kid:true,f:true},
 {n:'Fischerin',skin:1,hair:'short',hc:5,beard:'none',head:'hood',shirt:0,f:true},
 {n:'Runenmeister',skin:2,hair:'long',hc:2,beard:'short',head:'none',shirt:5},
 {n:'Schmiedin',skin:4,hair:'short',hc:3,beard:'none',head:'band',shirt:1,f:true},
 {n:'Ylva Wellen&shy;reiterin',skin:3,hair:'curls',hc:3,beard:'none',head:'band',shirt:2,kid:true,f:true,mouth:'grin',acc:'shield'},
 {n:'Bjarki Möwen&shy;freund',skin:1,hair:'spiky',hc:2,beard:'none',head:'none',shirt:4,kid:true,mouth:'grin',acc:'oar',feather:true}];
function randomAvatar(){const r=n=>Math.floor(Math.random()*n),kid=Math.random()<.3,f=Math.random()<.5;
 const a={skin:r(6),hair:f?['long','braids','bun','short','curls'][r(5)]:kid&&Math.random()<.35?'spiky':AV_HAIR[r(kid?4:5)],hc:r(kid?4:6),beard:kid||f?'none':AV_BEARD[r(4)],head:AV_HEAD[r(5)],shirt:r(6),kid,f,fr:Math.random()<.3};
 if(a.hair==='braids'&&a.hc===1)a.fr=false;if(kid&&Math.random()<.4)a.mouth='grin';if(kid&&Math.random()<.3)a.acc=['shield','oar'][r(2)];return a}
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)));return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function avatarSVG(a,size,bg){size=size||44;a=a||AV_PRESETS[0];const id=++avN;
 const S=AV.skin[a.skin]||AV.skin[0],Sd=shade(S,-.14),H=AV.hair[a.hc]||AV.hair[0],Hl=shade(H,parseInt(H.slice(1,3),16)<80?.12:.28),Hd=shade(H,-.25),C=AV.shirt[a.shirt]||AV.shirt[0],Cd=shade(C,-.25),E=AV.eye[a.skin]||AV.eye[0],K=!!a.kid,F=!!a.f;
 const cy=K?50:46,rx=K?22:20,ry=K?23:23,top=cy-ry,chin=cy+ry,GOLD='#e0b13a',GOLDd='#a8801c';
 let back='',front='',head='',beard='',extra='';
 // Haare hinten
 if(a.hair==='long')back+=`<path d="M${50-rx-4} ${cy-6} C${50-rx-9} ${cy+20} ${50-rx-4} ${chin+20} ${50-8} ${chin+14} L${50+8} ${chin+14} C${50+rx+4} ${chin+20} ${50+rx+9} ${cy+20} ${50+rx+4} ${cy-6}Z" fill="${H}"/><path d="M${50-rx-2} ${cy+4} C${50-rx-4} ${cy+18} ${50-rx} ${chin+8} ${50-rx+4} ${chin+12} M${50+rx+2} ${cy+4} C${50+rx+4} ${cy+18} ${50+rx} ${chin+8} ${50+rx-4} ${chin+12}" stroke="${Hd}" stroke-width="1.3" fill="none" opacity=".6"/>`;
 if(a.hair==='bun')back+=`<circle cx="50" cy="${top-3}" r="${K?9:8}" fill="${H}"/><path d="M${50-6} ${top-5} q6 -5 12 0" stroke="${Hl}" stroke-width="1.6" fill="none"/><rect x="${50-9}" y="${top+1}" width="18" height="3" rx="1.5" fill="${a.head==='circlet'?GOLD:C}"/>`;
 if(a.hair==='curls')back+=Array.from({length:11},(_,i)=>{const t=i/10*Math.PI*1.25-Math.PI*1.125,x=50+Math.cos(t)*(rx+6),y=cy-4+Math.sin(t)*(ry+5);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(K?8.5:8).toFixed(1)}" fill="${i%2?H:shade(H,-.1)}"/>`}).join('');
 if(a.acc==='oar')back+=`<g transform="rotate(28 78 60)"><rect x="76" y="20" width="4.4" height="90" rx="2" fill="#a0723f"/><path d="M73 6 Q78 -4 83 6 L84 30 Q78 36 72 30Z" fill="#c9965a" stroke="#8a5f30" stroke-width="1.4"/><path d="M78 6 V28" stroke="#8a5f30" stroke-width="1" opacity=".6"/></g>`;
 if(a.head==='hood')back=`<path d="M${50-rx-10} 104 C${50-rx-14} ${cy-10} ${50-rx+2} ${top-12} 50 ${top-12} C${50+rx-2} ${top-12} ${50+rx+14} ${cy-10} ${50+rx+10} 104Z" fill="#8a6a46"/>`+back;
 // Körper
 const shoulder=chin+6;
 let body=`<path d="M${50-34} 104 C${50-33} ${shoulder+6} ${50-20} ${shoulder} 50 ${shoulder} C${50+20} ${shoulder} ${50+33} ${shoulder+6} ${50+34} 104Z" fill="${C}"/>`;
 body+=`<path d="M${50-9} ${shoulder} L50 ${shoulder+11} L${50+9} ${shoulder}" fill="${Cd}"/><path d="M${50-9} ${shoulder} L50 ${shoulder+11} L${50+9} ${shoulder}" fill="none" stroke="${GOLD}" stroke-width="1.8"/>`;
 body+=`<path d="M${50-30} ${shoulder+16} C${50-18} ${shoulder+10} ${50+18} ${shoulder+10} ${50+30} ${shoulder+16}" fill="none" stroke="${GOLD}" stroke-width="2.2" stroke-dasharray="3 2" opacity=".85"/>`;
 if(F&&!K)body+=`<ellipse cx="${50-17}" cy="${shoulder+9}" rx="5" ry="3.6" fill="${GOLD}" stroke="${GOLDd}" stroke-width="1"/><ellipse cx="${50+17}" cy="${shoulder+9}" rx="5" ry="3.6" fill="${GOLD}" stroke="${GOLDd}" stroke-width="1"/><path d="M${50-13} ${shoulder+11} Q50 ${shoulder+21} ${50+13} ${shoulder+11}" fill="none" stroke="#4fa3d9" stroke-width="2.4" stroke-dasharray="1.5 2" stroke-linecap="round"/>`;
 else if(!K)body+=`<path d="M${50+14} ${shoulder+1} C${50+26} ${shoulder+4} ${50+33} ${shoulder+14} ${50+34} 104 L${50+22} 104 C${50+20} ${shoulder+16} ${50+16} ${shoulder+8} ${50+10} ${shoulder+4}Z" fill="${Cd}" opacity=".7"/><circle cx="${50+15}" cy="${shoulder+6}" r="4.2" fill="none" stroke="${GOLD}" stroke-width="2"/><path d="M${50+12} ${shoulder+9} l6 -6" stroke="${GOLD}" stroke-width="1.6"/>`;
 body+=`<path d="M${50-7} ${chin-4} h14 v${shoulder-chin+5} q-7 4 -14 0Z" fill="${S}"/><path d="M${50-7} ${chin} q7 5 14 0" fill="${Sd}" opacity=".6"/>`;
 // Gesicht
 const ex=K?8:7.5,ey=cy+(K?1:0),er=K?3.6:3;
 let face=`<ellipse cx="${50-rx+1}" cy="${cy+2}" rx="4" ry="5" fill="${S}"/><ellipse cx="${50+rx-1}" cy="${cy+2}" rx="4" ry="5" fill="${S}"/><ellipse cx="${50-rx+1}" cy="${cy+2}" rx="1.8" ry="2.6" fill="${Sd}"/><ellipse cx="${50+rx-1}" cy="${cy+2}" rx="1.8" ry="2.6" fill="${Sd}"/>
 <ellipse cx="50" cy="${cy}" rx="${rx}" ry="${ry}" fill="${S}"/><path d="M${50-rx+2} ${cy+6} C${50-rx+6} ${chin+2} ${50+rx-6} ${chin+2} ${50+rx-2} ${cy+6} C${50+rx-6} ${chin-2} ${50-rx+6} ${chin-2} ${50-rx+2} ${cy+6}Z" fill="${Sd}" opacity=".35"/>
 ${[-1,1].map(sd=>`<ellipse cx="${50+sd*ex}" cy="${ey}" rx="${er+1.4}" ry="${er+.6}" fill="#fff"/><circle cx="${50+sd*ex}" cy="${ey+.3}" r="${er-.2}" fill="${E}"/><circle cx="${50+sd*ex}" cy="${ey+.5}" r="${er*.5}" fill="#1d1612"/><circle cx="${50+sd*ex+1}" cy="${ey-.8}" r="${er*.28}" fill="#fff"/><path d="M${50+sd*ex-er-1.4} ${ey-1} q${er+1.4} ${-er-1.4} ${2*er+2.8} 0" fill="none" stroke="#3a2a20" stroke-width="${F?1.6:1.2}" stroke-linecap="round"/>${F?`<path d="M${50+sd*(ex+er+1)} ${ey-1.6} l${sd*2} -1.6" stroke="#3a2a20" stroke-width="1.2" stroke-linecap="round"/>`:''}`).join('')}
 <path d="M${50-ex-4} ${ey-er-4} q4 ${a.beard!=='none'?-2.6:-2} 8 ${a.beard!=='none'?.6:0} M${50+ex-4} ${ey-er-3.4} q4 ${a.beard!=='none'?-3.2:-2} 8 ${a.beard!=='none'?-.6:0}" stroke="${a.hair==='bald'?'#4a3426':Hd}" stroke-width="${a.beard!=='none'?2.6:1.9}" fill="none" stroke-linecap="round"/>
 <path d="M50 ${ey+2} q-2.6 5 0 ${K?5:6.5} q2 .6 3 -.6" fill="none" stroke="${Sd}" stroke-width="1.6" stroke-linecap="round"/>
 <ellipse cx="${50-ex-3}" cy="${ey+7}" rx="3.6" ry="2.2" fill="#e5806f" opacity="${K?.45:.28}"/><ellipse cx="${50+ex+3}" cy="${ey+7}" rx="3.6" ry="2.2" fill="#e5806f" opacity="${K?.45:.28}"/>
 ${a.fr?[[-11,5],[-8,7],[-12,8],[-9,9.5],[11,5],[8,7],[12,8],[9,9.5]].map(([x,y])=>`<circle cx="${50+x}" cy="${ey+y}" r=".75" fill="#9a5a3a" opacity=".75"/>`).join(''):''}
 ${a.mouth==='grin'?`<path d="M${50-7.5} ${ey+10} Q50 ${ey+19} ${50+7.5} ${ey+10}Z" fill="#7a2f2a" stroke="#5e2420" stroke-width="1.1" stroke-linejoin="round"/><path d="M${50-6.4} ${ey+10.4} h12.8 l-1 2.4 h-10.8Z" fill="#fff"/><rect x="${50-.6}" y="${ey+10.2}" width="1.2" height="2.8" fill="#7a2f2a"/><path d="M${50-3} ${ey+15.6} q3 1.6 6 0" stroke="#e5806f" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${50-9} ${ey+9.6} q-1.4 -1 -1.6 -2.4 M${50+9} ${ey+9.6} q1.4 -1 1.6 -2.4" stroke="${Sd}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
  :`<path d="M${50-5} ${ey+(K?11:12)} q5 ${K?5:4} 10 0" fill="${F?'#c4605a':'#9a4a3c'}" stroke="#7a3b2e" stroke-width="1.2" stroke-linejoin="round"/>`}`;
 // Haare vorn
 if(a.hair!=='bald'){front+=`<path d="M${50-rx-1} ${cy+1} C${50-rx-3} ${top-4} ${50-8} ${top-7} 50 ${top-6} C${50+8} ${top-7} ${50+rx+3} ${top-4} ${50+rx+1} ${cy+1} C${50+rx-3} ${cy-9} ${50+rx-8} ${top+6} ${50+4} ${top+8} C${50-2} ${top+13} ${50-12} ${top+12} ${50-rx+4} ${cy-6} C${50-rx+2} ${cy-3} ${50-rx+1} ${cy-1} ${50-rx-1} ${cy+1}Z" fill="${H}"/>
  <path d="M${50-12} ${top+1} q8 -4 18 -1 M${50-rx+4} ${top+8} q4 -6 10 -8" stroke="${Hl}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>`;
  if(a.hair==='curls')front+=[-14,-7,0,7,14].map((x,i)=>`<circle cx="${50+x}" cy="${top+6+(i%2?-1.5:1)}" r="5.2" fill="${i%2?shade(H,.1):H}"/>`).join('')+`<circle cx="${50-rx}" cy="${cy-3}" r="5" fill="${H}"/><circle cx="${50+rx}" cy="${cy-3}" r="5" fill="${H}"/>`;
  if(a.hair==='spiky')front+=[[-16,-2,-30],[-9,-7,-15],[-1,-9,0],[7,-7,14],[15,-3,28]].map(([x,y,r])=>`<path d="M${50+x-5} ${top+6} L${50+x} ${top+y-6} L${50+x+5} ${top+6}Z" fill="${H}" transform="rotate(${r} ${50+x} ${top+4})"/>`).join('')+`<path d="M${50-6} ${top+4} l3 6 l3 -5 l3 5 l3 -6" fill="${H}"/>`;
  if(a.hair==='short')front+=`<path d="M${50-rx-1} ${cy+1} q-1 -7 2 -12 M${50+rx+1} ${cy+1} q1 -7 -2 -12" stroke="${H}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if(a.hair==='braids')front+=[-1,1].map(sd=>{const x=50+sd*(rx+1.5);return Array.from({length:5},(_,i)=>`<ellipse cx="${x}" cy="${cy+5+i*6.2}" rx="4.4" ry="4" fill="${i%2?H:shade(H,-.08)}"/><path d="M${x-3} ${cy+5+i*6.2} q3 2 6 0" stroke="${Hd}" stroke-width="1" fill="none"/>`).join('')+`<rect x="${x-3.2}" y="${cy+33}" width="6.4" height="3.4" rx="1.6" fill="${GOLD}"/><path d="M${x-3} ${cy+36.4} l3 6 l3 -6Z" fill="${H}"/>`}).join('')}
 // Bart
 if(a.beard!=='none'){const len=a.beard==='short'?8:20;
  beard=`<path d="M${50-rx+1} ${cy+2} C${50-rx+1} ${chin+len*.6} ${50-8} ${chin+len} 50 ${chin+len} C${50+8} ${chin+len} ${50+rx-1} ${chin+len*.6} ${50+rx-1} ${cy+2} C${50+rx-4} ${cy+11} ${50+9} ${ey+9} ${50+5} ${ey+10} C${50+2} ${ey+16} ${50-2} ${ey+16} ${50-5} ${ey+10} C${50-9} ${ey+9} ${50-rx+4} ${cy+11} ${50-rx+1} ${cy+2}Z" fill="${H}"/>
  <path d="M${50-10} ${ey+9.5} C${50-6} ${ey+6.5} ${50-2} ${ey+7.5} 50 ${ey+9} C${50+2} ${ey+7.5} ${50+6} ${ey+6.5} ${50+10} ${ey+9.5} C${50+6} ${ey+11.5} ${50+2} ${ey+11} 50 ${ey+10.5} C${50-2} ${ey+11} ${50-6} ${ey+11.5} ${50-10} ${ey+9.5}Z" fill="${Hd}"/>
  <path d="M${50-8} ${chin} q-1 ${len*.5} 2 ${len*.8} M50 ${chin+2} v${len*.7} M${50+8} ${chin} q1 ${len*.5} -2 ${len*.8}" stroke="${Hd}" stroke-width="1.2" fill="none" opacity=".7"/>`;
  if(a.beard==='braided')beard+=`<path d="M${50-4} ${chin+len-2} v10 M${50+4} ${chin+len-2} v10" stroke="${H}" stroke-width="4.4" stroke-linecap="round"/><rect x="${50-6.2}" y="${chin+len+2}" width="4.4" height="3" rx="1" fill="${GOLD}"/><rect x="${50+1.8}" y="${chin+len+2}" width="4.4" height="3" rx="1" fill="${GOLD}"/>`}
 // Kopfbedeckung
 if(a.head==='helm')head=`<path d="M${50-rx-3} ${cy-5} C${50-rx-3} ${top-14} ${50+rx+3} ${top-14} ${50+rx+3} ${cy-5}Z" fill="#8b98a3"/><path d="M${50-rx+2} ${cy-9} C${50-rx+4} ${top-6} ${50-6} ${top-10} ${50-2} ${top-10}" stroke="#c9d3da" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M${50-rx-3} ${cy-5} h${2*rx+6}" stroke="#5d6870" stroke-width="3.6"/><path d="M50 ${top-11} V${cy-5} M${50-rx+1} ${cy-7} C${50-rx+4} ${top} ${50-4} ${top-9} 50 ${top-11} M${50+rx-1} ${cy-7} C${50+rx-4} ${top} ${50+4} ${top-9} 50 ${top-11}" stroke="#5d6870" stroke-width="2" fill="none"/>
  ${[-14,-7,0,7,14].map(x=>`<circle cx="${50+x}" cy="${cy-5}" r="1" fill="#c9d3da"/>`).join('')}<path d="M${50-2.2} ${cy-5} h4.4 l-.6 ${K?9:11} q-1.6 1.4 -3.2 0Z" fill="#6c7880"/>`;
 if(a.head==='band')head=`<path d="M${50-rx-1} ${cy-10} C${50-10} ${cy-15} ${50+10} ${cy-15} ${50+rx+1} ${cy-10} L${50+rx+1} ${cy-5} C${50+10} ${cy-10} ${50-10} ${cy-10} ${50-rx-1} ${cy-5}Z" fill="${C}"/><path d="M${50-rx+2} ${cy-8.5} C${50-10} ${cy-12.6} ${50+10} ${cy-12.6} ${50+rx-2} ${cy-8.5}" stroke="#f0e2b6" stroke-width="1.3" stroke-dasharray="2 1.6" fill="none"/>`;
 if(a.head==='circlet')head=`<path d="M${50-rx} ${cy-11} Q50 ${cy-17} ${50+rx} ${cy-11}" fill="none" stroke="${GOLD}" stroke-width="2.6"/><path d="M${50-rx} ${cy-11} Q50 ${cy-17} ${50+rx} ${cy-11}" fill="none" stroke="#fff3c4" stroke-width=".8" opacity=".7"/><circle cx="50" cy="${cy-15.5}" r="2.8" fill="#4fa3d9" stroke="${GOLD}" stroke-width="1.2"/>`;
 if(a.head==='hood')head=`<path d="M${50-rx-7} ${cy+8} C${50-rx-8} ${top-8} ${50+rx+8} ${top-8} ${50+rx+7} ${cy+8} C${50+rx+2} ${top+2} ${50-rx-2} ${top+2} ${50-rx-7} ${cy+8}Z" fill="#d8c3a0"/>${Array.from({length:9},(_,i)=>{const t=i/8,x=50-rx-6+t*(2*rx+12),y=cy+6-Math.sin(t*Math.PI)*(ry+12);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#e9dcc4"/>`}).join('')}`;
 if(a.acc==='shield')extra+=`<g transform="translate(25 83)"><circle r="16" fill="#b5854f" stroke="#6b4a26" stroke-width="2.4"/>${[0,1,2,3].map(i=>`<path d="M0 0 L${(16*Math.cos(i*Math.PI/2+.4)).toFixed(1)} ${(16*Math.sin(i*Math.PI/2+.4)).toFixed(1)}" stroke="#8a6234" stroke-width="1.2"/>`).join('')}<path d="M0 -12 A12 12 0 0 1 12 0 A8 8 0 0 1 4 8 A5 5 0 0 1 -1 3" fill="none" stroke="#2f7fb8" stroke-width="2.6" stroke-linecap="round"/><circle r="4.6" fill="#9aa6ae" stroke="#5d6870" stroke-width="1.2"/><circle cx="-1.4" cy="-1.4" r="1.4" fill="#e4eaee"/></g>`;
 if(a.feather)extra+=`<g transform="rotate(35 ${50+rx-2} ${top+4})"><path d="M${50+rx-2} ${top+4} q-3 -10 0 -18 q3 8 0 18Z" fill="#f4f6f7" stroke="#9aa7b0" stroke-width=".9"/><path d="M${50+rx-2} ${top+4} v-16" stroke="#9aa7b0" stroke-width=".7"/><path d="M${50+rx-2} ${top-12} q-1.6 -2 0 -4 q1.6 2 0 4Z" fill="#3a4148"/></g>`;
 const bgc=bg||'var(--sea)';
 return `<svg class="av-svg" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><defs><clipPath id="avc${id}"><circle cx="50" cy="50" r="50"/></clipPath><radialGradient id="avg${id}" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><g clip-path="url(#avc${id})"><rect width="100" height="100" fill="${bgc}"/><rect width="100" height="100" fill="url(#avg${id})"/>${back}${body}${face}${beard}${front}${head}${extra}</g></svg>`}

/* ---------- Seeungeheuer aus der nordischen Sagenwelt ---------- */
const MONSTERS=[
 {id:'hronn',name:'Hrönn',lore:'Eine der neun Wellentöchter des Meeresriesen Ægir.'},
 {id:'nykur',name:'Nykur',lore:'Das Wasserpferd aus Island lockt Reiter in die Tiefe.'},
 {id:'margygr',name:'Margygr',lore:'Die Meertrollin mit Haaren aus Tang kündigt Stürme an.'},
 {id:'lyngbakr',name:'Lyngbakr',lore:'Ein Wal so groß, dass Seeleute ihn für eine Insel hielten.'},
 {id:'sjodraugr',name:'Sjódraugr',lore:'Der Seegeist eines Ertrunkenen segelt in einem halben Boot.'},
 {id:'kraken',name:'Kraken',lore:'Der Riesenkrake aus nordischen Seemannsgeschichten.'},
 {id:'hafgufa',name:'Hafgufa',lore:'Ein Meeresungeheuer mit einem Maul so groß wie eine Bucht.'},
 {id:'jormungandr',name:'Jörmungandr',lore:'Die Midgardschlange liegt im Meer rund um die ganze Welt.'}];
const monById=id=>MONSTERS.find(m=>m.id===id)||MONSTERS[0];
function monsterSVG(id,size){size=size||110;const eye=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x+r*.2}" cy="${y+r*.15}" r="${r*.55}" fill="#1d2a33"/><circle cx="${x+r*.4}" cy="${y-r*.15}" r="${r*.2}" fill="#fff"/>`;
 const water=`<path d="M0 74 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V90 H0Z" fill="#2f7fb5" opacity=".35"/><path d="M0 78 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#e8f4fb" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`;
 const art={
 jormungandr:`<path d="M8 76 q12 -30 24 0 M38 76 q12 -30 24 0" fill="none" stroke="#2f9e8f" stroke-width="13" stroke-linecap="round"/><path d="M14 58 l4 -6 4 6 M44 58 l4 -6 4 6" fill="#1f6f64"/><path d="M68 76 C66 46 82 30 98 34" fill="none" stroke="#2f9e8f" stroke-width="14" stroke-linecap="round"/><ellipse cx="100" cy="36" rx="16" ry="12" fill="#2f9e8f"/><path d="M86 26 l4 -8 4 7 l4 -8 4 8" fill="#1f6f64"/><path d="M108 42 l2 5 2 -5" fill="#fff"/><ellipse cx="111" cy="38" rx="2" ry="1.2" fill="#1f6f64"/>${eye(98,32,5)}`,
 kraken:`${[18,36,84,102].map((x,i)=>`<path d="M${x} 76 C${x+(i<2?-8:8)} 62 ${x+(i<2?6:-6)} 56 ${x+(i<2?-2:2)} 48" fill="none" stroke="#7b4bb0" stroke-width="9" stroke-linecap="round"/>`).join('')}<ellipse cx="60" cy="44" rx="28" ry="30" fill="#7b4bb0"/><ellipse cx="60" cy="30" rx="16" ry="9" fill="#9a6cd0" opacity=".7"/>${eye(49,46,8)}${eye(71,46,8)}<path d="M52 62 q8 6 16 0" fill="none" stroke="#4e2b78" stroke-width="3" stroke-linecap="round"/>${[22,40,80,98].map(x=>`<circle cx="${x}" cy="66" r="2" fill="#c9a8ee"/>`).join('')}`,
 hafgufa:`<path d="M14 76 C14 30 50 12 84 22 C104 28 112 50 106 76Z" fill="#2c4a8a"/><path d="M34 76 C38 50 60 40 86 46 C96 50 98 64 96 76Z" fill="#1a1a2e"/>${[42,52,62,72,82,90].map(x=>`<path d="M${x} ${x<60?54:48} l4 8 4 -8" fill="#fff"/>`).join('')}<circle cx="60" cy="30" r="9" fill="#ffd54a"/><circle cx="62" cy="31" r="4.5" fill="#1d2a33"/><circle cx="63.5" cy="29" r="1.6" fill="#fff"/><path d="M84 22 C92 10 102 8 108 12" fill="none" stroke="#2c4a8a" stroke-width="4" stroke-linecap="round"/><circle cx="109" cy="13" r="4" fill="#ffd54a"/>`,
 lyngbakr:`<ellipse cx="60" cy="72" rx="52" ry="18" fill="#5b7a99"/><path d="M30 60 C40 48 76 46 92 58Z" fill="#7cb342"/><rect x="58" y="36" width="4" height="14" fill="#6d4c2f"/><path d="M50 42 L60 24 L70 42Z" fill="#3e7d32"/><path d="M52 34 L60 18 L68 34Z" fill="#4a9a3c"/>${eye(26,66,5)}<path d="M18 74 q6 4 12 0" fill="none" stroke="#3d556d" stroke-width="2.5" stroke-linecap="round"/><path d="M98 52 q-4 -10 0 -18 M98 52 q4 -10 10 -14" fill="none" stroke="#bfe3f5" stroke-width="3" stroke-linecap="round"/>`,
 nykur:`<path d="M44 78 C40 52 48 32 64 24 C78 18 96 24 100 36 C104 46 96 52 86 50 C80 56 76 66 78 78Z" fill="#8e9aa6"/><ellipse cx="96" cy="42" rx="11" ry="8" fill="#a5b0ba"/><circle cx="100" cy="42" r="1.8" fill="#4a5560"/><path d="M66 22 l4 -10 4 9" fill="#8e9aa6"/>${eye(80,32,5)}<path d="M62 26 C52 30 50 40 54 48 M58 30 C46 36 44 48 48 58 M56 38 C44 46 42 58 46 68" fill="none" stroke="#3d8b5a" stroke-width="5" stroke-linecap="round"/>`,
 margygr:`<path d="M32 78 C30 46 44 30 60 30 C76 30 90 46 88 78Z" fill="#6fae8f"/>${eye(50,52,7)}${eye(70,52,7)}<path d="M50 66 q10 8 20 0" fill="none" stroke="#2e6b4a" stroke-width="3" stroke-linecap="round"/><path d="M58 70 v4 h4 v-4" fill="#fff"/><path d="M36 44 C24 46 20 60 22 76 M40 36 C30 34 24 40 18 50 M60 30 C56 18 64 12 70 16 M80 36 C92 34 98 44 100 56 M84 46 C96 52 98 66 96 76" fill="none" stroke="#2e6b4a" stroke-width="6" stroke-linecap="round"/><circle cx="86" cy="62" r="4" fill="#f4c7d0"/>`,
 sjodraugr:`<path d="M20 70 L56 70 L52 80 L24 80Z" fill="#6d4c2f"/><path d="M38 70 C34 44 38 22 54 18 C70 14 82 30 80 48 C80 58 84 64 90 70 C80 72 74 66 72 62 C68 70 60 72 54 66 C50 72 42 74 38 70Z" fill="#cfe3ee" opacity=".95"/><ellipse cx="54" cy="38" rx="4" ry="6" fill="#2b3a44"/><ellipse cx="68" cy="38" rx="4" ry="6" fill="#2b3a44"/><path d="M56 52 q6 4 10 0" fill="none" stroke="#2b3a44" stroke-width="2.5" stroke-linecap="round"/><line x1="88" y1="40" x2="88" y2="56" stroke="#6d4c2f" stroke-width="2"/><rect x="83" y="56" width="10" height="12" rx="2" fill="#ffd54a"/><circle cx="88" cy="62" r="10" fill="#ffd54a" opacity=".3"/>`,
 hronn:`<path d="M8 78 C10 40 40 14 74 16 C98 18 112 34 108 50 C104 60 92 60 88 52 C86 44 92 40 96 44 C94 34 80 30 70 36 C56 44 54 62 60 78Z" fill="#3d8fd1"/><path d="M74 16 C98 18 112 34 108 50 C104 60 92 60 88 52 C86 44 92 40 96 44" fill="none" stroke="#e8f4fb" stroke-width="5" stroke-linecap="round"/>${eye(30,48,6)}${eye(46,42,6)}<path d="M28 62 q10 8 20 -2" fill="none" stroke="#1f5f96" stroke-width="3" stroke-linecap="round"/>`};
 return `<svg class="monster m-${id}" viewBox="0 0 120 90" width="${size}" height="${Math.round(size*.75)}" aria-hidden="true">${art[id]||art.hronn}${water}</svg>`}
const slainList=()=>db.slain||[];
const monsterNext=()=>MONSTERS[slainList().length%MONSTERS.length];
const slainToday=()=>slainList().some(x=>dayKey(x.t)===dayKey());

function shipSVG(w){w=w||56;return `<svg viewBox="0 0 64 56" width="${w}" height="${Math.round(w*56/64)}" aria-hidden="true">
 <line x1="32" y1="5" x2="32" y2="38" stroke="#5a3a1e" stroke-width="2.5"/>
 <path d="M17 10 H47 L45 32 H19 Z" fill="#f4ecdc" stroke="#5a3a1e" stroke-width="1.5" stroke-linejoin="round"/>
 <path d="M23 10 H29 L28.6 32 H22.2Z M35 10 H41 L41.8 32 H35.4Z" fill="#c8372d"/>
 <line x1="15" y1="9.5" x2="49" y2="9.5" stroke="#5a3a1e" stroke-width="2.5" stroke-linecap="round"/>
 <path d="M6 36 C14 47 50 47 58 36 Z" fill="#8a5a34" stroke="#4a2e17" stroke-width="2" stroke-linejoin="round"/>
 <path d="M10 36 C4 31 4 24 8 21 C10 19 13 21 11 24" fill="none" stroke="#4a2e17" stroke-width="3" stroke-linecap="round"/>
 <path d="M54 36 C60 30 60 22 56 17" fill="none" stroke="#4a2e17" stroke-width="3" stroke-linecap="round"/><path d="M55 18 L61 14 L62 19 Z" fill="#4a2e17"/>
 ${[17,25,33,41,49].map((x,i)=>`<circle cx="${x}" cy="38.5" r="3.2" fill="${i%2?'#c8372d':'#e0b13a'}" stroke="#4a2e17" stroke-width="1.2"/>`).join('')}
 <path d="M2 49 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="var(--accent)" stroke-width="2" opacity=".55"/></svg>`}
const ANCHOR='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="5" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5V21M7 11h10M4 14c0 4 3.6 7 8 7s8-3 8-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const gullName=()=>(db.me&&db.me.gull)||'deine Möwe';
const dayIdx=()=>Math.floor(dayStart()/DAY);
const pickDay=a=>a[dayIdx()%a.length];
function weekKey(t){const d=new Date(t);const off=(d.getDay()+6)%7;return dayKey(dayStart(t)-off*DAY+12*36e5)}
function dayActive(k){return (db.log[k]||0)>=goalVal()||!!(db.watch&&db.watch[k])}
function streakInfo(){const flaute=new Set(),perWeek={};let n=0,first=null,t=dayStart()+12*36e5;
 if(dayActive(dayKey(t))){n++;first=t}t-=DAY;let pending=[];
 for(let i=0;i<1500;i++){const k=dayKey(t);
  if(dayActive(k)){n++;first=t;pending.forEach(p=>flaute.add(p));pending=[]}
  else{const wk=weekKey(t);if((perWeek[wk]||0)<2){perWeek[wk]=(perWeek[wk]||0)+1;pending.push(k)}else break}
  t-=DAY}
 const tw=weekKey(dayStart()+12*36e5);let used=0;flaute.forEach(k=>{if(weekKey(new Date(k+'T12:00').getTime())===tw)used++});
 return {n,flaute,usedThisWeek:used,yesterdayFlaute:flaute.has(dayKey(dayStart()-DAY+12*36e5))}}
function streak(){return streakInfo().n}
function weekRow(si){const mon=dayStart()-((new Date().getDay()+6)%7)*DAY;const names=['Mo','Di','Mi','Do','Fr','Sa','So'];
 return `<div class="week" role="list" aria-label="Diese Woche">${names.map((nm,i)=>{const t=mon+i*DAY+12*36e5,k=dayKey(t),isToday=k===dayKey();
  const st=dayActive(k)?'on':si.flaute.has(k)?'flaute':isToday?'now':t>now()?'future':'miss';
  const lbl={on:'Wache gehalten',flaute:'Flautetag',future:'kommt noch',now:'heute',miss:'ausgefallen'}[st];
  return `<span class="wd ${st}${isToday?' is-today':''}" role="listitem" aria-label="${nm}: ${lbl}"><i>${st==='on'?'✓':st==='flaute'?'~':''}</i>${nm}</span>`}).join('')}</div>`}
function activeCourse(){return (db.courses||[]).filter(c=>c.lang===activeLang()&&c.units.some(u=>u.status==='open')).sort((a,b)=>(b.upd||0)-(a.upd||0))[0]||null}
function gullMsg(){const me=db.me||{},you=me.name?`, ${esc(me.name)}`:'',k=dayKey(),watched=db.watch&&db.watch[k],due=allDue().length,si=streakInfo(),h=new Date().getHours();
 const hi=h<5?'Noch wach':h<11?'Moin':h<18?'Ahoi':'Guten Abend';const c=activeCourse(),cur=c&&c.units.find(u=>u.status==='open'),L=activeLang(),slain=slainList().length;
 if(si.yesterdayFlaute&&si.n&&!watched&&Math.random()<.5)return `${hi}${you}! Gestern war Flaute. Kein Problem, deine Serie hält.`;
 const pool=[`${hi}${you}!`,'Steife Brise heute. Gut für den Kopf.','Wusstest du? Wikinger segelten bis nach Nordamerika.','Ich hab heute schon drei Pommes gefunden. Und du?','Ein Wort am Tag hält das Vergessen fern.','Kräh! Schön, dass du da bist.'];
 if(watched)pool.push(`Wache gehalten${you}! ${si.n>1?`${si.n} Tage auf Kurs.`:'Guter Start.'}`,'Das Ungeheuer von heute ist erledigt. Zeit für ein Fischbrötchen.');
 if(due&&!watched)pool.push(`${due} ${due===1?'Wort will':'Wörter wollen'} wiederholt werden.`,`${due} Wörter klopfen an die Kajütentür.`);
 if(cur)pool.push(`Nächster Hafen: ${esc(cur.title)}. Leinen los?`,cur.grammar?`In „${esc(cur.title)}“ geht es um ${esc(cur.grammar)}.`:`Bald kommt „${esc(cur.title)}“.`);
 if(si.n>=3)pool.push(`${si.n} Tage am Stück. Respekt, Käpt'n!`);
 if(L)pool.push(`${hi}${you}! Heute ${langName(L)}? Gute Wahl.`);
 if(slain)pool.push(`${slain} Seeungeheuer besiegt. Die Skalden werden davon singen.`);
 if(h>=21||h<6)pool.push('Gähn … Nachtwache? Ich halte die Augen offen. Fast.');
 return pool[Math.floor(Math.random()*pool.length)]}
function deck(){const me=db.me||{},si=streakInfo(),k=dayKey(),watched=db.watch&&db.watch[k],today=db.log[k]||0,goal=goalVal(),due=allDue().length;
 if(!me.gull)return `<section class="deck" aria-label="Deine Möwe"><div class="gull-row">${gullSVG('happy')}<div class="bubble"><b>Kräh! Ich bin deine Möwe und begleite dich auf deinem Törn. Wie soll ich heißen?</b>
  <form class="write" id="gull-form" autocomplete="off"><input id="gull-name" maxlength="20" placeholder="z. B. Fiete" aria-label="Name der Möwe"><button class="btn primary">Taufen</button></form>
  <div class="chips">${['Fiete','Mia','Krächz','Luv','Smutje'].map(n=>`<button class="chip" data-act="gull-pick" data-n="${n}">${n}</button>`).join('')}</div>
  <label class="fld"><span>Und wie soll ich dich nennen? (freiwillig)</span><input id="gull-you" maxlength="24" value="${esc(me.name||'')}" placeholder="z. B. Micha"></label></div></div></section>`;
 return `<section class="deck" aria-label="${esc(me.gull)} und deine Wache"><div class="gull-row"><button class="gull-host" id="gull-host" data-act="gull-tap" aria-label="${esc(me.gull)} antippen">${gullSVG(watched?'happy':'idle',88)}</button><div class="bubble" id="gull-say" aria-live="polite"><span class="gull-name">${esc(me.gull)}</span><p>${gullMsg()}</p>${gullChatBtn()}</div></div>
 <button class="btn primary wide watch-btn" data-act="watch"><span class="wb-mon">${monsterSVG(monsterNext().id,54)}</span><span class="wb-txt"><b>${watched?'Noch eine Wache':'Eine Wache'}: ${esc(monsterNext().name)} besiegen</b><small>ca. 5 Minuten${activeLang()?' · '+langName(activeLang()):''}</small></span></button>
 ${weekRow(si)}
 <div class="row-between deck-stats"><span class="streak">${si.n} ${si.n===1?'Tag':'Tage'} auf Kurs</span><span class="hint">Flautetage diese Woche: ${si.usedThisWeek} von 2</span></div>
 <button class="linkbtn" data-act="trophies" style="align-self:flex-start">Besiegte Seeungeheuer: ${slainList().length}</button>
 <div class="goal"><div class="row-between"><span>Tagesziel: <b>${Math.min(today,goal)} / ${goal}</b> Antworten</span>${due?`<button class="linkbtn" data-act="review-all">Alle ${due} fälligen wiederholen</button>`:'<span class="hint">Nichts fällig</span>'}</div><div class="pbar"><i style="width:${Math.min(1,today/goal)*100}%"></i></div></div></section>`}
function watchNewSet(){const c=activeCourse(),u=c&&c.units.find(x=>x.status==='open'&&x.kind!=='exam'),s=u&&u.setId&&getSet(u.setId);
 if(s&&s.cards.some(k=>k.lv<1))return s;return db.sets.filter(x=>!x.course&&inLang(x)).find(x=>x.cards.some(k=>k.lv<1))||db.sets.filter(inLang).find(x=>x.cards.some(k=>k.lv<1))||null}
function startWatch(){const due=shuffle(allDue()).slice(0,8);const items=due.map(it=>({...it,isNew:false}));
 if(items.length<6){const s=watchNewSet();if(s)shuffle(s.cards.filter(k=>k.lv<1)).slice(0,Math.min(4,8-items.length)).forEach(k=>items.push({sid:s.id,cid:k.id,isNew:true}))}
 if(!items.length)return toast(`${gullName()} sagt: Gerade ist nichts zu tun. Probier ein Gespräch oder einen Text!`);
 go('q',{back:'home',id:null,Q:{kind:'watch',monster:monsterNext().id,items:shuffle(items),session:items.slice(),failed:new Set(),done:0,cur:null}})}
function watchDone(Q){const k=dayKey(),first=!(db.watch&&db.watch[k]);db.watch=db.watch||{};db.watch[k]=true;db.slain=db.slain||[];db.slain.push({t:now(),m:Q.monster,lang:activeLang()});save();return first}
function vWatchDone(Q){const first=Q.marked!=null?Q.marked:(Q.marked=watchDone(Q));const mon=monById(Q.monster);const si=streakInfo(),c=activeCourse(),cur=c&&c.units.find(u=>u.status==='open');
 app.innerHTML=bar('home')+`<section class="summary"><div class="victory"><span class="defeated">${monsterSVG(mon.id,120)}</span>${gullSVG('cheer',96)}</div>
 <h1>${esc(mon.name)} ist besiegt!</h1><p class="hint">${esc(mon.lore)}</p><p class="muted">${esc(gullName())}: „${pickDay(['Kräh! Gut gemacht.','Saubere Arbeit, Matrose.','Das Schiff liegt gut im Wind.','So wird das was mit C2!'])}“</p>
 <div class="big-nums"><div><b class="g">${Q.done}</b><span>Wörter</span></div><div><b style="color:var(--signal)">${si.n}</b><span>${si.n===1?'Tag':'Tage'} auf Kurs</span></div></div>
 ${weekRow(si)}
 <button class="linkbtn" data-act="trophies">Alle besiegten Seeungeheuer ansehen</button>
 <div class="stack">${cur?`<button class="btn primary wide" data-act="unit" data-id="${c.id}" data-uid="${cur.id}">Weiter zum nächsten Hafen: ${esc(cur.title)}</button>`:''}<button class="btn wide ${cur?'':'primary'}" data-act="back" data-to="home">Zur Startseite</button></div></section>`}
function icsReminder(time){const [h,m]=(time||'19:00').split(':').map(x=>String(+x||0).padStart(2,'0'));const d=new Date(),ymd=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
 const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');const url=location.href.split('#')[0];
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Vokabelkoje//DE','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:vokabelkoje-wache-${uid()}@vokabelkoje`,`DTSTAMP:${stamp}`,`DTSTART:${ymd}T${h}${m}00`,'DURATION:PT5M','RRULE:FREQ=DAILY',
  `SUMMARY:Eine Wache mit ${gullName()}`,`DESCRIPTION:5 Minuten Vokabelkoje: ${url}`,`URL:${url}`,'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY',`DESCRIPTION:Zeit für eine Wache mit ${gullName()}!`,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n'}
