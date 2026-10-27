import assert from 'node:assert/strict';
import {copyForScene} from '../dist/scene-copy.js';
import {makeGuides} from '../dist/copy.js';
const water=/\b(welle\w*|wasser|wave\w*|water|vague\w*|eau)\b/i;
for(const lang of ['de','en','fr']){
 const window=copyForScene(lang,'city'),guides=makeGuides(window);
 const strings=[window.breathHint,...Object.values(guides).flatMap(g=>[g.about,...g.cues.map(c=>c.text)])];
 assert.ok(strings.every(text=>!water.test(text)),lang+': window must not refer to water');
 assert.ok(guides.breath.cues[1].text.length&&guides.breath.cues[3].text.length);
 for(const place of ['sea','country']){
  const scene=copyForScene(lang,place);
  assert.match(scene.breathHint,water);
  assert.match(scene.guides.breath.cues[3],water);
  assert.match(scene.guides.journey.cues[11],water);
 }
 // Resolving a window must never mutate the original water-scene dictionary.
 assert.match(copyForScene(lang,'sea').guides.breath.about,water);
}
console.log('Choices, every cue and explanations match all 3 scenes in DE/EN/FR.');

for(const [lang,label] of [['de','Schnee'],['en','Snow'],['fr','Neige']]){
 for(const place of ['sea','country','city']){
  assert.equal(copyForScene(lang,place,'winter').rain,label);
  assert.notEqual(copyForScene(lang,place,'summer').rain,label);
 }
}
