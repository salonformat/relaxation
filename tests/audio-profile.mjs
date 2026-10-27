import assert from 'node:assert/strict';
import {ambienceFor} from '../dist/audio-profile.js';
for(const place of ['sea','country','city'])for(const season of ['summer','autumn','winter'])for(const weather of ['clear','rain'])for(const wind of [false,true]){
 const p=ambienceFor({place,season,weather,wind},12);
 assert.ok(Object.values(p.gains).every(n=>Number.isFinite(n)&&n>=0));
 if(!wind){assert.equal(p.gains.wind,0);assert.equal(p.gains.leaves,0);}
 if(season==='winter'||weather==='clear')for(const k of ['rain','rainRoof','drops'])assert.equal(p.gains[k],0);
 if(place==='city'){assert.equal(p.gains.depth,0);assert.equal(p.gains.wash,0);assert.equal(p.gains.lapping,0);}
 if(place==='country')assert.ok(p.gains.lapping>0);
}
console.log('Scene ambience respects wind, precipitation and winter across 36 combinations.');
