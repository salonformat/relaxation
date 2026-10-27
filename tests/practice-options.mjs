import assert from 'node:assert/strict';
import {copyForScene} from '../dist/scene-copy.js';
import {makeGuides} from '../dist/copy.js';
import {practiceCopy} from '../dist/practice-options.js';
import {breathAt} from '../dist/breath-rhythm.js';
for(const lang of ['de','en','fr'])for(const place of ['sea','country','city'])for(const duration of [60,300])for(const pattern of ['4-6','5-5']){
 const t=practiceCopy(copyForScene(lang,place,'summer'),lang,place,duration,pattern),g=makeGuides(t,duration);
 assert.equal(g.journey.end,duration);assert.equal(g.breath.end,60);
 assert.ok(g.journey.cues.every(c=>c.text&&c.at+c.hold<=duration));
 assert.equal((g.journey.breathUntil-g.journey.breathAt)%10,0);
 if(place==='city')assert.ok([...g.journey.cues,...g.breath.cues].every(c=>!(/\b(welle\w*|wasser|wave\w*|water|vague\w*|eau)\b/i.test(c.text))));
 if(pattern==='5-5')assert.ok(!g.journey.cues.some(c=>/Vier Sekunden|Four seconds|Quatre secondes/.test(c.text)));
}
for(const split of [4,5])for(let n=0;n<24;n++){
 assert.equal(breathAt(n*10,split).amount,0);assert.equal(breathAt(n*10+split,split).amount,1);assert.equal(breathAt(n*10+split,split).inhale,false);
}
console.log('Both durations and breathing patterns match all scenes and languages.');
