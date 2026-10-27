# Local voice audition

`relaxation-stimme-probe.wav` is a synthetic German listening sample, not a human recording and not yet enabled in the experience. Generated locally with Piper 1.8.0, de_DE-thorsten-high. This is a pretrained voice, not a newly trained exclusive voice. Dataset licence is CC0 according to the model card.

Model: https://huggingface.co/rhasspy/piper-voices/tree/main/de/de_DE/thorsten/high
Dataset: https://github.com/thorstenMueller/Thorsten-Voice
Engine: https://github.com/OHF-Voice/piper1-gpl (GPL-3.0; generation environment and model are not distributed here).

Settings: length scale 1.12, sentence silence 1.2 s, output volume 0.65.
Text: Mach es dir bequem. Du musst gerade gar nichts. Schau einen Moment aufs Wasser. Atme sanft ein. Und lass die Luft langsam wieder ausströmen. Du kannst noch bleiben.

The sample needs a listening review; naturalness and suitability have not been established.

## Female auditions (2026-10-27)

These replace the male sample for listening review. They are three different pretrained synthetic female voices, not one cloned multilingual speaker. None is enabled in the experience yet.

- `relaxation-frau-de.wav`: de_DE-kerstin-low; Kerstin dataset, CC0. Source: https://github.com/rhasspy/dataset-voice-kerstin . Model card: https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/kerstin/low/MODEL_CARD
- `relaxation-frau-en.wav`: en_GB-cori-high; UK English female voice, LibriVox public-domain recordings. Dataset preparation/training: https://brycebeattie.com/files/tts/ . Model card: https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/cori/high/MODEL_CARD
- `relaxation-frau-fr.wav`: fr_FR-siwis-medium; SIWIS French Speech Synthesis Database, University of Edinburgh / SIWIS contributors, CC BY 4.0. Source and attribution: https://datashare.is.ed.ac.uk/handle/10283/2353 . Licence: https://creativecommons.org/licenses/by/4.0/ . Model card: https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD

All generated locally with Piper 1.8.0. Length scale 1.30, volume 0.58, 1.8-second pauses between separately generated sentences, 0.5-second leading silence and 0.8-second trailing silence. Script and exact text: `scripts/generate-female-previews.py`. No voice models or generation engine are redistributed. Technical WAV checks confirm format, duration and no clipping; perceived pleasantness remains a listening judgement.
