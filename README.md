# Vokabelkoje

Sprachen lernen auf großer Fahrt: Karteikarten, Lernpfade bis C2, Möwen-Schnack, Seeungeheuer-Wachen, Kindermodus.

**App-Adresse:** https://feuerfuchs89.github.io/Vokabelkoje/

Inhalt: [App installieren](#app-installieren) · [Gemini-Schlüssel holen](#gemini-schlüssel-holen-für-die-ki) ·
[GitHub-Token holen](#github-token-holen-für-den-abgleich) · [Geräte verbinden](#weitere-eigene-geräte-verbinden-ohne-abtippen) · [Für die Familie](#für-die-familie) ·
[Auf GitHub Pages bringen](#auf-github-pages-bringen)

## App installieren

- **Android:** Adresse in **Chrome** öffnen → Menü **⋮** → **App installieren** (oder „Zum Startbildschirm hinzufügen“).
- **iPhone/iPad:** Adresse in **Safari** öffnen → **Teilen** → **Zum Home-Bildschirm**.
  Wichtig: Nur so bleiben die Daten sicher; Safari löscht Daten von Webseiten, die 7 Tage nicht geöffnet wurden.
- Beim ersten Start: Möwe taufen, Lernsprache wählen, loslegen.

Alle Lerndaten, Schlüssel und Einstellungen liegen **nur auf dem eigenen Gerät** (im Browser). Updates der App ändern daran nichts.
Weg sind sie nur, wenn man in Chrome die Websitedaten löscht, die App deinstalliert oder ein anderes Gerät/einen anderen Browser nimmt.

## Gemini-Schlüssel holen (für die KI)

Ohne Schlüssel gehen Karteikarten, Lernen, Test, Zuordnen, Wache, Hördiktat und Startpaket.
Mit Schlüssel kommen dazu: Lernpfade, Schnack mit der Möwe, Gespräche, Übersetzen, Foto-Erkennung, Seemannsgarn,
Tagesübung und die Gemini-Stimme. Der Schlüssel ist kostenlos.

1. Im Browser **aistudio.google.com/apikey** öffnen und mit dem eigenen **Google-Konto** anmelden
   (beim ersten Mal die Nutzungsbedingungen bestätigen).
2. Auf **„Create API key“** tippen. Falls gefragt: **„Create API key in new project“**.
3. Den Schlüssel (beginnt meist mit `AIza…`) mit dem **Kopier-Symbol** kopieren.
4. In der Vokabelkoje: **Profil → Einstellungen und Sicherung → KI (Gemini)** → einfügen → **Speichern**.
5. Optional: **Profil → Ton und Stimmen → „Gemini-Stimme testen“** zeigt, ob auch die KI-Stimme verfügbar ist.

Achtung, nicht verwirren lassen:
- **Nichts upgraden.** AI Studio wirbt teils mit „Upgrade“ oder „Continue to upgrade“ – das braucht die App nicht.
- **Keinen Agenten verknüpfen.** Seiten wie „Link an API key to unlock … Agent“ ignorieren.
- Wer im Menü landet: links oben **☰** → **„Get API key“** bzw. **„API keys“**.

Gut zu wissen:
- Die kostenlose Stufe hat ein **Tageslimit**. Ist es aufgebraucht, nimmt die App ein sparsameres Modell
  bzw. bei der Stimme die Gerätestimme; am nächsten Tag geht es wieder.
- Google darf Eingaben aus der kostenlosen Stufe zur Verbesserung nutzen: **nichts Privates** eingeben
  (z. B. keine echten Patientendaten).
- Den Schlüssel **wie ein Passwort** behandeln und nicht weitergeben. Am besten im Passwort-Manager ablegen.
- Jede Person nimmt ihren **eigenen** Schlüssel, sonst teilt man sich das Tageslimit.

## GitHub-Token holen (für den Abgleich)

Nur nötig, wenn der Lernstand zwischen **mehreren eigenen Geräten** (z. B. Handy und PC) abgeglichen werden soll.

1. Im Browser **github.com/settings/tokens** öffnen und anmelden.
   (Ohne Konto: auf github.com kostenlos registrieren.)
2. **Generate new token** → **Generate new token (classic)**.
3. **Note:** z. B. `Vokabelkoje`.
4. **Expiration:** **No expiration** (sonst hört der Abgleich irgendwann auf).
5. Bei den Häkchen **nur „gist“** anhaken – sonst nichts.
6. Ganz unten **Generate token** → den Token (beginnt mit `ghp_…`) sofort **kopieren**.
   GitHub zeigt ihn nur dieses eine Mal an.
7. In der Vokabelkoje: **Profil → Einstellungen und Sicherung → Abgleich mit GitHub** → einfügen → speichern.
8. Weitere eigene Geräte am einfachsten mit **„Neues Gerät verbinden“** einrichten (siehe unten) – dann muss nichts abgetippt werden.

Die Daten liegen dann in einem **privaten Gist** im eigenen GitHub-Konto. Schlüssel und Token selbst werden dort nicht gespeichert.
Den Token wie ein Passwort behandeln.

## Weitere eigene Geräte verbinden (ohne Abtippen)

Auf dem Gerät, das schon eingerichtet ist: **Profil → Einstellungen und Sicherung → „Neues Gerät verbinden“**.
1. Auf dem neuen Gerät den **QR-Code scannen** (oder den Link an dich selbst schicken und dort öffnen).
2. Den **6-stelligen Code** eingeben, der auf dem ersten Gerät steht.
3. Fertig: Gemini-Schlüssel, GitHub-Token, Stimmen- und Farbeinstellungen sind übernommen, der Lernstand wird geholt.
4. Danach erscheint auf der Startseite **„Auf den Startbildschirm“** (Chrome) bzw. eine kurze Anleitung (Samsung Internet).

**Welcher Browser?** Am besten den QR-Code mit der Kamera scannen, dann öffnet sich der Standard-Browser.
Geht der Link in WhatsApp, Gmail oder Instagram auf, zeigt die Vokabelkoje **„In Chrome öffnen“** bzw.
**„In Samsung Internet öffnen“**. Bitte dort verbinden, nicht im App-Browser – sonst bleiben die Schlüssel in der fremden App.
Den Standard-Browser stellst du am Handy unter *Einstellungen → Apps → Standard-Apps → Browser-App* ein.

Der Link ist mit dem Code verschlüsselt und gilt 30 Minuten. Link und Code nie zusammen weitergeben.
Nur für die **eigenen** Geräte – Familienmitglieder richten ihre eigenen Schlüssel ein.

## Für die Familie

Den Link **https://feuerfuchs89.github.io/Vokabelkoje/** einfach weiterschicken. Jede Person bekommt dieselbe App mit allen
Funktionen und allen Updates, fängt aber **frisch an**: Die Daten liegen nur auf ihrem Gerät.

Jede Person richtet einmal ein:
1. **App installieren** (siehe oben).
2. **Eigenen Gemini-Schlüssel** mit dem eigenen Google-Konto (siehe oben). Nicht den Schlüssel einer anderen Person
   nehmen – sonst teilt man sich das Tageslimit.
3. **Abgleich nur mit eigenem GitHub-Konto und eigenem Token.**
   ⚠️ **Nie den Token einer anderen Person eintragen!** Beide Apps starten mit demselben ersten Profil,
   die Lernstände würden sich vermischen.
   Wer nur auf einem Gerät lernt, braucht gar keinen Token – dann ab und zu **Sicherung speichern**.

**Kinder:** Auf dem Gerät, auf dem sie spielen, oben rechts aufs Profilbild → **Neues Profil** → Haken bei **Kindermodus**.
Kinderprofile brauchen keinen Schlüssel und keine KI.

**Mehrere Personen auf einem Gerät:** Pro Person ein eigenes Profil anlegen (oben rechts aufs Profilbild).
Jedes Profil hat eigene Sprachen, Lernpfade, Möwe und Fortschritt.

## Auf GitHub Pages bringen

1. Auf GitHub ein neues Repository anlegen, z. B. `Vokabelkoje` (öffentlich).
2. **Add file → Upload files** und **alle Dateien** aus diesem Ordner hochladen (keine Unterordner, geht auch am Handy
   per Mehrfachauswahl). Nicht die Zip-Datei selbst hochladen, GitHub entpackt sie nicht.
3. **Settings → Pages**: Source „Deploy from a branch“, Branch `main`, Ordner `/ (root)`, speichern.
4. Nach ein bis zwei Minuten läuft die App unter `https://<dein-name>.github.io/Vokabelkoje/`.
5. Am Handy die Seite öffnen und „Zum Startbildschirm hinzufügen“ wählen.

## Erster Start und Aufbau

- **Geführter Start in 3 Schritten:** Möwe taufen, Sprache und Ziel wählen, erste Etappe oder eigenes Set.
- **Leiste unten:** *Heute* (Wache, fällige Wörter, nächste Etappe), *Seekarte* (Törn, Logbuch, Trophäen),
  *Sets* (eigene Kartensätze, KI-Werkzeuge), *Profil* (Lernkurve, Einstellungen, Sicherung).

## Hell und dunkel

Oben neben dem Profil schaltet Sonne/Mond zwischen hellem und dunklem Modus um. Unter „Einstellungen → Aussehen“
gibt es zusätzlich „Automatisch“: Dann folgt die App der Einstellung des Geräts.

## Online oder offline lernen

Das Netz-Symbol oben zeigt, wie du gerade lernst. Ohne Internet schaltet die App selbst auf offline. Antippen schaltet bewusst auf
„Offline lernen“, z. B. auf dem Boot ohne Datenvolumen.

- **Online:** KI-Funktionen, GitHub-Abgleich und Gemini-Stimme.
- **Offline:** Lernen, Wiederholen, Wachen und Kinderspiel mit der Gerätestimme und schon gespeicherten Gemini-Wörtern. Die KI pausiert
  mit einem klaren Hinweis, der Abgleich holt alles nach, sobald du wieder online bist.

## Neue Version

Lädst du eine neue Version hoch (Cache-Nummer in `sw.js` hochzählen), erscheint in der laufenden App oben
„Neue Version der Vokabelkoje ist da“ mit „Jetzt neu laden“.

## Daten sicher halten

Die Lerndaten liegen im Browser des Geräts. Damit nichts verloren geht:

- **iPhone/iPad:** Unbedingt zum Home-Bildschirm hinzufügen. Safari löscht Daten von Webseiten, die 7 Tage
  nicht geöffnet wurden; als installierte App passiert das nicht. Die App erinnert daran.
- **Sicherung:** Nach 14 Tagen ohne Sicherung oder Abgleich erinnert die App. Die Sicherungsdatei enthält alle Profile.
- Wo möglich bittet die App den Browser um dauerhaften Speicher.

## Kindermodus (ohne Lesen)

Im Profil den Haken „Kindermodus“ setzen. Das Kind sieht dann nur große Bilder: Die App sagt „Wo ist …?“
und spricht das Wort in der Lernsprache, das Kind tippt auf das passende Bild. Themen: Tiere, Essen, Farben,
Draußen. Alle 24 Sterne öffnet sich ein neues Thema, ein gewonnenes Spiel zählt als Wache.
Sprachen: Englisch, Spanisch, Französisch, Italienisch, Schwedisch, Niederländisch, Dänisch, Norwegisch,
Portugiesisch, Kroatisch, Polnisch.

## So lernt die App mit dir

- **Lernen:** Neue Wörter erst ankreuzen, dann schreiben. Wer beides richtig hat, kommt in Fach 1.
- **Wiederholen:** Fach 1 kommt nach 1 Tag wieder, dann 3, 7, 14, 30, 60 und 120 Tage.
  Ein Fehler schickt das Wort zurück in Fach 1. Auf der Startseite steht, was heute fällig ist.
- **Freihändig:** Die App liest vor, du antwortest laut. „Weiß nicht“ sagen geht auch.
- **Tagesziel und Serie:** Zählt jede Antwort. Das Ziel stellst du unter „Einstellungen“ ein.

## Profile und Sprachen

- **Lernprofile:** Oben rechts auf der Startseite. Jedes Profil hat eigene Sprachen, Lernpfade, Möwe, Serie und Fortschritt.
  Pro Profil lassen sich die KI-Funktionen ausschalten (z. B. für Kinder). Karteikarten, Wachen und eigene Sets gehen immer.
  Als Profilbild gibt es 14 Wikinger-Vorschläge (Erwachsene und Kinder, darunter Ylva Wellenreiterin mit Schild
  und Bjarki Möwenfreund mit Ruder) oder eine gewürfelte Figur.
- **Heute lerne ich:** Die Sprachwahl unter dem Titel. Wache, fällige Wörter, Sets, Lernpfade und Lernkurve zeigen nur diese Sprache.
- **Abgleich:** Jedes Profil hat eine eigene Datei im Gist (`vokabelkoje.json` für das erste, `vokabelkoje-<id>.json` für weitere),
  die Profilliste liegt in `vokabelkoje-profile.json`.

## Motivation an Bord

- **Deine Möwe:** Beim ersten Start taufst du sie. Sie begrüßt dich, sagt dir, was ansteht, und freut sich mit dir.
  Zwischendurch pfeift sie, späht durchs Fernrohr, salutiert, ficht mit dem Holzschwert gegen eine Krabbe,
  wirft den Anker, knüpft Knoten, angelt, denkt laut nach oder schläft nachts mit Zipfelmütze. Antippen bringt sie sofort in Aktion.
  Name ändern unter „Einstellungen“.
- **Eine Wache (ca. 5 Minuten):** Jede Wache ist ein Kampf gegen ein Seeungeheuer aus der nordischen Sagenwelt (Hrönn, Nykur, Margygr, Lyngbakr,
  Sjódraugr, Kraken, Hafgufa, Jörmungandr). Jede richtige Antwort ist ein Treffer. Besiegte Ungeheuer landen in der Trophäensammlung.
- **Serie mit Flautetagen:** Ein Tag zählt, wenn du eine Wache hältst oder dein Tagesziel erreichst.
  Bis zu zwei ausgefallene Tage pro Woche überbrückt die App als Flautetage.
- **Seekarte:** Dein Lernpfad als Törn. Häfen sind Etappen, Leuchttürme die Stufentests, das Wikingerschiff zeigt, wo du bist.
- **Logbuch:** Alle Kann-Sätze geschaffter Etappen mit Datum und ein Rückblick auf die letzten 30 Tage.
- **Tägliche Erinnerung:** Unter „Einstellungen“ eine Uhrzeit wählen. Die App erzeugt einen täglichen Kalendertermin (.ics).

## Schnellstart für neue Sprachen

Wählst du eine Sprache, in der es noch nichts gibt, bieten *Sets* und *Seekarte* einen Schnellstart an:
- **15 Grundlagen mit KI erzeugen:** die nützlichsten Wörter und Sätze für die ersten Tage, mit Beispielsätzen.
- **Startpaket ohne KI:** 15 feste Grundlagen (Hallo, Danke, Wo ist die Toilette? …), auch offline. Für Englisch, Spanisch,
  Französisch, Italienisch, Schwedisch, Niederländisch, Dänisch, Norwegisch, Portugiesisch, Polnisch und Kroatisch.

## Lernpfade: von null an bis C2

Ohne eigenes Material: Unter „Lernpfade“ nennst du Sprache, Ziel (z. B. „Segeltörn in Kroatien“),
deinen Stand und das Ziel-Niveau (Standard: C2, jederzeit änderbar).

- **Ordner je Niveau:** A1, A2, B1 … mit 2 bis 4 Kapiteln und 10 bis 16 Etappen.
- **Etappe:** genau ein Grammatikthema und 10 bis 12 Wörter, in fünf Schritten: Lektion,
  Wörter lernen, Grammatik üben, im Gespräch anwenden, Abschluss-Check (ab 80 % geht es weiter).
- **Gespräch in der Etappe:** 6 Nachrichten von dir, dann verabschiedet sich die KI in ihrer Rolle und es geht zur Auswertung.
  Freie Gespräche aus einem Set enden nach 10 Nachrichten; mit „Weiter sprechen“ gibt es 4 weitere.
- **Stufentest:** Am Ende jedes Ordners. Ab 75 % ist das Niveau geschafft, das Ergebnis
  fließt in die Lernkurve ein.
- **Wächst mit:** Wenn im aktuellen Ordner nur noch drei Etappen offen sind, plant die KI
  automatisch den nächsten Ordner, mit deinem Fortschritt und deinen Schwachstellen.

## Werkzeugkiste und weitere Übungen

- **Übersetzen & anhören** (Bereich *Sets*): jetzt auch mit **„Was ist das?“**: Foto machen, die Möwe benennt bis zu 3 Dinge darauf
  in der Lernsprache, mit Beispielsatz, Lautsprecher und „+ ins Set“.
- **Seemannsgarn** (Bereich *Sets*): Die Möwe erzählt eine kurze Geschichte aus deinen gelernten Wörtern. Wörter antippen zum
  Nachschlagen, „Ganzen Text vorlesen“ zum Mithören, „Neues Garn spinnen“ für die nächste Geschichte. Offline bleibt die letzte erhalten.
- **Hördiktat** (in jedem Set): Die App liest einen Satz oder ein Wort vor, du schreibst auf, was du hörst. Getroffene Wörter grün,
  verpasste rot. Geht auch offline mit der Gerätestimme.
- **Aussprache** (in jedem Set, Chrome/Edge/Safari mit Spracherkennung): laut sprechen, die App zeigt, welche Wörter sie verstanden hat.

## Schnack mit der Möwe

In der Sprechblase der Möwe auf *Heute* steht „Schnacken?“. Die Möwe plaudert dann locker in der Lernsprache (5 Nachrichten):
- Fehler flüstert sie sofort zu („Psst: *jag var* statt *jag är*“), statt sie erst am Ende auszuwerten.
- „Was heißt …?“ oder „Wie sage ich …?“ beantwortet sie mit einer Übersetzungskarte samt Lautsprecher und „+ ins Set“.
- Was du über dich erzählst (Boot, Hobby, Familie), merkt sie sich pro Profil und fragt später nach. Heikles merkt sie sich nicht.
- Mit Gemini-Schlüssel spricht die Möwe mit eigener Gemini-Stimme (einstellbar unter *Ton und Stimmen*, dort auch „Gemini-Stimme testen“).
  Oben im Schnack lässt sie sich stummschalten. Ist das Stimmen-Kontingent aufgebraucht, spricht sie mit der Gerätestimme.
- Die heutige Übung baut sie nebenbei ein. Jede Nachricht zählt fürs Tagesziel. Nur online, nicht im Kindermodus.
- Ihre Korrekturen zählen mit: Taucht dasselbe Fehlermuster zum zweiten Mal auf, wird es eine Baustelle (und kann Tagesübung werden).
- Nach einer vollen Runde schätzt sie dein Niveau; das fließt leicht in die Lernkurve ein (so viel wie ein Etappen-Check).

## Freies Gespräch

Auf *Heute* startet „Freies Gespräch“ ein Rollenspiel in der Lernsprache: Smalltalk am Steg, Boot mieten, Restaurant, Weg fragen,
Markt, Arzt oder eine eigene Situation. Die KI nutzt Wörter aus allen Sets der Sprache und deine Baustellen. Nach 10 Nachrichten
gibt es die Auswertung; neue Wörter landen im Set „Gesammelte Wörter“. Aus jedem Set heraus geht es weiterhin über „Gespräch üben“.

## Lernkurve und gezieltes Training

- **Einstufungstest:** 20 Fragen von A1 bis C1, getrennt nach Grammatik und Wortschatz.
- **Lernkurve:** Auf der Startseite zeigt eine Welle dein Niveau je Sprache über die Zeit, mit den Stufen A1 bis C2.
  Jeder Einstufungstest und jede Gesprächsauswertung (ab drei eigenen Nachrichten) ist ein Messpunkt.
- **Deine heutige Übung:** Auf *Heute* steht jeden Tag ein Schwerpunkt aus deinen Baustellen (kurze Regel und 8 Aufgaben).
  Danach kannst du am Schwerpunkt weiterlernen, zur nächsten Baustelle wechseln oder für heute aufhören. Am nächsten Tag kommt
  bevorzugt ein Thema dran, das länger nicht geübt wurde.
- **Lernkurve ohne ständige Tests:** Der Einstufungstest ist nur für den Start. Danach wächst die Kurve von selbst mit:
  Gesprächsauswertungen, Stufentests, bestandene Etappen-Checks und volle Schnack-Runden mit der Möwe (die beiden letzten zählen schwächer).
- **Baustellen:** Die KI erkennt wiederkehrende Fehlermuster und sammelt sie. Mit „Üben“ bekommst du
  eine kurze Regel und 8 Aufgaben. Nach zwei guten Runden gilt das Thema als gefestigt.
- Gespräche und Übungstexte bauen deine Baustellen gezielt ein, und das Niveau wird automatisch übernommen.

## KI-Funktionen mit Gemini

Unsaubere KI-Antworten (Text um das JSON, Code-Blöcke, Zeilenumbrüche, überzählige Kommas) repariert die App selbst.
Klappt das nicht, fragt sie die KI genau einmal nach. Übungen, Abschluss-Checks und Einstufungstests werden gespeichert:
Online gibt es immer frische Aufgaben, offline oder beim Tageslimit springt die zuletzt erzeugte Fassung ein.

Karten erzeugen (aus Text, Thema oder Foto), Beispielsätze ergänzen, Text lesen mit Wort-Nachschlagen
und Gespräch üben laufen über Google Gemini. Einrichtung unter **Einstellungen → KI (Gemini) einrichten**:

Schritt für Schritt siehe [Gemini-Schlüssel holen](#gemini-schlüssel-holen-für-die-ki). Auf jedem Gerät einmal eintragen.

Ist ein Modell ausgeschöpft oder nicht (mehr) verfügbar, nimmt die App automatisch das nächste. Neue Modellnamen schlägt sie
einmal pro Woche direkt bei Google nach. Notfalls lässt sich in den Einstellungen ein eigener Modellname eintragen.

## Abgleich zwischen Handy und PC

Unter „Einstellungen“ einmal pro Gerät denselben GitHub-Token eintragen, Schritt für Schritt siehe
[GitHub-Token holen](#github-token-holen-für-den-abgleich). Die Daten liegen dann in einem geheimen Gist in deinem Konto.
Familienmitglieder nehmen ein eigenes Konto und einen eigenen Token (siehe [Für die Familie](#für-die-familie)).

Beim Abgleich zählen Antworten pro Gerät: 15 am Handy und 10 am PC ergeben 25 für Tagesziel und Serie.
Bei Lernpfaden bleibt erhalten, was auf irgendeinem Gerät geschafft wurde. Während du tippst, wartet der Abgleich mit dem Neuzeichnen.

Ohne Abgleich: Mit „Sicherung speichern“ eine Datei anlegen und auf dem anderen Gerät „Sicherung laden“.

## Ton und Anhören

- Überall gibt es Lautsprecher-Knöpfe: einmal tippen zum Anhören, zweimal kurz hintereinander für langsam.
- „Automatisch vorlesen“ ist von Anfang an an und lässt sich in jeder Übung ausschalten.
- **Übersetzen & anhören** (Bereich *Sets*): Wort oder Satz auf Deutsch oder in der Lernsprache eintippen, übersetzen lassen
  (mit Hinweis und üblicher Redewendung), anhören, auch langsam, und mit „+ ins Set“ in „Gesammelte Wörter“ legen.
- **Ton und Stimmen** (Bereich *Profil*): Ton testen, Anzeige, ob eine Stimme für die Sprache da ist, Tempo und Stimmwahl.
- **Gemini-Stimme:** Mit Gemini-Schlüssel springt eine Gemini-Stimme ein, wenn das Gerät keine Stimme hat oder hängt.
  Man kann sie auch fest wählen (natürlicher, braucht Internet, zählt zum Tageslimit).
- **Gemini-Stimmen bleiben gespeichert:** Jedes einmal vorgelesene Wort liegt danach im Browser, spart Tageslimit und klingt auch offline.
  Unter „Ton und Stimmen“ lassen sich alle Wörter der aktiven Sprache vorab laden (höchstens 150) oder die gespeicherten löschen.
- Im Kinderspiel steht das Wort groß unter dem Bild, wenn das Gerät nichts vorlesen kann – dann liest ein Erwachsener vor.
- Kein Ton? Lautstärke, Stummschalter (iPhone) und Bluetooth prüfen. In der Claude-Handy-App gibt es teils keine Stimme,
  dann die App im Browser öffnen.

## Spracheingabe

Läuft in Chrome (Android und PC), Edge und Safari (iPhone/iPad ab iOS 14.5). Firefox kann es nicht.
Beim ersten Mal fragt der Browser nach dem Mikrofon. Die Erkennung braucht Internet.

## Aufbau des Codes

- `index.html` – Gerüst, `style.css` – Aussehen
- `01-grundlagen.js` … `13-aktionen.js` – die App in Themen aufgeteilt (Daten, Oberfläche, KI, Figuren,
  Profile, Startseite, Lernen, KI-Werkzeuge, Niveau, Lernpfad, Übungen, Sicherung, Aktionen).
  Die Dateien werden der Reihe nach geladen und teilen sich die globalen Namen.

## Updates

Nach Änderungen an der App in `sw.js` die Zeile `const CACHE = 'vokabelkoje-v…';` hochzählen
und neue Dateien in die Liste `CORE` eintragen, damit Handys die neue Version laden.
