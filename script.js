/* ═══════════════════════════════════════════════════════════
   Khalil Bourgou — portfolio scripts
   1. Live ticker (Financial Modeling Prep) with static fallback
   2. Revenue sparklines from extracted annual-report data
   3. Footer year
   ═══════════════════════════════════════════════════════════ */

/* ── CONFIG ──
   Get a free API key at https://site.financialmodelingprep.com/developer
   and paste it below. Leave empty ("") to use the static snapshot.   */
const FMP_API_KEY = "";

/* Static fallback — update these numbers and the date when you deploy */
const STATIC_SNAPSHOT_DATE = "31 Jul 2026";
const STATIC_QUOTES = [
  { sym: "BRENT",   px: "$72.92",     chg: +0.6 },
  { sym: "EUR/USD", px: "1.1830",     chg: -0.1 },
  { sym: "SPM.MI",  px: "\u20AC2.84", chg: +1.2 },
  { sym: "SUBC.OL", px: "NOK 168.2",  chg: +0.5 },
  { sym: "TEN.MI",  px: "\u20AC18.44",chg: +0.3 },
  { sym: "ENI.MI",  px: "\u20AC14.72",chg: -0.4 },
];

/* FMP symbols to request when a key is present */
const FMP_SYMBOLS = [
  { fmp: "BZUSD",   label: "BRENT",   prefix: "$"       },
  { fmp: "EURUSD",  label: "EUR/USD", prefix: ""        },
  { fmp: "SPM.MI",  label: "SPM.MI",  prefix: "\u20AC"  },
  { fmp: "SUBC.OL", label: "SUBC.OL", prefix: "NOK "    },
  { fmp: "TEN.MI",  label: "TEN.MI",  prefix: "\u20AC"  },
  { fmp: "ENI.MI",  label: "ENI.MI",  prefix: "\u20AC"  },
];

/* ── Ticker rendering ── */

function renderTicker(quotes, live) {
  const el = document.getElementById("ticker");
  const note = document.getElementById("data-note");

  const items = quotes.map(q => {
    const cls = q.chg >= 0 ? "chg-pos" : "chg-neg";
    const sign = q.chg >= 0 ? "+" : "";
    return `<span class="tick"><span class="sym">${q.sym}</span> ` +
           `<span class="px">${q.px}</span> ` +
           `<span class="${cls}">${sign}${q.chg.toFixed(1)}%</span></span>`;
  });

  /* render twice so the -50% translate loop is seamless */
  const half = items.join("");
  el.innerHTML = half + half;

  if (note) {
    note.textContent = live
      ? "Market data: Financial Modeling Prep, delayed"
      : `Market data: snapshot as of ${STATIC_SNAPSHOT_DATE}`;
  }
}

async function loadLiveQuotes() {
  const symbols = FMP_SYMBOLS.map(s => s.fmp).join(",");
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FMP_API_KEY}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`FMP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error("FMP empty");

  return FMP_SYMBOLS.map(cfg => {
    const q = data.find(d => d.symbol === cfg.fmp);
    if (!q) return null;
    const px = cfg.fmp === "EURUSD"
      ? q.price.toFixed(4)
      : cfg.prefix + q.price.toFixed(2);
    return { sym: cfg.label, px, chg: q.changesPercentage ?? 0 };
  }).filter(Boolean);
}

(async function initTicker() {
  if (FMP_API_KEY) {
    try {
      const quotes = await loadLiveQuotes();
      renderTicker(quotes, true);
      return;
    } catch (e) {
      /* fall through to static snapshot */
      console.warn("Live quotes unavailable, using snapshot:", e.message);
    }
  }
  renderTicker(STATIC_QUOTES, false);
})();

/* ── Sparklines ──
   Revenue data extracted from annual reports (see historicals workbook). */

const SAIPEM_REVENUE  = [7354, 6533, 9989, 11897, 14552, 15502];  /* €m  */
const SUBSEA7_REVENUE = [3466, 5010, 5136, 5974, 6837, 7086];     /* $m  */

function drawSpark(elementId, series) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const W = 260, H = 64, PAD = 4;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;

  const pts = series.map((v, i) => {
    const x = PAD + (i / (series.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  el.setAttribute("points", pts.join(" "));
}

drawSpark("spark-saipem",  SAIPEM_REVENUE);
drawSpark("spark-subsea7", SUBSEA7_REVENUE);

/* ── Footer year ── */
document.getElementById("year").textContent = new Date().getFullYear();
