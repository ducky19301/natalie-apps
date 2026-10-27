# Tarot Deck · Interactive Rider–Waite–Smith

A beautiful, mobile-friendly single-page tarot app: shuffle, draw, flip cards, and sit with warm modern meanings. Full 78-card deck with classic public-domain artwork.

## Open it

From this folder:

```bash
cd /workspace/tarot-deck
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

You can also open `index.html` directly (`file://`), though a local server is more reliable for image loading in some browsers.

## Features

- **Full 78-card deck** — 22 Major Arcana + 56 Minor Arcana (Wands, Cups, Swords, Pentacles)
- **Shuffle** with a short card-pile animation
- **One-card draw** (practice / daily) — large centered card
- **3-card spread** — Present / Block / Invitation
- **3D CSS flip** from ornate back to face
- **Upright & reversed** (~35% reversed) with distinct meanings
- **Warm modern interpretations** + a reflective “sit with this” question for every card
- **Daily memory** — today’s single-card draw is saved in `localStorage` for the calendar day; **Draw again** confirms before clearing
- **Graceful image fallback** — if an image fails, the card shows name + suit symbol
- **Phone-friendly** mystical UI — deep indigo / black, soft gold accents

## Files

| File | Role |
|------|------|
| `index.html` | App shell |
| `styles.css` | Layout & aesthetic |
| `app.js` | Deck data, meanings, interactions |
| `img/` | Local copies of public-domain RWS card images |
| `README.md` | This file |

## Image source

Card faces are **public-domain Rider–Waite–Smith** scans, downloaded from [sacred-texts.com](https://www.sacred-texts.com/tarot/pkt/img/) (Pamela Colman Smith artwork, 1909). Filenames follow sacred-texts conventions (`ar00.jpg` … `ar21.jpg`, `waac.jpg` / `wa02`–`wa10` / courts, and the same pattern for `cu`, `sw`, `pe`).

Images are stored **locally** under `img/` so the app works offline and does not depend on hotlinking.

## Note

For reflection and creativity — not prediction or medical/financial advice.
