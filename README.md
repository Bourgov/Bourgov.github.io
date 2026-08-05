# bourgov.github.io

Portfolio site — Khalil Bourgou, Financial Analyst.

## Deploy

1. Push these files to the `Bourgov.github.io` repository (root, replacing the old site):
   - `index.html`
   - `styles.css`
   - `script.js`
   - `assets/` folder (see below)
2. GitHub Pages serves the root automatically. Live within ~1 minute of push.

## Assets folder — you must add these files

The site links to two downloads that are NOT in this package:

- `assets/KhalilBourgou_CV.pdf` — export your CV docx to PDF and drop it here
- `assets/Saipem_Subsea7_Historicals.xlsx` — the historicals workbook

Without them the two download buttons will 404.

## Live market ticker

The ticker uses a static snapshot by default. To make it live:

1. Get a free API key: https://site.financialmodelingprep.com/developer (250 requests/day)
2. Open `script.js` and paste it into `FMP_API_KEY = ""`
3. Note: any key in client-side JS is publicly visible. This is acceptable for a
   free-tier portfolio key; if abused, regenerate the key.

If the API fails or the key is empty, the ticker automatically falls back to the
static snapshot. Update `STATIC_QUOTES` and `STATIC_SNAPSHOT_DATE` in `script.js`
every few weeks so the fallback never looks stale.

## Updating the "in progress" downloads

When the DCF model and merger PDF are ready:

1. Drop the files into `assets/`
2. In `index.html`, change the matching `<div class="dl pending">` to
   `<a class="dl available" href="assets/FILENAME" download>` and change the
   status text from `in progress` to `&darr; download`.

## Editing copy

All text lives in `index.html`. The headline sentence, thesis paragraphs, and
panel copy are plain HTML — edit freely. Colors and spacing are CSS variables
at the top of `styles.css`.
