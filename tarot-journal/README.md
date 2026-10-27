# Natalie’s Daily Deck — Tarot Flip-Book Journal

A small sacred notebook for daily draws: flip through cards in the browser, or regenerate a polished PDF.

## Open the flip book

Serve the folder over HTTP (browsers block `fetch` of `entries.json` from `file://`):

```bash
cd /workspace/tarot-journal
python3 -m http.server 8765
```

Then open [http://localhost:8765/](http://localhost:8765/).

- **Prev / Next** buttons, keyboard **← →**, swipe on mobile, or click page edges  
- **Sidebar** (desktop) lists dates; hamburger on mobile  
- **PDF** link downloads `Natalie-Tarot-Journal.pdf`  
- Reversed cards appear rotated 180°

## Regenerate the PDF

```bash
cd /workspace/tarot-journal
.venv/bin/python build_pdf.py
```

Output: `Natalie-Tarot-Journal.pdf` (cream pages, gold rules, card images).

First-time setup (already done in this workspace):

```bash
python3 -m venv .venv
.venv/bin/pip install reportlab pillow
```

## Append a new day

1. Copy any new card image from `/workspace/tarot-deck/img/` into `img/` (only cards you use).
2. Add an object to `entries.json`:

```json
{
  "date": "2026-09-16",
  "cards": [
    {
      "name": "The Star",
      "orientation": "upright",
      "img": "img/ar17.jpg",
      "source": "physical deck",
      "summary": "…",
      "sitWith": "…",
      "astro": null
    }
  ],
  "notes": "optional day-level note"
}
```

3. Refresh the flip book. Run `build_pdf.py` again if you want the PDF updated.

If `astro` is a string, both the flip book and PDF show an **Astro · chart weave** section on that card’s page.

## Files

| Path | Role |
|------|------|
| `entries.json` | Source of truth for all days |
| `index.html` / `styles.css` / `app.js` | Interactive flip book |
| `build_pdf.py` | PDF generator |
| `Natalie-Tarot-Journal.pdf` | Printable journal |
| `img/` | Card images used in entries |
