# Suarez Dienstleistungen – Bewertungsintegration

## Grundsatz
Nur echte Bewertungen von Kunden nach einem tatsächlich ausgeführten Auftrag werden veröffentlicht. Der Originaltext wird nicht umgeschrieben.

## Ablauf
1. Nach Leistung bzw. Zahlungsbestätigung erhält der Kunde persönlich eine Bewertungsanfrage.
2. Der Link führt zu `/review/?token=<einmaliger-token>`.
3. Die Formularantwort geht aktuell über Formspree ein und kann danach in CEO Office übernommen werden.
4. CEO Office verwaltet intern: neu / freigegeben / verborgen.
5. Nur nach ausdrücklicher Veröffentlichungsfreigabe werden öffentliche Felder nach `reviews.json` exportiert.
6. Die Startseite liest `reviews.json` und zeigt ausschließlich Einträge mit `status: "published"`.

## Öffentliches Datenformat
```json
{
  "schema_version": 1,
  "updated_at": "2026-08-07T17:00:00+02:00",
  "reviews": [
    {
      "id": "public-review-id",
      "status": "published",
      "rating": 5,
      "text": "Originaltext des Kunden",
      "display_name": "Freigegebener Anzeigename",
      "city": "Freigegebener Ort",
      "service": "Grundreinigung",
      "date": "August 2026"
    }
  ]
}
```

Wichtig: `reviews.json` ist öffentlich. Keine E-Mail-Adresse, Telefonnummer, interne Kundennummer, vollständige Anschrift, Token oder sonstige private Daten dort speichern.

## Nächster Schritt für CEO Office
CEO Office soll später die Originaleinsendung sicher speichern, die Einwilligungen getrennt erfassen und ausschließlich eine bereinigte öffentliche Version an die Website liefern. Die eigentliche sichere Backend-/Supabase-Verbindung wird erst mit der aktuellen CEO-Office-Version eingebaut.
