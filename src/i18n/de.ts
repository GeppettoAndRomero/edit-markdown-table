import type { ToolContent } from './types';

// Deutsch. Keine Wort-für-Wort-Übersetzung, sondern Transkreation auf Basis der
// Begriffe und Wendungen, die deutsche Markdown-Editoren tatsächlich verwenden.
// Keine Werbefloskeln (einfach / schnell / kinderleicht / perfekt) — Datenschutz
// wird strukturell erklärt, nicht als Versprechen (BRAND-OPERATING-MODEL).

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Markdown-Tabelle bearbeiten — GFM-Tabelleneditor, kein Upload | runlocally',
    description:
      'Bearbeite eine Markdown-Tabelle in einem Raster oder füge eine bestehende GFM-Tabelle ein, um sie zu importieren. Zeilen/Spalten hinzufügen und entfernen, Spaltenausrichtung festlegen — und jedes Mal eine sauber ausgerichtete Tabelle zurückbekommen. Läuft im Browser, nichts wird hochgeladen.',
    ogTitle: 'Markdown-Tabelle bearbeiten — GFM-Tabelleneditor, kein Upload',
    ogDescription:
      'Bearbeite eine GFM-Markdown-Tabelle in einem Raster und erhalte korrekt ausgerichtetes Markdown zurück. Bestehende Tabellen per Einfügen importieren. Nichts wird hochgeladen.',
  },

  hero: {
    h1: 'Markdown-Tabelle bearbeiten',
    tagline:
      'Bearbeite eine Tabelle in einem Raster, die Pipes im Markdown bleiben automatisch ausgerichtet — im Browser. Füge eine bestehende Tabelle ein, um damit zu starten.',
  },

  intro: {
    h2: 'GFM-Markdown-Tabellen bearbeiten, ohne Pipes von Hand auszurichten',
    paras: [
      'GitHub-Flavored-Markdown-Tabellen sind reiner Text, und jedes `|` von Hand auszurichten wird mühsam, sobald eine Zelle länger wird oder eine Zeile dazukommt. Dieses Tool bietet stattdessen ein Raster: Zelle anklicken und tippen, Zeilen und Spalten per Knopf hinzufügen oder entfernen, jede Spalte auf links, zentriert oder rechts ausrichten.',
      'Das Markdown darunter wird bei jeder Änderung neu aus dem Raster erzeugt und kommt daher immer als sauber spaltenbreiten-ausgerichtete Tabelle heraus — die Pipes bearbeitest du nie von Hand. Starte mit einem leeren Raster, oder füge eine bestehende Markdown-Tabelle in das Importfeld ein, um sie zu laden und weiter zu bearbeiten.',
    ],
  },

  privacy: {
    h2: 'Warum deine Tabelle auf deinem Gerät bleibt',
    lead: 'Datenschutz ist hier strukturell, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, an den hochgeladen werden könnte:',
    points: [
      'Parsen, Bearbeiten und Neuerzeugen der Tabelle laufen vollständig im Browser.',
      'Die Seite wird als statische Dateien ausgeliefert und stellt keine Anfrage mit deinen Tabellendaten.',
      'Der Quellcode ist offen und für jeden einsehbar (MIT).',
      'Es funktioniert offline — nur möglich, weil nichts das Gerät verlässt.',
    ],
    note: 'Wenn du es selbst prüfen willst: Öffne das Netzwerk-Panel deines Browsers während der Bearbeitung — keine Anfrage trägt den Inhalt deiner Tabelle.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'Mit einem leeren Raster starten oder importieren',
        p: 'Ein leeres 3-Spalten-Raster ist sofort tippbereit. Um stattdessen mit einer bestehenden Tabelle zu starten, füge GFM-Markdown in das Importfeld ein und klicke auf Importieren — das ersetzt das Raster mit der eingelesenen Tabelle.',
      },
      {
        h3: 'Zellen bearbeiten',
        p: 'Zelle anklicken und tippen. Tab, Enter und die Pfeiltasten bewegen zwischen Zellen, wie in einer Tabellenkalkulation.',
      },
      {
        h3: 'Spalten hinzufügen, entfernen und ausrichten',
        p: 'Nutze die Zeilen- und Spaltenknöpfe zum Hinzufügen oder Entfernen. Jede Spaltenüberschrift hat eine Steuerung für links/zentriert/rechts, die auf die Markdown-Trennzeile abgebildet wird.',
      },
      {
        h3: 'Markdown kopieren oder herunterladen',
        p: 'Die Markdown-Vorschau unter dem Raster ist immer eine saubere, pipe-ausgerichtete Tabelle. In die Zwischenablage kopieren oder als .md-Datei herunterladen.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Wird meine Tabelle irgendwohin hochgeladen?',
      a: 'Nein. Parsen, Bearbeiten und Neuerzeugen laufen vollständig im Browser. Es gibt keine Serverkomponente, also hat deine Tabelle keinen Weg, dein Gerät zu verlassen. Der Quellcode ist offen und im Netzwerk-Panel deines Browsers überprüfbar.',
    },
    {
      q: 'Wie wird ein `|`-Zeichen in einer Zelle behandelt?',
      a: 'Ein literales `|`, das du in eine Zelle tippst, wird beim Erzeugen des Markdowns automatisch als `\\|` escaped und beim Importieren einer Tabelle wieder zu `|` zurückverwandelt — es wird also in beiden Richtungen korrekt im Raster angezeigt.',
    },
    {
      q: 'Was passiert, wenn ich eine Tabelle mit einer unregelmäßigen Zeile (falsche Zellenzahl) einfüge?',
      a: 'Genau wie GitHub selbst es handhabt: Eine Zeile mit weniger Zellen als die Kopfzeile wird mit leeren Zellen aufgefüllt, bei einer Zeile mit mehr Zellen werden die überzähligen verworfen. Nichts stürzt ab oder wird still beschädigt.',
    },
    {
      q: 'Kann eine Zelle einen Zeilenumbruch enthalten?',
      a: 'Nein — GFM-Tabellenzellen sind laut Spezifikation einzeilig. Fügst du Text mit Zeilenumbruch in eine Zelle ein, wird er durch ein Leerzeichen ersetzt, statt die Tabellenstruktur still zu zerstören.',
    },
    {
      q: 'Rendert oder zeigt dieses Tool auch anderes Markdown, wie Überschriften oder Links?',
      a: 'Nein, es ist bewusst auf die Tabellenbearbeitung beschränkt. Für die Vorschau eines vollständigen Markdown-Dokuments gibt es ein separates, dediziertes Viewer-Tool.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Es ist eine PWA. Nach dem ersten Besuch wird sie zwischengespeichert, sodass die Bearbeitung ohne Netzwerkverbindung funktioniert. Du kannst sie auch auf deinem Startbildschirm installieren.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Entwickelt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Review und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },
};
