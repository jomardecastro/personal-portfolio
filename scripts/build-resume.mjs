/**
 * Generates the résumé PDF from src/data/experience.ts — the same module the
 * site's Experience section renders. Run:  node scripts/build-resume.mjs
 *
 * Writes public/resume.pdf — the stable URL the site's Resume buttons link to.
 * Keep it that way: a year-stamped filename is how the published PDF silently
 * goes stale while the site stays current.
 * Node 24 strips the TypeScript types on import, so there is no build step.
 */
import { chromium } from '/home/jomar/projects/geer-school/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const { profile, roles, education, recognition, skills, yearsOfExperience } = await import(
  resolve(ROOT, 'src/data/experience.ts')
);

const YEARS = yearsOfExperience();

// Neutral framing: works whether the reader is hiring or contracting.
const SUMMARY = `Full-stack developer with ${YEARS} years building systems where the numbers have to be
right — commerce, point of sale, inventory, commissions and learning. Currently building and operating
Omni, a multi-tenant commerce platform running six live client businesses from a single codebase, with an
append-only financial ledger underneath. Comfortable owning a system end to end: schema and API through to
deployment, backups and the client conversation. Works remotely with US and PH clients.`;

const PROJECTS = [
  {
    name: 'School System — K-12 + University',
    meta: 'Lead developer · 2023 – present',
    body: 'Eight role-based React portals over one Express + Prisma API — admin, teacher, guardian PWA, RFID gate scanner, canteen POS, registrar, guidance and clinic — with two academic engines (DepEd K-12 and college) selected by institution type.',
  },
  {
    name: 'Pop Empire',
    meta: 'E-commerce · 2026',
    body: 'Collectibles store with cart, checkout and admin CMS on Express + Prisma + PostgreSQL, built around manual bank-transfer verification for markets where cards are not the norm.',
  },
  {
    name: 'Loyalty Rewards System',
    meta: 'Electron desktop · 2024',
    body: 'Points tracking, rewards redemption and customer management for an internet café, built with Electron and Node.js.',
  },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 13mm 14mm; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: Inter, sans-serif; color: #14181f; font-size: 9.6pt; line-height: 1.44; }
  a { color: inherit; text-decoration: none; }
  h1 { font-size: 21pt; font-weight: 700; letter-spacing: -0.02em; }
  .role-title { font-size: 10.4pt; font-weight: 700; }
  .contact { margin-top: 5px; font-size: 8.6pt; color: #55606f; }
  .contact span + span::before { content: "  ·  "; color: #b8c0cc; }
  h2 { font-size: 8.4pt; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase;
       color: #55606f; border-bottom: 1px solid #d8dee7; padding-bottom: 3px; margin: 15px 0 8px; }
  .sum { color: #384252; }
  .entry { margin-bottom: 10px; break-inside: avoid; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .org { font-weight: 600; color: #384252; font-size: 9.4pt; }
  .when { font-size: 8.4pt; color: #55606f; white-space: nowrap; text-align: right; }
  .desc { color: #55606f; font-style: italic; margin: 1px 0 3px; }
  ul { margin: 3px 0 0; padding-left: 13px; }
  li { margin-bottom: 2px; }
  li::marker { color: #9aa5b4; }
  .stack { margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 7.8pt; color: #55606f; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 22px; }
  .skill-row { display: grid; grid-template-columns: 118px 1fr; gap: 8px; margin-bottom: 3px; }
  .skill-label { font-weight: 600; color: #384252; }
  .skill-items { color: #55606f; }
</style></head><body>

  <header>
    <h1>${esc(profile.name)}</h1>
    <div class="contact">
      <span>${esc(profile.title)}</span><span>${esc(profile.location)}</span>
      <span>${esc(profile.email)}</span><span>${esc(profile.site)}</span><span>${esc(profile.linkedin)}</span>
    </div>
  </header>

  <h2>Summary</h2>
  <p class="sum">${esc(SUMMARY)}</p>

  <h2>Experience</h2>
  ${roles
    .map(
      (r) => `<div class="entry">
      <div class="entry-head">
        <span class="role-title">${esc(r.role)}</span>
        <span class="when">${esc(r.period)}</span>
      </div>
      <div class="entry-head">
        <span class="org">${esc(r.company)}</span>
        <span class="when">${esc(r.location)}</span>
      </div>
      ${r.description ? `<div class="desc">${esc(r.description)}</div>` : ''}
      <ul>${r.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <div class="stack">${r.techStack.map(esc).join(' · ')}</div>
    </div>`
    )
    .join('')}

  <h2>Selected Projects</h2>
  ${PROJECTS.map(
    (p) => `<div class="entry">
      <div class="entry-head">
        <span class="role-title">${esc(p.name)}</span>
        <span class="when">${esc(p.meta)}</span>
      </div>
      <div>${esc(p.body)}</div>
    </div>`
  ).join('')}

  <h2>Education &amp; Recognition</h2>
  <div class="grid2">
    <div>
      <div style="font-weight:600">${esc(education.degree)}</div>
      <div style="color:#55606f">${esc(education.school)} · ${esc(education.location)}</div>
    </div>
    <div>
      <div style="font-weight:600">${esc(recognition.title)} — ${esc(recognition.date)}</div>
      <div style="color:#55606f">${esc(recognition.org)}. ${esc(recognition.note)}</div>
    </div>
  </div>

  <h2>Skills</h2>
  ${skills
    .map(
      (g) =>
        `<div class="skill-row"><span class="skill-label">${esc(g.label)}</span><span class="skill-items">${g.items.map(esc).join(' · ')}</span></div>`
    )
    .join('')}

</body></html>`;

const debugPath = resolve(ROOT, 'scripts/.resume-preview.html');
writeFileSync(debugPath, html);

const browser = await chromium.launch({
  executablePath: '/home/jomar/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
});
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const out = resolve(ROOT, 'public/resume.pdf');
await page.pdf({ path: out, format: 'A4', printBackground: true });

const pages = await page.evaluate(
  () => Math.ceil(document.body.scrollHeight / (297 * 3.7795 - 2 * 13 * 3.7795))
);
await browser.close();

console.log(`wrote ${out}`);
console.log(`  roles: ${roles.length} · projects: ${PROJECTS.length} · years: ${YEARS} · ~${pages} page(s)`);
console.log(`  html preview: ${debugPath}`);
