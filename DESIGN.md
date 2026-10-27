---
name: Heute ist alles ein bisschen viel
description: Ankommen, hierbleiben oder sich kurz begleiten lassen.
colors:
  paper: "#eee7d5"
  ink: "#263f42"
  sage: "#c4ccba"
  muted: "#d3d9cf"
  panel: "#253e40"
  title-accent: "#e1c6aa"
  selected: "#566d62"
  selected-text: "#fff9ec"
  arrival: "#c9d2bd"
  arrival-ink: "#243e40"
  arrival-hover: "#d6ddcb"
typography:
  display:
    fontFamily: "Della, serif"
    fontSize: "clamp(50px,6.5vw,96px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-.035em"
  body:
    fontFamily: "Josefin, sans-serif"
    fontSize: "17px"
    lineHeight: 1.6
  signature:
    fontFamily: "Della, serif"
    fontSize: "22px"
    lineHeight: .95
    letterSpacing: "-.035em"
  conversation:
    fontFamily: "Della, serif"
    fontSize: "clamp(24px,3vw,38px)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-.02em"
  guidance:
    fontFamily: "Della, serif"
    fontSize: "clamp(22px,2.6vw,33px)"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  square: "0"
  circle: "50%"
spacing:
  tool-gap: "22px"
  place-gap: "13px"
  panel-padding: "29px 31px 25px"
components:
  line-button:
    textColor: "{colors.paper}"
    padding: "11px 0 9px"
    height: "47px"
  arrive:
    backgroundColor: "{colors.arrival}"
    textColor: "{colors.arrival-ink}"
    padding: "12px 20px"
  arrive-hover:
    backgroundColor: "{colors.arrival-hover}"
  segment-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.selected-text}"
    padding: "7px 9px"
  place-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    padding: "{spacing.panel-padding}"
    rounded: "{rounded.square}"
---
# Design System: Heute ist alles ein bisschen viel

## Overview

**Creative North Star: "Ankommen und hier sein"**

Eine gedämpfte illustrierte Landschaft trägt die Experience. Tintenfarbene Salbeiflächen und elfenbeinfarbene Schrift halten die Bedienung ruhig; der Titel steht direkt im Bild, ohne helle Papierkarte. Unregelmäßige Konturen und feine Binnenlinien der freigegebenen neuen Illustrationen bleiben erhalten.

Die drei neuen Grundszenen wurden mit dem eingebauten Bildgenerator anhand eigener Portfolioarbeiten als Stilreferenz erstellt und von der Nutzerin freigegeben. Drei einzelne schneebedeckte Winterfassungen ergänzen sie. Es sind keine von Isabella selbst handgezeichneten Originale. Der aktuelle Prototyp bietet eine einzige Ankunft mit freiwilliger kurzer Begleitung.

**Key Characteristics:**
- Gedämpfte Farben und dunkles Salbeigrün.
- Schrift direkt vor der ruhigen illustrierten Welt.
- Wenige Entscheidungen nacheinander.
- Kurze Hinweise, lange stille Zwischenräume.

## Colors

### Primary
- **Dunkles Salbei:** ink trägt den Hintergrund; panel ist die nahe verwandte Oberfläche der Ortswahl und des Dialogs.
- **Elfenbein:** paper trägt Schrift und Symbollinien.

### Secondary
- **Helles Salbei:** arrival macht „Hierhin“ sichtbar; selected kennzeichnet gewählte Jahreszeit und Wetter.
- **Gedämpftes Grün:** muted trägt optionale Nebeninformationen.
- **Warmer Sand:** title-accent betont das Titelwort; keine rote Aktionsfarbe mehr.

### Neutral

Die Illustrationen werden zur Laufzeit auf Sättigung .74 und Helligkeit .83 gedämpft; darüber liegt eine leichte dunkle Tönung. Ein richtungsabhängiger Schatten unterstützt die Lesbarkeit und wird nach der Ankunft schwächer. Die Landschaftspalette bleibt Bestandteil der Bildassets.

**The Quiet Contrast Rule.** Helle Schrift steht auf ruhiger dunkler Fläche; die Begrüßung erhält keine helle Karte.

## Typography

Josefin Sans (CSS-Familie Josefin, Fallback sans-serif) trägt Bedienung und den kurzen Untertitel. Della Respira (CSS-Familie Della, Fallback serif) trägt den großen Eingangstitel, Signatur, Einladung und Begleitung. Beide Schriften werden selbst gehostet; Lizenztexte liegen bei den Assets.

Auf Mobilgeräten nutzt der Eingangstitel clamp(43px,12vw,59px) bei 1.24 Zeilenhöhe, die Einladung 23px und der Begleittext 23px. Begleithinweise stehen mittig mit bewusst viel freier Fläche. Keine Großschreibung, Erfolgsabzeichen oder Textfülle ergänzen.

## Layout

Die Welt füllt den fixierten Viewport. Der Bildausschnitt wird mittig bildfüllend beschnitten. Der große Eingangstitel steht mittig bei 42% Höhe, mit 5% seitlichem Abstand, mobil 7%. Der Eintritt zeigt einen Horizontausschnitt der bereits freigegebenen Küstenillustration, ohne neues Bildasset. Nach ihr erscheint die zentrierte Ortswahl: maximal 610px breit, maximal Viewporthöhe minus 40px, intern scrollbar. Drei Vorschaubilder stehen nebeneinander. Wetter und Jahreszeit sind in einem zunächst geschlossenen Details-Bereich verborgen.

Die spätere Einladung liegt mittig; zwei Antworten stehen auf Desktop nebeneinander und mobil untereinander. Drei Begleitungen werden vertikal angeboten. Begleittext steht bei 29% Höhe, die bewegte Atemphasenbeschriftung im unteren Bildbereich, der freie Abbruch nahe dem unteren Rand. Signatur und Werkzeuge bleiben oben, Ortswechsel und Begleitung unten.

Breakpoints liegen bei 800px und 480px; niedrige Querformatfenster unter 650px Höhe ab 700px Breite erhalten kompaktere Maße. Mobil verschwinden Werkzeugbeschriftungen und Lautstärkeregler; zugängliche Namen bleiben. Ortswahl erhält 14px Außenabstand und Einstellungszeilen stehen untereinander.

## Elevation & Depth

Die Welt wird ausschließlich mit Canvas2D gerendert, ohne WebGL-Abhängigkeit und ohne getrennten statischen Fallback. Maskierte horizontale Streifen verformen die gemalte Wassertextur; breite bewegte Farbflächen bilden Wellen. Felsen und andere feste Bildteile bleiben stehen. Bei der Atembegleitung heben und senken sich Wassertextur und heller Wasserkamm. Es gibt keine alte Bildschicht über der neuen: der frühere Übergangs-Canvas wird geleert und bleibt unsichtbar; Szenen wechseln ohne Bildüberblendung.

Wind verändert Regen, Schnee, fallende Herbstblätter und Klang. Baumkronen werden nicht verformt. Frühling, Sommer und Herbst färben erkannte Blattflächen bei der Bildaufbereitung um; Winter lädt eigene schneebedeckte Bilder. Wetter liegt auf einem zusätzlichen Canvas, beim Fenster auf den Außenbereich begrenzt. Die Ortswahl hat den weichen Schatten (0 18px 65px #10222538), der Erklärdialog (0 20px 70px #10222555) mit dunklem Backdrop (#142e39a8).

## Shapes

Panels und Aktionsflächen bleiben rechtwinklig. Dünne Unterlinien und linke Linien kennzeichnen Handlungen; keine Kartensammlung oder helle Papierpolygonfläche. SVG-Symbole sind dünn, ungefüllt und mit runden Linienenden. Runde Formen bleiben Ortsmarkierung und Auswahlpunkt vorbehalten. Die Atemphase erscheint als schlichtes Wort, das mit der sichtbaren Wasserbewegung auf und ab wandert; kein Kreis oder Messinstrument.

## Components

### Arrival

Ein Eingang „Komm rein“ öffnet die Wahl. Der Titel lautet „Bleib kurz hier.“; darunter „Du musst gerade gar nichts.“. Presets setzen Meer auf Sommer/klar, See auf Herbst/klar und Fenster auf Sommer/Regen. „Mit Ton“ ist im Panel vorgewählt; der Eintrittsknopf kann den vorgewählten Klang bereits starten. „Hierhin“ bestätigt die Wahl. Etwa sieben Sekunden bleibt nur die Welt, dann folgt „Magst du einfach hier sein, oder soll ich dich ein bisschen begleiten?“ Ein Atemrhythmus beginnt dabei nicht.

### Actions and selection

Textaktionen tragen eine feine Unterlinie; Hover erweitert ihren Abstand von 28px auf 36px. „Hierhin“ ist eine helle salbeifarbene Fläche. Gewählte Vorschauen bekommen eine feine helle Kontur und unterstrichenen Namen. Gewählte Segmente bekommen dunkleres Salbei. Fokus bleibt sichtbar: 2px Elfenbein mit 6px Abstand. Werkzeuge sind mindestens 44px hoch; kompakte Segmente 38px.

### Language

DE, EN und FR stehen oben mittig als kleine Textschalter. Die Auswahl wird lokal gespeichert; ein gültiger ?lang=-Parameter kann sie beim Öffnen setzen. Alle sichtbaren Texte, zugänglichen Namen, Dokumentensprache, Titel, Beschreibung und Begleithinweise stammen aus `dist/copy.js`. Alltagssprache gilt in allen drei Sprachen. Längere französische Texte dürfen umbrechen und behalten dieselbe räumliche Hierarchie.

### Short companionship

„Einfach hier sein“ lässt die Welt stehen. „Begleite mich kurz“ bietet Atem (112 Sekunden), Körper (87 Sekunden) und Wahrnehmung (85 Sekunden). Die internen Zeitpläne sind kein angezeigter Countdown. Hinweise erscheinen kurz und verschwinden zwischen den Sätzen. „Für jetzt reicht’s“ oder Escape beendet frei. Ein reguläres Ende zeigt „Du kannst noch bleiben.“ für elf Sekunden; keine Bewertung folgt. Das frühere Knäuel gehört nicht mehr zum aktuellen Flow.

Nur die gewählte Atembegleitung schaltet zwischen Sekunde 23 und 90 einen angebotenen 4/6-Sekunden-Rhythmus ein: Wassertextur hebt und senkt sich, ein heller Wasserkamm folgt der Bewegung und Klang verändert sich leicht. Am Fenster wird stattdessen ein zurückhaltender Tageslichtschleier heller und dunkler: eine langsame Grundbewegung ergänzt während der Atembegleitung die atemabhängige Aufhellung (bis .11 zusätzliche Deckkraft). Die schlichte Beschriftung „Einatmen“/„Ausatmen“ wandert mit dem Rhythmus; es gibt keinen Atemkreis. Der Text erlaubt ausdrücklich den eigenen angenehmen Atem. Die Seite erfasst weder Atem noch andere physiologische Werte.

### Sound and motion

Web Audio synthetisiert Wasser-, Regen- und Windschichten aus gefiltertem Rauschen und langsamer Modulation. Es sind keine Feldaufnahmen. Ton bleibt abschaltbar, Lautstärke ist auf Desktop regelbar. Die Begleitung verwendet Text und Umgebungsklang.

Pause hält die Landschaftsbewegung an, nicht den Ablauf der Texthinweise oder den Umgebungsklang. Reduced-motion reduziert die Wellenstärke auf .35; die explizite Pause hält die Bewegung vollständig an. Bei verborgenem Tab wird Klang abgesenkt und der Begleitablauf angehalten. „Alles ausblenden“ macht die Oberfläche unsichtbar und inert; Zurück oder Escape stellt sie wieder her. Eine laufende Begleitung wird dadurch nicht automatisch beendet.

## Do's and Don'ts

### Do:
- **Do** keep illustration contours and fine internal lines intact.
- **Do** separate short German cues with silence.
- **Do** offer a free exit and optional sound.
- **Do** respect reduced motion and retain visible focus.

### Don't:
- **Don't** bring back the cream welcome card or the knot interaction.
- **Don't** start a breathing rhythm automatically on arrival.
- **Don't** add a voice narrator or a breathing circle.
- **Don't** claim breath measurement, therapeutic outcomes or a completion score.


## Water and sound refinement · 2026-10-27
The entrance now has one sentence and the entry button. Water uses continuous two-pixel displacement samples from an isolated water texture, keeping land out of the animated layer. Seven expanding swells dissolve in perspective; a separate broad lift of the water surface follows the voluntary four-second in / six-second out rhythm. The original horizon and land remain still. Reduced motion attenuates displacement, and pause freezes the scene.
The procedural stereo soundscape has separate deep water, surf wash, foam, rain, foliage, wind and irregular drop layers. Slow, unequal currents vary gain and filtering; surf shares a time base with the visible water. These are synthesized sounds, not field recordings. Sound still requires user interaction and fades when the tab is hidden.


## Five-minute journey · 2026-10-27
A prominent “Eine kleine Pause” / “A little break” / “Une petite pause” option now opens a 300-second sequence: arrival, hands and shoulders, 120 seconds of optional 4:6 breathing, and reorientation. A shared elapsed-time phase drives the words, duration label, water crest and daylight. Active breathing has no interpolation lag at the phase boundary. Pause freezes guidance as well as motion. Breathing can be skipped. Technique information states that the authored short programme is not clinically tested.
Autumn lake leaves are cut from the approved orchard image, fall, turn, settle and drift. The canopy bends gently under the same wind setting. Rain rings are clipped to the water; ambient motion is quieter during breathing.
