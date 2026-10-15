// Vokabelkoje – ki
/* ---------- KI: Gemini (GitHub-Version) oder Claude (in Claude) ---------- */
const GEM_MODELS=['gemini-3.8-flash','gemini-3.5-flash-lite'];
class AIError extends Error{}
let claudeSample;
if(!STANDALONE){try{if(window.claude&&window.claude.use)window.claude.use('sample').then(s=>{claudeSample=s}).catch(()=>{claudeSample=null});else claudeSample=null}catch(e){claudeSample=null}}
// KI-Antworten sind nicht immer sauber: Text davor/danach, ```-Blöcke, mehrere JSON-Blöcke, Steuerzeichen,
// echte Zeilenumbrüche in Texten oder Kommas vor } bzw. ]. Alles der Reihe nach probieren, der erste gültige Block gewinnt.
function jsonBlocks(t){const out=[];
 for(let i=0;i<t.length&&out.length<6;i++){const ch=t[i];if(ch!=='{'&&ch!=='[')continue;let depth=0,inS=false,bs=false,end=-1;
  for(let j=i;j<t.length;j++){const c=t[j];if(inS){if(bs)bs=false;else if(c==='\\')bs=true;else if(c==='"')inS=false;continue}
   if(c==='"')inS=true;else if(c==='{'||c==='[')depth++;else if(c==='}'||c===']'){depth--;if(depth===0){end=j;break}}}
  if(end>0){out.push(t.slice(i,end+1));i=end}}
 return out}
function fixJSON(t){let out='',inS=false,bs=false;
 for(const c of t){if(inS){if(bs){bs=false;out+=c;continue}if(c==='\\'){bs=true;out+=c;continue}if(c==='"'){inS=false;out+=c;continue}
   out+=c==='\n'?'\\n':c==='\t'?'\\t':c==='\r'?'':c;continue}
  if(c==='"')inS=true;out+=c}
 return out.replace(/,\s*([}\]])/g,'$1')}
function parseJSON(t){t=String(t||'').replace(/^\uFEFF/,'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u2028\u2029]/g,' ').trim();
 const cands=[t,...[...t.matchAll(/```(?:json|JSON)?\s*([\s\S]*?)```/g)].map(m=>m[1].trim()),...jsonBlocks(t)];
 for(const c of cands){for(const v of [c,fixJSON(c)]){try{return JSON.parse(v)}catch(e){}}}
 throw new AIError('Die KI-Antwort war unvollständig. Versuch es nochmal.')}
const JSON_FIX='Die Antwort war kein gültiges JSON. Bitte antworte ausschließlich mit dem reinen JSON in der verlangten Form, ohne Text davor oder danach und ohne ```.';
// Gespeicherte KI-Inhalte (Übungen, Checks, Einstufungstests, Startpakete): online gibt es frische Aufgaben,
// offline oder bei Limit/Netzfehler springt die zuletzt erzeugte Fassung ein.
const AIC_KEY='vokabelkoje.aicache';let aiFromCache=false;
function aicAll(){try{return JSON.parse(localStorage.getItem(AIC_KEY)||'{}')||{}}catch(e){return {}}}
function aicGet(k){const e=aicAll()[k];return e?e.v:null}
function aicSet(k,v){try{const c=aicAll();c[k]={v,t:Date.now()};const ks=Object.keys(c).sort((a,b)=>c[a].t-c[b].t);while(ks.length>60)delete c[ks.shift()];localStorage.setItem(AIC_KEY,JSON.stringify(c))}catch(e){}}
function fromCache(k,why){const v=k&&aicGet(k);if(v==null)return null;aiFromCache=true;toast(why==='offline'?'Offline: gespeicherte Fassung von früher geladen':'KI gerade nicht erreichbar: gespeicherte Fassung geladen');return v}
const blobToB64=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]);r.onerror=rej;r.readAsDataURL(b)});
async function shrink(file){try{const bmp=await createImageBitmap(file);const k=Math.min(1,1600/Math.max(bmp.width,bmp.height));const c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);return await new Promise(r=>c.toBlob(b=>r(b||file),'image/jpeg',.85))}catch(e){return file}}
async function gemini(turns,{json,image,fresh}){
 if(!prefs.gemKey)throw new AIError('NOKEY');
 const contents=[];turns.forEach(t=>{const role=t.role==='assistant'?'model':'user';const last=contents[contents.length-1];if(last&&last.role===role)last.parts[0].text+='\n\n'+t.content;else contents.push({role,parts:[{text:t.content}]})});
 if(image)contents[contents.length-1].parts.push({inline_data:{mime_type:image.type||'image/jpeg',data:await blobToB64(image)}});
 const models=[...new Set([prefs.gemModel.trim(),...GEM_MODELS].filter(Boolean))];let last='Gemini ist gerade nicht erreichbar. Versuch es gleich nochmal.';
 for(const m of models){let r,data={};
  try{r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':prefs.gemKey},
   body:JSON.stringify({contents,generationConfig:json?{responseMimeType:'application/json',temperature:fresh?.8:.4}:{temperature:.8}})})}
  catch(e){throw new AIError('Keine Verbindung zu Gemini. Bist du online?')}
  try{data=await r.json()}catch(e){}
  if(r.ok){const c=data.candidates&&data.candidates[0];const txt=c&&c.content&&c.content.parts?c.content.parts.map(p=>p.text||'').join(''):'';
   if(txt.trim())return txt;
   if((data.promptFeedback&&data.promptFeedback.blockReason)||(c&&c.finishReason==='SAFETY'))throw new AIError('Gemini hat die Anfrage abgelehnt. Formulier sie etwas anders.');
   last='Gemini hat nichts geantwortet. Versuch es nochmal.';continue}
  const msg=(data.error&&data.error.message)||'';
  if(/api.?key/i.test(msg)||r.status===401)throw new AIError('Der Gemini-Schlüssel ist ungültig. Prüf ihn in den Einstellungen.');
  if(r.status===429){last='Das kostenlose Gemini-Kontingent ist gerade ausgeschöpft. Warte eine Minute oder versuch es morgen wieder.';continue}
  if(r.status===404||r.status>=500){continue}
  if(r.status===403)throw new AIError('Gemini erlaubt diesen Zugriff nicht. Prüf den Schlüssel in den Einstellungen.');
  throw new AIError('Gemini meldet einen Fehler: '+(msg||r.status))}
 throw new AIError(last)}
const CLAUDE_ERR={not_granted:'Du hast der App die KI-Nutzung nicht erlaubt.',sampling_disabled:'Claude ist für dieses Konto nicht verfügbar.',rate_limited:'Gerade zu viele Anfragen. Versuch es gleich nochmal.',refused:'Die KI hat die Anfrage abgelehnt. Formulier sie etwas anders.',image_rejected:'Das Bild konnte nicht gelesen werden. Nimm ein anderes.',images_unavailable:'Fotos gehen in dieser Ansicht nicht.',invalid_json:'Die KI-Antwort war unvollständig. Versuch es nochmal.',session_expired:'Bitte melde dich neu bei Claude an.',empty_completion:'Die KI hat nichts geantwortet. Versuch es nochmal.'};
async function ai(turns,o={}){aiFromCache=false;
 if(!aiOK())throw new AIError('Für dieses Profil sind die KI-Funktionen ausgeschaltet. Das lässt sich unter Profile ändern.');
 if(learnOffline()){const c=fromCache(o.cacheKey,'offline');if(c!=null)return c;throw new AIError(offlineMsg())}
 if(typeof turns==='string')turns=[{role:'user',content:turns}];
 try{const v=await aiCall(turns,o);if(o.cacheKey&&v!=null)aicSet(o.cacheKey,v);return v}
 catch(e){if(e&&e.message&&e.message!=='NOKEY'){const c=fromCache(o.cacheKey,'error');if(c!=null)return c}throw e}}
async function aiCall(turns,o){
 if(STANDALONE){const t=await gemini(turns,o);if(!o.json)return t;
  try{return parseJSON(t)}catch(e){// einmal nachfragen
   const t2=await gemini([...turns,{role:'assistant',content:String(t).slice(0,6000)},{role:'user',content:JSON_FIX}],{...o,fresh:true});return parseJSON(t2)}}
 let s=claudeSample;if(s===undefined){try{s=window.claude?await window.claude.use('sample'):null}catch(e){s=null}claudeSample=s}
 if(!s)throw new AIError('KI ist in dieser Ansicht nicht verfügbar.');
 const opt={};if(o.image)opt.images=o.image;if(o.fresh)opt.cache=false;if(o.quick)opt.modelTier='quick';
 try{return o.json?await s.json(turns,opt):(await s(turns,opt)).text}
 catch(e){if(e&&e.code==='cancelled')throw new AIError('');
  // JSON kaputt: einmal als Text holen und selbst reparieren
  if(o.json&&!['rate_limited','not_granted','unavailable','sampling_disabled','refused'].includes(e&&e.code)){try{const r=await s([...turns,{role:'user',content:JSON_FIX}],{...opt,cache:false});return parseJSON(r.text||'')}catch(e2){}}
  throw new AIError(CLAUDE_ERR[e&&e.code]||'Die KI ist gerade nicht erreichbar. Versuch es nochmal.')}}
function errHtml(m){if(!m)return '';
 if(m==='NOKEY')return `<div class="fb no"><strong>Gemini ist noch nicht eingerichtet</strong><span>Trag einmal deinen kostenlosen Gemini-Schlüssel ein, dann klappt es.</span><button class="btn sm" data-act="settings">Zu den Einstellungen</button></div>`;
 return `<p class="bad-text">${esc(m)}</p>`}
const aiName=()=>STANDALONE?'Gemini':'Claude';
const levelSel=()=>`<label class="fld"><span>Niveau</span><select id="lvl" data-pref="level">${[['A1','A1 · Anfänger'],['A2','A2 · Grundlagen'],['B1','B1 · Mittelstufe'],['B2','B2 · gut'],['C1','C1 · sehr gut']].map(([v,l])=>`<option value="${v}" ${prefs.level===v?'selected':''}>${l}</option>`).join('')}</select></label>`;
const targetLang=s=>s.l1!=='de-DE'?s.l1:s.l2;
const nativeLang=s=>targetLang(s)===s.l1?s.l2:s.l1;
function addCards(s,list){const fwd=targetLang(s)===s.l1;const key=c=>plain(norm(c.t))+'|'+plain(norm(c.d));const have=new Set(s.cards.map(key));let n=0;
 list.forEach(x=>{if(!x||!x.t||!x.d)return;const c={...blank(),t:String(fwd?x.t:x.d).trim(),d:String(fwd?x.d:x.t).trim(),ex:String(x.ex||'').trim()};const k=key(c);if(have.has(k))return;have.add(k);s.cards.push(c);n++});
 if(n){s.upd=now();db.fresh=false;save()}return n}

/* ---------- Niveau-Profil je Sprache ---------- */
const LEVELS=['A1','A2','B1','B2','C1','C2'];
const lvlName=x=>x==null?'–':LEVELS[Math.min(5,Math.max(0,Math.floor(x)))];
const clampLv=x=>x==null||x===''||isNaN(+x)?null:Math.max(0,Math.min(5.99,+x));
function prof(lang){return db.prof[lang]||(db.prof[lang]={pts:[],weak:{}})}
// Glättung: Tests und Gespräche zählen halb, Etappen-Checks nur ein Viertel (sie prüfen nur den Stoff einer Etappe)
const PT_W={unit:.25,gull:.25};
function series(lang,k){let e=null;return prof(lang).pts.filter(p=>p[k]!=null).map(p=>{const w=PT_W[p.src]||.5;e=e==null?p[k]:e*(1-w)+p[k]*w;return {t:p.t,y:e,raw:p[k],src:p.src}})}
function curLevel(lang,k){const s=series(lang,k);return s.length?s[s.length-1].y:null}
function measuredLevel(lang){const m=[curLevel(lang,'g'),curLevel(lang,'v')].filter(x=>x!=null);return m.length?lvlName(m.reduce((a,b)=>a+b)/m.length):null}
function addPoint(lang,g,v,src){g=clampLv(g);v=clampLv(v);if(g==null&&v==null)return;const P=prof(lang);P.pts.push({t:now(),g,v,src});P.pts=P.pts.slice(-200);save()}
const wkey=t=>plain(norm(t)).slice(0,60);
function addWeak(lang,list){const P=prof(lang);
 (list||[]).forEach(w=>{if(!w||!w.thema)return;const k=wkey(w.thema);if(!k)return;const o=P.weak[k]||{topic:String(w.thema).trim(),n:0,ok:0,tries:0};
  o.n++;o.last=now();o.fixed=false;o.cat=/wort/i.test(w.art||'')?'v':'g';if(w.erklaerung)o.desc=String(w.erklaerung).trim();if(w.beispiel)o.ex=String(w.beispiel).trim();P.weak[k]=o});save()}
const openWeak=lang=>Object.entries(prof(lang).weak).filter(([,w])=>!w.fixed).map(([k,w])=>({k,...w})).sort((a,b)=>(b.n-(b.ok||0))-(a.n-(a.ok||0))||(b.last||0)-(a.last||0));
// Deine heutige Übung: pro Tag und Sprache ein Schwerpunkt aus den offenen Baustellen
function dailyFocus(lang){if(!lang)return null;const ws=openWeak(lang);if(!ws.length)return null;db.focus=db.focus||{};const d=dayKey();let f=db.focus[lang];const P=prof(lang);
 if(!f||f.day!==d||!P.weak[f.k]||P.weak[f.k].fixed&&!f.rounds){const pick=ws.slice(0,3).sort((a,b)=>(a.tried||0)-(b.tried||0))[0];f=db.focus[lang]={day:d,k:pick.k,rounds:0};save()}
 return {...f,w:P.weak[f.k]}}
function focusNext(lang){const f=dailyFocus(lang);const ws=openWeak(lang).filter(w=>w.k!==(f&&f.k));if(!ws.length)return toast('Keine weitere Baustelle offen. Stark!');
 const pick=ws.sort((a,b)=>(a.tried||0)-(b.tried||0))[0];db.focus[lang]={day:dayKey(),k:pick.k,rounds:0};save();startFocus(lang)}
function startFocus(lang){const f=dailyFocus(lang);if(!f)return;go('drill',{lang,focus:true,D:{k:f.k,stage:'load',data:null,i:0,res:null,ok:0,err:''}});drillLoad()}
function focusCard(){const L=activeLang();if(!L||!aiOK())return '';const f=dailyFocus(L);if(!f)return '';const w=f.w,done=f.rounds>0;
 return `<section class="panel focus ${done?'done':''}"><div class="row-between"><span class="label">Deine heutige Übung</span>${done?`<span class="pill ok">✓ ${f.rounds}× geübt</span>`:''}</div>
  <h2>${esc(w.topic)}<span class="cat ${w.cat||'g'}">${w.cat==='v'?'Wortschatz':'Grammatik'}</span></h2>
  <p class="hint">${w.n}× bei dir aufgefallen${w.ok?`, ${w.ok}× gut geübt`:''}${w.fixed?' · inzwischen gefestigt':''}. Kurze Regel und 8 Aufgaben, ca. 3 Minuten.</p>
  <div class="btn-row"><button class="btn ${done?'':'primary'}" data-act="focus-go">${done?'Weiter am Schwerpunkt':'Jetzt üben'}</button>${done&&openWeak(L).length>1?'<button class="btn" data-act="focus-next">Anderes Thema</button>':''}</div></section>`}
const weakHint=lang=>openWeak(lang).slice(0,4).map(w=>w.topic).join('; ');
const studyLangs=()=>[...new Set([...(db.courses||[]).map(c=>c.lang),...db.sets.map(targetLang)])];
function adoptLevel(lang){const m=measuredLevel(lang);if(m){prefs.level=m==='C2'?'C1':m;savePrefs()}}

/* ---------- Antworten prüfen ---------- */
function norm(s){return String(s).toLowerCase().replace(/\(.*?\)/g,'').replace(/[.,!?¿¡;:"“”„'’«»]/g,'').replace(/\s+/g,' ').trim()}
const plain=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss');
const ART=/^(der|die|das|den|dem|ein|eine|the|a|an|to|el|la|los|las|un|una|le|les|l|il|lo|gli|i|de|het|en|ett)\s+/;
function check(input,answer){const a=norm(input);if(!a)return 0;
 const alts=[answer,...answer.split(/\s*[\/;]\s*|,\s+/)].map(norm).filter(Boolean);
 if(alts.includes(a))return 2;
 if(alts.map(plain).includes(plain(a)))return 1;
 if(alts.map(x=>plain(x.replace(ART,''))).includes(plain(a.replace(ART,''))))return 1;
 return 0}
function options(s,c,dir){const k=dir==='t'?'t':'d';const others=shuffle([...new Set(s.cards.filter(x=>x.id!==c.id&&x[k]!==c[k]).map(x=>x[k]))]).slice(0,3);return shuffle([c[k],...others])}
function dirOf(s,c,dir=prefs.dir){return dir==='t'?{prompt:c.d,answer:c.t,askLang:s.l2,ansLang:s.l1}:{prompt:c.t,answer:c.d,askLang:s.l1,ansLang:s.l2}}

/* ---------- Bausteine ---------- */
function faecher(s){const st=[0,0,0];s.cards.forEach(c=>st[stageOf(c)]++);const n=s.cards.length||1;
 return `<div class="faecher"><div class="fbar" role="img" aria-label="${st[2]} sitzen, ${st[1]} geübt, ${st[0]} neu"><i class="f2" style="width:${st[2]/n*100}%"></i><i class="f1" style="width:${st[1]/n*100}%"></i></div>
 <div class="flegend"><span><i class="dot f2"></i><b>${st[2]}</b> sitzen</span><span><i class="dot f1"></i><b>${st[1]}</b> geübt</span><span><i class="dot f0"></i><b>${st[0]}</b> neu</span></div></div>`}
function pill(c){if(isDue(c))return '<span class="pill due">fällig</span>';if(c.lv>=1)return `<span class="pill m2" title="Nächste Wiederholung ${relDay(c.due)}">Fach ${c.lv}</span>`;return c.m>=1?'<span class="pill m1">geübt</span>':'<span class="pill">neu</span>'}
const starBtn=(c,act='star')=>`<button class="starbtn ${c.star?'on':''}" data-act="${act}" data-cid="${c.id}" aria-pressed="${c.star}" aria-label="${c.star?'Markierung entfernen':'Markieren'}">${ICON.star}</button>`;
const bar=(to,title='')=>`<header class="bar"><button class="back" data-act="back" data-to="${to}"><span aria-hidden="true">←</span> ${({home:'Startseite',unit:'Zur Etappe',course:'Zum Lernpfad'})[to]||'Zum Set'}</button><div class="bar-title">${esc(title)}</div></header>`;
const canSync=()=>STANDALONE&&!!prefs.ghToken;
