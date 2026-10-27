// Falling leaves are cut from the existing illustration, preserving its paint and edges.
const sprites=[];
const orchard=new Image();orchard.src='assets/orchard.jpg';orchard.onload=()=>{
 for(const [x,y,w,h]of [[801,937,118,48],[872,882,73,43],[930,961,84,49]]){
  const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(orchard,x,y,w,h,0,0,w,h);
  const p=ctx.getImageData(0,0,w,h);for(let i=0;i<p.data.length;i+=4){const r=p.data[i],g=p.data[i+1],b=p.data[i+2];if(r-g<27||g-b<13)p.data[i+3]=0;else{p.data[i]=r*.75;p.data[i+1]=g*.79;p.data[i+2]=b*.81;}}
  ctx.putImageData(p,0,0);sprites.push(c);
 }
};
const hash=n=>{const v=Math.sin(n*73.17+19.3)*43758.5453;return v-Math.floor(v);};
export function drawFallingLeaves(ctx,W,H,time,state){
 if(state.place!=='country'||state.season!=='autumn'||!sprites.length)return;
 const quiet=state.breathing?.32:1,scale=state.motionScale??1;
 for(let i=0;i<9;i++){
  const cycle=25+hash(i+3)*12,age=(time+i*4.9)%cycle,fall=11+hash(i+5)*5;
  const startX=.37+hash(i+10)*.27,startY=.04+hash(i+30)*.15,landingX=startX-(state.wind?.13:.025),landingY=.60+hash(i+44)*.08;
  const falling=age<fall,p=Math.min(1,age/fall),floatAge=Math.max(0,age-fall);
  const x=W*(falling?startX+(landingX-startX)*p:landingX-floatAge*.002)+Math.sin(age*.9+i)*W*.014*scale;
  const y=H*(falling?startY+(landingY-startY)*p:landingY)+Math.sin(age*1.2+i)*(falling?10:2)*scale;
  const fade=Math.min(1,age/1.1)*Math.max(0,1-floatAge/(cycle-fall));
  ctx.save();ctx.globalAlpha=fade*quiet;ctx.translate(x,y);ctx.rotate(falling?Math.sin(age*.65+i)*.8+age*.14:Math.sin(age*.4+i)*.12);
  const size=(24+hash(i+70)*18)*(W<500?.8:1);ctx.scale(1,falling?(.55+Math.abs(Math.cos(age*.9+i))*.45):.35);ctx.drawImage(sprites[i%3],-size/2,-size*.23,size,size*.46);ctx.restore();
  if(!falling&&floatAge<2.4){ctx.save();ctx.globalAlpha=(1-floatAge/2.4)*.26*quiet;ctx.strokeStyle='#d1dbcb';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,y,5+floatAge*15,1.5+floatAge*4,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 }
}
