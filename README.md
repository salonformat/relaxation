# Bleib kurz hier.

Eine illustrierte Pause von Salon Format. Arbeitsname: **relaxation**. Der aktuelle lokale Prototyp konzentriert sich auf Ankommen, Hierbleiben und freiwillige kurze Begleitung.

## Lokal öffnen

```sh
npm run dev
```

Danach http://127.0.0.1:4317 öffnen. Keine Installation und kein Framework nötig. Ein lokaler HTTP-Server wird für ES-Module und Bildtexturen benötigt; direktes Öffnen als Datei ist nicht der unterstützte Weg.

## Experience

1. Animierter gezeichneter Horizont: „Bleib kurz hier.“ / „Stay a little while.“ / „Reste un peu.“ und „Komm rein“ / „Come on in“ / „Entre“. Danach Meer, See oder Fenster wählen.
2. Bei Bedarf Wetter, Jahreszeit, Wind und Ton wählen; mit „Hierhin“ ankommen.
3. Nach etwa sieben Sekunden einfach bleiben oder eine kurze Begleitung auswählen.

Drei Begleitungen bieten kurze Texthinweise mit stillen Zwischenräumen: Atem (112 Sekunden), Körper (87 Sekunden), Wahrnehmung (85 Sekunden). Es gibt keinen sichtbaren Countdown, Punktestand oder eine Abschlussbewertung. Jederzeit abbrechbar. Das Ende sagt „Du kannst noch bleiben.“ Das frühere Knäuel wurde aus der Oberfläche entfernt.

Ein Atemrhythmus erscheint ausschließlich innerhalb der selbst gewählten Atembegleitung. Er hebt und senkt sichtbar das Wasser und einen hellen Wasserkamm; am Fenster wird das Tageslicht sanft heller und dunkler. Eine schlichte Phasenbeschriftung folgt der Bewegung. Er bietet Bild und Klang an, misst aber keinen Atem. Die Begleitung bleibt textlich. Umgebungsklang ist synthetisches Wasser, Regen und Wind; keine Naturaufnahme. Ton, Bewegung und Oberfläche sind separat bedienbar. Reduced-motion senkt die Wellenstärke auf .35; Pause stoppt die Bewegung vollständig. Die Bewegungspause stoppt nicht den zeitlichen Textablauf.

Die Sprachwahl DE/EN/FR aktualisiert die gesamte Oberfläche samt zugänglichen Namen, Metadaten und Begleitung; sie bleibt lokal gespeichert. `dist/copy.js` ist die verbindliche Textquelle.

## Bilder und Darstellung

Die drei freigegebenen neuen Grundszenen wurden mit dem eingebauten Bildgenerator anhand eigener Portfolioarbeiten als Stilreferenz erstellt. Drei separate schneebedeckte Wintereditionen ergänzen sie. Es sind keine handgezeichneten Originalarbeiten von Isabella. Verworfene Vierer-Saisonblätter werden nicht verwendet. Quell-PNGs und Prompt-JSONs liegen in `artwork/`, ausgelieferte JPGs in `dist/assets/`; Stilreferenzen in `.impeccable/references/`.

Canvas2D dämpft die Bilder (Sättigung .74, Helligkeit .83), verformt die Wassertextur in maskierten horizontalen Streifen und zeichnet breite bewegte Wellenflächen. Felsen und statische Bildteile bleiben stehen. Es gibt keine WebGL-Abhängigkeit und keine alte Bildschicht bei Szenenwechseln. Wind beeinflusst Wetterpartikel, fallende Herbstblätter und Klang. Jahreszeiten färben erkannte Blattflächen um; Winter lädt eigene Bilder. Der Eintritt nutzt einen Horizontausschnitt der bestehenden Küste, kein neues Bildasset. Josefin Sans und Della Respira werden selbst gehostet; Lizenzen siehe `dist/assets/OFL-*.txt`.

## Prüfen

```sh
npm run check
```

Laut vorliegenden Prüfberichten bestanden die drei Sprachfassungen die Layout-, Fehler- und Klangprüfungen. Ein Lauf ohne WebGL bestätigte bewegten Eintritt, Pause und fehlende alte Bildüberlagerung. Die abschließende Prüfung bestätigte „Einatmen“, „Breathe in“ und „Inspire“, ohne JavaScript-Fehler und ohne Sprachausgabe-Oberfläche.

## Aufbau

- `dist/index.html`: zugängliche Oberfläche
- `dist/style.css`: dunkle Salbeioberfläche, Typografie und responsive Regeln
- `dist/app.js`: Ankunft, Begleittexte, Wetter und Eingaben
- `dist/living-world.js`: Illustrationen, Winterbilder und Canvas2D-Wasseranimation
- `dist/copy.js`: vollständige deutsche, englische und französische Texte
- `dist/sound.js`: synthetische Klanglandschaft
- `artwork/`: Bildquellen und genaue Prompts
- `DESIGN.md`: aktuelles visuelles System
- `COPY.md`: aktuelle Sprache und Begleittexte
- `RESEARCH.md`: gestalterische und inhaltliche Quellen

Lokal und für das private GitHub-Repository vorgesehen; keine öffentliche Bereitstellung. Keine Anmeldung, Analysewerkzeuge oder Fortschrittsmechanik.


## Public website

https://salonformat.github.io/relaxation/

GitHub Pages publishes `dist/` using `.github/workflows/pages.yml` after script checks and behaviour tests pass. Audio auditions and local export materials are not part of the deployed site.

### Rendering and loading
The entrance prioritizes the coast image; other scenes and winter artwork load on demand. Scene masks and audio noise buffers are prepared in small tasks so input and rendering can continue. Canvas rendering targets 60 fps, uses one backing pixel per CSS pixel, and caps the landscape work surface at 1440 × 1080. Steam uses a cached brush instead of per-frame blur; paused scenes stop drawing.

In a local headless Chromium check, the window renderer dropped from approximately 29 ms to 2.6 ms per frame. Desktop and mobile viewport checks reached approximately 60 fps. These are controlled browser measurements, not guarantees for every phone.
