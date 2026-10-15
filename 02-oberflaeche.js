// Vokabelkoje – oberflaeche
/* ---------- Ansicht & Navigation ---------- */
let view={name:'home'}, timer=null, starOnly={};
const getSet=id=>db.sets.find(s=>s.id===id);
const card=(s,id)=>s&&s.cards.find(c=>c.id===id);
const pool=s=>starOnly[s.id]?s.cards.filter(c=>c.star):s.cards;
function go(name,p={}){if(name==='home'&&!p.tab)p.tab=lastTab;clearInterval(timer);if(typeof stopGull==='function')stopGull();timer=null;stopListen();if(view.H)view.H.stopped=true;releaseWake();stopSpeak();
 view={name,...p};render();window.scrollTo(0,0)}
function render(){({home:vHome,set:vSet,edit:vEdit,flash:vFlash,q:vQ,test:vTest,match:vMatch,hands:vHands,voices:vVoices,listen:vListen,gull:vGull,dict:vDict,pron:vPron,backup:vBackup,reader:vReader,talk:vTalk,check:vCheck,drill:vDrill,courseNew:vCourseNew,course:vCourse,unit:vUnit,logbook:vLogbook,profiles:vProfiles,langPick:vLangPick,trophies:vTrophies,kid:vKid})[view.name]();if(view.name==='home'){hookChart();hookGull()}else stopGull();try{voiceNote(view.name==='kid'?kidLang():null)}catch(e){}if(view.name==='course')hookMap()}
let toastT;function toast(msg){if(!msg)return;const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2200)}
let wake=null;async function keepAwake(){try{if(navigator.wakeLock&&!wake)wake=await navigator.wakeLock.request('screen')}catch(e){}}
function releaseWake(){try{if(wake)wake.release()}catch(e){}wake=null}

/* ---------- Neue Version ---------- */
// Läuft die App lange im Hintergrund, kommt ein Update erst beim nächsten Start an. Dann Hinweis mit „Jetzt neu laden“.
function showUpdate(){if(document.getElementById('upd'))return;const d=document.createElement('div');d.id='upd';d.className='upd-bar';d.setAttribute('role','status');
 d.innerHTML='<span>Neue Version der Vokabelkoje ist da.</span><button type="button" id="upd-go">Jetzt neu laden</button><button type="button" class="ghost" id="upd-later">Später</button>';
 document.body.appendChild(d);d.querySelector('#upd-go').onclick=()=>{try{save()}catch(e){}location.reload()};d.querySelector('#upd-later').onclick=()=>d.remove()}
function watchUpdates(){try{if(!STANDALONE||!('serviceWorker' in navigator))return;const sw=navigator.serviceWorker;let had=!!sw.controller;
 sw.addEventListener('controllerchange',()=>{if(had)showUpdate();had=true});
 const check=()=>{if(learnOffline())return;sw.getRegistration().then(r=>r&&r.update()).catch(()=>{})};
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});setInterval(check,30*60*1000)}catch(e){}}

/* ---------- Online oder offline lernen ---------- */
// Offline heißt: kein Netz ODER bewusst gewählter Offline-Modus (z. B. unterwegs ohne Datenvolumen).
let netOnline=(()=>{try{return navigator.onLine!==false}catch(e){return true}})();
const learnOffline=()=>prefs.netMode==='offline'||!netOnline;
const offlineMsg=()=>prefs.netMode==='offline'?'Du lernst gerade offline. KI braucht Internet: Oben auf das Netz-Symbol tippen, um wieder online zu lernen.':'Gerade kein Internet. Die KI-Funktionen gehen wieder, sobald du online bist.';
function netChanged(){const was=netOnline;try{netOnline=navigator.onLine!==false}catch(e){}if(was===netOnline)return;
 toast(netOnline?'Wieder online: KI und Gemini-Stimme sind zurück':'Offline: Lernen, Wachen und gespeicherte Stimmen laufen weiter, die KI pausiert');
 if(netOnline&&typeof sync==='function'&&canSync())setTimeout(sync,1500);
 if(['home','voices','kid'].includes(view.name)&&!busyTyping())render();else voiceNote()}
try{addEventListener('online',netChanged);addEventListener('offline',netChanged)}catch(e){}
const NET_ON='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2.5 9a14 14 0 0 1 19 0"/><path d="M5.8 12.6a9 9 0 0 1 12.4 0"/><path d="M9.1 16.1a4.4 4.4 0 0 1 5.8 0"/></g><circle cx="12" cy="19.4" r="1.6" fill="currentColor"/></svg>';
const NET_OFF='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2.5 9a14 14 0 0 1 6-3.3M13.5 5.3A14 14 0 0 1 21.5 9"/><path d="M5.8 12.6a9 9 0 0 1 3.4-2M15 10.4a9 9 0 0 1 3.2 2.2"/><path d="M9.1 16.1a4.4 4.4 0 0 1 5.8 0"/><path d="M3 3l18 18"/></g><circle cx="12" cy="19.4" r="1.6" fill="currentColor"/></svg>';
const netBtn=()=>{const off=learnOffline();return `<button class="net-btn ${off?'off':''}" data-act="net-mode" aria-label="${off?'Du lernst offline':'Du lernst online'}${netOnline?' – antippen zum Umschalten':''}" title="${off?'Offline':'Online'}">${off?NET_OFF:NET_ON}</button>`};

/* ---------- Vorlesen ---------- */
// Zwei Wege: die Stimme des Geräts (Web Speech) und, in der GitHub-Version mit Gemini-Schlüssel, eine Gemini-Stimme als Ersatz.
const hasTTS=(()=>{try{return 'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined'}catch(e){return false}})();
let voices=[],ttsErr='',ttsOk=false,curU=null,ttsHinted=false,lastSay={t:'',at:0};
function loadVoices(){try{voices=hasTTS?(speechSynthesis.getVoices()||[]):[]}catch(e){voices=[]}}
if(hasTTS){loadVoices();try{speechSynthesis.addEventListener('voiceschanged',()=>{loadVoices();if(view.name==='voices')render();else voiceNote()})}catch(e){}}
const vlang=v=>(v.lang||'').replace('_','-').toLowerCase();
function voicesFor(lang){const base=lang.split('-')[0].toLowerCase();return voices.filter(v=>vlang(v).split('-')[0]===base)}
function rankVoice(v,lang){let s=0;const n=v.name||'';
 if(/natural|neural|wavenet/i.test(n))s+=50;if(/premium|enhanced|erweitert|verbessert/i.test(n))s+=40;if(/online/i.test(n))s+=20;if(/google/i.test(n))s+=15;
 if(vlang(v)===lang.toLowerCase())s+=10;if(/compact|kompakt|eloquence/i.test(n))s-=20;return s}
const ranked=lang=>voicesFor(lang).sort((a,b)=>rankVoice(b,lang)-rankVoice(a,lang));
function pickVoice(lang){const list=ranked(lang);if(!list.length)return null;const want=(prefs.voices||{})[lang];return (want&&list.find(v=>v.voiceURI===want))||list[0]}
// Gemini-Stimme
const TTS_MODELS=['gemini-3.1-flash-tts-preview','gemini-2.5-flash-preview-tts'];
const cloudOK=()=>STANDALONE&&!!(prefs.gemKey||'').trim();
const noDeviceVoice=lang=>!hasTTS||(voices.length>0&&!voicesFor(lang).length);
const wantCloud=lang=>cloudOK()&&(prefs.ttsEngine==='gemini'||noDeviceVoice(lang));
const audioCache=new Map();let player=null,audioUnlocked=false,speakGen=0;
const SILENT_WAV='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
function getPlayer(){if(!player){try{player=new Audio();player.preload='auto'}catch(e){player=null}}return player}
function pcmToWav(b64,rate){const bin=atob(b64),n=bin.length,buf=new ArrayBuffer(44+n),d=new DataView(buf);const w=(o,s)=>{for(let i=0;i<s.length;i++)d.setUint8(o+i,s.charCodeAt(i))};
 w(0,'RIFF');d.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,rate,true);d.setUint32(28,rate*2,true);d.setUint16(32,2,true);d.setUint16(34,16,true);w(36,'data');d.setUint32(40,n,true);
 const u8=new Uint8Array(buf,44);for(let i=0;i<n;i++)u8[i]=bin.charCodeAt(i);return new Blob([buf],{type:'audio/wav'})}
const enLang=l=>{try{return new Intl.DisplayNames(['en'],{type:'language'}).of(short(l))}catch(e){return short(l)}};
// Gemini-Audio bleibt im Browser gespeichert: spart Tageslimit und klappt danach auch offline
const AUDIO_STORE='vokabelkoje-audio',audioReq=key=>'https://vokabelkoje.audio/'+encodeURIComponent(key);
const hasStore=()=>{try{return typeof caches!=='undefined'&&!!caches.open}catch(e){return false}};
async function audioFromStore(key){if(!hasStore())return null;try{const c=await caches.open(AUDIO_STORE),r=await c.match(audioReq(key));return r?URL.createObjectURL(await r.blob()):null}catch(e){return null}}
async function audioToStore(key,blob){if(!hasStore())return;try{const c=await caches.open(AUDIO_STORE);await c.put(audioReq(key),new Response(blob,{headers:{'Content-Type':'audio/wav'}}));
 const ks=await c.keys();if(ks.length>800)for(const k of ks.slice(0,ks.length-800))await c.delete(k)}catch(e){}}
async function audioStoreCount(){if(!hasStore())return 0;try{return (await (await caches.open(AUDIO_STORE)).keys()).length}catch(e){return 0}}
async function audioStoreClear(){audioCache.clear();if(hasStore())try{await caches.delete(AUDIO_STORE)}catch(e){}}
class OfflineMiss extends Error{}
const audioKey=(text,lang)=>lang+'|'+(prefs.ttsVoice||'Kore')+'|'+text;
async function cloudAudio(text,lang,opt={}){const key=audioKey(text,lang);if(audioCache.has(key))return audioCache.get(key);
 const stored=await audioFromStore(key);if(stored){audioCache.set(key,stored);return stored}
 if(learnOffline())throw new OfflineMiss('Offline: Dieses Wort ist noch nicht gespeichert');
 let last='';
 for(const m of TTS_MODELS){let r;
  try{r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':prefs.gemKey.trim()},
   body:JSON.stringify({contents:[{parts:[{text:`Read aloud clearly in ${enLang(lang)}, nothing else: ${text}`}]}],generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:prefs.ttsVoice||'Kore'}}}}})})}
  catch(e){throw new Error('Keine Verbindung zu Gemini')}
  if(r.ok){const j=await r.json();const part=(((j.candidates||[])[0]||{}).content||{}).parts||[];const inl=(part.find(p=>p.inlineData)||{}).inlineData;
   if(inl&&inl.data){const rate=+((/rate=(\d+)/.exec(inl.mimeType||'')||[])[1])||24000;const blob=pcmToWav(inl.data,rate),url=URL.createObjectURL(blob);audioToStore(key,blob);
    if(audioCache.size>150){const k0=audioCache.keys().next().value;try{URL.revokeObjectURL(audioCache.get(k0))}catch(e){}audioCache.delete(k0)}
    audioCache.set(key,url);return url}last='Gemini hat kein Audio geliefert'}
  else{if(r.status===429&&opt.stopOnLimit){const e=new Error('Gemini-Tageslimit für Stimmen erreicht');e.limit=true;throw e}last=r.status===429?'Gemini-Tageslimit für Stimmen erreicht':r.status===400||r.status===403?'Gemini-Schlüssel passt nicht für Stimmen':'Gemini-Stimme nicht erreichbar ('+r.status+')';if(r.status===400||r.status===403)break}}
 throw new Error(last)}
function cloudSpeak(t,lang,slow,fin,gen,fallback){const p=getPlayer();if(!p){if(fallback)return fallback();fin();return}
 cloudAudio(t,lang).then(url=>{if(gen!==speakGen)return fin();p.onended=()=>{ttsOk=true;fin()};p.onerror=()=>{ttsErr='Abspielen ging nicht';fin()};p.src=url;p.playbackRate=slow?.75:1;
  const pr=p.play();if(pr&&pr.catch)pr.catch(e=>{ttsErr=/NotAllowed/i.test(e&&e.name||'')?'not-allowed':'Abspielen ging nicht';if(ttsErr==='not-allowed')toast('Zum Anhören einmal auf den Lautsprecher tippen');fin()});ttsErr=''})
 .catch(e=>{if(gen!==speakGen)return fin();if(fallback){if(!(e instanceof OfflineMiss))ttsErr=e.message;return fallback()}ttsErr=e.message;if(e instanceof OfflineMiss&&!hasTTS)voiceNote(lang,true);else toast(e.message);fin()})}
function stopSpeak(){speakGen++;try{if(hasTTS)speechSynthesis.cancel()}catch(e){}if(player){try{player.pause()}catch(e){}}}
// Lange Texte in Sätze teilen (Chrome bricht lange Äußerungen nach ca. 15 s ab)
function chunks(t){if(t.length<=180)return [t];const out=[];let cur='';(t.match(/[^.!?…;:\n]+[.!?…;:\n]*\s*/g)||[t]).forEach(s=>{if((cur+s).length>180&&cur){out.push(cur.trim());cur=''}cur+=s});if(cur.trim())out.push(cur.trim());return out}
function noVoiceMsg(lang){
 if(!hasTTS)return STANDALONE?'Dieser Browser kann nicht vorlesen. Chrome oder Safari nutzen oder Gemini einrichten.':'In dieser Ansicht gibt es keine Vorlese-Stimme. Zum Anhören die App im Browser öffnen.';
 return `Auf diesem Gerät ist keine Stimme für ${langName(lang)} installiert.${STANDALONE?' Mit Gemini-Schlüssel liest Gemini vor.':''} Tipps unter „Ton und Stimmen“.`}
// Nur Wörter vorlesen: Zeichen wie / \ | * _ " oder Pfeile nicht aussprechen, Abkürzungen ausschreiben
const AND_W={en:'and',de:'und',es:'y',fr:'et',it:'e',sv:'och',nl:'en',da:'og',no:'og',nb:'og',pt:'e',pl:'i',hr:'i'};
const ABBR={en:[[/\bsb\b\.?/gi,'somebody'],[/\bsth\b\.?/gi,'something'],[/\bsmb\b\.?/gi,'somebody'],[/\bsmth\b\.?/gi,'something'],[/\be\.g\./gi,'for example'],[/\betc\./gi,'et cetera']],
 de:[[/\bjdn\b\.?/g,'jemanden'],[/\bjdm\b\.?/g,'jemandem'],[/\bjds\b\.?/g,'jemandes'],[/\bjd\b\.?/g,'jemand'],[/\betw\b\.?/g,'etwas'],[/\bz\.\s?B\./g,'zum Beispiel'],[/\busw\./g,'und so weiter']],
 es:[[/\balgn\b\.?/gi,'alguien'],[/\bp\.\s?ej\./gi,'por ejemplo']],fr:[[/\bqn\b\.?/gi,"quelqu'un"],[/\bqc\b\.?/gi,'quelque chose'],[/\bqqn\b\.?/gi,"quelqu'un"],[/\bqqch\b\.?/gi,'quelque chose']],
 it:[[/\bqcn\b\.?/gi,'qualcuno'],[/\bqc\b\.?/gi,'qualcosa'],[/\bqcs\b\.?/gi,'qualcosa']],sv:[[/\bngn\b\.?/gi,'någon'],[/\bngt\b\.?/gi,'något'],[/\bngns\b\.?/gi,'någons'],[/\bt\.\s?ex\./gi,'till exempel']],
 nl:[[/\biem\b\.?/gi,'iemand']]};
function speechText(text,lang){const L=short(lang||'');let t=String(text==null?'':text);
 t=t.replace(/\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/g,' ');
 (ABBR[L]||[]).forEach(([re,w])=>{t=t.replace(re,w)});
 t=t.replace(/\s*&\s*/g,` ${AND_W[L]||'and'} `)
  .replace(/_{2,}|\.{3,}|…/g,', ')
  .replace(/\s*(?:->|=>|→|←|↔|⇒|=|\+|;|\/|\\|\||•|·)\s*/g,', ')
  .replace(/\s+[-–—]\s+/g,', ')
  .replace(/["„“”«»‹›*_#~^`<>]/g,' ')
  .replace(/(^|\s)['‘’‚]+|['‘’‚]+(?=\s|$|[,.!?])/g,'$1')
  .replace(/\s+/g,' ').replace(/\s+([,.!?:])/g,'$1').replace(/([,:])(?:\s*[,:])+/g,'$1')
  .replace(/^[\s,.:;!?-]+|[\s,:;-]+$/g,'').trim();
 return t}
function speak(text,lang,onEnd,slow){
 let done=false;const fin=()=>{if(!done){done=true;if(onEnd)onEnd()}};
 const t=speechText(text,lang);
 const busy=hasTTS&&(()=>{try{return speechSynthesis.speaking||speechSynthesis.pending}catch(e){return false}})();
 stopSpeak();const gen=speakGen;if(!t){fin();return}
 const device=()=>{if(gen!==speakGen)return fin();
 if(!hasTTS){ttsErr='keine Stimme';voiceNote(lang,true);fin();return}
 const parts=chunks(t),rate=(prefs.rate||.9)*(slow?.7:1);
 const run=()=>{if(gen!==speakGen)return fin();let started=false;
  try{try{if(speechSynthesis.paused)speechSynthesis.resume()}catch(e){}
   const v=pickVoice(lang);
   parts.forEach((p,i)=>{const u=new SpeechSynthesisUtterance(p);u.lang=lang;if(v)u.voice=v;u.rate=rate;u.volume=1;
    u.onstart=()=>{started=true;ttsOk=true;ttsErr=''};
    if(i===parts.length-1){curU=u;u.onend=()=>{curU=null;fin()}}
    u.onerror=e=>{const er=(e&&e.error)||'Fehler';if(er==='interrupted'||er==='canceled')return fin();ttsErr=er;curU=null;
     if(cloudOK()&&gen===speakGen){speechSynthesis.cancel();return cloudSpeak(t,lang,slow,fin,gen,null)}
     if(gen===speakGen){if(er==='language-unavailable'||er==='voice-unavailable'){noVoiceLang[lang]=true;voiceNote(lang,true)}else toast(er==='not-allowed'?'Zum Vorlesen einmal auf den Lautsprecher tippen':'Vorlesen hat nicht geklappt. Tipp: „Ton und Stimmen“ → Ton testen')}fin()};
    speechSynthesis.speak(u)});
   // Hänger erkennen: nichts gestartet und nichts läuft
   setTimeout(()=>{if(gen!==speakGen||started||done)return;let sp=false;try{sp=speechSynthesis.speaking}catch(e){}if(sp)return;
    ttsErr='Die Stimme hat nicht angefangen';if(cloudOK()){stopSpeak();cloudSpeak(t,lang,slow,fin,speakGen,null)}else{if(!ttsHinted){ttsHinted=true;(voices.length&&!voicesFor(lang).length?voiceNote(lang,true):toast('Kein Ton? Unter „Ton und Stimmen“ kannst du den Ton testen.'))}fin()}},2500);
   if(onEnd)setTimeout(()=>{if(gen===speakGen)fin()},Math.min(60000,4000+t.length*230/rate))}
  catch(e){ttsErr='Vorlesen nicht verfügbar';voiceNote(lang,true);fin()}};
 // Chrome verschluckt manchmal ein speak() direkt nach cancel()
 if(busy)setTimeout(run,80);else run()};
 // Gemini-Stimme (gewählt oder als Ersatz); offline nur, was schon gespeichert ist, sonst Gerätestimme
 if(wantCloud(lang))return cloudSpeak(t,lang,slow,fin,gen,hasTTS?device:null);
 device()}
// Wörter der aktiven Sprache vorab als Gemini-Audio speichern, damit sie offline klingen
let preload=null;
function preloadList(L){const out=[];
 db.sets.filter(s=>targetLang(s)===L).forEach(s=>s.cards.forEach(c=>{const x=speechText(L===s.l1?c.t:c.d,L);if(x)out.push(x)}));
 if(curProf()&&curProf().kid)KID_WORDS.forEach(w=>{const x=w.t[short(L)];if(x)out.push(x)});
 return [...new Set(out)].slice(0,150)}
async function preloadAudio(){const L=activeLang();if(!L||preload||!cloudOK())return;if(learnOffline())return toast(offlineMsg());
 const list=preloadList(L);preload={n:0,of:list.length,new:0,err:''};render();
 for(const t of list){if(!preload||learnOffline())break;const key=audioKey(t,L);
  if(!audioCache.has(key)&&!(await audioFromStore(key))){try{await cloudAudio(t,L,{stopOnLimit:true});preload.new++;await new Promise(r=>setTimeout(r,700))}catch(e){preload.err=e.message;break}}
  preload.n++;if(view.name==='voices'){const el=$('#pl-prog');if(el)el.textContent=`${preload.n} von ${preload.of}`}}
 const P=preload;preload=null;toast(P&&P.err?`Abgebrochen: ${P.err}. ${P.n} von ${P.of} gespeichert.`:`Fertig: ${P?P.of:0} Wörter für offline bereit`);if(view.name==='voices')render()}
// Fehlt die Stimme, steht das einmal ruhig oben statt bei jedem Antippen als Meldung
let voiceNoteHidden=false;const noVoiceLang={};
function voiceProblem(lang){const L=lang||activeLang();if(!L)return '';
 if(!hasTTS){if(cloudOK())return learnOffline()?'Offline klingen nur Wörter, die schon gespeichert sind.':'';return noVoiceMsg(L)}
 if((voices.length&&!voicesFor(L).length||noVoiceLang[L])&&!(cloudOK()&&!learnOffline()))return noVoiceMsg(L);return ''}
function voiceNote(lang,force){if(typeof activeLang!=='function'||typeof esc!=='function')return;// beim Laden der aufgeteilten Version evtl. noch nicht da
 let el=document.getElementById('voice-note');
 if(!el){el=document.createElement('div');el.id='voice-note';el.className='voice-note';el.setAttribute('role','status');try{app.parentNode.insertBefore(el,app)}catch(e){return}}
 const msg=view.name==='voices'?'':voiceProblem(lang);
 if(!msg||voiceNoteHidden){el.hidden=true;return}
 el.innerHTML=`<span aria-hidden="true">${ICON.say}</span><p>${esc(msg)}</p><button type="button" class="linkbtn" data-vn="more">Mehr</button><button type="button" class="vn-x" data-vn="x" aria-label="Hinweis ausblenden">×</button>`;
 el.hidden=false;if(force){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}
 el.onclick=e=>{const b=e.target.closest('[data-vn]');if(!b)return;if(b.dataset.vn==='x'){voiceNoteHidden=true;el.hidden=true}else{loadVoices();go('voices')}}}
// Zweimal kurz hintereinander auf denselben Lautsprecher = langsam
function sayTap(text,lang){const now_=Date.now(),slow=lastSay.t===text&&now_-lastSay.at<6000&&!lastSay.slow;lastSay={t:text,at:now_,slow};speak(text,lang,null,slow);if(slow&&!voiceProblem(lang))toast('Langsam')}
// iPhone/iPad: Ton erst nach einer Berührung erlaubt, also beim ersten Tippen freischalten
function unlockAudio(){if(audioUnlocked)return;audioUnlocked=true;
 try{if(hasTTS){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u)}}catch(e){}
 try{const p=getPlayer();if(p&&cloudOK()){p.src=SILENT_WAV;const r=p.play();if(r&&r.catch)r.catch(()=>{})}}catch(e){}}
try{['pointerdown','touchend','keydown'].forEach(ev=>document.addEventListener(ev,unlockAudio,{once:true,passive:true,capture:true}))}catch(e){}
const sayBtn=(text,lang)=>`<button class="say" data-act="say" data-text="${esc(text)}" data-lang="${esc(lang)}" aria-label="Anhören (zweimal tippen: langsam)" title="Anhören – zweimal tippen: langsam">${ICON.say}</button>`;
const autoChip=()=>`<button class="chip ${prefs.auto?'on':''}" data-act="auto" aria-pressed="${prefs.auto}">Automatisch vorlesen</button>`;

/* ---------- Spracheingabe ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const MIC_OK=STANDALONE&&!!SR;
const dictHint=MIC_OK?'':`<p class="hint">Sprechen statt tippen: Tippe ins Feld und nutze das Mikrofon deiner Handytastatur.</p>`;
const micBtn=(target,lang)=>MIC_OK?`<button type="button" class="mic" data-act="mic" data-target="${target}" data-lang="${esc(lang)}" aria-label="Antwort sprechen">${ICON.mic}</button>`:'';
let rec=null;
function stopListen(){if(rec){const r=rec;rec=null;try{r.onend=null;r.abort()}catch(e){}}document.querySelectorAll('.listening').forEach(x=>x.classList.remove('listening'))}
function listen(lang,{btn,onFinal,onInterim,onNone,quiet}={}){
 if(!SR){toast('Spracherkennung gibt es in diesem Browser nicht');return}
 if(rec){stopListen();return}
 stopSpeak();
 const r=new SR();rec=r;let got=false,fatal=false;r.lang=lang;r.interimResults=true;r.maxAlternatives=5;r.continuous=false;
 if(btn)btn.classList.add('listening');
 r.onresult=e=>{const res=e.results[e.results.length-1];const alts=[...res].map(a=>a.transcript.trim()).filter(Boolean);if(!alts.length)return;
  if(res.isFinal){got=true;onFinal&&onFinal(alts)}else onInterim&&onInterim(alts[0])};
 r.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed'){fatal=true;toast('Mikrofon ist blockiert. Erlaube es in den Browser-Einstellungen.')}
  else if(e.error==='network'){fatal=true;toast('Spracherkennung braucht eine Internetverbindung.')}
  else if(e.error==='no-speech'){if(!quiet)toast('Nichts gehört. Tipp nochmal aufs Mikrofon.')}
  else if(e.error!=='aborted')toast('Spracherkennung hat nicht geklappt')};
 r.onend=()=>{if(rec===r)rec=null;if(btn)btn.classList.remove('listening');if(!got&&onNone)onNone(fatal)};
 try{r.start()}catch(e){rec=null;if(btn)btn.classList.remove('listening');toast('Spracherkennung konnte nicht starten');if(onNone)onNone(true)}
}
