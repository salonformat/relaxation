import {ambienceFor} from './audio-profile.js';
// Layered procedural ambience. No microphone, voice or external audio requests.
export class Soundscape {
 constructor(){this.context=null;this.enabled=false;this.volume=.45;this.voices={};this.level=0;this.breath=0;this.lastUpdate=-1;this.currentScene={place:'sea',weather:'clear',wind:true,season:'summer'};}
 async start(){
  if(!this.context){
   const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error('Kein Web Audio');this.context=new AC();const a=this.context;
   this.master=a.createGain();this.master.gain.value=0;
   const limiter=a.createDynamicsCompressor();limiter.threshold.value=-20;limiter.knee.value=24;limiter.ratio.value=3;limiter.attack.value=.08;limiter.release.value=.8;
   this.analyser=a.createAnalyser();this.analyser.fftSize=512;this.master.connect(limiter);limiter.connect(this.analyser);this.analyser.connect(a.destination);
   const noise=(seconds,brown=false)=>{const buffer=a.createBuffer(2,Math.floor(a.sampleRate*seconds),a.sampleRate);for(let ch=0;ch<2;ch++){const out=buffer.getChannelData(ch);let low=0;for(let i=0;i<out.length;i++){const w=Math.random()*2-1;low=(low+w*.025)/1.025;out[i]=brown?low*5:w;}
    // A short overlap at the seam avoids a repeating click.
    const seam=Math.floor(a.sampleRate*.08);for(let i=0;i<seam;i++){const k=i/seam;out[out.length-seam+i]=out[out.length-seam+i]*(1-k)+out[i]*k;}}
    return buffer;};
   const deep=noise(31,true),air=noise(37),rain=noise(29);
   const voice=(name,buffer,type,freq,pan)=>{const source=a.createBufferSource();source.buffer=buffer;source.loop=true;const filter=a.createBiquadFilter();filter.type=type;filter.frequency.value=freq;filter.Q.value=.38;const volume=a.createGain();volume.gain.value=0;const stereo=a.createStereoPanner();stereo.pan.value=pan;source.connect(filter);filter.connect(volume);volume.connect(stereo);stereo.connect(this.master);source.start(0,Math.random()*buffer.duration);this.voices[name]={source,filter,volume};};
   voice('depth',deep,'lowpass',280,0);
   voice('wash',deep,'lowpass',1250,-.32);
   voice('foam',air,'bandpass',1750,.35);
   voice('rain',rain,'lowpass',3900,-.18);
   voice('leaves',air,'bandpass',2200,.42);
   voice('wind',deep,'bandpass',480,-.12);
   voice('lapping',deep,'bandpass',620,.2);
   voice('rainRoof',deep,'bandpass',850,-.2);
   // Distant drops land at irregular intervals with soft, resonant decays.
   const drops=a.createBuffer(2,a.sampleRate*23,a.sampleRate);
   for(let ch=0;ch<2;ch++){const out=drops.getChannelData(ch);for(let at=.2;at<22.7;at+=.08+Math.random()*.65){const start=Math.floor(at*a.sampleRate),length=Math.floor(a.sampleRate*(.018+Math.random()*.05)),pitch=650+Math.random()*1500,amp=.05+Math.random()*.12;for(let j=0;j<length&&start+j<out.length;j++){const env=Math.sin(Math.PI*j/length)*Math.exp(-j/length*5);out[start+j]+=((Math.random()*2-1)*.7+Math.sin(j/a.sampleRate*pitch*6.283)*.3)*env*amp;}}}
   voice('drops',drops,'lowpass',2900,0);
  }
  await this.context.resume();this.enabled=true;this.lastUpdate=-1;this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,1.2);
 }
 async prepare(){if(!this.context){await this.start();this.stop();}else if(this.context.state==='suspended')await this.context.resume();}
 chime(){
  if(!this.context||this.context.state!=='running')return false;
  const a=this.context,t=a.currentTime;
  for(const [frequency,level]of [[392,.055],[587.33,.018]]){
   const tone=a.createOscillator(),gain=a.createGain();tone.type='sine';tone.frequency.value=frequency;
   gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(level*this.volume,t+.12);gain.gain.exponentialRampToValueAtTime(.00001,t+3.8);
   tone.connect(gain);gain.connect(a.destination);tone.start(t);tone.stop(t+4);tone.onended=()=>{tone.disconnect();gain.disconnect();};
  }
  this.lastChime=t;return true;
 }
 stop(){this.enabled=false;if(this.context)this.master.gain.setTargetAtTime(0,this.context.currentTime,.5);}
 setVolume(value){this.volume=value;if(this.context&&this.enabled)this.master.gain.setTargetAtTime(value,this.context.currentTime,.3);}
 scene(state){this.currentScene={...state};this.lastUpdate=-1;this.update(this.visualTime||0,state);}
 update(time,state=this.currentScene){
  this.visualTime=time;if(!this.context||!this.enabled||Math.abs(time-this.lastUpdate)<.12)return;this.lastUpdate=time;
  const t=this.context.currentTime,profile=ambienceFor(state,time,this.breath);
  for(const [name,value]of Object.entries(profile.gains))this.voices[name].volume.gain.setTargetAtTime(value,t,profile.winter&&['rain','rainRoof','drops','leaves'].includes(name)?.25:.8);
  for(const [name,value]of Object.entries(profile.filters))this.voices[name].filter.frequency.setTargetAtTime(value,t,.9);

 }
 breathe(amount,enabled){this.breath=enabled?amount:0;}
 hide(hidden){if(this.context)this.master.gain.setTargetAtTime(hidden||!this.enabled?0:this.volume,this.context.currentTime,.5);}
 measure(){if(!this.analyser)return 0;const data=new Uint8Array(this.analyser.fftSize);this.analyser.getByteTimeDomainData(data);return Math.sqrt(data.reduce((n,x)=>n+((x-128)/128)**2,0)/data.length);}
}
