// Vokabelkoje – grundlagen
const STANDALONE=true;
const $=s=>document.querySelector(s);
const app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const DAY=864e5, INT=[0,1,3,7,14,30,60,120];
const KEY='vokabelkoje.v1', PKEY='vokabelkoje.prefs';
const LANGS=[['de-DE','Deutsch'],['en-GB','Englisch'],['es-ES','Spanisch'],['fr-FR','Französisch'],['it-IT','Italienisch'],['nl-NL','Niederländisch'],['pt-PT','Portugiesisch'],['sv-SE','Schwedisch'],['da-DK','Dänisch'],['no-NO','Norwegisch'],['pl-PL','Polnisch'],['cs-CZ','Tschechisch'],['tr-TR','Türkisch'],['hr-HR','Kroatisch'],['hu-HU','Ungarisch'],['fi-FI','Finnisch'],['uk-UA','Ukrainisch'],['ko-KR','Koreanisch'],['ru-RU','Russisch'],['el-GR','Griechisch'],['ja-JP','Japanisch'],['zh-CN','Chinesisch'],['la','Latein']];
const langName=c=>(LANGS.find(l=>l[0]===c)||[,'Sprache'])[1];
const short=l=>l.split('-')[0];
const ICON={
 dict:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><path d="M5 11v6h4l5 4V7l-5 4z" fill="currentColor"/><path d="M18 10.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 23h8M17 19.5h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 pron:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><rect x="10" y="4" width="8" height="13" rx="4" fill="currentColor"/><path d="M6.5 13a7.5 7.5 0 0 0 15 0M14 20.5V24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 cam:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 say:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.6 6a8.6 8.6 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
 star:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor"/></svg>',
 mic:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
 bigmic:'<svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
 bigsay:'<svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.6 6a8.6 8.6 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
 flash:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><rect x="7" y="4" width="17" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="11" width="17" height="12" rx="2" fill="var(--surface)" stroke="currentColor" stroke-width="1.8"/><path d="M3 15h17" stroke="currentColor" stroke-width="1.8"/></svg>',
 learn:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 14.5l3.5 3.5L19.5 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 test:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><rect x="6" y="3" width="16" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9h8M10 14h8M10 19h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
 match:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><rect x="3" y="5" width="9" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="16" y="16" width="9" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5c6 0 4 11 4 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2 3"/></svg>',
 hands:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><path d="M5 15v-2a9 9 0 0 1 18 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3.5" y="14" width="5" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="19.5" y="14" width="5" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
,
 reader:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><path d="M4 6h8a3 3 0 0 1 2 1v15a3 3 0 0 0-2-1H4zM24 6h-8a3 3 0 0 0-2 1v15a3 3 0 0 1 2-1h8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
 talk:'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><path d="M4 6h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5V17H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M21 11h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-3.5-3H14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
};

/* ---------- Einstellungen ---------- */
let prefs={auto:false,rate:.9,voices:{},dir:'t',goal:20,ghToken:'',gistId:'',lastSync:0,syncErr:'',gemKey:'',gemModel:'',level:'A2'};
try{Object.assign(prefs,JSON.parse(localStorage.getItem(PKEY))||{})}catch(e){}
if(prefs.autoV!==1){prefs.auto=true;prefs.autoV=1}
function savePrefs(){try{localStorage.setItem(PKEY,JSON.stringify(prefs))}catch(e){}}
/* Hell- und Dunkelmodus: 'auto' folgt dem Gerät, 'light'/'dark' sind fest gewählt */
const HOST_THEME=(()=>{try{return document.documentElement.getAttribute('data-theme')}catch(e){return null}})();
const darkMQ=(()=>{try{return matchMedia('(prefers-color-scheme: dark)')}catch(e){return null}})();
function isDark(){const t=prefs.theme;if(t==='dark')return true;if(t==='light')return false;if(HOST_THEME)return HOST_THEME==='dark';return !!(darkMQ&&darkMQ.matches)}
function applyTheme(){const r=document.documentElement,t=prefs.theme;if(!r||!r.setAttribute)return;
 if(t==='light'||t==='dark')r.setAttribute('data-theme',t);else if(HOST_THEME)r.setAttribute('data-theme',HOST_THEME);else r.removeAttribute('data-theme');
 const m=document.querySelector('meta[name="theme-color"]');if(m&&m.setAttribute)m.setAttribute('content',isDark()?'#0e161c':'#1d5a86')}
function setTheme(t){prefs.theme=t;savePrefs();applyTheme()}
applyTheme();try{darkMQ&&darkMQ.addEventListener&&darkMQ.addEventListener('change',()=>{if(!prefs.theme||prefs.theme==='auto')applyTheme()})}catch(e){}

/* ---------- Daten ---------- */
function sample(){
 const mk=(set,i,t,d,ex='')=>({id:`bsp-${set}-${i}`,t,d,ex,star:false,m:0,lv:0,due:0,u:0});
 const en=[['bow','der Bug','The bow cuts through the waves.'],['stern','das Heck'],['port (side)','Backbord','Keep the buoy on port.'],['starboard','Steuerbord'],['sail','das Segel','Hoist the sail!'],['mast','der Mast'],['anchor','der Anker','Drop the anchor here.'],['rudder','das Ruder'],['tiller','die Pinne'],['life jacket','die Rettungsweste','Always wear a life jacket.'],['jetty','der Steg'],['knot','der Knoten','Can you tie a bowline knot?'],['line / rope','die Leine'],['headwind','der Gegenwind'],['to capsize','kentern','The dinghy capsized in the gust.']];
 const es=[['hola','hallo'],['gracias','danke','Muchas gracias por todo.'],['por favor','bitte'],['buenos días','guten Morgen'],['el agua','das Wasser'],['el mar','das Meer','El mar está tranquilo hoy.'],['la playa','der Strand'],['el barco','das Boot'],['el viento','der Wind'],['¿cuánto cuesta?','Was kostet das?']];
 return [
  {id:'bsp-en',title:'Englisch an Bord',l1:'en-GB',l2:'de-DE',best:null,upd:0,cards:en.map((x,i)=>mk('en',i,...x))},
  {id:'bsp-es',title:'Spanisch – Erste Schritte',l1:'es-ES',l2:'de-DE',best:null,upd:0,cards:es.map((x,i)=>mk('es',i,...x))}
 ];
}
function migrate(d){d.v=2;d.deleted=d.deleted||{};d.log=d.log||{};d.sets=d.sets||[];d.prof=d.prof||{};d.courses=d.courses||[];d.me=d.me||{gull:'',name:'',upd:0};if(d.me.gull&&d.me.onb==null)d.me.onb=true;d.watch=d.watch||{};d.logD=d.logD||{};d.focus=d.focus||{};d.slain=d.slain||[];d.kid=d.kid||{c:{}};
 d.sets.forEach(s=>{s.upd=s.upd||0;s.best=s.best||null;s.cards=s.cards||[];s.cards.forEach(c=>{c.m=c.m||0;if(c.lv==null){c.lv=c.m>=2?1:0;c.due=c.lv?Date.now():0}c.due=c.due||0;c.u=c.u||0;c.ex=c.ex||'';c.star=!!c.star})});return d}
const PROF_KEY='vokabelkoje.profiles';
let profs=(()=>{try{const p=JSON.parse(localStorage.getItem(PROF_KEY));if(p&&Array.isArray(p.list)&&p.list.length)return p}catch(e){}return {list:[{id:'main',name:'',color:0,ai:true,upd:0}],active:'main'}})();
function saveProfs(){try{localStorage.setItem(PROF_KEY,JSON.stringify(profs))}catch(e){}}
const dataKey=id=>id==='main'?KEY:KEY+'.'+id;
function load(id){try{const r=localStorage.getItem(dataKey(id||profs.active));if(r){const d=JSON.parse(r);if(d&&Array.isArray(d.sets))return migrate(d)}}catch(e){}return null}
let db=load()||migrate(profs.active==='main'?{sets:sample(),fresh:true}:{sets:[],fresh:true});
let syncTimer=null,dirty=false;
function save(noSync){try{localStorage.setItem(dataKey(profs.active),JSON.stringify(db))}catch(e){}
 if(!noSync&&canSync()){dirty=true;clearTimeout(syncTimer);syncTimer=setTimeout(sync,4000)}}
const payload=()=>({v:2,sets:db.sets,deleted:db.deleted,log:db.log,logD:db.logD,focus:db.focus,prof:db.prof,courses:db.courses,me:db.me,watch:db.watch,slain:db.slain,kid:db.kid});

const now=()=>Date.now();
function dayStart(t=now()){const d=new Date(t);d.setHours(0,0,0,0);return d.getTime()}
const dayKey=(t=now())=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const sched=lv=>dayStart()+INT[Math.min(lv,INT.length-1)]*DAY+3*36e5;
const isDue=c=>c.lv>=1&&c.due<dayStart()+DAY;
const stageOf=c=>c.lv>=1?2:Math.min(1,c.m||0);
const dueCount=s=>s.cards.filter(isDue).length;
function allDue(){const r=[];db.sets.filter(inLang).forEach(s=>s.cards.forEach(c=>{if(isDue(c))r.push({sid:s.id,cid:c.id})}));return r}
const touch=c=>{c.u=now()};
// Antworten pro Tag UND Gerät zählen: Beim Abgleich addieren sich Handy und PC, statt dass nur der größere Wert zählt
const DEV=(()=>{if(!prefs.dev){prefs.dev=uid();savePrefs()}return prefs.dev})();
function logAnswer(n=1){const k=dayKey();db.log[k]=(db.log[k]||0)+n;db.logD=db.logD||{};const d=db.logD[k]||(db.logD[k]={});d[DEV]=(d[DEV]||0)+n}
function relDay(t){const d=Math.round((dayStart(t)-dayStart())/DAY);return d<=0?'heute':d===1?'morgen':`in ${d} Tagen`}
function ago(t){const m=Math.round((now()-t)/6e4);return m<1?'gerade eben':m<60?`vor ${m} Min.`:m<1440?`vor ${Math.round(m/60)} Std.`:`am ${new Date(t).toLocaleDateString('de-DE')}`}

/* Lernstand bewerten. Rückgabe: true = in dieser Runde nochmal fragen */
function gradeLearn(c,ok){touch(c);if(ok){c.m=(c.m||0)+1;if(c.m>=2){c.lv=1;c.due=sched(1);return false}return true}c.m=0;return true}
function gradeReview(c,ok,failed){touch(c);if(ok){c.lv=failed?1:Math.min(c.lv+1,INT.length-1);c.due=sched(c.lv);return false}return true}
