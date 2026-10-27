"""Second voice auditions: connected phrases instead of isolated sentence blocks."""
import io,wave,json
from dataclasses import replace
from pathlib import Path
from piper import PiperVoice,SynthesisConfig
ROOT=Path(__file__).resolve().parents[1]
MODELS=Path('/tmp/relaxation-voice-models')
items={
 'de':('en_GB-cori-high','de',['Mach es dir bequem. Lass die Schultern ein bisschen locker.','Atme einfach so, wie es sich für dich gut anfühlt. Du kannst noch bleiben.']),
 'en':('en_GB-cori-high','en',['Get comfortable. Let your shoulders relax a little.','Breathe in whatever way feels comfortable. You can stay a little longer.']),
 'fr':('fr_FR-siwis-medium','fr',['Mets-toi à l’aise. Relâche un peu les épaules.','Respire comme tu en as envie. Tu peux rester encore un peu.'])}
for lang,(name,pronunciation,paragraphs) in items.items():
 voice=PiperVoice.load(str(MODELS/name/(name+'.onnx')))
 voice.config=replace(voice.config,espeak_voice=pronunciation)
 chunks=[];rate=None
 for paragraph in paragraphs:
  b=io.BytesIO()
  with wave.open(b,'wb') as out:voice.synthesize_wav(paragraph,out,syn_config=SynthesisConfig(length_scale=1.14,noise_scale=.6,noise_w_scale=.75,volume=.58))
  b.seek(0)
  with wave.open(b,'rb') as inp:rate=inp.getframerate();chunks.append(inp.readframes(inp.getnframes()))
 path=ROOT/'audio-previews'/f'relaxation-frau-{lang}-v2.wav'
 with wave.open(str(path),'wb') as out:
  out.setnchannels(1);out.setsampwidth(2);out.setframerate(rate);out.writeframes(bytes(int(rate*.35)*2))
  for i,chunk in enumerate(chunks):out.writeframes(chunk);out.writeframes(bytes(int(rate*(2.0 if i==0 else .8))*2))
 with wave.open(str(path),'rb') as inp:print(json.dumps({'language':lang,'voice':name,'pronunciation':pronunciation,'seconds':round(inp.getnframes()/rate,2),'path':str(path)}),flush=True)
