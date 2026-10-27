import assert from 'node:assert/strict';
import {breathAt} from '../dist/breath-rhythm.js';
import {copy,makeGuides} from '../dist/copy.js';
for(let cycle=0;cycle<12;cycle++){
 const start=cycle*10;
 assert.equal(breathAt(start).amount,0);
 assert.equal(breathAt(start+3.999).inhale,true);
 assert.equal(breathAt(start+4).inhale,false);
 assert.equal(breathAt(start+4).amount,1);
 assert.equal(breathAt(start+9.999).inhale,false);
 assert.ok(Math.abs(breathAt(start+2).amount-.5)<1e-10);
 assert.ok(Math.abs(breathAt(start+7).amount-.5)<1e-10);
}
for(const lang of ['de','en','fr']){
 const g=makeGuides(copy[lang]).journey;
 assert.equal(g.end,300);assert.equal(g.breathUntil-g.breathAt,120);
 assert.equal(g.cues.length,19);assert.ok(g.cues.every(c=>typeof c.text==='string'&&c.text.length));
 assert.equal(g.cues.find(c=>c.at===59).at-g.cues.find(c=>c.at===54).at,5);
 assert.equal(g.cues.find(c=>c.at===84).at-g.cues.find(c=>c.at===79).at,5);
}
console.log('12 breath cycles, muscle-release timings and DE/EN/FR journey cues passed.');
