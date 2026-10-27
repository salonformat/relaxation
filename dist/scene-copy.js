import {copy} from './copy.js';

// Resolve the whole scene's copy together: choices, cues and exercise explanations.
// The window uses daylight; sea and lake use a rising and falling water crest.
const windowCopy={
 de:{hint:'Folge dem Licht am Fenster.',breathIntro:'Atme ein, wenn das Licht heller wird.\nAtme aus, wenn es dunkler wird.',breathStart:'Probier es mit dem Licht.',journeyIntro:'Jetzt kannst du eine Weile dem Licht folgen.\nAugen wieder auf, wenn du magst.',about:'Du hast eine Weile auf deinen Atem geachtet. Das Licht am Fenster wird vier Sekunden heller und sechs Sekunden dunkler. Du kannst in diesem Rhythmus atmen oder bei deinem eigenen Tempo bleiben. Die Seite misst deinen Atem nicht.'},
 en:{hint:'Follow the light by the window.',breathIntro:'Breathe in as the light brightens.\nBreathe out as it dims.',breathStart:'Try following the light.',journeyIntro:'Now you can follow the light for a while.\nOpen your eyes again, if you like.',about:'You spent a little time noticing your breath. The light by the window brightens for four seconds and dims for six. You can follow this rhythm or use your own pace. The site doesn’t measure your breathing.'},
 fr:{hint:'Suis la lumière à la fenêtre.',breathIntro:'Inspire quand la lumière devient plus claire.\nExpire quand elle s’atténue.',breathStart:'Essaie de suivre la lumière.',journeyIntro:'Tu peux maintenant suivre la lumière.\nRouvre les yeux si tu en as envie.',about:'Tu as pris un moment pour écouter ta respiration. La lumière à la fenêtre devient plus claire pendant quatre secondes, puis s’atténue pendant six secondes. Tu peux suivre ce rythme ou garder le tien. Le site ne mesure pas ta respiration.'}
};
export function copyForScene(language,place,season){
 const original=copy[language];
 const base=season==='winter'?{...original,rain:({de:'Schnee',en:'Snow',fr:'Neige'})[language]}:original;
 if(place!=='city')return base;
 const text=windowCopy[language];
 const breath={...base.guides.breath,cues:[...base.guides.breath.cues],about:text.about};
 breath.cues[1]=text.breathIntro;breath.cues[3]=text.breathStart;
 const journey={...base.guides.journey,cues:[...base.guides.journey.cues]};
 journey.cues[10]=text.journeyIntro;journey.cues[11]=text.breathIntro;
 return {...base,breathHint:text.hint,guides:{...base.guides,breath,journey}};
}
