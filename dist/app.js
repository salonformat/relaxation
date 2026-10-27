import {copyForScene} from './scene-copy.js';
import {breathAt} from './breath-rhythm.js';
import {copy,makeGuides,applyCopy} from './copy.js';
import {drawLivingWorld} from './living-world.js';
import {drawFallingLeaves} from './nature-motion.js';
import {Soundscape} from './sound.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const state={place:'sea',season:'summer',weather:'clear',wind:true,mode:'welcome',paused:false,motionScale:reduced.matches?.35:1,sound:false,bare:false,breathing:false,breathAmount:0,look:{x:0,y:0},ripple:{x:0,y:0,at:-100},guide:null,guideElapsed:0};
const canvas=$('#landscape'),ctx=canvas.getContext('2d'),weather=$('#weather'),wc=weather.getContext('2d'),sound=new Soundscape();
let language='de';try{language=localStorage.getItem('relaxation-language')||'de';}catch{}language=new URLSearchParams(location.search).get('lang')||language;if(!copy[language])language='de';let t=copyForScene(language,state.place,state.season),labels=t.places,guides=makeGuides(t);
let W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,2),time=0,last=0,lastDraw=0,arrivalTimer=null,closingTimer=null,cueIndex=-1,breathStart=0,lastBreathWord='',pickSound=true,look={x:0,y:0},lastGuide=null,lastGuidePlace=null;
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const particles=Array.from({length:150},(_,i)=>({x:hash(i+1),y:hash(i+1000),speed:.04+hash(i+90)*.085,size:.7+hash(i+40)*2.1,len:10+hash(i+20)*16}));
function drawWorld(){drawLivingWorld(ctx,W,H,time,state);}
function drawWeather(){
 wc.clearRect(0,0,W,H);const snow=state.season==='winter'&&state.weather==='rain',rain=state.weather==='rain'&&!snow;
 if(state.place==='city'){wc.save();wc.beginPath();wc.moveTo(W*.17,0);wc.lineTo(W*.88,0);wc.lineTo(W*.88,H*.83);wc.lineTo(W*.09,H*.88);wc.closePath();wc.clip();}
 if(snow||rain)for(const p of particles){const z=p.size/3,y=((p.y+time*p.speed*(snow?.12:1))%1)*H,x=(p.x*W+(state.wind?Math.sin(time*.3+p.y*15)*(snow?35:4):0)+W)%W;if(snow){wc.fillStyle=`rgba(240,242,234,${.4+z*.45})`;wc.beginPath();wc.arc(x,y,p.size,0,7);wc.fill();}else{wc.strokeStyle=`rgba(205,222,223,${.14+z*.35})`;wc.lineWidth=.5+z*.7;wc.beginPath();wc.moveTo(x,y);wc.lineTo(x-(state.wind?4:1),y+p.len*(.6+z));wc.stroke();}}
 if(state.place==='city')wc.restore();
 drawFallingLeaves(wc,W,H,time,state);
}
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);for(const c of [canvas,weather]){c.width=W*dpr;c.height=H*dpr;}ctx.setTransform(dpr,0,0,dpr,0,0);wc.setTransform(dpr,0,0,dpr,0,0);drawWorld();drawWeather();}
function setBreathing(value){state.breathing=value;if(value){breathStart=time;$('#breath-word').textContent=t.inhale;lastBreathWord=t.inhale;$('#breath-duration').textContent=t.inhaleDuration;}$('#breath-guide').hidden=!value;$('#skip-breath').hidden=!value;if(!value){$('#breath-guide').style.setProperty('--breath','0');sound.breathe(0,false);}}
function updateBreath(){
 if(state.breathing){
  // Text and surface share this exact phase. No delayed interpolation at turns.
  const elapsed=Math.max(0,state.guideElapsed-guides[state.guide].breathAt),{phase,inhale,amount}=breathAt(elapsed);
  const word=inhale?t.inhale:t.exhale;
  $('#breath-word').textContent=word;
  $('#breath-duration').textContent=inhale?t.inhaleDuration:t.exhaleDuration;
  state.breathPhase=inhale?'in':'out';state.breathSeconds=phase;
  state.breathAmount=amount;
 }else state.breathAmount*=.94;
 $('#breath-guide').style.setProperty('--breath',state.breathAmount.toFixed(4));
 if(state.breathing)sound.breathe(state.breathAmount,true);
}
function updateGuidance(dt){
 if(!state.guide||document.hidden||state.paused)return;
 state.guideElapsed+=dt;const g=guides[state.guide];
 if(state.guideElapsed>=g.end){finishGuide();return;}
 let index=-1;for(let i=0;i<g.cues.length;i++)if(state.guideElapsed>=g.cues[i].at)index=i;
 if(index!==cueIndex&&index>=0){cueIndex=index;$('#guide-line').textContent=g.cues[index].text;}
 const c=g.cues[index];$('#guide-line').classList.toggle('is-quiet',!c||state.guideElapsed>c.at+c.hold);
 const paced=!!g.breathAt&&!state.skipBreath&&state.guideElapsed>=g.breathAt&&state.guideElapsed<g.breathUntil;
 if(paced!==state.breathing)setBreathing(paced);
}
function animate(ts){if(!last)last=ts;const dt=Math.max(0,(ts-last)/1000);last=ts;if(!document.hidden){updateGuidance(dt);if(!state.paused){time+=dt;state.look.x+=(look.x-state.look.x)*.035;state.look.y+=(look.y-state.look.y)*.035;updateBreath();sound.update(time,state);}if(ts-lastDraw>33&&(!state.paused||state.breathAmount>.001)){drawWorld();drawWeather();lastDraw=ts;}}requestAnimationFrame(animate);}
function announce(text){$('#status').textContent=text;}
function hideConversations(){for(const id of ['invitation','guide-choice','guidance','closing'])$('#'+id).hidden=true;document.body.classList.remove('talking','guiding');}
function clearArrival(){clearTimeout(arrivalTimer);arrivalTimer=null;}
function showInvitation(){if(state.bare||!$('#places').hidden)return;state.mode='invitation';hideConversations();$('#invitation').hidden=false;document.body.classList.add('talking');$('#just-stay').focus({preventScroll:true});}
function simplyStay(){clearArrival();stopGuide(false);hideConversations();state.mode='stay';$('#companionship').focus({preventScroll:true});}
function showGuideChoice(){clearArrival();stopGuide(false);hideConversations();state.mode='choice';$('#guide-choice').hidden=false;document.body.classList.add('talking');$('[data-guide=journey]').focus({preventScroll:true});}
function startGuide(key){clearArrival();clearTimeout(closingTimer);stopGuide(false);hideConversations();state.skipBreath=false;state.mode='guide';document.body.classList.add('guiding');state.guide=key;state.guideElapsed=0;cueIndex=-1;lastGuide=key;lastGuidePlace=state.place;$('#guidance').hidden=false;$('#technique-toggle').hidden=true;updateGuidance(0);$('#stop-guide').focus({preventScroll:true});}
function stopGuide(showEnding=false){document.body.classList.remove('guiding');state.guide=null;state.guideElapsed=0;cueIndex=-1;setBreathing(false);$('#guidance').hidden=true;if(showEnding)finishGuide();}
function finishGuide(){state.guide=null;setBreathing(false);hideConversations();state.mode='stay';$('#closing').hidden=false;$('#technique-toggle').hidden=!lastGuide;closingTimer=setTimeout(()=>$('#closing').hidden=true,11000);$('#companionship').focus({preventScroll:true});}
function togglePlaces(force){const open=typeof force==='boolean'?force:$('#places').hidden;$('#places').hidden=!open;$('#place-toggle').setAttribute('aria-expanded',String(open));document.body.classList.toggle('choosing',open);if(open){clearArrival();stopGuide(false);hideConversations();$('#close-places').focus({preventScroll:true});}}
function transitionScene(){const c=$('#transition-world');c.getAnimations().forEach(a=>a.cancel());c.getContext('2d').clearRect(0,0,c.width,c.height);c.style.opacity='0';}
function sync(){t=copyForScene(language,state.place,state.season);labels=t.places;guides=makeGuides(t);applyCopy(language,t);document.body.dataset.scene=state.place;document.body.dataset.season=state.season;$('#place-name').textContent=labels[state.place];for(const key of ['place','season','weather'])$$(`button[data-${key}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[key]===state[key])));$('#choose-wind').setAttribute('aria-pressed',String(state.wind));drawWorld();drawWeather();sound.scene(state);}
async function setSound(value){try{if(value){await sound.start();sound.scene(state);}else sound.stop();state.sound=value;$('#sound').setAttribute('aria-pressed',String(value));$('#sound').setAttribute('aria-label',value?t.soundOffAria:t.soundOnAria);$('#sound span').textContent=value?t.soundOn:t.soundOff;}catch{state.sound=false;announce(t.soundError);$('#sound span').textContent=t.soundRetry;}}
$('#begin').addEventListener('click',()=>{transitionScene();document.body.classList.add('portal-open');state.portalOpen=true;setSound(pickSound);togglePlaces(true);sync();});$('#place-toggle').addEventListener('click',()=>togglePlaces());$('#close-places').addEventListener('click',()=>{togglePlaces(false);(state.mode==='welcome'?$('#begin'):$('#place-toggle')).focus();});
$$('button[data-place]').forEach(b=>b.addEventListener('click',()=>{transitionScene();state.place=b.dataset.place;state.season=state.place==='country'?'autumn':'summer';state.weather=state.place==='city'?'rain':'clear';sync();}));
$$('button[data-season]').forEach(b=>b.addEventListener('click',()=>{transitionScene();state.season=b.dataset.season;sync();}));$$('button[data-weather]').forEach(b=>b.addEventListener('click',()=>{state.weather=b.dataset.weather;sync();}));
$('#choose-wind').addEventListener('click',()=>{state.wind=!state.wind;sync();});$('#choose-sound').addEventListener('click',()=>{pickSound=!pickSound;$('#choose-sound').setAttribute('aria-pressed',String(pickSound));});
$('#arrive').addEventListener('click',()=>{clearArrival();stopGuide(false);hideConversations();state.mode='arriving';$('#welcome').hidden=true;$('.bottom').hidden=false;document.body.classList.add('inside');togglePlaces(false);setSound(pickSound);$('#companionship').focus({preventScroll:true});arrivalTimer=setTimeout(()=>{arrivalTimer=null;if(state.mode==='arriving'&&!document.hidden)showInvitation();},7000);announce(labels[state.place]);});
$('#just-stay').addEventListener('click',simplyStay);$('#no-guide').addEventListener('click',simplyStay);$('#show-guides').addEventListener('click',showGuideChoice);$('#companionship').addEventListener('click',showGuideChoice);$$('[data-guide]').forEach(b=>b.addEventListener('click',()=>startGuide(b.dataset.guide)));$('#stop-guide').addEventListener('click',()=>{stopGuide(false);hideConversations();state.mode='stay';$('#companionship').focus();});
$('#sound').addEventListener('click',()=>setSound(!state.sound));$('#volume').addEventListener('input',e=>sound.setVolume(Number(e.target.value)/100));sound.setVolume(.45);
function setPaused(value){state.paused=value;document.body.classList.toggle('paused',value);$('#motion').setAttribute('aria-pressed',String(value));$('#motion').setAttribute('aria-label',value?t.resumeAria:t.pauseAria);$('#motion span').textContent=value?t.resume:t.pause;$('#motion svg').innerHTML=value?'<path d="m8 5 11 7-11 7z"/>':'<path d="M9 6v12M15 6v12"/>';drawWorld();drawWeather();}
$('#motion').addEventListener('click',()=>setPaused(!state.paused));reduced.addEventListener('change',e=>{state.motionScale=e.matches?.35:1;drawWorld();});
function bare(value){state.bare=value;document.body.classList.toggle('bare',value);$('.topbar').inert=value;$('.bottom').inert=value;$('main').inert=value;$('#restore-interface').hidden=!value;if(value){clearArrival();togglePlaces(false);$('#restore-interface').focus({preventScroll:true});}else $('#hide-interface').focus({preventScroll:true});}
$('#hide-interface').addEventListener('click',()=>bare(true));$('#restore-interface').addEventListener('click',()=>bare(false));
$('#technique-toggle').addEventListener('click',()=>{if(!lastGuide)return;$('#technique-title').textContent=guides[lastGuide].name;$('#technique-text').textContent=makeGuides(copyForScene(language,lastGuidePlace))[lastGuide].about;$('#technique-source').href=lastGuide==='journey'?'https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know':lastGuide==='breath'?'https://pmc.ncbi.nlm.nih.gov/articles/PMC10395759/':lastGuide==='senses'?'https://www.nhsinform.scot/healthy-living/mental-wellbeing/breathing-and-relaxation-exercises/':'https://www.gesundheit.gv.at/leben/stress/entspannt-bleiben.html';$('#technique-source').textContent=t.source;$('#technique').showModal();});$('#close-technique').addEventListener('click',()=>$('#technique').close());
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(state.bare)bare(false);else if(!$('#places').hidden){togglePlaces(false);(state.mode==='welcome'?$('#begin'):$('#place-toggle')).focus();}else if(state.guide){stopGuide(false);state.mode='stay';}else if(['choice','invitation'].includes(state.mode))simplyStay();});
document.addEventListener('pointerdown',e=>{if(!$('#places').hidden&&!$('#places').contains(e.target)&&!$('#place-toggle').contains(e.target)&&!e.target.closest('.language-switch')){togglePlaces(false);return;}if(['stay','guide','arriving'].includes(state.mode)&&!e.target.closest('button,a,aside,dialog,input'))state.ripple={x:e.clientX/W,y:e.clientY/H,at:time};});window.addEventListener('pointermove',e=>{if(state.mode==='welcome'||!$('#places').hidden)return;look={x:(e.clientX/W-.5)*2,y:(e.clientY/H-.5)*2};},{passive:true});
document.addEventListener('visibilitychange',()=>{last=0;sound.hide(document.hidden);if(!document.hidden&&state.mode==='arriving'&&!arrivalTimer)showInvitation();});window.addEventListener('resize',resize,{passive:true});window.addEventListener('relaxation-art-ready',()=>{drawWorld();drawWeather();});
window.relaxation={state,sound,get language(){return language},ready:()=>({audio:sound.context?.state,level:sound.measure()})};changeLanguage(language);resize();requestAnimationFrame(animate);

function changeLanguage(lang){if(!copy[lang])return;language=lang;t=copyForScene(lang,state.place,state.season);labels=t.places;guides=makeGuides(t);try{localStorage.setItem('relaxation-language',lang);}catch{}applyCopy(lang,t);lastBreathWord='';if(state.breathing)updateBreath();setPaused(state.paused);$('#sound span').textContent=state.sound?t.soundOn:t.soundOff;$('#sound').setAttribute('aria-label',state.sound?t.soundOffAria:t.soundOnAria);sync();if(state.guide&&cueIndex>=0)$('#guide-line').textContent=guides[state.guide].cues[cueIndex].text;if(lastGuide&&!$('#technique').hidden){$('#technique-title').textContent=guides[lastGuide].name;$('#technique-text').textContent=makeGuides(copyForScene(language,lastGuidePlace))[lastGuide].about;$('#technique-source').textContent=t.source;}}
$('#skip-breath').addEventListener('click',()=>{state.skipBreath=true;setBreathing(false);state.guideElapsed=guides[state.guide].breathUntil;cueIndex=-1;updateGuidance(0);$('#stop-guide').focus({preventScroll:true});});
$$('[data-language]').forEach(b=>b.addEventListener('click',()=>changeLanguage(b.dataset.language)));
$('#intro-rain').addEventListener('click',()=>{state.weather=state.weather==='rain'?'clear':'rain';$('#intro-rain').setAttribute('aria-pressed',String(state.weather==='rain'));sync();if(!state.sound)setSound(true);});
