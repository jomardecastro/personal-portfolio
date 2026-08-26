// Generates Claude Design preview cards from a shared token base.
// Round 2: portfolio-framed brief + A/B/C variants of the decisive cards.
// Run: node design-system/_build/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..');

// Token NAMES mirror src/index.css so an accepted design ports back by find/replace.
const BASE = `
:root{
  --bg:0 0% 100%;--fg:222 47% 11%;
  --card:0 0% 100%;--muted:210 40% 96%;--muted-fg:215 16% 47%;
  --border:214 22% 90%;
  --primary:199 89% 48%;--primary-fg:0 0% 100%;
  --success:160 84% 30%;--destructive:349 75% 45%;
  --radius:10px;
  --brand-a:96 52% 60%;--brand-b:196 100% 46%;
  --ink:222 47% 6%;            /* dark band background */
  --ink-fg:210 40% 96%;
  --sans:'Inter',system-ui,-apple-system,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;
  --shadow-card:0 1px 2px hsl(222 47% 11%/.05),0 4px 16px hsl(222 47% 11%/.06);
  --shadow-lift:0 8px 24px hsl(222 47% 11%/.10),0 32px 64px hsl(222 47% 11%/.14);
}
*{box-sizing:border-box;margin:0}
body{font-family:var(--sans);background:hsl(var(--muted));color:hsl(var(--fg));
  line-height:1.5;-webkit-font-smoothing:antialiased;font-size:15px}
.doc{max-width:1240px;margin:0 auto;padding:26px}
.head{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:hsl(var(--muted-fg));margin-bottom:14px}
.frame{background:hsl(var(--bg));border:1px solid hsl(var(--border));border-radius:16px;overflow:hidden}
.frame.dark{background:hsl(var(--ink));color:hsl(var(--ink-fg));border-color:hsl(217 30% 20%)}
.pad{padding:56px 56px}
h1,h2,h3,h4{font-weight:700;letter-spacing:-.03em}
p{margin:0}
.muted{color:hsl(var(--muted-fg))}
.dark .muted{color:hsl(215 20% 65%)}
.mono{font-family:var(--mono);font-variant-numeric:tabular-nums}
.hairline{height:3px;border-radius:99px;background:linear-gradient(90deg,hsl(var(--brand-a)),hsl(var(--brand-b)))}
.row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.eyebrow{font-size:13px;font-weight:600;color:hsl(var(--primary))}
/* --- the wider type scale this round is about --- */
.display{font-size:68px;line-height:1.02;letter-spacing:-.035em}
.display-sm{font-size:52px;line-height:1.05;letter-spacing:-.03em}
.h2{font-size:34px;line-height:1.12}
.lede{font-size:18px;line-height:1.6;color:hsl(var(--muted-fg))}
.dark .lede{color:hsl(215 20% 72%)}
/* --- browser chrome so screenshots read as product --- */
.browser{border-radius:12px;overflow:hidden;background:hsl(var(--bg));
  border:1px solid hsl(var(--border));box-shadow:var(--shadow-lift)}
.browser .bar{display:flex;align-items:center;gap:6px;padding:9px 12px;
  background:hsl(var(--muted));border-bottom:1px solid hsl(var(--border))}
.browser .bar i{width:9px;height:9px;border-radius:99px;background:hsl(var(--border));display:block}
.browser .bar span{margin-left:8px;font-family:var(--mono);font-size:10.5px;color:hsl(var(--muted-fg))}
.browser img{display:block;width:100%}
.btn{display:inline-flex;align-items:center;gap:8px;font:inherit;font-weight:600;font-size:15px;
  padding:13px 22px;border-radius:10px;border:1px solid transparent;cursor:pointer;text-decoration:none}
.btn-primary{background:hsl(var(--primary));color:hsl(var(--primary-fg))}
.btn-outline{background:transparent;border-color:hsl(var(--border));color:hsl(var(--fg))}
.dark .btn-outline{border-color:hsl(217 30% 28%);color:hsl(var(--ink-fg))}
.pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;padding:4px 11px;
  border-radius:99px;border:1px solid hsl(var(--border));background:hsl(var(--muted));color:hsl(var(--muted-fg))}
.status{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;
  padding:3px 10px;border-radius:99px;border:1px solid}
.status.live{border-color:hsl(var(--success)/.4);color:hsl(var(--success));background:hsl(var(--success)/.08)}
.status.stg{border-color:hsl(var(--border));color:hsl(var(--muted-fg));background:hsl(var(--muted))}
.dark .status.live{background:hsl(var(--success)/.14)}
.dark .status.stg{border-color:hsl(217 30% 28%);background:transparent;color:hsl(215 20% 65%)}
.metric .n{font-family:var(--mono);font-variant-numeric:tabular-nums;font-size:30px;font-weight:600;letter-spacing:-.02em}
.metric .l{font-size:12.5px;color:hsl(var(--muted-fg));margin-top:2px}
.note{font-size:12px;color:hsl(var(--muted-fg));padding:10px 14px;border-top:1px dashed hsl(var(--border));background:hsl(var(--muted)/.5)}
`;

const doc = (marker, title, body) =>
`${marker}
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>${BASE}</style>
</head><body>
${body}
</body></html>
`;

const wrap = (label, inner, note) => `<div class="doc">
  <p class="head">${label}</p>
  ${inner}
  ${note ? `<p class="note" style="margin-top:12px;border:1px dashed hsl(var(--border));border-radius:10px">${note}</p>` : ''}
</div>`;

const browser = (src, domain, style = '') =>
  `<div class="browser" style="${style}"><div class="bar"><i></i><i></i><i></i><span>${domain}</span></div><img src="${src}" alt=""></div>`;

const SYSTEMS = [
  ['01', 'E-Commerce', 'Storefront, checkout, payments, merchant marketplace', 'live'],
  ['02', 'Point of Sale', 'Branch terminals, tenders, refunds, shift close', 'live'],
  ['03', 'Inventory', 'Multi-branch stock, movements, purchase orders', 'live'],
  ['04', 'Commission & Referral', '20 pluggable plans over an append-only ledger', 'live'],
  ['05', 'Learning (LMS)', 'Courses, creators, graded tests, certificates', 'stg'],
];

const cards = [];

/* ────────────────────────── BRIEF ────────────────────────── */
cards.push({
  file: '00-brief.html', group: '00 · Brief', name: 'Design brief (Round 2)',
  subtitle: 'Portfolio ≠ product UI — read first',
  body: `<div class="doc" style="max-width:860px">
  <div class="frame pad">
    <div class="hairline" style="width:56px;margin-bottom:24px"></div>
    <p class="eyebrow">Round 2 · corrected brief</p>
    <h1 class="display-sm" style="margin:10px 0 16px">Make it confident, not calm.</h1>
    <p class="lede">Round 1 was briefed from a product design system built for an app that handles
    people's money — where the UI should <b>recede</b> so the numbers feel trustworthy. That was the
    wrong instruction for a portfolio. A portfolio has about four seconds to impress. This round
    corrects it.</p>

    <h3 style="font-size:17px;margin:30px 0 8px">What was wrong</h3>
    <ul class="muted" style="padding-left:18px;line-height:1.95">
      <li>Nine sections, one recipe: hairline → heading → subtitle → grid of bordered white cards.
      That is monotony, not minimalism.</li>
      <li>The hero described the work instead of showing it, with ~40% of the viewport empty.</li>
      <li>The best asset — real client storefronts — appeared as small cropped thumbnails.</li>
      <li>Flagship work and minor work carried nearly identical visual weight.</li>
      <li>Type compressed into a narrow 15–30px band. No scale contrast anywhere.</li>
    </ul>

    <h3 style="font-size:17px;margin:30px 0 8px">The tools this round</h3>
    <ul class="muted" style="padding-left:18px;line-height:1.95">
      <li><b>Scale.</b> A real display size (60px+) against small mono labels.</li>
      <li><b>Contrast.</b> Alternate light and full-bleed dark bands so sections stop blurring together.</li>
      <li><b>Screenshots as hero.</b> Big, browser-framed, sometimes bleeding off the edge.</li>
      <li><b>Depth.</b> Layering and a real lift shadow — not glassmorphism, which we removed on purpose.</li>
      <li><b>One accent still.</b> Restraint in colour, boldness in scale and composition.</li>
    </ul>

    <h3 style="font-size:17px;margin:30px 0 8px">Still true from Round 1</h3>
    <p class="muted">Light + dark both required. Tabular numerals on every metric. No hype, no
    countdowns, no gradient text, no generic-SaaS template feel, no return to the old terminal look.
    Honest status: some systems are in production, one is staging-only.</p>

    <h3 style="font-size:17px;margin:30px 0 8px">How to use these cards</h3>
    <p class="muted">The decisive cards ship as <b>three variants each</b> — Hero A/B/C, Systems index
    A/B/C, Case-study hero A/B/C — drawn against real screenshots. Pick a direction per card, or mix.
    Token names match <span class="mono">src/index.css</span>, so an accepted design ports straight back.</p>
  </div>
</div>`
});

/* ────────────────────────── HERO VARIANTS ────────────────────────── */
cards.push({
  file: 'sections/hero-a.html', group: '01 · Hero', name: 'Hero A — layered device stack',
  subtitle: 'Type left, overlapping browser frames right',
  body: wrap('Hero A — layered device stack', `<div class="frame pad" style="overflow:hidden">
    <div style="display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center">
      <div>
        <p class="eyebrow">Backend / Fullstack Developer · 6+ years</p>
        <h1 class="display" style="margin:14px 0 20px">I build systems where the numbers have to be right.</h1>
        <p class="lede" style="max-width:44ch">Commerce, point of sale, inventory, commissions and
        learning — running in production for six businesses.</p>
        <div class="row" style="margin-top:30px">
          <a class="btn btn-primary">View my work →</a>
          <a class="btn btn-outline">Get in touch</a>
        </div>
      </div>
      <div style="position:relative;height:360px">
        ${browser('../assets/shot-agp.webp', 'alphaglobal-prestige.com', 'position:absolute;top:0;left:0;width:96%;z-index:2')}
        ${browser('../assets/shot-successmall.webp', 'successmall.shopping', 'position:absolute;top:132px;left:16%;width:96%;z-index:1;opacity:.97')}
      </div>
    </div>
  </div>`, 'Proves the pitch immediately. The overlap adds depth without any glass or glow.')
});

cards.push({
  file: 'sections/hero-b.html', group: '01 · Hero', name: 'Hero B — editorial, screenshots bleed off',
  subtitle: 'Full-width headline, shots running off the right edge',
  body: wrap('Hero B — editorial bleed', `<div class="frame" style="overflow:hidden">
    <div style="padding:56px 56px 36px">
      <p class="eyebrow">Backend / Fullstack Developer · 6+ years</p>
      <h1 class="display" style="margin:14px 0 18px;max-width:20ch">I build systems where the numbers have to be right.</h1>
      <p class="lede" style="max-width:60ch">Commerce, point of sale, inventory, commissions and learning —
      modular systems running in production for six businesses.</p>
      <div class="row" style="margin-top:26px">
        <a class="btn btn-primary">View my work →</a>
        <a class="btn btn-outline">Get in touch</a>
      </div>
    </div>
    <div style="display:flex;gap:20px;padding:0 0 0 56px;margin-bottom:-70px">
      ${browser('../assets/shot-agp.webp', 'alphaglobal-prestige.com', 'flex:0 0 46%')}
      ${browser('../assets/shot-upmi.webp', 'ultraproactive.ph', 'flex:0 0 46%')}
      ${browser('../assets/shot-teslab.webp', 'teslabtech.com', 'flex:0 0 46%')}
    </div>
    <div style="height:80px"></div>
  </div>`, 'The row deliberately runs past the right edge — signals there is more, and fills the dead space Round 1 left.')
});

cards.push({
  file: 'sections/hero-c.html', group: '01 · Hero', name: 'Hero C — split dark',
  subtitle: 'Dark type panel, one large screenshot',
  body: wrap('Hero C — split dark', `<div class="frame dark" style="overflow:hidden">
    <div style="display:grid;grid-template-columns:.9fr 1.1fr;min-height:430px">
      <div style="padding:56px;display:flex;flex-direction:column;justify-content:center">
        <div class="hairline" style="width:48px;margin-bottom:22px"></div>
        <p class="eyebrow">Backend / Fullstack · 6+ years</p>
        <h1 class="display-sm" style="margin:14px 0 18px">I build systems where the numbers have to be right.</h1>
        <p class="lede">Six live businesses. One codebase. Commerce, POS, inventory, commissions, learning.</p>
        <div class="row" style="margin-top:28px">
          <a class="btn btn-primary">View my work →</a>
          <a class="btn btn-outline">Résumé</a>
        </div>
      </div>
      <div style="padding:44px 44px 0 0;display:flex;align-items:flex-end">
        ${browser('../assets/shot-agp.webp', 'alphaglobal-prestige.com', 'width:100%;border-bottom-left-radius:0;border-bottom-right-radius:0')}
      </div>
    </div>
  </div>`, 'Highest contrast of the three. Sets up alternating light/dark bands down the page.')
});

/* ────────────────────────── SYSTEMS INDEX VARIANTS ────────────────────────── */
const statusPill = (s) => s === 'live'
  ? '<span class="status live">Running in production</span>'
  : '<span class="status stg">Built · on staging</span>';

cards.push({
  file: 'sections/systems-a.html', group: '02 · Systems index', name: 'Systems A — numbered editorial rows',
  subtitle: 'Big type rows, number + status',
  body: wrap('Systems A — numbered rows', `<div class="frame pad">
    <div class="hairline" style="width:48px;margin-bottom:20px"></div>
    <h2 class="h2" style="margin-bottom:8px">Systems I build</h2>
    <p class="lede" style="max-width:56ch;margin-bottom:30px">Each one runs independently. Take the
    whole platform, or just the piece you need.</p>
    ${SYSTEMS.map(([n, name, desc, st]) => `
      <div style="display:grid;grid-template-columns:auto 1fr auto;gap:22px;align-items:center;
        padding:22px 0;border-top:1px solid hsl(var(--border))">
        <span class="mono muted" style="font-size:13px">${n}</span>
        <div>
          <div style="font-size:26px;font-weight:700;letter-spacing:-.025em">${name}</div>
          <p class="muted" style="font-size:14px;margin-top:3px">${desc}</p>
        </div>
        <div class="row">${statusPill(st)}<span class="muted" style="font-size:20px">→</span></div>
      </div>`).join('')}
  </div>`, 'Most distinctive option. Reads like a contents page; scale does the work, no card borders needed.')
});

cards.push({
  file: 'sections/systems-b.html', group: '02 · Systems index', name: 'Systems B — screenshot cards',
  subtitle: 'Grid of image-led cards',
  body: wrap('Systems B — screenshot cards', `<div class="frame pad">
    <div class="hairline" style="width:48px;margin-bottom:20px"></div>
    <h2 class="h2" style="margin-bottom:26px">Systems I build</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      ${SYSTEMS.map(([n, name, desc, st], i) => `
        <div style="border:1px solid hsl(var(--border));border-radius:14px;overflow:hidden;background:hsl(var(--card));box-shadow:var(--shadow-card)">
          <div style="aspect-ratio:16/10;overflow:hidden;background:hsl(var(--muted));border-bottom:1px solid hsl(var(--border))">
            <img src="../assets/${['shot-successmall', 'shot-teslab', 'shot-upmi', 'shot-agp', 'shot-school'][i]}.webp"
              style="width:100%;height:100%;object-fit:cover;object-position:top" alt="">
          </div>
          <div style="padding:16px">
            <div class="row" style="justify-content:space-between">
              <span style="font-weight:700;font-size:17px">${name}</span>
              <span class="mono muted" style="font-size:11px">${n}</span>
            </div>
            <p class="muted" style="font-size:13px;margin:6px 0 12px">${desc}</p>
            ${statusPill(st)}
          </div>
        </div>`).join('')}
    </div>
  </div>`, 'Safest and most scannable, but closest to the card-grid look Round 1 over-used. NOTE: thumbnails are placeholders — real per-system screenshots come from staging.')
});

cards.push({
  file: 'sections/systems-c.html', group: '02 · Systems index', name: 'Systems C — dark band rows',
  subtitle: 'Full-bleed dark, thumbnail per row',
  body: wrap('Systems C — dark band', `<div class="frame dark pad">
    <div class="hairline" style="width:48px;margin-bottom:20px"></div>
    <h2 class="h2" style="margin-bottom:8px">Systems I build</h2>
    <p class="lede" style="max-width:56ch;margin-bottom:26px">Independently deployable. Take one, or the whole platform.</p>
    ${SYSTEMS.map(([n, name, desc, st], i) => `
      <div style="display:grid;grid-template-columns:auto 1fr 150px auto;gap:22px;align-items:center;
        padding:18px 0;border-top:1px solid hsl(217 30% 20%)">
        <span class="mono" style="font-size:13px;color:hsl(215 20% 55%)">${n}</span>
        <div>
          <div style="font-size:23px;font-weight:700;letter-spacing:-.02em">${name}</div>
          <p class="muted" style="font-size:13.5px;margin-top:2px">${desc}</p>
        </div>
        <div style="border-radius:8px;overflow:hidden;border:1px solid hsl(217 30% 22%);aspect-ratio:16/10">
          <img src="../assets/${['shot-successmall', 'shot-teslab', 'shot-upmi', 'shot-agp', 'shot-school'][i]}.webp"
            style="width:100%;height:100%;object-fit:cover;object-position:top" alt="">
        </div>
        ${statusPill(st)}
      </div>`).join('')}
  </div>`, 'Gives the page its contrast band while still showing product. Pairs naturally with Hero A or B. NOTE: thumbnails are placeholders — real per-system screenshots come from staging.')
});

/* ────────────────────────── CASE-STUDY HERO VARIANTS ────────────────────────── */
cards.push({
  file: 'sections/case-a.html', group: '03 · Case-study hero', name: 'Case A — full-bleed with overlay',
  subtitle: 'Image first, title over it',
  body: wrap('Case A — full-bleed overlay', `<div class="frame" style="overflow:hidden;position:relative">
    <img src="../assets/shot-agp.webp" style="width:100%;display:block" alt="">
    <div style="position:absolute;inset:auto 0 0 0;padding:40px 48px;
      background:linear-gradient(transparent,hsl(var(--ink)/.92) 45%);color:hsl(var(--ink-fg))">
      <div class="row" style="margin-bottom:12px">
        <span class="status live">Running in production</span>
        <span class="pill" style="background:transparent;border-color:hsl(217 30% 32%);color:hsl(215 20% 72%)">Owner / Developer</span>
      </div>
      <h1 class="display-sm">E-Commerce</h1>
      <p class="lede" style="max-width:56ch;margin-top:8px;color:hsl(215 20% 78%)">Storefront, checkout,
      payments and a merchant marketplace — live across four client brands.</p>
    </div>
  </div>`, 'Most dramatic. Best when the screenshot is strong, as these are.')
});

cards.push({
  file: 'sections/case-b.html', group: '03 · Case-study hero', name: 'Case B — title block, oversized shot',
  subtitle: 'Metadata above, screenshot edge-to-edge below',
  body: wrap('Case B — title then shot', `<div class="frame" style="overflow:hidden">
    <div style="padding:48px 48px 32px">
      <a class="muted" style="font-size:13px;text-decoration:none">← Back to work</a>
      <div class="hairline" style="width:44px;margin:20px 0 18px"></div>
      <div class="row" style="justify-content:space-between;align-items:flex-start">
        <h1 class="display-sm">E-Commerce</h1>
        <div class="row"><span class="status live">Running in production</span></div>
      </div>
      <p class="lede" style="max-width:62ch;margin-top:12px">Storefront, checkout, payments and a
      merchant marketplace — live across four client brands.</p>
      <div class="row" style="margin-top:20px">
        ${['TypeScript', 'Fastify', 'PostgreSQL', 'Redis'].map(t => `<span class="pill mono">${t}</span>`).join('')}
      </div>
    </div>
    <img src="../assets/shot-successmall.webp" style="width:100%;display:block;border-top:1px solid hsl(var(--border))" alt="">
  </div>`, 'Clearest hierarchy — reads well and still gives the screenshot full width.')
});

cards.push({
  file: 'sections/case-c.html', group: '03 · Case-study hero', name: 'Case C — split meta / tall shot',
  subtitle: 'Facts left, screenshot right',
  body: wrap('Case C — split', `<div class="frame" style="overflow:hidden">
    <div style="display:grid;grid-template-columns:.85fr 1.15fr">
      <div style="padding:48px 40px">
        <a class="muted" style="font-size:13px;text-decoration:none">← Back</a>
        <h1 class="display-sm" style="margin:22px 0 14px">E-Commerce</h1>
        <p class="lede" style="font-size:16px">Storefront, checkout, payments and a merchant marketplace.</p>
        <div style="margin-top:26px;display:grid;gap:18px">
          <div class="metric"><div class="n">4</div><div class="l">Live client brands</div></div>
          <div class="metric"><div class="n">11</div><div class="l">Order states</div></div>
          <div class="metric"><div class="n">5</div><div class="l">Pricing dimensions</div></div>
        </div>
        <div style="margin-top:24px">${statusPill('live')}</div>
      </div>
      <div style="background:hsl(var(--muted));padding:40px 40px 0;display:flex;align-items:flex-end">
        ${browser('../assets/shot-teslab.webp', 'teslabtech.com', 'width:100%;border-bottom-left-radius:0;border-bottom-right-radius:0')}
      </div>
    </div>
  </div>`, 'Puts the numbers next to the picture. Good when metrics matter as much as the visual.')
});

/* ────────────────────────── SETTLED COMPONENTS ────────────────────────── */
const duo = (label, inner, note) => wrap(label, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <div class="frame" style="padding:28px">${inner}</div>
  <div class="frame dark" style="padding:28px">${inner}</div>
</div>`, note);

cards.push({
  file: 'components/buttons.html', group: '04 · Components', name: 'Buttons', subtitle: 'Primary · outline',
  body: duo('Buttons', `<div class="row"><a class="btn btn-primary">View my work →</a><a class="btn btn-outline">Get in touch</a></div>`)
});
cards.push({
  file: 'components/status.html', group: '04 · Components', name: 'Status & pills',
  subtitle: 'Honest per-system status',
  body: duo('Status & pills', `<div class="row" style="margin-bottom:12px">
    <span class="status live">Running in production</span><span class="status stg">Built · on staging</span></div>
    <div class="row">${['TypeScript', 'Fastify', 'PostgreSQL', 'Redis', 'React'].map(t => `<span class="pill mono">${t}</span>`).join('')}</div>`,
    'Two states only. Production carries client links; staging never claims client use.')
});
cards.push({
  file: 'components/metrics.html', group: '04 · Components', name: 'Metric row', subtitle: 'Tabular numerals',
  body: duo('Metrics', `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
    <div class="metric"><div class="n">714</div><div class="l">API endpoints</div></div>
    <div class="metric"><div class="n">162</div><div class="l">Tenant feature flags</div></div>
    <div class="metric"><div class="n">6</div><div class="l">Live businesses</div></div></div>`)
});
cards.push({
  file: 'components/nav.html', group: '04 · Components', name: 'Nav + theme toggle', subtitle: 'Slim, sticky',
  body: duo('Nav', `<div class="row" style="justify-content:space-between;flex-wrap:nowrap">
    <div class="row" style="gap:10px"><span class="hairline" style="width:20px;height:20px;border-radius:6px"></span><b>Jose Marie De Castro</b></div>
    <div class="row" style="gap:18px">
      <span class="muted" style="font-size:14px">Systems</span>
      <span class="muted" style="font-size:14px">Work</span>
      <span class="muted" style="font-size:14px">Contact</span>
      <span class="pill" style="width:30px;height:30px;justify-content:center;padding:0">☾</span></div></div>`)
});

/* ────────────────────────── WRITE ────────────────────────── */
let n = 0;
for (const c of cards) {
  const marker = `<!-- @dsCard group="${c.group}" name="${c.name}"${c.subtitle ? ` subtitle="${c.subtitle}"` : ''} -->`;
  const out = resolve(OUT, c.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, doc(marker, `${c.name} — Portfolio DS`, c.body));
  console.log('wrote', c.file);
  n++;
}
console.log(`\n${n} cards generated into ${OUT}`);
