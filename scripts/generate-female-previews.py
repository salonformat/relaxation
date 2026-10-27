"""Generate separate, offline voice auditions; requires Piper, not shipped with the app."""
import io,json,wave,array
from pathlib import Path
from piper import PiperVoice,SynthesisConfig
ROOT=Path(__file__).resolve().parents[1]
MODELS=Path('/tmp/relaxation-voice-models')
voices={
 'de':('de_DE-kerstin-low',['Mach es dir bequem.','Lass die Schultern locker.','Atme in deinem eigenen Tempo.','Du kannst noch bleiben.']),
 'en':('en_GB-cori-high',['Get comfortable.','Let your shoulders relax.','Breathe at your own pace.','You can stay a little longer.']),
 'fr':('fr_FR-siwis-medium',['Mets-toi à l’aise.','Relâche un peu les épaules.','Respire à ton rythme.','Tu peux rester encore un peu.'])}
for lang,(name,sentences) in voices.items():
 voice=PiperVoice.load(str(MODELS/name/(name+'.onnx')))
 chunks=[];rate=None
 for text in sentences:
  buffer=io.BytesIO()
  with wave.open(buffer,'wb') as out:voice.synthesize_wav(text,out,syn_config=SynthesisConfig(length_scale=1.30,noise_scale=.55,noise_w_scale=.65,volume=.58))
  buffer.seek(0)
  with wave.open(buffer,'rb') as inp:
   rate=inp.getframerate();chunks.append(inp.readframes(inp.getnframes()))
 dest=ROOT/'audio-previews'/('relaxation-frau-'+lang+'.wav')
 with wave.open(str(dest),'wb') as out:
  out.setnchannels(1);out.setsampwidth(2);out.setframerate(rate);out.writeframes(bytes(int(rate*.5)*2))
  for index,chunk in enumerate(chunks):out.writeframes(chunk);out.writeframes(bytes(int(rate*(1.8 if index<len(chunks)-1 else .8))*2))
 with wave.open(str(dest),'rb') as check:
  frames=check.readframes(check.getnframes());samples=array.array('h',frames)
  print(json.dumps({'language':lang,'voice':name,'duration':round(len(samples)/rate,1),'peak':round(max(abs(s) for s in samples)/32768,3),'file':str(dest)}),flush=True)
