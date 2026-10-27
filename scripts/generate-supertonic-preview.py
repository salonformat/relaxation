import os
os.environ['HF_HOME']='/tmp/relaxation-supertonic-cache'
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
from supertonic import TTS
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
tts=TTS(model='supertonic-3',model_dir='/tmp/relaxation-supertonic-models',auto_download=False,intra_op_num_threads=4)
print('VOICES',tts.voice_style_names,flush=True)
style=tts.get_voice_style(voice_name='F5')
text='Mach es dir bequem. Lass die Schultern ein bisschen locker. Atme einfach in deinem eigenen Tempo. Du kannst noch bleiben.'
wav,duration=tts.synthesize(text,voice_style=style,lang='de',speed=.90,total_steps=12,silence_duration=.7)
out=root/'audio-previews/relaxation-frau-de-supertonic.wav'
tts.save_audio(wav,str(out))
print(json.dumps({'path':str(out),'duration':str(duration),'sample_rate':tts.sample_rate}),flush=True)
