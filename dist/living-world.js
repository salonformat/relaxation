// Canvas animation runs in the in-app browser as well as browsers with WebGL.
const definitions={sea:{base:'assets/coast.jpg',winter:'assets/coast-winter.jpg'},country:{base:'assets/orchard.jpg',winter:'assets/orchard-winter.jpg'},city:{base:'assets/window.jpg',winter:'assets/window-winter.jpg'}};
const images={};const cache=new Map();
const create=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
for(const [place,urls]of Object.entries(definitions)){images[place]={};for(const [season,url]of Object.entries(urls)){const image=new Image();image.onload=()=>{images[place][season]=image;cache.clear();window.dispatchEvent(new Event('relaxation-art-ready'));};image.src=url;}}
const stage=create(1,1),water=create(1,1),leaves=create(1,1);const sc=stage.getContext('2d'),wc=water.getContext('2d'),lc=leaves.getContext('2d');
function prepare(W,H,state){
 const intro=state.mode==='welcome'&&!state.portalOpen;
 const key=[state.place,state.season,intro,W,H].join(':');if(cache.has(key))return cache.get(key);
 const image=state.season==='winter'?images[state.place].winter:images[state.place].base;if(!image)return null;
 const source=create(W,H),c=source.getContext('2d',{willReadFrequently:true});const tile=intro?[.02,.27,.68,.40]:[0,0,1,1];
 const sx=image.width*tile[0],sy=image.height*tile[1],sw=image.width*tile[2],sh=image.height*tile[3],scale=Math.max(W/sw,H/sh),dw=sw*scale,dh=sh*scale,dx=(W-dw)/2,dy=(H-dh)/2;
 c.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
 const pixels=c.getImageData(0,0,W,H),waterData=c.createImageData(W,H),leafData=c.createImageData(W,H);let minY=H,maxY=0;
 const originalPixels=new Uint8ClampedArray(pixels.data);
 const leafColors={spring:[146,166,112],summer:[102,130,87],autumn:[173,110,66]};
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const i=(y*W+x)*4,originalY=tile[1]+((y-dy)/dh)*tile[3],originalX=tile[0]+((x-dx)/dw)*tile[2];
  let r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2];
  // Remove the pale illustration seam at the lake horizon by extending the
  // neighbouring water colour into that narrow line, leaving hills untouched.
  if(state.place==='country'&&state.season!=='winter'&&originalY>.475&&originalY<.515&&originalX<.66&&r>180&&g>170&&b>135){
   const below=Math.min(H-1,y+Math.max(2,Math.ceil(8*scale))),j=(below*W+x)*4;
   const nr=originalPixels[j],ng=originalPixels[j+1],nb=originalPixels[j+2];
   if(ng-nr>20&&nb-nr>30){r=nr;g=ng;b=nb;}
  }
  if(state.place!=='city'&&(originalY>.73||(originalY<.34&&originalX>.23))&&r>180&&g>165&&b>140&&Math.max(r,g,b)-Math.min(r,g,b)<70){
   let best=r+g+b,near=null;const radius=Math.max(2,Math.round(W/500));
   for(const [ox,oy]of [[-radius,0],[radius,0],[0,-radius],[0,radius]]){
    const xx=Math.max(0,Math.min(W-1,x+ox)),yy=Math.max(0,Math.min(H-1,y+oy)),j=(yy*W+xx)*4,sum=originalPixels[j]+originalPixels[j+1]+originalPixels[j+2];
    if(sum<best-30){best=sum;near=[originalPixels[j],originalPixels[j+1],originalPixels[j+2]];}
   }
   if(near){r=r*.30+near[0]*.70;g=g*.30+near[1]*.70;b=b*.30+near[2]*.70;}
  }
  const isWater=state.place!=='city'&&originalY>.385&&originalY<.91&&g-r>25&&b-r>35&&b>=g*.98&&r<180;
  if(isWater){waterData.data[i+3]=255;minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  const green=g-r>3&&g-b>9,ochre=r-g>17&&g-b>18;
  const isLeaf=originalY<.49&&(green||ochre);
  const isCurtain=state.place==='city'&&originalX<.20&&r>180&&g>160;
  if(isLeaf||isCurtain)leafData.data[i+3]=255;
  if(isLeaf&&state.season!=='winter'){
   let target=leafColors[state.season];if(state.place==='sea'&&state.season==='autumn')target=[94,115,87];
   if(target){const amount=.65;r=r*(1-amount)+target[0]*amount;g=g*(1-amount)+target[1]*amount;b=b*(1-amount)+target[2]*amount;}
  }
  const luminance=r*.2126+g*.7152+b*.0722;
  pixels.data[i]=(luminance*.26+r*.74)*.83*.955+31*.045;
  pixels.data[i+1]=(luminance*.26+g*.74)*.83*.955+48*.045;
  pixels.data[i+2]=(luminance*.26+b*.74)*.83*.955+54*.045;
 }
 // Feather the water boundary inward so moving paint never drags a shore edge.
 const distance=new Float32Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=y*W+x;distance[k]=waterData.data[k*4+3]?Math.min(x?distance[k-1]+1:0,y?distance[k-W]+1:0,100):0;}
 for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const k=y*W+x;distance[k]=Math.min(distance[k],x<W-1?distance[k+1]+1:0,y<H-1?distance[k+W]+1:0);}
 const edgeData=c.createImageData(W,H);for(let k=0;k<distance.length;k++)edgeData.data[k*4+3]=Math.max(0,Math.min(1,(distance[k]-10)/18))*255;
 c.putImageData(pixels,0,0);const mask=create(W,H),leafMask=create(W,H);mask.getContext('2d').putImageData(edgeData,0,0);leafMask.getContext('2d').putImageData(leafData,0,0);
 // Extend water paint beneath the shoreline before displacement. Transparent
 // cut-outs would otherwise carry silhouettes of furniture or rocks into the sea.
 const texture=create(W,H),tc=texture.getContext('2d'),paint=new ImageData(new Uint8ClampedArray(pixels.data),W,H);
 let previous=[48,87,105];
 for(let y=0;y<H;y++){
  const nearest=new Int32Array(W);let left=-W*2;
  for(let x=0;x<W;x++){if(waterData.data[(y*W+x)*4+3])left=x;nearest[x]=left;}
  let right=W*3;
  for(let x=W-1;x>=0;x--){const i=(y*W+x)*4;if(waterData.data[i+3]){right=x;previous=[pixels.data[i],pixels.data[i+1],pixels.data[i+2]];}
   else {const nx=x-nearest[x]<right-x?nearest[x]:right,si=(y*W+nx)*4;for(let ch=0;ch<3;ch++)paint.data[i+ch]=nx>=0&&nx<W?pixels.data[si+ch]:previous[ch];}
   paint.data[i+3]=255;
  }
 }
 tc.putImageData(paint,0,0);
 const result={source,texture,mask,leafMask,minY,maxY};if(cache.size>=2)cache.delete(cache.keys().next().value);cache.set(key,result);return result;
}
function waterMotion(data,W,H,time,state){
 wc.clearRect(0,0,W,H);
 const strength=state.motionScale??1,depth=Math.max(1,data.maxY-data.minY);
 const breath=(state.breathAmount||0)*strength;
 // Continuous displacement: tiny adjacent samples keep the painted contours intact.
 // Movement increases towards the viewer, leaving the distant horizon still.
 const lift=breath*depth*.15;
 for(let y=Math.max(0,data.minY);y<=data.maxY;y+=2){
  const z=Math.max(0,(y-data.minY)/depth),perspective=z*z;
  const surge=Math.sin(time*.58-z*7)*depth*.014+Math.sin(time*.31-z*4)*depth*.008;
  const offset=surge*strength*(state.breathing?.10:.25)*Math.min(1,z*5);
  const x=(Math.sin(time*.27-z*5)*W*.009+Math.sin(time*.43-z*11)*W*.003)*perspective*strength;
  const yy=Math.max(0,Math.min(data.maxY-2,Math.max(data.minY+1,y-offset)));
  wc.drawImage(data.texture,0,yy,W,2,x,y,W,2);
  if(x>0)wc.drawImage(data.texture,0,yy,Math.ceil(x)+1,2,0,y,Math.ceil(x)+1,2);
  else if(x<0)wc.drawImage(data.texture,W+Math.floor(x)-1,yy,-Math.floor(x)+1,2,W+Math.floor(x)-1,y,-Math.floor(x)+1,2);
 }
 // Swells expand in perspective. Each crest grows, folds softly, then dissolves.
 for(let n=0;n<7;n++){
  const phase=(time/19+n/7)%1,z=phase*phase;
  const y=data.minY+depth*(.02+z*1.15)-lift*Math.min(1,phase*3);
  const amp=depth*(.004+z*.035)*strength;
  const width=depth*(.008+z*.095);
  const fade=Math.sin(Math.PI*phase)**1.5*(state.breathing?.22:1);
  const crest=x=>y+amp*(Math.sin(x/W*5.1+n*1.7+time*.12)+.3*Math.sin(x/W*11.3-n+time*.19));
  const wash=wc.createLinearGradient(0,y-amp,0,y+width+amp);
  wash.addColorStop(0,`rgba(156,190,185,${fade*.26})`);
  wash.addColorStop(.27,`rgba(135,173,173,${fade*.16})`);
  wash.addColorStop(1,'rgba(28,64,79,0)');
  wc.fillStyle=wash;wc.beginPath();
  for(let x=-4;x<=W+8;x+=8){const yy=crest(x);x===-4?wc.moveTo(x,yy):wc.lineTo(x,yy);}
  wc.lineTo(W+8,y+width+amp*2);wc.lineTo(-4,y+width+amp*2);wc.closePath();wc.fill();
  // Uneven, broken highlights belong to the drawn surface, never a neon outline.
  wc.lineWidth=.6+z*1.5;wc.strokeStyle=`rgba(204,214,195,${fade*(.13+z*.22)})`;
  for(let j=0;j<(state.mode==='welcome'&&!state.portalOpen?0:3);j++){
   const start=W*((j*.37+n*.19)%1),length=W*(.08+z*.13);
   wc.beginPath();for(let x=start;x<Math.min(W,start+length);x+=5){const yy=crest(x);x===start?wc.moveTo(x,yy):wc.lineTo(x,yy);}wc.stroke();
  }
 }
 // One broad swell is the breath cue: a rising surface, not a separate symbol.
 if(state.breathing||breath>.001){
  wc.save();wc.globalAlpha=state.breathing?1:Math.min(1,breath*8);
  const y=data.minY+depth*(.75-breath*.32),amp=depth*.022;
  const glow=wc.createLinearGradient(0,y-amp,0,y+depth*.20);
  glow.addColorStop(0,`rgba(194,215,199,${.18+breath*.27})`);glow.addColorStop(1,'rgba(181,204,191,0)');
  wc.fillStyle=glow;wc.beginPath();
  for(let x=-8;x<=W+8;x+=8){const yy=y+Math.sin(x/W*5.4)*amp;x===-8?wc.moveTo(x,yy):wc.lineTo(x,yy);}
  wc.lineTo(W+8,y+depth*.25);wc.lineTo(-8,y+depth*.25);wc.closePath();wc.fill();
  wc.beginPath();for(let x=-8;x<=W+8;x+=8){const yy=y+Math.sin(x/W*5.4)*amp;x===-8?wc.moveTo(x,yy):wc.lineTo(x,yy);}wc.strokeStyle='rgba(218,227,207,.62)';wc.lineWidth=2;wc.stroke();wc.restore();
 }
 if(state.weather==='rain'&&state.season!=='winter'){
  const quiet=state.breathing?.3:1;
  for(let i=0;i<38;i++){
   const age=(time*.7+i*.618)%1,x=((Math.sin(i*73.1)*437.3)%1+1)%1*W,y=data.minY+depth*(.12+(((Math.sin(i*51.7)*713.3)%1+1)%1)*.83);
   wc.strokeStyle=`rgba(192,214,206,${(1-age)*.35*quiet})`;wc.lineWidth=.7;wc.beginPath();wc.ellipse(x,y,(2+age*19)*(0.3+(y-data.minY)/depth),1+age*4,0,0,Math.PI*2);wc.stroke();
  }
 }
 wc.globalCompositeOperation='destination-in';wc.drawImage(data.mask,0,0);wc.globalCompositeOperation='source-over';sc.drawImage(water,0,0);
}
export function drawLivingWorld(ctx,W,H,time,state){
 W=Math.round(W);H=Math.round(H);const data=prepare(W,H,state);if(!data)return;
 if(stage.width!==W||stage.height!==H)for(const c of [stage,water,leaves]){c.width=W;c.height=H;}
 sc.clearRect(0,0,W,H);sc.drawImage(data.source,0,0);
 if(state.wind&&state.place!=='city'&&!(state.mode==='welcome'&&!state.portalOpen)){
  // Bend the existing canopy continuously; replace rows rather than overlaying a copy.
  const end=H*.40,quiet=state.breathing?.35:1;
  for(let y=0;y<end;y+=2){const x=Math.sin(time*.55+y/H*2.5)*W*.0028*(1-y/end)**2*(state.motionScale??1)*quiet;
   sc.drawImage(data.source,0,y,W,2,x,y,W,2);
  }
 }

 if(state.place!=='city')waterMotion(data,W,H,time,state);
 if(state.place==='city'){
  const breath=state.breathAmount||0,light=.012+(Math.sin(time*.22)+1)*.008+breath*.11;
  const wash=sc.createLinearGradient(0,0,W*.25,H*.76);wash.addColorStop(0,`rgba(221,226,204,${light})`);wash.addColorStop(1,'rgba(221,226,204,0)');sc.fillStyle=wash;sc.fillRect(0,0,W,H);
 }
 ctx.drawImage(stage,0,0,W,H);
}
export function worldIsReady(place){return !!images[place]?.winter;}
