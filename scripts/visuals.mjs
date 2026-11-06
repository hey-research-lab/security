// The security page's pictures: the hero, the numbers, how disclosure works and the hall of fame.
// Each is an SVG in a light and a dark version, in the palette of github.com/hey-research-lab, with no dependency.
// Every picture is complete at rest: animation only adds, because GitHub mobile and thumbnails may not play it,
// and it stops for readers who ask for reduced motion.

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";
export const THEMES = {
  dark: { bg: '#0B0E11', panel: '#14181D', line: '#272D35', ink: '#E9ECF0', sec: '#94A0AD', faint: '#3A424D', lime: '#C2FB03', limeSoft: 'rgba(194,251,3,0.16)', markInk: '#E9ECF0' },
  light: { bg: '#F5F6F8', panel: '#FFFFFF', line: '#DDE1E7', ink: '#0B0E11', sec: '#535B66', faint: '#C5CBD3', lime: '#4F7A00', limeSoft: 'rgba(79,122,0,0.14)', markInk: '#0B0E11' },
};
// The mark's stroke is the brand lime in both themes, as on heyresearch.xyz.
const BRAND_LIME = '#C2FB03';
const REDUCED = '@media (prefers-reduced-motion: reduce){*{animation:none!important}}';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n = (v) => v.toLocaleString('en-US');

/** Greedy word wrap to at most `max` characters a line. */
export function wrap(text, max) {
  const lines = [''];
  for (const word of String(text).split(/\s+/)) {
    const next = `${lines.at(-1)} ${word}`.trim();
    if (next.length > max && lines.at(-1)) lines.push(word);
    else lines[lines.length - 1] = next;
  }
  return lines;
}
const textLines = (lines, { x, y, step, size, fill, weight = 400, family = FONT, anchor = 'start' }) =>
  lines.map((line, i) => `<text x="${x}" y="${y + i * step}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`).join('');

/** The HEY mark (the letter He: a hooked bar and stem, and the lime stroke), drawn in a 136 x 128 box. */
function mark(x, y, height, theme) {
  const t = THEMES[theme];
  const s = (height / 128).toFixed(4);
  return `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M26 21C27 14 31 8.5 35.5 4.5C35 10.5 37.5 16.5 44 16.5L101 16.5C106.5 16.5 110.5 20.5 110.5 26L110.5 96C110.5 106 103 114 93 118.5L93.8 45L35 45C29.5 45 27.2 41.5 27 37Z" fill="${t.markInk}"/>
<path d="M49 54.5C42 57.5 34.5 62 32.5 70.5L30 118C38.5 115 46 108 46.2 98C46.4 88 43 80.5 43.2 72C43.4 64 46 58.5 49 54.5Z" fill="${BRAND_LIME}"/>
</g>`;
}

// ---------------------------------------------------------------- the hero

/** "Security in the open": the headline, the mark, and a page of code being read with one line found. */
export function hero(theme) {
  const t = THEMES[theme];
  const w = 1200, h = 340;
  // A page of code as bars, the same every time (a fixed sequence, not random).
  const widths = [62, 48, 70, 34, 56, 80, 44, 66, 58, 30];
  const indent = [0, 1, 1, 2, 2, 2, 1, 2, 1, 0];
  const px = 760, py = 44, pw = 400, rowH = 19, found = 5;
  const rows = widths.map((wd, i) => {
    const y = py + 52 + i * rowH;
    const x = px + 64 + indent[i] * 18;
    const width = (wd / 100) * (pw - 100 - indent[i] * 18);
    const lit = i === found;
    return `<text x="${px + 44}" y="${y + 4}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${t.faint}">${i + 41}</text><rect x="${x}" y="${y - 4}" width="${width.toFixed(1)}" height="8" rx="4" fill="${lit ? t.lime : t.faint}" opacity="${lit ? 1 : 0.75}"/>`;
  }).join('');
  const foundY = py + 52 + found * rowH;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Hey Research Lab security: get your code read before someone else does. Free, private-first security reviews for open-source projects on Robinhood Chain.">
<style>.scan{animation:scan 7s ease-in-out infinite}@keyframes scan{0%{transform:translateY(-${found * rowH}px);opacity:0}12%{opacity:1}60%,100%{transform:translateY(0);opacity:1}}.tag{animation:tag 7s ease-out infinite}@keyframes tag{0%,55%{opacity:0}70%,100%{opacity:1}}.cur{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}${REDUCED}</style>
<rect width="${w}" height="${h}" rx="14" fill="${t.bg}"/>
${mark(56, 44, 34, theme)}
<text x="102" y="68" font-family="${MONO}" font-size="14" letter-spacing="3" fill="${t.sec}">HEY RESEARCH LAB</text>
<text x="56" y="122" font-family="${MONO}" font-size="14" letter-spacing="3" fill="${t.lime}">SECURITY IN THE OPEN<tspan class="cur"> ▌</tspan></text>
<text x="56" y="182" font-family="${FONT}" font-size="46" font-weight="800" letter-spacing="-1.6" fill="${t.ink}">Get your code read</text>
<text x="56" y="236" font-family="${FONT}" font-size="46" font-weight="800" letter-spacing="-1.6" fill="${t.ink}">before <tspan fill="${t.lime}">someone else does.</tspan></text>
<text x="56" y="282" font-family="${FONT}" font-size="19" fill="${t.sec}">Free security reviews for open-source projects on Robinhood Chain.</text>
<text x="56" y="308" font-family="${FONT}" font-size="19" fill="${t.sec}">Reported privately first. Published with credit once it is fixed.</text>
<rect x="${px}" y="${py}" width="${pw}" height="${h - 2 * py}" rx="12" fill="${t.panel}" stroke="${t.line}"/>
<circle cx="${px + 22}" cy="${py + 22}" r="4" fill="${t.faint}"/><circle cx="${px + 36}" cy="${py + 22}" r="4" fill="${t.faint}"/><circle cx="${px + 50}" cy="${py + 22}" r="4" fill="${t.faint}"/>
<text x="${px + pw - 20}" y="${py + 26}" text-anchor="end" font-family="${MONO}" font-size="12" fill="${t.sec}">read-only · local fork</text>
<rect class="scan" x="${px + 1}" y="${foundY - 10}" width="${pw - 2}" height="19" fill="${t.limeSoft}"/>
${rows}
<g class="tag"><rect x="${px + pw - 154}" y="${foundY - 12}" width="138" height="24" rx="12" fill="${t.bg}" stroke="${t.lime}"/><text x="${px + pw - 85}" y="${foundY + 4}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${t.lime}">sent privately</text></g>
</svg>
`;
}

// ---------------------------------------------------------------- the numbers

/** Five tiles: advisories filed, accepted or published, pull requests sent, merged, teams in the hall of fame. */
// A tile's sub-line wraps at its " · " joins, so a long list of names never runs past the card (about 26 mono characters).
const subLines = (text, max = 26) => {
  const lines = [];
  for (const part of String(text).split(' · ')) {
    const last = lines.length - 1;
    if (last >= 0 && `${lines[last]} · ${part}`.length <= max) lines[last] = `${lines[last]} · ${part}`;
    else lines.push(part);
  }
  return lines.slice(0, 2);
};
export function numbers({ advisories, pulls, hallCount }, theme) {
  const t = THEMES[theme];
  const a = advisories;
  const named = a.acceptedOrPublished.named.map((p) => `${p.project} ${p.count}`);
  if (a.acceptedOrPublished.unnamed) named.push(`${a.acceptedOrPublished.unnamed} more`);
  const tiles = [
    { value: a.filed.advisories, label: `private security advisories filed on GitHub, across ${n(a.filed.projects)} projects` },
    { value: a.acceptedOrPublished.total, label: 'accepted or published by their teams', bar: [a.acceptedOrPublished.total, a.filed.advisories], sub: named.join(' · '), lit: true },
    { value: pulls.sent, label: `pull requests to ${n(pulls.repositories)} other teams’ repositories` },
    { value: pulls.merged, label: 'of those merged by their teams', bar: [pulls.merged, pulls.sent], lit: true },
    { value: hallCount, label: 'teams in the hall of fame, each fixed what we reported' },
  ];
  const w = 1200, h = 262, gap = 14, tw = (w - 48 - gap * (tiles.length - 1)) / tiles.length;
  const body = tiles.map((tile, i) => {
    const x = 24 + i * (tw + gap);
    const bar = tile.bar
      ? `<rect x="${x + 18}" y="168" width="${(tw - 36).toFixed(1)}" height="6" rx="3" fill="${t.line}"/><rect class="g" style="animation-delay:${(0.2 + i * 0.15).toFixed(2)}s" x="${x + 18}" y="168" width="${(((tw - 36) * tile.bar[0]) / tile.bar[1]).toFixed(1)}" height="6" rx="3" fill="${t.lime}"/>${subLines(tile.sub ?? `${n(tile.bar[0])} of ${n(tile.bar[1])}`).map((line, k, all) => `<text x="${x + 18}" y="${all.length > 1 ? 190 + k * 15 : 194}" font-family="${MONO}" font-size="12" fill="${t.sec}">${esc(line)}</text>`).join('')}`
      : '';
    return `<g><rect x="${x.toFixed(1)}" y="24" width="${tw.toFixed(1)}" height="${h - 72}" rx="10" fill="${t.panel}" stroke="${t.line}"/>
<text x="${(x + 18).toFixed(1)}" y="78" font-family="${FONT}" font-size="38" font-weight="700" letter-spacing="-1" fill="${tile.lit ? t.lime : t.ink}">${esc(n(tile.value))}</text>
${textLines(wrap(tile.label, 25), { x: (x + 18).toFixed(1), y: 106, step: 18, size: 14, fill: t.sec })}
${bar}</g>`;
  }).join('\n');
  const asOf = new Date(`${a.asOf}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(`${a.filed.advisories} private security advisories filed on GitHub across ${a.filed.projects} projects, ${a.acceptedOrPublished.total} accepted or published; ${pulls.sent} pull requests to ${pulls.repositories} other teams' repositories, ${pulls.merged} merged; ${hallCount} teams in the hall of fame`)}">
<style>.g{transform-box:fill-box;transform-origin:left;animation:grow 1.2s ease-out both}@keyframes grow{from{transform:scaleX(0)}}${REDUCED}</style>
<rect width="${w}" height="${h}" rx="14" fill="${t.bg}"/>
${body}
<text x="24" y="${h - 18}" font-family="${MONO}" font-size="12" fill="${t.sec}">${esc(`Advisories as of ${asOf}, counted by hand · pull requests from GitHub search, refreshed daily`)}</text>
</svg>
`;
}

// ---------------------------------------------------------------- how disclosure works

/** Four steps, then the clock: day 0, day 14, day 90, publish and credit. */
export function flow(theme) {
  const t = THEMES[theme];
  const w = 1200, h = 440;
  const steps = [
    ['Read the code', 'Public source and on-chain state, read-only. Anything we reproduce, we reproduce on a local fork.'],
    ['Report privately', 'Through the project’s own channel. With none, an issue that names no finding and only asks where to write.'],
    ['The team fixes', 'We ask for an answer within 14 days and give 90 days to fix, longer when the team is working on it.'],
    ['Publish and credit', 'A short summary once it is fixed, with credit to the team. Nothing that would help someone exploit it.'],
  ];
  const left = 40, top = 100, cw = 250, gap = 40, ch = 180;
  const cx = (i) => left + i * (cw + gap);
  const cards = steps.map(([title, body], i) => {
    const x = cx(i);
    return `<g><rect x="${x}" y="${top}" width="${cw}" height="${ch}" rx="12" fill="${t.panel}" stroke="${t.line}"/>
<text x="${x + 20}" y="${top + 34}" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.lime}">0${i + 1}</text>
<text x="${x + 20}" y="${top + 66}" font-family="${FONT}" font-size="21" font-weight="700" fill="${t.ink}">${esc(title)}</text>
${textLines(wrap(body, 30), { x: x + 20, y: top + 96, step: 20, size: 14.5, fill: t.sec })}</g>`;
  }).join('\n');
  const wires = [0, 1, 2].map((i) => {
    const x1 = cx(i) + cw + 4, x2 = cx(i + 1) - 4, y = top + ch / 2;
    return `<path class="w" style="animation-delay:${(i * 0.4).toFixed(1)}s" d="M${x1} ${y}H${x2 - 6}" stroke="${t.lime}" stroke-width="2"/><path d="M${x2 - 8} ${y - 5}L${x2} ${y}L${x2 - 8} ${y + 5}" fill="none" stroke="${t.lime}" stroke-width="2" stroke-linejoin="round"/>`;
  }).join('');
  // The clock, to scale from day 0 (the report) to day 90 (the end of the fix window).
  const ty = 344, d0 = cx(1) + cw / 2, d90 = cx(3) - 10, at = (day) => d0 + ((d90 - d0) * day) / 90, pub = cx(3) + cw / 2;
  const tick = (x, label, note, anchor) => {
    const tx = anchor === 'end' ? x + 4 : anchor === 'start' ? x - 4 : x;
    return `<line x1="${x}" x2="${x}" y1="${ty - 8}" y2="${ty + 8}" stroke="${t.ink}" stroke-width="2"/><text x="${tx}" y="${ty + 30}" text-anchor="${anchor}" font-family="${MONO}" font-size="13" font-weight="600" fill="${t.ink}">${esc(label)}</text><text x="${tx}" y="${ty + 50}" text-anchor="${anchor}" font-family="${FONT}" font-size="13" fill="${t.sec}">${esc(note)}</text>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="How disclosure works: read the code, report privately, the team fixes, publish and credit. We ask for an answer within 14 days and give 90 days to fix, longer when the team is working on it.">
<style>.w{stroke-dasharray:6 6;animation:flow 1.6s linear infinite}@keyframes flow{to{stroke-dashoffset:-24}}.dot{animation:travel 9s ease-in-out infinite}@keyframes travel{0%,8%{transform:translateX(0)}85%,100%{transform:translateX(${(pub - d0).toFixed(0)}px)}}${REDUCED}</style>
<rect width="${w}" height="${h}" rx="14" fill="${t.bg}"/>
<text x="40" y="50" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.lime}">HOW DISCLOSURE WORKS</text>
<text x="40" y="76" font-family="${FONT}" font-size="15" fill="${t.sec}">The same four steps for every project, whatever its size.</text>
${cards}
${wires}
<line x1="${cx(0) + cw / 2}" x2="${d0}" y1="${ty}" y2="${ty}" stroke="${t.faint}" stroke-width="2" stroke-dasharray="2 6"/>
<line x1="${d0}" x2="${d90}" y1="${ty}" y2="${ty}" stroke="${t.ink}" stroke-width="2"/>
<line x1="${d90}" x2="${pub}" y1="${ty}" y2="${ty}" stroke="${t.lime}" stroke-width="2" stroke-dasharray="6 6"/>
<text x="${cx(0) + cw / 2}" y="${ty + 30}" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="600" fill="${t.ink}">Reading</text>
<text x="${cx(0) + cw / 2}" y="${ty + 50}" text-anchor="middle" font-family="${FONT}" font-size="13" fill="${t.sec}">no clock yet</text>
${tick(d0, 'Day 0', 'report sent', 'end')}
${tick(at(14), 'Day 14', 'no answer: we say a report was sent', 'start')}
${tick(d90, 'Day 90', 'fix window, extendable', 'middle')}
<circle cx="${pub}" cy="${ty}" r="7" fill="${t.lime}"/>
<text x="${pub}" y="${ty + 30}" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="600" fill="${t.ink}">After the fix</text>
<text x="${pub}" y="${ty + 50}" text-anchor="middle" font-family="${FONT}" font-size="13" fill="${t.sec}">publish and credit</text>
<circle class="dot" cx="${d0}" cy="${ty}" r="5" fill="${t.lime}"/>
<text x="40" y="${h - 18}" font-family="${MONO}" font-size="12" fill="${t.sec}">If a problem is being exploited in the wild, we may shorten these steps to warn users sooner.</text>
</svg>
`;
}

// ---------------------------------------------------------------- the hall of fame

/** One row a team, in the hall of fame's order: what we reported, the severity, and how fast it was fixed. */
export function hall(teams, theme) {
  const t = THEMES[theme];
  const w = 1200, top = 128, rowH = 88;
  const h = top + teams.length * rowH + 50;
  const col = { rank: 40, team: 92, what: 340, sev: 800, time: 930 };
  const rows = teams.map((team, i) => {
    const y = top + i * rowH;
    const what = wrap(team.reported, 58).slice(0, 2);
    const time = wrap(team.timeToFix, 26).slice(0, 2);
    return `<g>
<rect x="24" y="${y}" width="${w - 48}" height="${rowH - 10}" rx="10" fill="${t.panel}" stroke="${t.line}"/>
<text x="${col.rank}" y="${y + 33}" font-family="${MONO}" font-size="13" letter-spacing="1" fill="${t.lime}">0${i + 1}</text>
<text x="${col.team}" y="${y + 34}" font-family="${FONT}" font-size="19" font-weight="700" fill="${t.ink}">${esc(team.team)}</text>
${team.product ? `<text x="${col.team}" y="${y + 56}" font-family="${MONO}" font-size="12" fill="${t.sec}">${esc(team.product)}</text>` : ''}
${textLines(what, { x: col.what, y: y + (what.length === 1 ? 44 : 33), step: 21, size: 15, fill: t.sec })}
<text x="${col.sev}" y="${y + 44}" font-family="${MONO}" font-size="13" fill="${t.sec}">${esc(team.severity)}</text>
<circle class="p" style="animation-delay:-${(i * 0.7).toFixed(1)}s" cx="${col.time - 14}" cy="${y + 28}" r="4" fill="${t.lime}"/>
${textLines(time, { x: col.time, y: y + 33, step: 19, size: 15, weight: 600, fill: t.ink })}
<text x="${col.time}" y="${y + 33 + time.length * 19}" font-family="${MONO}" font-size="12" fill="${t.sec}">${esc(team.when)}</text>
</g>`;
  }).join('\n');
  const head = (x, label) => `<text x="${x}" y="${top - 14}" font-family="${MONO}" font-size="12" letter-spacing="1.5" fill="${t.sec}">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(`Hall of fame: ${teams.map((x) => `${x.team}, ${x.timeToFix.toLowerCase()}`).join('; ')}`)}">
<style>.p{animation:pulse 3.5s ease-in-out infinite}@keyframes pulse{50%{opacity:.35}}${REDUCED}</style>
<rect width="${w}" height="${h}" rx="14" fill="${t.bg}"/>
<text x="40" y="50" font-family="${MONO}" font-size="13" letter-spacing="2" fill="${t.lime}">HALL OF FAME</text>
<text x="40" y="76" font-family="${FONT}" font-size="15" fill="${t.sec}">Teams that fixed what we reported and said so in public, the fastest first.</text>
${head(col.team, 'TEAM')}${head(col.what, 'WHAT WE REPORTED')}${head(col.sev, 'SEVERITY')}${head(col.time, 'TIME TO FIX')}
${rows}
<text x="40" y="${h - 20}" font-family="${FONT}" font-size="13" fill="${t.sec}">A listing says the team handled a report well. It is not an audit and not a statement that the code is safe.</text>
</svg>
`;
}
